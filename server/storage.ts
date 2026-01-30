import { 
  stats, documents, roadmaps, flashcardDecks, flashcards, interviews, codeSnippets, applications, expenses,
  type InsertStats, type InsertDocument, type InsertRoadmap, type InsertFlashcardDeck, type InsertFlashcard, type InsertInterview, type InsertCodeSnippet, type InsertApplication, type InsertExpense,
  type Stats, type Document, type Roadmap, type FlashcardDeck, type Flashcard, type Interview, type CodeSnippet, type Application, type Expense
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Stats
  getStats(userId: string): Promise<Stats | undefined>;
  upsertStats(stats: InsertStats & { userId: string }): Promise<Stats>;

  // Documents
  getDocuments(userId: string): Promise<Document[]>;
  createDocument(doc: InsertDocument & { userId: string }): Promise<Document>;
  updateDocument(id: number, doc: Partial<InsertDocument>): Promise<Document | undefined>;
  deleteDocument(id: number): Promise<void>;

  // Roadmaps
  getRoadmaps(userId: string): Promise<Roadmap[]>;
  createRoadmap(roadmap: InsertRoadmap & { userId: string }): Promise<Roadmap>;

  // Flashcards
  getFlashcardDecks(userId: string): Promise<FlashcardDeck[]>;
  createFlashcardDeck(deck: InsertFlashcardDeck & { userId: string }): Promise<FlashcardDeck>;
  getFlashcards(deckId: number): Promise<Flashcard[]>;
  createFlashcard(card: InsertFlashcard): Promise<Flashcard>;

  // Interviews
  getInterviews(userId: string): Promise<Interview[]>;
  createInterview(interview: InsertInterview & { userId: string }): Promise<Interview>;
  updateInterviewMessages(id: number, messages: any[]): Promise<Interview | undefined>;

  // Code Snippets
  getCodeSnippets(userId: string): Promise<CodeSnippet[]>;
  createCodeSnippet(snippet: InsertCodeSnippet & { userId: string }): Promise<CodeSnippet>;
  updateCodeSnippet(id: number, snippet: Partial<InsertCodeSnippet>): Promise<CodeSnippet | undefined>;
  deleteCodeSnippet(id: number): Promise<void>;

  // Applications
  getApplications(userId: string): Promise<Application[]>;
  createApplication(app: InsertApplication & { userId: string }): Promise<Application>;
  updateApplication(id: number, app: Partial<InsertApplication>): Promise<Application | undefined>;
  deleteApplication(id: number): Promise<void>;

  // Expenses
  getExpenses(userId: string): Promise<Expense[]>;
  createExpense(expense: InsertExpense & { userId: string }): Promise<Expense>;
  deleteExpense(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // Stats
  async getStats(userId: string): Promise<Stats | undefined> {
    const [stat] = await db.select().from(stats).where(eq(stats.userId, userId));
    return stat;
  }

  async upsertStats(insertStats: InsertStats & { userId: string }): Promise<Stats> {
    const [stat] = await db
      .insert(stats)
      .values(insertStats)
      .onConflictDoUpdate({
        target: stats.userId,
        set: insertStats,
      })
      .returning();
    return stat;
  }

  // Documents
  async getDocuments(userId: string): Promise<Document[]> {
    return await db.select().from(documents).where(eq(documents.userId, userId)).orderBy(desc(documents.createdAt));
  }

  async createDocument(doc: InsertDocument & { userId: string }): Promise<Document> {
    const [newDoc] = await db.insert(documents).values(doc).returning();
    return newDoc;
  }

  async updateDocument(id: number, doc: Partial<InsertDocument>): Promise<Document | undefined> {
    const [updatedDoc] = await db.update(documents).set({ ...doc, updatedAt: new Date() }).where(eq(documents.id, id)).returning();
    return updatedDoc;
  }

  async deleteDocument(id: number): Promise<void> {
    await db.delete(documents).where(eq(documents.id, id));
  }

  // Roadmaps
  async getRoadmaps(userId: string): Promise<Roadmap[]> {
    return await db.select().from(roadmaps).where(eq(roadmaps.userId, userId));
  }

  async createRoadmap(roadmap: InsertRoadmap & { userId: string }): Promise<Roadmap> {
    const [newRoadmap] = await db.insert(roadmaps).values(roadmap).returning();
    return newRoadmap;
  }

  // Flashcards
  async getFlashcardDecks(userId: string): Promise<FlashcardDeck[]> {
    return await db.select().from(flashcardDecks).where(eq(flashcardDecks.userId, userId));
  }

  async createFlashcardDeck(deck: InsertFlashcardDeck & { userId: string }): Promise<FlashcardDeck> {
    const [newDeck] = await db.insert(flashcardDecks).values(deck).returning();
    return newDeck;
  }

  async getFlashcards(deckId: number): Promise<Flashcard[]> {
    return await db.select().from(flashcards).where(eq(flashcards.deckId, deckId));
  }

  async createFlashcard(card: InsertFlashcard): Promise<Flashcard> {
    const [newCard] = await db.insert(flashcards).values(card).returning();
    return newCard;
  }

  // Interviews
  async getInterviews(userId: string): Promise<Interview[]> {
    return await db.select().from(interviews).where(eq(interviews.userId, userId)).orderBy(desc(interviews.createdAt));
  }

  async createInterview(interview: InsertInterview & { userId: string }): Promise<Interview> {
    const [newInterview] = await db.insert(interviews).values(interview).returning();
    return newInterview;
  }

  async updateInterviewMessages(id: number, messages: any[]): Promise<Interview | undefined> {
    const [updated] = await db.update(interviews).set({ messages }).where(eq(interviews.id, id)).returning();
    return updated;
  }

  // Code Snippets
  async getCodeSnippets(userId: string): Promise<CodeSnippet[]> {
    return await db.select().from(codeSnippets).where(eq(codeSnippets.userId, userId));
  }

  async createCodeSnippet(snippet: InsertCodeSnippet & { userId: string }): Promise<CodeSnippet> {
    const [newSnippet] = await db.insert(codeSnippets).values(snippet).returning();
    return newSnippet;
  }

  async updateCodeSnippet(id: number, snippet: Partial<InsertCodeSnippet>): Promise<CodeSnippet | undefined> {
    const [updated] = await db.update(codeSnippets).set(snippet).where(eq(codeSnippets.id, id)).returning();
    return updated;
  }

  async deleteCodeSnippet(id: number): Promise<void> {
    await db.delete(codeSnippets).where(eq(codeSnippets.id, id));
  }

  // Applications
  async getApplications(userId: string): Promise<Application[]> {
    return await db.select().from(applications).where(eq(applications.userId, userId)).orderBy(desc(applications.dateApplied));
  }

  async createApplication(app: InsertApplication & { userId: string }): Promise<Application> {
    const [newApp] = await db.insert(applications).values(app).returning();
    return newApp;
  }

  async updateApplication(id: number, app: Partial<InsertApplication>): Promise<Application | undefined> {
    const [updated] = await db.update(applications).set(app).where(eq(applications.id, id)).returning();
    return updated;
  }

  async deleteApplication(id: number): Promise<void> {
    await db.delete(applications).where(eq(applications.id, id));
  }

  // Expenses
  async getExpenses(userId: string): Promise<Expense[]> {
    return await db.select().from(expenses).where(eq(expenses.userId, userId)).orderBy(desc(expenses.date));
  }

  async createExpense(expense: InsertExpense & { userId: string }): Promise<Expense> {
    const [newExpense] = await db.insert(expenses).values(expense).returning();
    return newExpense;
  }

  async deleteExpense(id: number): Promise<void> {
    await db.delete(expenses).where(eq(expenses.id, id));
  }
}

export const storage = new DatabaseStorage();
