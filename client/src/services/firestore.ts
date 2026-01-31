import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    serverTimestamp,
    Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

/**
 * Firestore Service Layer
 * Replaces server/storage.ts with client-side Firestore operations
 */

// Type definitions
export interface Stats {
    placementProbability: number;
    streak: number;
    lastActiveDate: string;
    upcomingDeadlines: { title: string; date: string }[];
}

export interface Activity {
    id: string;
    type: 'application' | 'interview' | 'email' | 'flashcard' | 'code_lab' | 'roadmap';
    description: string;
    timestamp: any;
}

export interface UserProfile {
    name: string;
    email: string;
    targetRole?: string;
    graduationYear?: string;
    notificationsEnabled?: boolean;
    theme?: 'dark' | 'light';
    accentColor?: string; // Optional - legacy field
}

export interface Document {
    id: string;
    title: string;
    type: 'resume' | 'cover_letter';
    content: string;
    createdAt: any;
    updatedAt: any;
}

export interface Roadmap {
    id: string;
    title: string;
    steps: { title: string; status: 'pending' | 'completed' }[];
}

export interface FlashcardDeck {
    id: string;
    title: string;
}

export interface Flashcard {
    id: string;
    front: string;
    back: string;
}

export interface Interview {
    id: string;
    title: string;
    type: 'behavioral' | 'technical';
    messages: { role: 'user' | 'assistant'; content: string }[];
    createdAt: any;
}

export interface CodeSnippet {
    id: string;
    title: string;
    code: string;
    language: string;
    notes?: string;
}

export interface Application {
    id: string;
    company: string;
    position: string;
    status: 'applied' | 'interview' | 'offer' | 'rejected';
    dateApplied: any;
    salary?: string;
    notes?: string;
}

export interface Expense {
    id: string;
    description: string;
    amount: number;
    date: any;
    category: string;
}

export interface Event {
    id: string;
    title: string;
    date: any;
    notes?: string;
    createdAt: any;
}

// ============= STATS =============

export async function getStats(userId: string): Promise<Stats> {
    const probability = await calculatePlacementProbability(userId);
    const streak = await getDailyStreak(userId);
    const events = await getEvents(userId);

    // Get upcoming deadlines from events
    const now = new Date();
    const upcomingDeadlines = events
        .filter(e => new Date(e.date) > now)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 3)
        .map(e => ({ title: e.title, date: e.date }));

    const statsRef = doc(db, `users/${userId}/stats/metrics`);
    const statsDoc = await getDoc(statsRef);
    const lastActiveDate = statsDoc.exists() ? statsDoc.data().lastActiveDate : '';

    return {
        placementProbability: probability,
        streak,
        lastActiveDate,
        upcomingDeadlines
    };
}

export async function updateStats(userId: string, data: Partial<Stats>): Promise<void> {
    const docRef = doc(db, `users/${userId}/stats/main`);
    await setDoc(docRef, data, { merge: true });
}

// ============= DOCUMENTS =============

export async function getDocuments(userId: string): Promise<Document[]> {
    const q = query(
        collection(db, `users/${userId}/documents`),
        orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Document));
}

export async function createDocument(userId: string, data: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>): Promise<Document> {
    const docRef = await addDoc(collection(db, `users/${userId}/documents`), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    });
    const newDoc = await getDoc(docRef);
    return { id: newDoc.id, ...newDoc.data() } as Document;
}

export async function updateDocument(userId: string, docId: string, data: Partial<Document>): Promise<void> {
    const docRef = doc(db, `users/${userId}/documents/${docId}`);
    await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
}

export async function deleteDocument(userId: string, docId: string): Promise<void> {
    await deleteDoc(doc(db, `users/${userId}/documents/${docId}`));
}

// ============= ROADMAPS =============

export async function getRoadmaps(userId: string): Promise<Roadmap[]> {
    const snapshot = await getDocs(collection(db, `users/${userId}/roadmaps`));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Roadmap));
}

