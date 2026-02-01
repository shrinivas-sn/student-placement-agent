import { Sidebar } from "@/components/Sidebar";
import { MobileNav } from "@/components/MobileNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Target, FileText, MessageSquare, Code, Briefcase, Settings } from "lucide-react";

export default function UserGuide() {
    return (
        <div className="flex min-h-screen bg-background text-foreground">
            <Sidebar />
            <MobileNav />
            <main className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto">
                <header className="mb-8">
                    <h2 className="text-3xl font-bold font-['Orbitron'] mb-2">User Guide</h2>
                    <p className="text-muted-foreground">Learn how to use PlacementOS effectively</p>
                </header>

                <Tabs defaultValue="dashboard" className="space-y-6">
                    <TabsList className="bg-white/5 border border-white/10 flex-wrap h-auto">
                        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                        <TabsTrigger value="documents">Document Forge</TabsTrigger>
                        <TabsTrigger value="knowledge">Knowledge Core</TabsTrigger>
                        <TabsTrigger value="interview">Interview Sim</TabsTrigger>
                        <TabsTrigger value="code">Code Lab</TabsTrigger>
                        <TabsTrigger value="utilities">Utilities</TabsTrigger>
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                    </TabsList>

                    {/* Dashboard Guide */}
                    <TabsContent value="dashboard">
                        <Card className="glass-card">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Target className="w-5 h-5 text-cyan-400" />
                                    Dashboard Overview
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h3 className="font-bold text-lg mb-2">Placement Probability</h3>
                                    <p className="text-muted-foreground">
                                        Your placement probability is calculated based on your activity:
                                    </p>
                                    <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-muted-foreground">
                                        <li>Applications submitted: +4% each (max 20%)</li>
                                        <li>Interviews completed: +5% each (max 15%)</li>
                                        <li>Resume uploaded: +10%</li>
                                        <li>Flashcard decks created: +2% each (max 5%)</li>
                                        <li>Daily streak: +5% per week (max 15%)</li>
                                        <li>Recent activities: +1% each (max 5%)</li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-2">Daily Streak</h3>
                                    <p className="text-muted-foreground">
                                        Your streak increases when you use the app daily. Any activity counts - adding applications, practicing interviews, studying flashcards, etc.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-2">Recent Activity</h3>
                                    <p className="text-muted-foreground">
                                        See your last 5 actions with timestamps. This helps you track your progress and stay motivated.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Document Forge Guide */}
                    <TabsContent value="documents">
                        <Card className="glass-card">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-magenta-400" />
                                    Document Forge
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h3 className="font-bold text-lg mb-2">Upload Resume</h3>
                                    <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                                        <li>Paste your resume content in the text area</li>
                                        <li>Click "Save Resume" to store it</li>
                                        <li>Your resume will be used for AI-powered email generation</li>
                                    </ol>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-2">Email Drafter</h3>
                                    <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                                        <li>Make sure you've uploaded your resume first</li>
                                        <li>Enter the company name, HR name, and role you're applying for</li>
                                        <li>Click "Generate Email" to create a personalized email</li>
                                        <li>AI will use your resume to craft a tailored message</li>
                                        <li>Copy and customize the generated email as needed</li>
                                    </ol>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Knowledge Core Guide */}
                    <TabsContent value="knowledge">
                        <Card className="glass-card">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BookOpen className="w-5 h-5 text-lime-400" />
                                    Knowledge Core
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h3 className="font-bold text-lg mb-2">Flashcards</h3>
                                    <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                                        <li>Click "Create Deck" to start a new flashcard deck</li>
                                        <li>Name your deck (e.g., "React Hooks", "System Design")</li>
                                        <li>Add cards with questions and answers</li>
                                        <li>Click "Study" to review cards with flip animation</li>
                                        <li>Navigate through cards to reinforce learning</li>
                                    </ol>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-2">Roadmaps</h3>
                                    <p className="text-muted-foreground">
                                        View your learning roadmaps and track progress. Mark steps as complete as you advance through your learning journey.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Interview Assistant Guide */}
                    <TabsContent value="interview">
                        <Card className="glass-card">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MessageSquare className="w-5 h-5 text-purple-400" />
                                    Interview Assistant
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h3 className="font-bold text-lg mb-2">How to Get Help</h3>
                                    <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                                        <li>Select a help topic from the sidebar (Behavioral, Technical, etc.)</li>
                                        <li>Ask any question about interviews in the chat</li>
                                        <li>Get instant tips, examples, and strategies from the AI assistant</li>
                                        <li>Ask follow-up questions to dive deeper</li>
                                        <li>Switch topics anytime to explore different areas</li>
                                    </ol>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-2">Available Topics</h3>
                                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                        <li><strong>📝 Behavioral:</strong> STAR method, common questions, storytelling tips</li>
                                        <li><strong>💻 Technical:</strong> DSA patterns, coding approaches, problem-solving</li>
                                        <li><strong>🏗️ System Design:</strong> Architecture, scalability, databases</li>
                                        <li><strong>📧 HR Skills:</strong> Salary negotiation, questions to ask, etiquette</li>
                                        <li><strong>🎯 Prep Tips:</strong> Confidence building, what to wear, preparation</li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-2">Example Questions</h3>
                                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                        <li>"Give me tips for introducing myself"</li>
                                        <li>"How do I approach two-pointer problems?"</li>
                                        <li>"Explain load balancing simply"</li>
                                        <li>"How to negotiate salary?"</li>
                                        <li>"What should I wear to an interview?"</li>
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Code Lab Guide */}
                    <TabsContent value="code">
                        <Card className="glass-card">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Code className="w-5 h-5 text-orange-400" />
                                    Code Lab
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h3 className="font-bold text-lg mb-2">Student-Friendly Code Analysis</h3>
                                    <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                                        <li>Write or paste your code in the editor</li>
                                        <li>Click "Run Analysis" to get AI feedback</li>
                                        <li>Get easy-to-understand explanations (no confusing Big O notation!)</li>
                                        <li>See what your code does in plain English</li>
                                        <li>View example outputs your code will produce</li>
                                        <li>Get simple improvement tips you can actually use</li>
                                        <li>Check if your code is fast or slow for large inputs</li>
                                    </ol>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-2">Save & Manage Snippets</h3>
                                    <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                                        <li>Click "Save Snippet" to save your code</li>
                                        <li>Give it a title (e.g., "Two Sum Solution")</li>
                                        <li>Choose the programming language</li>
                                        <li>Add optional notes for future reference</li>
                                        <li>View all saved snippets in the sidebar</li>
                                        <li>Click "Open" to load a snippet back into the editor</li>
                                        <li>Click delete (trash icon) to remove snippets you don't need</li>
                                    </ol>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-2">What You'll Learn</h3>
                                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                        <li>Understand what your code actually does</li>
                                        <li>See expected outputs with examples</li>
                                        <li>Get simple tips to improve your code</li>
                                        <li>Know if your code is fast or slow</li>
                                        <li>Build a library of code snippets for interview prep</li>
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Utilities Guide */}
                    <TabsContent value="utilities">
                        <Card className="glass-card">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Briefcase className="w-5 h-5 text-blue-400" />
                                    Utilities
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h3 className="font-bold text-lg mb-2">Application Tracker</h3>
                                    <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                                        <li>Click "Add Application" to track a new job application</li>
                                        <li>Enter company name, role, and status</li>
                                        <li>Update status as you progress (Applied → Interview → Offer)</li>
                                        <li>Add notes for each application</li>
                                        <li>View all applications in one place</li>
                                    </ol>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-2">Smart Calendar</h3>
                                    <p className="text-muted-foreground">
                                        Schedule interviews, deadlines, and important events. Access from the Dashboard or Utilities page.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Settings Guide */}
                    <TabsContent value="settings">
                        <Card className="glass-card">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Settings className="w-5 h-5 text-gray-400" />
                                    Settings
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h3 className="font-bold text-lg mb-2">Profile Settings</h3>
                                    <p className="text-muted-foreground">
                                        Update your name, target role, and graduation year. This helps personalize your experience.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-2">Notifications</h3>
                                    <p className="text-muted-foreground">
                                        Enable browser notifications to get reminders for interviews and deadlines. No external service needed - completely free!
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-2">Data Management</h3>
                                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                        <li><strong>Export:</strong> Download all your data as JSON for backup</li>
                                        <li><strong>Import:</strong> Upload exported JSON to merge with existing data (won't overwrite)</li>
                                        <li><strong>Clear:</strong> Delete all data (use with caution!)</li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-2">Appearance</h3>
                                    <p className="text-muted-foreground">
                                        Switch between Dark and Light modes. Choose your accent color to personalize the interface.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
}
