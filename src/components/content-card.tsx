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
      // Item will be removed from real-time listener anyway
    } finally {
      setIsDeleting(false);
    }
  };

  // Processing state
  if (item.status === "processing") {
    return (
      <article className="border border-[#5f3f3b] bg-[#131313] p-6 hover:border-[#ffb4aa]">
        <div className="flex items-center justify-between mb-3">
          <span className="vapor-label text-[#af8782]">PROCESSING...</span>
          <CountdownTimer expiresAt={item.expiresAt} />
        </div>
        <p className="vapor-label text-[#5f3f3b] truncate">{item.originalUrl}</p>
        <div className="mt-4 space-y-2">
          <div className="h-4 bg-[#201f1f] w-3/4" />
          <div className="h-3 bg-[#201f1f] w-full" />
          <div className="h-3 bg-[#201f1f] w-5/6" />
          <div className="h-3 bg-[#201f1f] w-2/3" />
        </div>
      </article>
    );
  }

  // Failed state
  if (item.status === "failed") {
    return (
      <article className="border border-[#ff2222]/30 bg-[#131313] p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="vapor-label text-[#ff2222]">EXTRACTION FAILED</span>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="vapor-label text-[#ff2222] hover:text-[#e5e2e1] cursor-pointer disabled:opacity-50"
          >
            {isDeleting ? "..." : "DELETE"}
          </button>
        </div>
        <p className="vapor-label text-[#5f3f3b] truncate">{item.originalUrl}</p>
      </article>
    );
  }

  return (
    <article className="border border-[#5f3f3b] bg-[#131313] p-6 hover:border-[#ffb4aa] group">
      {/* Title */}
      <h2 className="text-sm font-bold uppercase tracking-[0.05em] text-[#e5e2e1] mb-1 leading-snug">
        {item.title || "UNTITLED"}
      </h2>

      {/* URL */}
      <a
        href={item.originalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="vapor-label text-[#5f3f3b] hover:text-[#af8782] block truncate mb-4"
      >
        {item.originalUrl}
      </a>

      {/* Summary bullets */}
      <div className="space-y-2 mb-6">
        {item.summary.map((bullet, i) => (
          <p key={i} className="vapor-body text-[#af8782] pl-4">
            <span className="text-[#5f3f3b] mr-2">—</span>
            {bullet}
          </p>
        ))}
      </div>

      {/* Bottom row: countdown + delete */}
      <div className="flex items-center justify-between pt-4 border-t border-[#5f3f3b]/50">
        <CountdownTimer expiresAt={item.expiresAt} />
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="vapor-label text-[#ff2222] hover:text-[#e5e2e1] cursor-pointer disabled:opacity-50"
        >
          {isDeleting ? "..." : "DELETE"}
        </button>
      </div>
    </article>
  );
}
