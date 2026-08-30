# 前端（Vue 3）

澜知 AI 智能服务官网。日常开发直接跑源码，保存后页面会自动刷新。接口通过 Vite 代理到后端 `http://127.0.0.1:3000`。

## 安装与运行

```powershell
pnpm install
pnpm dev
```

浏览器打开：http://127.0.0.1:5173/

## 页面

| 路径 | 说明 |
|------|------|
| `/` | 首页 |
| `/services` | 智能服务 |
| `/about` | 关于我们 |
| `/contact` | 联系我们（留言写入数据库） |
| `/login` | 登录（密码可点「显示」） |
| `/register` | 注册 |
| `/console/detect` | 登录后的头盔检测（原图 / YOLO 结果） |
| `/console/members` | 系统管理员：注册成员名单 |

默认登录账号：`admin` / `admin123`（由后端首次启动写入 MySQL）。

## 代码改哪里

| 目录 | 说明 |
|------|------|
| `src/data/site.ts` | 文案、导航、服务介绍 |
| `src/styles/` | 样式 |
| `src/views/` | 各页面 |
| `src/api/` | 请求封装 |
| `src/composables/useAuth.ts` | 登录状态 |
| `src/router/index.ts` | 路由与登录拦截 |
