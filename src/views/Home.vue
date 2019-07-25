<template>
  <v-container fluid>
    <v-layout column v-for="(section, index) in timeLine" :key="index">
      <div class="card-date text-xs-center" v-if="index === 0 || isStartOfDay(section.time)">
        <span class="title">{{ toDateStr(section.time) }}</span>
      </div>
      <div class="section">
        <span>{{ toTimeStr(section.time) }}</span>
        <v-divider></v-divider>
        <v-layout row wrap>
          <event-card
            v-for="(event, index) in section.events"
            :key="index"
            :timeStr="toTimeStr(event.startAt)"
            :channels="event.channels"
            @clickChannel="clickChannel"
          />
        </v-layout>
      </div>
    </v-layout>

    <v-dialog v-model="visibleDialog" max-width="1060px">
      <channel-modal :channel="selectChannel" />
    </v-dialog>

    <v-dialog v-model="isLoading" width="300" persistent>
      <loading-modal />
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import EventCard from '@/components/EventCard.vue';
import ChannelModal from '@/components/ChannelModal.vue';
import LoadingModal from '@/components/LoadingModal.vue';
import { Channel, Event } from '@/interfaces';
import { Component, Vue } from 'vue-property-decorator';
import { map, find, filter } from 'lodash';
import * as moment from 'moment-timezone';

@Component({
  components: {
    EventCard,
    ChannelModal,
    LoadingModal,
  },
})
export default class Home extends Vue {
  private isLoading: boolean = false;
  private visibleDialog: boolean = false;
  private selectChannel!: Channel;

  private async created(): Promise<void> {
    this.isLoading = true;
    this.$store.dispatch('initState');
    await this.$store.dispatch('searchEvent', this.$store.state.criterionTime);
    this.selectChannel = this.$store.state.channels[0];
    this.isLoading = false;
  }

  get channels(): Channel[] {
    return this.$store.state.channels;
  }

  get events(): Event[] {
    return this.$store.state.events;
  }

  get criterionTime(): moment.Moment {
    return this.$store.state.criterionTime;
  }

  get times(): moment.Moment[] {
    return map([...Array(24).keys()], (hour) => {
      return this.criterionTime.clone().add(hour, 'hour');
    });
  }

  get timeLine(): object[] {
    return map(this.times, (time) => {
      const events = filter(this.events, (event) => {
        return (time.unix() <= event.start_at.seconds)
          && (event.start_at.seconds < time.clone().add(1, 'hour').unix());
      });
      return {
        time,
        events: map(events, (event) => {
          return {
            startAt: moment.unix(event.start_at.seconds),
            channels: map(event.channels, (channel) => {
              return find(this.channels, {nameJa: channel});
            }),
          };
        }),
      };
    });
  }

  private isStartOfDay(time: moment.Moment): boolean {
    return time.unix() === time.clone().startOf('day').unix();
  }

  private toDateStr(time: moment.Moment): string {
    return time.format('MM月DD日');
  }

  private toTimeStr(time: moment.Moment): string {
    return time.format('HH:mm');
  }

  private clickChannel(channel: Channel): void {
    this.selectChannel = channel;
    this.visibleDialog = true;
  }
}
</script>

<style lang="scss" scoped>
.card-date {
  background-color: #CFD8DC;
  border-radius: 4px;
  padding: 8px;
}

.section {
  margin: 8px 0;
}
</style>
