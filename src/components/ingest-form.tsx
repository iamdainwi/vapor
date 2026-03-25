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
        throw new Error(data.error || "INGESTION FAILED");
      }

      setUrl("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "UNKNOWN ERROR");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="flex gap-2">
        <input
          type="url"
          placeholder="PASTE A URL AND HIT ENTER"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={isSubmitting}
          className="flex-1 h-12 px-4 bg-transparent border border-[#5f3f3b] text-[#e5e2e1] font-mono text-sm placeholder:text-[#5f3f3b] focus:border-[#ffb4aa] focus:outline-none uppercase tracking-wider disabled:opacity-50"
          required
        />
        <button
          type="submit"
          disabled={isSubmitting || !url.trim()}
          className="h-12 px-6 bg-[#e5e2e1] text-[#131313] font-mono text-xs uppercase tracking-[0.1em] hover:bg-[#ffb4aa] disabled:opacity-50 cursor-pointer shrink-0"
        >
          {isSubmitting ? "SAVING..." : "SAVE"}
        </button>
      </div>
      {error && <p className="vapor-label text-[#ff2222]">{error}</p>}
    </form>
  );
}
