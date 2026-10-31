export type FaceStatus = {
  enrolled: boolean
}

export type AttendanceItem = {
  id: number
  userId: number
  username: string
  displayName: string
  similarity: number
  status: 'ok' | 'fail' | string
  createdAt: string
}

export type FaceLibraryItem = {
  id: number
  username: string
  displayName: string
  role: string
  enrolled: boolean
  enrolledAt?: string | null
}
