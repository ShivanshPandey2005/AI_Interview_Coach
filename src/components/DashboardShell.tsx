"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Loader2 } from "lucide-react";

interface DashboardShellProps {
  children: React.ReactNode;
}

export default function DashboardShell({ children }: DashboardShellProps) {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/auth/me");
        if (!response.ok) {
          // If unauthorized, redirect to login page
          router.push("/login");
          return;
        }
        
        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        console.error("Error fetching session:", error);
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-200">
        <Loader2 className="w-10 h-10 animate-spin text-purple-500 mb-4" />
        <p className="text-sm font-semibold tracking-widest uppercase text-slate-500 animate-pulse">
          Establishing Secure Session...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-950 text-slate-100 font-sans">
      {/* Background glowing blob lights */}
      <div className="glowing-blob bg-purple-900/10 w-[500px] h-[500px] top-10 left-10" />
      <div className="glowing-blob bg-indigo-900/10 w-[450px] h-[450px] bottom-10 right-10" />

      {/* Shared Collapsible Sidebar */}
      <Sidebar user={user} />

      {/* Main Screen Content View */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto max-h-screen">
        {/* Shared Breadcrumb Topbar with Theme Controller */}
        <Navbar />
        
        {/* Child Page Content Body */}
        <main className="flex-1 p-6 relative z-10">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
