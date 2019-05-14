<template>
  <div id="app">
    <v-app>
      <v-toolbar class="white--text" fixed color="blue">
        <v-toolbar-title>ほろじゅーる！</v-toolbar-title>
      </v-toolbar>

      <router-view/>
    </v-app>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
})
export default class App extends Vue {
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 64px;
}
</style>
