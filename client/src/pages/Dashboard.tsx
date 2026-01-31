import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { useStats, useEvents } from "@/hooks/use-resources";
import { useRecentActivities } from "@/hooks/use-resources";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Calendar, Trophy, Target, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { CalendarModal } from "@/components/CalendarModal";

export default function Dashboard() {
  const { data: stats, isLoading } = useStats();
  const { data: events = [] } = useEvents();
  const [calendarOpen, setCalendarOpen] = useState(false);

  // Get next upcoming event
  const nextEvent = events
    .filter(event => {
      const eventDate = event.date?.toDate ? event.date.toDate() : new Date(event.date);
      return eventDate > new Date();
    })
    .sort((a, b) => {
      const dateA = a.date?.toDate ? a.date.toDate() : new Date(a.date);
      const dateB = b.date?.toDate ? b.date.toDate() : new Date(b.date);
      return dateA.getTime() - dateB.getTime();
    })[0];

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
                <div className="text-4xl font-bold text-cyan-400 mb-4">{stats?.placementProbability || 0}%</div>
                <Progress value={stats?.placementProbability || 0} className="h-2 bg-white/10" indicatorClassName="bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />
                <p className="text-xs text-muted-foreground mt-4">
                  Based on your activity and progress
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
                <div className="text-4xl font-bold text-magenta-400 mb-4">
                  {stats?.streak || 0} {stats?.streak === 1 ? 'Day' : 'Days'}
                </div>
                <div className="flex gap-1 h-8 items-end">
                  {[40, 70, 50, 90, 60, 80, 100].map((h, i) => (
                    <div key={i} className="flex-1 bg-white/10 hover:bg-magenta-400/50 transition-colors rounded-sm" style={{ height: `${h}%` }} />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  Keep it up! Consistency is key to success.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Next Event */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="glass-card h-full relative overflow-hidden group cursor-pointer" onClick={() => setCalendarOpen(true)}>
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Next Event</CardTitle>
                <Calendar className="h-4 w-4 text-yellow-400" />
              </CardHeader>
              <CardContent>
                {nextEvent ? (
                  <>
                    <div className="text-2xl font-bold text-yellow-400 mb-2">{nextEvent.title}</div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(nextEvent.date?.toDate ? nextEvent.date.toDate() : nextEvent.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </>
                ) : (
                  <>
                    <div className="text-2xl font-bold text-yellow-400 mb-2">No Events</div>
                    <p className="text-sm text-muted-foreground">Click to add an event</p>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent Activity Section */}
        <RecentActivitySection />

        {/* Calendar Modal */}
        <CalendarModal open={calendarOpen} onOpenChange={setCalendarOpen} />
      </main>
    </div>
  );
}

// Recent Activity Component
function RecentActivitySection() {
  const { data: activities = [] } = useRecentActivities(5);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'application': return '📝';
      case 'interview': return '💬';
      case 'email': return '✉️';
      case 'flashcard': return '🧠';
      case 'code_lab': return '💻';
      case 'roadmap': return '🗺️';
      default: return '📌';
    }
  };

  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-cyan-400" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activities.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p>No recent activity. Start using the app to see your progress here!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="text-2xl">{getActivityIcon(activity.type)}</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{formatTimestamp(activity.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