export async function createRoadmap(userId: string, data: Omit<Roadmap, 'id'>): Promise<Roadmap> {
    const docRef = await addDoc(collection(db, `users/${userId}/roadmaps`), data);
    const newDoc = await getDoc(docRef);
    return { id: newDoc.id, ...newDoc.data() } as Roadmap;
}

// ============= FLASHCARDS =============

export async function getFlashcardDecks(userId: string): Promise<FlashcardDeck[]> {
    const snapshot = await getDocs(collection(db, `users/${userId}/flashcardDecks`));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FlashcardDeck));
}

export async function createFlashcardDeck(userId: string, data: Omit<FlashcardDeck, 'id'>): Promise<FlashcardDeck> {
    const docRef = await addDoc(collection(db, `users/${userId}/flashcardDecks`), data);
    const newDoc = await getDoc(docRef);
    return { id: newDoc.id, ...newDoc.data() } as FlashcardDeck;
}

export async function getFlashcards(userId: string, deckId: string): Promise<Flashcard[]> {
    const snapshot = await getDocs(collection(db, `users/${userId}/flashcardDecks/${deckId}/cards`));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Flashcard));
}

export async function createFlashcard(userId: string, deckId: string, data: Omit<Flashcard, 'id'>): Promise<Flashcard> {
    const docRef = await addDoc(collection(db, `users/${userId}/flashcardDecks/${deckId}/cards`), data);
    const newDoc = await getDoc(docRef);
    return { id: newDoc.id, ...newDoc.data() } as Flashcard;
}

export async function deleteFlashcardDeck(userId: string, deckId: string): Promise<void> {
    await deleteDoc(doc(db, `users/${userId}/flashcardDecks/${deckId}`));
}

export async function deleteFlashcard(userId: string, deckId: string, cardId: string): Promise<void> {
    await deleteDoc(doc(db, `users/${userId}/flashcardDecks/${deckId}/cards/${cardId}`));
}

// ============= INTERVIEWS =============

export async function getInterviews(userId: string): Promise<Interview[]> {
    const q = query(
        collection(db, `users/${userId}/interviews`),
        orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Interview));
}

export async function createInterview(userId: string, data: Omit<Interview, 'id' | 'createdAt'>): Promise<Interview> {
    const docRef = await addDoc(collection(db, `users/${userId}/interviews`), {
        ...data,
        createdAt: serverTimestamp()
    });
    const newDoc = await getDoc(docRef);
    return { id: newDoc.id, ...newDoc.data() } as Interview;
}

export async function updateInterview(userId: string, interviewId: string, messages: any[]): Promise<void> {
    const docRef = doc(db, `users/${userId}/interviews/${interviewId}`);
    await updateDoc(docRef, { messages });
}

// ============= CODE SNIPPETS =============

export async function getCodeSnippets(userId: string): Promise<CodeSnippet[]> {
    const snapshot = await getDocs(collection(db, `users/${userId}/codeSnippets`));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CodeSnippet));
}

export async function createCodeSnippet(userId: string, data: Omit<CodeSnippet, 'id'>): Promise<CodeSnippet> {
    const docRef = await addDoc(collection(db, `users/${userId}/codeSnippets`), data);
    const newDoc = await getDoc(docRef);
    return { id: newDoc.id, ...newDoc.data() } as CodeSnippet;
}

export async function updateCodeSnippet(userId: string, snippetId: string, data: Partial<CodeSnippet>): Promise<void> {
    const docRef = doc(db, `users/${userId}/codeSnippets/${snippetId}`);
    await updateDoc(docRef, data);
}

export async function deleteCodeSnippet(userId: string, snippetId: string): Promise<void> {
    await deleteDoc(doc(db, `users/${userId}/codeSnippets/${snippetId}`));
}

// ============= APPLICATIONS =============

export async function getApplications(userId: string): Promise<Application[]> {
    const q = query(
        collection(db, `users/${userId}/applications`),
        orderBy('dateApplied', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Application));
}

