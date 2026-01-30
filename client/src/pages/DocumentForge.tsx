import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { useDocuments, useCreateDocument, useDeleteDocument } from "@/hooks/use-resources";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Wand2, Trash2, Download } from "lucide-react";
import { aiService } from "@/services/aiService";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function DocumentForge() {
  const { data: documents } = useDocuments();
  const createDoc = useCreateDocument();
  const deleteDoc = useDeleteDocument();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState("resume");
  const [jobDesc, setJobDesc] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [resumeContent, setResumeContent] = useState(""); // Simplified for demo
  const [analysis, setAnalysis] = useState<any>(null);

  const handleGenerateCoverLetter = async () => {
    if (!jobDesc) {
      toast({ title: "Input Required", description: "Please paste a job description.", variant: "destructive" });
      return;
    }
    setIsGenerating(true);
    try {
      const content = await aiService.generateCoverLetter(jobDesc, "My Resume Content...");
      createDoc.mutate({
        title: `Cover Letter - ${new Date().toLocaleDateString()}`,
        type: "cover_letter",
        content: content
      });
      toast({ title: "Success", description: "Cover letter generated!" });
    } catch (e) {
      toast({ title: "Error", description: "Failed to generate.", variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnalyzeResume = async () => {
    setIsGenerating(true);
    try {
      const result = await aiService.analyzeResume(resumeContent);
      setAnalysis(result);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 overflow-y-auto">
        <header className="mb-8">
          <h2 className="text-3xl font-bold font-['Orbitron'] mb-2 text-magenta-400">Document Forge</h2>
          <p className="text-muted-foreground">Craft your professional arsenal with AI assistance.</p>
        </header>

        <Tabs defaultValue="resume" className="space-y-6" onValueChange={setActiveTab}>
          <TabsList className="bg-white/5 border border-white/10 p-1">
            <TabsTrigger value="resume" className="data-[state=active]:bg-magenta-500 data-[state=active]:text-white">Resumes</TabsTrigger>
            <TabsTrigger value="cover_letter" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-white">Cover Letters</TabsTrigger>
          </TabsList>

          <TabsContent value="resume" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Resume Builder</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea 
                  placeholder="Paste your resume content here..." 
                  className="min-h-[300px] bg-black/20 border-white/10"
                  value={resumeContent}
                  onChange={(e) => setResumeContent(e.target.value)}
                />
                <Button 
                  onClick={handleAnalyzeResume} 
                  disabled={isGenerating}
                  className="w-full bg-magenta-600 hover:bg-magenta-700"
                >
                  {isGenerating ? "Scanning..." : "Analyze with AI"}
                  <Wand2 className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            {analysis && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <Card className="glass-card border-magenta-500/30">
                  <CardHeader>
                    <CardTitle className="text-magenta-400">Analysis Report</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>ATS Score</span>
                      <span className="text-2xl font-bold">{analysis.score}/100</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-magenta-500" style={{ width: `${analysis.score}%` }} />
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Missing Keywords</h4>
                      <div className="flex flex-wrap gap-2">
                        {analysis.missingSkills.map((skill: string) => (
                          <span key={skill} className="px-2 py-1 rounded bg-red-500/20 text-red-300 text-xs border border-red-500/30">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 rounded bg-white/5 text-sm italic border-l-2 border-magenta-500">
                      "{analysis.improvements}"
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="cover_letter" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>AI Generator</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea 
                  placeholder="Paste the Job Description here..." 
                  className="min-h-[200px] bg-black/20 border-white/10"
                  value={jobDesc}
                  onChange={(e) => setJobDesc(e.target.value)}
                />
                <Button 
                  onClick={handleGenerateCoverLetter} 
                  disabled={isGenerating}
                  className="w-full bg-cyan-600 hover:bg-cyan-700"
                >
                  {isGenerating ? "Forging..." : "Generate Cover Letter"}
                  <Wand2 className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h3 className="font-bold text-lg">Saved Documents</h3>
              {documents?.filter(d => d.type === "cover_letter").map((doc) => (
                <Card key={doc.id} className="bg-card/40 border-white/5 hover:border-cyan-500/50 transition-colors">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="text-cyan-400 h-5 w-5" />
                      <div>
                        <p className="font-medium">{doc.title}</p>
                        <p className="text-xs text-muted-foreground">{new Date(doc.createdAt!).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="icon" variant="ghost" className="h-8 w-8 hover:text-red-400" onClick={() => deleteDoc.mutate(doc.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
