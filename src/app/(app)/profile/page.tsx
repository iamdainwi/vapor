"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { useRouter } from "next/navigation";

interface AccountStats {
  totalItems: number;
  expiredItems: number;
  daysActive: number;
}

export default function ProfilePage() {
  const { user, updateDisplayName, resetPassword, deleteAccount, signOut } =
    useAuth();
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const [stats, setStats] = useState<AccountStats | null>(null);

  // Feedback states
  const [nameStatus, setNameStatus] = useState("");
  const [resetStatus, setResetStatus] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!user) return;
    // Fetch stats
    const fetchStats = async () => {
      try {
        const idToken = await user.getIdToken();
        const res = await fetch("/api/account/stats", {
          headers: { Authorization: `Bearer ${idToken}` },
        });
        if (res.ok) {
          setStats(await res.json());
        }
      } catch {
        // Stats are non-critical
      }
    };
    fetchStats();
  }, [user]);

  const handleUpdateName = async () => {
    if (!newName.trim()) return;
    try {
      await updateDisplayName(newName.trim());
      setNameStatus("UPDATED");
      setIsEditing(false);
      setTimeout(() => setNameStatus(""), 3000);
    } catch {
      setNameStatus("UPDATE FAILED");
    }
  };

  const handleResetPassword = async () => {
    try {
      await resetPassword();
      setResetStatus("RESET LINK SENT");
      setTimeout(() => setResetStatus(""), 5000);
    } catch {
      setResetStatus("FAILED TO SEND RESET LINK");
    }
  };

  const handleDeleteAccount = async () => {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      return;
    }
    setIsDeleting(true);
    try {
      await deleteAccount();
      router.push("/login");
    } catch {
      setIsDeleting(false);
      setDeleteConfirm(false);
    }
  };

  if (!user) return null;

  const initial = (
    user.displayName?.[0] ||
    user.email?.[0] ||
    "?"
  ).toUpperCase();

  return (
    <div className="flex-1 flex flex-col max-w-3xl w-full mx-auto px-6 py-8">
      {/* Page Header */}
      <div className="mb-10">
        <button
          onClick={() => router.push("/dashboard")}
          className="vapor-label text-[#5f3f3b] hover:text-[#af8782] mb-4 block cursor-pointer"
        >
          ← BACK TO FEED
        </button>
        <h1 className="vapor-display text-[#e5e2e1]">PROFILE</h1>
      </div>

      {/* Identity Section */}
      <section className="border-b border-[#5f3f3b] pb-8 mb-8">
        <div className="flex items-center gap-6">
          {/* Avatar */}
          <div className="w-16 h-16 bg-[#2a2a2a] border border-[#5f3f3b] flex items-center justify-center shrink-0">
            <span className="text-2xl font-bold text-[#e5e2e1]">{initial}</span>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold uppercase tracking-[0.05em] text-[#e5e2e1] truncate">
              {user.displayName || "UNNAMED USER"}
            </h2>
            <p className="vapor-label text-[#af8782] mt-1 truncate">
              {user.email || "NO EMAIL"}
            </p>
          </div>

          {/* Edit trigger */}
          {!isEditing && (
            <button
              onClick={() => {
                setNewName(user.displayName || "");
                setIsEditing(true);
              }}
              className="vapor-label text-[#ffb4aa] hover:text-[#e5e2e1] cursor-pointer shrink-0"
            >
              EDIT
            </button>
          )}
        </div>

        {/* Edit Name Form */}
        {isEditing && (
          <div className="mt-6 space-y-3">
            <input
              type="text"
              placeholder="DISPLAY NAME"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full h-10 px-4 bg-transparent border border-[#5f3f3b] text-[#e5e2e1] font-mono text-sm placeholder:text-[#5f3f3b] focus:border-[#ffb4aa] focus:outline-none uppercase tracking-wider"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={handleUpdateName}
                className="h-9 px-5 bg-[#e5e2e1] text-[#131313] font-mono text-[0.6875rem] uppercase tracking-[0.1em] hover:bg-[#ffb4aa] cursor-pointer"
              >
                UPDATE
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="h-9 px-5 border border-[#e5e2e1] bg-transparent text-[#e5e2e1] font-mono text-[0.6875rem] uppercase tracking-[0.1em] hover:bg-[#e5e2e1] hover:text-[#131313] cursor-pointer"
              >
                CANCEL
              </button>
            </div>
            {nameStatus && (
              <p
                className={`vapor-label ${
                  nameStatus === "UPDATED"
                    ? "text-[#ffb4aa]"
                    : "text-[#ff2222]"
                }`}
              >
                {nameStatus}
              </p>
            )}
          </div>
        )}
      </section>

      {/* Statistics */}
      <section className="mb-8">
        <h3 className="vapor-headline text-[#e5e2e1] mb-4">STATISTICS</h3>
        <div className="grid grid-cols-3 gap-2">
          <div className="border border-[#5f3f3b] bg-[#131313] p-5">
            <p className="text-2xl font-bold text-[#e5e2e1] font-mono">
              {stats?.totalItems ?? "—"}
            </p>
            <p className="vapor-label text-[#af8782] mt-2">ITEMS SAVED</p>
          </div>
          <div className="border border-[#5f3f3b] bg-[#131313] p-5">
            <p className="text-2xl font-bold text-[#e5e2e1] font-mono">
              {stats?.expiredItems ?? "—"}
            </p>
            <p className="vapor-label text-[#af8782] mt-2">ITEMS EXPIRED</p>
          </div>
          <div className="border border-[#5f3f3b] bg-[#131313] p-5">
            <p className="text-2xl font-bold text-[#e5e2e1] font-mono">
              {stats?.daysActive ?? "—"}
            </p>
            <p className="vapor-label text-[#af8782] mt-2">DAYS ACTIVE</p>
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="border-b border-[#5f3f3b] pb-8 mb-8">
        <h3 className="vapor-headline text-[#e5e2e1] mb-4">SECURITY</h3>
        <button
          onClick={handleResetPassword}
          className="h-9 px-5 border border-[#e5e2e1] bg-transparent text-[#e5e2e1] font-mono text-[0.6875rem] uppercase tracking-[0.1em] hover:bg-[#e5e2e1] hover:text-[#131313] cursor-pointer"
        >
          RESET PASSWORD
        </button>
        {resetStatus ? (
          <p
            className={`vapor-label mt-3 ${
              resetStatus.includes("SENT")
                ? "text-[#ffb4aa]"
                : "text-[#ff2222]"
            }`}
          >
            {resetStatus}
          </p>
        ) : (
          <p className="vapor-label text-[#5f3f3b] mt-3">
            A PASSWORD RESET LINK WILL BE SENT TO YOUR EMAIL
          </p>
        )}
      </section>

      {/* Danger Zone */}
      <section className="border border-[#ff2222]/50 bg-[#131313] p-6">
        <h3 className="vapor-headline text-[#ff2222] mb-2">DANGER ZONE</h3>
        <p className="vapor-body text-[#af8782] mb-6">
          THIS ACTION IS PERMANENT. ALL YOUR DATA WILL BE DESTROYED. EVERY
          SAVED ITEM, EVERY TRACE — GONE.
        </p>
        {deleteConfirm ? (
          <div className="space-y-3">
            <p className="vapor-label text-[#ff2222] vapor-urgent-pulse">
              ARE YOU SURE? THERE IS NO GOING BACK.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="h-9 px-5 bg-[#ff2222] text-[#0e0e0e] font-mono text-[0.6875rem] uppercase tracking-[0.1em] font-bold hover:bg-[#ff4444] disabled:opacity-50 cursor-pointer"
              >
                {isDeleting ? "DESTROYING..." : "YES, DELETE EVERYTHING"}
              </button>
              <button
                onClick={() => setDeleteConfirm(false)}
                className="h-9 px-5 border border-[#e5e2e1] bg-transparent text-[#e5e2e1] font-mono text-[0.6875rem] uppercase tracking-[0.1em] hover:bg-[#e5e2e1] hover:text-[#131313] cursor-pointer"
              >
                CANCEL
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={handleDeleteAccount}
            className="h-9 px-5 bg-[#ff2222] text-[#0e0e0e] font-mono text-[0.6875rem] uppercase tracking-[0.1em] font-bold hover:bg-[#ff4444] cursor-pointer"
          >
            DELETE MY ACCOUNT
          </button>
        )}
      </section>

      {/* Bottom spacer */}
      <div className="h-16" />
    </div>
  );
}
