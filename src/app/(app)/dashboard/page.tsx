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

export default function FeedPage() {
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

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <span className="vapor-label text-[#af8782]">LOADING FEED...</span>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col max-w-4xl w-full mx-auto px-6 py-8">
      {/* URL Ingest Form */}
      <IngestForm />

      {/* Divider */}
      <div className="h-px bg-[#5f3f3b] my-8" />

      {/* Feed */}
      {items.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((item) => (
            <ContentCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
