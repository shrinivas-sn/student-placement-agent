import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { MobileNav } from "@/components/MobileNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Code, Play, Save } from "lucide-react";
import { aiService } from "@/services/aiService";

export default function CodeLab() {
  const [code, setCode] = useState(`function twoSum(nums, target) {
  // Write your solution here
}`);
  const [analysis, setAnalysis] = useState<any>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiStatus, setAiStatus] = useState("");

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
    } finally {
      setAnalyzing(false);
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
            <Button variant="outline" className="border-orange-500/50 text-orange-400 hover:bg-orange-500/10 gap-2">
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
                  <CardTitle className="text-orange-400">Analysis Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded bg-orange-500/10 border border-orange-500/20">
                    <p className="text-xs text-orange-300 uppercase tracking-widest mb-1">Time Complexity</p>
                    <p className="text-2xl font-bold font-mono">{analysis.complexity}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Suggestions</h4>
                    <ul className="list-disc pl-4 space-y-2 text-sm text-muted-foreground">
                      {analysis.suggestions.map((s: string, i: number) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="glass-card border-dashed border-white/20">
                <CardContent className="flex items-center justify-center h-48 text-muted-foreground text-center p-6">
                  Run analysis to see Big O complexity and code quality suggestions.
                </CardContent>
              </Card>
            )}

            <Card className="glass-card">
              <CardHeader><CardTitle>Saved Snippets</CardTitle></CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground text-center py-4">No saved snippets yet.</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
