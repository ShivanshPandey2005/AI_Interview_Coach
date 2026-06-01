"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Trophy, 
  MessageSquare, 
  Award, 
  ArrowLeft, 
  CheckCircle2, 
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  BookmarkCheck,
  ShieldCheck,
  Zap,
  Loader2
} from "lucide-react";
import DashboardShell from "@/components/DashboardShell";
import { useToast } from "@/components/ToastContext";

interface QuestionGrading {
  question: string;
  answer: string;
  score: number;
  communicationScore: number;
  technicalAccuracyScore: number;
  relevanceScore: number;
  confidenceScore: number;
  problemSolvingScore: number;
  feedback: string;
  strengths: string[];
  weaknesses: string[];
  betterSampleAnswer: string;
}

interface InterviewData {
  _id: string;
  role: string;
  difficulty: string;
  type: string;
  overallScore: number;
  feedbackSummary: string;
  questions: QuestionGrading[];
  createdAt: string;
}

export default function InterviewResultsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const id = params.id as string;

  const [data, setData] = useState<InterviewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchReport = async () => {
      try {
        const res = await fetch(`/api/interview/${id}`);
        if (!res.ok) {
          throw new Error("Report not found");
        }
        const payload = await res.json();
        setData(payload.interview);
      } catch (err) {
        console.error(err);
        toast("Failed to load interview report card.", "error");
        router.push("/dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReport();
  }, [id, toast, router]);

  const toggleExpand = (idx: number) => {
    setExpandedQuestion(expandedQuestion === idx ? null : idx);
  };

  const getScoreDescription = (score: number) => {
    if (score >= 85) return "Distinguished / Outstanding";
    if (score >= 70) return "Proficient / Solid";
    if (score >= 50) return "Needs Revision / Developing";
    return "Critical Review Required";
  };

  // Helper for rendering SVG Circular progress bar
  const CircularProgress = ({ score, size = 120, strokeWidth = 10, glow = true }: { score: number; size?: number; strokeWidth?: number; glow?: boolean }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    let strokeColor = "stroke-purple-500";
    let glowColor = "shadow-purple-500/20";
    if (score >= 80) {
      strokeColor = "stroke-emerald-500";
      glowColor = "shadow-emerald-500/20";
    } else if (score < 60) {
      strokeColor = "stroke-rose-500";
      glowColor = "shadow-rose-500/20";
    }

    return (
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        {/* Glow indicator backing */}
        {glow && (
          <div className={`absolute inset-2 rounded-full filter blur-xl opacity-25 ${glowColor}`} />
        )}
        <svg width={size} height={size} className="transform -rotate-95 relative z-10">
          {/* Background circle */}
          <circle
            className="stroke-slate-900"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          {/* Progress circle */}
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
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Score</span>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <DashboardShell>
        <div className="max-w-md mx-auto py-24 text-center space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-purple-500 mx-auto" />
          <p className="text-sm font-semibold tracking-wider text-slate-500 uppercase animate-pulse">
            Compiling report statistics...
          </p>
        </div>
      </DashboardShell>
    );
  }

  if (!data) return null;

  // Extract average sub-scores from questions array
  const subScores = data.questions.reduce(
    (acc, q) => {
      acc.comm += q.communicationScore;
      acc.tech += q.technicalAccuracyScore;
      acc.rel += q.relevanceScore;
      acc.conf += q.confidenceScore;
      acc.prob += q.problemSolvingScore;
      return acc;
    },
    { comm: 0, tech: 0, rel: 0, conf: 0, prob: 0 }
  );

  const totalQ = data.questions.length || 1;
  const avgComm = Math.round((subScores.comm / totalQ) * 10);
  const avgTech = Math.round((subScores.tech / totalQ) * 10);
  const avgConf = Math.round((subScores.conf / totalQ) * 10);
  const avgProb = Math.round((subScores.prob / totalQ) * 10);

  return (
    <DashboardShell>
      {/* Back to history hook */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <span className="text-xs text-slate-500 font-medium">
          Interview Conducted on {new Date(data.createdAt).toLocaleDateString("en-US", { dateStyle: "long" })}
        </span>
      </div>

      {/* Main Stats Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Overall Circular Progress Card */}
        <div className="glass-panel p-6 rounded-3xl flex flex-col items-center justify-center gap-4 text-center shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/5 rounded-full filter blur-2xl pointer-events-none" />
          
          <CircularProgress score={data.overallScore} size={150} strokeWidth={12} />
          
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-200 uppercase tracking-wider">{data.role}</h3>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              {data.type} • {data.difficulty}
            </p>
            <span className="inline-block px-3 py-1 bg-slate-900 border border-slate-800 rounded-full text-[10px] font-bold text-purple-400 mt-2">
              {getScoreDescription(data.overallScore)}
            </span>
          </div>
        </div>

        {/* Categorical Scores Breakdown Card */}
        <div className="glass-panel p-6 rounded-3xl md:col-span-2 shadow-xl space-y-5">
          <div className="space-y-1 border-b border-slate-900 pb-3">
            <h3 className="text-base font-bold text-slate-200">Multidimensional Skills Audit</h3>
            <p className="text-xs text-slate-400">Categorized proficiency scores mapped across five core dimensions.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Technical Score */}
            <div className="p-3.5 rounded-2xl bg-slate-900/20 border border-slate-900 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Technical Accuracy</span>
                <p className="text-xs text-slate-500 font-medium">Domain expertise correctness.</p>
              </div>
              <CircularProgress score={avgTech} size={60} strokeWidth={5} glow={false} />
            </div>

            {/* Communication Score */}
            <div className="p-3.5 rounded-2xl bg-slate-900/20 border border-slate-900 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Communication</span>
                <p className="text-xs text-slate-500 font-medium">Clarity, grammar, articulation.</p>
              </div>
              <CircularProgress score={avgComm} size={60} strokeWidth={5} glow={false} />
            </div>

            {/* Confidence Score */}
            <div className="p-3.5 rounded-2xl bg-slate-900/20 border border-slate-900 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Confidence</span>
                <p className="text-xs text-slate-500 font-medium">Tone assertiveness & assurance.</p>
              </div>
              <CircularProgress score={avgConf} size={60} strokeWidth={5} glow={false} />
            </div>

            {/* Problem Solving Score */}
            <div className="p-3.5 rounded-2xl bg-slate-900/20 border border-slate-900 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Problem Solving</span>
                <p className="text-xs text-slate-500 font-medium">Logic flow & analytical depth.</p>
              </div>
              <CircularProgress score={avgProb} size={60} strokeWidth={5} glow={false} />
            </div>
          </div>
        </div>
      </div>

      {/* Narrative evaluation summaries block */}
      <div className="glass-panel p-6 rounded-3xl shadow-xl space-y-6">
        {/* Overall Feedback Summary */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-400" />
            <h3 className="text-base font-bold text-slate-200">Executive Grading Critique</h3>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed bg-slate-900/20 border border-slate-900/40 p-4 rounded-2xl">
            {data.feedbackSummary}
          </p>
        </div>

        {/* Strengths & Improvements lists */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Consolidated Strengths */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Consolidated Strengths
            </h4>
            <ul className="space-y-2">
              {data.questions
                .flatMap((q) => q.strengths)
                .slice(0, 4)
                .map((str, idx) => (
                  <li key={idx} className="text-xs text-slate-300 leading-relaxed bg-slate-900/20 border border-slate-900/40 py-2.5 px-4 rounded-xl">
                    {str}
                  </li>
                ))}
            </ul>
          </div>

          {/* Consolidated Areas of Improvement */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Areas of Improvement
            </h4>
            <ul className="space-y-2">
              {data.questions
                .flatMap((q) => q.weaknesses)
                .slice(0, 4)
                .map((weak, idx) => (
                  <li key={idx} className="text-xs text-slate-300 leading-relaxed bg-slate-900/20 border border-slate-900/40 py-2.5 px-4 rounded-xl">
                    {weak}
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Graded Dialogue Transcript Accordion list */}
      <div className="space-y-4">
        <div className="space-y-1">
          <h3 className="text-base font-bold text-slate-200">Interactive Q&A Transcript Review</h3>
          <p className="text-xs text-slate-400">Click a question to inspect your response, individual sub-scores, and AI recommended model answer.</p>
        </div>

        <div className="space-y-3">
          {data.questions.map((q, idx) => {
            const isExpanded = expandedQuestion === idx;
            return (
              <div 
                key={idx}
                className={`glass-panel rounded-2xl overflow-hidden shadow border transition-all duration-300 ${
                  isExpanded ? "border-purple-500/30 ring-1 ring-purple-500/20" : "border-slate-900"
                }`}
              >
                {/* Accordion header button */}
                <button
                  onClick={() => toggleExpand(idx)}
                  className="w-full flex items-center justify-between p-5 text-left bg-slate-950/20 cursor-pointer"
                >
                  <div className="flex-1 pr-4">
                    <span className="text-[10px] font-bold text-purple-400 tracking-wider block mb-1">
                      QUESTION {idx + 1}
                    </span>
                    <h4 className="text-sm font-semibold text-slate-200 leading-relaxed">
                      {q.question}
                    </h4>
                  </div>

                  <div className="flex items-center gap-4 flex-shrink-0">
                    <span className={`text-xs font-bold px-2 py-1 rounded-xl border ${
                      q.score >= 8 ? "text-emerald-400 border-emerald-950 bg-emerald-950/20" :
                      q.score >= 6 ? "text-amber-400 border-amber-950 bg-amber-950/20" :
                      "text-rose-400 border-rose-950 bg-rose-950/20"
                    }`}>
                      {q.score}/10
                    </span>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </button>

                {/* Collapsible panel content */}
                {isExpanded && (
                  <div className="p-5 border-t border-slate-900 bg-slate-950/40 space-y-5 animate-slide-in">
                    {/* User Answer vs Model Answer */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Your Answered Text</span>
                        <div className="text-xs text-slate-300 leading-relaxed bg-slate-900/30 border border-slate-900 p-4 rounded-xl min-h-24 whitespace-pre-line">
                          {q.answer || "(Empty answer submitted)"}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Better Sample Answer Suggestion</span>
                        <div className="text-xs text-purple-200/90 leading-relaxed bg-purple-950/10 border border-purple-950/20 p-4 rounded-xl min-h-24 whitespace-pre-line">
                          {q.betterSampleAnswer}
                        </div>
                      </div>
                    </div>

                    {/* Question specific metrics & feedback */}
                    <div className="space-y-3.5 border-t border-slate-900 pt-4">
                      <div className="flex items-center gap-1">
                        <BookmarkCheck className="w-4 h-4 text-purple-400" />
                        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">AI grading metrics</span>
                      </div>

                      {/* Score bars */}
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                        {/* 1 */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[9px] font-bold text-slate-500">
                            <span>TECH</span>
                            <span>{q.technicalAccuracyScore}/10</span>
                          </div>
                          <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
                            <div className="h-full bg-purple-500 rounded-full" style={{ width: `${q.technicalAccuracyScore * 10}%` }} />
                          </div>
                        </div>

                        {/* 2 */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[9px] font-bold text-slate-500">
                            <span>COMM</span>
                            <span>{q.communicationScore}/10</span>
                          </div>
                          <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
                            <div className="h-full bg-purple-500 rounded-full" style={{ width: `${q.communicationScore * 10}%` }} />
                          </div>
                        </div>

                        {/* 3 */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[9px] font-bold text-slate-500">
                            <span>RELEVANCE</span>
                            <span>{q.relevanceScore}/10</span>
                          </div>
                          <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
                            <div className="h-full bg-purple-500 rounded-full" style={{ width: `${q.relevanceScore * 10}%` }} />
                          </div>
                        </div>

                        {/* 4 */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[9px] font-bold text-slate-500">
                            <span>CONF</span>
                            <span>{q.confidenceScore}/10</span>
                          </div>
                          <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
                            <div className="h-full bg-purple-500 rounded-full" style={{ width: `${q.confidenceScore * 10}%` }} />
                          </div>
                        </div>

                        {/* 5 */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[9px] font-bold text-slate-500">
                            <span>LOGIC</span>
                            <span>{q.problemSolvingScore}/10</span>
                          </div>
                          <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
                            <div className="h-full bg-purple-500 rounded-full" style={{ width: `${q.problemSolvingScore * 10}%` }} />
                          </div>
                        </div>
                      </div>

                      {/* Feedback Text */}
                      <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/10 border border-slate-900/40 p-4 rounded-xl mt-3">
                        <span className="font-semibold text-purple-400 block mb-1 text-[10px] tracking-widest uppercase">FEEDBACK</span>
                        {q.feedback}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </DashboardShell>
  );
}
