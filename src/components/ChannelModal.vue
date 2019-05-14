<template>
  <v-card>
    <v-img :src="channel.bannerUrl">
    </v-img>
    <v-card-title>{{ channel.nameJa }}</v-card-title>
    <v-card-text><span>{{ channel.description }}</span></v-card-text>
    <v-card-actions>
      <v-btn
        small
        class="text-none white--text"
        color="blue lighten-2"
        :href="channel.twitterUrl"
        :disabled="!channel.twitterUrl"
      >
        <v-icon>mdi-twitter</v-icon>
        <span>Twitter</span>
      </v-btn>
      <v-btn
        small
        class="text-none white--text"
        color="red"
        :href="channel.youtubeUrl"
        :disabled="!channel.youtubeUrl"
      >
        <v-icon>mdi-youtube</v-icon>
        <span>YouTube</span>
      </v-btn>
      <v-btn
        small
        class="text-none white--text"
        color="blue lighten-2"
        :href="channel.bilibiliUrl"
        :disabled="!channel.bilibiliUrl"
      >
        <v-icon>mdi-twitter</v-icon>
        <span>bilibili</span>
      </v-btn>
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
