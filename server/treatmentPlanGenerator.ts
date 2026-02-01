import { z } from "zod";
import { protectedProcedure, router } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";
import { storagePut } from "./storage";
import * as db from "./db";
import { nanoid } from "nanoid";

export const treatmentPlanGeneratorRouter = router({
  generate: protectedProcedure
    .input(z.object({
      assessmentId: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Get assessment data
      const assessment = await db.getAssessmentById(input.assessmentId);
      if (!assessment || assessment.userId !== ctx.user.id) {
        throw new Error("Assessment not found or access denied");
      }

      // Generate treatment plan using AI
      const planPrompt = `作为专业心理治疗师,请根据以下心理评估结果,制定一个详细的个性化治疗计划:

心理状态: ${assessment.mentalState}
严重程度: ${assessment.severity}
分析: ${assessment.analysis}
初步建议: ${assessment.recommendations}

请以JSON格式返回治疗计划,包含以下字段:
{
  "title": "治疗计划标题",
  "description": "治疗计划总体描述(200-300字)",
  "goals": ["目标1", "目标2", "目标3"],
  "activities": [
    {
      "title": "活动名称",
      "description": "活动详细描述",
      "frequency": "频率(如:每天、每周3次)",
      "duration": "持续时间(如:15分钟、30分钟)"
    }
  ],
  "duration": "整体治疗周期(如:4周、2个月)"
}

请确保治疗计划:
1. 针对用户的具体心理状态
2. 包含3-5个明确的治疗目标
3. 包含5-8个具体可执行的活动
4. 活动涵盖认知、行为、情绪调节等多个方面
5. 考虑用户的实际可操作性`;

      const planResponse = await invokeLLM({
        messages: [
          { role: "system", content: "你是一位经验丰富的心理治疗师。" },
          { role: "user", content: planPrompt },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "treatment_plan",
            strict: true,
            schema: {
              type: "object",
              properties: {
                title: { type: "string" },
                description: { type: "string" },
                goals: {
                  type: "array",
                  items: { type: "string" },
                },
                activities: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      title: { type: "string" },
                      description: { type: "string" },
                      frequency: { type: "string" },
                      duration: { type: "string" },
                    },
                    required: ["title", "description", "frequency", "duration"],
                    additionalProperties: false,
                  },
                },
                duration: { type: "string" },
              },
              required: ["title", "description", "goals", "activities", "duration"],
              additionalProperties: false,
            },
          },
        },
      });

      const responseContent = planResponse.choices[0]?.message?.content;
      const contentString = typeof responseContent === 'string' ? responseContent : '{}';
      const planData = JSON.parse(contentString);

      // Generate PDF document
      const documentContent = generatePlanDocument(planData, assessment);
      
      // Upload to S3
      const fileKey = `treatment-plans/${ctx.user.id}/${nanoid()}.txt`;
      const { url: documentUrl } = await storagePut(
        fileKey,
        documentContent,
        "text/plain"
      );

      // Save treatment plan to database
      const planId = await db.createTreatmentPlan({
        userId: ctx.user.id,
        assessmentId: input.assessmentId,
        title: planData.title,
        description: planData.description,
        goals: planData.goals,
        activities: planData.activities,
        duration: planData.duration,
        status: "active",
        progress: 0,
        documentUrl,
      });

      return {
        planId,
        documentUrl,
        ...planData,
      };
    }),
});

function generatePlanDocument(planData: any, assessment: any): string {
  return `
===========================================
个性化心理治疗计划
===========================================

生成时间: ${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}

-------------------------------------------
一、评估概要
-------------------------------------------

心理状态: ${assessment.mentalState}
严重程度: ${assessment.severity === 'low' ? '轻度' : assessment.severity === 'moderate' ? '中度' : '重度'}

评估分析:
${assessment.analysis}

-------------------------------------------
二、治疗计划
-------------------------------------------

计划名称: ${planData.title}

计划描述:
${planData.description}

治疗周期: ${planData.duration}

-------------------------------------------
三、治疗目标
-------------------------------------------

${planData.goals.map((goal: string, index: number) => `${index + 1}. ${goal}`).join('\n')}

-------------------------------------------
四、治疗活动
-------------------------------------------

${planData.activities.map((activity: any, index: number) => `
${index + 1}. ${activity.title}
   
   描述: ${activity.description}
   频率: ${activity.frequency}
   时长: ${activity.duration}
`).join('\n')}

-------------------------------------------
五、注意事项
-------------------------------------------

1. 请按照治疗计划的建议,循序渐进地进行各项活动
2. 如遇到困难或不适,请及时与心理咨询师沟通
3. 定期记录自己的感受和进展,有助于调整治疗方案
4. 保持积极的心态,相信自己能够改善心理状态
5. 如出现严重的心理问题,请及时寻求专业医疗帮助

-------------------------------------------
祝您早日康复,拥有健康快乐的生活!
-------------------------------------------
`;
}
