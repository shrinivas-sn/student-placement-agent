import { useState } from "react";
import { useLocation } from "wouter";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { ArrowRight, CheckCircle2, Loader2, Brain, FileText, Target, Code, Calendar, Briefcase, Zap, Shield, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Landing() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      setLocation("/");
    } catch (error: any) {
      console.error("Login failed:", error);
      toast({
        title: "Login Failed",
        description: error.message || "Please try again",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: Brain,
      title: "AI Interview Assistant",
      desc: "Get instant help with interview prep! Ask questions about behavioral, technical, system design, HR skills, or general prep. 5 specialized topics, instant answers.",
      color: "from-purple-500/20 to-pink-500/20",
      iconColor: "text-purple-400"
    },
    {
      icon: FileText,
      title: "Smart Document Forge",
      desc: "Upload your resume once, generate personalized job application emails with AI. Just enter company name and role - AI does the rest!",
      color: "from-cyan-500/20 to-blue-500/20",
      iconColor: "text-cyan-400"
    },
    {
      icon: Target,
      title: "Knowledge Core",
      desc: "AI-powered roadmap generator creates personalized study plans. Flashcards with spaced repetition help you memorize concepts faster.",
      color: "from-green-500/20 to-emerald-500/20",
      iconColor: "text-green-400"
    },
    {
      icon: Code,
      title: "Code Lab with Snippets",
      desc: "Get student-friendly code analysis. Save code snippets with notes, open them anytime. Perfect for interview prep!",
      color: "from-orange-500/20 to-red-500/20",
      iconColor: "text-orange-400"
    },
    {
      icon: Calendar,
      title: "Smart Calendar",
      desc: "Schedule interviews, deadlines, and events. Dashboard shows your next upcoming event automatically. Never miss an interview!",
      color: "from-yellow-500/20 to-amber-500/20",
      iconColor: "text-yellow-400"
    },
    {
      icon: Briefcase,
      title: "Application Tracker",
      desc: "Track all job applications in one place. Organize by status: Applied, Interview, Offer, Rejected. See your pipeline at a glance.",
      color: "from-blue-500/20 to-indigo-500/20",
      iconColor: "text-blue-400"
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden relative">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/20 rounded-full blur-[120px]" />
      </div>

      <nav className="relative z-10 container mx-auto px-6 py-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold font-['Orbitron'] bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-magenta-500">
          PlacementOS
        </h1>
        <button
          onClick={handleLogin}
          disabled={isLoading}
          className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 transition-all font-medium text-sm disabled:opacity-50 flex items-center gap-2"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          Sign In with Google
        </button>
      </nav>

      <main className="relative z-10 container mx-auto px-6 pt-12 pb-20">
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e]" />
            <span className="text-sm font-medium text-muted-foreground">Placement Season 2026 is Live</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold font-['Orbitron'] mb-6 leading-tight max-w-4xl mx-auto">
            Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Ultimate</span> AI<br />
            Placement <span className="text-transparent bg-clip-text bg-gradient-to-r from-magenta-500 to-purple-500">Superpower</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Master interviews with AI coaching, generate perfect emails, track applications, and ace your placement season with one powerful dashboard.
          </p>

          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg shadow-[0_0_20px_rgba(6,182,212,0.5)] hover:shadow-[0_0_30px_rgba(6,182,212,0.7)] hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Signing In...
              </>
            ) : (
              <>
                Start Your Journey
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
            <div className="absolute inset-0 rounded-full bg-white/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>

        {/* Features Grid */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-['Orbitron'] mb-4">
              Everything You Need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Succeed</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              6 powerful AI-driven tools in one platform to dominate your placement season
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {features.map((feature, i) => (
              <div
                key={i}
                className="group p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 border border-white/10 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`w-7 h-7 ${feature.iconColor}`} />
                </div>
                <h3 className="text-xl font-bold mb-3 font-['Orbitron']">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-20 max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-['Orbitron'] mb-4">
              How It <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Works</span>
            </h2>
            <p className="text-muted-foreground text-lg">Get started in 3 simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Sign In", desc: "Login with your Google account in seconds. No complex setup required." },
              { step: "02", title: "Upload Resume", desc: "Paste your resume once. AI will use it to generate personalized emails for every job." },
              { step: "03", title: "Start Practicing", desc: "Use AI interview simulator, track applications, create flashcards, and ace your placements!" }
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="text-6xl font-bold font-['Orbitron'] text-white/5 mb-4">{item.step}</div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
                {i < 2 && (
                  <div className="hidden md:block absolute top-8 right-[-2rem] text-cyan-400">
                    <ArrowRight className="w-6 h-6" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Why PlacementOS */}
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-['Orbitron'] mb-4">
              Why <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">PlacementOS</span>?
            </h2>
            <p className="text-muted-foreground text-lg">Built by student, for students</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: Zap, title: "AI-Powered", desc: "Cutting-edge AI analyzes your code, generates emails, and coaches you through interviews" },
              { icon: Shield, title: "Secure & Private", desc: "Your data is encrypted and stored securely in Firebase. Only you can access it." },
              { icon: Sparkles, title: "Always Free", desc: "Core features are completely free. No hidden charges, no credit card required." },
              { icon: CheckCircle2, title: "All-in-One", desc: "Stop juggling 10 different apps. Everything you need in one beautiful dashboard." }
            ].map((item, i) => (
              <div key={i} className="flex gap-4 p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center border border-white/10">
                    <item.icon className="w-6 h-6 text-cyan-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-20">
          <div className="inline-block p-8 rounded-2xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-white/10 backdrop-blur-md">
            <h3 className="text-2xl md:text-3xl font-bold font-['Orbitron'] mb-4">
              Ready to Dominate Your Placements?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Start your journey with One stop Multifunctional Agent
            </p>
            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg shadow-[0_0_20px_rgba(6,182,212,0.5)] hover:shadow-[0_0_30px_rgba(6,182,212,0.7)] hover:scale-105 transition-all duration-300 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  Get Started Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-8">
        <div className="container mx-auto px-6 text-center text-muted-foreground text-sm">
          <p>© 2026 PlacementOS. Developed by Shrinivas</p>
        </div>
      </footer>
    </div>
  );
}
