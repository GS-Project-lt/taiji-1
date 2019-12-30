<template>
  <div>
    <!-- <van-nav-bar
      title="标题"
      left-text="返回"
      right-text="按钮"
      left-arrow
      fixed
      @click-left="onClickLeft"
      @click-right="onClickRight"
    /> -->
    <div>
    <router-view />
    </div>
    <van-tabbar route active-color="#6BBB19" inactive-color="#999999">
      <van-tabbar-item replace to="/home">
        <span>首页</span>
        <img
          slot="icon"
          slot-scope="props"
          v-if="props.active"
          src="@/assets/img/tab/1-1.png"/>
        <img
          slot="icon"
          v-else
          src="@/assets/img/tab/1-0.png"/>
      </van-tabbar-item>
      <van-tabbar-item replace to="/activity">
        <span>活动</span>
        <img
          slot="icon"
          slot-scope="props"
          v-if="props.active"
          src="@/assets/img/tab/2-1.png"/>
        <img
          slot="icon"
          v-else
          src="@/assets/img/tab/2-0.png"/>
      </van-tabbar-item>
      <van-tabbar-item replace to="/mine">
        <span>我的</span>
        <img
          slot="icon"
          slot-scope="props"
          v-if="props.active"
          src="@/assets/img/tab/3-1.png"/>
        <img
          slot="icon"
          v-else
          src="@/assets/img/tab/3-2.png"/>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import { Tabbar, TabbarItem ,NavBar} from "vant";

export default {
  components: {
    [Tabbar.name]: Tabbar,
    [TabbarItem.name]: TabbarItem,
    [NavBar.name]: NavBar
  },
  data() {
    return {
        homeicon: {
            active: '@/assets/img/tab/1-1.png',
            default: '@/assets/img/tab/1-0.png'
        },
        activityicon: {
            active: '',
            default: ''
        },
        mineicon: {
            active: '',
            default: ''
        }
    };
  }
};
</script>
