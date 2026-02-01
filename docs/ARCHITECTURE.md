# 心理健康AI辅导平台 - 架构设计与搭建思路

## 目录

1. [项目概述](#项目概述)
2. [架构设计](#架构设计)
3. [技术选型理由](#技术选型理由)
4. [核心模块设计](#核心模块设计)
5. [数据流设计](#数据流设计)
6. [开发流程](#开发流程)
7. [扩展性考虑](#扩展性考虑)

---

## 项目概述

### 产品定位

**心理健康AI辅导平台**是一个SaaS应用，为用户提供AI驱动的心理健康咨询服务。核心价值在于：

- 🤖 **AI智能化** - 利用大语言模型提供24/7的心理咨询
- 📊 **数据驱动** - 通过对话分析生成科学的心理评估
- 🎯 **个性化** - 根据用户状态生成定制化治疗方案
- 🔒 **隐私保护** - 确保用户心理健康数据的安全

### 用户场景

```
用户 → 登录 → 开始对话 → AI分析 → 生成评估 → 制定计划 → 跟踪进度
```

---

## 架构设计

### 整体架构

```
┌─────────────────────────────────────────────────────────────┐
│                     用户浏览器 (Client)                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  React 19 + Tailwind CSS 4 + shadcn/ui              │  │
│  │  - 响应式UI组件                                      │  │
│  │  - 实时状态管理                                      │  │
│  │  - 优雅的交互体验                                    │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTPS + tRPC
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  后端服务器 (Server)                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Node.js + Express + tRPC                            │  │
│  │  - API路由和业务逻辑                                 │  │
│  │  - 用户认证和授权                                    │  │
│  │  - AI模型调用                                        │  │
│  │  - 数据处理和验证                                    │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  业务模块                                            │  │
│  │  - 对话管理 (Conversation)                           │  │
│  │  - 心理评估 (Assessment)                             │  │
│  │  - 治疗计划 (Treatment Plan)                         │  │
│  │  - 提醒通知 (Reminder)                               │  │
│  │  - 语音处理 (Voice)                                  │  │
│  └──────────────────────────────────────────────────────┘  │
└────────┬──────────┬──────────┬──────────┬──────────────────┘
         │          │          │          │
         ▼          ▼          ▼          ▼
    ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
    │ MySQL  │ │ S3存储 │ │LLM API │ │OAuth   │
    │ 数据库 │ │ 文件   │ │ AI模型 │ │ 认证   │
    └────────┘ └────────┘ └────────┘ └────────┘
```

### 分层架构

```
┌──────────────────────────────────────────┐
│         表现层 (Presentation)             │
│  - React组件                             │
│  - 页面路由                              │
│  - 用户交互                              │
└──────────────────────────────────────────┘
                    ▲
                    │ tRPC调用
                    ▼
┌──────────────────────────────────────────┐
│         业务逻辑层 (Business Logic)       │
│  - 对话处理                              │
│  - 心理评估                              │
│  - 治疗计划生成                          │
│  - 提醒管理                              │
└──────────────────────────────────────────┘
                    ▲
                    │ 数据访问
                    ▼
┌──────────────────────────────────────────┐
│         数据访问层 (Data Access)         │
│  - Drizzle ORM                           │
│  - 数据库查询                            │
│  - 缓存管理                              │
└──────────────────────────────────────────┘
                    ▲
                    │ SQL
                    ▼
┌──────────────────────────────────────────┐
│         数据存储层 (Data Storage)        │
│  - MySQL数据库                           │
│  - S3对象存储                            │
│  - 缓存存储                              │
└──────────────────────────────────────────┘
```

---

## 技术选型理由

### 前端技术栈

#### React 19

**为什么选择React？**

- ✅ **组件化开发** - 提高代码复用性和可维护性
- ✅ **虚拟DOM** - 高效的性能优化
- ✅ **生态完善** - 丰富的第三方库支持
- ✅ **学习资源丰富** - 大量教程和文档

**核心概念**：

```typescript
// 函数式组件
function ChatBox() {
  const [messages, setMessages] = useState([]);
  
  useEffect(() => {
    // 副作用处理
    loadMessages();
  }, []);
  
  return <div>{/* JSX模板 */}</div>;
}
```

**学习路径**：
1. JSX语法和组件基础
2. State和Props管理
3. Hooks（useState、useEffect、useContext等）
4. 性能优化（React.memo、useMemo、useCallback）
5. 错误边界和Suspense

#### Tailwind CSS 4

**为什么选择Tailwind？**

- ✅ **原子化CSS** - 快速构建UI，无需写CSS
- ✅ **一致的设计系统** - 统一的颜色、间距、字体
- ✅ **响应式设计** - 内置移动端优先的响应式支持
- ✅ **深色模式** - 原生支持主题切换

**核心概念**：

```html
<!-- 使用工具类构建样式 -->
<div class="flex items-center justify-between p-4 bg-white rounded-lg shadow">
  <h1 class="text-2xl font-bold text-gray-900">标题</h1>
  <button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
    按钮
  </button>
</div>
```

**学习路径**：
1. 工具类基础（flex、grid、margin、padding等）
2. 响应式设计（sm:、md:、lg:等断点）
3. 状态变体（hover:、focus:、active:等）
4. 自定义配置（tailwind.config.js）
5. 组件提取和复用

#### tRPC

**为什么选择tRPC？**

- ✅ **端到端类型安全** - 前后端共享类型定义
- ✅ **自动API生成** - 无需手写REST路由
- ✅ **完整的IDE支持** - 代码补全和类型检查
- ✅ **简化的数据获取** - 比Axios/Fetch更简洁

**核心概念**：

```typescript
// 后端定义
export const appRouter = router({
  chat: router({
    sendMessage: protectedProcedure
      .input(z.object({ message: z.string() }))
      .mutation(async ({ ctx, input }) => {
        // 业务逻辑
        return { success: true };
      })
  })
});

// 前端使用 - 完全类型安全
const mutation = trpc.chat.sendMessage.useMutation();
mutation.mutate({ message: "Hello" }); // 类型检查
```

**学习路径**：
1. 过程定义（publicProcedure、protectedProcedure）
2. 输入验证（Zod schema）
3. 上下文（ctx）和中间件
4. 前端hooks（useQuery、useMutation）
5. 错误处理和类型推断

#### shadcn/ui

**为什么选择shadcn/ui？**

- ✅ **高质量组件** - 基于Radix UI的无样式组件
- ✅ **可定制性强** - 组件代码在项目中，可自由修改
- ✅ **与Tailwind完美配合** - 使用Tailwind进行样式
- ✅ **可访问性好** - 内置ARIA支持

**常用组件**：

```typescript
// Button、Card、Dialog、Form等
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>标题</CardTitle>
      </CardHeader>
      <Button>点击我</Button>
    </Card>
  );
}
```

**学习路径**：
1. 组件库浏览和使用
2. 组件定制和扩展
3. 组件组合模式
4. 主题配置

### 后端技术栈

#### Node.js + Express

**为什么选择Node.js？**

- ✅ **JavaScript全栈** - 前后端使用同一语言
- ✅ **异步I/O** - 高效处理并发请求
- ✅ **包管理完善** - npm/pnpm生态丰富
- ✅ **开发效率高** - 快速原型开发

**核心概念**：

```typescript
// Express服务器
import express from 'express';

const app = express();

// 中间件
app.use(express.json());
app.use(cors());

// 路由
app.get('/api/data', (req, res) => {
  res.json({ data: [] });
});

app.listen(3000, () => console.log('Server running'));
```

**学习路径**：
1. 异步编程（Promise、async/await）
2. Express基础（路由、中间件、错误处理）
3. HTTP协议和RESTful设计
4. 请求/响应处理
5. 性能优化和日志记录

#### Drizzle ORM

**为什么选择Drizzle？**

- ✅ **类型安全** - 完整的TypeScript支持
- ✅ **简洁的API** - 相比Sequelize更轻量
- ✅ **灵活的查询** - 支持复杂的SQL操作
- ✅ **迁移管理** - 内置数据库迁移工具

**核心概念**：

```typescript
// 定义表
export const users = mysqlTable('users', {
  id: int().autoincrement().primaryKey(),
  name: text(),
  email: varchar({ length: 320 }).unique(),
});

// 查询
const user = await db
  .select()
  .from(users)
  .where(eq(users.id, 1))
  .limit(1);

// 插入
await db.insert(users).values({
  name: 'John',
  email: 'john@example.com'
});
```

**学习路径**：
1. 表定义和数据类型
2. 基础查询（SELECT、INSERT、UPDATE、DELETE）
3. 关系和JOIN
4. 事务处理
5. 迁移和版本管理

#### MySQL/TiDB

**为什么选择MySQL？**

- ✅ **关系型数据库** - 适合结构化数据存储
- ✅ **ACID特性** - 数据一致性保证
- ✅ **广泛应用** - 业界标准，学习资源丰富
- ✅ **TiDB兼容** - 支持分布式扩展

**核心概念**：

```sql
-- 创建表
CREATE TABLE conversations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 查询
SELECT * FROM conversations WHERE user_id = 1;

-- 索引优化
CREATE INDEX idx_user_id ON conversations(user_id);
```

**学习路径**：
1. SQL基础（SELECT、INSERT、UPDATE、DELETE）
2. 表设计和规范化
3. 索引和查询优化
4. 事务和锁机制
5. 备份和恢复

### AI和云服务

#### 大语言模型集成

**核心功能**：

```typescript
// 调用LLM进行心理评估
const response = await invokeLLM({
  messages: [
    { 
      role: "system", 
      content: "你是一名专业的心理咨询师..." 
    },
    { 
      role: "user", 
      content: "我最近感到很焦虑" 
    }
  ],
  response_format: {
    type: "json_schema",
    json_schema: {
      name: "assessment",
      schema: {
        type: "object",
        properties: {
          mentalState: { type: "string" },
          severity: { type: "string" },
          analysis: { type: "string" }
        }
      }
    }
  }
});
```

**学习路径**：
1. LLM基础概念（Prompt、Temperature、Top-p等）
2. 提示工程（Prompt Engineering）
3. 结构化输出（JSON Schema）
4. 流式响应处理
5. 成本优化和速率限制

#### 语音转文字 (Whisper API)

**核心功能**：

```typescript
// 语音转文字
const result = await transcribeAudio({
  audioUrl: 'https://s3.example.com/audio.mp3',
  language: 'zh-CN',
  prompt: '心理咨询对话'
});

console.log(result.text); // 转换后的文字
```

**学习路径**：
1. 音频格式和编码
2. API调用和错误处理
3. 多语言支持
4. 精度优化

#### AWS S3 存储

**核心功能**：

```typescript
// 上传文件到S3
const { url } = await storagePut(
  'treatment-plans/user-123/plan.pdf',
  pdfBuffer,
  'application/pdf'
);

// 获取预签名URL
const { url: downloadUrl } = await storageGet(
  'treatment-plans/user-123/plan.pdf',
  3600 // 1小时过期
);
```

**学习路径**：
1. S3基本概念（Bucket、Object、Key）
2. 访问控制（IAM、ACL）
3. 预签名URL生成
4. 文件上传和下载
5. 成本优化

#### Manus OAuth

**认证流程**：

```typescript
// 1. 重定向到登录页面
const loginUrl = getLoginUrl();

// 2. 用户授权后回调
// /api/oauth/callback?code=xxx

// 3. 交换token并创建会话
const user = await exchangeToken(code);

// 4. 设置会话Cookie
ctx.res.cookie('session', sessionToken);
```

**学习路径**：
1. OAuth 2.0流程
2. 授权码流程（Authorization Code Flow）
3. 令牌刷新和过期处理
4. 用户信息获取
5. 会话管理

---

## 核心模块设计

### 1. 认证模块 (Authentication)

**职责**：
- 用户登录/登出
- 会话管理
- 权限验证

**关键文件**：
- `server/_core/context.ts` - 请求上下文
- `server/_core/auth.ts` - 认证逻辑
- `client/src/_core/hooks/useAuth.ts` - 前端认证Hook

**数据流**：

```
用户点击登录
    ↓
重定向到Manus OAuth
    ↓
用户授权
    ↓
回调到/api/oauth/callback
    ↓
交换授权码获取Token
    ↓
创建用户记录
    ↓
设置会话Cookie
    ↓
重定向到首页
```

### 2. 对话模块 (Conversation)

**职责**：
- 创建和管理对话会话
- 存储消息记录
- 调用AI模型进行对话

**关键文件**：
- `server/routers.ts` - 对话API
- `client/src/pages/Chat.tsx` - 聊天界面
- `drizzle/schema.ts` - 数据库表

**数据模型**：

```typescript
// 对话表
{
  id: number;
  userId: number;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

// 消息表
{
  id: number;
  conversationId: number;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
}
```

**处理流程**：

```
用户输入消息
    ↓
保存用户消息到数据库
    ↓
调用LLM API获取回复
    ↓
保存AI回复到数据库
    ↓
返回消息给前端
    ↓
前端实时显示
```

### 3. 心理评估模块 (Assessment)

**职责**：
- 分析对话内容
- 生成心理评估报告
- 评估严重程度

**关键文件**：
- `server/routers.ts` - 评估API
- `client/src/pages/Assessments.tsx` - 评估页面

**评估流程**：

```
用户选择对话
    ↓
提取对话内容
    ↓
构建评估Prompt
    ↓
调用LLM进行分析
    ↓
解析JSON结果
    ↓
保存评估报告
    ↓
显示评估结果
```

**评估Prompt示例**：

```
你是一名专业的心理健康评估专家。
请基于以下对话内容进行心理健康评估：

对话内容：
[用户对话]

请返回JSON格式的评估结果：
{
  "mentalState": "焦虑症",
  "severity": "moderate",
  "analysis": "用户表现出明显的焦虑症状...",
  "recommendations": "建议进行认知行为疗法..."
}
```

### 4. 治疗计划模块 (Treatment Plan)

**职责**：
- 根据评估生成治疗计划
- 生成PDF文档
- 跟踪治疗进度

**关键文件**：
- `server/treatmentPlanGenerator.ts` - 计划生成逻辑
- `client/src/pages/TreatmentPlans.tsx` - 计划展示

**计划生成流程**：

```
获取评估结果
    ↓
构建计划生成Prompt
    ↓
调用LLM生成计划
    ↓
生成PDF文档
    ↓
上传到S3存储
    ↓
保存计划记录
    ↓
返回计划信息
```

**计划包含内容**：

```typescript
{
  title: string;           // 计划标题
  description: string;     // 计划描述
  goals: string[];         // 治疗目标
  activities: Array<{      // 具体活动
    title: string;
    description: string;
    frequency: string;     // 频率（每天、每周等）
    duration: string;      // 持续时间
  }>;
  duration: string;        // 总体周期
  documentUrl: string;     // PDF下载链接
}
```

### 5. 提醒模块 (Reminder)

**职责**：
- 定期提醒用户
- 发送关怀消息
- 管理提醒状态

**关键文件**：
- `server/reminderService.ts` - 提醒逻辑
- `drizzle/schema.ts` - 提醒表

**提醒类型**：

```typescript
// 心理健康检查提醒
{
  type: 'health_check',
  title: '心理健康检查',
  message: '今天是进行心理健康检查的好时机',
  scheduledAt: Date
}

// 关怀提醒
{
  type: 'care',
  title: '关怀提醒',
  message: '我们很想念您，希望您最近一切安好',
  scheduledAt: Date
}

// 活动提醒
{
  type: 'activity',
  title: '治疗活动提醒',
  message: '是时候进行今天的治疗活动了',
  scheduledAt: Date
}
```

---

## 数据流设计

### 完整用户流程

```
┌─────────────────────────────────────────────────────────┐
│                    用户访问应用                          │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
        ┌────────────────────────────┐
        │   检查是否已登录            │
        └────────┬───────────┬────────┘
                 │           │
            已登录│           │未登录
                 ▼           ▼
            ┌─────────┐  ┌──────────────┐
            │ 首页    │  │ 重定向到OAuth│
            └────┬────┘  └──────┬───────┘
                 │              │
                 │              ▼
                 │         ┌──────────────┐
                 │         │ 用户授权     │
                 │         └──────┬───────┘
                 │                │
                 │                ▼
                 │         ┌──────────────┐
                 │         │ 创建用户记录 │
                 │         └──────┬───────┘
                 │                │
                 └────────┬────────┘
                          │
                          ▼
                  ┌──────────────────┐
                  │ 用户已认证       │
                  └────────┬─────────┘
                           │
                ┌──────────┼──────────┐
                │          │          │
                ▼          ▼          ▼
          ┌────────┐ ┌────────┐ ┌────────┐
          │开始对话│ │查看评估│ │查看计划│
          └────┬───┘ └────┬───┘ └────┬───┘
               │          │          │
               ▼          ▼          ▼
        ┌────────────────────────────┐
        │   与AI进行心理咨询         │
        └────────┬───────────────────┘
                 │
                 ▼
        ┌────────────────────────────┐
        │   生成心理评估报告         │
        └────────┬───────────────────┘
                 │
                 ▼
        ┌────────────────────────────┐
        │   生成个性化治疗计划       │
        └────────┬───────────────────┘
                 │
                 ▼
        ┌────────────────────────────┐
        │   跟踪治疗进度             │
        └────────────────────────────┘
```

### 消息处理流程

```
前端 (React)
    │
    │ 用户输入消息
    ▼
┌─────────────────────────────┐
│ Chat.tsx                    │
│ - 收集用户输入              │
│ - 调用tRPC mutation         │
└─────────┬───────────────────┘
          │
          │ tRPC调用
          ▼
┌─────────────────────────────┐
│ server/routers.ts           │
│ - 验证用户认证              │
│ - 保存用户消息              │
│ - 调用LLM API               │
└─────────┬───────────────────┘
          │
          │ 数据库操作
          ▼
┌─────────────────────────────┐
│ server/db.ts                │
│ - 插入消息记录              │
│ - 查询对话历史              │
└─────────┬───────────────────┘
          │
          │ SQL查询
          ▼
┌─────────────────────────────┐
│ MySQL数据库                 │
│ - 存储消息                  │
│ - 返回查询结果              │
└─────────┬───────────────────┘
          │
          │ 返回结果
          ▼
┌─────────────────────────────┐
│ server/routers.ts           │
│ - 调用LLM获取回复           │
│ - 保存AI消息                │
│ - 返回响应                  │
└─────────┬───────────────────┘
          │
          │ 响应数据
          ▼
┌─────────────────────────────┐
│ Chat.tsx                    │
│ - 更新消息列表              │
│ - 刷新UI                    │
│ - 显示AI回复                │
└─────────────────────────────┘
```

---

## 开发流程

### 开发周期

```
需求分析
    ↓
架构设计
    ↓
数据库设计
    ↓
后端开发
    ├─ 定义tRPC过程
    ├─ 实现业务逻辑
    └─ 编写单元测试
    ↓
前端开发
    ├─ 设计UI组件
    ├─ 实现页面逻辑
    └─ 集成API调用
    ↓
集成测试
    ├─ 端到端测试
    ├─ 性能测试
    └─ 安全测试
    ↓
部署上线
    ├─ 构建应用
    ├─ 配置环境
    └─ 监控运维
```

### 添加新功能的步骤

**以"添加用户反馈功能"为例**：

#### 1. 数据库设计

```typescript
// drizzle/schema.ts
export const feedbacks = mysqlTable('feedbacks', {
  id: int().autoincrement().primaryKey(),
  userId: int().notNull(),
  conversationId: int(),
  content: text().notNull(),
  rating: int(), // 1-5星
  createdAt: timestamp().defaultNow(),
});
```

#### 2. 后端API开发

```typescript
// server/routers.ts
feedback: router({
  create: protectedProcedure
    .input(z.object({
      conversationId: z.number(),
      content: z.string(),
      rating: z.number().min(1).max(5)
    }))
    .mutation(async ({ ctx, input }) => {
      // 保存反馈
      const feedback = await db.insert(feedbacks).values({
        userId: ctx.user.id,
        conversationId: input.conversationId,
        content: input.content,
        rating: input.rating
      });
      
      // 通知所有者
      await notifyOwner({
        title: '新的用户反馈',
        content: input.content
      });
      
      return { success: true, feedbackId: feedback.id };
    }),
  
  list: protectedProcedure
    .query(async ({ ctx }) => {
      return db.select()
        .from(feedbacks)
        .where(eq(feedbacks.userId, ctx.user.id));
    })
})
```

#### 3. 前端UI开发

```typescript
// client/src/components/FeedbackForm.tsx
export function FeedbackForm({ conversationId }: Props) {
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  
  const createMutation = trpc.feedback.create.useMutation({
    onSuccess: () => {
      toast.success('感谢您的反馈！');
      setContent('');
    }
  });
  
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setRating(star)}
            className={star <= rating ? 'text-yellow-500' : 'text-gray-300'}
          >
            ★
          </button>
        ))}
      </div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="请输入您的反馈..."
        className="w-full p-2 border rounded"
      />
      <button
        onClick={() => createMutation.mutate({
          conversationId,
          content,
          rating
        })}
        disabled={createMutation.isPending}
      >
        提交反馈
      </button>
    </div>
  );
}
```

#### 4. 编写测试

```typescript
// server/feedback.test.ts
describe('feedback router', () => {
  it('should create feedback', async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.feedback.create({
      conversationId: 1,
      content: '很有帮助',
      rating: 5
    });
    
    expect(result.success).toBe(true);
  });
});
```

---

## 扩展性考虑

### 水平扩展

```
┌─────────────────────────────────────────┐
│         负载均衡器 (Load Balancer)       │
└──────────┬──────────────┬───────────────┘
           │              │
    ┌──────▼──────┐  ┌────▼──────────┐
    │ 应用服务器1  │  │ 应用服务器2   │
    └──────┬──────┘  └────┬──────────┘
           │              │
           └──────┬───────┘
                  │
           ┌──────▼──────────┐
           │ 共享数据库       │
           │ (MySQL Cluster) │
           └─────────────────┘
```

### 缓存策略

```typescript
// Redis缓存用户会话
const session = await redis.get(`session:${userId}`);

// 缓存热点数据
const userProfile = await redis.get(`profile:${userId}`);

// 缓存LLM响应
const cachedResponse = await redis.get(`llm:${hash}`);
```

### 消息队列

```typescript
// 异步处理耗时操作
await queue.add('generateTreatmentPlan', {
  assessmentId: 123,
  userId: 456
});

// 定时任务
schedule.every('1 day').do(() => {
  sendReminderNotifications();
});
```

### 微服务架构

```
┌─────────────────────────────────────────┐
│         API网关                         │
└──────────┬──────────────┬───────────────┘
           │              │
    ┌──────▼──────┐  ┌────▼──────────┐
    │ 用户服务     │  │ 对话服务      │
    └──────┬──────┘  └────┬──────────┘
           │              │
    ┌──────▼──────┐  ┌────▼──────────┐
    │ 评估服务     │  │ 计划服务      │
    └──────┬──────┘  └────┬──────────┘
           │              │
           └──────┬───────┘
                  │
           ┌──────▼──────────┐
           │ 消息队列        │
           │ (RabbitMQ/Kafka)│
           └─────────────────┘
```

---

## 总结

本项目展示了现代全栈Web应用的完整开发过程：

1. **前端** - React + Tailwind CSS + tRPC
2. **后端** - Node.js + Express + Drizzle ORM
3. **数据库** - MySQL关系型数据库
4. **AI集成** - LLM和语音识别API
5. **云服务** - S3存储和OAuth认证

通过学习本项目，开发者可以掌握：

- ✅ 现代前端框架和工具链
- ✅ 后端API设计和实现
- ✅ 数据库设计和优化
- ✅ AI模型集成
- ✅ 云服务应用
- ✅ 完整的开发流程

---

**版本**: 1.0  
**最后更新**: 2026年2月1日
