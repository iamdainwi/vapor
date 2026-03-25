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

  // Redirect if already logged in
  if (!loading && user) {
    router.push("/dashboard");
    return null;
  }

  const handleEmailSignIn = async () => {
    setError("");
    setIsSubmitting(true);
    try {
      await signInWithEmail(email, password);
      router.push("/");
    } catch {
      setError("INVALID CREDENTIALS");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailSignUp = async () => {
    setError("");
    setIsSubmitting(true);
    try {
      await signUpWithEmail(email, password);
      router.push("/");
    } catch {
      setError("ACCOUNT CREATION FAILED");
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
      setError("GOOGLE SIGN-IN FAILED");
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#0e0e0e]">
        <span className="vapor-label text-[#af8782]">LOADING...</span>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 bg-[#0e0e0e]">
      <div className="w-full max-w-md space-y-12">
        {/* Header */}
        <div className="text-left">
          <h1 className="vapor-display text-[#e5e2e1] mb-4">VAPOR</h1>
          <p className="vapor-label text-[#af8782]">
            NOTHING LASTS. READ IT NOW OR LOSE IT FOREVER.
          </p>
        </div>

        {/* Google Auth */}
        <button
          onClick={handleGoogleSignIn}
          className="w-full h-12 border border-[#e5e2e1] bg-transparent text-[#e5e2e1] font-mono text-xs uppercase tracking-[0.1em] hover:bg-[#e5e2e1] hover:text-[#131313] cursor-pointer"
        >
          SIGN IN WITH GOOGLE
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-[#5f3f3b]" />
          <span className="vapor-label text-[#5f3f3b]">OR</span>
          <div className="flex-1 h-px bg-[#5f3f3b]" />
        </div>

        {/* Email/Password */}
        <div className="space-y-4">
          <input
            type="email"
            placeholder="YOUR@EMAIL.COM"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-12 px-4 bg-transparent border border-[#5f3f3b] text-[#e5e2e1] font-mono text-sm placeholder:text-[#5f3f3b] focus:border-[#ffb4aa] focus:outline-none uppercase tracking-wider"
          />
          <input
            type="password"
            placeholder="PASSWORD"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-12 px-4 bg-transparent border border-[#5f3f3b] text-[#e5e2e1] font-mono text-sm placeholder:text-[#5f3f3b] focus:border-[#ffb4aa] focus:outline-none uppercase tracking-wider"
          />

          {error && (
            <p className="vapor-label text-[#ff2222]">{error}</p>
          )}

          <div className="flex gap-2">
            <button
              onClick={handleEmailSignIn}
              disabled={isSubmitting}
              className="flex-1 h-12 bg-[#e5e2e1] text-[#131313] font-mono text-xs uppercase tracking-[0.1em] hover:bg-[#ffb4aa] disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? "..." : "SIGN IN"}
            </button>
            <button
              onClick={handleEmailSignUp}
              disabled={isSubmitting}
              className="flex-1 h-12 border border-[#e5e2e1] bg-transparent text-[#e5e2e1] font-mono text-xs uppercase tracking-[0.1em] hover:bg-[#e5e2e1] hover:text-[#131313] disabled:opacity-50 cursor-pointer"
            >
              CREATE ACCOUNT
            </button>
          </div>
        </div>

        {/* Footer warning */}
        <p className="vapor-label text-[#ff2222] text-center vapor-urgent-pulse">
          ITEMS SELF-DESTRUCT AFTER 7 DAYS
        </p>
      </div>
    </div>
  );
}
