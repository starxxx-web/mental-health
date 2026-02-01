import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";
import * as db from "./db";
import { voiceRouter } from "./voiceRouter";
import { treatmentPlanGeneratorRouter } from "./treatmentPlanGenerator";
import { reminderServiceRouter } from "./reminderService";

export const appRouter = router({
  system: systemRouter,
  voice: voiceRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // User Profile Management
  profile: router({
    get: protectedProcedure.query(async ({ ctx }) => {
      const profile = await db.getUserProfile(ctx.user.id);
      if (!profile) {
        // Create default profile if not exists
        await db.createUserProfile({
          userId: ctx.user.id,
          timezone: "Asia/Shanghai",
          preferredLanguage: "zh-CN",
          reminderFrequency: "weekly",
          enableReminders: 1,
        });
        return await db.getUserProfile(ctx.user.id);
      }
      return profile;
    }),
    update: protectedProcedure
      .input(z.object({
        timezone: z.string().optional(),
        preferredLanguage: z.string().optional(),
        reminderFrequency: z.enum(["daily", "weekly", "biweekly", "monthly"]).optional(),
        enableReminders: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.updateUserProfile(ctx.user.id, input);
        return { success: true };
      }),
  }),

  // Conversation Management
  conversation: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserConversations(ctx.user.id);
    }),
    create: protectedProcedure
      .input(z.object({
        title: z.string().default("新对话"),
      }))
      .mutation(async ({ ctx, input }) => {
        const conversationId = await db.createConversation({
          userId: ctx.user.id,
          title: input.title,
          status: "active",
        });
        return { conversationId };
      }),
    get: protectedProcedure
      .input(z.object({ conversationId: z.number() }))
      .query(async ({ ctx, input }) => {
        const conversation = await db.getConversationById(input.conversationId);
        if (!conversation || conversation.userId !== ctx.user.id) {
          throw new Error("Conversation not found or access denied");
        }
        const messages = await db.getConversationMessages(input.conversationId);
        return { conversation, messages };
      }),
    updateStatus: protectedProcedure
      .input(z.object({
        conversationId: z.number(),
        status: z.enum(["active", "completed", "archived"]),
      }))
      .mutation(async ({ ctx, input }) => {
        const conversation = await db.getConversationById(input.conversationId);
        if (!conversation || conversation.userId !== ctx.user.id) {
          throw new Error("Conversation not found or access denied");
        }
        await db.updateConversation(input.conversationId, { status: input.status });
        return { success: true };
      }),
  }),

  // AI Chat System
  chat: router({
    sendMessage: protectedProcedure
      .input(z.object({
        conversationId: z.number(),
        content: z.string(),
        audioUrl: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Verify conversation ownership
        const conversation = await db.getConversationById(input.conversationId);
        if (!conversation || conversation.userId !== ctx.user.id) {
          throw new Error("Conversation not found or access denied");
        }

        // Save user message
        await db.createMessage({
          conversationId: input.conversationId,
          role: "user",
          content: input.content,
          audioUrl: input.audioUrl,
        });

        // Get conversation history for context
        const messages = await db.getConversationMessages(input.conversationId);
        
        // Build AI prompt with psychological counseling context
        const systemPrompt = `你是一位专业的心理健康顾问和咨询师。你的职责是:
1. 以温暖、同理心和专业的态度与用户交流
2. 通过对话了解用户的心理状态、情绪和困扰
3. 提供心理支持和建议,帮助用户缓解压力和焦虑
4. 在适当的时候询问用户的感受、想法和生活状况
5. 保持对话的连贯性,记住之前讨论的内容
6. 如果发现严重的心理健康问题,建议用户寻求专业医疗帮助

请用简洁、温暖的语言回复,每次回复控制在200字以内。`;

        const conversationHistory = messages.map(m => ({
          role: m.role as "user" | "assistant" | "system",
          content: m.content,
        }));

        // Call AI to generate response
        const aiResponse = await invokeLLM({
          messages: [
            { role: "system", content: systemPrompt },
            ...conversationHistory,
            { role: "user", content: input.content },
          ],
        });

        const responseContent = aiResponse.choices[0]?.message?.content;
        const aiContent = typeof responseContent === 'string' ? responseContent : "抱歉,我现在无法回复。请稍后再试。";

        // Save AI response
        await db.createMessage({
          conversationId: input.conversationId,
          role: "assistant",
          content: aiContent,
        });

        // Update conversation timestamp
        await db.updateConversation(input.conversationId, {
          updatedAt: new Date(),
        });

        return { content: aiContent };
      }),
    
    // Stream AI response (for real-time chat experience)
    streamMessage: protectedProcedure
      .input(z.object({
        conversationId: z.number(),
        content: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Similar to sendMessage but returns streaming response
        const conversation = await db.getConversationById(input.conversationId);
        if (!conversation || conversation.userId !== ctx.user.id) {
          throw new Error("Conversation not found or access denied");
        }

        await db.createMessage({
          conversationId: input.conversationId,
          role: "user",
          content: input.content,
        });

        const messages = await db.getConversationMessages(input.conversationId);
        
        const systemPrompt = `你是一位专业的心理健康顾问和咨询师。你的职责是:
1. 以温暖、同理心和专业的态度与用户交流
2. 通过对话了解用户的心理状态、情绪和困扰
3. 提供心理支持和建议,帮助用户缓解压力和焦虑
4. 在适当的时候询问用户的感受、想法和生活状况
5. 保持对话的连贯性,记住之前讨论的内容
6. 如果发现严重的心理健康问题,建议用户寻求专业医疗帮助

请用简洁、温暖的语言回复,每次回复控制在200字以内。`;

        const conversationHistory = messages.map(m => ({
          role: m.role as "user" | "assistant" | "system",
          content: m.content,
        }));

        const aiResponse = await invokeLLM({
          messages: [
            { role: "system", content: systemPrompt },
            ...conversationHistory,
            { role: "user", content: input.content },
          ],
        });

        const responseContent = aiResponse.choices[0]?.message?.content;
        const aiContent = typeof responseContent === 'string' ? responseContent : "抱歉,我现在无法回复。请稍后再试。";

        await db.createMessage({
          conversationId: input.conversationId,
          role: "assistant",
          content: aiContent,
        });

        await db.updateConversation(input.conversationId, {
          updatedAt: new Date(),
        });

        return { content: aiContent };
      }),
  }),

  // Psychological Assessment
  assessment: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserAssessments(ctx.user.id);
    }),
    create: protectedProcedure
      .input(z.object({
        conversationId: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Verify conversation ownership
        const conversation = await db.getConversationById(input.conversationId);
        if (!conversation || conversation.userId !== ctx.user.id) {
          throw new Error("Conversation not found or access denied");
        }

        // Get conversation messages for analysis
        const messages = await db.getConversationMessages(input.conversationId);
        const userMessages = messages.filter(m => m.role === "user").map(m => m.content).join("\n");

        // Use AI to analyze mental state
        const analysisPrompt = `作为专业心理咨询师,请根据以下用户的对话内容,进行心理状态评估:

用户对话内容:
${userMessages}

请以JSON格式返回评估结果,包含以下字段:
{
  "mentalState": "主要心理状态(如:焦虑、抑郁、压力过大、情绪稳定等)",
  "severity": "严重程度(low/moderate/high)",
  "analysis": "详细的心理状态分析(200-300字)",
  "recommendations": "初步建议(3-5条具体建议)"
}`;

        const analysisResponse = await invokeLLM({
          messages: [
            { role: "system", content: "你是一位专业的心理评估专家。" },
            { role: "user", content: analysisPrompt },
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "mental_assessment",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  mentalState: { type: "string" },
                  severity: { type: "string", enum: ["low", "moderate", "high"] },
                  analysis: { type: "string" },
                  recommendations: { type: "string" },
                },
                required: ["mentalState", "severity", "analysis", "recommendations"],
                additionalProperties: false,
              },
            },
          },
        });

        const responseContent = analysisResponse.choices[0]?.message?.content;
        const contentString = typeof responseContent === 'string' ? responseContent : '{}';
        const assessmentData = JSON.parse(contentString);

        // Save assessment to database
        const assessmentId = await db.createAssessment({
          userId: ctx.user.id,
          conversationId: input.conversationId,
          mentalState: assessmentData.mentalState,
          severity: assessmentData.severity as "low" | "moderate" | "high",
          analysis: assessmentData.analysis,
          recommendations: assessmentData.recommendations,
        });

        return { assessmentId, ...assessmentData };
      }),
    get: protectedProcedure
      .input(z.object({ assessmentId: z.number() }))
      .query(async ({ ctx, input }) => {
        const assessment = await db.getAssessmentById(input.assessmentId);
        if (!assessment || assessment.userId !== ctx.user.id) {
          throw new Error("Assessment not found or access denied");
        }
        return assessment;
      }),
  }),

  // Treatment Plan Generation
  treatmentPlanGenerator: treatmentPlanGeneratorRouter,

  // Treatment Plan Management
  treatmentPlan: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserTreatmentPlans(ctx.user.id);
    }),
    get: protectedProcedure
      .input(z.object({ planId: z.number() }))
      .query(async ({ ctx, input }) => {
        const plan = await db.getTreatmentPlanById(input.planId);
        if (!plan || plan.userId !== ctx.user.id) {
          throw new Error("Treatment plan not found or access denied");
        }
        return plan;
      }),
    updateProgress: protectedProcedure
      .input(z.object({
        planId: z.number(),
        progress: z.number().min(0).max(100),
      }))
      .mutation(async ({ ctx, input }) => {
        const plan = await db.getTreatmentPlanById(input.planId);
        if (!plan || plan.userId !== ctx.user.id) {
          throw new Error("Treatment plan not found or access denied");
        }
        await db.updateTreatmentPlan(input.planId, { progress: input.progress });
        return { success: true };
      }),
    updateStatus: protectedProcedure
      .input(z.object({
        planId: z.number(),
        status: z.enum(["active", "completed", "paused"]),
      }))
      .mutation(async ({ ctx, input }) => {
        const plan = await db.getTreatmentPlanById(input.planId);
        if (!plan || plan.userId !== ctx.user.id) {
          throw new Error("Treatment plan not found or access denied");
        }
        await db.updateTreatmentPlan(input.planId, { status: input.status });
        return { success: true };
      }),
  }),

  // Reminders
  reminder: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserReminders(ctx.user.id);
    }),
  }),

  // Reminder Service
  reminderService: reminderServiceRouter,
});

export type AppRouter = typeof appRouter;
