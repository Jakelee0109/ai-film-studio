import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  credits: int("credits").default(10).notNull(), // 用户积分
  subscriptionTier: mysqlEnum("subscriptionTier", ["free", "creator", "studio"]).default("free").notNull(),
  subscriptionExpiry: timestamp("subscriptionExpiry"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Projects - 电影项目
 */
export const projects = mysqlTable("projects", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  status: mysqlEnum("status", ["draft", "in_progress", "completed"]).default("draft").notNull(),
  coverImage: text("coverImage"), // S3 URL
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Project = typeof projects.$inferSelect;
export type InsertProject = typeof projects.$inferInsert;

/**
 * Scripts - 剧本
 */
export const scripts = mysqlTable("scripts", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  content: text("content").notNull(),
  formattedContent: text("formattedContent"), // 格式化后的剧本
  characters: text("characters"), // JSON存储角色分析
  version: int("version").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Script = typeof scripts.$inferSelect;
export type InsertScript = typeof scripts.$inferInsert;

/**
 * Storyboards - 分镜
 */
export const storyboards = mysqlTable("storyboards", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  scriptId: int("scriptId").notNull(),
  sceneNumber: int("sceneNumber").notNull(),
  imageUrl: text("imageUrl").notNull(), // S3 URL
  cameraAngle: varchar("cameraAngle", { length: 100 }), // 运镜角度
  description: text("description"),
  sortOrder: int("sortOrder").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Storyboard = typeof storyboards.$inferSelect;
export type InsertStoryboard = typeof storyboards.$inferInsert;

/**
 * Characters - 角色
 */
export const characters = mysqlTable("characters", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  imageUrl: text("imageUrl"), // 角色形象 S3 URL
  loraModelUrl: text("loraModelUrl"), // LoRA模型URL
  traits: text("traits"), // JSON存储角色特征
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Character = typeof characters.$inferSelect;
export type InsertCharacter = typeof characters.$inferInsert;

/**
 * Scenes - 场景设计
 */
export const scenes = mysqlTable("scenes", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  conceptArtUrl: text("conceptArtUrl").notNull(), // 概念图 S3 URL
  panoramaUrl: text("panoramaUrl"), // 全景图 S3 URL
  props: text("props"), // JSON存储道具列表
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Scene = typeof scenes.$inferSelect;
export type InsertScene = typeof scenes.$inferInsert;

/**
 * Videos - 生成的视频片段
 */
export const videos = mysqlTable("videos", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  storyboardId: int("storyboardId"),
  videoUrl: text("videoUrl").notNull(), // S3 URL
  thumbnailUrl: text("thumbnailUrl"),
  duration: int("duration"), // 时长(秒)
  generationType: mysqlEnum("generationType", ["i2v", "t2v"]).notNull(),
  status: mysqlEnum("status", ["processing", "completed", "failed"]).default("processing").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Video = typeof videos.$inferSelect;
export type InsertVideo = typeof videos.$inferInsert;

/**
 * Audio - 音频资产
 */
export const audios = mysqlTable("audios", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  audioUrl: text("audioUrl").notNull(), // S3 URL
  audioType: mysqlEnum("audioType", ["voiceover", "bgm", "sfx"]).notNull(),
  duration: int("duration"), // 时长(秒)
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Audio = typeof audios.$inferSelect;
export type InsertAudio = typeof audios.$inferInsert;

/**
 * Posters - 海报
 */
export const posters = mysqlTable("posters", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  imageUrl: text("imageUrl").notNull(), // S3 URL
  layout: varchar("layout", { length: 100 }), // 横版/竖版
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Poster = typeof posters.$inferSelect;
export type InsertPoster = typeof posters.$inferInsert;

/**
 * Support Tickets - 客服工单
 */
export const supportTickets = mysqlTable("supportTickets", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  subject: varchar("subject", { length: 255 }).notNull(),
  message: text("message").notNull(),
  status: mysqlEnum("status", ["open", "in_progress", "resolved", "closed"]).default("open").notNull(),
  priority: mysqlEnum("priority", ["low", "medium", "high"]).default("medium").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SupportTicket = typeof supportTickets.$inferSelect;
export type InsertSupportTicket = typeof supportTickets.$inferInsert;

/**
 * Credit Transactions - 积分交易记录
 */
export const creditTransactions = mysqlTable("creditTransactions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  amount: int("amount").notNull(), // 正数为增加,负数为消耗
  transactionType: mysqlEnum("transactionType", ["purchase", "subscription", "usage", "refund"]).notNull(),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CreditTransaction = typeof creditTransactions.$inferSelect;
export type InsertCreditTransaction = typeof creditTransactions.$inferInsert;


/**
 * Project Templates - 项目模板
 */
export const projectTemplates = mysqlTable("projectTemplates", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(), // 模板名称
  slug: varchar("slug", { length: 100 }).notNull().unique(), // URL友好的标识符
  description: text("description"), // 模板描述
  category: varchar("category", { length: 100 }).notNull(), // 分类: 悬疑、科幻等
  thumbnailUrl: text("thumbnailUrl"), // 缩略图 S3 URL
  scriptTemplate: text("scriptTemplate"), // 初始剧本模板
  settingsTemplate: text("settingsTemplate"), // JSON格式的初始设置
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ProjectTemplate = typeof projectTemplates.$inferSelect;
export type InsertProjectTemplate = typeof projectTemplates.$inferInsert;
