export const site = {
  name: '澜知',
  slogan: '让智能服务，真正帮得上忙',
  phone: '400-860-1080',
  email: 'hello@lanzhi.example',
  address: '上海市浦东新区世纪大道 100 号',
}

export const navItems = [
  { path: '/', label: '首页' },
  { path: '/services', label: '智能服务' },
  { path: '/about', label: '关于我们' },
  { path: '/contact', label: '联系我们' },
] as const

export const features = [
  {
    title: '对话即办理',
    desc: '用自然语言提问，系统理解意图后调用对应能力，少点菜单、少走流程。',
  },
  {
    title: '知识沉淀可检索',
    desc: '把制度、手册与历史工单变成可引用的知识库，回答带来源、可核对。',
  },
  {
    title: '人机协同不越权',
    desc: '关键操作仍需登录确认，权限与审计留在服务端，智能不代替责任。',
  },
  {
    title: '按场景快速上线',
    desc: '客服、办公助手、文档问答可独立启用，先跑通一件事再铺开。',
  },
]

export const services = [
  {
    name: '智能客服',
    summary: '7×24 应答常见问题，复杂工单自动转人工，并附带上下文摘要。',
  },
  {
    name: '企业知识助手',
    summary: '面向内部文档与制度问答，减少「问同事」和翻文件夹的时间。',
  },
  {
    name: '办公流程助手',
    summary: '请假、报销、预约等事项用对话发起，系统帮你填好再提交。',
  },
]

export const stats = [
  { value: '92%', label: '常见问题自动解决' },
  { value: '3s', label: '平均首响' },
  { value: '40+', label: '落地场景' },
  { value: '99.9%', label: '服务可用率' },
]

export const timeline = [
  { year: '2023', text: '从客服质检模型起步，验证「能听懂、能引用」这条路。' },
  { year: '2025', text: '做成可登录的智能服务平台，知识和权限开始分域管理。' },
  { year: '2026', text: '面向官网与企业客户，把对话、知识库与流程助手做成一套产品。' },
]
