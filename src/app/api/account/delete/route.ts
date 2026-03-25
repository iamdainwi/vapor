import { NextResponse } from "next/server";
import { verifyAuthToken } from "@/lib/auth-verify";
import { getAdminDb } from "@/lib/firebase-admin";

export async function POST(request: Request) {
  const decodedToken = await verifyAuthToken(request);
  if (!decodedToken) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const db = getAdminDb();
  const uid = decodedToken.uid;

  // Delete all content items for this user
  const itemsSnapshot = await db
    .collection("content_items")
    .where("userId", "==", uid)
    .get();

  const batch = db.batch();
  itemsSnapshot.forEach((doc) => {
    batch.delete(doc.ref);
  });

  // Delete user document if it exists
  const userDoc = db.collection("users").doc(uid);
  const userSnapshot = await userDoc.get();
  if (userSnapshot.exists) {
    batch.delete(userDoc);
  }

  await batch.commit();

  return NextResponse.json({
    deleted: true,
    itemsRemoved: itemsSnapshot.size,
  });
}
