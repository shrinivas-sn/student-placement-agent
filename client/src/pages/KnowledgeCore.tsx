import { Sidebar } from "@/components/Sidebar";
import { FlashcardManager } from "@/components/FlashcardManager";
import { useRoadmaps } from "@/hooks/use-resources";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Circle } from "lucide-react";

export default function KnowledgeCore() {
  const { data: roadmaps } = useRoadmaps();

  // Mock data for display if empty
  const displayRoadmaps = roadmaps?.length ? roadmaps : [
    {
      id: 1,
      title: "Frontend Mastery",
      steps: [
        { title: "HTML/CSS Basics", status: "completed" },
        { title: "JavaScript ES6+", status: "completed" },
        { title: "React Hooks", status: "pending" },
        { title: "State Management", status: "pending" }
      ]
    }
  ];

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 overflow-y-auto">
        <header className="mb-8">
          <h2 className="text-3xl font-bold font-['Orbitron'] mb-2 text-lime-400">Knowledge Core</h2>
          <p className="text-muted-foreground">Map your journey and reinforce your memory.</p>
        </header>

        <Tabs defaultValue="flashcards" className="space-y-6">
          <TabsList className="bg-white/5 border border-white/10">
            <TabsTrigger value="flashcards" className="data-[state=active]:bg-green-500 data-[state=active]:text-black">Flashcards</TabsTrigger>
            <TabsTrigger value="roadmaps" className="data-[state=active]:bg-lime-500 data-[state=active]:text-black">Roadmaps</TabsTrigger>
          </TabsList>

          <TabsContent value="flashcards">
            <FlashcardManager />
          </TabsContent>

          <TabsContent value="roadmaps">
            <div className="grid grid-cols-1 gap-6">
              {displayRoadmaps.map((map) => (
                <Card key={map.id} className="glass-card">
                  <CardHeader>
                    <CardTitle>{map.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative border-l-2 border-white/10 pl-8 ml-4 space-y-8 py-4">
                      {map.steps.map((step: any, index: number) => (
                        <div key={index} className="relative">
                          <div className={`absolute -left-[41px] top-0 w-6 h-6 rounded-full border-2 flex items-center justify-center bg-background ${step.status === 'completed' ? 'border-lime-500 text-lime-500' : 'border-white/20 text-white/20'}`}>
                            {step.status === 'completed' ? <CheckCircle className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                          </div>
                          <h4 className={`font-bold ${step.status === 'completed' ? 'text-lime-400' : 'text-foreground'}`}>{step.title}</h4>
                          <p className="text-sm text-muted-foreground">Status: {step.status}</p>
                        </div>
                      ))}
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
