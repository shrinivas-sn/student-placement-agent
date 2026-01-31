import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./use-auth";
import * as firestore from "@/services/firestore";

// ============= STATS =============

export function useStats() {
  const { userId } = useAuth();

  return useQuery({
    queryKey: ["stats", userId],
    queryFn: () => firestore.getStats(userId!),
    enabled: !!userId,
  });
}

export function useUpdateStats() {
  const queryClient = useQueryClient();
  const { userId } = useAuth();

  return useMutation({
    mutationFn: (data: Partial<firestore.Stats>) => firestore.updateStats(userId!, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["stats", userId] }),
  });
}

// ============= DOCUMENTS =============

export function useDocuments() {
  const { userId } = useAuth();

  return useQuery({
    queryKey: ["documents", userId],
    queryFn: () => firestore.getDocuments(userId!),
    enabled: !!userId,
  });
}

export function useCreateDocument() {
  const queryClient = useQueryClient();
  const { userId } = useAuth();

  return useMutation({
    mutationFn: (data: Omit<firestore.Document, 'id' | 'createdAt' | 'updatedAt'>) =>
      firestore.createDocument(userId!, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["documents", userId] }),
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();
  const { userId } = useAuth();

  return useMutation({
    mutationFn: (docId: string) => firestore.deleteDocument(userId!, docId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["documents", userId] }),
  });
}

// ============= ROADMAPS =============

export function useRoadmaps() {
  const { userId } = useAuth();

  return useQuery({
    queryKey: ["roadmaps", userId],
    queryFn: () => firestore.getRoadmaps(userId!),
    enabled: !!userId,
  });
}

export function useCreateRoadmap() {
  const queryClient = useQueryClient();
  const { userId } = useAuth();

  return useMutation({
    mutationFn: (data: Omit<firestore.Roadmap, 'id'>) => firestore.createRoadmap(userId!, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["roadmaps", userId] }),
  });
}

// ============= FLASHCARDS =============

export function useFlashcardDecks() {
  const { userId } = useAuth();

  return useQuery({
    queryKey: ["flashcardDecks", userId],
    queryFn: () => firestore.getFlashcardDecks(userId!),
    enabled: !!userId,
  });
}

export function useCreateFlashcardDeck() {
  const queryClient = useQueryClient();
  const { userId } = useAuth();

  return useMutation({
    mutationFn: (data: Omit<firestore.FlashcardDeck, 'id'>) =>
      firestore.createFlashcardDeck(userId!, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["flashcardDecks", userId] }),
  });
}

export function useFlashcards(deckId: string) {
  const { userId } = useAuth();

  return useQuery({
    queryKey: ["flashcards", userId, deckId],
    queryFn: () => firestore.getFlashcards(userId!, deckId),
    enabled: !!userId && !!deckId,
  });
}

export function useCreateFlashcard() {
  const queryClient = useQueryClient();
  const { userId } = useAuth();

  return useMutation({
    mutationFn: ({ deckId, ...data }: { deckId: string } & Omit<firestore.Flashcard, 'id'>) =>
      firestore.createFlashcard(userId!, deckId, data),
    onSuccess: (_, variables) =>
      queryClient.invalidateQueries({ queryKey: ["flashcards", userId, variables.deckId] }),
  });
}

// ============= INTERVIEWS =============

export function useInterviews() {
  const { userId } = useAuth();

  return useQuery({
    queryKey: ["interviews", userId],
    queryFn: () => firestore.getInterviews(userId!),
    enabled: !!userId,
  });
}

export function useCreateInterview() {
  const queryClient = useQueryClient();
  const { userId } = useAuth();

  return useMutation({
    mutationFn: (data: Omit<firestore.Interview, 'id' | 'createdAt'>) =>
      firestore.createInterview(userId!, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["interviews", userId] }),
  });
}

export function useUpdateInterview() {
  const queryClient = useQueryClient();
  const { userId } = useAuth();

  return useMutation({
    mutationFn: ({ id, messages }: { id: string; messages: any[] }) =>
      firestore.updateInterview(userId!, id, messages),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["interviews", userId] }),
  });
}

// ============= CODE SNIPPETS =============

export function useCodeSnippets() {
  const { userId } = useAuth();

  return useQuery({
    queryKey: ["codeSnippets", userId],
    queryFn: () => firestore.getCodeSnippets(userId!),
    enabled: !!userId,
  });
}

export function useCreateCodeSnippet() {
  const queryClient = useQueryClient();
  const { userId } = useAuth();

  return useMutation({
    mutationFn: (data: Omit<firestore.CodeSnippet, 'id'>) =>
      firestore.createCodeSnippet(userId!, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["codeSnippets", userId] }),
  });
}

export function useDeleteCodeSnippet() {
  const queryClient = useQueryClient();
  const { userId } = useAuth();

  return useMutation({
    mutationFn: (snippetId: string) => firestore.deleteCodeSnippet(userId!, snippetId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["codeSnippets", userId] }),
  });
}

// ============= APPLICATIONS =============

