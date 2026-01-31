import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Plus, Trash2, Eye, RotateCcw, BookOpen, Brain } from "lucide-react";
import { useFlashcardDecks, useCreateFlashcardDeck, useDeleteFlashcardDeck, useFlashcards, useCreateFlashcard, useDeleteFlashcard } from "@/hooks/use-resources";
import { useToast } from "@/hooks/use-toast";

export function FlashcardManager() {
    const { data: decks = [] } = useFlashcardDecks();
    const createDeck = useCreateFlashcardDeck();
    const deleteDeck = useDeleteFlashcardDeck();
    const { toast } = useToast();

    const [deckDialogOpen, setDeckDialogOpen] = useState(false);
    const [newDeckName, setNewDeckName] = useState("");
    const [selectedDeck, setSelectedDeck] = useState<string | null>(null);
    const [studyMode, setStudyMode] = useState(false);

    const handleCreateDeck = async () => {
        if (!newDeckName.trim()) {
            toast({ title: "Error", description: "Deck name is required", variant: "destructive" });
            return;
        }

        try {
            await createDeck.mutateAsync({ title: newDeckName });
            toast({ title: "Success", description: "Deck created!" });
            setNewDeckName("");
            setDeckDialogOpen(false);
        } catch (error) {
            toast({ title: "Error", description: "Failed to create deck", variant: "destructive" });
        }
    };

    const handleDeleteDeck = async (deckId: string) => {
        if (confirm("Delete this deck and all its cards?")) {
            try {
                await deleteDeck.mutateAsync(deckId);
                toast({ title: "Success", description: "Deck deleted" });
            } catch (error) {
                toast({ title: "Error", description: "Failed to delete deck", variant: "destructive" });
            }
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Brain className="w-6 h-6 text-green-400" />
                        Flashcards
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Create decks and study with spaced repetition
                    </p>
                </div>
                <Button
                    onClick={() => setDeckDialogOpen(true)}
                    className="bg-green-600 hover:bg-green-700"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Deck
                </Button>
            </div>

            {/* Decks Grid */}
            {decks.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                    <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-semibold mb-2">No flashcard decks yet</p>
                    <p className="text-sm mb-4">Create your first deck to start learning!</p>
                    <Button onClick={() => setDeckDialogOpen(true)} variant="outline">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Your First Deck
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {decks.map((deck) => (
                        <DeckCard
                            key={deck.id}
                            deck={deck}
                            onDelete={() => handleDeleteDeck(deck.id)}
                            onOpen={() => setSelectedDeck(deck.id)}
                            onStudy={() => {
                                setSelectedDeck(deck.id);
                                setStudyMode(true);
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Create Deck Dialog */}
            <Dialog open={deckDialogOpen} onOpenChange={setDeckDialogOpen}>
                <DialogContent className="bg-black/95 border-white/10">
                    <DialogHeader>
                        <DialogTitle>Create New Deck</DialogTitle>
                        <DialogDescription>
                            Create a deck to organize your flashcards by topic
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium mb-2 block">Deck Name *</label>
                            <Input
                                placeholder="e.g., JavaScript Concepts, DSA Patterns, React Hooks"
                                value={newDeckName}
                                onChange={(e) => setNewDeckName(e.target.value)}
                                className="bg-white/5 border-white/10"
                                onKeyDown={(e) => e.key === "Enter" && handleCreateDeck()}
                            />
                        </div>
                        <Button
                            onClick={handleCreateDeck}
                            className="w-full bg-green-600 hover:bg-green-700"
                            disabled={createDeck.isPending}
                        >
                            {createDeck.isPending ? "Creating..." : "Create Deck"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Deck Details Dialog */}
            {selectedDeck && !studyMode && (
                <DeckDetailsDialog
                    deckId={selectedDeck}
                    onClose={() => setSelectedDeck(null)}
                    onStudy={() => setStudyMode(true)}
                />
            )}

            {/* Study Mode Dialog */}
            {selectedDeck && studyMode && (
                <StudyModeDialog
                    deckId={selectedDeck}
                    onClose={() => {
                        setStudyMode(false);
                        setSelectedDeck(null);
                    }}
                />
            )}
        </div>
    );
}

// Deck Card Component
function DeckCard({ deck, onDelete, onOpen, onStudy }: any) {
    const { data: cards = [] } = useFlashcards(deck.id);

    return (
        <Card className="glass-card hover:border-green-500/50 transition-all group">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <CardTitle className="text-lg">{deck.title}</CardTitle>
                        <p className="text-sm text-gray-400 mt-1">{cards.length} cards</p>
                    </div>
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={onDelete}
                        className="h-8 w-8 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <Trash2 className="w-3 h-3" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="flex gap-2">
                    <Button
                        onClick={onOpen}
                        variant="outline"
                        className="flex-1 border-green-500/30 hover:bg-green-500/10"
                        size="sm"
                    >
                        <Eye className="w-3 h-3 mr-1" />
                        View Cards
                    </Button>
                    <Button
                        onClick={onStudy}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        size="sm"
                        disabled={cards.length === 0}
                    >
                        <BookOpen className="w-3 h-3 mr-1" />
                        Study
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

// Deck Details Dialog (View/Add Cards)
function DeckDetailsDialog({ deckId, onClose, onStudy }: any) {
    const { data: cards = [] } = useFlashcards(deckId);
    const { data: decks = [] } = useFlashcardDecks();
    const createCard = useCreateFlashcard();
    const deleteCard = useDeleteFlashcard();
    const { toast } = useToast();

    const deck = decks.find((d) => d.id === deckId);
    const [cardDialogOpen, setCardDialogOpen] = useState(false);
    const [front, setFront] = useState("");
    const [back, setBack] = useState("");

    const handleAddCard = async () => {
        if (!front.trim() || !back.trim()) {
            toast({ title: "Error", description: "Both question and answer are required", variant: "destructive" });
            return;
        }

        try {
            await createCard.mutateAsync({ deckId, front, back });
            toast({ title: "Success", description: "Card added!" });
            setFront("");
            setBack("");
            setCardDialogOpen(false);
        } catch (error) {
            toast({ title: "Error", description: "Failed to add card", variant: "destructive" });
        }
    };

    const handleDeleteCard = async (cardId: string) => {
        if (confirm("Delete this card?")) {
            try {
                await deleteCard.mutateAsync({ deckId, cardId });
                toast({ title: "Success", description: "Card deleted" });
            } catch (error) {
                toast({ title: "Error", description: "Failed to delete card", variant: "destructive" });
            }
        }
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-black/95 border-white/10">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-green-400" />
                        {deck?.title}
                    </DialogTitle>
                    <DialogDescription>
                        {cards.length} cards in this deck
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="flex gap-2">
                        <Button
                            onClick={() => setCardDialogOpen(true)}
                            className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Card
                        </Button>
                        <Button
                            onClick={onStudy}
                            variant="outline"
                            className="flex-1 border-green-500/30"
                            disabled={cards.length === 0}
                        >
                            <BookOpen className="w-4 h-4 mr-2" />
                            Study Mode
                        </Button>
                    </div>

                    {/* Cards List */}
                    {cards.length === 0 ? (
                        <div className="text-center py-8 text-gray-400">
                            <p>No cards yet. Add your first card!</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {cards.map((card) => (
                                <div
                                    key={card.id}
                                    className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1 space-y-2">
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Question:</p>
                                                <p className="text-sm font-medium">{card.front}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Answer:</p>
                                                <p className="text-sm text-gray-300">{card.back}</p>
                                            </div>
                                        </div>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={() => handleDeleteCard(card.id)}
                                            className="h-8 w-8 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Add Card Dialog */}
                <Dialog open={cardDialogOpen} onOpenChange={setCardDialogOpen}>
                    <DialogContent className="bg-black/95 border-white/10">
                        <DialogHeader>
                            <DialogTitle>Add New Card</DialogTitle>
                            <DialogDescription>
                                Create a flashcard with a question and answer
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium mb-2 block">Question (Front) *</label>
                                <Textarea
                                    placeholder="e.g., What is a closure in JavaScript?"
                                    value={front}
                                    onChange={(e) => setFront(e.target.value)}
                                    className="bg-white/5 border-white/10 min-h-[80px]"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-2 block">Answer (Back) *</label>
                                <Textarea
                                    placeholder="e.g., A closure is a function that remembers its lexical scope..."
                                    value={back}
                                    onChange={(e) => setBack(e.target.value)}
                                    className="bg-white/5 border-white/10 min-h-[100px]"
                                />
                            </div>
                            <Button
                                onClick={handleAddCard}
                                className="w-full bg-green-600 hover:bg-green-700"
                                disabled={createCard.isPending}
                            >
                                {createCard.isPending ? "Adding..." : "Add Card"}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </DialogContent>
        </Dialog>
    );
}

// Study Mode Dialog
function StudyModeDialog({ deckId, onClose }: any) {
    const { data: cards = [] } = useFlashcards(deckId);
    const { data: decks = [] } = useFlashcardDecks();
    const deck = decks.find((d) => d.id === deckId);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    const currentCard = cards[currentIndex];

    const handleNext = () => {
        setIsFlipped(false);
        setCurrentIndex((prev) => (prev + 1) % cards.length);
    };

    const handlePrevious = () => {
        setIsFlipped(false);
        setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
    };

    if (cards.length === 0) {
        return (
            <Dialog open={true} onOpenChange={onClose}>
                <DialogContent className="bg-black/95 border-white/10">
                    <DialogHeader>
                        <DialogTitle>No Cards to Study</DialogTitle>
                    </DialogHeader>
                    <p className="text-gray-400">Add some cards to this deck first!</p>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl bg-black/95 border-white/10">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-green-400" />
                        Studying: {deck?.title}
                    </DialogTitle>
                    <DialogDescription>
                        Card {currentIndex + 1} of {cards.length}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Flashcard */}
                    <div
                        onClick={() => setIsFlipped(!isFlipped)}
                        className="relative min-h-[300px] cursor-pointer group"
                    >
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 p-8 flex items-center justify-center text-center transition-all hover:border-green-500/50">
                            <div>
                                <p className="text-xs text-gray-500 mb-4">
                                    {isFlipped ? "Answer" : "Question"} (Click to flip)
                                </p>
                                <p className="text-lg font-medium">
                                    {isFlipped ? currentCard.back : currentCard.front}
                                </p>
                            </div>
                            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <RotateCcw className="w-5 h-5 text-green-400" />
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center justify-between">
                        <Button
                            onClick={handlePrevious}
                            variant="outline"
                            className="border-green-500/30"
                        >
                            ← Previous
                        </Button>
                        <div className="text-sm text-gray-400">
                            {currentIndex + 1} / {cards.length}
                        </div>
                        <Button
                            onClick={handleNext}
                            variant="outline"
                            className="border-green-500/30"
                        >
                            Next →
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
