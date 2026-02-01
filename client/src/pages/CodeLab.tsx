import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { MobileNav } from "@/components/MobileNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Code, Play, Save, Trash2, FileCode } from "lucide-react";
import { aiService } from "@/services/aiService";
import { useCodeSnippets, useCreateCodeSnippet, useDeleteCodeSnippet } from "@/hooks/use-resources";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

export default function CodeLab() {
  const [code, setCode] = useState(`function twoSum(nums, target) {
  // Write your solution here
}`);
  const [analysis, setAnalysis] = useState<any>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiStatus, setAiStatus] = useState("");

  // Save snippet states
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [snippetTitle, setSnippetTitle] = useState("");
  const [snippetLanguage, setSnippetLanguage] = useState("javascript");
  const [snippetNotes, setSnippetNotes] = useState("");

  // Delete confirmation state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [snippetToDelete, setSnippetToDelete] = useState<string | null>(null);

  const { toast } = useToast();
  const { data: snippets = [], isLoading: snippetsLoading } = useCodeSnippets();
  const createSnippet = useCreateCodeSnippet();
  const deleteSnippet = useDeleteCodeSnippet();

  const handleAnalyze = async () => {
    if (!code.trim()) return;
    setAnalyzing(true);
    setAiStatus("");
    try {
      const result = await aiService.analyzeCode(code, (status) => setAiStatus(status));
      setAnalysis(result);
      setAiStatus("");
    } catch (error: any) {
      console.error("Code analysis error:", error);
      setAiStatus("");
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze code",
        variant: "destructive",
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSaveClick = () => {
    if (!code.trim()) {
      toast({
        title: "No Code",
        description: "Please write some code before saving",
        variant: "destructive",
      });
      return;
    }
    setSaveDialogOpen(true);
  };

  const handleSaveSnippet = async () => {
    if (!snippetTitle.trim()) {
      toast({
        title: "Title Required",
        description: "Please enter a title for your snippet",
        variant: "destructive",
      });
      return;
    }

    try {
      // Build the snippet data object, only include notes if it has a value
      const snippetData: any = {
        title: snippetTitle.trim(),
        code: code,
        language: snippetLanguage.trim() || "javascript",
      };

      // Only add notes if it's not empty
      if (snippetNotes.trim()) {
        snippetData.notes = snippetNotes.trim();
      }

      await createSnippet.mutateAsync(snippetData);

      toast({
        title: "✅ Snippet Saved!",
        description: `"${snippetTitle}" has been saved successfully`,
      });

      // Reset form
      setSaveDialogOpen(false);
      setSnippetTitle("");
      setSnippetLanguage("javascript");
      setSnippetNotes("");
    } catch (error: any) {
      console.error("Save snippet error:", error);
      toast({
        title: "Save Failed",
        description: error.message || "Failed to save snippet",
        variant: "destructive",
      });
    }
  };

  const handleOpenSnippet = (snippet: any) => {
    setCode(snippet.code);
    setAnalysis(null); // Clear previous analysis
    toast({
      title: "📂 Snippet Loaded",
      description: `"${snippet.title}" loaded into editor`,
    });
  };

  const handleDeleteClick = (snippetId: string) => {
    setSnippetToDelete(snippetId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!snippetToDelete) return;

    try {
      await deleteSnippet.mutateAsync(snippetToDelete);
      toast({
        title: "🗑️ Snippet Deleted",
        description: "Snippet has been removed",
      });
      setDeleteDialogOpen(false);
      setSnippetToDelete(null);
    } catch (error: any) {
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete snippet",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <MobileNav />
      <main className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold font-['Orbitron'] mb-2 text-orange-400">Code Lab</h2>
            <p className="text-muted-foreground">Experiment, analyze, and optimize your algorithms.</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="border-orange-500/50 text-orange-400 hover:bg-orange-500/10 gap-2"
              onClick={handleSaveClick}
            >
              <Save className="w-4 h-4" /> Save Snippet
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 glass-card border-orange-500/20">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5 text-orange-400" /> Editor
              </CardTitle>
              <Button size="sm" onClick={handleAnalyze} disabled={analyzing} className="bg-orange-600 hover:bg-orange-700">
                <Play className="w-4 h-4 mr-2" /> {analyzing ? "Analyzing..." : "Run Analysis"}
              </Button>
            </CardHeader>
            <CardContent>
              {aiStatus && (
                <div className="mb-3 p-2 rounded-lg bg-orange-500/10 border border-orange-500/30 text-xs text-orange-300 animate-pulse">
                  {aiStatus}
                </div>
              )}
              <Textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="font-mono bg-black/40 border-white/10 min-h-[500px] text-sm"
                spellCheck={false}
              />
            </CardContent>
          </Card>

          <div className="space-y-6">
            {analysis ? (
              <Card className="glass-card border-orange-500/30">
                <CardHeader>
                  <CardTitle className="text-orange-400">📊 Analysis Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* What the code does */}
                  <div>
                    <h4 className="font-semibold mb-2 text-cyan-400">📝 What Your Code Does</h4>
                    <p className="text-sm text-muted-foreground bg-cyan-500/5 p-3 rounded border border-cyan-500/20">
                      {analysis.whatItDoes}
                    </p>
                  </div>

                  {/* Expected Output */}
                  <div>
                    <h4 className="font-semibold mb-2 text-blue-400">📊 Expected Output</h4>
                    <p className="text-sm text-muted-foreground bg-blue-500/5 p-3 rounded border border-blue-500/20 font-mono">
                      {analysis.expectedOutput}
                    </p>
                  </div>

                  {/* Code Quality */}
                  <div className="p-4 rounded bg-green-500/10 border border-green-500/20">
                    <p className="text-xs text-green-300 uppercase tracking-widest mb-1">Code Quality</p>
                    <p className="text-lg font-semibold">
                      {analysis.codeQuality?.includes("Works") ? "✅ " : "⚠️ "}
                      {analysis.codeQuality}
                    </p>
                  </div>

                  {/* Improvement Tips */}
                  <div>
                    <h4 className="font-semibold mb-2 text-yellow-400">💡 Improvement Tips</h4>
                    <ul className="space-y-2 text-sm">
                      {analysis.tips?.map((tip: string, i: number) => (
                        <li key={i} className="bg-yellow-500/5 p-2 rounded border border-yellow-500/20 text-muted-foreground">
                          • {tip}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Performance */}
                  <div className="p-4 rounded bg-purple-500/10 border border-purple-500/20">
                    <p className="text-xs text-purple-300 uppercase tracking-widest mb-1">Performance</p>
                    <p className="text-lg font-semibold">
                      {analysis.performance?.includes("Fast") ? "⚡ " :
                        analysis.performance?.includes("Slow") ? "🐌 " : "⚙️ "}
                      {analysis.performance}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="glass-card border-dashed border-white/20">
                <CardContent className="flex items-center justify-center h-48 text-muted-foreground text-center p-6">
                  Run analysis to understand what your code does, see example outputs, and get simple improvement tips! 🚀
                </CardContent>
              </Card>
            )}

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileCode className="w-5 h-5" /> Saved Snippets
                </CardTitle>
              </CardHeader>
              <CardContent>
                {snippetsLoading ? (
                  <div className="text-sm text-muted-foreground text-center py-4">Loading snippets...</div>
                ) : snippets.length === 0 ? (
                  <div className="text-sm text-muted-foreground text-center py-4">No saved snippets yet.</div>
                ) : (
                  <div className="space-y-3">
                    {snippets.map((snippet: any) => (
                      <div
                        key={snippet.id}
                        className="p-3 rounded-lg bg-white/5 border border-white/10 hover:border-orange-500/30 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm truncate">{snippet.title}</h4>
                            <p className="text-xs text-muted-foreground">
                              {snippet.language} • {snippet.code.split('\n').length} lines
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 h-8 text-xs border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
                            onClick={() => handleOpenSnippet(snippet)}
                          >
                            <FileCode className="w-3 h-3 mr-1" /> Open
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 text-xs border-red-500/30 text-red-400 hover:bg-red-500/10"
                            onClick={() => handleDeleteClick(snippet.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Save Snippet Dialog */}
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent className="glass-card border-orange-500/30">
          <DialogHeader>
            <DialogTitle className="text-orange-400">💾 Save Code Snippet</DialogTitle>
            <DialogDescription>
              Give your code snippet a title and optional notes for future reference.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title *</label>
              <Input
                placeholder="e.g., Two Sum Solution"
                value={snippetTitle}
                onChange={(e) => setSnippetTitle(e.target.value)}
                className="bg-black/40 border-white/10"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Language</label>
              <Input
                placeholder="e.g., javascript, python, java"
                value={snippetLanguage}
                onChange={(e) => setSnippetLanguage(e.target.value)}
                className="bg-black/40 border-white/10"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Notes (Optional)</label>
              <Textarea
                placeholder="Add any notes about this snippet..."
                value={snippetNotes}
                onChange={(e) => setSnippetNotes(e.target.value)}
                className="bg-black/40 border-white/10 min-h-[80px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-orange-600 hover:bg-orange-700"
              onClick={handleSaveSnippet}
              disabled={createSnippet.isPending}
            >
              {createSnippet.isPending ? "Saving..." : "Save Snippet"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="glass-card border-red-500/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-400">Delete Snippet?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the code snippet from your database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={handleConfirmDelete}
            >
              {deleteSnippet.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
