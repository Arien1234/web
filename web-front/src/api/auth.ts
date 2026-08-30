import http from './http'

export function loginApi(payload: { username: string; password: string }) {
  return http.post('/auth/login', payload)
}

export function registerApi(payload: {
  username: string
  password: string
  displayName?: string
}) {
  return http.post('/auth/register', payload)
}

export function profileApi() {
  return http.get('/auth/profile')
}

export function logoutApi() {
  return http.post('/auth/logout')
}

export function createInquiryApi(payload: {
  name: string
  company: string
  message: string
}) {
  return http.post('/inquiries', payload)
}
