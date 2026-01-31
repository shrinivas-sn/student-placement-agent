import { Sidebar } from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Target, FileText, MessageSquare, Code, Briefcase, Settings } from "lucide-react";

export default function UserGuide() {
    return (
        <div className="flex min-h-screen bg-background text-foreground">
            <Sidebar />
            <main className="flex-1 ml-64 p-8 overflow-y-auto">
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

                    {/* Interview Simulator Guide */}
                    <TabsContent value="interview">
                        <Card className="glass-card">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MessageSquare className="w-5 h-5 text-purple-400" />
                                    Interview Simulator
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h3 className="font-bold text-lg mb-2">How to Practice</h3>
                                    <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                                        <li>Select an interviewer persona (Strict HR, Friendly Tech Lead, etc.)</li>
                                        <li>Type your responses to the AI interviewer's questions</li>
                                        <li>Get real-time feedback and follow-up questions</li>
                                        <li>Practice common interview questions and scenarios</li>
                                        <li>Build confidence for real interviews</li>
                                    </ol>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-2">Tips</h3>
                                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                        <li>Be specific and detailed in your answers</li>
                                        <li>Use the STAR method (Situation, Task, Action, Result)</li>
                                        <li>Practice regularly to improve your communication</li>
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
                                    <h3 className="font-bold text-lg mb-2">AI Code Analysis</h3>
                                    <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                                        <li>Paste your code in the editor</li>
                                        <li>Click "Analyze Code" to get AI feedback</li>
                                        <li>Review time complexity analysis (Big O notation)</li>
                                        <li>Get optimization suggestions</li>
                                        <li>Learn better approaches and patterns</li>
                                    </ol>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-2">Use Cases</h3>
                                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                        <li>Prepare for coding interviews</li>
                                        <li>Learn DSA patterns and optimizations</li>
                                        <li>Understand time/space complexity</li>
                                        <li>Improve code quality</li>
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
