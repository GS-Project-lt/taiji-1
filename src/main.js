import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import wxSDK from "@/utils/wx";
import '@/assets/js/rem'
// import '@/assets/css/var.scss'
import { toast, notify} from '@/utils/interaction'
import { wxinit,wxUserInfo } from '@/api/wx.js'
import wx from 'weixin-js-sdk'
import { getUserInfo } from './api/user'
import {Dialog} from 'vant'

Vue.config.productionTip = false

Vue.prototype.$v_notify = notify;
Vue.prototype.$v_toast = toast;
Vue.prototype.$wx = wx;


let notShowBackHomeRouters = ['/home','/activity','/me']

// 在页面加载时读取sessionStorage
if (sessionStorage.getItem('store')) {
  store.replaceState(Object.assign({}, store.state, JSON.parse(sessionStorage.getItem('store'))))
  setTimeout( () => {
    if (notShowBackHomeRouters.indexOf(router.history.current.path) < 0) {
      store.commit('SET_SHOWBACKHOME', true)
    }
  },2000)
}
// 在页面刷新时将store保存到sessionStorage里
window.addEventListener('beforeunload', () => {
  sessionStorage.setItem('store', JSON.stringify(store.state))
})

wxinit(store);

store.commit('SET_SHOWBACKHOME', false)

let t1 = 0;
let t2 = 0;
let timer = null; // 定时器

// scroll监听
document.onscroll = function() {
  clearTimeout(timer);
  timer = setTimeout(isScrollEnd, 500);
  t1 = document.documentElement.scrollTop || document.body.scrollTop;
  if (store.state.showHomeBack){
    store.commit('SET_SHOWBACKHOME', false)
  }
}

function isScrollEnd() {
  t2 = document.documentElement.scrollTop || document.body.scrollTop;
  console.log('-----',router.history.current.path)
  if(t2 == t1 && notShowBackHomeRouters.indexOf(router.history.current.path) < 0 ){
    store.commit('SET_SHOWBACKHOME', true)
  }
}

if (!store.state.wxUserInfo){
  wxUserInfo().then(res => {
    if (res.code == 10001) {
      store.commit('SET_WX_USERINFO',  res.data);
      if (parseInt(res.data.subscribe) == 0){
        Dialog.confirm({
          title: '温馨提示',
          message :"您还未关注太极群公众号，请前往关注，体验更多精彩内容"
        }).then(() => {
          router.push('/us/focus');
        }).catch(() => {
        
        })
      }
    }
  });
}

new Vue({
  router,
  store,
  watch: {
    $route() {
      let s = {
        title: '青甫太极',
        desc: '青甫太极 —— 太极爱好者聚集地',
        link: window.location.origin + window.location.pathname + window.location.hash,
        imgUrl: 'https://api.zuxun.net/logo.jpg'
      }
      store.commit('SET_SHOWBACKHOME', false)

      wxSDK.share(s)
    }
  },
  render: h => h(App)
}).$mount('#app')