export async function createApplication(userId: string, data: Omit<Application, 'id' | 'dateApplied'>): Promise<Application> {
    const docRef = await addDoc(collection(db, `users/${userId}/applications`), {
        ...data,
        dateApplied: serverTimestamp()
    });
    const newDoc = await getDoc(docRef);
    return { id: newDoc.id, ...newDoc.data() } as Application;
}

export async function updateApplication(userId: string, appId: string, data: Partial<Application>): Promise<void> {
    const docRef = doc(db, `users/${userId}/applications/${appId}`);
    await updateDoc(docRef, data);
}

export async function deleteApplication(userId: string, appId: string): Promise<void> {
    await deleteDoc(doc(db, `users/${userId}/applications/${appId}`));
}

// ============= EXPENSES =============

export async function getExpenses(userId: string): Promise<Expense[]> {
    const q = query(
        collection(db, `users/${userId}/expenses`),
        orderBy('date', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Expense));
}

export async function createExpense(userId: string, data: Omit<Expense, 'id' | 'date'>): Promise<Expense> {
    const docRef = await addDoc(collection(db, `users/${userId}/expenses`), {
        ...data,
        date: serverTimestamp()
    });
    const newDoc = await getDoc(docRef);
    return { id: newDoc.id, ...newDoc.data() } as Expense;
}

export async function deleteExpense(userId: string, expenseId: string): Promise<void> {
    await deleteDoc(doc(db, `users/${userId}/expenses/${expenseId}`));
}

// ============= EVENTS (Calendar) =============

