import { NextResponse } from "next/server";
import { verifyAuthToken } from "@/lib/auth-verify";
import { getAdminDb } from "@/lib/firebase-admin";

export async function GET(request: Request) {
  const decodedToken = await verifyAuthToken(request);
  if (!decodedToken) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const db = getAdminDb();
  const uid = decodedToken.uid;

  // Count total items (active + expired/deleted would need history tracking)
  const itemsSnapshot = await db
    .collection("content_items")
    .where("userId", "==", uid)
    .get();

  const totalItems = itemsSnapshot.size;

  // Count expired items (items past their expiry but not yet cleaned up)
  const now = new Date();
  let expiredItems = 0;
  itemsSnapshot.forEach((doc) => {
    const data = doc.data();
    if (data.expiresAt && data.expiresAt.toDate() < now) {
      expiredItems++;
    }
  });

  // Calculate days active from auth creation time
  const userRecord = await (
    await import("@/lib/firebase-admin")
  )
    .getAdminAuth()
    .getUser(uid);

  const createdAt = new Date(userRecord.metadata.creationTime!);
  const daysActive = Math.max(
    1,
    Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24))
  );

  return NextResponse.json({
    totalItems,
    expiredItems,
    daysActive,
  });
}
