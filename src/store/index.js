import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    location: {
      lat: '',
      lon: ''
    },
    siteMember: {},
    userInfo: {}
  },
  mutations: {
    // 设置位置
    SET_LOCATION: (state, location) => {
      state.location = location;
    },

    SET_SITE_MEMBER: (state, member) => {
      state.siteMember = member;
    },

    SET_USER_INFO: (state, userinfo) => {
      state.userInfo = userinfo;
    }

  },
  getters: {
    location: state => state.location,
    siteMember: state => state.siteMember,
    userInfo: state => state.userInfo
  },
  // actions: {
  // },
  // modules: {
  // }
})