export function useApplications() {
  const { userId } = useAuth();

  return useQuery({
    queryKey: ["applications", userId],
    queryFn: () => firestore.getApplications(userId!),
    enabled: !!userId,
  });
}

export function useCreateApplication() {
  const queryClient = useQueryClient();
  const { userId } = useAuth();

  return useMutation({
    mutationFn: (data: Omit<firestore.Application, 'id' | 'dateApplied'>) =>
      firestore.createApplication(userId!, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["applications", userId] }),
  });
}

export function useUpdateApplication() {
  const queryClient = useQueryClient();
  const { userId } = useAuth();

  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Partial<firestore.Application>) =>
      firestore.updateApplication(userId!, id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["applications", userId] }),
  });
}

export function useDeleteApplication() {
  const queryClient = useQueryClient();
  const { userId } = useAuth();

  return useMutation({
    mutationFn: (appId: string) => firestore.deleteApplication(userId!, appId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["applications", userId] }),
  });
}

// ============= EXPENSES =============

export function useExpenses() {
  const { userId } = useAuth();

  return useQuery({
    queryKey: ["expenses", userId],
    queryFn: () => firestore.getExpenses(userId!),
    enabled: !!userId,
  });
}

export function useCreateExpense() {
  const queryClient = useQueryClient();
  const { userId } = useAuth();

  return useMutation({
    mutationFn: (data: Omit<firestore.Expense, 'id' | 'date'>) =>
      firestore.createExpense(userId!, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["expenses", userId] }),
  });
}

export function useDeleteExpense() {
  const queryClient = useQueryClient();
  const { userId } = useAuth();

  return useMutation({
    mutationFn: (expenseId: string) => firestore.deleteExpense(userId!, expenseId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["expenses", userId] }),
  });
}

// ============= EVENTS =============

export function useEvents() {
  const { userId } = useAuth();

  return useQuery({
    queryKey: ["events", userId],
    queryFn: () => firestore.getEvents(userId!),
    enabled: !!userId,
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();
  const { userId } = useAuth();

  return useMutation({
    mutationFn: (data: Omit<firestore.Event, 'id' | 'createdAt'>) =>
      firestore.createEvent(userId!, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["events", userId] }),
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();
  const { userId } = useAuth();

  return useMutation({
    mutationFn: (eventId: string) => firestore.deleteEvent(userId!, eventId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["events", userId] }),
  });
}

// ============= USER RESUME =============

export function useUserResume() {
  const { userId } = useAuth();

  return useQuery({
    queryKey: ["resume", userId],
    queryFn: () => firestore.getUserResume(userId!),
    enabled: !!userId,
  });
}

export function useSaveResume() {
  const queryClient = useQueryClient();
  const { userId } = useAuth();

  return useMutation({
    mutationFn: (resumeContent: string) => firestore.saveUserResume(userId!, resumeContent),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["resume", userId] }),
  });
}

// ============= FLASHCARD DELETE HOOKS =============

export function useDeleteFlashcardDeck() {
  const queryClient = useQueryClient();
  const { userId } = useAuth();

  return useMutation({
    mutationFn: (deckId: string) => firestore.deleteFlashcardDeck(userId!, deckId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["flashcardDecks", userId] }),
  });
}

export function useDeleteFlashcard() {
  const queryClient = useQueryClient();
  const { userId } = useAuth();

  return useMutation({
    mutationFn: ({ deckId, cardId }: { deckId: string; cardId: string }) =>
      firestore.deleteFlashcard(userId!, deckId, cardId),
    onSuccess: (_, variables) =>
      queryClient.invalidateQueries({ queryKey: ["flashcards", userId, variables.deckId] }),
  });
}

// ============= ACTIVITIES =============

export function useRecentActivities(limit: number = 5) {
  const { userId } = useAuth();

  return useQuery({
    queryKey: ["activities", userId, limit],
    queryFn: () => firestore.getRecentActivities(userId!, limit),
    enabled: !!userId,
  });
}

// ============= USER PROFILE =============

export function useUserProfile() {
  const { userId } = useAuth();

  return useQuery({
    queryKey: ["profile", userId],
    queryFn: () => firestore.getUserProfile(userId!),
    enabled: !!userId,
  });
}

export function useSaveUserProfile() {
  const queryClient = useQueryClient();
  const { userId } = useAuth();

  return useMutation({
    mutationFn: (profile: firestore.UserProfile) => firestore.saveUserProfile(userId!, profile),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["profile", userId] }),
  });
}

// ============= DATA EXPORT/IMPORT =============

export function useExportData() {
  const { userId } = useAuth();

  return useMutation({
    mutationFn: () => firestore.exportAllUserData(userId!),
  });
}

export function useImportData() {
  const queryClient = useQueryClient();
  const { userId } = useAuth();

  return useMutation({
    mutationFn: (data: any) => firestore.importUserData(userId!, data),
    onSuccess: () => {
      // Invalidate all queries to refresh data
      queryClient.invalidateQueries();
    },
  });
}
