import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    meta: {
      layout: 'main'
    },
    component: () => import('../views/Home.vue')
  },
  {
    path: '/about',
    name: 'About',
    meta: {
      layout: 'main'
    },
    component: () => import('../views/About.vue')
  },
  {
    path: '/test',
    name: 'Test',
    meta: {
      layout: 'main'
    },
    component: () => import('../views/Test.vue')
  },
  {
    path: '/login',
    name: 'Login',
    meta: {
      layout: 'empty'
    },
    component: () => import('../views/LoginForm.vue')
  },
  {
    path: '/register',
    name: 'Register',
    meta: {
      layout: 'empty'
    },
    component: () => import('../views/RegisterForm.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
