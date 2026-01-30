import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";
import { isAuthenticated } from "./replit_integrations/auth";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Auth Setup
  await setupAuth(app);
  registerAuthRoutes(app);

  // Helper to get userId from req.user
  const getUserId = (req: any) => req.user?.claims?.sub;

  // Protect all API routes
  const protectedRouter = (req: any, res: any, next: any) => {
    if (req.path.startsWith("/api/auth") || req.path === "/api/login" || req.path === "/api/logout" || req.path === "/api/callback") {
      return next();
    }
    return isAuthenticated(req, res, next);
  };
  
  // Apply middleware globally or per route. Since we have specific API routes, let's wrap them or apply global.
  // Ideally, use app.use('/api', protectedRouter) but excludes auth routes.
  // For simplicity, I'll add isAuthenticated to each handler logic or use a router.
  
  // Stats
  app.get(api.stats.get.path, isAuthenticated, async (req, res) => {
    const userId = getUserId(req);
    let stats = await storage.getStats(userId);
    if (!stats) {
      // Seed initial data for new user
      stats = await storage.upsertStats({ 
        userId, 
        placementProbability: 45, 
        streak: 1, 
        upcomingDeadlines: [
          { title: "Google Application", date: new Date(Date.now() + 86400000 * 2).toISOString() },
          { title: "Amazon OA", date: new Date(Date.now() + 86400000 * 5).toISOString() }
        ] 
      });
      
      // Seed Documents
      await storage.createDocument({ userId, title: "Software Engineer Resume", type: "resume", content: "Experience: ..." });
      await storage.createDocument({ userId, title: "Cover Letter for Google", type: "cover_letter", content: "Dear Hiring Manager..." });

      // Seed Roadmap
      await storage.createRoadmap({ 
        userId, 
        title: "Frontend Mastery", 
        steps: [
          { title: "Learn React", status: "completed" },
          { title: "Master TypeScript", status: "pending" },
          { title: "Build a Project", status: "pending" }
        ]
      });

      // Seed Flashcards
      const deck = await storage.createFlashcardDeck({ userId, title: "React Interview Questions" });
      await storage.createFlashcard({ deckId: deck.id, front: "What is useEffect?", back: "A hook for side effects." });
      await storage.createFlashcard({ deckId: deck.id, front: "What is Virtual DOM?", back: "A lightweight copy of the real DOM." });

      // Seed Applications
      await storage.createApplication({ userId, company: "Google", position: "L3 SWE", status: "applied", salary: "$180k", notes: "Referral from John" });
      await storage.createApplication({ userId, company: "Meta", position: "E3 SWE", status: "interview", salary: "$190k", notes: "System Design round next" });
    }
    res.json(stats);
  });

  app.post(api.stats.update.path, isAuthenticated, async (req, res) => {
    const userId = getUserId(req);
    const input = api.stats.update.input.parse(req.body);
    const stats = await storage.upsertStats({ ...input, userId });
    res.json(stats);
  });

  // Documents
  app.get(api.documents.list.path, isAuthenticated, async (req, res) => {
    const userId = getUserId(req);
    const docs = await storage.getDocuments(userId);
    res.json(docs);
  });

  app.post(api.documents.create.path, isAuthenticated, async (req, res) => {
    const userId = getUserId(req);
    try {
      const input = api.documents.create.input.parse(req.body);
      const doc = await storage.createDocument({ ...input, userId });
      res.status(201).json(doc);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.put(api.documents.update.path, isAuthenticated, async (req, res) => {
    const id = Number(req.params.id);
    const input = api.documents.update.input.parse(req.body);
    const doc = await storage.updateDocument(id, input);
    if (!doc) return res.status(404).json({ message: "Document not found" });
    res.json(doc);
  });

  app.delete(api.documents.delete.path, isAuthenticated, async (req, res) => {
    const id = Number(req.params.id);
    await storage.deleteDocument(id);
    res.status(204).send();
  });

  // Roadmaps
  app.get(api.roadmaps.list.path, isAuthenticated, async (req, res) => {
    const userId = getUserId(req);
    const maps = await storage.getRoadmaps(userId);
    res.json(maps);
  });

  app.post(api.roadmaps.create.path, isAuthenticated, async (req, res) => {
    const userId = getUserId(req);
    const input = api.roadmaps.create.input.parse(req.body);
    const map = await storage.createRoadmap({ ...input, userId });
    res.status(201).json(map);
  });

  // Flashcards
  app.get(api.flashcards.listDecks.path, isAuthenticated, async (req, res) => {
    const userId = getUserId(req);
    const decks = await storage.getFlashcardDecks(userId);
    res.json(decks);
  });

  app.post(api.flashcards.createDeck.path, isAuthenticated, async (req, res) => {
    const userId = getUserId(req);
    const input = api.flashcards.createDeck.input.parse(req.body);
    const deck = await storage.createFlashcardDeck({ ...input, userId });
    res.status(201).json(deck);
  });

  app.get(api.flashcards.listCards.path, isAuthenticated, async (req, res) => {
    const deckId = Number(req.params.deckId);
    const cards = await storage.getFlashcards(deckId);
    res.json(cards);
  });

  app.post(api.flashcards.createCard.path, isAuthenticated, async (req, res) => {
    const deckId = Number(req.params.deckId);
    const input = api.flashcards.createCard.input.parse(req.body);
    const card = await storage.createFlashcard({ ...input, deckId });
    res.status(201).json(card);
  });

  // Interviews
  app.get(api.interviews.list.path, isAuthenticated, async (req, res) => {
    const userId = getUserId(req);
    const items = await storage.getInterviews(userId);
    res.json(items);
  });

  app.post(api.interviews.create.path, isAuthenticated, async (req, res) => {
    const userId = getUserId(req);
    const input = api.interviews.create.input.parse(req.body);
    const item = await storage.createInterview({ ...input, userId });
    res.status(201).json(item);
  });

  app.put(api.interviews.update.path, isAuthenticated, async (req, res) => {
    const id = Number(req.params.id);
    const input = api.interviews.update.input.parse(req.body);
    const item = await storage.updateInterviewMessages(id, input.messages);
    if (!item) return res.status(404).json({ message: "Interview not found" });
    res.json(item);
  });

  // Code Snippets
  app.get(api.codeSnippets.list.path, isAuthenticated, async (req, res) => {
    const userId = getUserId(req);
    const items = await storage.getCodeSnippets(userId);
    res.json(items);
  });

  app.post(api.codeSnippets.create.path, isAuthenticated, async (req, res) => {
    const userId = getUserId(req);
    const input = api.codeSnippets.create.input.parse(req.body);
    const item = await storage.createCodeSnippet({ ...input, userId });
    res.status(201).json(item);
  });

  app.put(api.codeSnippets.update.path, isAuthenticated, async (req, res) => {
    const id = Number(req.params.id);
    const input = api.codeSnippets.update.input.parse(req.body);
    const item = await storage.updateCodeSnippet(id, input);
    if (!item) return res.status(404).json({ message: "Snippet not found" });
    res.json(item);
  });

  app.delete(api.codeSnippets.delete.path, isAuthenticated, async (req, res) => {
    const id = Number(req.params.id);
    await storage.deleteCodeSnippet(id);
    res.status(204).send();
  });

  // Applications
  app.get(api.applications.list.path, isAuthenticated, async (req, res) => {
    const userId = getUserId(req);
    const items = await storage.getApplications(userId);
    res.json(items);
  });

  app.post(api.applications.create.path, isAuthenticated, async (req, res) => {
    const userId = getUserId(req);
    const input = api.applications.create.input.parse(req.body);
    const item = await storage.createApplication({ ...input, userId });
    res.status(201).json(item);
  });

  app.put(api.applications.update.path, isAuthenticated, async (req, res) => {
    const id = Number(req.params.id);
    const input = api.applications.update.input.parse(req.body);
    const item = await storage.updateApplication(id, input);
    if (!item) return res.status(404).json({ message: "Application not found" });
    res.json(item);
  });

  app.delete(api.applications.delete.path, isAuthenticated, async (req, res) => {
    const id = Number(req.params.id);
    await storage.deleteApplication(id);
    res.status(204).send();
  });

  // Expenses
  app.get(api.expenses.list.path, isAuthenticated, async (req, res) => {
    const userId = getUserId(req);
    const items = await storage.getExpenses(userId);
    res.json(items);
  });

  app.post(api.expenses.create.path, isAuthenticated, async (req, res) => {
    const userId = getUserId(req);
    const input = api.expenses.create.input.parse(req.body);
    const item = await storage.createExpense({ ...input, userId });
    res.status(201).json(item);
  });

  app.delete(api.expenses.delete.path, isAuthenticated, async (req, res) => {
    const id = Number(req.params.id);
    await storage.deleteExpense(id);
    res.status(204).send();
  });

  return httpServer;
}
