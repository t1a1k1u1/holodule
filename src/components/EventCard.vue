<template>
  <div class="card" :style="cardColor">
    <div class="time">{{ timeStr }}</div>
    <div
      class="channel"
      v-for="channel in channels"
      :key="channel.nameEn"
    >
      {{ channel.nameJa }}{{ channel.mark }}
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
    position: absolute;
    background: rgba(white, 0.5);
    border-radius: 8px;
    margin: 4px;
    padding: 0 4px;
    font-size: 12px;
  }
}
</style>
