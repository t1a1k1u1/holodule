<template>
  <div class="home">
    <div class="time-section" v-for="(line, index) in timeLine" :key="index">
      <div class="datetime">{{ toDateTimeStr(line.time) }}</div>
      <div class="live-list">
        <div class="live" v-for="(live, index) in line.lives" :key="index" :style="bgColor(live.channels)">
          <div class="time">{{ toTimeStr(live.start_at.seconds) }} ~</div>
          <div class="channel" v-for="(channel, index) in live.channels" :key="index">{{ channel }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { map, filter } from 'lodash';
import * as Moment from 'moment';
const moment = require('moment');

interface Schedule {
  start_at: any,
  channels: object[],
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
        time: time,
        lives: filter(this.schedule, (live) => {
          return (time.unix() <= live.start_at.seconds)
            && (live.start_at.seconds < time.clone().add(1, 'hour').unix());
        }),
      };
    });
  }

  toDateTimeStr(time: Moment.Moment): string {
    return time.format('MM/DD HH:mm');
  }

  toTimeStr(time: string): string {
    return moment.unix(time).format('HH:mm');
  }

  bgColor(channels: string[]): object {
    if (channels.length !== 1) {
      return { backgroundColor: '#F0F8FF' };
    } else {
      switch (channels[0]) {
        case '赤井はあと': return { backgroundColor: '#FF6347' }; // tomato
        case 'アキロゼ':   return { backgroundColor: '#87CEFA' }; // lightskyblue
        case '戌神ころね': return { backgroundColor: '#F0E68C' }; // khaki
        case '大神ミオ':   return { backgroundColor: '#32CD32' }; // limegreen
        case '大空スバル': return { backgroundColor: '#ADFF2F' }; // greenyellow
        case 'さくらみこ': return { backgroundColor: '#F08080' }; // lightcoral
        case '白上フブキ': return { backgroundColor: '#C0C0C0' }; // silver
        case 'ときのそら': return { backgroundColor: '#4169E1' }; // royalblue
        case '百鬼あやめ': return { backgroundColor: '#FF7F50' }; // coral
        case '夏色まつり': return { backgroundColor: '#FFA500' }; // orange
        case '猫又おかゆ': return { backgroundColor: '#E6E6FA' }; // lavender
        case '湊あくあ':   return { backgroundColor: '#EE82EE' }; // violet
        case '紫咲シオン': return { backgroundColor: '#9932CC' }; // darkorchid
        case '癒月ちょこ': return { backgroundColor: '#FF69B4' }; // hotpink
        case '夜空メル':   return { backgroundColor: '#FFD700' }; // gold
        case 'ロボ子さん': return { backgroundColor: '#808080' }; // gray
        default: return { backgroundColor: '#F0F8FF' };
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.time-section {
  display: flex;
  height: 64px;

  .datetime {
    display: block;
    width: 120px;
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

      .time {
        position: absolute;
        background-color: white;
        border-radius: 60px;
        top: 4px;
        left: 4px;
        padding: 2px 8px;
      }

      .channel {
        display: inline-block;
        position: absolute;
        bottom: 0;
      }
    }
  }
}
</style>
