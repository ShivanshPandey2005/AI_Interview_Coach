"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Sun, Moon, Database, HelpCircle, ShieldCheck } from "lucide-react";
import { useTheme } from "./ThemeContext";

export default function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [dbStatus, setDbStatus] = useState<"live" | "mock">("mock");

  useEffect(() => {
    // Quick probe to discover if the backend is connected to live MongoDB
    // By checking if an env marker is present or fetching from a light probe
    const checkDb = async () => {
      try {
        const res = await fetch("/api/dashboard");
        const data = await res.json();
        if (data.dbMode === "live") {
          setDbStatus("live");
        } else {
          setDbStatus("mock");
        }
      } catch (e) {
        setDbStatus("mock");
      }
    };
    checkDb();
  }, [pathname]);

  const getBreadcrumbs = () => {
    if (pathname === "/dashboard") return "Dashboard Overview";
    if (pathname === "/interview") return "AI Mock Interview";
    if (pathname.startsWith("/interview/")) return "Interview Evaluation Report";
    if (pathname === "/resume") return "PDF Resume Analyzer";
    if (pathname === "/roadmap") return "Skill Gap & Weekly Roadmap";
    if (pathname === "/case-study") return "Product Case Study Portfolio";
    if (pathname === "/history") return "Past Interview Attempts";
    return "PlacementGPT";
  };

  return (
    <header className="h-16 border-b border-slate-900 bg-slate-950/20 backdrop-blur-md sticky top-0 z-30 w-full flex items-center justify-between px-6">
      {/* Breadcrumb path indicator */}
      <div className="flex items-center gap-2">
        <span className="text-slate-500 text-xs hidden md:inline">PlacementGPT</span>
        <span className="text-slate-600 text-xs hidden md:inline">/</span>
        <h1 className="text-sm font-semibold text-slate-100 tracking-wide">
          {getBreadcrumbs()}
        </h1>
      </div>

      {/* Action triggers */}
      <div className="flex items-center gap-4">
        {/* Database Status indicator */}
        <div className="flex items-center">
          {dbStatus === "live" ? (
            <div className="flex items-center gap-1.5 py-1 px-3.5 rounded-full border border-emerald-950 bg-emerald-950/30 text-emerald-400 text-xs font-semibold shadow-inner">
              <Database className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
              <span className="hidden sm:inline">MongoDB Connected</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 py-1 px-3.5 rounded-full border border-amber-950 bg-amber-950/30 text-amber-400 text-xs font-semibold shadow-inner" title="No live MONGODB_URI. Operating on temporary mock memory.">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Sandbox Fallback</span>
            </div>
          )}
        </div>

        {/* Theme Toggle button */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-slate-100 hover:bg-slate-800 transition-all shadow-md active:scale-95 cursor-pointer"
          title="Toggle Theme"
        >
          {theme === "light" ? (
            <Moon className="w-4 h-4 text-purple-400" />
          ) : (
            <Sun className="w-4 h-4 text-amber-400" />
          )}
        </button>
      </div>
    </header>
  );
}
