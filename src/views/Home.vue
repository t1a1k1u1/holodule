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
            v-for     = "(event, index) in section.events"
            :key      = "index"
            :timeStr  = "toTimeStr(event.startAt)"
            :channels = "event.channels"
            @clickChannel = "clickChannel"
          />
        </v-layout>
      </div>
    </v-layout>

    <v-dialog v-model="visibleDialog">
      <channel-modal :channel="selectChannel" />
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import EventCard from '@/components/EventCard.vue';
import ChannelModal from '@/components/ChannelModal.vue';
import { Component, Vue } from 'vue-property-decorator';
import { map, find, filter } from 'lodash';
import { Moment } from 'moment';
const moment = require('moment');

interface Schedule {
  start_at: any;
  channels: object[];
}

interface Channel {
  nameJa: string;
  nameEn: string;
  color: string;
  mark: string;
  id: string;
  description: string;
  thumbnailUrl: string;
  bannerUrl: string;
}

@Component({
  components: {
    EventCard,
    ChannelModal,
  },
})
export default class Home extends Vue {
  private now!: Moment;
  private visibleDialog: boolean = false;
  private selectChannel!: Channel;

  private created(): void {
    this.now = moment();
    this.$store.dispatch('fetchSchedule', this.now.clone().subtract(1, 'hour'));
  }

  get channels(): Channel[] {
    return this.$store.state.channels;
  }

  get schedule(): Schedule[] {
    return this.$store.state.schedule;
  }

  get times(): Moment[] {
    const startOfHour = moment(this.now).startOf('hour');
    return map([...Array(24).keys()], (hour) => {
      return startOfHour.clone().add(hour, 'hour');
    });
  }

  get timeLine(): object[] {
    return map(this.times, (time) => {
      const events = filter(this.schedule, (event) => {
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

  private isStartOfDay(time: Moment): boolean {
    return time.unix() === time.clone().startOf('day').unix();
  }

  private toDateStr(time: Moment): string {
    return time.format('MM月DD日');
  }

  private toTimeStr(time: Moment): string {
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
