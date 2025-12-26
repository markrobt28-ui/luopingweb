# 落平个人网站 - 全栈智能工具平台

一个现代化的全栈 Web 应用，包含后端 API、前端网站和管理后台，采用微服务架构和三层设计模式。

## 📋 目录

- [技术栈](#技术栈)
- [项目结构](#项目结构)
- [快速开始](#快速开始)
- [功能特性](#功能特性)
- [开发命令](#开发命令)
- [部署指南](#部署指南)
- [API 文档](#api-文档)

---

## 🛠 技术栈

### 后端 (Backend)
- **框架**: NestJS 10.x
- **语言**: TypeScript 5.3
- **ORM**: Prisma 5.8
- **数据库**: PostgreSQL
- **缓存**: Redis (可选)
- **认证**: JWT + Passport
- **安全**: Helmet + Throttler (限流)
- **文件上传**: Multer

### 前端 (Frontend)
- **框架**: React 18.3
- **构建工具**: Vite 5.4
- **路由**: React Router DOM 6.22
- **样式**: Tailwind CSS 3.4
- **动画**: Framer Motion 11.0
- **图标**: Font Awesome 7.1
- **图标库**: Lucide React

### 管理后台 (Admin)
- **框架**: React 18.2
- **构建工具**: Vite 5.0
- **路由**: React Router DOM 6.20
- **样式**: Tailwind CSS 3.3
- **UI**: 自定义组件库

---

## 📁 项目结构

```
luoping-web/                                    # 项目根目录
│
├── backend/                                    # 🔧 后端服务 (NestJS)
│   ├── src/                                   # 源代码
│   │   ├── common/                            # 公共模块
│   │   │   ├── decorators/                    # 装饰器 (角色、用户等)
│   │   │   ├── filters/                       # 全局异常过滤器
│   │   │   └── guards/                        # 守卫 (JWT、角色)
│   │   ├── config/                            # 配置
│   │   │   └── env.validation.ts              # 环境变量验证
│   │   ├── gateway/                           # API 网关
│   │   │   ├── gateway.controller.ts          # 统一路由控制器
│   │   │   └── gateway.module.ts
│   │   ├── modules/                           # 功能模块
│   │   │   ├── auth/                          # 认证模块 (JWT/Local)
│   │   │   └── blog/                          # 博客模块
│   │   ├── prisma/                            # Prisma 服务
│   │   ├── redis/                             # Redis 服务
│   │   ├── services/                          # 业务服务层
│   │   │   ├── auth.service.ts                # 认证服务
│   │   │   ├── user.service.ts                # 用户服务
│   │   │   ├── post.service.ts                # 文章服务
│   │   │   ├── comment.service.ts             # 评论服务
│   │   │   ├── tag.service.ts                 # 标签服务
│   │   │   ├── tool.service.ts                # 工具服务
│   │   │   ├── tool-category.service.ts       # 工具分类服务
│   │   │   └── setting.service.ts             # 设置服务
│   │   ├── app.module.ts                      # 应用主模块
│   │   └── main.ts                            # 应用入口
│   ├── prisma/                                # Prisma 配置
│   │   ├── migrations/                        # 数据库迁移
│   │   ├── schema.prisma                      # 数据库模型
│   │   └── seed.ts                            # 种子数据
│   ├── scripts/                               # 脚本工具
│   ├── dist/                                  # 构建输出 ⭐
│   ├── uploads/                               # 文件上传目录
│   ├── package.json
│   └── .env                                   # 环境变量
│
├── frontend/                                   # 🎨 前端网站 (React)
│   ├── src/
│   │   ├── components/                        # 组件
│   │   │   ├── ContactButton.tsx
│   │   │   ├── ErrorBoundary.tsx              # 错误边界
│   │   │   ├── Footer.tsx
│   │   │   ├── Header.tsx
│   │   │   └── ToolCard.tsx
│   │   ├── contexts/                          # 上下文
│   │   │   └── AuthContext.tsx                # 认证上下文
│   │   ├── pages/                             # 页面
│   │   │   ├── Home.tsx                       # 首页
│   │   │   ├── Blog.tsx                       # 博客列表
│   │   │   ├── BlogPost.tsx                   # 博客详情
│   │   │   ├── ToolLibrary.tsx                # 工具库
│   │   │   ├── About.tsx                      # 关于
│   │   │   ├── Contact.tsx                    # 联系
│   │   │   ├── Login.tsx                      # 登录
│   │   │   ├── Register.tsx                   # 注册
│   │   │   ├── Account.tsx                    # 账户中心
│   │   │   ├── Privacy.tsx                    # 隐私政策
│   │   │   ├── Terms.tsx                      # 服务条款
│   │   │   └── Changelog.tsx                  # 更新日志
│   │   ├── services/                          # 服务
│   │   │   ├── api.ts                         # API 封装
│   │   │   └── authService.ts                 # 认证服务
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── dist/                                  # 构建输出 ⭐
│   ├── package.json
│   └── .env
│
├── admin/                                      # 👑 管理后台 (React)
│   ├── src/
│   │   ├── components/
│   │   │   ├── ErrorBoundary.tsx              # 错误边界
│   │   │   ├── Layout.tsx                     # 布局
│   │   │   └── ProtectedRoute.tsx             # 路由保护
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx
│   │   ├── pages/                             # 管理页面
│   │   │   ├── Dashboard.tsx                  # 仪表盘
│   │   │   ├── UserManagement.tsx             # 用户管理
│   │   │   ├── PostManagement.tsx             # 文章管理
│   │   │   ├── CommentManagement.tsx          # 评论管理
│   │   │   ├── TagManagement.tsx              # 标签管理
│   │   │   ├── ToolManagement.tsx             # 工具管理
│   │   │   ├── ToolCategoryManagement.tsx     # 工具分类管理
│   │   │   ├── AboutManagement.tsx            # 关于管理
│   │   │   └── SettingsManagement.tsx         # 设置管理
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── dist/                                  # 构建输出 ⭐
│   ├── package.json
│   └── .env
│
├── docs/                                       # 📚 文档
│   ├── DEPLOYMENT.md                          # 部署文档
│   ├── OPTIMIZATION.md                        # 优化记录
│   └── PROJECT_STRUCTURE.md                   # 项目结构
│
├── .gitignore
└── README.md
```

---

## 🚀 快速开始

### 前置要求

- Node.js >= 18.x
- PostgreSQL >= 14.x
- Redis >= 6.x (可选)
- npm 或 yarn

### 1. 克隆项目

```bash
git clone https://github.com/markrobt28-ui/luopingweb.git
cd luopingweb
```

### 2. 后端设置

#### 安装 PostgreSQL

PostgreSQL 安装路径: `H:\Program Files\PostgreSQL`

**启动 PostgreSQL 服务:**

```bash
# Windows
net start postgresql-x64-15

# 或检查服务状态
sc query postgresql-x64-15
```

**创建数据库:**

```bash
psql -U postgres -h localhost
CREATE DATABASE luoping_web;
\q
```

#### 配置后端

```bash
cd backend

# 安装依赖
npm install

# 复制环境变量
cp .env.example .env

# 编辑 .env 文件，配置数据库连接
# DATABASE_URL="postgresql://postgres:你的密码@localhost:5432/luoping_web?schema=public"
# JWT_SECRET="至少32字符的强密钥"

# 生成 Prisma Client
npm run prisma:generate

# 运行数据库迁移
npm run prisma:migrate

# (可选) 填充种子数据
npm run prisma:seed

# 启动开发服务器
npm run start:dev
```

后端将在 `http://localhost:3000` 启动

### 3. 前端设置

```bash
cd frontend

# 安装依赖
npm install

# 复制环境变量
cp .env.example .env

# 编辑 .env 文件
# VITE_API_BASE_URL=http://localhost:3000

# 启动开发服务器
npm run dev
```

前端将在 `http://localhost:5173` 启动

### 4. 管理后台设置

```bash
cd admin

# 安装依赖
npm install

# 复制环境变量
cp .env.example .env

# 编辑 .env 文件
# VITE_API_BASE_URL=http://localhost:3000

# 启动开发服务器
npm run dev
```

管理后台将在 `http://localhost:5174` 启动

---

## ✨ 功能特性

### 🔐 认证系统
- ✅ JWT Token 认证
- ✅ Refresh Token 机制
- ✅ 角色权限控制 (USER/ADMIN)
- ✅ 密码加密 (bcrypt)
- ✅ 登录/注册/登出

### 📝 博客系统
- ✅ 文章发布/编辑/删除
- ✅ 文章分类和标签
- ✅ 评论系统
- ✅ 文章浏览统计
- ✅ 点赞功能
- ✅ 分页加载

### 🛠 工具库
- ✅ 工具分类管理
- ✅ 工具展示和搜索
- ✅ 工具评分系统
- ✅ 自定义工具图标

### 👥 用户管理
- ✅ 用户注册/登录
- ✅ 用户信息管理
- ✅ 角色权限管理
- ✅ 账户激活/禁用

### 🎨 前端特性
- ✅ 响应式设计
- ✅ 暗色主题
- ✅ 流畅动画效果
- ✅ 错误边界处理
- ✅ 加载状态提示

### 🔒 安全特性
- ✅ Helmet 安全头
- ✅ CORS 跨域配置
- ✅ 请求频率限制 (100/分钟)
- ✅ 环境变量验证
- ✅ SQL 注入防护 (Prisma)

---

## 💻 开发命令

### 后端命令

```bash
cd backend

# 开发
npm run start:dev          # 开发模式 (热重载)
npm run start:debug        # 调试模式

# 构建
npm run build              # 生产构建

# 运行
npm run start:prod         # 生产模式

# 数据库
npm run prisma:generate    # 生成 Prisma Client
npm run prisma:migrate     # 运行迁移
npm run prisma:studio      # 打开 Prisma Studio
npm run prisma:seed        # 填充种子数据

# 测试
npm run test               # 单元测试
npm run test:e2e           # E2E 测试
npm run test:cov           # 测试覆盖率

# 代码质量
npm run lint               # ESLint 检查
```

### 前端命令

```bash
cd frontend

# 开发
npm run dev                # 开发服务器

# 构建
npm run build              # 生产构建

# 预览
npm run preview            # 预览生产构建

# 代码质量
npm run lint               # ESLint 检查
```

### 管理后台命令

```bash
cd admin

# 开发
npm run dev                # 开发服务器

# 构建
npm run build              # 生产构建

# 预览
npm run preview            # 预览生产构建

# 代码质量
npm run lint               # ESLint 检查
```

---

## 📦 部署指南

### 构建生产版本

```bash
# 构建后端
cd backend
npm install
npm run build

# 构建前端
cd frontend
npm install
npm run build

# 构建管理后台
cd admin
npm install
npm run build
```

### 部署到服务器

#### 后端部署 (Debian/Ubuntu)

```bash
# 上传文件到服务器
backend/dist/              # 构建输出
backend/prisma/            # 数据库配置
backend/package.json       # 依赖配置
backend/.env              # 环境变量

# 在服务器上
cd /var/www/luoping-web/backend
npm install --production
npx prisma generate
npx prisma migrate deploy

# 使用 PM2 运行
pm2 start dist/main.js --name luoping-backend
pm2 save
pm2 startup
```

#### 前端部署 (Nginx)

```bash
# 上传 dist 目录到服务器
frontend/dist/

# Nginx 配置
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/luoping-web/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

#### 管理后台部署 (Nginx)

```bash
# 上传 dist 目录到服务器
admin/dist/

# Nginx 配置
server {
    listen 8080;
    server_name admin.yourdomain.com;
    root /var/www/luoping-web/admin/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

详细部署文档请查看: [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md)

---

## 📡 API 文档

### 认证接口

| 方法 | 端点 | 描述 | 认证 |
|------|------|------|------|
| POST | `/auth/register` | 用户注册 | ❌ |
| POST | `/auth/login` | 用户登录 | ❌ |
| POST | `/auth/refresh` | 刷新 Token | ❌ |
| POST | `/auth/logout` | 用户登出 | ✅ |
| GET | `/profile` | 获取用户信息 | ✅ |
| PUT | `/profile/password` | 修改密码 | ✅ |

### 博客接口

| 方法 | 端点 | 描述 | 认证 |
|------|------|------|------|
| GET | `/posts` | 获取文章列表 (分页) | ❌ |
| GET | `/posts/:id` | 获取文章详情 | ❌ |
| GET | `/posts/slug/:slug` | 通过 slug 获取文章 | ❌ |
| POST | `/posts/:id/like` | 点赞文章 | ❌ |
| POST | `/admin/posts` | 创建文章 | ✅ ADMIN |
| PUT | `/admin/posts/:id` | 更新文章 | ✅ ADMIN |
| DELETE | `/admin/posts/:id` | 删除文章 | ✅ ADMIN |

### 工具接口

| 方法 | 端点 | 描述 | 认证 |
|------|------|------|------|
| GET | `/tools` | 获取工具列表 | ❌ |
| GET | `/tools/:id` | 获取工具详情 | ❌ |
| GET | `/tool-categories` | 获取工具分类 | ❌ |
| POST | `/admin/tools` | 创建工具 | ✅ ADMIN |
| PUT | `/admin/tools/:id` | 更新工具 | ✅ ADMIN |
| DELETE | `/admin/tools/:id` | 删除工具 | ✅ ADMIN |

更多 API 文档请访问: `http://localhost:3000/api` (开发环境)

---

## 🔧 环境变量

### 后端 (.env)

```env
# 数据库
DATABASE_URL="postgresql://user:password@localhost:5432/luoping_web?schema=public"

# JWT
JWT_SECRET="至少32字符的强密钥"
JWT_EXPIRES_IN="7d"

# Redis (可选)
REDIS_HOST="localhost"
REDIS_PORT=6379
REDIS_PASSWORD=""
REDIS_DB=0
REDIS_ENABLED="true"

# 应用
PORT=3000
NODE_ENV="production"

# CORS
ALLOWED_ORIGINS="https://yourdomain.com,https://admin.yourdomain.com"
```

### 前端 (.env)

```env
VITE_API_BASE_URL=https://api.yourdomain.com
```

### 管理后台 (.env)

```env
VITE_API_BASE_URL=https://api.yourdomain.com
```

---

## 📚 相关文档

- [部署文档](./docs/DEPLOYMENT.md)
- [优化记录](./docs/OPTIMIZATION.md)
- [项目结构](./docs/PROJECT_STRUCTURE.md)

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

## 📄 许可证

MIT License

---

## 📞 联系方式

- **微信**: LP20241688
- **GitHub**: [markrobt28-ui/luopingweb](https://github.com/markrobt28-ui/luopingweb)

---

## 🎯 开发路线图

- [ ] 添加单元测试和集成测试
- [ ] 实现全文搜索功能
- [ ] 添加邮件通知系统
- [ ] 实现图片 CDN 集成
- [ ] 添加性能监控
- [ ] 实现 WebSocket 实时通知
- [ ] 多语言支持 (i18n)
- [ ] 移动端 App

---

**⭐ 如果这个项目对你有帮助，请给个 Star！**
