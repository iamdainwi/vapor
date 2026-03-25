import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { Timestamp } from "firebase-admin/firestore";

export async function POST(request: Request) {
  // Verify cleanup secret
  const authHeader = request.headers.get("Authorization");
  const expectedSecret = process.env.CLEANUP_API_SECRET;

  if (!expectedSecret || authHeader !== `Bearer ${expectedSecret}`) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const db = getAdminDb();
  const now = Timestamp.now();

  // Query expired items
  const expiredQuery = await db
    .collection("content_items")
    .where("expiresAt", "<", now)
    .get();

  if (expiredQuery.empty) {
    return NextResponse.json({ deleted: 0, message: "NO EXPIRED ITEMS" });
  }

  // Batch delete
  const batch = db.batch();
  let count = 0;

  expiredQuery.forEach((doc) => {
    batch.delete(doc.ref);
    count++;
  });

  await batch.commit();

  return NextResponse.json({
    deleted: count,
    message: `${count} ITEMS DESTROYED`,
  });
}
