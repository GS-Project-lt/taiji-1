import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
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



// 在页面加载时读取sessionStorage
if (sessionStorage.getItem('store')) {
  store.replaceState(Object.assign({}, store.state, JSON.parse(sessionStorage.getItem('store'))))
}
// 在页面刷新时将store保存到sessionStorage里
window.addEventListener('beforeunload', () => {
  sessionStorage.setItem('store', JSON.stringify(store.state))
})

wxinit(store);


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
  }); ;
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
