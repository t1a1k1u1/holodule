<template>
  <div class="home">
    <div class="section" v-for="(section, index) in timeLine" :key="index">
      <div class="date" v-if="index === 0 || isStartOfDay(section.time)">
        {{ toDateStr(section.time) }}
      </div>
      <div class="time">
        <div class="at">
          {{ toTimeStr(section.time) }}
        </div>
        <div class="event-list">
          <event-card
            v-for     = "(event, index) in section.events"
            :key      = "index"
            :timeStr  = "toTimeStr(event.startAt)"
            :channels = "event.channels"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import EventCard from '@/components/EventCard.vue';
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
}

@Component({
  components: {
    EventCard,
  },
})
export default class Home extends Vue {
  private now: Moment = moment();

  private created(): void {
    this.now = moment().subtract(6, 'hour');
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
}
</script>

<style lang="scss" scoped>
.home {
  margin-top: 64px;
}

.section {
  .date {
    display: block;
    background-color: gainsboro;
    border-radius: 8px;
    margin: 16px 0;
    padding: 8px 0;
    font-size: 20px;
  }

  .time {
    display: flex;
    height: 100px;

    .at {
      display: block;
      position: relative;
      top: -0.5em;
      margin: 0 4px;
    }

    .event-list {
      display: flex;
      border-top: solid 2px gray;
      width: 100%;
      padding: 2px 0px;
    }
  }
}
</style>
