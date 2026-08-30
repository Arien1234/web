import http from './http'

/** 需登录：Nest 校验 JWT 后再把图片转到 Python :8000 */
export function detectImageApi(file: File) {
  const form = new FormData()
  form.append('file', file)
  return http.post('/ai/detect', form, {
    timeout: 120000,
  })
}
