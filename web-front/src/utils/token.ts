const TOKEN_KEY = 'lanzhi_token'
const ROLE_KEY = 'lanzhi_role'
const NAME_KEY = 'lanzhi_name'
const USERNAME_KEY = 'lanzhi_username'
const USER_ID_KEY = 'lanzhi_uid'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || ''
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(ROLE_KEY)
  localStorage.removeItem(NAME_KEY)
  localStorage.removeItem(USERNAME_KEY)
  localStorage.removeItem(USER_ID_KEY)
}

export function getCachedRole() {
  return getRoleFromToken() || localStorage.getItem(ROLE_KEY) || ''
}

export function setCachedRole(role: string) {
  localStorage.setItem(ROLE_KEY, role)
}

export function getCachedDisplayName() {
  return localStorage.getItem(NAME_KEY) || localStorage.getItem(USERNAME_KEY) || ''
}

export function getCachedUsername() {
  return localStorage.getItem(USERNAME_KEY) || ''
}

export function getCachedUserId() {
  const raw = localStorage.getItem(USER_ID_KEY)
  const id = raw ? Number(raw) : 0
  return Number.isFinite(id) ? id : 0
}

export function setCachedUser(user: {
  id?: number
  username?: string
  displayName?: string
  role?: string
}) {
  setCachedRole(user.role || 'user')
  localStorage.setItem(USERNAME_KEY, user.username || '')
  localStorage.setItem(NAME_KEY, user.displayName || user.username || '')
  if (user.id) {
    localStorage.setItem(USER_ID_KEY, String(user.id))
  }
}

/** 从 JWT 读角色，避免本地只有 token、菜单却当成普通用户 */
export function getRoleFromToken() {
  const token = getToken()
  const payload = decodeJwtPayload(token)
  return typeof payload?.role === 'string' ? payload.role : ''
}

export function getUserIdFromToken() {
  const payload = decodeJwtPayload(getToken())
  const id = Number(payload?.id)
  return Number.isFinite(id) ? id : 0
}

function decodeJwtPayload(token: string): { id?: number; role?: string } | null {
  if (!token) {
    return null
  }
  try {
    const part = token.split('.')[1]
    if (!part) {
      return null
    }
    const json = atob(part.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(json) as { id?: number; role?: string }
  } catch {
    return null
  }
}
