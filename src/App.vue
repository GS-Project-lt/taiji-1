<template>
  <div id="app">
    <div class="app-container">
    <router-view/>
    </div>
  </div>
</template>

<style lang="scss">

body{
  margin: 0;
}
#app {
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;

  .app-container{
    max-width: 500px;
    width: 100%;
  }
}

</style>
