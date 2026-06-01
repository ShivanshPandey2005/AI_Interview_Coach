"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Sparkles, 
  TrendingUp, 
  Users, 
  Target, 
  Map, 
  Layers, 
  Gauge, 
  BarChart3, 
  Calendar,
  Check,
  ChevronRight,
  ShieldCheck
} from "lucide-react";

export default function CaseStudyPage() {
  const [activeTab, setActiveTab] = useState("discovery");

  const tabs = [
    { id: "discovery", label: "Product Strategy", icon: Target },
    { id: "personas", label: "User Insights", icon: Users },
    { id: "features", label: "MVP & Priority", icon: Layers },
    { id: "kpis", label: "Success & Metrics", icon: Gauge },
    { id: "roadmap", label: "Product Roadmap", icon: Calendar },
  ];

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 font-sans pb-16">
      {/* Background blobs */}
      <div className="glowing-blob bg-purple-900/10 w-[500px] h-[500px] top-10 left-10" />
      <div className="glowing-blob bg-indigo-900/10 w-[450px] h-[450px] bottom-10 right-10" />

      {/* Header Navigation */}
      <nav className="h-16 border-b border-slate-900 bg-slate-950/40 backdrop-blur-md sticky top-0 z-30 w-full flex items-center justify-between px-6 md:px-12">
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition-all text-xs font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Dashboard
          </Link>
        </div>

        <div className="flex items-center gap-2.5">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <span className="text-sm font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
            PlacementGPT Case Study
          </span>
        </div>
      </nav>

      {/* Hero Banner Section */}
      <header className="relative py-12 md:py-16 text-center max-w-4xl mx-auto px-6 space-y-4">
        <span className="inline-block px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-[10px] font-bold text-purple-400 tracking-widest uppercase">
          Product Management Portfolio Project
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight font-sans bg-gradient-to-r from-slate-100 via-slate-200 to-slate-400 bg-clip-text text-transparent">
          PlacementGPT: AI Interview Coach
        </h1>
        <p className="text-sm md:text-base text-slate-400 leading-relaxed max-w-2xl mx-auto">
          An end-to-end product design cycle outlining target user personas, competitive analysis, RICE prioritization frameworks, and weekly roadmaps aimed at accelerating tech placement speeds.
        </p>
      </header>

      {/* Interactive Tabs Menu */}
      <section className="max-w-6xl mx-auto px-6 mb-8">
        <div className="flex flex-wrap items-center justify-center gap-2 border-b border-slate-900 pb-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer
                  ${isSelected 
                    ? "bg-purple-600/20 border border-purple-500/30 text-purple-400" 
                    : "bg-slate-900/40 border border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Main Tabbed Contents */}
      <main className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* TAB 1: PRODUCT STRATEGY (DISCOVERY) */}
        {activeTab === "discovery" && (
          <div className="space-y-8 animate-slide-in">
            {/* Problem vs Vision */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Problem */}
              <div className="glass-panel p-6 rounded-3xl space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-rose-400">The Problem Statement</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Tech candidates face massive stress during mock interview prep. Current solutions like LeetCode offer standard raw code practice, but lack deep conversational feedback. Professional human mock interviews (e.g. Interviewing.io) cost upwards of <span className="font-semibold text-slate-100">$150+ per session</span>, locking out low-income job seekers.
                </p>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-slate-900/40 border border-slate-900 p-3 rounded-2xl">
                    <span className="text-xl font-extrabold text-rose-400 block">82%</span>
                    <span className="text-[10px] text-slate-500">experience interview anxiety</span>
                  </div>
                  <div className="bg-slate-900/40 border border-slate-900 p-3 rounded-2xl">
                    <span className="text-xl font-extrabold text-rose-400 block">48 Hours</span>
                    <span className="text-[10px] text-slate-500">avg. review delay</span>
                  </div>
                </div>
              </div>

              {/* Vision */}
              <div className="glass-panel p-6 rounded-3xl space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-emerald-400">The Product Vision</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Democratize high-end mock interview training by providing an edge-secure, AI-powered coach that operates instantly. By parsing candidate resumes and mock transcript answers, PlacementGPT delivers immediate multidimensional feedback (Communication, Logic, Accuracy) and prioritizes gaps into a custom, actionable weekly Roadmap—all at <span className="font-semibold text-slate-100">0 cost</span>.
                </p>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-slate-900/40 border border-slate-900 p-3 rounded-2xl">
                    <span className="text-xl font-extrabold text-emerald-400 block">Instantly</span>
                    <span className="text-[10px] text-slate-500">Multidimensional score dials</span>
                  </div>
                  <div className="bg-slate-900/40 border border-slate-900 p-3 rounded-2xl">
                    <span className="text-xl font-extrabold text-emerald-400 block">Zero-Cost</span>
                    <span className="text-[10px] text-slate-500">Equal access sandbox</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Market Sizing TAM / SAM / SOM */}
            <div className="glass-panel p-6 rounded-3xl space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-200">Market Sizing (TAM / SAM / SOM)</h3>
              <p className="text-xs text-slate-400">Targeting the massive, growing interview coaching and technical job preparation sector.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-slate-900/20 border border-slate-900 space-y-1">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">TAM (Total Market)</span>
                  <h4 className="text-lg font-bold text-slate-200">$22 Billion</h4>
                  <p className="text-[10px] text-slate-400">Global career placement training & hiring platforms.</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900/20 border border-slate-900 space-y-1">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">SAM (Serviceable Market)</span>
                  <h4 className="text-lg font-bold text-slate-200">$4.5 Billion</h4>
                  <p className="text-[10px] text-slate-400">Software engineering and technology placements globally.</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900/20 border border-slate-900 space-y-1">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">SOM (Target Obtainable)</span>
                  <h4 className="text-lg font-bold text-slate-200">$850 Million</h4>
                  <p className="text-[10px] text-slate-400">AI-driven mock preparations and automated ATS resume reviews.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: USER PERSONAS & JOURNEY */}
        {activeTab === "personas" && (
          <div className="space-y-8 animate-slide-in">
            {/* Personas side by side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Persona 1: Shiva */}
              <div className="glass-panel p-6 rounded-3xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-bold">
                    S
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-200">Shiva, Aspiring Developer</h4>
                    <span className="text-[9px] text-slate-500">22 • Computer Science Senior</span>
                  </div>
                </div>
                
                <div className="space-y-2 text-xs">
                  <p className="text-slate-300 leading-relaxed">
                    <span className="font-semibold text-slate-100">Bio:</span> Shiva is a final-year CS student actively applying to tech companies. He is strong at basic algorithms but gets paralyzed by anxiety when explaining his system design decisions during live mock interviews.
                  </p>
                  <p className="text-slate-400">
                    <span className="font-semibold text-slate-200">Needs:</span> High-fidelity, real-time interactive technical drills with detailed model sample answers.
                  </p>
                  <p className="text-slate-400">
                    <span className="font-semibold text-slate-200">Friction:</span> Lacks the $150 required to pay for human professional feedback sessions.
                  </p>
                </div>
              </div>

              {/* Persona 2: Anya */}
              <div className="glass-panel p-6 rounded-3xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">
                    A
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-200">Anya, Career Transitioner</h4>
                    <span className="text-[9px] text-slate-500">29 • Former Marketing Lead</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <p className="text-slate-300 leading-relaxed">
                    <span className="font-semibold text-slate-100">Bio:</span> Anya completed a coding bootcamp and is switching careers to Product Management. She needs to master behavioral interview methods (STAR framework) and optimize her resume against automated ATS scrapers.
                  </p>
                  <p className="text-slate-400">
                    <span className="font-semibold text-slate-200">Needs:</span> ATS keywords scanning audit and structured, non-code scenarios practice templates.
                  </p>
                  <p className="text-slate-400">
                    <span className="font-semibold text-slate-200">Friction:</span> Standard test apps like LeetCode focus exclusively on raw syntax coding rather than behavioral structuring.
                  </p>
                </div>
              </div>
            </div>

            {/* User Journey Map */}
            <div className="glass-panel p-6 rounded-3xl space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-200">Interactive User Journey Map</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
                <div className="p-3 rounded-2xl bg-slate-900/20 border border-slate-900 space-y-1">
                  <span className="text-[8px] font-bold text-slate-500 block">PHASE 1</span>
                  <h5 className="text-xs font-bold text-slate-200">Discovery</h5>
                  <p className="text-[10px] text-slate-400">Hears about zero-cost AI audits on Reddit/LinkedIn.</p>
                </div>
                
                <div className="p-3 rounded-2xl bg-slate-900/20 border border-slate-900 space-y-1">
                  <span className="text-[8px] font-bold text-slate-500 block">PHASE 2</span>
                  <h5 className="text-xs font-bold text-slate-200">Resume Upload</h5>
                  <p className="text-[10px] text-slate-400">Audits PDF resume, identifies missing skills in 3 seconds.</p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-900/20 border border-slate-900 space-y-1">
                  <span className="text-[8px] font-bold text-slate-500 block">PHASE 3</span>
                  <h5 className="text-xs font-bold text-slate-200">Mock Run</h5>
                  <p className="text-[10px] text-slate-400">Simulates 10 tailored queries, answers one-by-one.</p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-900/20 border border-slate-900 space-y-1">
                  <span className="text-[8px] font-bold text-slate-500 block">PHASE 4</span>
                  <h5 className="text-xs font-bold text-slate-200">Roadmap Build</h5>
                  <p className="text-[10px] text-slate-400">Creates custom weekly timeline to bridge gaps.</p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-900/20 border border-slate-900 space-y-1 border-purple-500/20 bg-purple-950/5">
                  <span className="text-[8px] font-bold text-purple-400 block">PHASE 5</span>
                  <h5 className="text-xs font-bold text-purple-300">Placement</h5>
                  <p className="text-[10px] text-purple-400 font-medium">Builds high confidence, aces hiring, lands job.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: MVP FEATURES & PRIORITIZATION */}
        {activeTab === "features" && (
          <div className="space-y-8 animate-slide-in">
            {/* Competitor analysis matrix */}
            <div className="glass-panel p-6 rounded-3xl space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-200">Competitor Comparison Matrix</h3>
              
              <div className="overflow-x-auto pt-2">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-900">
                      <th className="py-3 font-semibold text-slate-400">Feature Variable</th>
                      <th className="py-3 font-semibold text-slate-400">LeetCode</th>
                      <th className="py-3 font-semibold text-slate-400">Interviewing.io</th>
                      <th className="py-3 font-semibold text-slate-400">MockMate</th>
                      <th className="py-3 font-bold text-purple-400">PlacementGPT</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-900/40">
                      <td className="py-3 font-bold text-slate-200">Conversational Grader</td>
                      <td className="py-3 text-slate-500">❌ Code checks only</td>
                      <td className="py-3 text-slate-300">✅ Live human grader</td>
                      <td className="py-3 text-slate-300">✅ Basic bot replies</td>
                      <td className="py-3 text-emerald-400 font-bold">✅ Gemini 5-Axis AI</td>
                    </tr>
                    <tr className="border-b border-slate-900/40">
                      <td className="py-3 font-bold text-slate-200">PDF Resume Scans</td>
                      <td className="py-3 text-slate-500">❌ None</td>
                      <td className="py-3 text-slate-500">❌ None</td>
                      <td className="py-3 text-slate-300">✅ Simple text tags</td>
                      <td className="py-3 text-emerald-400 font-bold">✅ Detailed ATS Audit</td>
                    </tr>
                    <tr className="border-b border-slate-900/40">
                      <td className="py-3 font-bold text-slate-200">Weekly Roadmaps</td>
                      <td className="py-3 text-slate-300">✅ Static study sets</td>
                      <td className="py-3 text-slate-500">❌ None</td>
                      <td className="py-3 text-slate-500">❌ None</td>
                      <td className="py-3 text-emerald-400 font-bold">✅ Stateful Timeline</td>
                    </tr>
                    <tr className="border-b border-slate-900/40">
                      <td className="py-3 font-bold text-slate-200">Pricing / Session</td>
                      <td className="py-3 text-slate-300">$35/mo subscription</td>
                      <td className="py-3 text-slate-300">$150 - $200 / run</td>
                      <td className="py-3 text-slate-300">$20 / month</td>
                      <td className="py-3 text-emerald-400 font-bold">✅ 100% Free Sandbox</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* RICE Prioritization framework */}
            <div className="glass-panel p-6 rounded-3xl space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-200">MVP Feature Prioritization (RICE Framework)</h3>
              <p className="text-xs text-slate-400">RICE score calculated as: (Reach × Impact × Confidence) / Effort. Used to lock MVP boundaries.</p>

              <div className="overflow-x-auto pt-2">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-900">
                      <th className="py-3 font-semibold text-slate-400">MVP Module</th>
                      <th className="py-3 font-semibold text-slate-400">Reach (1-10)</th>
                      <th className="py-3 font-semibold text-slate-400">Impact (1-3)</th>
                      <th className="py-3 font-semibold text-slate-400">Confidence (%)</th>
                      <th className="py-3 font-semibold text-slate-400">Effort (1-5)</th>
                      <th className="py-3 font-bold text-purple-400">RICE SCORE</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-900/40">
                      <td className="py-3 font-bold text-slate-200">JWT Auth & Protected Middleware</td>
                      <td className="py-3">10</td>
                      <td className="py-3">3 (Crucial)</td>
                      <td className="py-3">100%</td>
                      <td className="py-3">2 (Low)</td>
                      <td className="py-3 text-purple-400 font-bold">1500 (Priority 1)</td>
                    </tr>
                    <tr className="border-b border-slate-900/40">
                      <td className="py-3 font-bold text-slate-200">10-Question Mock Interview Grader</td>
                      <td className="py-3">10</td>
                      <td className="py-3">3 (Crucial)</td>
                      <td className="py-3">90%</td>
                      <td className="py-3">3 (Medium)</td>
                      <td className="py-3 text-purple-400 font-bold">900 (Priority 2)</td>
                    </tr>
                    <tr className="border-b border-slate-900/40">
                      <td className="py-3 font-bold text-slate-200">PDF Resume keywords parser</td>
                      <td className="py-3">8</td>
                      <td className="py-3">2 (High)</td>
                      <td className="py-3">90%</td>
                      <td className="py-3">3 (Medium)</td>
                      <td className="py-3 text-purple-400 font-bold">480 (Priority 3)</td>
                    </tr>
                    <tr className="border-b border-slate-900/40">
                      <td className="py-3 font-bold text-slate-200">Interactive Weekly Roadmap timeline</td>
                      <td className="py-3">8</td>
                      <td className="py-3">2 (High)</td>
                      <td className="py-3">80%</td>
                      <td className="py-3">3 (Medium)</td>
                      <td className="py-3 text-purple-400 font-bold">426 (Priority 4)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: KPIS & SUCCESS METRICS */}
        {activeTab === "kpis" && (
          <div className="space-y-8 animate-slide-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* North Star Metric */}
              <div className="glass-panel p-6 rounded-3xl space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-purple-400">The North Star Metric</h3>
                <h4 className="text-xl font-bold text-slate-100">Weekly Active Graded Sessions (WAGS)</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  We define WAGS as the total count of mock interview sessions completed and graded with our 5-axis evaluator in a rolling 7-day period. This metric represents the core value generated for the user: active practice coupled with actionable feedback.
                </p>
                <div className="p-3 bg-purple-950/20 border border-purple-500/10 rounded-2xl text-[10px] text-purple-300/80">
                  <span className="font-bold">Target Standard:</span> Reach 10,000 WAGS in the first 6 months of open sandbox operations.
                </div>
              </div>

              {/* Core Funnel KPIs */}
              <div className="glass-panel p-6 rounded-3xl space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-indigo-400">Core Product Funnel KPIs</h3>
                
                <div className="space-y-3 pt-1">
                  {/* Acquisition */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-300">Acquisition: User Signup Rates</span>
                      <span className="text-indigo-400 font-bold">12% conversion</span>
                    </div>
                    <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: "65%" }} />
                    </div>
                  </div>

                  {/* Activation */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-300">Activation: First Mock completed</span>
                      <span className="text-indigo-400 font-bold">78% conversion</span>
                    </div>
                    <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: "78%" }} />
                    </div>
                  </div>

                  {/* Retention */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-300">Retention: Week-4 return visits</span>
                      <span className="text-indigo-400 font-bold">35% conversion</span>
                    </div>
                    <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: "35%" }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: ROADMAP */}
        {activeTab === "roadmap" && (
          <div className="space-y-6 animate-slide-in">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-200">Gantt Now-Next-Later Product Roadmap</h3>
              <p className="text-xs text-slate-400">Illustrating long-term development strategies beyond MVP launch.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              {/* NOW */}
              <div className="glass-panel p-6 rounded-3xl border border-purple-500/20 bg-purple-950/5 relative overflow-hidden shadow-xl space-y-4">
                <span className="text-[10px] font-bold text-purple-400 tracking-wider uppercase block">
                  Q1: NOW / MVP Launch
                </span>
                <ul className="space-y-2 text-xs">
                  <li className="flex items-start gap-2 bg-slate-900/30 border border-slate-900 p-2.5 rounded-xl text-slate-300">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>Edge-safe JWT auth protected middleware routing.</span>
                  </li>
                  <li className="flex items-start gap-2 bg-slate-900/30 border border-slate-900 p-2.5 rounded-xl text-slate-300">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>Multidimensional interview grader with Recharts trackers.</span>
                  </li>
                  <li className="flex items-start gap-2 bg-slate-900/30 border border-slate-900 p-2.5 rounded-xl text-slate-300">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>PDF Resume Analyzer and weekly learning roads checklist.</span>
                  </li>
                </ul>
              </div>

              {/* NEXT */}
              <div className="glass-panel p-6 rounded-3xl border border-slate-900 relative overflow-hidden shadow-xl space-y-4">
                <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase block">
                  Q2: NEXT / Optimization
                </span>
                <ul className="space-y-2 text-xs">
                  <li className="flex items-start gap-2 bg-slate-900/30 border border-slate-900 p-2.5 rounded-xl text-slate-300">
                    <span className="w-4 h-4 bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center rounded-full text-[9px] font-bold mt-0.5 flex-shrink-0">1</span>
                    <span>Speech-to-Text dynamic transcription engine.</span>
                  </li>
                  <li className="flex items-start gap-2 bg-slate-900/30 border border-slate-900 p-2.5 rounded-xl text-slate-300">
                    <span className="w-4 h-4 bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center rounded-full text-[9px] font-bold mt-0.5 flex-shrink-0">2</span>
                    <span>Direct LinkedIn parsed login & profile scraping.</span>
                  </li>
                  <li className="flex items-start gap-2 bg-slate-900/30 border border-slate-900 p-2.5 rounded-xl text-slate-300">
                    <span className="w-4 h-4 bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center rounded-full text-[9px] font-bold mt-0.5 flex-shrink-0">3</span>
                    <span>Shared cohort mock boards and interview peer pairings.</span>
                  </li>
                </ul>
              </div>

              {/* LATER */}
              <div className="glass-panel p-6 rounded-3xl border border-slate-900 relative overflow-hidden shadow-xl space-y-4">
                <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase block">
                  Q3: LATER / Scale
                </span>
                <ul className="space-y-2 text-xs">
                  <li className="flex items-start gap-2 bg-slate-900/30 border border-slate-900 p-2.5 rounded-xl text-slate-300">
                    <span className="w-1.5 h-1.5 bg-slate-500 rounded-full mt-2 flex-shrink-0" />
                    <span>Real-time voice-synthesized AI mock panels.</span>
                  </li>
                  <li className="flex items-start gap-2 bg-slate-900/30 border border-slate-900 p-2.5 rounded-xl text-slate-300">
                    <span className="w-1.5 h-1.5 bg-slate-500 rounded-full mt-2 flex-shrink-0" />
                    <span>B2B enterprise mock interview recruitment integrations.</span>
                  </li>
                  <li className="flex items-start gap-2 bg-slate-900/30 border border-slate-900 p-2.5 rounded-xl text-slate-300">
                    <span className="w-1.5 h-1.5 bg-slate-500 rounded-full mt-2 flex-shrink-0" />
                    <span>Global corporate sponsor hiring and placement guarantees.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
