import { Sidebar } from "@/components/Sidebar";
import { ApplicationTracker } from "@/components/ApplicationTracker";

export default function Utilities() {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 overflow-y-auto">
        <header className="mb-8">
          <h2 className="text-3xl font-bold font-['Orbitron'] mb-2 text-purple-400">Application Tracker</h2>
          <p className="text-muted-foreground">Manage your job applications and track your progress.</p>
        </header>

        <ApplicationTracker />
      </main>
    </div>
  );
}
