"use client";

import { CountdownTimer } from "@/components/countdown-timer";
import { useAuth } from "@/components/providers/auth-provider";
import { useState } from "react";

interface ContentItem {
  id: string;
  userId: string;
  originalUrl: string;
  title: string;
  summary: string[];
  status: "processing" | "ready" | "failed";
  createdAt: number;
  expiresAt: number;
}

interface ContentCardProps {
  item: ContentItem;
}

/** Extracts a pseudo-category from the URL domain */
function getCategory(url: string): string {
  try {
    const host = new URL(url).hostname.replace("www.", "");
    const parts = host.split(".");
    return parts[0].toUpperCase();
  } catch {
    return "ARTICLE";
  }
}

export function ContentCard({ item }: ContentCardProps) {
  const { user } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!user) return;
    setIsDeleting(true);
    try {
      const idToken = await user.getIdToken();
      await fetch("/api/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ itemId: item.id }),
      });
    } catch {
      // handled by listener
    } finally {
      setIsDeleting(false);
    }
  };

  const category = getCategory(item.originalUrl);

  // Processing state
  if (item.status === "processing") {
    return (
      <article className="bg-[#19191c] rounded-xl p-6 transition-all ease-premium duration-300">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs text-[#ba9eff] font-bold tracking-widest uppercase">{category}</span>
          <span className="text-xs text-[#48474a] tracking-widest uppercase">Processing...</span>
        </div>
        <div className="space-y-3">
          <div className="h-5 bg-[#262528] rounded-lg w-3/4 animate-pulse" />
          <div className="h-3.5 bg-[#1f1f22] rounded-lg w-full animate-pulse delay-75" />
          <div className="h-3.5 bg-[#1f1f22] rounded-lg w-5/6 animate-pulse delay-150" />
        </div>
        <div className="mt-5">
          <CountdownTimer expiresAt={item.expiresAt} />
        </div>
      </article>
    );
  }

  // Failed state
  if (item.status === "failed") {
    return (
      <article className="bg-[#19191c] rounded-xl p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-red-400 font-bold tracking-widest uppercase">Failed</span>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-xs text-[#48474a] hover:text-red-400 cursor-pointer transition-colors ease-premium duration-300"
          >
            {isDeleting ? "..." : "Remove"}
          </button>
        </div>
        <p className="text-xs text-[#48474a] truncate">{item.originalUrl}</p>
      </article>
    );
  }

  const thesis = item.summary[0] || "";

  return (
    <article className="bg-[#19191c] rounded-xl p-6 hover:scale-[1.02] transition-transform ease-premium duration-300 flex flex-col">
      {/* Category + remaining */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-[#ba9eff] font-bold tracking-widest uppercase">{category}</span>
        <CountdownTimer expiresAt={item.expiresAt} variant="text" />
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-[#f9f5f8] tracking-tight leading-snug mb-3">
        {item.title || "Untitled"}
      </h3>

      {/* Summary */}
      {thesis && (
        <p className="text-sm text-[#adaaad] leading-relaxed mb-6 line-clamp-3">
          {thesis}
        </p>
      )}

      {/* Action row */}
      <div className="flex items-center gap-3 mt-auto mb-4">
        <a
          href={item.originalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="h-9 px-5 gradient-primary text-black text-xs font-bold rounded-md hover:scale-105 cursor-pointer transition-transform ease-premium duration-300 inline-flex items-center"
        >
          Read Now
        </a>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="text-sm text-[#adaaad] hover:text-red-400 cursor-pointer transition-colors ease-premium duration-300"
        >
          {isDeleting ? "..." : "Remove"}
        </button>
      </div>

      {/* Decay bar */}
      <CountdownTimer expiresAt={item.expiresAt} variant="bar" />
    </article>
  );
}
