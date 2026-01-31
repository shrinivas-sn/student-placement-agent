import { useState, useEffect, useRef } from "react";
import { Sidebar } from "@/components/Sidebar";
import { MobileNav } from "@/components/MobileNav";
import { useInterviews, useCreateInterview, useUpdateInterview } from "@/hooks/use-resources";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mic, Send, Bot, User } from "lucide-react";
import { aiService } from "@/services/aiService";
import { motion, AnimatePresence } from "framer-motion";

export default function InterviewSimulator() {
  const { data: interviews } = useInterviews();
  const createInterview = useCreateInterview();
  const updateInterview = useUpdateInterview();

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [aiStatus, setAiStatus] = useState("");
  const [selectedPersona, setSelectedPersona] = useState("Strict HR");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial greeting
    if (messages.length === 0) {
      setMessages([{ role: "assistant", content: "Hello! I'm your interviewer today. Let's start with: Tell me about yourself." }]);
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    setAiStatus("");

    try {
      const response = await aiService.chatWithInterviewer(
        input,
        selectedPersona,
        messages,
        (status) => setAiStatus(status)
      );
      setMessages(prev => [...prev, { role: "assistant", content: response }]);
      setAiStatus("");
    } catch (error: any) {
      setMessages(prev => [...prev, { role: "assistant", content: `Error: ${error.message}` }]);
      setAiStatus("");
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <MobileNav />
      <main className="flex-1 md:ml-64 p-4 md:p-8 flex flex-col h-screen overflow-hidden">
        <header className="mb-6 flex-shrink-0">
          <h2 className="text-3xl font-bold font-['Orbitron'] mb-2 text-purple-400">Interview Simulator</h2>
          <p className="text-muted-foreground">Practice makes perfect. AI-powered mock interviews.</p>
        </header>

        <div className="flex-1 flex gap-6 overflow-hidden pb-4">
          {/* Chat Window */}
          <Card className="flex-1 flex flex-col glass-card overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6 space-y-6" ref={scrollRef}>
              <AnimatePresence>
                {messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <Avatar className={msg.role === 'assistant' ? "bg-purple-600" : "bg-cyan-600"}>
                      <AvatarFallback>{msg.role === 'assistant' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}</AvatarFallback>
                    </Avatar>
                    <div className={`rounded-2xl p-4 max-w-[80%] ${msg.role === 'assistant'
                      ? 'bg-white/10 rounded-tl-none'
                      : 'bg-cyan-600/20 text-cyan-100 rounded-tr-none border border-cyan-500/20'
                      }`}>
                      {msg.content}
                    </div>
                  </motion.div>
                ))}
                {isTyping && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-muted-foreground p-4">
                    <Bot className="w-4 h-4" />
                    <span className="text-xs animate-pulse">Interviewer is thinking...</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="p-4 border-t border-white/5 bg-black/20 flex gap-4">
              <Button size="icon" variant="ghost" className="rounded-full h-10 w-10 border border-white/10 hover:bg-white/10">
                <Mic className="w-4 h-4" />
              </Button>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your answer..."
                className="flex-1 bg-white/5 border-white/10 rounded-full px-6 focus-visible:ring-purple-500"
              />
              <Button size="icon" onClick={handleSend} className="rounded-full h-10 w-10 bg-purple-600 hover:bg-purple-700">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </Card>

          {/* Sidebar - Personas */}
          <div className="w-64 hidden lg:block space-y-4">
            <Card className="glass-card p-4">
              <h3 className="font-bold mb-4 text-purple-400">Interviewer Persona</h3>
              <div className="space-y-2">
                {['Strict HR', 'Chill Tech Lead', 'System Design Expert'].map(persona => (
                  <div
                    key={persona}
                    onClick={() => setSelectedPersona(persona)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${selectedPersona === persona
                      ? 'bg-purple-500/20 border-purple-500 shadow-lg shadow-purple-500/20'
                      : 'bg-white/5 border-white/5 hover:border-purple-500/50'
                      }`}
                  >
                    <p className="text-sm font-medium">{persona}</p>
                    {selectedPersona === persona && (
                      <p className="text-xs text-purple-300 mt-1">✓ Active</p>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            <Card className="glass-card p-4">
              <h3 className="font-bold mb-2">History</h3>
              <p className="text-sm text-muted-foreground">No previous sessions.</p>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
