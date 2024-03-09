import Home from '@/views/Home.vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    name: 'home',
    alias: '/home',
    path: '/',
    component: Home
  },
  {
    name: 'about',
    path: '/about',
    component: () => import('@/views/About.vue')
  },
  {
    name: 'manage',
    path: '/manage',
    component: () => import('@/views/Manage.vue')
  },
  {
    name: 'song',
    path: '/song/:id',
    component: () => import('@/views/Song.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: { name: 'home' }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
