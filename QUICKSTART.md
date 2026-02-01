# 快速开始指南

5分钟内快速启动心理健康AI辅导平台。

## 前置条件

- ✅ Node.js 22.13.0+
- ✅ pnpm 10.15.1+
- ✅ MySQL 8.0+ 或 Docker
- ✅ Git

## 步骤1: 克隆项目

```bash
git clone https://github.com/starxxx-web/mental-health.git
cd mental-health-assistant
```

## 步骤2: 安装依赖

```bash
pnpm install
```

## 步骤3: 启动数据库

### 选项A: 使用Docker（推荐）

```bash
docker run -d \
  --name mental-health-db \
  -e MYSQL_ROOT_PASSWORD=root123 \
  -e MYSQL_DATABASE=mental_health \
  -p 3306:3306 \
  mysql:8.0
```

### 选项B: 使用本地MySQL

```bash
# 创建数据库
mysql -u root -p -e "CREATE DATABASE mental_health;"

# 创建用户
mysql -u root -p -e "CREATE USER 'mental_user'@'localhost' IDENTIFIED BY 'password123';"
mysql -u root -p -e "GRANT ALL PRIVILEGES ON mental_health.* TO 'mental_user'@'localhost';"
```

## 步骤4: 配置环境变量

创建 `.env` 文件：

```bash
cat > .env << 'EOF'
# 数据库
DATABASE_URL="mysql://root:root123@localhost:3306/mental_health"

# JWT密钥（随意填写，生产环境应该使用强密钥）
JWT_SECRET="dev_secret_key_12345678901234567890"

# Manus OAuth（从Manus控制台获取）
VITE_APP_ID="your_app_id"
OAUTH_SERVER_URL="https://api.manus.im"
VITE_OAUTH_PORTAL_URL="https://login.manus.im"

# Manus API
BUILT_IN_FORGE_API_URL="https://api.manus.im"
BUILT_IN_FORGE_API_KEY="your_api_key"
VITE_FRONTEND_FORGE_API_URL="https://api.manus.im"
VITE_FRONTEND_FORGE_API_KEY="your_frontend_key"

# 应用配置
VITE_APP_TITLE="心理健康AI辅导平台"
NODE_ENV="development"

# 所有者信息
OWNER_NAME="Developer"
OWNER_OPEN_ID="dev_user"
EOF
```

## 步骤5: 初始化数据库

```bash
pnpm db:push
```

## 步骤6: 启动开发服务器

```bash
pnpm dev
```

## 步骤7: 访问应用

打开浏览器访问：

```
http://localhost:3000
```

🎉 完成！应用已启动。

---

## 常见问题

### Q: 数据库连接失败

**A:** 检查以下内容：

```bash
# 验证MySQL是否运行
docker ps | grep mental-health-db

# 测试连接
mysql -h 127.0.0.1 -u root -p -e "SELECT 1;"

# 检查DATABASE_URL
echo $DATABASE_URL
```

### Q: 端口3000被占用

**A:** 使用不同的端口：

```bash
PORT=3001 pnpm dev
```

### Q: 依赖安装失败

**A:** 清除缓存重试：

```bash
pnpm store prune
pnpm install --force
```

### Q: OAuth认证失败

**A:** 确保已配置Manus OAuth凭证：

1. 登录 [Manus控制台](https://console.manus.im)
2. 创建应用
3. 复制 App ID 和 API Key
4. 更新 `.env` 文件

---

## 下一步

- 📖 阅读 [README.md](./README.md) 了解项目详情
- 🚀 查看 [DEPLOYMENT.md](./DEPLOYMENT.md) 学习部署
- 📚 查看 [API文档](./docs/API.md) 了解API
- 🧪 运行测试：`pnpm test`

---

## 项目结构速览

```
mental-health-assistant/
├── client/          # React前端应用
├── server/          # Node.js后端服务
├── drizzle/         # 数据库架构
├── .env             # 环境变量配置
├── package.json     # 项目配置
└── README.md        # 项目文档
```

## 常用命令

```bash
pnpm dev            # 启动开发服务器
pnpm build          # 生产构建
pnpm start          # 启动生产服务
pnpm test           # 运行测试
pnpm check          # TypeScript检查
pnpm format         # 代码格式化
pnpm db:push        # 推送数据库迁移
```

---

**需要帮助？** 查看 [DEPLOYMENT.md](./DEPLOYMENT.md#故障排查) 的故障排查部分。
