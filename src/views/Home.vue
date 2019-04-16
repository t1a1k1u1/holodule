<template>
  <div class="home">
    <div class="time-section" v-for="(line, index) in timeLine" :key="index">
      <div class="section-date" v-if="index === 0 || isStartOfDay(line.time)">{{ toDateStr(line.time.unix()) }}</div>
      <div class="section-time">
        <div class="time">{{ toTimeStr(line.time.unix()) }}</div>
        <div class="live-list">
          <div class="live" v-for="(live, index) in line.lives" :key="index" :style="bgColor(live.channels)">
            <div class="live-time">{{ toTimeStr(live.start_at.seconds) }}</div>
            <div class="channel-list">
              <div class="channel" v-for="(channel, index) in live.channels" :key="index">
                <img class="channel-image" :src="channelImage(channel)">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { map, find, filter } from 'lodash';
import * as Moment from 'moment';
const moment = require('moment');

interface Schedule {
  start_at: any,
  channels: object[]
}

interface Channel {
  nameJa: string,
  nameEn: string,
  color: string,
}

@Component({
  components: {
  },
})
export default class Home extends Vue {
  private now: Moment.Moment = moment();

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

  get times(): Moment.Moment[] {
    const startOfHour = moment(this.now).startOf('hour');
    return map([...Array(24).keys()], (hour) => {
      return startOfHour.clone().add(hour, 'hour');
    });
  }

  get timeLine(): object[] {
    return map(this.times, (time) => {
      return {
        time,
        lives: filter(this.schedule, (live) => {
          return (time.unix() <= live.start_at.seconds)
            && (live.start_at.seconds < time.clone().add(1, 'hour').unix());
        }),
      };
    });
  }

  private isStartOfDay(time: Moment.Moment): boolean {
    return time.unix() === time.clone().startOf('day').unix();
  }

  private toDateTimeStr(time: Moment.Moment): string {
    return time.format('MM/DD HH:mm');
  }

  private toDateStr(time: string): string {
    return moment.unix(time).format('MM月DD日');
  }

  private toTimeStr(time: string): string {
    return moment.unix(time).format('HH:mm');
  }

  private bgColor(channels: string[]): object {
    const channel = find(this.channels, {nameJa: channels[0]});
    if (!channel) {
      return { backgroundColor: '#F0F8FF' };
    } else {
      return { backgroundColor: channel.color };
    }
  }

  private channelImage(nameJa: string): string {
    const channel = find(this.channels, {nameJa});
    if (!channel) {
      return require('@/assets/aqua.png');
    } else {
      return require(`@/assets/${ channel.nameEn }.png`);
    }
  }
}
</script>

<style lang="scss" scoped>
.home {
  margin-top: 64px;
}

.time-section {
  .section-date {
    display: block;
    background-color: gainsboro;
    border-radius: 8px;
    margin: 16px 0;
    padding: 8px 0;
    font-size: 20px;
  }

  .section-time {
    display: flex;
    height: 100px;

    .time {
      display: block;
      position: relative;
      top: -0.5em;
      margin: 0 4px;
    }

    .live-list {
      display: flex;
      align-items: center;
      border-top: solid 2px gray;
      width: 100%;
      padding: 2px 0px;

      .live {
        display: block;
        position: relative;
        background-color: aliceblue;
        border-radius: 12px;
        width: 100%;
        height: 100%;
        margin: 4px;

        .live-time {
          position: absolute;
          background: rgba(white, 0.5);
          border-radius: 8px;
          top: 4px;
          left: 4px;
          padding: 2px 8px;
          font-size: 8px;
        }

        .channel-list {
          display: flex;
          justify-content: center;
          height: inherit;

          .channel {
            display: inline-block;
            height: inherit;

            .channel-image {
              height: inherit;
              width: auto;
            }
          }
        }
      }
    }
  }
}
</style>
