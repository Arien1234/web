import axios from 'axios'
import { getToken } from '@/utils/token'

const http = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

http.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

http.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const raw =
      error.response?.data?.message ||
      error.response?.data?.detail ||
      '网络异常，请稍后重试'
    const message = Array.isArray(raw) ? raw[0] : raw
    if (error.response?.status === 401) {
      void import('@/composables/useAuth').then((mod) => {
        mod.clearSession()
      })
      void import('@/router').then(({ default: router }) => {
        if (router.currentRoute.value.path !== '/login') {
          router.replace({
            path: '/login',
            query: { redirect: router.currentRoute.value.fullPath },
          })
        }
      })
    }
    return Promise.reject(new Error(message))
  },
)

export default http
