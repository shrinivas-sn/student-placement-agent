import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { MobileNav } from "@/components/MobileNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Mail, Upload, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUserResume, useSaveResume } from "@/hooks/use-resources";
import { aiService } from "@/services/aiService";

export default function DocumentForge() {
  const { toast } = useToast();
  const { data: savedResume } = useUserResume();
  const saveResume = useSaveResume();

  // Resume Upload State
  const [resumeContent, setResumeContent] = useState("");
  const [isSavingResume, setIsSavingResume] = useState(false);

  // Email Drafter State
  const [companyName, setCompanyName] = useState("");
  const [hrName, setHrName] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [generatedEmail, setGeneratedEmail] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiStatus, setAiStatus] = useState("");

  // Load saved resume when component mounts
  useState(() => {
    if (savedResume) {
      setResumeContent(savedResume);
    }
  });

  const handleSaveResume = async () => {
    if (!resumeContent.trim()) {
      toast({ title: "Error", description: "Please paste your resume content", variant: "destructive" });
      return;
    }

    setIsSavingResume(true);
    try {
      await saveResume.mutateAsync(resumeContent);
      toast({ title: "Success!", description: "Resume saved successfully. It will be used for email generation." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to save resume", variant: "destructive" });
    } finally {
      setIsSavingResume(false);
    }
  };

  const handleGenerateEmail = async () => {
    if (!savedResume) {
      toast({
        title: "Resume Required",
        description: "Please upload your resume first in the 'Upload Resume' tab",
        variant: "destructive"
      });
      return;
    }

    if (!companyName || !jobRole) {
      toast({ title: "Missing Info", description: "Company Name and Job Role are required", variant: "destructive" });
      return;
    }

    setIsGenerating(true);
    setAiStatus("");
    setGeneratedEmail("");

    try {
      const enhancedPrompt = `You are a professional career coach. Generate a compelling, professional email to apply for a job.

**Candidate's Resume:**
${savedResume.slice(0, 800)}

**Job Details:**
- Company: ${companyName}
- ${hrName ? `HR Contact: ${hrName}` : 'Hiring Manager'}
- Position: ${jobRole}

**Requirements:**
- Professional and engaging tone
- Address the ${hrName || 'Hiring Manager'} properly
- Mention specific skills from resume that match the ${jobRole} role
- Express enthusiasm for ${companyName}
- Keep it concise (200-250 words)
- Include proper email structure (Subject, Greeting, Body, Closing)

Generate the professional job application email now:`;

      const result = await aiService.generateCoverLetter(enhancedPrompt, (status: string) => {
        setAiStatus(status);
        if (status.includes("waking up")) {
          toast({ title: "AI Initializing", description: "First use may take 30-60 seconds. Please wait...", duration: 5000 });
        }
      });

      setGeneratedEmail(result);
      setAiStatus("");
      toast({ title: "Success", description: "Email drafted successfully!" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to generate email", variant: "destructive" });
      setAiStatus("");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(generatedEmail);
    toast({ title: "Copied!", description: "Email copied to clipboard" });
  };

  const handleDownloadEmail = () => {
    const blob = new Blob([generatedEmail], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${companyName.replace(/\s+/g, '_')}_application_email.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Downloaded!", description: "Email saved successfully" });
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <MobileNav />
      <main className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto">
        <header className="mb-8">
          <h2 className="text-3xl font-bold font-['Orbitron'] mb-2 text-cyan-400">Document Forge</h2>
          <p className="text-muted-foreground">Manage your resume and draft professional emails with AI assistance.</p>
        </header>

        <Tabs defaultValue="resume" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
            <TabsTrigger value="resume" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Upload Resume
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email Drafter
            </TabsTrigger>
          </TabsList>

          {/* Upload Resume Tab */}
          <TabsContent value="resume" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-cyan-400" />
                  Upload Your Resume
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-sm">
                  <p className="text-cyan-400 font-semibold mb-2">📋 How to upload:</p>
                  <ol className="list-decimal list-inside space-y-1 text-gray-300">
                    <li>Copy all text from your resume document</li>
                    <li>Paste it in the text box below</li>
                    <li>Click "Save Resume" to store it</li>
                    <li>Your resume will be used for AI email generation</li>
                  </ol>
                </div>

                <Textarea
                  placeholder="Paste your complete resume content here... (Include name, contact, experience, education, skills, etc.)"
                  className="min-h-[400px] bg-black/20 border-white/10 font-mono text-sm"
                  value={resumeContent}
                  onChange={(e) => setResumeContent(e.target.value)}
                />

                <div className="flex items-center gap-3">
                  <Button
                    onClick={handleSaveResume}
                    disabled={isSavingResume}
                    className="bg-cyan-600 hover:bg-cyan-700"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {isSavingResume ? "Saving..." : savedResume ? "Update Resume" : "Save Resume"}
                  </Button>
                  {savedResume && (
                    <span className="text-sm text-green-400">✓ Resume saved ({savedResume.length} characters)</span>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Email Drafter Tab */}
          <TabsContent value="email" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-cyan-400" />
                  AI Email Drafter
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!savedResume && (
                  <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-sm text-yellow-400">
                    ⚠️ Please upload your resume first in the "Upload Resume" tab for better results!
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Company Name *</label>
                    <Input
                      placeholder="e.g., Google"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Job Role *</label>
                    <Input
                      placeholder="e.g., Software Engineer"
                      value={jobRole}
                      onChange={(e) => setJobRole(e.target.value)}
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">HR Name (Optional)</label>
                  <Input
                    placeholder="e.g., John Smith"
                    value={hrName}
                    onChange={(e) => setHrName(e.target.value)}
                    className="bg-white/5 border-white/10"
                  />
                </div>

                {aiStatus && (
                  <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    {aiStatus}
                  </div>
                )}

                <Button
                  onClick={handleGenerateEmail}
                  disabled={isGenerating}
                  className="w-full bg-cyan-600 hover:bg-cyan-700"
                >
                  {isGenerating ? "Drafting..." : "Generate Professional Email"}
                  <Wand2 className="ml-2 h-4 w-4" />
                </Button>

                {/* Email Preview */}
                {generatedEmail && (
                  <div className="mt-6 space-y-3">
                    <h4 className="font-semibold text-cyan-400">Generated Email</h4>
                    <div className="p-4 rounded-lg bg-black/40 border border-cyan-500/20 max-h-[400px] overflow-y-auto">
                      <pre className="whitespace-pre-wrap text-sm text-gray-300 font-sans">{generatedEmail}</pre>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleCopyEmail}
                        variant="outline"
                        className="flex-1 border-cyan-500/30 hover:bg-cyan-500/10"
                      >
                        📋 Copy to Clipboard
                      </Button>
                      <Button
                        onClick={handleDownloadEmail}
                        variant="outline"
                        className="flex-1 border-cyan-500/30 hover:bg-cyan-500/10"
                      >
                        ⬇️ Download .txt
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
