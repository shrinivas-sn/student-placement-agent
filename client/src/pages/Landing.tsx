import { Link } from "wouter";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function Landing() {
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
        <a href="/api/login" className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 transition-all font-medium text-sm">
          Sign In
        </a>
      </nav>

      <main className="relative z-10 container mx-auto px-6 pt-20 pb-32 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e]" />
          <span className="text-sm font-medium text-muted-foreground">Placement Season 2024 is Live</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold font-['Orbitron'] mb-6 leading-tight max-w-4xl mx-auto">
          Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Ultimate</span> AI<br />
          Placement <span className="text-transparent bg-clip-text bg-gradient-to-r from-magenta-500 to-purple-500">Superpower</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          Master your interviews, forge perfect resumes, and track every application in one futuristic dashboard.
        </p>

        <a 
          href="/api/login"
          className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg shadow-[0_0_20px_rgba(6,182,212,0.5)] hover:shadow-[0_0_30px_rgba(6,182,212,0.7)] hover:scale-105 transition-all duration-300"
        >
          Start Your Journey
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          <div className="absolute inset-0 rounded-full bg-white/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
        </a>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 max-w-6xl w-full text-left">
          {[
            { title: "AI Resume Forge", desc: "Heatmap analysis and automated improvements." },
            { title: "Interview Simulator", desc: "Practice with AI personas in real-time chat." },
            { title: "Knowledge Core", desc: "Interactive roadmaps and smart flashcards." }
          ].map((feature, i) => (
            <div key={i} className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center mb-6 border border-white/10">
                <CheckCircle2 className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 font-['Orbitron']">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="relative z-10 border-t border-white/5 py-8 text-center text-sm text-muted-foreground">
        © 2024 PlacementOS. All rights reserved.
      </footer>
    </div>
  );
}
