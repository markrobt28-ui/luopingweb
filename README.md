# 飘飘洒洒 - 智能小工具

全栈项目，包含后端（NestJS）和前端（React + Vite），采用网关模式和三层架构。

## 技术栈

### 后端
- **框架**: NestJS 10.x
- **语言**: TypeScript
- **ORM**: Prisma
- **数据库**: PostgreSQL
- **缓存**: Redis
- **认证**: JWT + Passport

### 前端
- **框架**: React 18.3
- **构建工具**: Vite 5.4
- **路由**: React Router DOM 6.22
- **样式**: Tailwind CSS 3.4
- **动画**: Framer Motion 11.0
- **图标**: Font Awesome 6.4

## 项目结构

```
个人网站/
├── backend/                    # 后端项目
│   ├── src/
│   │   ├── main.ts
│   │   ├── app.module.ts
│   │   ├── gateway/           # 网关层
│   │   ├── services/          # 服务层
│   │   ├── modules/           # 功能模块
│   │   ├── common/            # 公共组件
│   │   ├── dto/               # 数据传输对象
│   │   ├── prisma/            # 数据访问层
│   │   └── redis/             # 缓存层
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   └── package.json
│
├── frontend/                   # 前端项目
│   ├── src/
│   │   ├── components/        # 组件
│   │   ├── pages/             # 页面
│   │   └── data/              # 数据
│   └── package.json
│
├── luopingweb.html             # 原始HTML文件
├── README.md
└── ARCHITECTURE.md
```

## 快速开始

### 后端启动

#### 1. 安装和配置 PostgreSQL

PostgreSQL 安装路径: `H:\Program Files\PostgreSQL`

**验证 PostgreSQL 服务是否运行:**

打开命令提示符 (CMD) 或 PowerShell，运行:
```bash
sc query postgresql-x64-15
```

如果服务未运行，启动服务:
```bash
net start postgresql-x64-15
```

**创建数据库:**
```bash
psql -U postgres -h localhost
# 输入密码后
CREATE DATABASE luoping_web;
\q
```

#### 2. 配置环境变量

```bash
cd backend
cp .env.example .env
```

编辑 `.env` 文件（根据 PostgreSQL 密码修改）：

```env
DATABASE_URL="postgresql://postgres:你的密码@localhost:5432/luoping_web?schema=public"
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"
REDIS_HOST="localhost"
REDIS_PORT=6379
REDIS_PASSWORD=""
REDIS_DB=0"
PORT=3000
NODE_ENV="development"
```

#### 3. 安装依赖

```bash
cd backend
npm install
```

#### 4. 初始化数据库

```bash
npm run prisma:generate
npm run prisma:migrate
```

#### 5. 启动开发服务器

```bash
npm run start:dev
```

后端将在 `http://localhost:3000` 启动。

### 前端启动

#### 1. 安装依赖

```bash
cd frontend
npm install
```

#### 2. 启动开发服务器

```bash
npm run dev
```

前端将在 `http://localhost:5173` 启动。

## 功能特性

### 后端 API

| 方法 | 端点 | 描述 |
|------|------|------|
| POST | `/auth/register` | 用户注册 |
| POST | `/auth/login` | 用户登录 |
| POST | `/auth/refresh` | 刷新 Token |
| POST | `/auth/logout` | 用户登出 (需认证) |
| GET | `/profile` | 获取用户信息 (需认证) |

### 前端页面

- **首页**: 展示精选工具和介绍
- **工具库**: 展示20个工具，支持分类筛选
- **关于我**: 个人介绍和联系方式

### 工具分类

- 生活工具
- 工作工具
- 学习工具
- 电脑工具
- 企业定制
- 个人定制

## 开发命令

### 后端

```bash
cd backend

# 开发模式
npm run start:dev

# 生产构建
npm run build

# 生产运行
npm run start:prod

# 数据库迁移
npm run prisma:migrate

# 生成 Prisma Client
npm run prisma:generate

# Prisma Studio
npm run prisma:studio
```

### 前端

```bash
cd frontend

# 开发模式
npm run dev

# 生产构建
npm run build

# 预览生产构建
npm run preview

# 代码检查
npm run lint
```

## 部署

### 后端部署

1. 构建项目
```bash
npm run build
```

2. 设置生产环境变量
3. 运行生产服务
```bash
npm run start:prod
```

### 前端部署

1. 构建项目
```bash
npm run build
```

2. 将 `dist` 目录部署到静态服务器

## 相关文档

- [架构设计文档](./ARCHITECTURE.md)
- [后端开发指南](./DEVELOPMENT.md)
- [前端开发指南](./frontend/README.md)

## 联系方式

- 微信: LP20241688
- 网址: weixin://dl/addfriend?username=LP20241688

## 许可证

MIT
