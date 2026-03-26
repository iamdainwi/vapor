import { NextResponse } from "next/server";
import { verifyAuthToken } from "@/lib/auth-verify";
import { getAdminDb } from "@/lib/firebase-admin";
import { scrapeUrl } from "@/lib/scraper";
import { summarizeText } from "@/lib/ollama";
import { Timestamp } from "firebase-admin/firestore";

export async function POST(request: Request) {
  // Verify auth
  const decodedToken = await verifyAuthToken(request);
  if (!decodedToken) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  // Parse body
  let url: string;
  try {
    const body = await request.json();
    url = body.url;
  } catch {
    return NextResponse.json({ error: "INVALID REQUEST" }, { status: 400 });
  }

  if (!url || typeof url !== "string") {
    return NextResponse.json({ error: "URL REQUIRED" }, { status: 400 });
  }

  // Validate URL
  try {
    new URL(url);
  } catch {
    return NextResponse.json({ error: "INVALID URL" }, { status: 400 });
  }

  const db = getAdminDb();
  const now = Timestamp.now();
  const expiresAt = Timestamp.fromMillis(
    now.toMillis() + 7 * 24 * 60 * 60 * 1000
  );

  // Create the document first as "processing"
  const docRef = await db.collection("content_items").add({
    userId: decodedToken.uid,
    originalUrl: url,
    title: "",
    summary: [],
    status: "processing",
    createdAt: now,
    expiresAt: expiresAt,
  });

  // Process in background (don't await — return immediately)
  processUrl(docRef.id, url).catch(async () => {
    await db.collection("content_items").doc(docRef.id).update({
      status: "failed",
    });
  });

  return NextResponse.json({ id: docRef.id, status: "processing" });
}

async function processUrl(docId: string, url: string) {
  const db = getAdminDb();

  // Step 1: Scrape
  const { title, textContent } = await scrapeUrl(url);

  // Step 2: Summarize
  const { titleText, thesis, bullets } = await summarizeText(textContent);

  // Step 3: Update document
  await db
    .collection("content_items")
    .doc(docId)
    .update({
      title: titleText,
      summary: [thesis, ...bullets],
      status: "ready",
    });
}
