import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { ArrowLeft, Download, Heart, Loader2, CheckCircle2, Clock, Pause } from "lucide-react";
import { Link, useLocation } from "wouter";
import { toast } from "sonner";
import { useEffect, useState } from "react";

export default function TreatmentPlans() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split("?")[1]);
  const assessmentId = searchParams.get("assessmentId");

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
          <h1 className="text-3xl font-bold">治疗计划</h1>
        </div>

        <TreatmentPlanList assessmentId={assessmentId ? parseInt(assessmentId) : undefined} />
      </div>
    </div>
  );
}

function TreatmentPlanList({ assessmentId }: { assessmentId?: number }) {
  const { data: plans, isLoading } = trpc.treatmentPlan.list.useQuery();
  const [generatingForAssessment, setGeneratingForAssessment] = useState<number | null>(null);
  
  const generatePlanMutation = trpc.treatmentPlanGenerator.generate.useMutation({
    onSuccess: () => {
      toast.success("治疗计划已生成");
      setGeneratingForAssessment(null);
    },
    onError: (error) => {
      toast.error("生成治疗计划失败: " + error.message);
      setGeneratingForAssessment(null);
    },
  });

  useEffect(() => {
    if (assessmentId && !generatingForAssessment) {
      setGeneratingForAssessment(assessmentId);
      generatePlanMutation.mutate({ assessmentId });
    }
  }, [assessmentId]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Clock className="w-5 h-5 text-primary" />;
      case "completed":
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case "paused":
        return <Pause className="w-5 h-5 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "进行中";
      case "completed":
        return "已完成";
      case "paused":
        return "已暂停";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-primary/10 text-primary";
      case "completed":
        return "bg-green-500/10 text-green-700 dark:text-green-400";
      case "paused":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400";
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400";
    }
  };

  if (isLoading || generatingForAssessment) {
    return (
      <div className="text-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
        <p className="text-muted-foreground mt-4">
          {generatingForAssessment ? "正在生成治疗计划..." : "加载治疗计划..."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {plans && plans.length > 0 ? (
        <div className="grid gap-6">
          {plans.map((plan) => (
            <Card key={plan.id} className="border-2">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-3 mb-2">
                      <Heart className="w-5 h-5 text-primary" />
                      <span>{plan.title}</span>
                      <Badge className={getStatusColor(plan.status)}>
                        {getStatusIcon(plan.status)}
                        <span className="ml-1">{getStatusLabel(plan.status)}</span>
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      创建时间: {new Date(plan.createdAt).toLocaleString()} · 周期: {plan.duration}
                    </CardDescription>
                  </div>
                  {plan.documentUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={plan.documentUrl} target="_blank" rel="noopener noreferrer">
                        <Download className="w-4 h-4 mr-2" />
                        下载计划
                      </a>
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Progress */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">完成进度</span>
                    <span className="text-sm text-muted-foreground">{plan.progress}%</span>
                  </div>
                  <Progress value={plan.progress} className="h-2" />
                </div>

                {/* Description */}
                <div>
                  <h4 className="font-semibold mb-2">计划描述</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {plan.description}
                  </p>
                </div>

                {/* Goals */}
                <div>
                  <h4 className="font-semibold mb-3">治疗目标</h4>
                  <div className="space-y-2">
                    {plan.goals.map((goal, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{goal}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Activities */}
                <div>
                  <h4 className="font-semibold mb-3">治疗活动</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    {plan.activities.map((activity, index) => (
                      <Card key={index} className="bg-muted/50">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">{activity.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                          <p className="text-muted-foreground">{activity.description}</p>
                          <div className="flex gap-4 text-xs">
                            <span className="text-muted-foreground">
                              频率: <span className="text-foreground font-medium">{activity.frequency}</span>
                            </span>
                            <span className="text-muted-foreground">
                              时长: <span className="text-foreground font-medium">{activity.duration}</span>
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">暂无治疗计划</h3>
            <p className="text-muted-foreground mb-6">
              完成心理评估后,您可以生成个性化的治疗计划
            </p>
            <Button asChild>
              <Link href="/assessments">查看评估</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
