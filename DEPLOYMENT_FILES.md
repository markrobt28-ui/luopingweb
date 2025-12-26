# 服务器部署文件上传清单

## 📦 需要上传到 Debian 服务器的文件

### 1️⃣ 后端 (Backend - NestJS)

```
后端根目录/
├── src/                          # 源代码目录（必需）
├── prisma/                       # Prisma 配置和迁移
│   ├── schema.prisma            # 数据库模型
│   └── seed.ts                  # 种子数据
├── scripts/                      # 脚本文件
├── package.json                  # 依赖配置（必需）
├── package-lock.json            # 锁定依赖版本（必需）
├── tsconfig.json                # TypeScript 配置（必需）
├── nest-cli.json                # NestJS CLI 配置（必需）
├── .eslintrc.js                 # ESLint 配置
├── .prettierrc                  # Prettier 配置
└── .env                         # 环境变量（需手动创建，不要上传 .env.example）

❌ 不要上传：
- node_modules/                  # 依赖包（服务器上 npm install）
- dist/                          # 编译输出（服务器上 npm run build）
- uploads/                       # 上传文件（运行时生成）
- .git/                          # Git 仓库
```

### 2️⃣ 前端 (Frontend - React + Vite)

```
frontend/
├── src/                         # 源代码目录（必需）
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── contexts/
│   ├── data/
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   └── vite-env.d.ts
├── public/                      # 静态资源（如果有）
├── index.html                   # HTML 模板（必需）
├── package.json                 # 依赖配置（必需）
├── package-lock.json           # 锁定依赖版本（必需）
├── tsconfig.json               # TypeScript 配置（必需）
├── vite.config.ts              # Vite 配置（必需）
├── tailwind.config.js          # Tailwind 配置（必需）
├── postcss.config.js           # PostCSS 配置（必需）
├── eslint.config.js            # ESLint 配置
└── .env                        # 环境变量（需手动创建）

❌ 不要上传：
- node_modules/                 # 依赖包（服务器上 npm install）
- dist/                         # 构建输出（服务器上 npm run build）
- .git/                         # Git 仓库
```

### 3️⃣ 管理后台 (Admin - React + Vite)

```
admin/
├── src/                        # 源代码目录（必需）
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── contexts/
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   └── config.ts
├── index.html                  # HTML 模板（必需）
├── package.json                # 依赖配置（必需）
├── package-lock.json          # 锁定依赖版本（必需）
├── tsconfig.json              # TypeScript 配置（必需）
├── tsconfig.node.json         # Node TypeScript 配置（必需）
├── vite.config.ts             # Vite 配置（必需）
├── vite-env.d.ts              # Vite 类型定义（必需）
├── tailwind.config.js         # Tailwind 配置（必需）
├── postcss.config.js          # PostCSS 配置（必需）
└── .env                       # 环境变量（需手动创建）

❌ 不要上传：
- node_modules/                # 依赖包（服务器上 npm install）
- dist/                        # 构建输出（服务器上 npm run build）
- .git/                        # Git 仓库
```

---

## 📋 推荐的上传目录结构

在服务器上创建如下目录结构：

```
/var/www/luoping-web/           # 项目根目录
├── backend/                    # 后端代码
│   ├── src/
│   ├── prisma/
│   ├── scripts/
│   ├── package.json
│   ├── package-lock.json
│   ├── tsconfig.json
│   ├── nest-cli.json
│   └── .env                    # 手动创建
│
├── frontend/                   # 前端代码
│   ├── src/
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── .env                    # 手动创建
│
└── admin/                      # 管理后台代码
    ├── src/
    ├── index.html
    ├── package.json
    ├── package-lock.json
    ├── tsconfig.json
    ├── tsconfig.node.json
    ├── vite.config.ts
    ├── vite-env.d.ts
    ├── tailwind.config.js
    ├── postcss.config.js
    └── .env                    # 手动创建
```

---

## 🚀 上传方式建议

### 方式 1: 使用 Git（推荐）

```bash
# 在服务器上直接克隆
cd /var/www
git clone https://github.com/markrobt28-ui/luopingweb.git luoping-web
cd luoping-web

# 创建环境变量文件
cp .env.example .env
cp frontend/.env.example frontend/.env
cp admin/.env.example admin/.env

# 编辑环境变量
nano .env
nano frontend/.env
nano admin/.env
```

