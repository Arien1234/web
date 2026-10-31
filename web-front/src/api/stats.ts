import http from './http'

export function fetchHomeVisitsApi() {
  return http.get('/stats/visits')
}

export function recordHomeVisitApi() {
  return http.post('/stats/visits')
}
