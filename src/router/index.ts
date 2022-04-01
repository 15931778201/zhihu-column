import { createRouter, createWebHistory } from 'vue-router'
import axios from 'axios'
import store from '../store'
const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue')
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      alreadyLogin: true
    },
    component: () => import('../views/LoginView.vue')
  },
  {
    path: '/signup',
    name: 'signup',
    meta: {
      alreadyLogin: true
    },
    component: () => import('../views/RegisterView.vue')
  },
  {
    path: '/column/:id',
    name: 'column',
    component: () => import('../views/ColumnDetail.vue')
  },
  {
    path: '/posts/:id',
    name: 'posts',
    component: () => import('../views/PostDetail.vue')
  },
  {
    path: '/create',
    name: 'create',
    meta: {
      requiredLogin: true
    },
    component: () => import('../views/CreatePosts.vue')
  },
  {
    path: '/loginout',
    name: 'loginout',
    redirect: '/login'
  }
]
const router = createRouter({
  history: createWebHistory(),
  routes
})
// router.beforeEach((to, from, next) => {
//   const { token, user } = store.state
//   const { requiredLogin, alreadyLogin } = to.meta
//   if (!user.isLogin) {
//     if (!token) {
//       if (requiredLogin) {
//         next('/login')
//       } else {
//         next()
//       }
//     } else {
//       axios.defaults.headers.common.Authorization = `Bearer ${token}`
//       store.dispatch('fetchCurrentUser').then(() => {
//         if (alreadyLogin) {
//           next('/')
//         } else {
//           next()
//         }
//       }).catch(() => {
//         store.commit('logout')
//         next('/login')
//       })
//     }
//   } else {
//     if (alreadyLogin) {
//       next('/')
//     } else {
//       next()
//     }
//   }
// })
export default router