# 技术栈详细介绍

## 目录

1. [前端技术栈](#前端技术栈)
2. [后端技术栈](#后端技术栈)
3. [数据库技术](#数据库技术)
4. [AI和云服务](#ai和云服务)
5. [开发工具](#开发工具)
6. [技术选型对比](#技术选型对比)

---

## 前端技术栈

### React 19

#### 简介

React是由Facebook开发的JavaScript库，用于构建用户界面。它采用组件化的开发方式，使用虚拟DOM提高性能。

#### 核心特性

**1. 组件化架构**

```typescript
// 函数式组件
function ChatMessage({ message, role }: Props) {
  return (
    <div className={`message ${role}`}>
      <p>{message}</p>
    </div>
  );
}

// 使用组件
<ChatMessage message="你好" role="user" />
```

**2. JSX语法**

```typescript
// JSX允许在JavaScript中写HTML
const element = (
  <div className="container">
    <h1>欢迎</h1>
    <p>{greeting}</p>
  </div>
);
```

**3. 虚拟DOM**

React使用虚拟DOM来优化性能：
- 创建虚拟DOM树
- 比较新旧虚拟DOM
- 只更新变化的部分
- 提高渲染性能

**4. Hooks**

```typescript
// useState - 状态管理
const [count, setCount] = useState(0);

// useEffect - 副作用处理
useEffect(() => {
  document.title = `Count: ${count}`;
}, [count]);

// useContext - 跨组件通信
const theme = useContext(ThemeContext);

// useReducer - 复杂状态管理
const [state, dispatch] = useReducer(reducer, initialState);
```

#### 学习资源

- [React官方文档](https://react.dev)
- [React中文文档](https://zh-hans.react.dev)
- [React Hooks完全指南](https://overreacted.io/zh-hans/a-complete-guide-to-useeffect)

#### 在项目中的应用

- 构建所有UI组件
- 管理应用状态
- 处理用户交互
- 实现路由导航

---

### Tailwind CSS 4

#### 简介

Tailwind CSS是一个实用优先的CSS框架，提供了大量的原子化工具类，让开发者可以快速构建现代UI。

#### 核心概念

**1. 工具类**

```html
<!-- 使用工具类构建样式 -->
<div class="flex items-center justify-between p-4 bg-white rounded-lg shadow">
  <h1 class="text-2xl font-bold text-gray-900">标题</h1>
  <button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
    按钮
  </button>
</div>
```

**2. 响应式设计**

```html
<!-- 根据屏幕大小调整样式 -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <div>卡片1</div>
  <div>卡片2</div>
  <div>卡片3</div>
</div>
```

**3. 状态变体**

```html
<!-- 处理不同的交互状态 -->
<button class="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 disabled:opacity-50">
  按钮
</button>
```

**4. 深色模式**

```html
<!-- 自动支持深色模式 -->
<div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  内容
</div>
```

#### 优势

- ✅ **快速开发** - 无需写CSS，直接使用工具类
- ✅ **一致的设计** - 统一的颜色、间距、字体
- ✅ **响应式** - 内置移动端优先的响应式支持
- ✅ **可定制** - 通过配置文件自定义主题
- ✅ **优化的输出** - 自动移除未使用的CSS

#### 在项目中的应用

- 构建所有UI组件样式
- 实现响应式布局
- 管理深色/浅色主题
- 快速原型开发

---

### tRPC 11

#### 简介

tRPC是一个轻量级的RPC框架，提供端到端的类型安全。它消除了API调用中的类型不匹配问题。

#### 核心概念

**1. 过程定义**

```typescript
// 后端定义过程
export const appRouter = router({
  chat: router({
    sendMessage: protectedProcedure
      .input(z.object({
        conversationId: z.number(),
        message: z.string().min(1)
      }))
      .mutation(async ({ ctx, input }) => {
        // 业务逻辑
        return { success: true, messageId: 123 };
      })
  })
});
```

**2. 前端调用**

```typescript
// 前端自动获得类型提示
const mutation = trpc.chat.sendMessage.useMutation();

mutation.mutate({
  conversationId: 1,
  message: 'Hello' // 类型检查
});
```

**3. 类型推断**

```typescript
// 类型自动推断，无需手动定义
type SendMessageInput = typeof appRouter._def.procedures.chat.sendMessage._def.inputs;
type SendMessageOutput = typeof appRouter._def.procedures.chat.sendMessage._def.outputs;
```

#### 优势

- ✅ **类型安全** - 完整的端到端类型检查
- ✅ **自动API生成** - 无需手写REST路由
- ✅ **IDE支持** - 完整的代码补全
- ✅ **简化开发** - 减少样板代码
- ✅ **自动验证** - 集成Zod进行输入验证

#### 在项目中的应用

- 定义所有API端点
- 进行输入验证
- 管理认证和授权
- 处理错误和异常

---

### shadcn/ui

#### 简介

shadcn/ui是一个高质量的React组件库，基于Radix UI和Tailwind CSS。组件代码在项目中，可自由定制。

#### 核心组件

```typescript
// Button组件
import { Button } from "@/components/ui/button";
<Button variant="default" size="lg">点击我</Button>

// Card组件
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
<Card>
  <CardHeader>
    <CardTitle>标题</CardTitle>
  </CardHeader>
  <CardContent>内容</CardContent>
</Card>

// Dialog组件
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
<Dialog>
  <DialogTrigger>打开</DialogTrigger>
  <DialogContent>对话框内容</DialogContent>
</Dialog>

// Form组件
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
// 与React Hook Form集成
```

#### 优势

- ✅ **高质量设计** - 基于Radix UI的无样式组件
- ✅ **可定制** - 组件代码在项目中
- ✅ **可访问性** - 内置ARIA支持
- ✅ **与Tailwind完美配合** - 使用Tailwind进行样式
- ✅ **丰富的组件** - 50+个常用组件

#### 在项目中的应用

- 构建对话框和模态框
- 创建表单和输入字段
- 实现数据表格
- 构建导航和菜单

---

## 后端技术栈

### Node.js

#### 简介

Node.js是一个基于Chrome V8引擎的JavaScript运行时环境，允许在服务器端运行JavaScript。

#### 核心特性

**1. 事件驱动**

```typescript
// Node.js使用事件驱动模型处理并发
const server = http.createServer((req, res) => {
  // 处理请求
});

server.on('request', (req, res) => {
  // 事件监听
});
```

**2. 非阻塞I/O**

```typescript
// 异步I/O操作
fs.readFile('file.txt', (err, data) => {
  // 不阻塞其他操作
  console.log(data);
});

// 使用async/await简化
const data = await fs.promises.readFile('file.txt');
```

**3. 包管理**

```bash
# 使用pnpm管理依赖
pnpm install express
pnpm add --save-dev typescript

# 查看依赖树
pnpm list
```

#### 优势

- ✅ **高性能** - 非阻塞I/O，高并发处理
- ✅ **全栈JavaScript** - 前后端使用同一语言
- ✅ **丰富的生态** - npm包数量最多
- ✅ **开发效率高** - 快速原型开发
- ✅ **社区活跃** - 大量资源和支持

#### 在项目中的应用

- 构建Web服务器
- 处理API请求
- 数据库操作
- 文件处理

---

### Express 4

#### 简介

Express是Node.js最流行的Web框架，提供了简洁的API来构建Web应用和API。

#### 核心概念

**1. 路由**

```typescript
// 定义路由
app.get('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  res.json({ id: userId });
});

// 路由参数和查询字符串
app.get('/search', (req, res) => {
  const query = req.query.q;
  res.json({ query });
});
```

**2. 中间件**

```typescript
// 中间件处理请求/响应
app.use(express.json()); // 解析JSON
app.use(cors()); // 跨域处理
app.use(logger); // 日志记录

// 自定义中间件
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next(); // 传递给下一个中间件
});
```

**3. 错误处理**

```typescript
// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});
```

#### 优势

- ✅ **简洁** - 最小化框架，易于学习
- ✅ **灵活** - 可以自由选择中间件
- ✅ **高性能** - 轻量级设计
- ✅ **生态完善** - 大量中间件可用
- ✅ **社区支持** - 活跃的社区

#### 在项目中的应用

- 创建HTTP服务器
- 定义API路由
- 处理中间件
- 错误处理

---

### Drizzle ORM

#### 简介

Drizzle ORM是一个现代的TypeScript ORM，提供类型安全的数据库操作。

#### 核心概念

**1. 表定义**

```typescript
// 定义表和列
export const users = mysqlTable('users', {
  id: int('id').autoincrement().primaryKey(),
  name: text('name'),
  email: varchar('email', { length: 320 }).unique(),
  createdAt: timestamp('created_at').defaultNow(),
});

// 定义类型
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
```

**2. 查询**

```typescript
// SELECT查询
const users = await db.select().from(usersTable);

// WHERE条件
const user = await db
  .select()
  .from(usersTable)
  .where(eq(usersTable.id, 1));

// JOIN关联
const result = await db
  .select()
  .from(conversations)
  .leftJoin(messages, eq(conversations.id, messages.conversationId))
  .where(eq(conversations.userId, userId));
```

**3. 插入和更新**

```typescript
// INSERT
await db.insert(usersTable).values({
  name: 'John',
  email: 'john@example.com'
});

// UPDATE
await db.update(usersTable)
  .set({ name: 'Jane' })
  .where(eq(usersTable.id, 1));

// DELETE
await db.delete(usersTable)
  .where(eq(usersTable.id, 1));
```

**4. 迁移**

```bash
# 生成迁移文件
pnpm drizzle-kit generate

# 执行迁移
pnpm drizzle-kit migrate
```

#### 优势

- ✅ **类型安全** - 完整的TypeScript支持
- ✅ **简洁API** - 相比Sequelize更轻量
- ✅ **灵活查询** - 支持复杂的SQL操作
- ✅ **迁移管理** - 内置数据库迁移工具
- ✅ **性能优化** - 自动生成高效的SQL

#### 在项目中的应用

- 定义数据库表
- 执行CRUD操作
- 管理数据库迁移
- 构建复杂查询

---

## 数据库技术

### MySQL 8.0

#### 简介

MySQL是最流行的开源关系型数据库，提供ACID事务支持和高性能。

#### 核心特性

**1. 表设计**

```sql
-- 创建表
CREATE TABLE conversations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 创建索引
CREATE INDEX idx_user_id ON conversations(user_id);
CREATE UNIQUE INDEX idx_email ON users(email);
```

**2. 查询**

```sql
-- SELECT查询
SELECT * FROM conversations WHERE user_id = 1;

-- JOIN关联
SELECT c.*, COUNT(m.id) as message_count
FROM conversations c
LEFT JOIN messages m ON c.id = m.conversation_id
GROUP BY c.id;

-- 排序和分页
SELECT * FROM conversations
ORDER BY created_at DESC
LIMIT 10 OFFSET 20;
```

**3. 事务**

```sql
-- 开始事务
START TRANSACTION;

INSERT INTO conversations VALUES (...);
INSERT INTO messages VALUES (...);

-- 提交或回滚
COMMIT; -- 或 ROLLBACK;
```

#### 优势

- ✅ **可靠** - ACID事务保证
- ✅ **性能** - 高效的查询引擎
- ✅ **可扩展** - 支持大数据量
- ✅ **安全** - 用户权限管理
- ✅ **开源** - 免费且社区活跃

#### 在项目中的应用

- 存储用户数据
- 保存对话记录
- 存储评估报告
- 管理治疗计划

---

### TiDB

#### 简介

TiDB是一个兼容MySQL的分布式数据库，提供水平扩展和高可用。

#### 核心特性

**1. 分布式架构**

```
┌─────────────────────────────────┐
│         SQL层 (TiDB)            │
│  - SQL解析和优化                │
│  - 分布式执行                   │
└─────────────────────────────────┘
           │
┌─────────────────────────────────┐
│      KV存储层 (TiKV)            │
│  - 分布式存储                   │
│  - 数据复制和容错               │
└─────────────────────────────────┘
```

**2. 水平扩展**

```typescript
// 自动分片，无需手动分表
// 添加新的TiKV节点即可扩展容量
const data = await db.select().from(largeTable);
```

**3. 高可用**

```
- 数据多副本存储
- 自动故障转移
- 无单点故障
```

#### 优势

- ✅ **水平扩展** - 自动分片
- ✅ **高可用** - 多副本容错
- ✅ **MySQL兼容** - 无需修改应用
- ✅ **ACID事务** - 分布式事务支持
- ✅ **性能** - 高吞吐量

#### 在项目中的应用

- 替代MySQL用于大规模部署
- 处理高并发请求
- 存储大量数据

---

## AI和云服务

### 大语言模型 (LLM)

#### 简介

大语言模型是基于深度学习的AI模型，能够理解和生成自然语言。

#### 核心功能

**1. 文本生成**

```typescript
const response = await invokeLLM({
  messages: [
    { role: 'system', content: '你是一名心理咨询师' },
    { role: 'user', content: '我感到焦虑' }
  ]
});

console.log(response.choices[0].message.content);
// 输出：AI的回复
```

**2. 结构化输出**

```typescript
const response = await invokeLLM({
  messages: [
    { role: 'user', content: '分析这段对话的心理状态' }
  ],
  response_format: {
    type: 'json_schema',
    json_schema: {
      name: 'assessment',
      schema: {
        type: 'object',
        properties: {
          mentalState: { type: 'string' },
          severity: { type: 'string' },
          recommendations: { type: 'string' }
        }
      }
    }
  }
});
```

**3. 提示工程**

```typescript
// 系统提示词设计
const systemPrompt = `你是一名专业的心理健康咨询师,具有以下特点:
1. 温暖和同理心
2. 专业的心理学知识
3. 保密和隐私意识
4. 能够识别危险信号

请根据用户的描述提供支持和建议。`;

const response = await invokeLLM({
  messages: [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userInput }
  ]
});
```

#### 参数说明

| 参数 | 说明 | 范围 |
|------|------|------|
| temperature | 输出的随机性 | 0-2 |
| top_p | 核采样 | 0-1 |
| max_tokens | 最大输出长度 | 1-4096 |
| presence_penalty | 重复惩罚 | -2-2 |

#### 在项目中的应用

- AI心理咨询对话
- 心理状态评估
- 治疗计划生成
- 内容分析和分类

---

### Whisper API (语音转文字)

#### 简介

Whisper是OpenAI的语音识别模型，支持多语言和高精度转录。

#### 核心功能

```typescript
// 语音转文字
const result = await transcribeAudio({
  audioUrl: 'https://s3.example.com/audio.mp3',
  language: 'zh-CN', // 可选
  prompt: '心理咨询对话' // 可选上下文
});

console.log(result.text); // 转换后的文字
console.log(result.language); // 检测到的语言
```

#### 支持格式

- mp3, mp4, mpeg, mpga, m4a, wav, webm

#### 优势

- ✅ **高精度** - 支持多种口音和背景噪音
- ✅ **多语言** - 支持99+种语言
- ✅ **快速** - 实时转录
- ✅ **可靠** - 企业级API

#### 在项目中的应用

- 实时语音转文字
- 对话记录转录
- 语音输入处理

---

### AWS S3 存储

#### 简介

Amazon S3是云对象存储服务，提供高可用和可扩展的文件存储。

#### 核心功能

**1. 上传文件**

```typescript
// 上传文件到S3
const { url } = await storagePut(
  'treatment-plans/user-123/plan.pdf',
  pdfBuffer,
  'application/pdf'
);

console.log(url); // 文件的公开URL
```

**2. 下载文件**

```typescript
// 获取预签名URL（临时下载链接）
const { url: downloadUrl } = await storageGet(
  'treatment-plans/user-123/plan.pdf',
  3600 // 1小时后过期
);
```

**3. 文件管理**

```typescript
// 文件命名规范
const fileKey = `${userId}/documents/${Date.now()}-${filename}`;

// 添加随机后缀防止枚举
const randomSuffix = Math.random().toString(36).substring(7);
const secureKey = `${userId}/documents/${randomSuffix}-${filename}`;
```

#### 优势

- ✅ **可靠** - 99.99%可用性
- ✅ **可扩展** - 无限存储容量
- ✅ **安全** - 加密和访问控制
- ✅ **成本低** - 按使用付费
- ✅ **全球分布** - 低延迟访问

#### 在项目中的应用

- 存储PDF治疗计划
- 保存用户上传文件
- 存储音频文件
- 备份重要数据

---

### Manus OAuth

#### 简介

Manus OAuth提供安全的用户认证和授权服务。

#### 认证流程

```
1. 用户点击"登录"
   ↓
2. 重定向到Manus OAuth登录页面
   ↓
3. 用户输入凭证并授权
   ↓
4. 重定向回应用 (带授权码)
   ↓
5. 后端交换授权码获取令牌
   ↓
6. 创建用户会话
   ↓
7. 用户已认证
```

#### 实现示例

```typescript
// 获取登录URL
const loginUrl = getLoginUrl();

// 处理OAuth回调
app.get('/api/oauth/callback', async (req, res) => {
  const { code } = req.query;
  
  // 交换授权码获取令牌
  const token = await exchangeToken(code);
  
  // 获取用户信息
  const user = await getUserInfo(token);
  
  // 创建或更新用户
  await upsertUser(user);
  
  // 设置会话Cookie
  res.cookie('session', sessionToken);
  
  // 重定向到首页
  res.redirect('/');
});
```

#### 优势

- ✅ **安全** - 标准OAuth 2.0流程
- ✅ **易集成** - 简单的API
- ✅ **可靠** - 企业级服务
- ✅ **隐私** - 用户数据保护

#### 在项目中的应用

- 用户登录认证
- 会话管理
- 用户信息获取

---

## 开发工具

### TypeScript

#### 简介

TypeScript是JavaScript的超集，添加了静态类型系统。

#### 核心特性

**1. 类型注解**

```typescript
// 基础类型
let name: string = 'John';
let age: number = 30;
let active: boolean = true;

// 数组类型
let numbers: number[] = [1, 2, 3];
let items: Array<string> = ['a', 'b'];

// 联合类型
let value: string | number = 'hello';

// 类型别名
type MessageRole = 'user' | 'assistant';
```

**2. 接口**

```typescript
// 定义接口
interface User {
  id: number;
  name: string;
  email?: string; // 可选属性
}

// 实现接口
class UserImpl implements User {
  id: number;
  name: string;
  
  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}
```

**3. 泛型**

```typescript
// 泛型函数
function getById<T>(id: number): T | null {
  // ...
}

// 泛型类
class Repository<T> {
  items: T[] = [];
  
  add(item: T) {
    this.items.push(item);
  }
}
```

#### 优势

- ✅ **类型安全** - 捕获错误
- ✅ **IDE支持** - 代码补全和重构
- ✅ **可维护性** - 代码更清晰
- ✅ **文档** - 类型即文档
- ✅ **性能** - 编译时优化

#### 在项目中的应用

- 定义所有数据类型
- 提高代码质量
- 改进开发体验

---

### Vitest

#### 简介

Vitest是一个快速的单元测试框架，与Vite集成。

#### 核心概念

**1. 测试编写**

```typescript
import { describe, it, expect } from 'vitest';

describe('conversation router', () => {
  it('should create conversation', async () => {
    const result = await caller.conversation.create({
      title: 'Test'
    });
    
    expect(result.conversationId).toBeDefined();
    expect(result.conversationId).toBeGreaterThan(0);
  });
  
  it('should list conversations', async () => {
    const result = await caller.conversation.list();
    
    expect(Array.isArray(result)).toBe(true);
  });
});
```

**2. 模拟和Stub**

```typescript
import { vi } from 'vitest';

// 模拟函数
const mockFn = vi.fn();
mockFn('hello');
expect(mockFn).toHaveBeenCalledWith('hello');

// 模拟模块
vi.mock('./module', () => ({
  default: { value: 'mocked' }
}));
```

**3. 异步测试**

```typescript
it('should handle async operations', async () => {
  const result = await asyncFunction();
  expect(result).toBeDefined();
});
```

#### 优势

- ✅ **快速** - 比Jest快10倍
- ✅ **与Vite集成** - 无需配置
- ✅ **完整的API** - 与Jest兼容
- ✅ **Watch模式** - 实时反馈

#### 在项目中的应用

- 编写单元测试
- 测试API路由
- 测试业务逻辑

---

### Vite

#### 简介

Vite是一个现代的前端构建工具，提供极速的开发体验。

#### 核心特性

**1. 快速开发**

```bash
# 启动开发服务器
pnpm dev

# 热模块替换 (HMR)
# 修改代码后自动刷新浏览器
```

**2. 优化的构建**

```bash
# 生产构建
pnpm build

# 预览构建结果
pnpm preview
```

**3. 插件系统**

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src'
    }
  }
});
```

#### 优势

- ✅ **快速** - 基于ES模块的开发服务器
- ✅ **HMR** - 快速的热更新
- ✅ **优化构建** - 自动代码分割
- ✅ **插件生态** - 丰富的插件支持

#### 在项目中的应用

- 前端开发服务器
- 代码构建和优化
- 资源处理

---

## 技术选型对比

### 前端框架对比

| 特性 | React | Vue | Angular |
|------|-------|-----|---------|
| 学习曲线 | 中等 | 简单 | 陡峭 |
| 性能 | 优秀 | 优秀 | 良好 |
| 生态 | 最丰富 | 良好 | 完整 |
| 社区 | 最活跃 | 活跃 | 活跃 |
| 企业支持 | Facebook | 独立 | Google |

**为什么选择React？**
- 最大的社区和生态
- 灵活的架构
- 丰富的第三方库
- 企业级应用广泛使用

---

### CSS框架对比

| 特性 | Tailwind | Bootstrap | Material UI |
|------|----------|-----------|------------|
| 方式 | 工具类 | 组件类 | 组件库 |
| 学习曲线 | 中等 | 简单 | 陡峭 |
| 定制性 | 高 | 中等 | 低 |
| 文件大小 | 小 | 大 | 大 |
| 开发速度 | 快 | 中等 | 快 |

**为什么选择Tailwind？**
- 快速开发
- 高度可定制
- 文件大小小
- 现代设计系统

---

### 后端框架对比

| 特性 | Express | Fastify | Koa |
|------|---------|---------|-----|
| 性能 | 良好 | 优秀 | 优秀 |
| 学习曲线 | 简单 | 简单 | 中等 |
| 生态 | 最丰富 | 良好 | 良好 |
| 社区 | 最活跃 | 活跃 | 活跃 |
| 中间件 | 丰富 | 丰富 | 丰富 |

**为什么选择Express？**
- 最成熟的框架
- 最大的社区
- 最多的中间件
- 企业级应用广泛使用

---

### ORM对比

| 特性 | Drizzle | Sequelize | TypeORM |
|------|---------|-----------|---------|
| TypeScript支持 | 优秀 | 良好 | 优秀 |
| 性能 | 优秀 | 良好 | 良好 |
| 学习曲线 | 简单 | 中等 | 陡峭 |
| 文件大小 | 小 | 大 | 大 |
| 类型推断 | 优秀 | 良好 | 良好 |

**为什么选择Drizzle？**
- 轻量级设计
- 优秀的TypeScript支持
- 简洁的API
- 快速的性能

---

## 总结

本项目使用的技术栈代表了现代Web开发的最佳实践：

### 前端
- **React 19** - 组件化UI框架
- **Tailwind CSS 4** - 快速样式系统
- **tRPC** - 类型安全的API调用
- **shadcn/ui** - 高质量组件库
- **TypeScript** - 类型安全

### 后端
- **Node.js** - JavaScript运行时
- **Express 4** - Web框架
- **Drizzle ORM** - 数据库ORM
- **Zod** - 数据验证

### 数据库
- **MySQL 8.0** - 关系型数据库
- **TiDB** - 分布式数据库

### AI和云服务
- **LLM** - 大语言模型
- **Whisper** - 语音识别
- **S3** - 文件存储
- **OAuth** - 用户认证

### 开发工具
- **TypeScript** - 类型系统
- **Vitest** - 单元测试
- **Vite** - 构建工具

这个技术栈的优势：
✅ 类型安全 - 从前到后
✅ 开发效率高 - 快速原型开发
✅ 性能优秀 - 高并发处理
✅ 易于维护 - 清晰的代码结构
✅ 可扩展性强 - 支持业务增长

---

**版本**: 1.0  
**最后更新**: 2026年2月1日
