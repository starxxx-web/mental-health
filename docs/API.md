# API文档

本文档详细说明了心理健康AI辅导平台的所有tRPC API端点。

## 概述

所有API调用都通过tRPC进行，提供完整的端到端类型安全。API基于用户认证状态分为两类：

- **公开过程** (`publicProcedure`) - 无需认证
- **受保护过程** (`protectedProcedure`) - 需要用户认证

## 认证

### 登录流程

1. 用户点击"开始使用"按钮
2. 重定向到Manus OAuth登录页面
3. 用户授权后，重定向回应用
4. 系统自动创建或更新用户记录
5. 设置会话Cookie

### 获取当前用户

```typescript
// 前端代码
const { user, loading } = useAuth();

// 或使用tRPC
const { data: user } = trpc.auth.me.useQuery();
```

### 登出

```typescript
const logoutMutation = trpc.auth.logout.useMutation();
logoutMutation.mutate();
```

---

## API端点

### 认证 (auth)

#### `auth.me` - 获取当前用户信息

**类型**: 公开过程  
**请求**: 无  
**响应**:
```typescript
{
  id: number;
  openId: string;
  name?: string;
  email?: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}
```

**示例**:
```typescript
const { data: user } = trpc.auth.me.useQuery();
```

---

#### `auth.logout` - 用户登出

**类型**: 公开过程  
**请求**: 无  
**响应**:
```typescript
{ success: true }
```

**示例**:
```typescript
const logoutMutation = trpc.auth.logout.useMutation({
  onSuccess: () => {
    window.location.href = '/';
  }
});

logoutMutation.mutate();
```

---

### 用户档案 (profile)

#### `profile.get` - 获取用户档案

**类型**: 受保护过程  
**请求**: 无  
**响应**:
```typescript
{
  id: number;
  userId: number;
  timezone: string;
  preferredLanguage: string;
  notificationsEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

**示例**:
```typescript
const { data: profile } = trpc.profile.get.useQuery();
```

---

#### `profile.update` - 更新用户档案

**类型**: 受保护过程  
**请求**:
```typescript
{
  timezone?: string;
  preferredLanguage?: string;
  notificationsEnabled?: boolean;
}
```

**响应**:
```typescript
{ success: true }
```

**示例**:
```typescript
const updateMutation = trpc.profile.update.useMutation();

updateMutation.mutate({
  timezone: 'Asia/Shanghai',
  preferredLanguage: 'zh-CN'
});
```

---

### 对话 (conversation)

#### `conversation.create` - 创建新对话

**类型**: 受保护过程  
**请求**:
```typescript
{
  title: string;
}
```

**响应**:
```typescript
{
  conversationId: number;
}
```

**示例**:
```typescript
const createMutation = trpc.conversation.create.useMutation();

createMutation.mutate({ title: '今天的心理咨询' });
```

---

#### `conversation.list` - 获取对话列表

**类型**: 受保护过程  
**请求**: 无  
**响应**:
```typescript
Array<{
  id: number;
  userId: number;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}>
