import http from './http'
import type { InquiryItem } from '@/types/inquiry'

export function createInquiryApi(payload: {
  name: string
  company: string
  message: string
}) {
  return http.post('/inquiries', payload)
}

export function fetchInquiriesApi() {
  return http.get('/inquiries')
}

export function deleteInquiryApi(id: number) {
  return http.delete(`/inquiries/${id}`)
}

export type { InquiryItem }