### 方式 2: 使用 SCP/SFTP

```bash
# 从本地上传到服务器
scp -r backend/ user@your-server:/var/www/luoping-web/
scp -r frontend/ user@your-server:/var/www/luoping-web/
scp -r admin/ user@your-server:/var/www/luoping-web/
```

### 方式 3: 使用 rsync（推荐，支持增量同步）

```bash
# 后端
rsync -avz --exclude 'node_modules' --exclude 'dist' --exclude '.git' \
  ./ user@your-server:/var/www/luoping-web/backend/

# 前端
rsync -avz --exclude 'node_modules' --exclude 'dist' --exclude '.git' \
  ./frontend/ user@your-server:/var/www/luoping-web/frontend/

# 管理后台
rsync -avz --exclude 'node_modules' --exclude 'dist' --exclude '.git' \
  ./admin/ user@your-server:/var/www/luoping-web/admin/
```

---

## ⚙️ 服务器上需要手动创建的文件

### 1. 后端 .env 文件

```bash
# /var/www/luoping-web/backend/.env
DATABASE_URL="postgresql://user:password@localhost:5432/luoping_web?schema=public"
JWT_SECRET="your-production-secret-key-min-32-characters-long"
JWT_EXPIRES_IN="7d"
REDIS_HOST="localhost"
REDIS_PORT=6379
REDIS_PASSWORD=""
REDIS_DB=0
REDIS_ENABLED="true"
PORT=3000
NODE_ENV="production"
ALLOWED_ORIGINS="https://yourdomain.com,https://admin.yourdomain.com"
```

### 2. 前端 .env 文件

```bash
# /var/www/luoping-web/frontend/.env
VITE_API_BASE_URL=https://api.yourdomain.com
```

### 3. 管理后台 .env 文件

```bash
# /var/www/luoping-web/admin/.env
VITE_API_BASE_URL=https://api.yourdomain.com
```

---

## 📝 上传后的部署步骤（参考）

```bash
# 1. 后端部署
cd /var/www/luoping-web/backend
npm install
npx prisma generate
npx prisma migrate deploy
npm run build
pm2 start dist/main.js --name luoping-backend

# 2. 前端部署
cd /var/www/luoping-web/frontend
npm install
npm run build
# 将 dist/ 目录配置到 Nginx

# 3. 管理后台部署
cd /var/www/luoping-web/admin
npm install
npm run build
# 将 dist/ 目录配置到 Nginx
```

---

## ✅ 上传前检查清单

- [ ] 确认 .gitignore 正确配置（不上传 node_modules, dist, .env）
- [ ] 准备好生产环境的环境变量配置
- [ ] 确认服务器已安装 Node.js (v18+)
- [ ] 确认服务器已安装 PostgreSQL
- [ ] 确认服务器已安装 Redis（可选）
- [ ] 确认服务器已安装 Nginx
- [ ] 确认服务器已安装 PM2（用于后端进程管理）

---

## 📦 压缩打包上传（可选）

如果网络较慢，可以先打包再上传：

```bash
# 在本地打包
tar -czf backend.tar.gz \
  --exclude='node_modules' \
  --exclude='dist' \
  --exclude='.git' \
  src/ prisma/ scripts/ package*.json tsconfig.json nest-cli.json .eslintrc.js .prettierrc

tar -czf frontend.tar.gz \
  --exclude='node_modules' \
  --exclude='dist' \
  --exclude='.git' \
  -C frontend .

tar -czf admin.tar.gz \
  --exclude='node_modules' \
  --exclude='dist' \
  --exclude='.git' \
  -C admin .

# 上传到服务器
scp backend.tar.gz user@your-server:/var/www/luoping-web/
scp frontend.tar.gz user@your-server:/var/www/luoping-web/
scp admin.tar.gz user@your-server:/var/www/luoping-web/

# 在服务器上解压
cd /var/www/luoping-web
tar -xzf backend.tar.gz -C backend/
tar -xzf frontend.tar.gz -C frontend/
tar -xzf admin.tar.gz -C admin/
```
