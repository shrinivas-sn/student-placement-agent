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
import ReactMarkdown from "react-markdown";

export default function InterviewSimulator() {
  const { data: interviews } = useInterviews();
  const createInterview = useCreateInterview();
  const updateInterview = useUpdateInterview();

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [aiStatus, setAiStatus] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("Behavioral");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial greeting
    if (messages.length === 0) {
      setMessages([{
        role: "assistant",
        content: "Hi! I'm your Interview Assistant 🎯\n\nI can help you with:\n• Behavioral interview tips\n• Technical problem-solving\n• System design concepts\n• HR & soft skills\n• General interview prep\n\nWhat would you like help with today?"
      }]);
    }
  }, []);

  // Clear chat when topic changes
  useEffect(() => {
    setMessages([{
      role: "assistant",
      content: `Switched to **${selectedTopic}** topic! 🎯\n\nAsk me anything about ${selectedTopic.toLowerCase()} interviews.`
    }]);
  }, [selectedTopic]);

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
      const response = await aiService.chatWithAssistant(
        input,
        selectedTopic,
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
          <h2 className="text-3xl font-bold font-['Orbitron'] mb-2 text-purple-400">Interview Assistant</h2>
          <p className="text-muted-foreground">Get instant help with interview prep. Ask anything!</p>
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
                      <div className="prose prose-invert prose-sm max-w-none
                        prose-headings:text-purple-300 prose-headings:font-bold prose-headings:mt-4 prose-headings:mb-2 prose-headings:first:mt-0
                        prose-p:my-2 prose-p:leading-relaxed prose-p:text-gray-200
                        prose-ul:my-2 prose-ul:list-disc prose-ul:pl-4 prose-ul:text-gray-200
                        prose-ol:my-2 prose-ol:list-decimal prose-ol:pl-4 prose-ol:text-gray-200
                        prose-li:my-1 prose-li:text-gray-200
                        prose-strong:text-cyan-300 prose-strong:font-semibold
                        prose-code:bg-black/30 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-orange-300 prose-code:before:content-none prose-code:after:content-none
                        prose-pre:bg-black/40 prose-pre:p-3 prose-pre:rounded-lg prose-pre:my-3 prose-pre:border prose-pre:border-white/10">
                        <ReactMarkdown>
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {isTyping && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-muted-foreground p-4">
                    <Bot className="w-4 h-4" />
                    <span className="text-xs animate-pulse">Assistant is thinking...</span>
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
                placeholder="Ask me anything about interviews..."
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
              <h3 className="font-bold mb-4 text-purple-400">Help Topics</h3>
              <div className="space-y-2">
                {[
                  { name: 'Behavioral', icon: '📝' },
                  { name: 'Technical', icon: '💻' },
                  { name: 'System Design', icon: '🏗️' },
                  { name: 'HR Skills', icon: '📧' },
                  { name: 'Prep Tips', icon: '🎯' }
                ].map(topic => (
                  <div
                    key={topic.name}
                    onClick={() => setSelectedTopic(topic.name)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${selectedTopic === topic.name
                      ? 'bg-purple-500/20 border-purple-500 shadow-lg shadow-purple-500/20'
                      : 'bg-white/5 border-white/5 hover:border-purple-500/50'
                      }`}
                  >
                    <p className="text-sm font-medium">{topic.icon} {topic.name}</p>
                    {selectedTopic === topic.name && (
                      <p className="text-xs text-purple-300 mt-1">✓ Active</p>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            <Card className="glass-card p-4">
              <h3 className="font-bold mb-2 text-purple-400">Quick Tips</h3>
              <p className="text-xs text-muted-foreground">Try asking:</p>
              <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                <li>• "Tips for introducing myself"</li>
                <li>• "Explain binary search"</li>
                <li>• "How to negotiate salary?"</li>
              </ul>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
