"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [user, loading, router]);

  if (loading || user) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-[#ba9eff]/30 border-t-[#ba9eff] rounded-full animate-spin" />
      </div>
    );
  }

  const handleSummarize = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      router.push(`/login?url=${encodeURIComponent(url.trim())}`);
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0e0e10]">
      {/* ─── NAV ─── */}
      <nav className="flex items-center justify-between px-8 py-5">
        <span className="text-lg font-bold text-[#ba9eff] tracking-tight italic">
          VAPOR
        </span>
        <div className="flex items-center gap-6">
          <span className="text-sm text-[#f9f5f8] font-medium cursor-pointer hover:text-[#ba9eff] transition-colors ease-premium duration-300">Library</span>
          <span className="text-sm text-[#adaaad] cursor-pointer hover:text-[#f9f5f8] transition-colors ease-premium duration-300">Reader</span>
          <span className="text-sm text-[#adaaad] cursor-pointer hover:text-[#f9f5f8] transition-colors ease-premium duration-300">Explore</span>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="flex flex-col items-center text-center px-6 pt-16 pb-20">
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6">
          <span className="text-[#f9f5f8]">FOCUS ON WHAT</span>
          <br />
          <span className="text-[#ba9eff]">MATTERS.</span>
          <br />
          <span className="text-[#f9f5f8]">LET THE REST</span>
          <br />
          <span className="text-[#ba9eff] italic font-light opacity-70">EVAPORATE.</span>
        </h1>

        <p className="text-[#adaaad] text-base max-w-md mx-auto mb-10 leading-relaxed">
          The anti-hoarding reader. No archives, no clutter. Just pure content that dissolves when you&apos;re done.
        </p>

        {/* URL Input */}
        <form onSubmit={handleSummarize} className="flex gap-0 max-w-lg w-full mx-auto bg-[#19191c] rounded-xl overflow-hidden">
          <input
            type="url"
            placeholder="Paste article URL here..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 h-12 px-5 bg-transparent text-[#f9f5f8] text-sm placeholder:text-[#48474a] focus:outline-none"
          />
          <button
            type="submit"
            className="h-12 px-6 gradient-primary text-black text-sm font-semibold flex items-center gap-2 hover:scale-105 cursor-pointer transition-transform ease-premium duration-300 shrink-0"
          >
            Summarize
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </form>
      </section>

      {/* ─── GALLERY SECTION ─── */}
      <section className="px-8 py-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left: Editorial text */}
          <div>
            <div className="inline-flex px-3 py-1 bg-[#5e2c91] rounded text-[#e3c4ff] text-xs font-bold tracking-widest uppercase mb-6">
              Experience Intent
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#f9f5f8] tracking-tight leading-tight mb-6">
              Your library is a gallery,<br />not a graveyard.
            </h2>
            <p className="text-[#adaaad] text-sm leading-relaxed mb-8 max-w-md">
              Cards don&apos;t sit still. They breathe and decay. Use the &ldquo;Decay Bar&rdquo; to track your reading momentum. Once the bar empties, the content vanishes forever.
            </p>
            <div className="flex gap-12">
              <div>
                <p className="text-2xl font-bold text-[#f9f5f8]">0%</p>
                <p className="text-xs text-[#adaaad] tracking-widest uppercase mt-1">Retention Rate</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#f9f5f8]">∞</p>
                <p className="text-xs text-[#adaaad] tracking-widest uppercase mt-1">Mental Clarity</p>
              </div>
            </div>
          </div>

          {/* Right: Preview cards */}
          <div className="space-y-4">
            <PreviewCard
              category="DEEP TECH"
              title="The Future of Neural Interfaces in 2024"
              summary="Exploring the convergence of biological signals and silicon processing in the next decade."
              remaining="4h 12m"
              percentage={60}
            />
            <PreviewCard
              category="DESIGN"
              title="Why Minimalism is Dying"
              summary="The pendulum swings: how maximalism is reshaping digital product design."
              remaining="1h 30m"
              percentage={15}
            />
          </div>
        </div>
      </section>

      {/* ─── PHILOSOPHY SECTION ─── */}
      <section className="px-8 py-20">
        <div className="max-w-6xl mx-auto text-center mb-14">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#f9f5f8] tracking-tight uppercase">
            The Anti-Hoarding Philosophy
          </h2>
          <div className="w-10 h-1 gradient-primary mx-auto mt-4 rounded-full" />
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Auto-Purge Engine — large card */}
          <div className="bg-[#19191c] rounded-xl p-8 row-span-2 flex flex-col">
            <div className="w-10 h-10 bg-[#5e2c91]/30 rounded-lg flex items-center justify-center mb-5">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ba9eff" strokeWidth="1.5">
                <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#f9f5f8] tracking-tight mb-3">Auto-Purge Engine</h3>
            <p className="text-sm text-[#adaaad] leading-relaxed mb-6">
              VAPOR identifies content that you&apos;ve finished reading or haven&apos;t touched in 48 hours and clears it from your space automatically.
            </p>
            <div className="flex-1 bg-[#131315] rounded-lg overflow-hidden mt-auto">
              <div className="h-32 flex items-end p-4">
                <div className="flex gap-1 items-end h-full">
                  {[60, 80, 45, 90, 30, 70, 50, 85, 40, 75].map((h, i) => (
                    <div key={i} className="flex-1 gradient-primary rounded-sm opacity-40" style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Summary First */}
          <div className="bg-[#19191c] rounded-xl p-8 flex flex-col">
            <div className="w-10 h-10 bg-[#5e2c91]/30 rounded-lg flex items-center justify-center mb-5">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ba9eff" strokeWidth="1.5">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#f9f5f8] tracking-tight mb-3">Summary First</h3>
            <p className="text-sm text-[#adaaad] leading-relaxed mb-6">
              Don&apos;t waste time on fluff. Get an AI-driven essence of every link before you decide to commit your focus.
            </p>
            <button
              onClick={() => router.push("/login")}
              className="text-sm text-[#ba9eff] font-medium flex items-center gap-1.5 hover:gap-3 cursor-pointer transition-all ease-premium duration-300 mt-auto"
            >
              Try the Summarizer <span>→</span>
            </button>
          </div>

          {/* Zero Data Trails */}
          <div className="bg-[#19191c] rounded-xl p-8">
            <div className="w-10 h-10 bg-[#5e2c91]/30 rounded-lg flex items-center justify-center mb-5">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ba9eff" strokeWidth="1.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#f9f5f8] tracking-tight mb-3">Zero Data Trails</h3>
            <p className="text-sm text-[#adaaad] leading-relaxed">
              We don&apos;t sell your interests. Once content evaporates, the data point dies with it. Your reading habits are ephemeral.
            </p>
          </div>
        </div>

        {/* Reader Optimized */}
        <div className="max-w-6xl mx-auto mt-6">
          <div className="bg-[#19191c] rounded-xl p-8 flex flex-col sm:flex-row gap-8 items-start">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-[#f9f5f8] tracking-tight mb-3">Reader Optimized</h3>
              <p className="text-sm text-[#adaaad] leading-relaxed mb-5">
                Pure editorial layouts. No ads, no popups, no distractions. Just the typography of your thoughts.
              </p>
              <div className="flex gap-2 flex-wrap">
                {["Serif Mode", "Dark OLED", "Focus Lock"].map((tag) => (
                  <span key={tag} className="px-3 py-1.5 bg-[#262528] rounded-md text-xs text-[#adaaad] font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA SECTION ─── */}
      <section className="px-8 py-24 text-center">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-[#f9f5f8] tracking-tight italic mb-8">
          READY TO CLEAR THE FOG?
        </h2>
        <div className="flex items-center justify-center gap-4 mb-6">
          <button
            onClick={() => router.push("/login")}
            className="h-12 px-8 gradient-primary text-black text-sm font-bold rounded-full hover:scale-105 hover:shadow-lg glow-primary-strong cursor-pointer transition-all ease-premium duration-300"
          >
            GET VAPOR NOW
          </button>
          <button className="h-12 px-8 bg-transparent border border-[rgba(72,71,74,0.4)] text-[#f9f5f8] text-sm font-bold rounded-full hover:scale-105 hover:bg-[#19191c] cursor-pointer transition-all ease-premium duration-300">
            WATCH DEMO
          </button>
        </div>
        <p className="text-xs text-[#adaaad] tracking-widest uppercase">
          Join 12,000+ intentional readers
        </p>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="px-8 py-10 text-center space-y-4">
        <span className="text-sm font-bold text-[#ba9eff] italic">VAPOR</span>
        <div className="flex items-center justify-center gap-6">
          {["Terms", "Privacy", "Twitter", "Contact"].map((link) => (
            <span key={link} className="text-xs text-[#adaaad] cursor-pointer hover:text-[#f9f5f8] transition-colors ease-premium duration-300">
              {link}
            </span>
          ))}
        </div>
        <p className="text-xs text-[#48474a]">
          © 2024 Vapor Labs. Built to vanish.
        </p>
      </footer>
    </div>
  );
}

/* ─── Sub-component ─── */
function PreviewCard({
  category,
  title,
  summary,
  remaining,
  percentage,
}: {
  category: string;
  title: string;
  summary: string;
  remaining: string;
  percentage: number;
}) {
  const barColor = percentage > 50 ? "bg-[#ba9eff]" : percentage > 20 ? "bg-amber-500" : "bg-red-500";

  return (
    <div className="bg-[#19191c] rounded-xl p-6 hover:scale-[1.02] transition-transform ease-premium duration-300 cursor-pointer">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-[#ba9eff] font-bold tracking-widest uppercase">{category}</span>
        <div className="w-6 h-6 rounded-full bg-[#262528] flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-[#ba9eff] opacity-50" />
        </div>
      </div>
      <h3 className="text-base font-bold text-[#f9f5f8] tracking-tight mb-2 leading-snug">{title}</h3>
      <p className="text-sm text-[#adaaad] leading-relaxed mb-4">{summary}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-[#48474a] tracking-widest uppercase">Time remaining</span>
        <span className="text-xs text-[#adaaad] font-medium">{remaining}</span>
      </div>
      <div className="w-full h-1 bg-[#262528] rounded-full mt-2 overflow-hidden">
        <div className={`h-full ${barColor} rounded-full decay-bar-glow`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
