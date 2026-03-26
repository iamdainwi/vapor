"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

export default function AppLayout({ children }: { children: ReactNode }) {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#0e0e10]">
        <div className="w-5 h-5 border-2 border-[#ba9eff]/30 border-t-[#ba9eff] rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex-1 flex flex-col">
      {/* Top bar */}
      <header className="px-8 py-4 flex items-center justify-between bg-[#0e0e10] sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <span
            className="text-lg font-bold text-[#ba9eff] tracking-tight italic cursor-pointer"
            onClick={() => router.push("/dashboard")}
          >
            Vapor
          </span>
          <nav className="hidden sm:flex items-center gap-5">
            <span className="text-sm text-[#adaaad] hover:text-[#f9f5f8] cursor-pointer transition-colors ease-premium duration-300">Feed</span>
            <span className="text-sm text-[#f9f5f8] font-medium cursor-pointer">Archive</span>
            <span className="text-sm text-[#adaaad] hover:text-[#f9f5f8] cursor-pointer transition-colors ease-premium duration-300"
              onClick={() => router.push("/profile")}
            >Settings</span>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center h-9 px-4 bg-[#19191c] rounded-lg">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#48474a" strokeWidth="2" className="mr-2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
            </svg>
            <span className="text-xs text-[#48474a]">Search archive...</span>
          </div>
          <button
            onClick={signOut}
            className="w-8 h-8 rounded-full bg-[#5e2c91] flex items-center justify-center text-xs text-[#e3c4ff] font-bold cursor-pointer hover:scale-110 transition-transform ease-premium duration-300"
          >
            {(user.displayName?.[0] || user.email?.[0] || "?").toUpperCase()}
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}
