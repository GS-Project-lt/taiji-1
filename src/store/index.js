import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)


/*
wxUserInfo
subscribe: 1
openid: "oMpVY1ZdN1Gm82MAQF7k5cuG0Y48"
nickname: "吕涛"
sex: 1
language: "zh_CN"
city: ""
province: ""
country: "埃及"
headimgurl: "http://thirdwx.qlogo.cn/mmopen/GuLHNQzrMkIl3kDacrj7nYMJ4UAiag7O5NONNkibROEVwTVYEEpyd4USmoperBmMIdkItqfhenje9Z1oziaFibsiby6JbTH9bB9Oia/132"
subscribe_time: 1573308215
remark: ""
groupid: 0
tagid_list: []
subscribe_scene: "ADD_SCENE_QR_CODE"
qr_scene: 0
qr_scene_str: ""
user_info: null
token: ""
*/

export default new Vuex.Store({
  state: {
    location: {
      lat: '',
      lon: ''
    },
    siteMember: {},
    userInfo: null,
    wxUserInfo: null,
    ticket: '',
    token: '',
    shareData:{
      title: '青甫太极',
      desc: '青甫太极 —— 太极爱好者聚集地',
      link: window.location.origin + window.location.pathname + window.location.hash,
      imgUrl: 'https://api.zuxun.net/logo.jpg'
    },
    showHomeBack: false
  },
  mutations: {
    // 设置位置
    SET_LOCATION: (state, location) => {
      state.location = location;
    },

    SET_TICKET: (state, ticket) => {
      console.log('ticket', ticket);
      state.ticket = ticket;
    },

    SET_SITE_MEMBER: (state, member) => {
      state.siteMember = member;
    },

    SET_USER_INFO: (state, userinfo) => {
      state.userInfo = userinfo;
      if (userinfo.token){
        state.token = userinfo.token;
        localStorage.setItem('token',userinfo.token);
      }else{
        localStorage.removeItem('token');
      }
    },

    SET_WX_USERINFO: (state, userinfo) => {
      state.wxUserInfo = userinfo;
      if (userinfo.user_info){
        state.userInfo = userinfo.user_info;
      }else{
        state.userInfo = {
          open_id: userinfo.openid,
          user_name:userinfo.nickname,
          user_photo: userinfo.headimgurl,
          user_sex: userinfo.sex,
          add_date: "",
          amount: 0,
          auditing: "0",
          content: '',
          create_time: "",
          phone: "",
          remark: "",
          role_id: "",
          train_id: "0",
          user_birth: "",
          user_education: "",
          user_position: "",
          user_work: ""
        }
      }
      if (userinfo.token){
        state.token = userinfo.token;
        localStorage.setItem('token',userinfo.token);
      }else{
        localStorage.removeItem('token');
      }
    },

    SET_SHOWBACKHOME: (state, isshow) => {
      state.showHomeBack = isshow;
    }

  },
  getters: {
    location: state => state.location,
    siteMember: state => state.siteMember,
    userInfo: state => state.userInfo,
    wxUserInfo: state => state.wxUserInfo,
    token: state => state.token,
    shareData: state => state.shareData,
    showHomeBack: state => state.showHomeBack
  },
  // actions: {
  // },
  // modules: {
  // }
})
