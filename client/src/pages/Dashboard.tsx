import { Sidebar } from "@/components/Sidebar";
import { useStats, useUpdateStats } from "@/hooks/use-resources";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Calendar, Trophy, Target, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { data: stats, isLoading } = useStats();

  if (isLoading) return <div className="min-h-screen bg-background text-foreground flex items-center justify-center">Loading...</div>;

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 overflow-y-auto">
        <header className="mb-8">
          <h2 className="text-3xl font-bold font-['Orbitron'] mb-2">Command Center</h2>
          <p className="text-muted-foreground">Welcome back, Cadet. Status report loaded.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Probability Gauge */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="glass-card h-full relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Placement Probability</CardTitle>
                <Target className="h-4 w-4 text-cyan-400" />
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-cyan-400 mb-4">{stats?.placementProbability || 68}%</div>
                <Progress value={stats?.placementProbability || 68} className="h-2 bg-white/10" indicatorClassName="bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />
                <p className="text-xs text-muted-foreground mt-4">
                  +12% from last week based on interview performance.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Streak */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glass-card h-full relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-magenta-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Daily Streak</CardTitle>
                <TrendingUp className="h-4 w-4 text-magenta-400" />
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-magenta-400 mb-4">{stats?.streak || 5} Days</div>
                <div className="flex gap-1 h-8 items-end">
                  {[40, 70, 50, 90, 60, 80, 100].map((h, i) => (
                    <div key={i} className="flex-1 bg-white/10 hover:bg-magenta-400/50 transition-colors rounded-sm" style={{ height: `${h}%` }} />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  Consistency is key. Keep the momentum going!
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Upcoming Deadlines */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="glass-card h-full relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-lime-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming Events</CardTitle>
                <Calendar className="h-4 w-4 text-lime-400" />
              </CardHeader>
              <CardContent className="space-y-4">
                {(stats?.upcomingDeadlines || [
                  {title: "Google Interview", date: "Tomorrow, 10:00 AM"},
                  {title: "Amazon OA Deadline", date: "Oct 24, 11:59 PM"},
                  {title: "Resume Submission", date: "Oct 26, 5:00 PM"}
                ]).map((event, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                    <span className="text-sm font-medium">{event.title}</span>
                    <span className="text-xs text-lime-400 bg-lime-400/10 px-2 py-1 rounded-full border border-lime-400/20">{event.date}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent Activity Mock */}
        <h3 className="text-xl font-bold font-['Orbitron'] mb-4">Recent Transmissions</h3>
        <div className="space-y-3">
          {[
            { text: "Completed 'Dynamic Programming' roadmap step", time: "2 hours ago", type: "learning" },
            { text: "Created new cover letter for Microsoft", time: "5 hours ago", type: "doc" },
            { text: "Interview simulation score: 85/100", time: "Yesterday", type: "interview" },
          ].map((activity, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + (i * 0.1) }}
              className="p-4 rounded-xl bg-card border border-white/5 flex items-center justify-between hover:border-white/10 transition-colors"
            >
              <span className="text-sm">{activity.text}</span>
              <span className="text-xs text-muted-foreground">{activity.time}</span>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
