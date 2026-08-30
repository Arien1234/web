export type AuthUser = {
  id: number
  username: string
  displayName: string
  role: 'admin' | 'user' | string
}

export type MemberItem = AuthUser & {
  createdAt?: string
}
