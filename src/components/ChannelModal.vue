<template>
  <v-card v-if="!!channel">
    <v-img :src="banner"></v-img>
    <v-card-text>
      <span class="title">{{ channel.nameJa }}<br></span>
      <span>{{ channel.description }}<span class="caption">[1]</span><br></span>
      <v-layout justify-end>
        <span class="caption">[1] <a href="https://www.hololive.tv/member">ホロライブ公式</a></span>
      </v-layout>
    </v-card-text>

    <v-divider></v-divider>
    <v-card-actions>
      <v-layout align-center justify-end>
        <v-btn
          flat
          color="blue lighten-2"
          :href="channel.twitterUrl"
          :disabled="!channel.twitterUrl"
        >
          Twitter
        </v-btn>
        <v-btn
          flat
          color="red"
          :href="channel.youtubeUrl"
          :disabled="!channel.youtubeUrl"
        >
          YouTube
        </v-btn>
        <v-btn
          flat
          color="blue lighten-2"
          :href="channel.bilibiliUrl"
          :disabled="!channel.bilibiliUrl"
        >
          bilibili
        </v-btn>
      </v-layout>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Channel } from '@/interfaces';

@Component
export default class EventCard extends Vue {
  @Prop() private channel!: Channel;

  get banner(): string {
    return require(`@/assets/img/banner/${ this.channel.nameEn }.jpg`);
  }
}
</script>

<style lang="scss" scoped>

</style>
