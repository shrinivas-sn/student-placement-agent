import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  FileText,
  BookOpen,
  MessageSquare,
  Code,
  Briefcase,
  LogOut,
  User,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Sidebar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { label: "Dashboard", href: "/", icon: LayoutDashboard, color: "text-cyan-400" },
    { label: "Document Forge", href: "/documents", icon: FileText, color: "text-magenta-400" },
    { label: "Knowledge Core", href: "/knowledge", icon: BookOpen, color: "text-lime-400" },
    { label: "Interview Sim", href: "/interview", icon: MessageSquare, color: "text-purple-400" },
    { label: "Code Lab", href: "/code", icon: Code, color: "text-orange-400" },
    { label: "Utilities", href: "/utilities", icon: Briefcase, color: "text-blue-400" },
    { label: "User Guide", href: "/guide", icon: User, color: "text-green-400" },
  ];

  return (
    <aside className="hidden md:flex fixed left-0 top-0 h-screen w-64 bg-card/50 backdrop-blur-xl border-r border-white/5 flex-col z-50">
      <div className="p-6">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-magenta-500 font-['Orbitron']">
          PlacementOS
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer group",
                  isActive
                    ? "bg-white/10 text-white shadow-lg shadow-black/10 border border-white/10"
                    : "text-muted-foreground hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", item.color)} />
                <span className="font-medium">{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]" />
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5 bg-black/20">
        <div className="flex items-center gap-3 mb-4 px-2">
          <Avatar className="h-10 w-10 border-2 border-primary/20">
            <AvatarImage src={user?.profileImageUrl} />
            <AvatarFallback className="bg-primary/10 text-primary font-bold">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate text-white">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.email}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Link href="/settings" className="flex-1">
            <button className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-xs font-medium text-muted-foreground hover:text-white">
              <Settings className="w-4 h-4" />
              Settings
            </button>
          </Link>
          <button
            onClick={() => logout()}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-colors text-xs font-medium text-red-400 hover:text-red-300"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}
