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
        component: () => import('../views/Home.vue')
      },
      {
        path: '/mine',
        name: 'mine',
        component: () => import('../views/Mine.vue')
      },
      {
        path: '/activity',
        name: 'activity',
        component: () => import('../views/activity/Activity.vue')
      }
    ]
  },
  {
    path: '/activity/:id/:valid',
    name: 'activityDetail',
    component: () => import('../views/activity/Detail.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
