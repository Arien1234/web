# 澜知 AI 智能服务

前端 `web-front`（Vue 3，端口 5173）+ 登录后端 `server-back`（NestJS，端口 3000）+ YOLO 推理 `python-fastapi`（FastAPI，端口 8000）+ MySQL。

头盔检测只在**登录后**的 `/console/detect` 出现。图片经 Nest 校验登录态后转到 Python。

## 端口

| 服务 | 端口 | 说明 |
|------|------|------|
| 网页 | 5173 | Vite 开发服务器，`/api` 代理到 3000 |
| 登录与转发 | 3000 | JWT、注册登录、转发检测图片 |
| YOLO | 8000 | Python 加载 `best.pt` 并画框 |
| MySQL | 3306 | 用户与留言 |

## 数据库

用户名 `root`，密码 `123456`，库名 `database`。先执行 `sql/init.sql`。

## 本地运行（三个终端）

1. MySQL 已启动并建表。
2. Python（先准备 `best.pt`，默认路径见 `python-fastapi/README.md`）：

```powershell
cd d:\web\python-fastapi
python main.py
```

3. Nest：

```powershell
cd d:\web\server-back
pnpm run start:dev
```

4. 前端：

```powershell
cd d:\web\web-front
pnpm dev
```

浏览器：http://127.0.0.1:5173/login  
登录后打开：http://127.0.0.1:5173/console/detect  
系统管理员（`admin`）可在工作台进入「成员名单」管理注册用户。

克隆后请复制 `server-back/.env.example` 为 `server-back/.env`，并自行安装依赖（不要提交 `.env` 和 `node_modules`）。
