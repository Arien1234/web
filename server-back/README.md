# 后端（NestJS）

澜知官网的服务端：登录鉴权、联系留言，数据存在 MySQL。

## 数据库

- 用户名：`root`
- 密码：`123456`
- 库名：`database`
- 端口：`3306`

请先执行项目根目录的 `sql/init.sql` 建表。配置见 `.env`（可参考 `.env.example`）。

## 安装与运行

```powershell
pnpm install
pnpm run start:dev
```

接口前缀：`http://127.0.0.1:3000/api`

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/health` | 健康检查 |
| POST | `/api/auth/login` | 登录 |
| POST | `/api/auth/register` | 注册 |
| GET | `/api/auth/profile` | 当前用户（需登录） |
| POST | `/api/auth/logout` | 退出 |
| GET | `/api/users` | 成员名单（仅管理员） |
| POST | `/api/users` | 添加成员（仅管理员） |
| PUT | `/api/users/:id` | 修改成员（仅管理员） |
| DELETE | `/api/users/:id` | 删除成员（仅管理员） |
| POST | `/api/inquiries` | 提交官网留言（公开） |
| GET | `/api/stats/visits` | 读取首页访客数（公开） |
| POST | `/api/stats/visits` | 首页访客 +1（公开） |
| GET | `/api/inquiries` | 留言列表（仅管理员） |
| DELETE | `/api/inquiries/:id` | 删除留言（仅管理员） |
| POST | `/api/ai/detect` | 视觉检测（需登录，转发到 Python :8000） |
| GET | `/api/face/status` | 当前用户是否已录入人脸 |
| POST | `/api/face/checkin` | 当前用户人脸打卡 |
| GET | `/api/face/records` | 当前用户打卡记录 |
| GET | `/api/face/library` | 人脸库（仅管理员） |
| POST | `/api/face/library` | 为指定成员录入人脸（仅管理员） |
| DELETE | `/api/face/library/:userId` | 删除成员人脸（仅管理员） |
| GET | `/api/face/attendance` | 全部打卡记录（仅管理员） |

首次启动若没有管理员，会自动创建：`admin` / `admin123`。

Python YOLO 需单独启动：`cd d:\web\python-fastapi` 后执行 `python main.py`（默认 `http://127.0.0.1:8000`）。

## 源码目录

| 文件 | 说明 |
|------|------|
| `src/main.ts` | 入口、跨域、全局校验 |
| `src/database/` | MySQL 连接池 |
| `src/auth/` | 登录与 JWT |
| `src/inquiry/` | 联系留言 |
| `src/stats/` | 官网访客计数 |
| `src/users/` | 管理员成员名单 |
| `src/face/` | 人脸库与打卡 |
