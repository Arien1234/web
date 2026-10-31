import http from './http'

export function faceStatusApi() {
  return http.get('/face/status')
}

export function probeFaceApi(file: File) {
  const form = new FormData()
  form.append('file', file)
  return http.post('/face/probe', form, { timeout: 20000 })
}

export function missFaceApi() {
  return http.post('/face/miss')
}

export function checkInFaceApi(file: File) {
  const form = new FormData()
  form.append('file', file)
  return http.post('/face/checkin', form, { timeout: 120000 })
}

export function myAttendanceApi() {
  return http.get('/face/records')
}

export function faceLibraryApi() {
  return http.get('/face/library')
}

export function enrollFaceForUserApi(userId: number, file: File) {
  const form = new FormData()
  form.append('userId', String(userId))
  form.append('file', file)
  return http.post('/face/library', form, { timeout: 120000 })
}

export function removeFaceApi(userId: number) {
  return http.delete(`/face/library/${userId}`)
}

export function allAttendanceApi() {
  return http.get('/face/attendance')
}
