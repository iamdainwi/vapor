import { getAdminAuth } from "@/lib/firebase-admin";
import type { DecodedIdToken } from "firebase-admin/auth";

/**
 * Verifies a Firebase ID token from the Authorization header.
 * Returns the decoded token or null if invalid.
 */
export async function verifyAuthToken(
  request: Request
): Promise<DecodedIdToken | null> {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  const idToken = authHeader.split("Bearer ")[1];
  if (!idToken) return null;

  try {
    const auth = getAdminAuth();
    const decodedToken = await auth.verifyIdToken(idToken);
    return decodedToken;
  } catch {
    return null;
  }
}
