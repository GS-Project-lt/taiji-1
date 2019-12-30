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
  wxUserInfo(store);
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