export async function getEvents(userId: string): Promise<Event[]> {
    const q = query(
        collection(db, `users/${userId}/events`),
        orderBy('date', 'asc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event));
}

export async function createEvent(userId: string, data: Omit<Event, 'id' | 'createdAt'>): Promise<Event> {
    const docRef = await addDoc(collection(db, `users/${userId}/events`), {
        ...data,
        createdAt: serverTimestamp()
    });
    const newDoc = await getDoc(docRef);
    return { id: newDoc.id, ...newDoc.data() } as Event;
}

export async function deleteEvent(userId: string, eventId: string): Promise<void> {
    await deleteDoc(doc(db, `users/${userId}/events/${eventId}`));
}

// ============= USER PROFILE (Resume) =============

export async function getUserResume(userId: string): Promise<string | null> {
    const docRef = doc(db, `users/${userId}/profile/resume`);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
        return null;
    }

    return docSnap.data()?.content || null;
}

export async function saveUserResume(userId: string, resumeContent: string): Promise<void> {
    const docRef = doc(db, `users/${userId}/profile/resume`);
    await setDoc(docRef, {
        content: resumeContent,
        updatedAt: serverTimestamp()
    });
}

// ============= ACTIVITY TRACKING =============

export async function logActivity(userId: string, type: Activity['type'], description: string): Promise<void> {
    await addDoc(collection(db, `users/${userId}/activities`), {
        type,
        description,
        timestamp: serverTimestamp()
    });

    // Update last active date for streak calculation
    await updateUserStats(userId);
}

export async function getRecentActivities(userId: string, limit: number = 5): Promise<Activity[]> {
    const q = query(
        collection(db, `users/${userId}/activities`),
        orderBy('timestamp', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.slice(0, limit).map(doc => ({
        id: doc.id,
        ...doc.data()
    } as Activity));
}

// ============= USER STATS & METRICS =============

async function updateUserStats(userId: string): Promise<void> {
    const today = new Date().toISOString().split('T')[0];
    const statsRef = doc(db, `users/${userId}/stats/metrics`);
    const statsDoc = await getDoc(statsRef);

    if (!statsDoc.exists()) {
        await setDoc(statsRef, {
            lastActiveDate: today,
            streak: 1
        });
    } else {
        const data = statsDoc.data();
        const lastActive = data.lastActiveDate;
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        if (lastActive === yesterdayStr) {
            // Continue streak
            await updateDoc(statsRef, {
                lastActiveDate: today,
                streak: (data.streak || 0) + 1
            });
        } else if (lastActive !== today) {
            // Reset streak
            await updateDoc(statsRef, {
                lastActiveDate: today,
                streak: 1
            });
        }
        // If lastActive === today, do nothing (already logged today)
    }
}

export async function calculatePlacementProbability(userId: string): Promise<number> {
    let score = 0;

    // Applications: +20%
    const applications = await getApplications(userId);
    score += Math.min(applications.length * 4, 20);

    // Interviews: +15%
    const interviews = await getInterviews(userId);
    score += Math.min(interviews.length * 5, 15);

    // Resume uploaded: +10%
    const resume = await getUserResume(userId);
    if (resume) score += 10;

    // Flashcard decks: +5%
    const decks = await getFlashcardDecks(userId);
    score += Math.min(decks.length * 2, 5);

    // Daily streak: +5% per week
    const statsRef = doc(db, `users/${userId}/stats/metrics`);
    const statsDoc = await getDoc(statsRef);
    if (statsDoc.exists()) {
        const streak = statsDoc.data().streak || 0;
        score += Math.min(Math.floor(streak / 7) * 5, 15);
    }

    // Activities: +5%
    const activities = await getRecentActivities(userId, 10);
    score += Math.min(activities.length, 5);

    return Math.min(score, 95); // Cap at 95%
}

export async function getDailyStreak(userId: string): Promise<number> {
    const statsRef = doc(db, `users/${userId}/stats/metrics`);
    const statsDoc = await getDoc(statsRef);

    if (!statsDoc.exists()) return 0;

    const data = statsDoc.data();
    const today = new Date().toISOString().split('T')[0];
    const lastActive = data.lastActiveDate;

    // Check if streak is still valid
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (lastActive === today || lastActive === yesterdayStr) {
        return data.streak || 0;
    }

    return 0; // Streak broken
}

// ============= USER PROFILE =============

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
    const docRef = doc(db, `users/${userId}/profile/settings`);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return null;

    return docSnap.data() as UserProfile;
}

export async function saveUserProfile(userId: string, profile: UserProfile): Promise<void> {
    const docRef = doc(db, `users/${userId}/profile/settings`);
    await setDoc(docRef, profile);
}

// ============= DATA EXPORT/IMPORT =============

export async function exportAllUserData(userId: string): Promise<any> {
    const data: any = {};

    // Export all collections
    data.applications = await getApplications(userId);
    data.events = await getEvents(userId);
    data.flashcardDecks = await getFlashcardDecks(userId);
    data.roadmaps = await getRoadmaps(userId);
    data.interviews = await getInterviews(userId);
    data.resume = await getUserResume(userId);
    data.profile = await getUserProfile(userId);
    data.activities = await getRecentActivities(userId, 100);

    return data;
}

export async function importUserData(userId: string, data: any): Promise<void> {
    // Import applications (merge, don't overwrite)
    if (data.applications) {
        for (const app of data.applications) {
            const { id, ...appData } = app;
            await addDoc(collection(db, `users/${userId}/applications`), appData);
        }
    }

    // Import events
    if (data.events) {
        for (const event of data.events) {
            const { id, ...eventData } = event;
            await addDoc(collection(db, `users/${userId}/events`), eventData);
        }
    }

    // Import flashcard decks
    if (data.flashcardDecks) {
        for (const deck of data.flashcardDecks) {
            const { id, ...deckData } = deck;
            await addDoc(collection(db, `users/${userId}/flashcardDecks`), deckData);
        }
    }

    // Import roadmaps
    if (data.roadmaps) {
        for (const roadmap of data.roadmaps) {
            const { id, ...roadmapData } = roadmap;
            await addDoc(collection(db, `users/${userId}/roadmaps`), roadmapData);
        }
    }

    // Import resume (only if not exists)
    if (data.resume && !(await getUserResume(userId))) {
        await saveUserResume(userId, data.resume);
    }

    // Import profile (merge)
    if (data.profile) {
        const existingProfile = await getUserProfile(userId);
        await saveUserProfile(userId, { ...existingProfile, ...data.profile });
    }
}
