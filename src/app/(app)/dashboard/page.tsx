"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { IngestForm } from "@/components/ingest-form";
import { ContentCard } from "@/components/content-card";
import { EmptyState } from "@/components/empty-state";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

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

export default function ArchivePage() {
  const { user } = useAuth();
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "content_items"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newItems: ContentItem[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        newItems.push({
          id: doc.id,
          userId: data.userId,
          originalUrl: data.originalUrl,
          title: data.title,
          summary: data.summary || [],
          status: data.status,
          createdAt: data.createdAt?.toMillis?.() || data.createdAt,
          expiresAt: data.expiresAt?.toMillis?.() || data.expiresAt,
        });
      });
      setItems(newItems);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  // Calculate stats
  const activeItems = items.filter((i) => i.status === "ready").length;
  const totalItems = items.length;

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-[#ba9eff]/30 border-t-[#ba9eff] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex max-w-7xl w-full mx-auto px-8 py-8 gap-8">
      {/* ─── MAIN CONTENT ─── */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#f9f5f8] tracking-tight">
              Archive
            </h1>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#19191c] rounded-full">
              <div className="w-2 h-2 rounded-full bg-[#ba9eff] animate-pulse" />
              <span className="text-xs text-[#adaaad] font-medium tracking-wider uppercase">Active Sync</span>
            </div>
          </div>
          <p className="text-sm text-[#adaaad] leading-relaxed">
            Temporal repository for volatile data leases. Items evaporate upon expiration.
          </p>
        </div>

        {/* Ingest Form */}
        <IngestForm />

        {/* Spacing */}
        <div className="h-8" />

        {/* Cards grid */}
        {items.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {items.map((item) => (
              <ContentCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>

      {/* ─── SIDEBAR ─── */}
      <aside className="hidden lg:block w-72 shrink-0 space-y-6">
        {/* System Status */}
        <div className="bg-[#19191c] rounded-xl p-6 space-y-5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#5e2c91]/40 rounded flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ba9eff" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
            </div>
            <span className="text-sm font-bold text-[#f9f5f8]">System Status</span>
          </div>

          <StatRow label="Active Leases" value={String(activeItems)} />
          <StatRow label="Queue Integrity" value={totalItems > 0 ? `${Math.round((activeItems / totalItems) * 100)}%` : "—"} />
          <StatRow label="Total Vaporized" value="—" />
        </div>

        {/* Reading Velocity */}
        <div className="bg-[#19191c] rounded-xl p-6">
          <span className="text-xs text-[#adaaad] tracking-widest uppercase font-medium">Reading Velocity</span>
          <div className="flex items-end gap-1 mt-4 h-20">
            {[40, 65, 30, 80, 55, 70, 45, 60, 35, 75, 50, 85].map((h, i) => (
              <div key={i} className="flex-1 gradient-primary rounded-sm opacity-30" style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>

        {/* Quote */}
        <div className="bg-[#19191c] rounded-xl p-6">
          <p className="text-sm text-[#adaaad] italic leading-relaxed">
            &ldquo;Memory is the residue of design. We curate what remains by deciding what to let go.&rdquo;
          </p>
        </div>
      </aside>
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-[#adaaad] tracking-widest uppercase font-medium">{label}</span>
      <span className="text-xl font-bold text-[#f9f5f8]">{value}</span>
    </div>
  );
}
