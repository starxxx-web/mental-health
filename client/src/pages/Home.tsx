import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { Brain, Heart, MessageCircle, Shield, Sparkles, TrendingUp } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="animate-pulse text-muted-foreground">加载中...</div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <AuthenticatedHome />;
  }

  return <LandingPage />;
}

function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">AI驱动的心理健康辅导平台</span>
          </div>
          
          <h1 className="text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            您的心理健康守护者
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            通过AI智能对话,我们为您提供专业的心理健康评估和个性化治疗方案。
            在这里,您可以安全地表达自己的感受,获得温暖的支持和科学的指导。
          </p>
          
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" asChild className="text-lg px-8">
              <a href={getLoginUrl()}>开始使用</a>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8">
              <Link href="/demo">功能展示</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8">
              <a href="#features">了解更多</a>
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <MessageCircle className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>AI智能对话</CardTitle>
              <CardDescription>
                与专业的AI心理顾问进行深度对话,随时随地获得心理支持
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-secondary" />
              </div>
              <CardTitle>心理状态评估</CardTitle>
              <CardDescription>
                基于对话内容的智能分析,准确评估您的心理健康状况
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>个性化治疗计划</CardTitle>
              <CardDescription>
                根据评估结果,为您量身定制专属的心理治疗方案
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-secondary" />
              </div>
              <CardTitle>进度跟踪</CardTitle>
              <CardDescription>
                记录您的治疗进展,可视化展示心理健康改善过程
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>隐私保护</CardTitle>
              <CardDescription>
                所有数据加密存储,严格保护您的隐私和心理健康信息
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-secondary" />
              </div>
              <CardTitle>语音输入</CardTitle>
              <CardDescription>
                支持语音和文字输入,让表达更自然,沟通更便捷
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4">开始您的心理健康之旅</h2>
          <p className="text-lg text-muted-foreground mb-6">
            让AI成为您的心理健康伙伴,一起迈向更好的自己
          </p>
          <Button size="lg" asChild className="text-lg px-8">
            <a href={getLoginUrl()}>立即体验</a>
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-card/50 backdrop-blur-sm py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2026 心理健康AI辅导平台 · 关爱心理健康,从现在开始</p>
        </div>
      </footer>
    </div>
  );
}

function AuthenticatedHome() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-4">欢迎回来</h1>
            <p className="text-lg text-muted-foreground">
              很高兴再次见到您。让我们继续您的心理健康之旅。
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/chat">
              <Card className="cursor-pointer border-2 hover:border-primary transition-all duration-300 hover:shadow-lg h-full">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <MessageCircle className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>开始对话</CardTitle>
                  <CardDescription>
                    与AI心理顾问聊天,分享您的感受和想法
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">进入对话</Button>
                </CardContent>
              </Card>
            </Link>

            <Link href="/assessments">
              <Card className="cursor-pointer border-2 hover:border-secondary transition-all duration-300 hover:shadow-lg h-full">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                    <Brain className="w-6 h-6 text-secondary" />
                  </div>
                  <CardTitle>心理评估</CardTitle>
                  <CardDescription>
                    查看您的心理健康评估报告和分析
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="secondary" className="w-full">查看评估</Button>
                </CardContent>
              </Card>
            </Link>

            <Link href="/treatment-plans">
              <Card className="cursor-pointer border-2 hover:border-primary transition-all duration-300 hover:shadow-lg h-full">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Heart className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>治疗计划</CardTitle>
                  <CardDescription>
                    查看和管理您的个性化治疗计划
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">查看计划</Button>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
