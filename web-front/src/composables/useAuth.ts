import { computed, ref } from 'vue'
import { loginApi, logoutApi, profileApi, registerApi } from '@/api/auth'
import {
  clearToken,
  getCachedDisplayName,
  getCachedRole,
  getCachedUserId,
  getCachedUsername,
  getRoleFromToken,
  getToken,
  getUserIdFromToken,
  setCachedUser,
  setToken,
} from '@/utils/token'
import type { AuthUser } from '@/types/user'

const token = ref(getToken())
const profile = ref<AuthUser | null>(readCachedProfile())

function readCachedProfile(): AuthUser | null {
  if (!getToken()) {
    return null
  }
  const username = getCachedUsername()
  const displayName = getCachedDisplayName()
  if (!username && !displayName) {
    return null
  }
  return {
    id: getCachedUserId() || getUserIdFromToken(),
    username,
    displayName: displayName || username,
    role: getCachedRole() || getRoleFromToken() || 'user',
  }
}

/** 401 时清内存态，避免 localStorage 已空但顶栏仍认为已登录（或反过来） */
export function clearSession() {
  token.value = ''
  profile.value = null
  clearToken()
}

function unwrapSession(res: unknown): { token: string; user: AuthUser } {
  const body = res as {
    data?: { token?: string; user?: AuthUser }
    token?: string
    user?: AuthUser
  }
  const session = body.data?.token ? body.data : body
  if (!session.token || !session.user) {
    throw new Error('登录响应无效')
  }
  return { token: session.token, user: session.user }
}

export function useAuth() {
  const isLoggedIn = computed(() => Boolean(token.value || getToken()))
  const isAdmin = computed(
    () =>
      profile.value?.role === 'admin' ||
      getCachedRole() === 'admin' ||
      getRoleFromToken() === 'admin',
  )

  function syncFromStorage() {
    const stored = getToken()
    if (stored !== token.value) {
      token.value = stored
    }
    if (stored && !profile.value) {
      profile.value = readCachedProfile()
    }
    if (!stored) {
      profile.value = null
    }
  }

  async function login(form: { username: string; password: string }) {
    const res = await loginApi(form)
    applySession(unwrapSession(res))
  }

  async function register(form: {
    username: string
    password: string
    displayName?: string
  }) {
    const res = await registerApi(form)
    applySession(unwrapSession(res))
  }

  function applySession(data: { token: string; user: AuthUser }) {
    setToken(data.token)
    setCachedUser(data.user)
    token.value = data.token
    profile.value = data.user
  }

  async function loadProfile() {
    syncFromStorage()
    if (!token.value) {
      return
    }
    const res = (await profileApi()) as { data: AuthUser }
    profile.value = res.data
    setCachedUser(res.data)
  }

  async function logout() {
    try {
      if (token.value || getToken()) {
        await logoutApi()
      }
    } catch {
      /* 本地仍需退出 */
    }
    clearSession()
  }

  return {
    token,
    profile,
    isLoggedIn,
    isAdmin,
    displayName: computed(
      () => profile.value?.displayName || profile.value?.username || getCachedDisplayName() || '',
    ),
    login,
    register,
    loadProfile,
    logout,
    syncFromStorage,
  }
}
