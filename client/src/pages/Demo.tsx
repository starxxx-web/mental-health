import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  Heart, 
  MessageCircle, 
  Database, 
  Cloud, 
  Shield, 
  Sparkles, 
  TrendingUp,
  Bell,
  Mic,
  FileText,
  ArrowRight,
  CheckCircle2,
  Server,
  Layers
} from "lucide-react";
import { Link } from "wouter";

export default function Demo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 text-sm px-4 py-2">
            <Sparkles className="w-4 h-4 mr-2" />
            交互式功能展示
          </Badge>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            心理健康AI辅导平台
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            一个完整的AI驱动心理健康辅导系统,集成了智能对话、心理评估、个性化治疗计划生成等功能
          </p>
          <div className="flex gap-4 justify-center mt-6">
            <Button size="lg" asChild>
              <Link href="/">返回首页</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/chat">体验对话</Link>
            </Button>
          </div>
        </div>

        {/* Feature Tabs */}
        <Tabs defaultValue="features" className="mb-12">
          <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto">
            <TabsTrigger value="features">核心功能</TabsTrigger>
            <TabsTrigger value="architecture">技术架构</TabsTrigger>
            <TabsTrigger value="data">数据流程</TabsTrigger>
          </TabsList>

          <TabsContent value="features" className="space-y-6 mt-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeatureCard
                icon={<MessageCircle className="w-8 h-8 text-primary" />}
                title="AI智能对话"
                description="基于先进的大语言模型,提供专业的心理咨询对话服务"
                features={[
                  "温暖同理的对话风格",
                  "上下文记忆能力",
                  "实时响应",
                  "支持文字和语音输入"
                ]}
              />
              
              <FeatureCard
                icon={<Brain className="w-8 h-8 text-secondary" />}
                title="心理状态评估"
                description="通过AI分析对话内容,生成专业的心理健康评估报告"
                features={[
                  "多维度心理状态分析",
                  "严重程度评级",
                  "详细的评估报告",
                  "初步治疗建议"
                ]}
              />
              
              <FeatureCard
                icon={<Heart className="w-8 h-8 text-primary" />}
                title="个性化治疗计划"
                description="根据评估结果,AI生成量身定制的心理治疗方案"
                features={[
                  "明确的治疗目标",
                  "具体可执行的活动",
                  "进度跟踪系统",
                  "文档下载功能"
                ]}
              />
              
              <FeatureCard
                icon={<Mic className="w-8 h-8 text-secondary" />}
                title="语音输入"
                description="支持语音转文字功能,让表达更自然便捷"
                features={[
                  "实时语音识别",
                  "高准确率转换",
                  "多语言支持",
                  "音频文件保存"
                ]}
              />
              
              <FeatureCard
                icon={<Bell className="w-8 h-8 text-primary" />}
                title="智能提醒"
                description="定期提醒用户进行心理健康检查和活动"
                features={[
                  "自定义提醒频率",
                  "关怀消息推送",
                  "活动提醒",
                  "长期未登录关怀"
                ]}
              />
              
              <FeatureCard
                icon={<Shield className="w-8 h-8 text-secondary" />}
                title="隐私保护"
                description="严格的数据安全措施,保护用户隐私"
                features={[
                  "数据加密存储",
                  "HTTPS传输",
                  "访问权限控制",
                  "云端安全备份"
                ]}
              />
            </div>
          </TabsContent>

          <TabsContent value="architecture" className="mt-8">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Layers className="w-5 h-5 text-primary" />
                    </div>
                    <CardTitle>前端技术栈</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <TechItem name="React 19" description="最新的React框架,提供出色的性能和开发体验" />
                  <TechItem name="Tailwind CSS 4" description="优雅的样式系统,实现精美的界面设计" />
                  <TechItem name="tRPC" description="端到端类型安全的API调用" />
                  <TechItem name="Wouter" description="轻量级路由管理" />
                  <TechItem name="shadcn/ui" description="现代化的UI组件库" />
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                      <Server className="w-5 h-5 text-secondary" />
                    </div>
                    <CardTitle>后端技术栈</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <TechItem name="Node.js + Express" description="高性能的服务器框架" />
                  <TechItem name="tRPC 11" description="类型安全的API层" />
                  <TechItem name="Drizzle ORM" description="现代化的数据库ORM" />
                  <TechItem name="MySQL/TiDB" description="可靠的关系型数据库" />
                  <TechItem name="Manus OAuth" description="安全的用户认证系统" />
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Brain className="w-5 h-5 text-primary" />
                    </div>
                    <CardTitle>AI能力集成</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <TechItem name="大语言模型" description="提供智能对话和心理分析能力" />
                  <TechItem name="结构化输出" description="生成JSON格式的评估和治疗计划" />
                  <TechItem name="语音转文字" description="Whisper API实现高精度转换" />
                  <TechItem name="上下文记忆" description="保持对话连贯性" />
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                      <Cloud className="w-5 h-5 text-secondary" />
                    </div>
                    <CardTitle>云服务集成</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <TechItem name="S3存储" description="安全存储治疗计划和评估文档" />
                  <TechItem name="通知服务" description="推送提醒和关怀消息" />
                  <TechItem name="Manus平台" description="一站式部署和管理" />
                  <TechItem name="自动扩展" description="根据负载自动调整资源" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="data" className="mt-8">
            <div className="space-y-6">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-primary" />
                    数据库设计
                  </CardTitle>
                  <CardDescription>
                    完整的数据模型,支持用户、对话、评估、治疗计划等核心功能
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <DatabaseTable name="users" description="用户基本信息和认证数据" />
                    <DatabaseTable name="userProfiles" description="用户偏好设置和配置" />
                    <DatabaseTable name="conversations" description="对话会话记录" />
                    <DatabaseTable name="messages" description="对话消息内容" />
                    <DatabaseTable name="assessments" description="心理评估报告" />
                    <DatabaseTable name="treatmentPlans" description="个性化治疗计划" />
                    <DatabaseTable name="reminders" description="提醒和通知记录" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    用户流程
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <FlowStep 
                      number={1} 
                      title="用户登录" 
                      description="通过Manus OAuth进行安全认证"
                    />
                    <FlowStep 
                      number={2} 
                      title="开始对话" 
                      description="与AI心理顾问进行深度交流,支持文字和语音输入"
                    />
                    <FlowStep 
                      number={3} 
                      title="生成评估" 
                      description="AI分析对话内容,生成心理健康评估报告"
                    />
                    <FlowStep 
                      number={4} 
                      title="制定计划" 
                      description="基于评估结果,生成个性化治疗计划"
                    />
                    <FlowStep 
                      number={5} 
                      title="跟踪进度" 
                      description="记录治疗进展,定期提醒和关怀"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4">立即体验完整功能</h2>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            这是一个功能完整的心理健康AI辅导平台,包含了从用户认证到治疗计划生成的全流程功能
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/chat">
                开始对话
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/assessments">查看评估</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ 
  icon, 
  title, 
  description, 
  features 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  features: string[];
}) {
  return (
    <Card className="border-2 hover:border-primary/50 transition-all duration-300">
      <CardHeader>
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          {icon}
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function TechItem({ name, description }: { name: string; description: string }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
      <div>
        <div className="font-semibold text-sm">{name}</div>
        <div className="text-xs text-muted-foreground mt-1">{description}</div>
      </div>
    </div>
  );
}

function DatabaseTable({ name, description }: { name: string; description: string }) {
  return (
    <div className="p-4 rounded-lg border bg-card">
      <div className="flex items-center gap-2 mb-2">
        <FileText className="w-4 h-4 text-primary" />
        <div className="font-mono text-sm font-semibold">{name}</div>
      </div>
      <div className="text-xs text-muted-foreground">{description}</div>
    </div>
  );
}

function FlowStep({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
        {number}
      </div>
      <div className="flex-1">
        <div className="font-semibold mb-1">{title}</div>
        <div className="text-sm text-muted-foreground">{description}</div>
      </div>
    </div>
  );
}
