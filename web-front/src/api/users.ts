import http from './http'
import type { MemberItem } from '@/types/user'

export function fetchMembersApi() {
  return http.get('/users')
}

export function createMemberApi(payload: {
  username: string
  password: string
  displayName?: string
}) {
  return http.post('/users', payload)
}

export function updateMemberApi(
  id: number,
  payload: { displayName?: string; password?: string },
) {
  return http.put(`/users/${id}`, payload)
}

export function deleteMemberApi(id: number) {
  return http.delete(`/users/${id}`)
}

export type { MemberItem }
