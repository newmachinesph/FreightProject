"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

interface Props {
  userId: string;
  isBanned: boolean;
  isAdmin: boolean;
  isSelf: boolean;
}

export default function UserActions({ userId, isBanned, isAdmin, isSelf }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Super admins cannot be banned or demoted by anyone (including themselves)
  if (isAdmin) {
    return (
      <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
        <span style={{ fontSize: 11, color: "var(--text-4)", padding: "5px 10px" }}>
          Protected
        </span>
      </div>
    );
  }

  // Don't allow self-actions (extra safety)
  if (isSelf) {
    return null;
  }

  async function toggleBan() {
    setLoading(true);
    if (isBanned) {
      await authClient.admin.unbanUser({ userId });
    } else {
      await authClient.admin.banUser({ userId, banReason: "Banned by admin" });
    }
    setLoading(false);
    router.refresh();
  }

  async function setRole() {
    setLoading(true);
    await authClient.admin.setRole({
      userId,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      role: "user" as any,
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
      <button
        onClick={toggleBan}
        disabled={loading}
        className={isBanned ? "btn-ghost" : "btn-danger"}
        style={{ padding: "5px 10px", fontSize: 12 }}
      >
        {isBanned ? "Unban" : "Ban"}
      </button>
    </div>
  );
}
