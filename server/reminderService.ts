import { z } from "zod";
import { protectedProcedure, router } from "./_core/trpc";
import { notifyOwner } from "./_core/notification";
import * as db from "./db";

export const reminderServiceRouter = router({
  create: protectedProcedure
    .input(z.object({
      type: z.enum(["check_in", "activity", "care_message"]),
      title: z.string(),
      message: z.string(),
      scheduledAt: z.date(),
    }))
    .mutation(async ({ ctx, input }) => {
      const reminderId = await db.createReminder({
        userId: ctx.user.id,
        type: input.type,
        title: input.title,
        message: input.message,
        scheduledAt: input.scheduledAt,
        status: "pending",
      });

      return { reminderId, success: true };
    }),

  // Schedule automatic check-in reminder
  scheduleCheckIn: protectedProcedure
    .input(z.object({
      daysFromNow: z.number().default(7),
    }))
    .mutation(async ({ ctx, input }) => {
      const scheduledDate = new Date();
      scheduledDate.setDate(scheduledDate.getDate() + input.daysFromNow);

      const reminderId = await db.createReminder({
        userId: ctx.user.id,
        type: "check_in",
        title: "心理健康检查提醒",
        message: "您好!距离上次心理健康对话已经过去一段时间了。我们关心您的心理状态,建议您进行一次心理健康检查,与AI助手聊聊最近的感受。",
        scheduledAt: scheduledDate,
        status: "pending",
      });

      return { reminderId, scheduledDate, success: true };
    }),

  // Send care message for inactive users
  sendCareMessage: protectedProcedure
    .mutation(async ({ ctx }) => {
      // Check user's last conversation
      const conversations = await db.getUserConversations(ctx.user.id);
      
      if (conversations.length === 0) {
        return { sent: false, reason: "No conversations found" };
      }

      const lastConversation = conversations[0];
      const daysSinceLastActivity = Math.floor(
        (Date.now() - lastConversation.updatedAt.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysSinceLastActivity >= 7) {
        // Send care notification
        const sent = await notifyOwner({
          title: `用户 ${ctx.user.name || ctx.user.email} 需要关怀`,
          content: `用户已经 ${daysSinceLastActivity} 天未登录使用心理健康辅导平台。建议发送关怀消息。`,
        });

        // Create reminder for user
        await db.createReminder({
          userId: ctx.user.id,
          type: "care_message",
          title: "我们想念您",
          message: `您好!我们注意到您已经有一段时间没有使用心理健康辅导服务了。我们一直在这里,随时准备倾听您的心声。如果您需要任何帮助,请随时回来与我们交流。`,
          scheduledAt: new Date(),
          status: sent ? "sent" : "failed",
          sentAt: sent ? new Date() : undefined,
        });

        return { sent, daysSinceLastActivity };
      }

      return { sent: false, reason: "User is still active" };
    }),
});

// Background job to process pending reminders (would be called by a scheduler)
export async function processPendingReminders() {
  const pendingReminders = await db.getPendingReminders();
  const now = new Date();

  for (const reminder of pendingReminders) {
    if (reminder.scheduledAt <= now) {
      try {
        // Send notification to owner about the reminder
        const sent = await notifyOwner({
          title: reminder.title,
          content: `提醒用户: ${reminder.message}`,
        });

        // Update reminder status
        await db.updateReminder(reminder.id, {
          status: sent ? "sent" : "failed",
          sentAt: sent ? new Date() : undefined,
        });
      } catch (error) {
        console.error(`Failed to process reminder ${reminder.id}:`, error);
        await db.updateReminder(reminder.id, {
          status: "failed",
        });
      }
    }
  }
}
