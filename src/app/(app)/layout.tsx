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
      <div className="flex-1 flex items-center justify-center bg-[#0e0e0e]">
        <span className="vapor-label text-[#af8782]">LOADING...</span>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex-1 flex flex-col">
      {/* Top Bar */}
      <header className="border-b border-[#5f3f3b] px-6 py-4 flex items-center justify-between bg-[#0e0e0e]">
        <h1
          className="text-xl font-bold uppercase tracking-[0.15em] text-[#e5e2e1] cursor-pointer"
          onClick={() => router.push("/")}
        >
          VAPOR
        </h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/profile")}
            className="vapor-label text-[#af8782] hover:text-[#ffb4aa] hidden sm:inline cursor-pointer"
          >
            {user.email ?? user.displayName ?? "USER"}
          </button>
          <button
            onClick={signOut}
            className="h-8 px-4 border border-[#e5e2e1] bg-transparent text-[#e5e2e1] font-mono text-[0.6875rem] uppercase tracking-[0.1em] hover:bg-[#e5e2e1] hover:text-[#131313] cursor-pointer"
          >
            SIGN OUT
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}
