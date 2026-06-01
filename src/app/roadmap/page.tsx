"use client";

import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  Map, 
  Loader2, 
  CheckCircle2, 
  AlertTriangle,
  Zap,
  ListTodo,
  ChevronDown,
  ChevronUp,
  BookmarkCheck,
  TrendingUp
} from "lucide-react";
import DashboardShell from "@/components/DashboardShell";
import { useToast } from "@/components/ToastContext";

interface MissingSkill {
  skillName: string;
  priority: "High" | "Medium" | "Low";
  description: string;
}

interface WeekRoadmap {
  weekNumber: number;
  weekTitle: string;
  description: string;
  tasks: string[];
  suggestedTopics: string[];
}

interface RoadmapData {
  _id?: string;
  role: string;
  missingSkills: MissingSkill[];
  weeklyRoadmap: WeekRoadmap[];
  createdAt: string;
}

export default function RoadmapPage() {
  const { toast } = useToast();

  const [roadmap, setRoadmap] = useState<RoadmapData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPrev, setIsLoadingPrev] = useState(true);
  const [expandedWeek, setExpandedWeek] = useState<number | null>(1); // Default first week expanded
  
  // Track completed tasks statefully to give interactive feedback
  const [completedTasks, setCompletedTasks] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    // Load previously analyzed roadmap on mount
    const fetchPreviousRoadmap = async () => {
      try {
        const res = await fetch("/api/roadmap");
        const data = await res.json();
        if (data.roadmap) {
          setRoadmap(data.roadmap);
        }
      } catch (e) {
        console.error("Could not fetch cached roadmap:", e);
      } finally {
        setIsLoadingPrev(false);
      }
    };
    fetchPreviousRoadmap();
  }, []);

  const handleGenerateRoadmap = async () => {
    setIsLoading(true);
    toast("Aggregating resume missing keywords & mock weaknesses. Compiling 4-week training path...", "info");

    try {
      const res = await fetch("/api/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });

      const data = await res.json();

      if (!res.ok) {
        toast(data.error || "Roadmap generation failed", "error");
      } else {
        setRoadmap(data.roadmap);
        setCompletedTasks({});
        setExpandedWeek(1);
        toast("Your week-by-week learning roadmap is compiled!", "success");
      }
    } catch (err) {
      console.error(err);
      toast("A connection error occurred. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleWeek = (num: number) => {
    setExpandedWeek(expandedWeek === num ? null : num);
  };

  const toggleTask = (weekNum: number, taskIdx: number) => {
    const key = `${weekNum}-${taskIdx}`;
    setCompletedTasks((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      // Pop up progress toasts on increments!
      if (next[key]) {
        toast("Task completed! Keep accelerating.", "success");
      }
      return next;
    });
  };

  const getPriorityColor = (priority: "High" | "Medium" | "Low") => {
    if (priority === "High") return "text-rose-400 border-rose-950 bg-rose-950/20";
    if (priority === "Medium") return "text-amber-400 border-amber-950 bg-amber-950/20";
    return "text-indigo-400 border-indigo-950 bg-indigo-950/20";
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Title Pane */}
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-slate-100">Skill Gap Analyzer</h2>
          <p className="text-slate-400 text-xs">
            Review aggregated resume missing keywords and mock interview weaknesses compiled into a custom chronological learning roadmap.
          </p>
        </div>

        {/* 1. EMPTY TRIGGER VIEW */}
        {!roadmap && !isLoadingPrev && !isLoading && (
          <div className="max-w-xl mx-auto space-y-6 animate-slide-in text-center py-12">
            <div className="glass-panel p-8 rounded-3xl relative overflow-hidden shadow-2xl space-y-6">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
              
              <div className="p-4 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 inline-flex shadow-inner">
                <Map className="w-8 h-8 animate-pulse text-purple-400" />
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-200">Generate Your Weekly Learning Roadmap</h3>
                <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
                  Our system aggregates missing skills from your latest <span className="font-semibold text-slate-300">Resume Audit</span> and weakness feedback from your <span className="font-semibold text-slate-300">Mock Interview</span> transcripts to generate a targeted training path.
                </p>
              </div>

              <button
                onClick={handleGenerateRoadmap}
                className="w-full flex items-center justify-center gap-2 p-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg active:scale-95 cursor-pointer text-sm"
              >
                <Sparkles className="w-4 h-4" />
                Audit Gaps & Compile Roadmap
              </button>
            </div>
          </div>
        )}

        {/* LOADING STATE VIEW */}
        {isLoading && (
          <div className="max-w-md mx-auto py-16 text-center space-y-6 animate-pulse">
            <div className="inline-flex p-4 rounded-3xl bg-purple-500/10 border border-purple-500/20 text-purple-400 mb-2">
              <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
            </div>
            <h3 className="text-xl font-bold tracking-wide text-slate-200">Compiling Personal Roadmap</h3>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm mx-auto">
              Aggregating missing resume skills and mock weaknesses, prioritizing competencies, and creating a customized week-by-week checklist. This will only take a moment...
            </p>
          </div>
        )}

        {/* 2. TIMELINE ROADMAP VIEW */}
        {roadmap && !isLoading && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-in">
            {/* Left Column: Missing Skills Scoreboard (col span 1) */}
            <div className="glass-panel p-6 rounded-3xl shadow-xl space-y-5 h-fit">
              <div className="space-y-1 border-b border-slate-900 pb-3">
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Missing Competencies</h3>
                <p className="text-[10px] text-slate-500">Skills categorized by target role priority blockers.</p>
              </div>

              <div className="space-y-4">
                {roadmap.missingSkills.map((sk, idx) => (
                  <div 
                    key={idx}
                    className="p-3.5 rounded-2xl bg-slate-900/20 border border-slate-900 flex flex-col gap-2 relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-200 truncate">{sk.skillName}</h4>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-lg border ${getPriorityColor(sk.priority)}`}>
                        {sk.priority}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed">{sk.description}</p>
                  </div>
                ))}
              </div>

              {/* Reset Re-generate button */}
              <button
                onClick={handleGenerateRoadmap}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-slate-200 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Re-Audit Gaps & Compile
              </button>
            </div>

            {/* Right Column: Weekly Timeline Accordion (col span 2) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="space-y-1 border-b border-slate-900 pb-2">
                <h3 className="text-base font-bold text-slate-200">Chronological Weekly Roadmap</h3>
                <p className="text-xs text-slate-400">Master prioritized competencies sequentially. Mark checkbox items when completed.</p>
              </div>

              <div className="space-y-3">
                {roadmap.weeklyRoadmap.map((wk) => {
                  const isExpanded = expandedWeek === wk.weekNumber;
                  
                  // Compute completed percentage for this week
                  const weekTasksCount = wk.tasks.length;
                  const completedCount = wk.tasks.filter((_, idx) => completedTasks[`${wk.weekNumber}-${idx}`]).length;
                  const weekPercent = weekTasksCount > 0 ? Math.round((completedCount / weekTasksCount) * 100) : 0;

                  return (
                    <div 
                      key={wk.weekNumber}
                      className={`glass-panel rounded-2xl overflow-hidden shadow border transition-all duration-300 ${
                        isExpanded ? "border-purple-500/30 ring-1 ring-purple-500/20" : "border-slate-900"
                      }`}
                    >
                      {/* Timeline Accordion Header */}
                      <button
                        onClick={() => toggleWeek(wk.weekNumber)}
                        className="w-full flex items-center justify-between p-5 text-left bg-slate-950/20 cursor-pointer"
                      >
                        <div className="flex-1 pr-4">
                          <span className="text-[10px] font-bold text-purple-400 tracking-wider block mb-1">
                            WEEK {wk.weekNumber}
                          </span>
                          <h4 className="text-sm font-semibold text-slate-200 leading-relaxed truncate">
                            {wk.weekTitle}
                          </h4>
                          {/* Inner tiny progress info */}
                          <div className="flex items-center gap-2 mt-1">
                            <div className="w-16 h-1 bg-slate-900 rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-500 transition-all" style={{ width: `${weekPercent}%` }} />
                            </div>
                            <span className="text-[9px] font-medium text-slate-500">{weekPercent}% completed</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 flex-shrink-0">
                          {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                        </div>
                      </button>

                      {/* Timeline Collapsible Panel Content */}
                      {isExpanded && (
                        <div className="p-5 border-t border-slate-900 bg-slate-950/40 space-y-5 animate-slide-in">
                          {/* Narrative focus */}
                          <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/10 border border-slate-900/40 p-4 rounded-xl">
                            <span className="font-semibold text-purple-400 block mb-1 text-[10px] tracking-widest uppercase">WEEKLY TARGET FOCUS</span>
                            {wk.description}
                          </p>

                          {/* Checklist Todo cards */}
                          <div className="space-y-2.5">
                            <div className="flex items-center gap-1.5 px-1">
                              <ListTodo className="w-4 h-4 text-purple-400" />
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Practical Checklist Tasks</span>
                            </div>

                            <div className="space-y-2">
                              {wk.tasks.map((tsk, idx) => {
                                const key = `${wk.weekNumber}-${idx}`;
                                const isChecked = !!completedTasks[key];

                                return (
                                  <div 
                                    key={idx}
                                    onClick={() => toggleTask(wk.weekNumber, idx)}
                                    className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer select-none
                                      ${isChecked 
                                        ? "bg-emerald-950/10 border-emerald-950/40 text-slate-400" 
                                        : "bg-slate-900/20 border-slate-900 text-slate-200 hover:border-slate-800 hover:bg-slate-900/40"
                                      }
                                    `}
                                  >
                                    <div className="mt-0.5 flex-shrink-0">
                                      <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={() => {}} // Handled by div onClick
                                        className="h-4 w-4 rounded border-slate-800 text-emerald-500 focus:ring-emerald-600 focus:ring-offset-slate-950 bg-slate-950 cursor-pointer"
                                      />
                                    </div>
                                    <p className={`text-xs leading-tight ${isChecked ? "line-through text-slate-500" : ""}`}>
                                      {tsk}
                                    </p>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Recommended Study Topics */}
                          <div className="space-y-2 pt-2 border-t border-slate-900">
                            <div className="flex items-center gap-1.5 px-1">
                              <BookmarkCheck className="w-4 h-4 text-indigo-400" />
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Key Study Concepts</span>
                            </div>
                            
                            <div className="flex flex-wrap gap-2">
                              {wk.suggestedTopics.map((top, idx) => (
                                <span 
                                  key={idx}
                                  className="text-[10px] font-bold px-3 py-1 bg-indigo-950/20 border border-indigo-950/40 text-indigo-300 rounded-full shadow-inner"
                                >
                                  {top}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
