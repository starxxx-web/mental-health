# 心理健康AI辅导平台 - 部署文档

## 目录

1. [项目概述](#项目概述)
2. [系统要求](#系统要求)
3. [本地开发环境搭建](#本地开发环境搭建)
4. [数据库配置](#数据库配置)
5. [环境变量配置](#环境变量配置)
6. [构建与运行](#构建与运行)
7. [生产环境部署](#生产环境部署)
8. [故障排查](#故障排查)
9. [监控与维护](#监控与维护)

---

## 项目概述

**心理健康AI辅导平台**是一个功能完整的AI驱动心理健康服务系统，集成了以下核心功能：

- **AI智能对话**：基于大语言模型的专业心理咨询
- **心理状态评估**：自动分析用户心理状态并生成评估报告
- **个性化治疗计划**：根据评估结果生成定制化治疗方案
- **语音输入**：支持语音转文字功能
- **智能提醒**：定期提醒和关怀通知
- **云端存储**：安全的文档存储和下载

### 技术栈

| 层级 | 技术 | 版本 |
|------|------|------|
| 前端 | React | 19 |
| 样式 | Tailwind CSS | 4 |
| 后端 | Node.js + Express | 22.13.0 |
| API | tRPC | 11 |
| 数据库 | MySQL/TiDB | - |
| ORM | Drizzle | 0.44.5 |
| 认证 | Manus OAuth | - |
| 存储 | AWS S3 | - |
| 测试 | Vitest | 2.1.4 |

---

## 系统要求

### 开发环境

- **操作系统**：Ubuntu 22.04 LTS 或更高版本（推荐）
- **Node.js**：v22.13.0 或更高版本
- **npm/pnpm**：pnpm 10.15.1 或更高版本
- **Git**：最新版本
- **数据库**：MySQL 8.0+ 或 TiDB

### 生产环境

- **服务器**：2核 CPU，4GB RAM 最低配置
- **存储**：20GB 磁盘空间（用于数据库和日志）
- **网络**：稳定的互联网连接，支持HTTPS

---

## 本地开发环境搭建

### 1. 克隆项目

```bash
git clone https://github.com/starxxx-web/mental-health.git
cd mental-health-assistant
```

### 2. 安装依赖

```bash
# 使用pnpm安装依赖
pnpm install

# 或使用npm
npm install
```

### 3. 安装全局工具

```bash
# 安装Drizzle CLI用于数据库迁移
pnpm add -g drizzle-kit

# 或
npm install -g drizzle-kit
```

### 4. 验证安装

```bash
# 检查Node.js版本
node --version

# 检查pnpm版本
pnpm --version

# 验证依赖安装
pnpm check
```

---

## 数据库配置

### 本地MySQL设置

#### 使用Docker快速启动MySQL

```bash
# 拉取MySQL镜像
docker pull mysql:8.0

# 启动MySQL容器
docker run -d \
  --name mental-health-db \
  -e MYSQL_ROOT_PASSWORD=root_password \
  -e MYSQL_DATABASE=mental_health \
  -p 3306:3306 \
  mysql:8.0

# 验证连接
mysql -h 127.0.0.1 -u root -p
```

#### 手动安装MySQL

```bash
# Ubuntu系统
sudo apt-get update
sudo apt-get install mysql-server

# 启动MySQL服务
sudo systemctl start mysql

# 登录MySQL
sudo mysql -u root

# 创建数据库和用户
CREATE DATABASE mental_health;
CREATE USER 'mental_user'@'localhost' IDENTIFIED BY 'strong_password';
GRANT ALL PRIVILEGES ON mental_health.* TO 'mental_user'@'localhost';
FLUSH PRIVILEGES;
```

### 数据库初始化

```bash
# 生成迁移文件
pnpm db:push

# 验证表结构
mysql -u mental_user -p mental_health -e "SHOW TABLES;"
```

### 数据库备份

```bash
# 备份数据库
mysqldump -u mental_user -p mental_health > backup_$(date +%Y%m%d_%H%M%S).sql

# 恢复数据库
mysql -u mental_user -p mental_health < backup_20260201_120000.sql
```

---

## 环境变量配置

### 创建 .env 文件

在项目根目录创建 `.env` 文件：

```bash
cp .env.example .env
```

### 配置环境变量

```env
# 数据库配置
DATABASE_URL="mysql://mental_user:strong_password@localhost:3306/mental_health"

# JWT密钥（用于会话管理）
JWT_SECRET="your_jwt_secret_key_here_minimum_32_characters"

# Manus OAuth配置
VITE_APP_ID="your_manus_app_id"
OAUTH_SERVER_URL="https://api.manus.im"
VITE_OAUTH_PORTAL_URL="https://login.manus.im"

# Manus API配置
BUILT_IN_FORGE_API_URL="https://api.manus.im"
BUILT_IN_FORGE_API_KEY="your_forge_api_key"
VITE_FRONTEND_FORGE_API_URL="https://api.manus.im"
VITE_FRONTEND_FORGE_API_KEY="your_frontend_api_key"

# 应用配置
VITE_APP_TITLE="心理健康AI辅导平台"
VITE_APP_LOGO="/logo.png"

# 分析配置（可选）
VITE_ANALYTICS_ENDPOINT="https://analytics.example.com"
VITE_ANALYTICS_WEBSITE_ID="your_website_id"

# 所有者信息
OWNER_NAME="Your Name"
OWNER_OPEN_ID="your_open_id"

# Node环境
NODE_ENV="development"
```

### 环境变量说明

| 变量名 | 说明 | 示例 |
|--------|------|------|
| DATABASE_URL | 数据库连接字符串 | mysql://user:pass@host:3306/db |
| JWT_SECRET | JWT签名密钥 | 至少32个字符的随机字符串 |
| VITE_APP_ID | Manus OAuth应用ID | 从Manus控制台获取 |
| NODE_ENV | 运行环境 | development/production |

---

## 构建与运行

### 开发模式

```bash
# 启动开发服务器（包含热重载）
pnpm dev

# 服务器将在 http://localhost:3000 启动
```

### 生产构建

```bash
# 构建前端和后端
pnpm build

# 检查构建输出
ls -la dist/

# 启动生产服务器
pnpm start
```

### 运行测试

```bash
# 运行所有测试
pnpm test

# 运行特定测试文件
pnpm test server/conversation.test.ts

# 监听模式（开发时使用）
pnpm test --watch
```

### 代码检查

```bash
# TypeScript类型检查
pnpm check

# 代码格式化
pnpm format

# 查看所有可用命令
pnpm run
```

---

## 生产环境部署

### 方案一：使用Manus平台部署（推荐）

Manus平台提供了一键部署功能，包含自动HTTPS、CDN加速等特性。

**部署步骤**：

1. 登录 [Manus管理面板](https://manus.im)
2. 创建新项目或选择现有项目
3. 连接GitHub仓库（starxxx-web/mental-health）
4. 配置环境变量
5. 点击"发布"按钮
6. 等待自动构建和部署完成

**优势**：
- 自动化部署流程
- 内置HTTPS支持
- 自动扩展和负载均衡
- 集成监控和日志

### 方案二：使用Docker容器部署

#### 创建Dockerfile

```dockerfile
# 构建阶段
FROM node:22-alpine AS builder

WORKDIR /app

# 复制依赖文件
COPY package.json pnpm-lock.yaml ./

# 安装依赖
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# 复制源代码
COPY . .

# 构建应用
RUN pnpm build

# 运行阶段
FROM node:22-alpine

WORKDIR /app

# 安装生产依赖
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --prod --frozen-lockfile

# 复制构建产物
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/client/dist ./client/dist

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["node", "dist/index.js"]
```

#### 构建和运行Docker镜像

```bash
# 构建镜像
docker build -t mental-health-assistant:latest .

# 运行容器
docker run -d \
  --name mental-health \
  -p 3000:3000 \
  -e DATABASE_URL="mysql://user:pass@db-host:3306/mental_health" \
  -e JWT_SECRET="your_jwt_secret" \
  -e NODE_ENV="production" \
  mental-health-assistant:latest

# 查看容器日志
docker logs -f mental-health
```

### 方案三：使用传统服务器部署

#### 使用PM2进程管理

```bash
# 安装PM2
npm install -g pm2

# 创建PM2配置文件 ecosystem.config.js
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: 'mental-health-api',
      script: './dist/index.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: './logs/error.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    }
  ]
};
EOF

# 启动应用
pm2 start ecosystem.config.js

# 设置开机自启
pm2 startup
pm2 save

# 查看应用状态
pm2 status

# 查看日志
pm2 logs mental-health-api
```

#### 使用Nginx反向代理

```nginx
# /etc/nginx/sites-available/mental-health
upstream mental_health_backend {
    server 127.0.0.1:3000;
    keepalive 64;
}

server {
    listen 80;
    listen [::]:80;
    server_name your-domain.com;

    # 重定向到HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name your-domain.com;

    # SSL证书配置（使用Let's Encrypt）
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # SSL安全配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # 日志
    access_log /var/log/nginx/mental-health-access.log;
    error_log /var/log/nginx/mental-health-error.log;

    # 代理配置
    location / {
        proxy_pass http://mental_health_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # 静态文件缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

启用配置：

```bash
# 创建符号链接
sudo ln -s /etc/nginx/sites-available/mental-health /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启Nginx
sudo systemctl restart nginx
```

---

## 故障排查

### 常见问题

#### 1. 数据库连接失败

**症状**：`Error: connect ECONNREFUSED 127.0.0.1:3306`

**解决方案**：

```bash
# 检查MySQL服务状态
sudo systemctl status mysql

# 启动MySQL服务
sudo systemctl start mysql

# 验证连接字符串
echo $DATABASE_URL

# 测试数据库连接
mysql -u mental_user -p -h localhost -D mental_health
```

#### 2. 端口被占用

**症状**：`Error: listen EADDRINUSE :::3000`

**解决方案**：

```bash
# 查找占用3000端口的进程
lsof -i :3000

# 杀死进程
kill -9 <PID>

# 或使用不同的端口
PORT=3001 pnpm dev
```

#### 3. 依赖安装失败

**症状**：`npm ERR! code ERESOLVE`

**解决方案**：

```bash
# 清除缓存
pnpm store prune

# 重新安装
pnpm install --force

# 或使用npm
npm cache clean --force
npm install
```

#### 4. 构建失败

**症状**：`error TS2322: Type 'X' is not assignable to type 'Y'`

**解决方案**：

```bash
# 检查TypeScript配置
pnpm check

# 清除构建缓存
rm -rf dist/ .turbo/

# 重新构建
pnpm build
```

#### 5. OAuth认证失败

**症状**：`Error: Invalid OAuth credentials`

**解决方案**：

```bash
# 验证环境变量
echo "VITE_APP_ID: $VITE_APP_ID"
echo "OAUTH_SERVER_URL: $OAUTH_SERVER_URL"

# 检查Manus API可用性
curl -I https://api.manus.im

# 更新OAuth配置
# 1. 登录Manus管理面板
# 2. 检查应用ID和密钥
# 3. 验证回调URL配置
```

### 日志查看

```bash
# 开发环境日志
pnpm dev 2>&1 | tee app.log

# 生产环境日志（PM2）
pm2 logs mental-health-api

# 系统日志
journalctl -u mental-health -f

# Nginx日志
tail -f /var/log/nginx/mental-health-access.log
tail -f /var/log/nginx/mental-health-error.log
```

---

## 监控与维护

### 性能监控

#### 使用PM2 Plus

```bash
# 安装PM2 Plus
pm2 install pm2-auto-pull

# 连接到PM2 Plus
pm2 link <secret_key> <public_key>

# 查看实时监控
pm2 monit
```

#### 使用系统监控工具

```bash
# 实时查看系统资源
top

# 查看磁盘使用情况
df -h

# 查看内存使用
free -h

# 查看网络连接
netstat -an | grep ESTABLISHED | wc -l
```

### 数据库维护

#### 定期备份

```bash
# 创建备份脚本
cat > backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/backups/mental-health"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/mental_health_$DATE.sql"

mkdir -p $BACKUP_DIR

mysqldump -u mental_user -p$DB_PASSWORD mental_health > $BACKUP_FILE

# 删除7天前的备份
find $BACKUP_DIR -name "mental_health_*.sql" -mtime +7 -delete

echo "Backup completed: $BACKUP_FILE"
EOF

chmod +x backup.sh

# 添加到crontab（每天凌晨2点执行）
crontab -e
# 添加: 0 2 * * * /path/to/backup.sh
```

#### 数据库优化

```bash
# 连接到数据库
mysql -u mental_user -p mental_health

# 优化表
OPTIMIZE TABLE conversations;
OPTIMIZE TABLE messages;
OPTIMIZE TABLE assessments;

# 检查表完整性
CHECK TABLE conversations;

# 修复表
REPAIR TABLE conversations;
```

### 安全维护

#### SSL证书更新

```bash
# 使用Let's Encrypt自动更新
sudo certbot renew --dry-run

# 手动更新
sudo certbot renew

# 自动更新（crontab）
0 3 * * * /usr/bin/certbot renew --quiet
```

#### 依赖更新

```bash
# 检查过期的依赖
pnpm outdated

# 更新依赖
pnpm update

# 安全审计
pnpm audit

# 修复安全漏洞
pnpm audit --fix
```

### 定期检查清单

- [ ] 数据库备份是否成功
- [ ] SSL证书有效期
- [ ] 系统磁盘空间使用率 < 80%
- [ ] 内存使用率正常
- [ ] 应用进程运行正常
- [ ] 日志文件大小合理
- [ ] 依赖包安全性
- [ ] 数据库性能指标

---

## 附录

### 有用的命令

```bash
# 项目管理
pnpm install          # 安装依赖
pnpm dev              # 开发模式
pnpm build            # 生产构建
pnpm start            # 启动生产服务
pnpm test             # 运行测试
pnpm check            # TypeScript检查
pnpm format           # 代码格式化

# 数据库管理
pnpm db:push          # 推送迁移
pnpm db:pull          # 拉取架构

# Git操作
git clone <repo>      # 克隆仓库
git pull              # 拉取最新代码
git push              # 推送代码
git log               # 查看提交历史
```

### 相关资源

- [Manus官方文档](https://docs.manus.im)
- [React 19文档](https://react.dev)
- [Tailwind CSS文档](https://tailwindcss.com)
- [tRPC文档](https://trpc.io)
- [Drizzle ORM文档](https://orm.drizzle.team)
- [MySQL官方文档](https://dev.mysql.com/doc/)
- [Docker文档](https://docs.docker.com)
- [Nginx文档](https://nginx.org/en/docs/)

### 联系支持

如遇到问题，请：

1. 查看项目GitHub Issues
2. 提交问题报告
3. 联系Manus技术支持

---

**最后更新**：2026年2月1日
**文档版本**：1.0
