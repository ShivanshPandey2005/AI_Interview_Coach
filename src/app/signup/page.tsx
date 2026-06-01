"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, User, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ToastContext";

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast("Please fill in all fields", "warning");
      return;
    }

    if (password.length < 6) {
      toast("Password must be at least 6 characters long", "warning");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast(data.error || "Registration failed", "error");
      } else {
        toast(data.message || "Registration successful!", "success");
        // Redirect to login page
        router.push("/login");
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
          <h2 className="text-3xl font-extrabold tracking-tight font-sans">Create Account</h2>
          <p className="text-slate-400 mt-2 text-sm text-center">
            Sign up to build your custom roadmap and start AI mock interviews.
          </p>
        </div>

        {/* Signup Glass Card */}
        <div className="glass-panel p-8 rounded-3xl relative overflow-hidden shadow-2xl">
          {/* Inner card glow border line */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name Field */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-3.5 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                  className="w-full glass-input p-3.5 pl-12 rounded-xl text-slate-100 placeholder-slate-500 transition-all font-sans text-sm focus:border-purple-500"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 h-4 w-4 text-slate-500" />
                <input
                  type="email"
                  placeholder="john@example.com"
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
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 h-4 w-4 text-slate-500" />
                <input
                  type="password"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="w-full glass-input p-3.5 pl-12 rounded-xl text-slate-100 placeholder-slate-500 transition-all font-sans text-sm focus:border-purple-500"
                  required
                />
              </div>
            </div>

            {/* Signup button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 p-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-purple-950/20 active:scale-95 disabled:opacity-50 cursor-pointer text-sm mt-2"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Create Account"
              )}
            </button>
          </form>
        </div>

        {/* Footer Link */}
        <p className="text-center text-slate-400 mt-6 text-sm">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-purple-400 hover:text-purple-300 font-semibold transition-colors decoration-wavy hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
