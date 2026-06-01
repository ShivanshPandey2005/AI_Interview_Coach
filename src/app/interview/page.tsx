"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Play, 
  MessageSquare, 
  ChevronRight, 
  Loader2, 
  HelpCircle,
  Timer,
  BookOpen,
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import DashboardShell from "@/components/DashboardShell";
import { useToast } from "@/components/ToastContext";

type ViewState = "setup" | "interview" | "grading";

export default function InterviewPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [viewState, setViewState] = useState<ViewState>("setup");
  const [role, setRole] = useState("Frontend Engineer");
  const [difficulty, setDifficulty] = useState("Medium");
  const [type, setType] = useState("Technical");

  const [questions, setQuestions] = useState<string[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(10).fill(""));
  const [currentAnswer, setCurrentAnswer] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);

  // Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (viewState === "interview") {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setTimerSeconds(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [viewState]);

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${remainingSecs.toString().padStart(2, "0")}`;
  };

  const handleStartSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role.trim()) {
      toast("Please enter a target role name", "warning");
      return;
    }

    setIsLoading(true);
    toast("Generating 10 custom interview questions via Gemini AI...", "info");

    try {
      const response = await fetch("/api/interview/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, difficulty, type }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast(data.error || "Questions generation failed", "error");
      } else {
        setQuestions(data.questions);
        setAnswers(Array(10).fill(""));
        setCurrentIdx(0);
        setCurrentAnswer("");
        setViewState("interview");
        toast("Mock Session initiated successfully! Good luck.", "success");
      }
    } catch (err) {
      console.error(err);
      toast("A connection error occurred. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextQuestion = () => {
    // Record current answer
    const newAnswers = [...answers];
    newAnswers[currentIdx] = currentAnswer.trim();
    setAnswers(newAnswers);

    if (currentIdx < 9) {
      setCurrentIdx(currentIdx + 1);
      // Retrieve next saved answer if present, else empty
      setCurrentAnswer(answers[currentIdx + 1] || "");
    } else {
      // Finish Interview
      handleSubmitInterview(newAnswers);
    }
  };

  const handlePrevQuestion = () => {
    if (currentIdx > 0) {
      // Save current answer first
      const newAnswers = [...answers];
      newAnswers[currentIdx] = currentAnswer.trim();
      setAnswers(newAnswers);

      setCurrentIdx(currentIdx - 1);
      setCurrentAnswer(answers[currentIdx - 1]);
    }
  };

  const handleSubmitInterview = async (completedAnswers: string[]) => {
    setViewState("grading");
    setIsLoading(true);
    toast("Uploading transcripts. Compiling communication and technical scores...", "info");

    try {
      const response = await fetch("/api/interview/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role,
          difficulty,
          type,
          questions,
          answers: completedAnswers,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast(data.error || "Interview grading failed", "error");
        setViewState("interview");
      } else {
        toast("Multidimensional grading finalized successfully!", "success");
        // Redirect to dedicated report page
        router.push(`/interview/${data.id}`);
      }
    } catch (err) {
      console.error(err);
      toast("A connection error occurred. Could not save scores.", "error");
      setViewState("interview");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardShell>
      {/* 1. SETUP STATE VIEW */}
      {viewState === "setup" && (
        <div className="max-w-xl mx-auto space-y-6 animate-slide-in">
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-slate-100">Setup Mock Interview</h2>
            <p className="text-slate-400 text-xs">
              Configure parameters to generate exactly 10 customized questions.
            </p>
          </div>

          <div className="glass-panel p-8 rounded-3xl relative overflow-hidden shadow-2xl space-y-6">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />

            <form onSubmit={handleStartSetup} className="space-y-5">
              {/* Role Target */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block">
                  Target Professional Role
                </label>
                <input
                  type="text"
                  placeholder="e.g. Frontend Engineer, Product Manager, SRE"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  disabled={isLoading}
                  className="w-full glass-input p-3.5 rounded-xl text-slate-100 placeholder-slate-500 transition-all font-sans text-sm focus:border-purple-500"
                  required
                />
              </div>

              {/* Grid Difficulty / Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Difficulty Select */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block">
                    Difficulty Level
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    disabled={isLoading}
                    className="w-full glass-input p-3.5 rounded-xl text-slate-100 transition-all font-sans text-sm focus:border-purple-500 bg-slate-950/90"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                {/* Type Select */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block">
                    Interview Category
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    disabled={isLoading}
                    className="w-full glass-input p-3.5 rounded-xl text-slate-100 transition-all font-sans text-sm focus:border-purple-500 bg-slate-950/90"
                  >
                    <option value="Technical">Technical (Coding & System Design)</option>
                    <option value="Behavioral">Behavioral (Competencies & Scenarios)</option>
                    <option value="HR & Core">HR & Culture Alignment</option>
                  </select>
                </div>
              </div>

              {/* Start Trigger button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 p-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg active:scale-95 disabled:opacity-50 cursor-pointer text-sm"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    Launch AI Interview Session
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 2. ACTIVE INTERVIEW DIALOGUE VIEW */}
      {viewState === "interview" && questions.length > 0 && (
        <div className="max-w-3xl mx-auto space-y-6 animate-slide-in">
          {/* Header Panel with Progress & Time indicators */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-full uppercase tracking-wider">
                Question {currentIdx + 1} of 10
              </span>
            </div>
            
            <div className="flex items-center gap-1.5 py-1 px-3 bg-slate-900 border border-slate-800 text-slate-300 rounded-xl text-xs font-semibold">
              <Timer className="w-4 h-4 text-purple-400" />
              <span>Session Time: {formatTimer(timerSeconds)}</span>
            </div>
          </div>

          {/* Core Progress Bar */}
          <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-300 rounded-full" 
              style={{ width: `${(currentIdx + 1) * 10}%` }}
            />
          </div>

          {/* Active Question Display Card */}
          <div className="glass-panel p-8 rounded-3xl relative overflow-hidden shadow-2xl space-y-6">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
            
            {/* Question Text block */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">GEMINI RECRUITER</span>
              <h3 className="text-lg font-bold leading-relaxed text-slate-100 font-sans">
                {questions[currentIdx]}
              </h3>
            </div>

            {/* Answer Input textarea */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block">
                Your Answer Response
              </label>
              <textarea
                placeholder="Compose your structured response here. Take your time, explain logic clearly, and outline examples if appropriate..."
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                className="w-full min-h-48 glass-input p-4 rounded-2xl text-slate-100 placeholder-slate-500 transition-all font-sans text-sm focus:border-purple-500 leading-relaxed resize-none"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-medium px-1">
                <span>Provide at least 2-3 detailed sentences for dynamic AI feedback.</span>
                <span>{currentAnswer.length} characters</span>
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between border-t border-slate-900 pt-6">
              <button
                onClick={handlePrevQuestion}
                disabled={currentIdx === 0}
                className="flex items-center gap-1 px-4 py-2.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-bold rounded-xl transition-all disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <button
                onClick={handleNextQuestion}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg active:scale-95 transition-all cursor-pointer"
              >
                {currentIdx === 9 ? (
                  <>
                    Finish & Grade
                    <ShieldCheck className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Next Question
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. GRADING EVALUATION LOADER */}
      {viewState === "grading" && (
        <div className="max-w-md mx-auto py-16 text-center space-y-6 animate-pulse">
          <div className="inline-flex p-4 rounded-3xl bg-purple-500/10 border border-purple-500/20 text-purple-400 mb-2">
            <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
          </div>
          <h3 className="text-xl font-bold tracking-wide text-slate-200">Evaluating Transcript Responses</h3>
          <p className="text-sm text-slate-400 leading-relaxed max-w-sm mx-auto">
            Gemini is grading your 10 answers across communication clarity, technical accuracy, relevance, confidence, and logical problem-solving. This will only take a moment...
          </p>
        </div>
      )}
    </DashboardShell>
  );
}
