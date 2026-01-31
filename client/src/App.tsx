import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import DocumentForge from "@/pages/DocumentForge";
import KnowledgeCore from "@/pages/KnowledgeCore";
import InterviewSimulator from "@/pages/InterviewSimulator";
import CodeLab from "@/pages/CodeLab";
import Utilities from "@/pages/Utilities";
import Settings from "@/pages/Settings";
import UserGuide from "@/pages/UserGuide";

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/" />;
  }

  return <Component />;
}

function Router() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Switch>
      {/* If logged in, / goes to Dashboard. If not, Landing */}
      <Route path="/">
        {user ? <Dashboard /> : <Landing />}
      </Route>

      {/* Protected Routes */}
      <Route path="/documents">
        <ProtectedRoute component={DocumentForge} />
      </Route>
      <Route path="/knowledge">
        <ProtectedRoute component={KnowledgeCore} />
      </Route>
      <Route path="/interview">
        <ProtectedRoute component={InterviewSimulator} />
      </Route>
      <Route path="/code">
        <ProtectedRoute component={CodeLab} />
      </Route>
      <Route path="/utilities">
        <ProtectedRoute component={Utilities} />
      </Route>
      <Route path="/guide">
        <ProtectedRoute component={UserGuide} />
      </Route>
      <Route path="/settings">
        <ProtectedRoute component={Settings} />
      </Route>

      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
