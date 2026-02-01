import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { ArrowLeft, Brain, Loader2, TrendingUp } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";

export default function Assessments() {
  const { isAuthenticated, loading: authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    window.location.href = getLoginUrl();
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">心理评估报告</h1>
        </div>

        <AssessmentList />
      </div>
    </div>
  );
}

function AssessmentList() {
  const { data: assessments, isLoading } = trpc.assessment.list.useQuery();
  const { data: conversations } = trpc.conversation.list.useQuery();
  const createAssessmentMutation = trpc.assessment.create.useMutation({
    onSuccess: () => {
      toast.success("心理评估已生成");
    },
    onError: (error) => {
      toast.error("生成评估失败: " + error.message);
    },
  });

  const handleCreateAssessment = (conversationId: number) => {
    createAssessmentMutation.mutate({ conversationId });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "bg-green-500/10 text-green-700 dark:text-green-400";
      case "moderate":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400";
      case "high":
        return "bg-red-500/10 text-red-700 dark:text-red-400";
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400";
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case "low":
        return "轻度";
      case "moderate":
        return "中度";
      case "high":
        return "重度";
      default:
        return severity;
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
        <p className="text-muted-foreground mt-4">加载评估报告...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Create Assessment Section */}
      {conversations && conversations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              生成新的评估
            </CardTitle>
            <CardDescription>
              基于您的对话内容,生成心理健康评估报告
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {conversations.slice(0, 3).map((conv) => (
                <div key={conv.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{conv.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(conv.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleCreateAssessment(conv.id)}
                    disabled={createAssessmentMutation.isPending}
                  >
                    {createAssessmentMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "生成评估"
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Assessment List */}
      {assessments && assessments.length > 0 ? (
        <div className="grid gap-6">
          {assessments.map((assessment) => (
            <Card key={assessment.id} className="border-2">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-3 mb-2">
                      <span>{assessment.mentalState}</span>
                      <Badge className={getSeverityColor(assessment.severity)}>
                        {getSeverityLabel(assessment.severity)}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      评估时间: {new Date(assessment.createdAt).toLocaleString()}
                    </CardDescription>
                  </div>
                  <Button asChild>
                    <Link href={`/treatment-plans?assessmentId=${assessment.id}`}>
                      <TrendingUp className="w-4 h-4 mr-2" />
                      生成治疗计划
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">心理状态分析</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {assessment.analysis}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">初步建议</h4>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {assessment.recommendations}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">暂无评估报告</h3>
            <p className="text-muted-foreground mb-6">
              完成对话后,您可以生成心理健康评估报告
            </p>
            <Button asChild>
              <Link href="/chat">开始对话</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
