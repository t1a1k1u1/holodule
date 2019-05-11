<template>
  <v-card>
    <v-card-title>{{ channel.nameJa }}</v-card-title>
    <v-card-title>{{ channel.nameJa }}のチャンネルです</v-card-title>
  </v-card>
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
  @Prop() private channel!: Channel;
}
</script>

<style lang="scss" scoped>

</style>
