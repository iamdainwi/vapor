"use client";

import { useState } from "react";
import { useAuth } from "@/components/providers/auth-provider";

export function IngestForm() {
  const { user } = useAuth();
  const [url, setUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || !user) return;

    setError("");
    setIsSubmitting(true);

    try {
      const idToken = await user.getIdToken();
      const res = await fetch("/api/ingest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ url: url.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Ingestion failed");
      }

      setUrl("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="flex gap-0 bg-[#19191c] rounded-xl overflow-hidden">
        <input
          type="url"
          placeholder="Paste article URL here..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={isSubmitting}
          className="flex-1 h-12 px-5 bg-transparent text-[#f9f5f8] text-sm placeholder:text-[#48474a] focus:outline-none disabled:opacity-50"
          required
        />
        <button
          type="submit"
          disabled={isSubmitting || !url.trim()}
          className="h-12 px-6 gradient-primary text-black text-sm font-semibold flex items-center gap-2 hover:scale-105 disabled:opacity-40 disabled:hover:scale-100 cursor-pointer shrink-0 transition-transform ease-premium duration-300"
        >
          {isSubmitting ? "Saving..." : "Summarize"}
          {!isSubmitting && (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
    </form>
  );
}
