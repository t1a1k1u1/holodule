<template>
  <v-layout
    class="card-event"
    row
    align-center
    justify-center
    :style="cardColor"
  >
    <span class="time caption">{{ timeStr }} ~ </span>

    <div
      class="channel"
      v-for="channel in channels"
      :key="channel.nameEn"
      @click="clickChannel(channel)"
    >
      <v-layout align-center justify-center column>
        <img class="img" :src="thumbnail(channel)" />
        <span>{{ channel.nameJa }}</span>
      </v-layout>
    </div>
  </v-layout>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Channel } from '@/interfaces';

@Component
export default class EventCard extends Vue {
  @Prop() private timeStr!: string;
  @Prop() private channels!: Channel[];

  get cardColor(): object {
    return {backgroundColor: this.channels[0].color};
  }

  private clickChannel(channel: Channel): void {
    this.$emit('clickChannel', channel);
  }

  private thumbnail(channel: Channel): string {
    return require(`@/assets/img/thumbnail/${ channel.nameEn }.jpg`);
  }
}
</script>

<style lang="scss" scoped>
$icon-size: 64px;
$card-height: 100px;

.card-event {
  position: relative;
  border-radius: 4px;
  min-height: $card-height;
  margin: 4px;

  .time {
    position: absolute;
    background-color: rgba(white, 0.5);
    border-radius: 4px;
    padding: 0 4px;
    top: 2px;
    left: 2px;
  }

  .channel {
    margin: 4px;

    .img {
      width: $icon-size;
      height: $icon-size;
      border-radius: $icon-size/2;
      margin-bottom: 4px;
    }
  }
}
</style>
