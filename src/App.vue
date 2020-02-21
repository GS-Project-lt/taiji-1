<template>
  <div id="app">
    <div class="app-container">
    <router-view/>
    </div>
    <div class="show-home-back animated" v-show="showHomeBack" :class="{'fadeInRight': showHomeBack, 'fadeOutRight': !showHomeBack}" @click="toHome">
      <img src="@/assets/img/tab/1-1.png" alt="">
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    computed:{
      ...mapGetters(['showHomeBack'])
    },
    created() {

    },
    mounted(){

    },
    methods:{
      toHome(){
        this.$router.push('/home')
      }
    }
  }
</script>

<style lang="scss" type="text/scss">

  @import "assets/css/animate.css";

body{
  margin: 0;
}
#app {
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;

  .app-container{
    max-width: 750px;
    width: 100%;
  }
}

  .show-home-back{
    position: fixed;
    right: .3rem;
    bottom: 1.4rem;
    width: .8rem;
    height: .8rem;
    background-color: white;
    -webkit-border-radius: 100%;
    -moz-border-radius: 100%;
    border-radius: 100%;
    -webkit-box-shadow: 0 0 4px 0 #000;
    -moz-box-shadow: 0 0 4px 0 #000;
    box-shadow: 0 0 4px 0 #000;
    z-index: 9999999;
    img{
      position: absolute;
      top: 50%;
      left: 50%;
      margin-top: -.2rem;
      margin-left: -.2rem;
      width: .4rem;
      height: .4rem;
    }
  }

</style>
