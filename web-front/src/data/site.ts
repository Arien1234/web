export const site = {
  name: '澜知',
  slogan: '把 AI 做成能上线、能管控的服务',
  phone: '130-5809-5018',
  email: '2849892066@qq.com',
  address: '深圳市龙岗区',
}

export const navItems = [
  { path: '/', label: '首页' },
  { path: '/services', label: 'AI 服务' },
  { path: '/about', label: '关于我们' },
  { path: '/contact', label: '联系我们' },
] as const

export const features = [
  {
    title: '登录就能用',
    desc: '能力放在统一工作台里，开通账号即可体验，不必先上复杂项目。',
  },
  {
    title: '结果看得见',
    desc: '识别、检测等能力都给出可核对的输出，方便内部评估，也方便对外演示。',
  },
  {
    title: '权限可管控',
    desc: '谁能用、用了什么，都走登录与服务端校验，适合企业环境和正式交付。',
  },
  {
    title: '按业务往下加',
    desc: '先用现有能力验证价值，再按你的数据和现场，扩展模型、接口与部署方式。',
  },
]

export const services = [
  {
    name: '安全帽检测',
    summary:
      '识别图片中的安全帽 / 头盔，原图与检测结果对照，标出位置并给出置信度。登录工作台即可试用，适合工地、厂区与门岗。',
  },
  {
    name: '场景定制',
    summary:
      '按行业任务训练和调优模型：你要看什么、在什么环境里看，我们一起把准确率和可用性做到能上线。',
  },
  {
    name: '接入与交付',
    summary:
      '把 AI 接到现有系统和账号体系里，权限、调用和部署方式一起设计，避免只停留在演示环境。',
  },
]

export const stats = [
  { value: '即用', label: '登录进入工作台' },
  { value: '可视', label: '结果可核对' },
  { value: '可管', label: '账号与权限' },
  { value: '可扩', label: '按场景加能力' },
]

export const timeline = [
  { year: '2024', text: '从可落地的模型能力起步，先把「能看懂、给得出结果」做稳。' },
  { year: '2025', text: '做成可登录的 AI 服务工作台，能力和权限放在同一套体系里。' },
  { year: '2026', text: '面向企业客户开放试用与合作，按业务场景持续增加可上线的 AI 能力。' },
]
