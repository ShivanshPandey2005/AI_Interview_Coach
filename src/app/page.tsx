"use client";

import React from "react";
import Link from "next/link";
import { 
  Sparkles, 
  MessageSquare, 
  FileText, 
  Map, 
  BookOpen, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";

export default function LandingPage() {
  const features = [
    {
      title: "AI Mock Interviews",
      description: "Customize target roles and undergo dynamic mock sessions graded across communication, technical correctness, and confidence.",
      icon: MessageSquare,
      color: "text-purple-400 border-purple-500/20 bg-purple-500/5",
    },
    {
      title: "PDF Resume Scans",
      description: "Audit your PDF resume against global ATS guidelines. Reveal layout friction, matched keywords, and improvement guidelines.",
      icon: FileText,
      color: "text-indigo-400 border-indigo-500/20 bg-indigo-500/5",
    },
    {
      title: "Skill Gap Roadmap",
      description: "Aggregate resume missing competencies and interview weaknesses into a structured chronological weekly learning checklist.",
      icon: Map,
      color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
    },
    {
      title: "PM Portfolio Case Study",
      description: "Browse an elite Product Manager portfolio case study detailing the strategy, market research, RICE priority, and KPIs behind the app.",
      icon: BookOpen,
      color: "text-amber-400 border-amber-500/20 bg-amber-500/5",
    },
  ];

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col justify-between overflow-hidden">
      {/* Background mesh lighting */}
      <div className="glowing-blob bg-purple-600 w-[500px] h-[500px] -top-40 -left-40 animate-pulse-slow opacity-10" />
      <div className="glowing-blob bg-indigo-600 w-[450px] h-[450px] -bottom-40 -right-40 animate-pulse-slow opacity-10" />

      {/* Navbar header */}
      <header className="h-20 max-w-6xl w-full mx-auto px-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-purple-400" />
          <span className="text-lg font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent tracking-wide">
            PlacementGPT
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/case-study"
            className="text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
          >
            Case Study
          </Link>
          <Link
            href="/login"
            className="px-4 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-slate-100 text-xs font-bold rounded-xl active:scale-95 transition-all shadow-md cursor-pointer"
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* Hero section core */}
      <main className="max-w-6xl w-full mx-auto px-6 py-12 md:py-20 flex flex-col items-center text-center space-y-12 z-10 relative">
        <div className="space-y-6 max-w-3xl">
          {/* Top banner tag */}
          <div className="inline-flex items-center gap-2 py-1.5 px-4 bg-purple-500/10 border border-purple-500/20 rounded-full text-[10px] font-bold text-purple-400 uppercase tracking-widest mx-auto shadow-inner animate-pulse-slow">
            <Sparkles className="w-3.5 h-3.5" />
            Next-Gen AI Interview Coaching Engine
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight bg-gradient-to-b from-slate-100 via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Ace your dream tech placement with Gemini AI
          </h1>
          
          <p className="text-sm md:text-base text-slate-400 leading-relaxed max-w-2xl mx-auto font-medium">
            PlacementGPT is a master sandbox helping job seekers practice real-time mock interviews, audit PDF resume formats against ATS scrapers, and build personalized weekly learning roadmaps.
          </p>
        </div>

        {/* CTA triggers */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg hover:shadow-purple-500/20 active:scale-95 transition-all text-sm cursor-pointer"
          >
            Launch Free Dashboard
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/case-study"
            className="px-6 py-3.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-slate-100 font-bold rounded-xl active:scale-95 transition-all text-sm cursor-pointer"
          >
            Read PM Portfolio Case Study
          </Link>
        </div>

        {/* Features Grid layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full pt-8">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div 
                key={idx}
                className="glass-card p-6 rounded-3xl text-left border flex flex-col justify-between h-64 shadow-md relative"
              >
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/10 to-transparent" />
                
                <div className={`p-3 rounded-2xl border inline-flex ${feat.color} mb-4`}>
                  <Icon className="w-5 h-5" />
                </div>
                
                <div className="space-y-1 mt-2">
                  <h3 className="text-sm font-extrabold tracking-wide text-slate-200">{feat.title}</h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                    {feat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer bar */}
      <footer className="h-20 border-t border-slate-900 bg-slate-950/20 flex items-center justify-center text-[10px] text-slate-500 font-medium z-10 w-full">
        PlacementGPT © 2026. Made with Google Gemini AI. Open sandbox license.
      </footer>
    </div>
  );
}
