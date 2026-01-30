import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { 
  type InsertStats, type InsertDocument, type InsertRoadmap, 
  type InsertFlashcardDeck, type InsertFlashcard, type InsertInterview, 
  type InsertCodeSnippet, type InsertApplication, type InsertExpense,
  type Stats
} from "@shared/schema";

// --- STATS ---
export function useStats() {
  return useQuery({
    queryKey: [api.stats.get.path],
    queryFn: async () => {
      const res = await fetch(api.stats.get.path, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch stats");
      return api.stats.get.responses[200].parse(await res.json());
    },
  });
}

export function useUpdateStats() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertStats) => {
      const res = await fetch(api.stats.update.path, {
        method: api.stats.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update stats");
      return api.stats.update.responses[200].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.stats.get.path] }),
  });
}

// --- DOCUMENTS ---
export function useDocuments() {
  return useQuery({
    queryKey: [api.documents.list.path],
    queryFn: async () => {
      const res = await fetch(api.documents.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch documents");
      return api.documents.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertDocument) => {
      const res = await fetch(api.documents.create.path, {
        method: api.documents.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create document");
      return api.documents.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.documents.list.path] }),
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.documents.delete.path, { id });
      const res = await fetch(url, { method: api.documents.delete.method, credentials: "include" });
      if (!res.ok) throw new Error("Failed to delete document");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.documents.list.path] }),
  });
}

// --- ROADMAPS ---
export function useRoadmaps() {
  return useQuery({
    queryKey: [api.roadmaps.list.path],
    queryFn: async () => {
      const res = await fetch(api.roadmaps.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch roadmaps");
      return api.roadmaps.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateRoadmap() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertRoadmap) => {
      const res = await fetch(api.roadmaps.create.path, {
        method: api.roadmaps.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create roadmap");
      return api.roadmaps.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.roadmaps.list.path] }),
  });
}

// --- FLASHCARDS ---
export function useFlashcardDecks() {
  return useQuery({
    queryKey: [api.flashcards.listDecks.path],
    queryFn: async () => {
      const res = await fetch(api.flashcards.listDecks.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch decks");
      return api.flashcards.listDecks.responses[200].parse(await res.json());
    },
  });
}

export function useCreateFlashcardDeck() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertFlashcardDeck) => {
      const res = await fetch(api.flashcards.createDeck.path, {
        method: api.flashcards.createDeck.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create deck");
      return api.flashcards.createDeck.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.flashcards.listDecks.path] }),
  });
}

export function useFlashcards(deckId: number) {
  return useQuery({
    queryKey: [api.flashcards.listCards.path, deckId],
    queryFn: async () => {
      const url = buildUrl(api.flashcards.listCards.path, { deckId });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch cards");
      return api.flashcards.listCards.responses[200].parse(await res.json());
    },
    enabled: !!deckId,
  });
}

export function useCreateFlashcard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ deckId, ...data }: InsertFlashcard) => {
      const url = buildUrl(api.flashcards.createCard.path, { deckId });
      const res = await fetch(url, {
        method: api.flashcards.createCard.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create card");
      return api.flashcards.createCard.responses[201].parse(await res.json());
    },
    onSuccess: (_, variables) => queryClient.invalidateQueries({ queryKey: [api.flashcards.listCards.path, variables.deckId] }),
  });
}

// --- INTERVIEWS ---
export function useInterviews() {
  return useQuery({
    queryKey: [api.interviews.list.path],
    queryFn: async () => {
      const res = await fetch(api.interviews.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch interviews");
      return api.interviews.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateInterview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertInterview) => {
      const res = await fetch(api.interviews.create.path, {
        method: api.interviews.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create interview");
      return api.interviews.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.interviews.list.path] }),
  });
}

export function useUpdateInterview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, messages }: { id: number, messages: any[] }) => {
      const url = buildUrl(api.interviews.update.path, { id });
      const res = await fetch(url, {
        method: api.interviews.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update interview");
      return api.interviews.update.responses[200].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.interviews.list.path] }),
  });
}

// --- CODE SNIPPETS ---
export function useCodeSnippets() {
  return useQuery({
    queryKey: [api.codeSnippets.list.path],
    queryFn: async () => {
      const res = await fetch(api.codeSnippets.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch snippets");
      return api.codeSnippets.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateCodeSnippet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertCodeSnippet) => {
      const res = await fetch(api.codeSnippets.create.path, {
        method: api.codeSnippets.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create snippet");
      return api.codeSnippets.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.codeSnippets.list.path] }),
  });
}

export function useDeleteCodeSnippet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.codeSnippets.delete.path, { id });
      const res = await fetch(url, { method: api.codeSnippets.delete.method, credentials: "include" });
      if (!res.ok) throw new Error("Failed to delete snippet");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.codeSnippets.list.path] }),
  });
}

// --- APPLICATIONS ---
export function useApplications() {
  return useQuery({
    queryKey: [api.applications.list.path],
    queryFn: async () => {
      const res = await fetch(api.applications.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch applications");
      return api.applications.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertApplication) => {
      const res = await fetch(api.applications.create.path, {
        method: api.applications.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create application");
      return api.applications.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.applications.list.path] }),
  });
}

export function useUpdateApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: number } & Partial<InsertApplication>) => {
      const url = buildUrl(api.applications.update.path, { id });
      const res = await fetch(url, {
        method: api.applications.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update application");
      return api.applications.update.responses[200].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.applications.list.path] }),
  });
}

export function useDeleteApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.applications.delete.path, { id });
      const res = await fetch(url, { method: api.applications.delete.method, credentials: "include" });
      if (!res.ok) throw new Error("Failed to delete application");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.applications.list.path] }),
  });
}

// --- EXPENSES ---
export function useExpenses() {
  return useQuery({
    queryKey: [api.expenses.list.path],
    queryFn: async () => {
      const res = await fetch(api.expenses.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch expenses");
      return api.expenses.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateExpense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertExpense) => {
      const res = await fetch(api.expenses.create.path, {
        method: api.expenses.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create expense");
      return api.expenses.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.expenses.list.path] }),
  });
}

export function useDeleteExpense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.expenses.delete.path, { id });
      const res = await fetch(url, { method: api.expenses.delete.method, credentials: "include" });
      if (!res.ok) throw new Error("Failed to delete expense");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.expenses.list.path] }),
  });
}
