/** 登录后功能菜单：后续加功能只需在这里加一项，并补路由页面 */
export type ConsoleMenuItem = {
  path: string
  label: string
  /** 仅系统管理员可见 */
  adminOnly?: boolean
}

export const consoleMenu: ConsoleMenuItem[] = [
  { path: '/console/detect', label: '视觉检测' },
  { path: '/console/attendance', label: '人脸打卡' },
  { path: '/console/faces', label: '人脸库', adminOnly: true },
  { path: '/console/members', label: '成员名单', adminOnly: true },
  { path: '/console/inquiries', label: '联系留言', adminOnly: true },
]
