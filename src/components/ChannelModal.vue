<template>
  <v-card>
    <v-img :src="channel.bannerUrl">
    </v-img>
    <v-card-title>{{ channel.nameJa }}</v-card-title>
    <v-card-text><span>{{ channel.description }}</span></v-card-text>

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

interface Channel {
  nameJa: string;
  nameEn: string;
  color: string;
  mark: string;
  id: string;
  description: string;
  thumbnailUrl: string;
  bannerUrl: string;
  twitterUrl: string;
  youtubeUrl: string;
  bilibiliUrl: string;
}

@Component
export default class EventCard extends Vue {
  @Prop() private channel!: Channel;
}
</script>

<style lang="scss" scoped>

</style>
