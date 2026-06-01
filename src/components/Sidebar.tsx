"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Sparkles, 
  LayoutDashboard, 
  MessageSquare, 
  FileText, 
  Map, 
  BookOpen, 
  History, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  Menu,
  X
} from "lucide-react";
import { useToast } from "./ToastContext";

interface SidebarProps {
  user: { name: string; email: string } | null;
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Mock Interview", href: "/interview", icon: MessageSquare },
    { name: "Resume Analyzer", href: "/resume", icon: FileText },
    { name: "Skill Gap Analyzer", href: "/roadmap", icon: Map },
    { name: "Product Case Study", href: "/case-study", icon: BookOpen },
    { name: "Interview History", href: "/history", icon: History },
  ];

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (response.ok) {
        toast("Successfully logged out!", "success");
        router.push("/login");
        router.refresh();
      } else {
        toast("Logout failed", "error");
      }
    } catch (e) {
      toast("Error logging out", "error");
    }
  };

  const activeClass = (href: string) => {
    const isActive = pathname === href || pathname.startsWith(href + "/");
    return isActive
      ? "bg-purple-600/10 border-l-4 border-purple-500 text-purple-400 font-semibold"
      : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/40 border-l-4 border-transparent";
  };

  return (
    <>
      {/* Mobile Header Menu Trigger Bar */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-slate-950/80 backdrop-blur-md border-b border-slate-900 sticky top-0 z-40 w-full">
        <Link href="/" className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <span className="font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
            PlacementGPT
          </span>
        </Link>
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 text-slate-400 hover:text-slate-100 transition-colors"
        >
          {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div 
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
        />
      )}

      {/* Sidebar Core Shell */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen bg-slate-950/95 lg:bg-slate-950/40 border-r border-slate-900 backdrop-blur-xl flex flex-col justify-between transition-all duration-300
          ${isCollapsed ? "w-20" : "w-64"}
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div>
          {/* Logo Brand Header */}
          <div className="p-6 flex items-center justify-between border-b border-slate-900">
            <Link 
              href="/dashboard" 
              className={`flex items-center gap-2.5 transition-all ${isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"}`}
            >
              <Sparkles className="w-6 h-6 text-purple-400" />
              <span className="text-lg font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                PlacementGPT
              </span>
            </Link>
            
            {/* Desktop Collapse Trigger */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex items-center justify-center p-1.5 rounded-lg bg-slate-900/60 hover:bg-slate-900 text-slate-400 hover:text-slate-200 transition-all border border-slate-800"
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-3 py-3 px-4 rounded-xl transition-all text-sm group relative ${activeClass(item.href)}`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <span className={`transition-all ${isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"}`}>
                    {item.name}
                  </span>
                  
                  {/* Collapsed Tooltip */}
                  {isCollapsed && (
                    <div className="absolute left-16 scale-0 group-hover:scale-100 bg-slate-900 text-slate-200 text-xs py-1.5 px-3 rounded-lg border border-slate-800 shadow-xl whitespace-nowrap transition-transform duration-200 origin-left pointer-events-none z-50">
                      {item.name}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout bottom pane */}
        <div className="p-4 border-t border-slate-900">
          {!isCollapsed && user && (
            <div className="mb-4 p-3 rounded-2xl bg-slate-900/20 border border-slate-900">
              <p className="text-xs font-semibold text-purple-400">LOGGED IN AS</p>
              <h4 className="text-sm font-semibold truncate text-slate-200 mt-1">{user.name}</h4>
              <p className="text-xs text-slate-500 truncate mt-0.5">{user.email}</p>
            </div>
          )}

          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 py-3 px-4 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/10 border border-transparent hover:border-rose-950/20 transition-all text-sm font-medium cursor-pointer relative group`}
          >
            <LogOut className="w-5 h-5 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
            <span className={`transition-all ${isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"}`}>
              Log Out
            </span>

            {isCollapsed && (
              <div className="absolute left-16 scale-0 group-hover:scale-100 bg-rose-950 text-rose-200 text-xs py-1.5 px-3 rounded-lg border border-rose-900 shadow-xl whitespace-nowrap transition-all origin-left pointer-events-none z-50">
                Log Out
              </div>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
