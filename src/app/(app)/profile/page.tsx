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
  const { user, updateDisplayName, resetPassword, deleteAccount } = useAuth();
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const [stats, setStats] = useState<AccountStats | null>(null);
  const [nameStatus, setNameStatus] = useState("");
  const [resetStatus, setResetStatus] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchStats = async () => {
      try {
        const idToken = await user.getIdToken();
        const res = await fetch("/api/account/stats", {
          headers: { Authorization: `Bearer ${idToken}` },
        });
        if (res.ok) setStats(await res.json());
      } catch {
        // non-critical
      }
    };
    fetchStats();
  }, [user]);

  const handleUpdateName = async () => {
    if (!newName.trim()) return;
    try {
      await updateDisplayName(newName.trim());
      setNameStatus("Updated");
      setIsEditing(false);
      setTimeout(() => setNameStatus(""), 3000);
    } catch {
      setNameStatus("Failed");
    }
  };

  const handleResetPassword = async () => {
    try {
      await resetPassword();
      setResetStatus("Reset link sent");
      setTimeout(() => setResetStatus(""), 5000);
    } catch {
      setResetStatus("Failed to send");
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

  const initial = (user.displayName?.[0] || user.email?.[0] || "?").toUpperCase();

  return (
    <div className="flex-1 flex flex-col max-w-2xl w-full mx-auto px-8 py-10">
      {/* Header */}
      <div className="mb-10">
        <button
          onClick={() => router.push("/dashboard")}
          className="text-xs text-[#48474a] hover:text-[#adaaad] mb-4 block cursor-pointer transition-colors ease-premium duration-300"
        >
          ← Back to archive
        </button>
        <h1 className="text-3xl font-extrabold text-[#f9f5f8] tracking-tight">Settings</h1>
      </div>

      {/* Identity */}
      <section className="pb-8 mb-8" style={{ borderBottom: '1px solid rgba(72, 71, 74, 0.15)' }}>
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-[#5e2c91] rounded-xl flex items-center justify-center shrink-0">
            <span className="text-xl font-bold text-[#e3c4ff]">{initial}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-[#f9f5f8] truncate tracking-tight">
              {user.displayName || "Unnamed"}
            </h2>
            <p className="text-sm text-[#adaaad] mt-0.5 truncate">{user.email}</p>
          </div>
          {!isEditing && (
            <button
              onClick={() => { setNewName(user.displayName || ""); setIsEditing(true); }}
              className="text-xs text-[#ba9eff] hover:text-[#e3c4ff] cursor-pointer transition-colors ease-premium duration-300"
            >
              Edit
            </button>
          )}
        </div>

        {isEditing && (
          <div className="mt-5 space-y-3">
            <input
              type="text"
              placeholder="Display name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full h-10 px-4 bg-[#262528] rounded-xl text-[#f9f5f8] text-sm placeholder:text-[#48474a] focus:outline-none focus:ring-1 focus:ring-[#ba9eff]/40 transition-all ease-premium duration-300"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={handleUpdateName}
                className="h-9 px-4 gradient-primary text-black text-xs font-bold rounded-md hover:scale-105 cursor-pointer transition-transform ease-premium duration-300"
              >
                Update
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="h-9 px-4 bg-[#19191c] text-[#f9f5f8] text-xs rounded-md hover:bg-[#1f1f22] cursor-pointer transition-colors ease-premium duration-300"
              >
                Cancel
              </button>
            </div>
            {nameStatus && (
              <p className={`text-xs ${nameStatus === "Updated" ? "text-emerald-400" : "text-red-400"}`}>
                {nameStatus}
              </p>
            )}
          </div>
        )}
      </section>

      {/* Stats */}
      <section className="mb-8">
        <span className="text-xs text-[#adaaad] tracking-widest uppercase font-medium block mb-4">Statistics</span>
        <div className="grid grid-cols-3 gap-4">
          {[
            { value: stats?.totalItems, label: "Saved" },
            { value: stats?.expiredItems, label: "Expired" },
            { value: stats?.daysActive, label: "Days active" },
          ].map(({ value, label }) => (
            <div key={label} className="bg-[#19191c] rounded-xl p-5">
              <p className="text-2xl font-bold text-[#f9f5f8] tabular-nums">{value ?? "—"}</p>
              <p className="text-xs text-[#adaaad] mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Security */}
      <section className="pb-8 mb-8" style={{ borderBottom: '1px solid rgba(72, 71, 74, 0.15)' }}>
        <span className="text-xs text-[#adaaad] tracking-widest uppercase font-medium block mb-4">Security</span>
        <button
          onClick={handleResetPassword}
          className="h-9 px-4 bg-[#19191c] text-[#f9f5f8] text-xs rounded-md hover:bg-[#1f1f22] cursor-pointer transition-colors ease-premium duration-300"
        >
          Reset Password
        </button>
        <p className={`text-xs mt-3 ${resetStatus.includes("sent") ? "text-emerald-400" : resetStatus ? "text-red-400" : "text-[#48474a]"}`}>
          {resetStatus || "A reset link will be sent to your email"}
        </p>
      </section>

      {/* Danger */}
      <section className="bg-[#19191c] rounded-xl p-6">
        <span className="text-xs text-red-400 tracking-widest uppercase font-bold block mb-2">Danger zone</span>
        <p className="text-sm text-[#adaaad] mb-5 leading-relaxed">
          Permanently delete your account and all saved data. This cannot be undone.
        </p>
        {deleteConfirm ? (
          <div className="space-y-3">
            <p className="text-xs text-red-400">Are you sure? This is irreversible.</p>
            <div className="flex gap-2">
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="h-9 px-4 bg-red-600 text-white text-xs font-bold rounded-md hover:bg-red-500 disabled:opacity-50 cursor-pointer transition-all ease-premium duration-300"
              >
                {isDeleting ? "Deleting..." : "Yes, delete everything"}
              </button>
              <button
                onClick={() => setDeleteConfirm(false)}
                className="h-9 px-4 bg-[#262528] text-[#f9f5f8] text-xs rounded-md hover:bg-[#2a282e] cursor-pointer transition-colors ease-premium duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={handleDeleteAccount}
            className="h-9 px-4 bg-red-600/10 text-red-400 text-xs font-bold rounded-md hover:bg-red-600/20 cursor-pointer transition-colors ease-premium duration-300"
          >
            Delete my account
          </button>
        )}
      </section>

      <div className="h-16" />
    </div>
  );
}
