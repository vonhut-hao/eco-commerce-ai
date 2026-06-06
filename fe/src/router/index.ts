// Vue Router setup

import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { tokenStorage } from '../utils/tokenStorage'

// Lazy load page components
const SignIn = () => import('../pages/SignIn.vue')
const SignUp = () => import('../pages/SignUp.vue')
const OAuthCallback = () => import('../pages/OAuthCallback.vue')
const Home = () => import('../pages/Home.vue')

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true },
  },
  {
    path: '/sign-in',
    name: 'SignIn',
    component: SignIn,
    meta: { requiresAuth: false },
  },
  {
    path: '/sign-up',
    name: 'SignUp',
    component: SignUp,
    meta: { requiresAuth: false },
  },
  {
    path: '/oauth2/callback',
    name: 'OAuthCallback',
    component: OAuthCallback,
    meta: { requiresAuth: false },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Navigation guard
router.beforeEach((to) => {
  const isAuthenticated = !tokenStorage.isTokenExpired() && !!tokenStorage.getToken()
  const requiresAuth = to.meta.requiresAuth !== false

  if (requiresAuth && !isAuthenticated) {
    // Redirect to sign-in if trying to access protected route
    return { name: 'SignIn', query: { redirect: to.fullPath } }
  } else if (!requiresAuth && isAuthenticated && (to.name === 'SignIn' || to.name === 'SignUp')) {
    // Redirect to home if already authenticated and trying to access auth pages
    return { name: 'Home' }
  }
})

export default router
