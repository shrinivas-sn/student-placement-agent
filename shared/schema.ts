import { pgTable, text, serial, integer, boolean, timestamp, jsonb, numeric } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./models/auth";

export * from "./models/auth";

// Hub 1: Dashboard Stats
export const stats = pgTable("stats", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  placementProbability: integer("placement_probability").default(0),
  streak: integer("streak").default(0),
  upcomingDeadlines: jsonb("upcoming_deadlines").$type<{title: string, date: string}[]>().default([]),
});

// Hub 2: Document Forge (Resumes, Cover Letters)
export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  type: text("type").notNull(), // 'resume', 'cover_letter'
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Hub 3: Knowledge Core (Roadmaps, Flashcards)
export const roadmaps = pgTable("roadmaps", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  steps: jsonb("steps").$type<{title: string, status: 'pending'|'completed'}[]>().default([]),
});

export const flashcardDecks = pgTable("flashcard_decks", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
});

export const flashcards = pgTable("flashcards", {
  id: serial("id").primaryKey(),
  deckId: integer("deck_id").notNull().references(() => flashcardDecks.id),
  front: text("front").notNull(),
  back: text("back").notNull(),
});

// Hub 4: Interview Simulator
export const interviews = pgTable("interviews", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  type: text("type").notNull(), // 'behavioral', 'technical'
  messages: jsonb("messages").$type<{role: 'user'|'assistant', content: string}[]>().default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

// Hub 5: Code Lab
export const codeSnippets = pgTable("code_snippets", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  code: text("code").notNull(),
  language: text("language").notNull(),
  notes: text("notes"),
});

// Hub 6: Utilities (Kanban, Expenses)
export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  company: text("company").notNull(),
  position: text("position").notNull(),
  status: text("status").notNull(), // 'applied', 'interview', 'offer', 'rejected'
  dateApplied: timestamp("date_applied").defaultNow(),
  salary: text("salary"),
  notes: text("notes"),
});

export const expenses = pgTable("expenses", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  description: text("description").notNull(),
  amount: numeric("amount").notNull(),
  date: timestamp("date").defaultNow(),
  category: text("category").notNull(),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  stats: one(stats, {
    fields: [users.id],
    references: [stats.userId],
  }),
  documents: many(documents),
  roadmaps: many(roadmaps),
  flashcardDecks: many(flashcardDecks),
  interviews: many(interviews),
  codeSnippets: many(codeSnippets),
  applications: many(applications),
  expenses: many(expenses),
}));

export const flashcardDecksRelations = relations(flashcardDecks, ({ many }) => ({
  cards: many(flashcards),
}));

export const flashcardsRelations = relations(flashcards, ({ one }) => ({
  deck: one(flashcardDecks, {
    fields: [flashcards.deckId],
    references: [flashcardDecks.id],
  }),
}));

// Schemas
export const insertStatsSchema = createInsertSchema(stats).omit({ id: true, userId: true });
export const insertDocumentSchema = createInsertSchema(documents).omit({ id: true, userId: true, createdAt: true, updatedAt: true });
export const insertRoadmapSchema = createInsertSchema(roadmaps).omit({ id: true, userId: true });
export const insertFlashcardDeckSchema = createInsertSchema(flashcardDecks).omit({ id: true, userId: true });
export const insertFlashcardSchema = createInsertSchema(flashcards).omit({ id: true });
export const insertInterviewSchema = createInsertSchema(interviews).omit({ id: true, userId: true, createdAt: true });
export const insertCodeSnippetSchema = createInsertSchema(codeSnippets).omit({ id: true, userId: true });
export const insertApplicationSchema = createInsertSchema(applications).omit({ id: true, userId: true });
export const insertExpenseSchema = createInsertSchema(expenses).omit({ id: true, userId: true });

// Types
export type Stats = typeof stats.$inferSelect;
export type Document = typeof documents.$inferSelect;
export type Roadmap = typeof roadmaps.$inferSelect;
export type FlashcardDeck = typeof flashcardDecks.$inferSelect;
export type Flashcard = typeof flashcards.$inferSelect;
export type Interview = typeof interviews.$inferSelect;
export type CodeSnippet = typeof codeSnippets.$inferSelect;
export type Application = typeof applications.$inferSelect;
export type Expense = typeof expenses.$inferSelect;

export type InsertStats = z.infer<typeof insertStatsSchema>;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type InsertRoadmap = z.infer<typeof insertRoadmapSchema>;
export type InsertFlashcardDeck = z.infer<typeof insertFlashcardDeckSchema>;
export type InsertFlashcard = z.infer<typeof insertFlashcardSchema>;
export type InsertInterview = z.infer<typeof insertInterviewSchema>;
export type InsertCodeSnippet = z.infer<typeof insertCodeSnippetSchema>;
export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type InsertExpense = z.infer<typeof insertExpenseSchema>;

// Custom Types for JSONB fields
export type Deadline = { title: string, date: string };
export type RoadmapStep = { title: string, status: 'pending'|'completed' };
export type ChatMessage = { role: 'user'|'assistant', content: string };
