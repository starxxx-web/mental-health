# 心理健康AI辅导平台

一个功能完整、设计优雅的AI驱动心理健康服务系统，集成了智能对话、心理评估、个性化治疗计划生成等功能。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node.js](https://img.shields.io/badge/node.js-22.13.0-green.svg)
![React](https://img.shields.io/badge/react-19-blue.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.9.3-blue.svg)

## ✨ 核心特性

### 🤖 AI智能对话
- 基于先进大语言模型的专业心理咨询
- 温暖同理的对话风格
- 支持文字和语音输入
- 完整的对话历史记录

### 🧠 心理状态评估
- 通过AI分析对话内容
- 多维度心理状态分析
- 严重程度自动评级
- 详细的评估报告生成

### 💚 个性化治疗计划
- 根据评估结果定制治疗方案
- 明确的治疗目标和具体活动
- 进度跟踪和管理
- 文档下载和分享

### 🎤 语音功能
- 实时语音转文字
- 高精度语音识别
- 多语言支持
- 音频文件保存

### 🔔 智能提醒
- 定期心理健康检查提醒
- 关怀消息推送
- 长期未登录关怀通知
- 自定义提醒频率

### 🔒 隐私保护
- 数据加密存储
- HTTPS安全传输
- 访问权限控制
- 云端安全备份

## 🚀 快速开始

### 前置要求

- Node.js 22.13.0 或更高版本
- pnpm 10.15.1 或更高版本
- MySQL 8.0+ 或 TiDB
- Git

### 安装步骤

1. **克隆项目**

```bash
git clone https://github.com/starxxx-web/mental-health.git
cd mental-health-assistant
```

2. **安装依赖**

```bash
pnpm install
```

3. **配置环境变量**

```bash
cp .env.example .env
# 编辑 .env 文件，填入必要的配置
```

4. **初始化数据库**

```bash
pnpm db:push
```

5. **启动开发服务器**

```bash
pnpm dev
```

访问 http://localhost:3000 即可使用应用。

## 📁 项目结构

```
mental-health-assistant/
├── client/                 # 前端应用
│   ├── src/
│   │   ├── pages/         # 页面组件
│   │   ├── components/    # 可复用组件
│   │   ├── contexts/      # React上下文
│   │   ├── hooks/         # 自定义Hook
│   │   ├── lib/           # 工具库
│   │   ├── App.tsx        # 主应用组件
│   │   ├── main.tsx       # 入口文件
│   │   └── index.css      # 全局样式
│   ├── public/            # 静态资源
│   └── index.html         # HTML模板
├── server/                # 后端应用
│   ├── routers.ts         # tRPC路由定义
│   ├── db.ts              # 数据库查询函数
│   ├── voiceRouter.ts     # 语音处理路由
│   ├── treatmentPlanGenerator.ts  # 治疗计划生成
│   ├── reminderService.ts # 提醒服务
│   ├── _core/             # 核心框架代码
│   └── *.test.ts          # 单元测试
├── drizzle/               # 数据库架构
│   └── schema.ts          # 表定义
├── shared/                # 共享代码
├── storage/               # S3存储配置
├── DEPLOYMENT.md          # 部署文档
├── README.md              # 本文件
├── package.json           # 项目配置
└── tsconfig.json          # TypeScript配置
```

## 🛠️ 技术栈

### 前端
- **React 19** - UI框架
- **Tailwind CSS 4** - 样式系统
- **tRPC** - 类型安全的API调用
- **shadcn/ui** - UI组件库
- **Wouter** - 路由管理
- **Framer Motion** - 动画库

### 后端
- **Node.js** - 运行时环境
- **Express 4** - Web框架
- **tRPC 11** - API框架
- **Drizzle ORM** - 数据库ORM
- **MySQL/TiDB** - 数据库

### AI & 云服务
- **大语言模型** - 智能对话和分析
- **Whisper API** - 语音转文字
- **AWS S3** - 文件存储
- **Manus OAuth** - 用户认证

### 开发工具
- **TypeScript** - 类型系统
- **Vitest** - 单元测试
- **Vite** - 构建工具
- **Prettier** - 代码格式化

## 📖 使用指南

### 用户流程

1. **登录认证** - 通过Manus OAuth进行安全认证
2. **开始对话** - 与AI心理顾问进行深度交流
3. **生成评估** - AI分析对话内容，生成评估报告
4. **制定计划** - 基于评估结果，生成个性化治疗计划
5. **跟踪进度** - 记录治疗进展，定期提醒和关怀

### 主要页面

| 页面 | 路由 | 功能 |
|------|------|------|
| 首页 | `/` | 平台介绍和功能入口 |
| 对话页面 | `/chat` | AI对话和心理咨询 |
| 评估报告 | `/assessments` | 查看心理评估报告 |
| 治疗计划 | `/treatment-plans` | 查看个性化治疗计划 |
| 功能展示 | `/demo` | 交互式功能演示 |

## 🧪 测试

```bash
# 运行所有测试
pnpm test

# 运行特定测试文件
pnpm test server/conversation.test.ts

# 监听模式
pnpm test --watch

# 生成覆盖率报告
pnpm test --coverage
```

## 🏗️ 构建与部署

### 开发构建

```bash
pnpm dev
```

### 生产构建

```bash
# 构建应用
pnpm build

# 启动生产服务
pnpm start
```

### 部署选项

1. **Manus平台**（推荐）- 一键部署，自动HTTPS
2. **Docker** - 容器化部署
3. **传统服务器** - 使用PM2 + Nginx

详见 [DEPLOYMENT.md](./DEPLOYMENT.md) 获取详细部署指南。

## 🔐 安全特性

- ✅ 用户认证和授权
- ✅ 数据加密存储
- ✅ HTTPS安全传输
- ✅ SQL注入防护
- ✅ CSRF防护
- ✅ 速率限制
- ✅ 隐私数据保护

## 📊 数据库架构

### 核心表

| 表名 | 说明 |
|------|------|
| `users` | 用户基本信息 |
| `userProfiles` | 用户偏好设置 |
| `conversations` | 对话会话 |
| `messages` | 对话消息 |
| `assessments` | 心理评估 |
| `treatmentPlans` | 治疗计划 |
| `reminders` | 提醒记录 |

## 🐛 故障排查

### 常见问题

**Q: 数据库连接失败**
A: 检查 `DATABASE_URL` 环境变量和MySQL服务是否运行

**Q: OAuth认证失败**
A: 验证 `VITE_APP_ID` 和 `OAUTH_SERVER_URL` 配置

**Q: 端口被占用**
A: 使用 `PORT=3001 pnpm dev` 更换端口

更多问题见 [DEPLOYMENT.md](./DEPLOYMENT.md#故障排查)

## 📝 环境变量

```env
# 数据库
DATABASE_URL=mysql://user:password@localhost:3306/mental_health

# 认证
JWT_SECRET=your_jwt_secret_key_here

# Manus配置
VITE_APP_ID=your_app_id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://login.manus.im

# API配置
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=your_api_key

# 应用配置
VITE_APP_TITLE=心理健康AI辅导平台
NODE_ENV=development
```

## 📚 文档

- [部署指南](./DEPLOYMENT.md) - 详细的部署说明
- [API文档](./docs/API.md) - tRPC API参考
- [数据库架构](./docs/DATABASE.md) - 数据库设计文档

## 🤝 贡献

欢迎提交Issue和Pull Request！

## 📄 许可证

MIT License - 详见 [LICENSE](./LICENSE) 文件

## 👥 联系方式

- GitHub Issues: [提交问题](https://github.com/starxxx-web/mental-health/issues)
- 邮件: support@example.com
- 官网: https://example.com

## 🙏 致谢

感谢以下开源项目的支持：

- [React](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)
- [Drizzle ORM](https://orm.drizzle.team)
- [shadcn/ui](https://ui.shadcn.com)

---

**版本**: 1.0.0  
**最后更新**: 2026年2月1日  
**维护者**: starxxx-web
