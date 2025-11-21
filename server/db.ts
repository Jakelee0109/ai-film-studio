import { eq, desc, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users, 
  projects, InsertProject,
  scripts, InsertScript,
  storyboards, InsertStoryboard,
  characters, InsertCharacter,
  scenes, InsertScene,
  videos, InsertVideo,
  audios, InsertAudio,
  posters, InsertPoster,
  supportTickets, InsertSupportTicket,
  creditTransactions, InsertCreditTransaction
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

// ============ User Functions ============

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

export async function updateUserCredits(userId: number, amount: number) {
  const db = await getDb();
  if (!db) return;
  
  const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (user.length > 0) {
    const newCredits = user[0].credits + amount;
    await db.update(users).set({ credits: newCredits }).where(eq(users.id, userId));
  }
}

// ============ Project Functions ============

export async function createProject(project: InsertProject) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.insert(projects).values(project);
  return result;
}

export async function getUserProjects(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(projects).where(eq(projects.userId, userId)).orderBy(desc(projects.updatedAt));
}

export async function getProjectById(projectId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(projects).where(eq(projects.id, projectId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updateProject(projectId: number, updates: Partial<InsertProject>) {
  const db = await getDb();
  if (!db) return;
  
  await db.update(projects).set(updates).where(eq(projects.id, projectId));
}

export async function deleteProject(projectId: number) {
  const db = await getDb();
  if (!db) return;
  
  await db.delete(projects).where(eq(projects.id, projectId));
}

// ============ Script Functions ============

export async function createScript(script: InsertScript) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.insert(scripts).values(script);
  return result;
}

export async function getProjectScripts(projectId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(scripts).where(eq(scripts.projectId, projectId)).orderBy(desc(scripts.version));
}

export async function getScriptById(scriptId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(scripts).where(eq(scripts.id, scriptId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

// ============ Storyboard Functions ============

export async function createStoryboard(storyboard: InsertStoryboard) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.insert(storyboards).values(storyboard);
  return result;
}

export async function getProjectStoryboards(projectId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(storyboards).where(eq(storyboards.projectId, projectId)).orderBy(storyboards.sortOrder);
}

// ============ Character Functions ============

export async function createCharacter(character: InsertCharacter) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.insert(characters).values(character);
  return result;
}

export async function getProjectCharacters(projectId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(characters).where(eq(characters.projectId, projectId));
}

// ============ Scene Functions ============

export async function createScene(scene: InsertScene) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.insert(scenes).values(scene);
  return result;
}

export async function getProjectScenes(projectId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(scenes).where(eq(scenes.projectId, projectId));
}

// ============ Video Functions ============

export async function createVideo(video: InsertVideo) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.insert(videos).values(video);
  return result;
}

export async function getProjectVideos(projectId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(videos).where(eq(videos.projectId, projectId));
}

export async function updateVideoStatus(videoId: number, status: "processing" | "completed" | "failed", videoUrl?: string) {
  const db = await getDb();
  if (!db) return;
  
  const updates: any = { status };
  if (videoUrl) updates.videoUrl = videoUrl;
  
  await db.update(videos).set(updates).where(eq(videos.id, videoId));
}

// ============ Audio Functions ============

export async function createAudio(audio: InsertAudio) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.insert(audios).values(audio);
  return result;
}

export async function getProjectAudios(projectId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(audios).where(eq(audios.projectId, projectId));
}

// ============ Poster Functions ============

export async function createPoster(poster: InsertPoster) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.insert(posters).values(poster);
  return result;
}

export async function getProjectPosters(projectId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(posters).where(eq(posters.projectId, projectId));
}

// ============ Support Ticket Functions ============

export async function createSupportTicket(ticket: InsertSupportTicket) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.insert(supportTickets).values(ticket);
  return result;
}

export async function getUserTickets(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(supportTickets).where(eq(supportTickets.userId, userId)).orderBy(desc(supportTickets.createdAt));
}

export async function getAllTickets() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(supportTickets).orderBy(desc(supportTickets.createdAt));
}

export async function updateTicketStatus(ticketId: number, status: "open" | "in_progress" | "resolved" | "closed") {
  const db = await getDb();
  if (!db) return;
  
  await db.update(supportTickets).set({ status }).where(eq(supportTickets.id, ticketId));
}

// ============ Credit Transaction Functions ============

export async function createCreditTransaction(transaction: InsertCreditTransaction) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.insert(creditTransactions).values(transaction);
  
  // Update user credits
  await updateUserCredits(transaction.userId, transaction.amount);
  
  return result;
}

export async function getUserTransactions(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(creditTransactions).where(eq(creditTransactions.userId, userId)).orderBy(desc(creditTransactions.createdAt));
}