```

**示例**:
```typescript
const { data: conversations } = trpc.conversation.list.useQuery();
```

---

#### `conversation.get` - 获取对话详情

**类型**: 受保护过程  
**请求**:
```typescript
{
  conversationId: number;
}
```

**响应**:
```typescript
{
  id: number;
  userId: number;
  title: string;
  messages: Array<{
    id: number;
    role: 'user' | 'assistant';
    content: string;
    createdAt: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}
```

**示例**:
```typescript
const { data: conversation } = trpc.conversation.get.useQuery({
  conversationId: 1
});
```

---

### 聊天 (chat)

#### `chat.sendMessage` - 发送消息

**类型**: 受保护过程  
**请求**:
```typescript
{
  conversationId: number;
  message: string;
}
```

**响应**:
```typescript
{
  userMessage: {
    id: number;
    content: string;
    createdAt: Date;
  };
  assistantMessage: {
    id: number;
    content: string;
    createdAt: Date;
  };
}
```

**示例**:
```typescript
const sendMutation = trpc.chat.sendMessage.useMutation();

sendMutation.mutate({
  conversationId: 1,
  message: '我最近感到很焦虑'
});
```

---

### 语音 (voice)

#### `voice.transcribe` - 语音转文字

**类型**: 受保护过程  
**请求**:
```typescript
{
  audioUrl: string;
  language?: string;
}
```

**响应**:
```typescript
{
  text: string;
  language: string;
  duration: number;
}
```

**示例**:
```typescript
const transcribeMutation = trpc.voice.transcribe.useMutation();

transcribeMutation.mutate({
  audioUrl: 'https://s3.example.com/audio/recording.mp3',
  language: 'zh-CN'
});
```

---

### 心理评估 (assessment)

#### `assessment.list` - 获取评估列表

**类型**: 受保护过程  
**请求**: 无  
**响应**:
```typescript
Array<{
  id: number;
  userId: number;
  conversationId: number;
  mentalState: string;
  severity: 'low' | 'moderate' | 'high';
  analysis: string;
  recommendations: string;
  createdAt: Date;
}>
```

**示例**:
```typescript
const { data: assessments } = trpc.assessment.list.useQuery();
```

---

#### `assessment.create` - 创建新评估

**类型**: 受保护过程  
**请求**:
```typescript
{
  conversationId: number;
}
```

**响应**:
```typescript
{
  id: number;
  mentalState: string;
  severity: string;
  analysis: string;
  recommendations: string;
}
```

**示例**:
```typescript
const createMutation = trpc.assessment.create.useMutation();

createMutation.mutate({ conversationId: 1 });
```

---

### 治疗计划 (treatmentPlan)

#### `treatmentPlan.list` - 获取治疗计划列表

**类型**: 受保护过程  
**请求**: 无  
**响应**:
```typescript
Array<{
  id: number;
  userId: number;
  assessmentId: number;
  title: string;
  description: string;
  goals: string[];
  activities: Array<{
    title: string;
    description: string;
    frequency: string;
    duration: string;
  }>;
  status: 'active' | 'completed' | 'paused';
  progress: number;
  documentUrl?: string;
  duration: string;
  createdAt: Date;
  updatedAt: Date;
}>
```

**示例**:
```typescript
const { data: plans } = trpc.treatmentPlan.list.useQuery();
```

---

#### `treatmentPlan.update` - 更新治疗计划

**类型**: 受保护过程  
**请求**:
```typescript
{
  planId: number;
  status?: 'active' | 'completed' | 'paused';
  progress?: number;
}
```

**响应**:
```typescript
{ success: true }
```

**示例**:
```typescript
const updateMutation = trpc.treatmentPlan.update.useMutation();

updateMutation.mutate({
  planId: 1,
  progress: 50
});
```

---

### 治疗计划生成 (treatmentPlanGenerator)

#### `treatmentPlanGenerator.generate` - 生成治疗计划

**类型**: 受保护过程  
**请求**:
```typescript
{
  assessmentId: number;
}
```

**响应**:
```typescript
{
  id: number;
  title: string;
  description: string;
  goals: string[];
  activities: Array<{
    title: string;
    description: string;
    frequency: string;
    duration: string;
  }>;
  documentUrl: string;
}
```

**示例**:
```typescript
const generateMutation = trpc.treatmentPlanGenerator.generate.useMutation();

generateMutation.mutate({ assessmentId: 1 });
```

---

### 提醒 (reminder)

#### `reminder.list` - 获取提醒列表

**类型**: 受保护过程  
**请求**: 无  
**响应**:
```typescript
Array<{
  id: number;
  userId: number;
  title: string;
  message: string;
  type: 'health_check' | 'care' | 'activity';
  status: 'pending' | 'sent' | 'dismissed';
  scheduledAt: Date;
  createdAt: Date;
}>
```

**示例**:
```typescript
const { data: reminders } = trpc.reminder.list.useQuery();
```

---

#### `reminder.dismiss` - 关闭提醒

**类型**: 受保护过程  
**请求**:
```typescript
{
  reminderId: number;
}
```

**响应**:
```typescript
{ success: true }
```

**示例**:
```typescript
const dismissMutation = trpc.reminder.dismiss.useMutation();

dismissMutation.mutate({ reminderId: 1 });
```

---

### 系统 (system)

#### `system.notifyOwner` - 通知项目所有者

**类型**: 受保护过程  
**请求**:
```typescript
{
  title: string;
  content: string;
}
```

**响应**:
```typescript
{ success: boolean }
```

**示例**:
```typescript
const notifyMutation = trpc.system.notifyOwner.useMutation();

notifyMutation.mutate({
  title: '新的用户反馈',
  content: '用户提交了新的反馈信息'
});
```

---

## 错误处理

所有API调用都可能返回错误。错误处理示例：

```typescript
const mutation = trpc.chat.sendMessage.useMutation({
  onError: (error) => {
    console.error('错误代码:', error.code);
    console.error('错误消息:', error.message);
    
    // 根据错误类型处理
    if (error.code === 'UNAUTHORIZED') {
      // 用户未认证，重定向到登录
      window.location.href = getLoginUrl();
    } else if (error.code === 'BAD_REQUEST') {
      // 请求参数错误
      toast.error('请求参数错误');
    } else {
      // 其他错误
      toast.error('发生错误，请稍后重试');
    }
  }
});
```

### 常见错误代码

| 代码 | 说明 |
|------|------|
| `UNAUTHORIZED` | 用户未认证 |
| `FORBIDDEN` | 用户无权限 |
| `BAD_REQUEST` | 请求参数错误 |
| `NOT_FOUND` | 资源不存在 |
| `INTERNAL_SERVER_ERROR` | 服务器错误 |

---

## 数据类型

### 消息角色

```typescript
type MessageRole = 'user' | 'assistant';
```

### 评估严重程度

```typescript
type Severity = 'low' | 'moderate' | 'high';
```

### 计划状态

```typescript
type PlanStatus = 'active' | 'completed' | 'paused';
```

### 提醒类型

```typescript
type ReminderType = 'health_check' | 'care' | 'activity';
```

---

## 最佳实践

### 1. 使用乐观更新

```typescript
const mutation = trpc.treatmentPlan.update.useMutation({
  onMutate: async (newData) => {
    // 立即更新UI
    await utils.treatmentPlan.list.cancel();
    const previousData = utils.treatmentPlan.list.getData();
    
    utils.treatmentPlan.list.setData(undefined, (old) => {
      return old?.map((plan) =>
        plan.id === newData.planId ? { ...plan, ...newData } : plan
      );
    });
    
    return { previousData };
  },
  onError: (err, newData, context) => {
    // 恢复之前的数据
    if (context?.previousData) {
      utils.treatmentPlan.list.setData(undefined, context.previousData);
    }
  },
  onSuccess: () => {
    // 重新获取最新数据
    utils.treatmentPlan.list.invalidate();
  }
});
```

### 2. 处理加载状态

```typescript
const { data, isLoading, error } = trpc.assessment.list.useQuery();

if (isLoading) return <Skeleton />;
if (error) return <Error message={error.message} />;
if (!data) return <Empty />;

return <AssessmentList data={data} />;
```

### 3. 批量操作

```typescript
const utils = trpc.useUtils();

const mutation = trpc.chat.sendMessage.useMutation({
  onSuccess: () => {
    // 同时更新多个查询
    utils.conversation.get.invalidate();
    utils.assessment.list.invalidate();
  }
});
```

---

## 版本历史

| 版本 | 日期 | 变更 |
|------|------|------|
| 1.0 | 2026-02-01 | 初始版本 |

---

**最后更新**: 2026年2月1日
