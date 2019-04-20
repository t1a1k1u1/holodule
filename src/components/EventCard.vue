<template>
  <div class="card" :style="cardColor">
    <div class="time">
      <span>{{ timeStr }} ~</span>
    </div>
    <div class="channel-list">
      <div
        class="channel"
        v-for="channel in channels"
        :key="channel.nameEn"
      >
        <div class="mark">{{ channel.mark }}</div>
        <div class="label">{{ channel.nameJa }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

interface Channel {
  nameJa: string;
  nameEn: string;
  color: string;
  mark: string;
}

@Component
export default class EventCard extends Vue {
  @Prop() private timeStr!: string;
  @Prop() private channels!: Channel[];

  get cardColor(): object {
    return {backgroundColor: this.channels[0].color};
  }
}
</script>

<style lang="scss" scoped>
.card {
  flex-grow: 1;
  align-self: stretch;
  border-radius: 8px;
  margin: 0 2px;

  .time {
    text-align: left;

    >span {
      border-radius: 8px;
      background-color: rgba(white, 0.5);
      padding: 0 4px;
      margin: 0 4px;
      font-size: 12px;
    }
  }

  .channel-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;

    .channel {
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: rgba(white, 0.5);
      border-radius: 32px;
      margin: 4px;
      width: 64px;
      height: 64px;

      .mark {
        position: absolute;
        font-size: 40px;
        opacity: 0.2;
        filter: grayscale(100%);
      }

      .label {
        position: absolute;
        font-size: 12px;
        font-weight: bold;
      }
    }
  }
}
</style>
