"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";

export default function LoginPage() {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, user, loading } =
    useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!loading && user) {
    router.push("/dashboard");
    return null;
  }

  const handleEmailSignIn = async () => {
    setError("");
    setIsSubmitting(true);
    try {
      await signInWithEmail(email, password);
      router.push("/dashboard");
    } catch {
      setError("Invalid credentials");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailSignUp = async () => {
    setError("");
    setIsSubmitting(true);
    try {
      await signUpWithEmail(email, password);
      router.push("/dashboard");
    } catch {
      setError("Account creation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    try {
      await signInWithGoogle();
      router.push("/dashboard");
    } catch {
      setError("Google sign-in failed");
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#0e0e10]">
        <div className="w-5 h-5 border-2 border-[#ba9eff]/30 border-t-[#ba9eff] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 bg-[#0e0e10]">
      <div className="w-full max-w-sm space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#ba9eff] tracking-tight italic mb-2">
            VAPOR
          </h1>
          <p className="text-sm text-[#adaaad]">
            Read it now or lose it forever.
          </p>
        </div>

        {/* Google */}
        <button
          onClick={handleGoogleSignIn}
          className="w-full h-11 bg-[#19191c] text-[#f9f5f8] text-sm rounded-xl hover:bg-[#1f1f22] hover:scale-[1.02] cursor-pointer transition-all ease-premium duration-300"
        >
          Continue with Google
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-[#19191c]" />
          <span className="text-xs text-[#48474a]">or</span>
          <div className="flex-1 h-px bg-[#19191c]" />
        </div>

        {/* Email form */}
        <div className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-11 px-4 bg-[#262528] rounded-xl text-[#f9f5f8] text-sm placeholder:text-[#48474a] focus:outline-none focus:ring-1 focus:ring-[#ba9eff]/40 transition-all ease-premium duration-300"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-11 px-4 bg-[#262528] rounded-xl text-[#f9f5f8] text-sm placeholder:text-[#48474a] focus:outline-none focus:ring-1 focus:ring-[#ba9eff]/40 transition-all ease-premium duration-300"
          />

          {error && <p className="text-xs text-red-400">{error}</p>}

          <div className="flex gap-3">
            <button
              onClick={handleEmailSignIn}
              disabled={isSubmitting}
              className="flex-1 h-11 gradient-primary text-black text-sm font-semibold rounded-xl hover:scale-[1.02] disabled:opacity-40 cursor-pointer transition-all ease-premium duration-300"
            >
              {isSubmitting ? "..." : "Sign In"}
            </button>
            <button
              onClick={handleEmailSignUp}
              disabled={isSubmitting}
              className="flex-1 h-11 bg-[#19191c] text-[#f9f5f8] text-sm rounded-xl hover:bg-[#1f1f22] hover:scale-[1.02] disabled:opacity-40 cursor-pointer transition-all ease-premium duration-300"
            >
              Create Account
            </button>
          </div>
        </div>

        <p className="text-[11px] text-[#48474a] text-center tracking-wider uppercase">
          Articles self-destruct after 7 days
        </p>
      </div>
    </div>
  );
}
