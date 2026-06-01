"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  UploadCloud, 
  FileText, 
  Trash2, 
  Sparkles, 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  BookmarkCheck,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  TrendingUp
} from "lucide-react";
import DashboardShell from "@/components/DashboardShell";
import { useToast } from "@/components/ToastContext";

interface ResumeAnalysisData {
  _id?: string;
  fileName: string;
  atsScore: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  missingSkills: string[];
  suggestions: string[];
  createdAt: string;
}

export default function ResumePage() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<ResumeAnalysisData | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingPrev, setIsLoadingPrev] = useState(true);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    // Load previously analyzed resume report on mount
    const fetchPreviousAnalysis = async () => {
      try {
        const res = await fetch("/api/resume");
        const data = await res.json();
        if (data.resume) {
          setAnalysis(data.resume);
        }
      } catch (e) {
        console.error("Could not fetch cached resume analysis:", e);
      } finally {
        setIsLoadingPrev(false);
      }
    };
    fetchPreviousAnalysis();
  }, []);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "application/pdf") {
        setFile(droppedFile);
        toast(`Selected PDF file: ${droppedFile.name}`, "info");
      } else {
        toast("Only PDF files are supported for resume auditing", "warning");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === "application/pdf") {
        setFile(selectedFile);
        toast(`Selected PDF file: ${selectedFile.name}`, "info");
      } else {
        toast("Only PDF files are supported for resume auditing", "warning");
      }
    }
  };

  const triggerFileSelect = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleUploadSubmit = async () => {
    if (!file) return;

    setIsUploading(true);
    toast("Uploading PDF. Extracting binary stream and critiquing keywords...", "info");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/resume", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        toast(data.error || "Audit failed", "error");
      } else {
        setAnalysis(data.analysis);
        setFile(null);
        toast("ATS Audit compiled successfully!", "success");
      }
    } catch (err) {
      console.error(err);
      toast("A connection error occurred. Please try again.", "error");
    } finally {
      setIsUploading(false);
    }
  };

  // Helper for rendering SVG Circular progress bar
  const CircularProgress = ({ score, size = 120, strokeWidth = 10 }: { score: number; size?: number; strokeWidth?: number }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    let strokeColor = "stroke-purple-500";
    let glowColor = "shadow-purple-500/25";
    if (score >= 80) {
      strokeColor = "stroke-emerald-500";
      glowColor = "shadow-emerald-500/25";
    } else if (score < 60) {
      strokeColor = "stroke-rose-500";
      glowColor = "shadow-rose-500/25";
    }

    return (
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <div className={`absolute inset-2 rounded-full filter blur-xl opacity-20 ${glowColor}`} />
        <svg width={size} height={size} className="transform -rotate-90 relative z-10">
          <circle
            className="stroke-slate-900"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          <circle
            className={`${strokeColor} transition-all duration-1000 ease-out`}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center z-10">
          <span className="text-2xl font-extrabold tracking-tight text-slate-100">{score}%</span>
          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">ATS Match</span>
        </div>
      </div>
    );
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Title pane */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight text-slate-100">PDF Resume Analyzer</h2>
            <p className="text-slate-400 text-xs">
              Upload your resume in PDF format to discover compatibility matching, keyword densities, and growth targets.
            </p>
          </div>
        </div>

        {/* 1. PDF UPLOAD AND PARSE BLOCKS */}
        {!analysis && !isLoadingPrev && (
          <div className="max-w-2xl mx-auto space-y-6 animate-slide-in">
            {/* Custom dragzone container */}
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={file ? undefined : triggerFileSelect}
              className={`glass-panel p-8 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 relative overflow-hidden shadow-2xl min-h-80
                ${dragActive ? "border-purple-500 bg-purple-950/10 scale-98" : "border-slate-800 hover:border-slate-700"}
                ${file ? "cursor-default" : ""}
              `}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="application/pdf"
                className="hidden"
              />

              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full filter blur-2xl pointer-events-none" />

              {!file ? (
                // Setup screen
                <div className="space-y-4 max-w-sm">
                  <div className="p-4 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 inline-flex shadow-inner">
                    <UploadCloud className="w-8 h-8 animate-bounce" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-bold text-slate-200">Drag and drop your resume</h3>
                    <p className="text-xs text-slate-400">
                      Supports only <span className="font-semibold text-slate-300">PDF format</span> files up to 5MB size limit.
                    </p>
                  </div>
                  <button
                    onClick={triggerFileSelect}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-slate-100 text-xs font-semibold rounded-xl active:scale-95 transition-all shadow-md cursor-pointer"
                  >
                    Select File
                  </button>
                </div>
              ) : (
                // Loaded screen
                <div className="space-y-6 w-full max-w-md">
                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-900/30 border border-slate-900">
                    <div className="p-3 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-xl">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div className="flex-1 text-left truncate">
                      <h4 className="text-xs font-bold text-slate-200 truncate">{file.name}</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB • PDF File
                      </p>
                    </div>
                    <button
                      onClick={removeFile}
                      disabled={isUploading}
                      className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-950/10 rounded-xl transition-colors border border-transparent hover:border-rose-950/20"
                      title="Clear Selection"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={handleUploadSubmit}
                    disabled={isUploading}
                    className="w-full flex items-center justify-center gap-2 p-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg active:scale-95 disabled:opacity-50 cursor-pointer text-sm"
                  >
                    {isUploading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Initiate Resume Audit
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* LOADING UPLOAD VIEW */}
        {isUploading && (
          <div className="max-w-md mx-auto py-16 text-center space-y-6 animate-pulse">
            <div className="inline-flex p-4 rounded-3xl bg-purple-500/10 border border-purple-500/20 text-purple-400 mb-2">
              <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
            </div>
            <h3 className="text-xl font-bold tracking-wide text-slate-200">Analyzing Resume Semantics</h3>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm mx-auto">
              Extracting pdf printable headers, evaluating layout structures, comparing keyword densities, and generating custom improvement paths. This will only take a moment...
            </p>
          </div>
        )}

        {/* 2. RESULTS AUDIT VIEW */}
        {analysis && !isUploading && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-in">
            {/* Left side: Circular ring score card */}
            <div className="glass-panel p-6 rounded-3xl flex flex-col items-center justify-center gap-6 text-center shadow-xl relative overflow-hidden h-fit">
              <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/5 rounded-full filter blur-2xl pointer-events-none" />
              
              <CircularProgress score={analysis.atsScore} size={150} strokeWidth={12} />
              
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-200 uppercase tracking-wider">{analysis.fileName}</h3>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-widest mt-1">
                  Audit compiled
                </p>
                
                {/* Reset button */}
                <button
                  onClick={() => setAnalysis(null)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-semibold rounded-xl mt-6 cursor-pointer"
                >
                  Audit Another Resume
                </button>
              </div>
            </div>

            {/* Right side: Detailed summaries (Col span 2) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Executive summary block */}
              <div className="glass-panel p-6 rounded-3xl shadow-md space-y-3">
                <div className="flex items-center gap-2">
                  <BookmarkCheck className="w-5 h-5 text-purple-400" />
                  <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest">Executive Audit Critique</h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/20 border border-slate-900/40 p-4 rounded-2xl">
                  {analysis.summary}
                </p>
              </div>

              {/* Grid categories */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Strengths */}
                <div className="glass-panel p-5 rounded-3xl shadow-sm space-y-3.5">
                  <h4 className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-900 pb-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Key Strengths
                  </h4>
                  <ul className="space-y-2">
                    {analysis.strengths.map((str, idx) => (
                      <li key={idx} className="text-xs text-slate-300 leading-relaxed flex items-start gap-2 bg-slate-900/10 border border-slate-900/40 py-2.5 px-3 rounded-xl">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 flex-shrink-0" />
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Weaknesses */}
                <div className="glass-panel p-5 rounded-3xl shadow-sm space-y-3.5">
                  <h4 className="text-[10px] font-extrabold text-rose-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-900 pb-2">
                    <XCircle className="w-4 h-4 text-rose-400" />
                    Layout Friction Points
                  </h4>
                  <ul className="space-y-2">
                    {analysis.weaknesses.map((weak, idx) => (
                      <li key={idx} className="text-xs text-slate-300 leading-relaxed flex items-start gap-2 bg-slate-900/10 border border-slate-900/40 py-2.5 px-3 rounded-xl">
                        <span className="w-1.5 h-1.5 bg-rose-500 rounded-full mt-1.5 flex-shrink-0" />
                        <span>{weak}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Missing Skills */}
                <div className="glass-panel p-5 rounded-3xl shadow-sm space-y-3.5">
                  <h4 className="text-[10px] font-extrabold text-amber-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-900 pb-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    Missing Industry Keywords
                  </h4>
                  <ul className="space-y-2">
                    {analysis.missingSkills.map((sk, idx) => (
                      <li key={idx} className="text-xs text-slate-300 leading-relaxed flex items-start gap-2 bg-slate-900/10 border border-slate-900/40 py-2.5 px-3 rounded-xl">
                        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 flex-shrink-0" />
                        <span>{sk}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Improvement suggestions */}
                <div className="glass-panel p-5 rounded-3xl shadow-sm space-y-3.5">
                  <h4 className="text-[10px] font-extrabold text-purple-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-900 pb-2">
                    <Lightbulb className="w-4 h-4 text-purple-400" />
                    Actionable Roadmap Tasks
                  </h4>
                  <ul className="space-y-2">
                    {analysis.suggestions.map((sug, idx) => (
                      <li key={idx} className="text-xs text-slate-300 leading-relaxed flex items-start gap-2 bg-slate-900/10 border border-slate-900/40 py-2.5 px-3 rounded-xl">
                        <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1.5 flex-shrink-0" />
                        <span>{sug}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom launch CTA */}
              <div className="glass-panel relative rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl border border-purple-500/20 bg-purple-950/5 mt-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    <TrendingUp className="w-5 h-5 animate-pulse" />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-slate-200 font-sans">Ready to bridge your skill gaps?</h4>
                    <p className="text-[10px] text-slate-500 font-medium">Use this ATS audit to compile a week-by-week weekly learning roadmap.</p>
                  </div>
                </div>

                <Link
                  href="/roadmap"
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg active:scale-95 transition-all cursor-pointer"
                >
                  Generate Weekly Roadmap
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
