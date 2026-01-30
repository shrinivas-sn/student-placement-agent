import { z } from 'zod';
import { 
  insertStatsSchema, 
  insertDocumentSchema, 
  insertRoadmapSchema, 
  insertFlashcardDeckSchema,
  insertFlashcardSchema,
  insertInterviewSchema,
  insertCodeSnippetSchema,
  insertApplicationSchema,
  insertExpenseSchema,
  stats,
  documents,
  roadmaps,
  flashcardDecks,
  flashcards,
  interviews,
  codeSnippets,
  applications,
  expenses
} from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
};

export const api = {
  stats: {
    get: {
      method: 'GET' as const,
      path: '/api/stats',
      responses: {
        200: z.custom<typeof stats.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    update: {
      method: 'POST' as const,
      path: '/api/stats',
      input: insertStatsSchema,
      responses: {
        200: z.custom<typeof stats.$inferSelect>(),
      },
    },
  },
  documents: {
    list: {
      method: 'GET' as const,
      path: '/api/documents',
      responses: {
        200: z.array(z.custom<typeof documents.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/documents',
      input: insertDocumentSchema,
      responses: {
        201: z.custom<typeof documents.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/documents/:id',
      input: insertDocumentSchema.partial(),
      responses: {
        200: z.custom<typeof documents.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/documents/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
  roadmaps: {
    list: {
      method: 'GET' as const,
      path: '/api/roadmaps',
      responses: {
        200: z.array(z.custom<typeof roadmaps.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/roadmaps',
      input: insertRoadmapSchema,
      responses: {
        201: z.custom<typeof roadmaps.$inferSelect>(),
      },
    },
  },
  flashcards: {
    listDecks: {
      method: 'GET' as const,
      path: '/api/flashcard-decks',
      responses: {
        200: z.array(z.custom<typeof flashcardDecks.$inferSelect>()),
      },
    },
    createDeck: {
      method: 'POST' as const,
      path: '/api/flashcard-decks',
      input: insertFlashcardDeckSchema,
      responses: {
        201: z.custom<typeof flashcardDecks.$inferSelect>(),
      },
    },
    listCards: {
      method: 'GET' as const,
      path: '/api/flashcard-decks/:deckId/cards',
      responses: {
        200: z.array(z.custom<typeof flashcards.$inferSelect>()),
      },
    },
    createCard: {
      method: 'POST' as const,
      path: '/api/flashcard-decks/:deckId/cards',
      input: insertFlashcardSchema.omit({ deckId: true }),
      responses: {
        201: z.custom<typeof flashcards.$inferSelect>(),
      },
    },
  },
  interviews: {
    list: {
      method: 'GET' as const,
      path: '/api/interviews',
      responses: {
        200: z.array(z.custom<typeof interviews.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/interviews',
      input: insertInterviewSchema,
      responses: {
        201: z.custom<typeof interviews.$inferSelect>(),
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/interviews/:id',
      input: z.object({ messages: z.array(z.any()) }), // Simplified update for messages
      responses: {
        200: z.custom<typeof interviews.$inferSelect>(),
      },
    },
  },
  codeSnippets: {
    list: {
      method: 'GET' as const,
      path: '/api/code-snippets',
      responses: {
        200: z.array(z.custom<typeof codeSnippets.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/code-snippets',
      input: insertCodeSnippetSchema,
      responses: {
        201: z.custom<typeof codeSnippets.$inferSelect>(),
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/code-snippets/:id',
      input: insertCodeSnippetSchema.partial(),
      responses: {
        200: z.custom<typeof codeSnippets.$inferSelect>(),
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/code-snippets/:id',
      responses: {
        204: z.void(),
      },
    },
  },
  applications: {
    list: {
      method: 'GET' as const,
      path: '/api/applications',
      responses: {
        200: z.array(z.custom<typeof applications.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/applications',
      input: insertApplicationSchema,
      responses: {
        201: z.custom<typeof applications.$inferSelect>(),
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/applications/:id',
      input: insertApplicationSchema.partial(),
      responses: {
        200: z.custom<typeof applications.$inferSelect>(),
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/applications/:id',
      responses: {
        204: z.void(),
      },
    },
  },
  expenses: {
    list: {
      method: 'GET' as const,
      path: '/api/expenses',
      responses: {
        200: z.array(z.custom<typeof expenses.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/expenses',
      input: insertExpenseSchema,
      responses: {
        201: z.custom<typeof expenses.$inferSelect>(),
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/expenses/:id',
      responses: {
        204: z.void(),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
