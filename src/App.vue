<template>
  <div id="app">
    <div class="nav">ほろじゅーる！</div>
    <router-view/>
  </div>
</template>

<style lang="scss">

.nav {
  display: flex;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  background-color: royalblue;
  color: white;
  font-size: 20px;
  width: 100%;
  height: 48px;
  padding: 0 8px;
  z-index: 1;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
