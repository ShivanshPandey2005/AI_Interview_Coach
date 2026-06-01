"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, Loader2, Sparkles, HelpCircle } from "lucide-react";
import { useToast } from "@/components/ToastContext";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Show validation warnings if coming from protected routes
    const from = searchParams.get("from");
    if (from) {
      toast("Please log in to access this page.", "warning");
    }
  }, [searchParams, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast("Please fill in all fields", "warning");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast(data.error || "Login failed", "error");
      } else {
        toast("Welcome back! Loading your dashboard...", "success");
        // Redirect to dashboard (or where the user originally tried to go)
        const destination = searchParams.get("from") || "/dashboard";
        router.push(destination);
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      toast("A connection error occurred. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-slate-950 text-slate-100 font-sans">
      {/* Background glowing aesthetic blobs */}
      <div className="glowing-blob bg-purple-600 w-[500px] h-[500px] -top-40 -left-40 animate-pulse-slow" />
      <div className="glowing-blob bg-indigo-600 w-[450px] h-[450px] -bottom-40 -right-40 animate-pulse-slow" />

      <div className="relative z-10 w-full max-w-md animate-slide-in">
        {/* Logo/Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 p-3 bg-purple-500/10 border border-purple-500/20 rounded-2xl mb-4 shadow-inner">
            <Sparkles className="w-6 h-6 text-purple-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              PlacementGPT
            </span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight font-sans">Welcome Back</h2>
          <p className="text-slate-400 mt-2 text-sm text-center">
            Sign in to start mock sessions and analyze your resume gaps.
          </p>
        </div>

        {/* Login Glass Card */}
        <div className="glass-panel p-8 rounded-3xl relative overflow-hidden shadow-2xl">
          {/* Inner card glow border line */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 h-4 w-4 text-slate-500" />
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="w-full glass-input p-3.5 pl-12 rounded-xl text-slate-100 placeholder-slate-500 transition-all font-sans text-sm focus:border-purple-500"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 h-4 w-4 text-slate-500" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="w-full glass-input p-3.5 pl-12 rounded-xl text-slate-100 placeholder-slate-500 transition-all font-sans text-sm focus:border-purple-500"
                  required
                />
              </div>
            </div>

            {/* Login button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 p-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-purple-950/20 active:scale-95 disabled:opacity-50 cursor-pointer text-sm"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Log In"
              )}
            </button>
          </form>

          {/* Quick Mock Credentials Tip for Resilient Offline Usage */}
          <div className="mt-6 flex items-start gap-2.5 p-3 rounded-2xl bg-purple-950/20 border border-purple-500/10 text-xs text-purple-300/80">
            <HelpCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Resilient Sandbox Mode</span>: Sign up with any email first, then use those credentials to log in! No live databases required.
            </div>
          </div>
        </div>

        {/* Footer Link */}
        <p className="text-center text-slate-400 mt-6 text-sm">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-purple-400 hover:text-purple-300 font-semibold transition-colors decoration-wavy hover:underline"
          >
            Create one free
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-200">
        <Loader2 className="w-10 h-10 animate-spin text-purple-500 mb-4" />
        <p className="text-sm font-semibold tracking-widest uppercase text-slate-500 animate-pulse">
          Loading secure gateway...
        </p>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
