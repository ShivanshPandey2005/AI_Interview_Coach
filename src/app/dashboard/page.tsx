"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Trophy, 
  MessageSquare, 
  TrendingUp, 
  TrendingDown, 
  Award, 
  ChevronRight, 
  Play, 
  FileText,
  Loader2,
  AlertCircle
} from "lucide-react";
import DashboardShell from "@/components/DashboardShell";
import { useToast } from "@/components/ToastContext";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

interface Stats {
  totalInterviews: number;
  avgScore: number;
  bestScore: number;
  improvement: number;
}

interface RecentInterview {
  id: string;
  role: string;
  difficulty: string;
  type: string;
  overallScore: number;
  createdAt: string;
}

interface ChartCoord {
  date: string;
  score: number;
  role: string;
}

export default function DashboardPage() {
  const { toast } = useToast();
  
  const [stats, setStats] = useState<Stats | null>(null);
  const [recent, setRecent] = useState<RecentInterview[]>([]);
  const [chartData, setChartData] = useState<ChartCoord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchDashboardData = async () => {
      try {
        const res = await fetch("/api/dashboard");
        if (!res.ok) {
          throw new Error("Failed to load dashboard data");
        }
        const data = await res.json();
        setStats(data.stats);
        setRecent(data.recent);
        setChartData(data.chartData);
      } catch (err) {
        console.error(err);
        toast("Could not load dashboard data. Please try again.", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [toast]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400 border-emerald-950 bg-emerald-950/20";
    if (score >= 60) return "text-amber-400 border-amber-950 bg-amber-950/20";
    return "text-rose-400 border-rose-950 bg-rose-950/20";
  };

  // Recharts Custom Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass-panel p-3.5 rounded-xl border border-slate-800 text-xs shadow-2xl space-y-1">
          <p className="font-semibold text-slate-300">{data.date}</p>
          <p className="text-purple-400 font-medium">Role: {data.role}</p>
          <p className="text-indigo-400 font-bold text-sm">Score: {data.score}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <DashboardShell>
      {/* Upper CTA Banner */}
      <div className="glass-panel relative rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full filter blur-3xl pointer-events-none" />
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight font-sans bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
            Ready to ace your next big interview?
          </h2>
          <p className="text-slate-400 max-w-2xl text-sm">
            Launch a mock interview tailored to your role. Get instant multidimensional scores across technical accuracy, communication, and confidence.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/interview"
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-purple-500/10 active:scale-95 transition-all text-sm cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            Start Mock Interview
          </Link>
          <Link
            href="/resume"
            className="flex items-center gap-2 px-5 py-3 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-slate-100 font-semibold rounded-xl active:scale-95 transition-all text-sm cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            Upload Resume
          </Link>
        </div>
      </div>

      {/* Statistics Section Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          // Skeletons
          Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="glass-card p-6 rounded-2xl border border-slate-900 h-28 flex flex-col justify-between animate-pulse">
              <div className="flex items-center justify-between">
                <div className="w-20 h-3.5 bg-slate-800 rounded-full" />
                <div className="w-8 h-8 bg-slate-800 rounded-lg" />
              </div>
              <div className="w-12 h-6 bg-slate-800 rounded-full mt-2" />
            </div>
          ))
        ) : stats ? (
          <>
            {/* Card 1: Total Interviews */}
            <div className="glass-card p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                  Total Mock Runs
                </span>
                <div className="p-2.5 bg-purple-500/10 rounded-xl border border-purple-500/20 text-purple-400">
                  <MessageSquare className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold tracking-tight">{stats.totalInterviews}</span>
                <span className="text-xs text-slate-500">sessions completed</span>
              </div>
            </div>

            {/* Card 2: Average Score */}
            <div className="glass-card p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                  Average Score
                </span>
                <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-400">
                  <Award className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold tracking-tight">{stats.avgScore}%</span>
                <span className="text-xs text-slate-500">aggregate rating</span>
              </div>
            </div>

            {/* Card 3: Best Score */}
            <div className="glass-card p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                  Personal Best
                </span>
                <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400">
                  <Trophy className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold tracking-tight">{stats.bestScore}%</span>
                <span className="text-xs text-slate-500">peak score reached</span>
              </div>
            </div>

            {/* Card 4: Improvement */}
            <div className="glass-card p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                  Performance Drift
                </span>
                <div className={`p-2.5 rounded-xl border ${
                  stats.improvement >= 0 
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                    : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                }`}>
                  {stats.improvement >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className={`text-3xl font-extrabold tracking-tight ${
                  stats.improvement >= 0 ? "text-emerald-400" : "text-rose-400"
                }`}>
                  {stats.improvement >= 0 ? "+" : ""}{stats.improvement}%
                </span>
                <span className="text-xs text-slate-500">compared to first run</span>
              </div>
            </div>
          </>
        ) : (
          <div className="col-span-4 flex items-center justify-center p-6 text-slate-500 text-sm">
            <AlertCircle className="w-5 h-5 mr-2" /> Error loading statistics
          </div>
        )}
      </div>

      {/* Main Grid: Graph + Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Chart Section (Col Span 2) */}
        <div className="glass-panel p-6 rounded-3xl shadow-md lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-200">Performance Progress Tracker</h3>
              <p className="text-xs text-slate-400">Chronological analysis of your overall interview ratings.</p>
            </div>
          </div>

          {/* Glowing area line chart */}
          <div className="h-72 w-full pt-4">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
              </div>
            ) : chartData.length > 0 && mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#9333ea" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    stroke="#475569" 
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="#475569" 
                    fontSize={10} 
                    domain={[0, 100]}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#a855f7"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorScore)"
                    activeDot={{ r: 6, stroke: "#1e1b4b", strokeWidth: 2, fill: "#c084fc" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 border border-dashed border-slate-900 rounded-2xl p-6">
                <AlertCircle className="w-10 h-10 text-slate-700 mb-2 animate-bounce" />
                <p className="text-sm font-semibold">No performance data yet</p>
                <p className="text-xs text-slate-600 mt-1">Complete your first mock interview to unlock tracking charts!</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Recent Sessions */}
        <div className="glass-panel p-6 rounded-3xl shadow-md flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-200 font-sans">Recent Mock Sessions</h3>
            <p className="text-xs text-slate-400">Quick links to review past evaluation reports.</p>
          </div>

          <div className="flex-1 overflow-y-auto max-h-72 mt-2 pr-1 space-y-3">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="h-16 rounded-xl bg-slate-900/40 border border-slate-900 animate-pulse" />
              ))
            ) : recent.length > 0 ? (
              recent.map((i) => (
                <div 
                  key={i.id}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/20 border border-slate-900 hover:border-slate-800 hover:bg-slate-900/40 transition-all group"
                >
                  <div className="space-y-1 truncate pr-2">
                    <h4 className="text-xs font-bold text-slate-200 truncate">{i.role}</h4>
                    <p className="text-[10px] font-semibold text-slate-400">
                      {i.type} • <span className="text-slate-500">{i.createdAt}</span>
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {/* Score badge */}
                    <span className={`text-xs font-bold px-2.5 py-1.5 rounded-xl border ${getScoreColor(i.overallScore)}`}>
                      {i.overallScore}%
                    </span>
                    
                    {/* Arrow redirect */}
                    <Link
                      href={`/interview/${i.id}`}
                      className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                      title="View Report"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-600 text-center py-10">
                <MessageSquare className="w-8 h-8 text-slate-700 mb-2" />
                <p className="text-xs font-bold">No sessions completed yet</p>
              </div>
            )}
          </div>

          <Link
            href="/history"
            className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-slate-200 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
          >
            Browse History Logs
          </Link>
        </div>
      </div>
    </DashboardShell>
  );
}
