#!/bin/bash

# Debian 系统一键部署脚本
# 使用方法: sudo bash deploy.sh

set -e

echo "================================"
echo "工具箱平台部署脚本"
echo "================================"
echo ""

# 检查是否为 root 用户
if [ "$EUID" -ne 0 ]; then 
    echo "请使用 sudo 运行此脚本"
    exit 1
fi

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 配置变量
APP_USER="toolbox"
BACKEND_DIR="/var/www/toolbox-backend"
FRONTEND_DIR="/var/www/toolbox-frontend"
ADMIN_DIR="/var/www/toolbox-admin"
DB_NAME="toolbox"
DB_USER="toolbox_user"

echo -e "${GREEN}步骤 1/10: 更新系统${NC}"
apt update && apt upgrade -y

echo -e "${GREEN}步骤 2/10: 安装基础工具${NC}"
apt install -y curl wget git build-essential

echo -e "${GREEN}步骤 3/10: 安装 Node.js 18${NC}"
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt install -y nodejs
fi
echo "Node.js 版本: $(node --version)"
echo "npm 版本: $(npm --version)"

echo -e "${GREEN}步骤 4/10: 安装 PostgreSQL${NC}"
if ! command -v psql &> /dev/null; then
    sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
    wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add -
    apt update
    apt install -y postgresql-15 postgresql-contrib-15
    systemctl start postgresql
    systemctl enable postgresql
fi

echo -e "${GREEN}步骤 5/10: 安装 Redis${NC}"
if ! command -v redis-cli &> /dev/null; then
    apt install -y redis-server
    systemctl start redis-server
    systemctl enable redis-server
fi

echo -e "${GREEN}步骤 6/10: 安装 Nginx${NC}"
if ! command -v nginx &> /dev/null; then
    apt install -y nginx
    systemctl start nginx
    systemctl enable nginx
fi

echo -e "${GREEN}步骤 7/10: 创建应用用户${NC}"
if ! id "$APP_USER" &>/dev/null; then
    useradd -m -s /bin/bash $APP_USER
    echo "用户 $APP_USER 已创建"
fi

echo -e "${GREEN}步骤 8/10: 创建应用目录${NC}"
mkdir -p $BACKEND_DIR $FRONTEND_DIR $ADMIN_DIR
chown -R $APP_USER:$APP_USER $BACKEND_DIR $FRONTEND_DIR $ADMIN_DIR

echo -e "${GREEN}步骤 9/10: 安装 PM2${NC}"
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2
fi

echo -e "${GREEN}步骤 10/10: 配置防火墙${NC}"
if command -v ufw &> /dev/null; then
    ufw --force enable
    ufw allow 22/tcp
    ufw allow 80/tcp
    ufw allow 443/tcp
    echo "防火墙已配置"
fi

echo ""
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}基础环境安装完成！${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo -e "${YELLOW}接下来需要手动完成以下步骤：${NC}"
echo ""
echo "1. 配置数据库："
echo "   sudo -u postgres psql"
echo "   CREATE DATABASE $DB_NAME;"
echo "   CREATE USER $DB_USER WITH PASSWORD 'your_password';"
echo "   GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"
echo "   \\q"
echo ""
echo "2. 上传代码到以下目录："
echo "   后端: $BACKEND_DIR"
echo "   前端: $FRONTEND_DIR"
echo "   管理后台: $ADMIN_DIR"
echo ""
echo "3. 配置环境变量（.env 文件）"
echo ""
echo "4. 构建和启动应用："
echo "   详见 DEBIAN_DEPLOYMENT.md"
echo ""
echo -e "${GREEN}部署脚本执行完成！${NC}"
