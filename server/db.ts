import { eq, desc, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users, 
  conversations, 
  messages, 
  assessments, 
  treatmentPlans, 
  reminders, 
  userProfiles,
  InsertConversation,
  InsertMessage,
  InsertAssessment,
  InsertTreatmentPlan,
  InsertReminder,
  InsertUserProfile
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ===== User Management =====

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ===== User Profile Management =====

export async function getUserProfile(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createUserProfile(profile: InsertUserProfile) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(userProfiles).values(profile);
}

export async function updateUserProfile(userId: number, updates: Partial<InsertUserProfile>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(userProfiles).set(updates).where(eq(userProfiles.userId, userId));
}

// ===== Conversation Management =====

export async function createConversation(conversation: InsertConversation) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(conversations).values(conversation);
  return result[0].insertId;
}

export async function getUserConversations(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(conversations).where(eq(conversations.userId, userId)).orderBy(desc(conversations.updatedAt));
}

export async function getConversationById(conversationId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(conversations).where(eq(conversations.id, conversationId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateConversation(conversationId: number, updates: Partial<InsertConversation>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(conversations).set(updates).where(eq(conversations.id, conversationId));
}

// ===== Message Management =====

export async function createMessage(message: InsertMessage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(messages).values(message);
  return result[0].insertId;
}

export async function getConversationMessages(conversationId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(messages).where(eq(messages.conversationId, conversationId)).orderBy(messages.createdAt);
}

// ===== Assessment Management =====

export async function createAssessment(assessment: InsertAssessment) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(assessments).values(assessment);
  return result[0].insertId;
}

export async function getUserAssessments(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(assessments).where(eq(assessments.userId, userId)).orderBy(desc(assessments.createdAt));
}

export async function getAssessmentById(assessmentId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(assessments).where(eq(assessments.id, assessmentId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ===== Treatment Plan Management =====

export async function createTreatmentPlan(plan: InsertTreatmentPlan) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(treatmentPlans).values(plan);
  return result[0].insertId;
}

export async function getUserTreatmentPlans(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(treatmentPlans).where(eq(treatmentPlans.userId, userId)).orderBy(desc(treatmentPlans.createdAt));
}

export async function getTreatmentPlanById(planId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(treatmentPlans).where(eq(treatmentPlans.id, planId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateTreatmentPlan(planId: number, updates: Partial<InsertTreatmentPlan>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(treatmentPlans).set(updates).where(eq(treatmentPlans.id, planId));
}

// ===== Reminder Management =====

export async function createReminder(reminder: InsertReminder) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(reminders).values(reminder);
  return result[0].insertId;
}

export async function getUserReminders(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(reminders).where(eq(reminders.userId, userId)).orderBy(desc(reminders.scheduledAt));
}

export async function getPendingReminders() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(reminders).where(eq(reminders.status, "pending"));
}

export async function updateReminder(reminderId: number, updates: Partial<InsertReminder>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(reminders).set(updates).where(eq(reminders.id, reminderId));
}
