import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user-001",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

describe("conversation router", () => {
  it("should create a new conversation", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.conversation.create({
      title: "Test Conversation",
    });

    expect(result).toHaveProperty("conversationId");
    expect(typeof result.conversationId).toBe("number");
  });

  it("should list user conversations", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const conversations = await caller.conversation.list();

    expect(Array.isArray(conversations)).toBe(true);
  });
});

describe("profile router", () => {
  it("should get or create user profile", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const profile = await caller.profile.get();

    expect(profile).toBeDefined();
    if (profile) {
      expect(profile.userId).toBe(ctx.user.id);
      expect(profile).toHaveProperty("timezone");
      expect(profile).toHaveProperty("preferredLanguage");
    }
  });

  it("should update user profile", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.profile.update({
      timezone: "Asia/Shanghai",
      preferredLanguage: "zh-CN",
    });

    expect(result).toEqual({ success: true });
  });
});

describe("assessment router", () => {
  it("should list user assessments", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const assessments = await caller.assessment.list();

    expect(Array.isArray(assessments)).toBe(true);
  });
});

describe("treatment plan router", () => {
  it("should list user treatment plans", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const plans = await caller.treatmentPlan.list();

    expect(Array.isArray(plans)).toBe(true);
  });
});

describe("reminder router", () => {
  it("should list user reminders", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const reminders = await caller.reminder.list();

    expect(Array.isArray(reminders)).toBe(true);
  });
});
