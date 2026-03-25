import { NextResponse } from "next/server";
import { verifyAuthToken } from "@/lib/auth-verify";
import { getAdminDb } from "@/lib/firebase-admin";

export async function POST(request: Request) {
  // Verify auth
  const decodedToken = await verifyAuthToken(request);
  if (!decodedToken) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  // Parse body
  let itemId: string;
  try {
    const body = await request.json();
    itemId = body.itemId;
  } catch {
    return NextResponse.json({ error: "INVALID REQUEST" }, { status: 400 });
  }

  if (!itemId || typeof itemId !== "string") {
    return NextResponse.json({ error: "ITEM ID REQUIRED" }, { status: 400 });
  }

  const db = getAdminDb();

  // Verify ownership
  const doc = await db.collection("content_items").doc(itemId).get();
  if (!doc.exists) {
    return NextResponse.json({ error: "NOT FOUND" }, { status: 404 });
  }

  const data = doc.data();
  if (data?.userId !== decodedToken.uid) {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }

  // Delete
  await db.collection("content_items").doc(itemId).delete();

  return NextResponse.json({ deleted: true });
}
