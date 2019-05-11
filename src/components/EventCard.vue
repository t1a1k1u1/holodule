<template>
  <v-layout
    class="card-event"
    row
    align-end
    justify-center
    :style="cardColor"
  >
    <span class="time caption">{{ timeStr }} ~ </span>
    <img
      class="img"
      v-for="channel in channels"
      :key="channel.nameEn"
      :src="channelImg(channel)"
    />
  </v-layout>
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

  private channelImg(channel: Channel): string {
    return require(`@/assets/channel/up/${channel.nameEn}.png`);
  }

  private clickChannel(channel: Channel): void {
    this.$emit('clickChannel', channel);
  }
}
</script>

<style lang="scss" scoped>
.card-event {
  position: relative;
  border-radius: 4px;
  min-height: 72px;
  margin: 4px;

  .time {
    position: absolute;
    background-color: rgba(white, 0.5);
    border-radius: 4px;
    padding: 0 4px;
    top: 2px;
    left: 2px;
  }

  .img {
    width: 60px;
    height: 72px;
  }
}
</style>
