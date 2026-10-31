import { createRouter, createWebHistory } from 'vue-router'
import SiteLayout from '@/layouts/SiteLayout.vue'
import { getCachedRole, getRoleFromToken, getToken } from '@/utils/token'

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior() {
    return { top: 0 }
  },
  routes: [
    {
      path: '/',
      component: SiteLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/views/HomeView.vue'),
        },
        {
          path: 'services',
          name: 'services',
          component: () => import('@/views/ServicesView.vue'),
        },
        {
          path: 'about',
          name: 'about',
          component: () => import('@/views/AboutView.vue'),
        },
        {
          path: 'contact',
          name: 'contact',
          component: () => import('@/views/ContactView.vue'),
        },
        {
          path: 'login',
          name: 'login',
          component: () => import('@/views/LoginView.vue'),
          meta: { guest: true },
        },
        {
          path: 'register',
          name: 'register',
          component: () => import('@/views/RegisterView.vue'),
          meta: { guest: true },
        },
        {
          path: 'console',
          component: () => import('@/layouts/ConsoleLayout.vue'),
          meta: { auth: true },
          children: [
            { path: '', redirect: '/console/detect' },
            {
              path: 'detect',
              name: 'detect',
              component: () => import('@/views/DetectView.vue'),
              meta: { auth: true },
            },
            {
              path: 'attendance',
              name: 'attendance',
              component: () => import('@/views/FaceCheckinView.vue'),
              meta: { auth: true },
            },
            {
              path: 'faces',
              name: 'faces',
              component: () => import('@/views/FaceLibraryView.vue'),
              meta: { auth: true, admin: true },
            },
            {
              path: 'members',
              name: 'members',
              component: () => import('@/views/MembersView.vue'),
              meta: { auth: true, admin: true },
            },
            {
              path: 'inquiries',
              name: 'inquiries',
              component: () => import('@/views/InquiriesView.vue'),
              meta: { auth: true, admin: true },
            },
          ],
        },
      ],
    },
  ],
})

router.beforeEach((to) => {
  const loggedIn = Boolean(getToken())
  const needAuth = to.matched.some((record) => record.meta.auth)
  if (needAuth && !loggedIn) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }
  const needAdmin = to.matched.some((record) => record.meta.admin)
  const role = getCachedRole() || getRoleFromToken()
  if (needAdmin && role === 'user') {
    return { path: '/console/detect' }
  }
  if (to.meta.guest && loggedIn) {
    return { path: '/console/detect' }
  }
  return true
})

export default router
