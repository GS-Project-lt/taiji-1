import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../views/index.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'index',
    component: Index,
    redirect: '/home',
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import('../views/Home.vue'),
        meta: { title: '青甫太极' }
      },
      {
        path: '/me',
        name: 'me',
        component: () => import('../views/Mine.vue'),
        meta: { title: '我的' }
      },
      {
        path: '/activity',
        name: 'activity',
        component: () => import('../views/activity/Activity.vue'),
        meta: { title: '活动' }
      }
    ]
  },
  {
    path: '/activity/:id/:valid',
    name: 'activityDetail',
    component: () => import('../views/activity/Detail.vue'),
    meta: { title: '活动详情' }
  },
  {
    path: '/help',
    name: 'help',
    component: () => import('../views/order/help.vue'),
    meta: { title: '技术捐助' }
  },
  {
    path: '/sitedetail/:id',
    name: 'siteDetail',
    component: () => import('../views/site/detail.vue')
  },
  {
    path: '/site/list',
    name: 'siteList',
    component: () => import('../views/site/list.vue')
  },
  {
    path: '/site/member/:leaderId',
    name: 'siteMember',
    component: () => import('../views/site/member.vue')
  },
  {
    path: '/teachvideo/:id',
    name: 'teachVideo',
    component: () => import('../views/video/teachVideo.vue')
  },
  {
    path: '/teachlist',
    name: 'teachList',
    component: () => import('../views/video/teachList.vue')
  },
  {
    path: '/articlelist',
    name: 'articleList',
    component: () => import('../views/article/list.vue')
  },
  {
    path: '/article/:id',
    name: 'articleDetail',
    component: () => import('../views/article/detail.vue')
  },
  {
    path: '/us/focus',
    name: 'focus',
    component: () => import('../views/us/focusUs.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
