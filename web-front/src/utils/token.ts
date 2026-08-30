const TOKEN_KEY = 'lanzhi_token'

const ROLE_KEY = 'lanzhi_role'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || ''
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(ROLE_KEY)
}

export function getCachedRole() {
  return localStorage.getItem(ROLE_KEY) || ''
}

export function setCachedRole(role: string) {
  localStorage.setItem(ROLE_KEY, role)
}
