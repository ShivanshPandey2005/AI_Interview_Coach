"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  History, 
  ChevronRight, 
  MessageSquare, 
  Loader2, 
  AlertCircle,
  Play
} from "lucide-react";
import DashboardShell from "@/components/DashboardShell";
import { useToast } from "@/components/ToastContext";

interface PastInterview {
  id: string;
  role: string;
  difficulty: string;
  type: string;
  overallScore: number;
  feedbackSummary: string;
  createdAt: string;
}

export default function HistoryPage() {
  const { toast } = useToast();
  
  const [interviews, setInterviews] = useState<PastInterview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("/api/interview");
        if (!res.ok) {
          throw new Error("Failed to load interview history logs");
        }
        const data = await res.json();
        setInterviews(data.interviews);
      } catch (err) {
        console.error(err);
        toast("Could not load your interview logs.", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [toast]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400 border-emerald-950 bg-emerald-950/20";
    if (score >= 60) return "text-amber-400 border-amber-950 bg-amber-950/20";
    return "text-rose-400 border-rose-950 bg-rose-950/20";
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header Title */}
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-slate-100">Past Interview Attempts</h2>
          <p className="text-slate-400 text-xs">
            Review detailed graded reports and growth summaries from all of your completed mock sessions.
          </p>
        </div>

        {/* 1. HISTORY CONTENT BODY */}
        <div className="space-y-4">
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 4 }).map((_, idx) => (
              <div 
                key={idx}
                className="h-20 rounded-2xl bg-slate-900/40 border border-slate-900 animate-pulse"
              />
            ))
          ) : interviews.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 animate-slide-in">
              {interviews.map((i) => (
                <div 
                  key={i.id}
                  className="glass-panel p-5 rounded-3xl border border-slate-900 hover:border-slate-800 hover:bg-slate-900/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow group relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/10 to-transparent" />
                  
                  {/* Left: Role metadata */}
                  <div className="space-y-1 truncate pr-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-extrabold text-slate-200 truncate">{i.role}</h3>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 uppercase tracking-wider">
                        {i.difficulty}
                      </span>
                    </div>
                    <p className="text-[10px] font-semibold text-slate-400">
                      {i.type} Category • <span className="text-slate-500">Conducted on {i.createdAt}</span>
                    </p>
                    <p className="text-[11px] text-slate-500 leading-normal truncate mt-2">
                      {i.feedbackSummary}
                    </p>
                  </div>

                  {/* Right: Scores & links */}
                  <div className="flex items-center justify-between md:justify-end gap-4 border-t border-slate-900 md:border-t-0 pt-3.5 md:pt-0">
                    <span className="text-slate-500 text-[10px] font-medium block md:hidden">Overall Rating</span>
                    
                    <div className="flex items-center gap-3">
                      {/* Overall score badge */}
                      <span className={`text-xs font-bold px-3 py-1.5 rounded-xl border ${getScoreColor(i.overallScore)}`}>
                        {i.overallScore}% Overall
                      </span>
                      
                      {/* Redirect button */}
                      <Link
                        href={`/interview/${i.id}`}
                        className="flex items-center gap-1.5 px-4 py-2 bg-purple-600/10 border border-purple-500/20 hover:bg-purple-500/20 text-purple-400 hover:text-purple-300 text-xs font-semibold rounded-xl active:scale-95 transition-all cursor-pointer"
                        title="View Evaluation Report"
                      >
                        Review Report
                        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Empty State
            <div className="max-w-md mx-auto py-16 text-center space-y-6 animate-slide-in">
              <div className="p-4 rounded-full bg-slate-900/40 border border-slate-900 text-slate-600 inline-flex shadow-inner">
                <History className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-200">No mock attempts found</h3>
                <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
                  You haven&apos;t conducted any AI mock interviews yet. Launch your first session to grade your skills across communication, technical correctness, and logic!
                </p>
              </div>
              <Link
                href="/interview"
                className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl active:scale-95 transition-all text-xs shadow-lg cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                Start Your First Mock
              </Link>
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
