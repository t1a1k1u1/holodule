<template>
  <div class="home">
    <div v-for="(line, index) in timeLine" :key="index">
      <div class="time">{{ line.time }}</div>
      <div v-for="(live, index) in line.lives" :key="index" class="live">{{ live }}</div>
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
    this.$store.dispatch('fetchSchedule');
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
        time: time.format('MM/DD HH:mm:ss'),
        lives: filter(this.schedule, (live) => {
          return (time.unix() <= live.start_at.seconds)
            && (live.start_at.seconds < time.clone().add(1, 'hour').unix());
        }),
      };
    });
  }
}
</script>

<style lang="scss" scoped>
.line {
  border-bottom: 2px;
}
</style>
