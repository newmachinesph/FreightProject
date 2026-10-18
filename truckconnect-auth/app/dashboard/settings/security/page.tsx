"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession, authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

/* ── Password rules (matching sign-up page) ─────────────────────────────── */

const PASSWORD_RULES = [
  { label: "At least 10 characters", test: (p: string) => p.length >= 10 },
  { label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "One lowercase letter", test: (p: string) => /[a-z]/.test(p) },
  { label: "One digit", test: (p: string) => /\d/.test(p) },
];

/* ── Types ───────────────────────────────────────────────────────────────── */

interface SessionInfo {
  id: string;
  userAgent?: string;
  ipAddress?: string;
  createdAt?: string;
  updatedAt?: string;
  current?: boolean;
}

interface ActivityEvent {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  ipAddress?: string;
}

/* ── Helper: Password strength meter ─────────────────────────────────────── */

function PasswordStrengthMeter({ password }: { password: string }) {
  const passed = PASSWORD_RULES.filter((r) => r.test(password)).length;
  const strength = password.length === 0 ? 0 : passed;
  const colors = ["#DC2626", "#F59E0B", "#F59E0B", "#22C55E", "#059669"];
  const labels = ["", "Weak", "Fair", "Good", "Strong"];

  return (
    <div style={{ marginTop: 8 }}>
      {/* Strength bar */}
      <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 3,
              borderRadius: 2,
              background: i < strength ? colors[strength] : "#e5e7eb",
              transition: "background 0.2s",
            }}
          />
        ))}
      </div>
      {password.length > 0 && (
        <div
          style={{
            fontSize: 11,
            color: colors[strength],
            fontWeight: 600,
            marginBottom: 8,
          }}
        >
          {labels[strength]}
        </div>
      )}

      {/* Requirements checklist */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {PASSWORD_RULES.map((rule) => {
          const met = rule.test(password);
          return (
            <div
              key={rule.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 12,
                color: met ? "#059669" : "#9ca3af",
                transition: "color 0.2s",
              }}
            >
              {met ? (
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#059669"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <div
                  style={{
                    width: 13,
                    height: 13,
                    borderRadius: "50%",
                    border: "1.5px solid #d1d5db",
                    flexShrink: 0,
                  }}
                />
              )}
              {rule.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Helper: parse user agent into device / browser ──────────────────────── */

function parseUserAgent(ua?: string): { browser: string; device: string } {
  if (!ua) return { browser: "Unknown browser", device: "Unknown device" };

  let browser = "Unknown browser";
  if (ua.includes("Firefox")) browser = "Firefox";
  else if (ua.includes("Edg/")) browser = "Microsoft Edge";
  else if (ua.includes("Chrome")) browser = "Chrome";
  else if (ua.includes("Safari")) browser = "Safari";
  else if (ua.includes("Opera") || ua.includes("OPR")) browser = "Opera";

  let device = "Unknown device";
  if (ua.includes("Windows")) device = "Windows";
  else if (ua.includes("Macintosh") || ua.includes("Mac OS")) device = "macOS";
  else if (ua.includes("Linux")) device = "Linux";
  else if (ua.includes("Android")) device = "Android";
  else if (ua.includes("iPhone") || ua.includes("iPad")) device = "iOS";

  return { browser, device };
}

/* ── Device icon ─────────────────────────────────────────────────────────── */

function DeviceIcon({ device }: { device: string }) {
  if (
    device === "Windows" ||
    device === "macOS" ||
    device === "Linux"
  ) {
    return (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#6b7280"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    );
  }
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#6b7280"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  );
}

/* ── Activity event type label + color ───────────────────────────────────── */

function eventLabel(type: string): { label: string; color: string; bg: string } {
  switch (type) {
    case "sign_in":
    case "login":
      return { label: "Sign-in", color: "#2563EB", bg: "#EFF6FF" };
    case "password_change":
    case "password_changed":
      return { label: "Password changed", color: "#059669", bg: "#ECFDF5" };
    case "session_revoked":
      return { label: "Session revoked", color: "#F59E0B", bg: "#FFFBEB" };
    case "email_verified":
      return { label: "Email verified", color: "#059669", bg: "#ECFDF5" };
    case "account_updated":
      return { label: "Account updated", color: "#6b7280", bg: "#F3F4F6" };
    default:
      return { label: type.replace(/_/g, " "), color: "#6b7280", bg: "#F3F4F6" };
  }
}

/* ── Main page ───────────────────────────────────────────────────────────── */

export default function SecurityPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  // Change password
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdMsg, setPwdMsg] = useState("");
  const [pwdError, setPwdError] = useState("");
  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);

  // Sessions
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const [revokeAllLoading, setRevokeAllLoading] = useState(false);
  const [sessionMsg, setSessionMsg] = useState("");

  // Activity log
  const [activities, setActivities] = useState<ActivityEvent[]>([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);

  const passwordAllMet = PASSWORD_RULES.every((r) => r.test(newPwd));

  // Fetch sessions
  const fetchSessions = useCallback(async () => {
    setSessionsLoading(true);
    try {
      const res = await authClient.listSessions();
      if (res.data) {
        const currentToken = session?.session?.token;
        const mapped: SessionInfo[] = (res.data as any[]).map((s: any) => ({
          id: s.id ?? s.token,
          userAgent: s.userAgent,
          ipAddress: s.ipAddress,
          createdAt: s.createdAt,
          updatedAt: s.updatedAt,
          current: s.token === currentToken || s.id === session?.session?.id,
        }));
        // Sort: current first, then by updatedAt desc
        mapped.sort((a, b) => {
          if (a.current && !b.current) return -1;
          if (!a.current && b.current) return 1;
          return (
            new Date(b.updatedAt ?? b.createdAt ?? 0).getTime() -
            new Date(a.updatedAt ?? a.createdAt ?? 0).getTime()
          );
        });
        setSessions(mapped);
      }
    } catch {
      setSessions([]);
    }
    setSessionsLoading(false);
  }, [session]);

  useEffect(() => {
    if (session) {
      fetchSessions();
    }
  }, [session, fetchSessions]);

  // Fetch activity log
  useEffect(() => {
    if (!session) return;
    setActivitiesLoading(true);
    fetch("/api/user/activity")
      .then((r) => (r.ok ? r.json() : []))
      .then((data: ActivityEvent[]) => {
        setActivities(Array.isArray(data) ? data.slice(0, 5) : []);
      })
      .catch(() => setActivities([]))
      .finally(() => setActivitiesLoading(false));
  }, [session]);

  if (isPending)
    return (
      <div style={{ padding: 40, color: "#6b7280" }}>Loading...</div>
    );
  if (!session) return null;

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwdError("");
    setPwdMsg("");

    if (!passwordAllMet) {
      setPwdError("Password does not meet all requirements.");
      return;
    }
    if (newPwd !== confirmPwd) {
      setPwdError("New passwords do not match.");
      return;
    }

    setPwdLoading(true);
    const { error } = await authClient.changePassword({
      currentPassword: currentPwd,
      newPassword: newPwd,
    });
    setPwdLoading(false);

    if (error) {
      setPwdError(error.message ?? "Failed to change password.");
      return;
    }
    setPwdMsg("Password changed successfully.");
    setCurrentPwd("");
    setNewPwd("");
    setConfirmPwd("");
  }

  async function handleRevokeSession(sessionId: string) {
    setRevokingId(sessionId);
    setSessionMsg("");
    try {
      await authClient.revokeSession({ token: sessionId });
      setSessionMsg("Session revoked.");
      await fetchSessions();
    } catch {
      setSessionMsg("Failed to revoke session.");
    }
    setRevokingId(null);
  }

  async function handleRevokeAll() {
    setRevokeAllLoading(true);
    setSessionMsg("");
    try {
      await authClient.revokeOtherSessions();
      setSessionMsg("All other sessions have been signed out.");
      await fetchSessions();
    } catch {
      setSessionMsg("Failed to revoke sessions.");
    }
    setRevokeAllLoading(false);
  }

  const sectionStyle: React.CSSProperties = {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    padding: "24px 28px",
    marginBottom: 20,
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    color: "#6b7280",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottom: "1px solid #f3f4f6",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 14,
    fontWeight: 600,
    color: "#374151",
    marginBottom: 6,
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    maxWidth: 340,
    padding: "9px 12px",
    fontSize: 14,
    border: "1px solid #d1d5db",
    borderRadius: 6,
    outline: "none",
    color: "#1a1a1a",
    background: "#fff",
    boxSizing: "border-box",
  };

  const eyeButtonStyle: React.CSSProperties = {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 4,
    color: "#9ca3af",
  };

  return (
    <div style={{ padding: "32px 40px", maxWidth: 800 }}>
      {/* Page header */}
      <div style={{ marginBottom: 32 }}>
        <h1
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: "#1a1a1a",
            margin: 0,
            marginBottom: 4,
          }}
        >
          Security
        </h1>
        <p style={{ fontSize: 14, color: "#6b7280", margin: 0 }}>
          Manage your password, sessions, and two-factor authentication.
        </p>
      </div>

      {/* ── CHANGE PASSWORD ─────────────────────────────────────── */}
      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>Change Password</div>

        <div
          style={{
            background: "#FEF3C7",
            border: "1px solid #FDE68A",
            borderRadius: 6,
            padding: "10px 14px",
            fontSize: 13,
            color: "#92400E",
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#92400E"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          Changing your password will invalidate all existing sessions.
        </div>

        <form onSubmit={handleChangePassword}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            {/* Current password */}
            <div>
              <label style={labelStyle}>Current Password</label>
              <div style={{ position: "relative", maxWidth: 340 }}>
                <input
                  type={showCurrentPwd ? "text" : "password"}
                  value={currentPwd}
                  onChange={(e) => setCurrentPwd(e.target.value)}
                  required
                  style={inputStyle}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPwd(!showCurrentPwd)}
                  style={eyeButtonStyle}
                  tabIndex={-1}
                >
                  {showCurrentPwd ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* New password */}
            <div>
              <label style={labelStyle}>New Password</label>
              <div style={{ position: "relative", maxWidth: 340 }}>
                <input
                  type={showNewPwd ? "text" : "password"}
                  value={newPwd}
                  onChange={(e) => setNewPwd(e.target.value)}
                  required
                  placeholder="At least 10 characters"
                  style={inputStyle}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPwd(!showNewPwd)}
                  style={eyeButtonStyle}
                  tabIndex={-1}
                >
                  {showNewPwd ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              <PasswordStrengthMeter password={newPwd} />
            </div>

            {/* Confirm new password */}
            <div>
              <label style={labelStyle}>Confirm New Password</label>
              <input
                type="password"
                value={confirmPwd}
                onChange={(e) => setConfirmPwd(e.target.value)}
                required
                style={inputStyle}
              />
              {confirmPwd.length > 0 && confirmPwd !== newPwd && (
                <div style={{ fontSize: 12, color: "#DC2626", marginTop: 4 }}>
                  Passwords do not match.
                </div>
              )}
              {confirmPwd.length > 0 && confirmPwd === newPwd && newPwd.length > 0 && (
                <div
                  style={{
                    fontSize: 12,
                    color: "#059669",
                    marginTop: 4,
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#059669"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Passwords match.
                </div>
              )}
            </div>

            {pwdError && (
              <div
                style={{
                  background: "#FEF2F2",
                  border: "1px solid #FECACA",
                  borderRadius: 6,
                  padding: "10px 14px",
                  fontSize: 13,
                  color: "#DC2626",
                }}
              >
                {pwdError}
              </div>
            )}
            {pwdMsg && (
              <div
                style={{
                  background: "#ECFDF5",
                  border: "1px solid #A7F3D0",
                  borderRadius: 6,
                  padding: "10px 14px",
                  fontSize: 13,
                  color: "#059669",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#059669"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {pwdMsg}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={pwdLoading || !passwordAllMet || newPwd !== confirmPwd}
                style={{
                  padding: "9px 20px",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#fff",
                  background:
                    pwdLoading || !passwordAllMet || newPwd !== confirmPwd
                      ? "#93c5fd"
                      : "#2563EB",
                  border: "none",
                  borderRadius: 6,
                  cursor:
                    pwdLoading || !passwordAllMet || newPwd !== confirmPwd
                      ? "not-allowed"
                      : "pointer",
                  transition: "background 0.15s",
                }}
              >
                {pwdLoading ? "Changing..." : "Change Password"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* ── ACTIVE SESSIONS ────────────────────────────────────── */}
      <div style={sectionStyle}>
        <div
          style={{
            ...sectionTitleStyle,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>Active Sessions</span>
          {sessions.length > 1 && (
            <button
              onClick={handleRevokeAll}
              disabled={revokeAllLoading}
              style={{
                padding: "5px 14px",
                fontSize: 12,
                fontWeight: 600,
                color: "#DC2626",
                background: "#fff",
                border: "1px solid #FECACA",
                borderRadius: 6,
                cursor: revokeAllLoading ? "not-allowed" : "pointer",
                textTransform: "none",
                letterSpacing: "normal",
              }}
            >
              {revokeAllLoading
                ? "Revoking..."
                : "Sign Out All Other Devices"}
            </button>
          )}
        </div>

        <p
          style={{
            fontSize: 14,
            color: "#374151",
            marginBottom: 16,
            marginTop: 0,
          }}
        >
          These are the devices currently signed in to your account. Revoke
          access for any session you do not recognize.
        </p>

        {sessionMsg && (
          <div
            style={{
              fontSize: 13,
              padding: "8px 14px",
              borderRadius: 6,
              marginBottom: 16,
              background: sessionMsg.includes("Failed")
                ? "#FEF2F2"
                : "#ECFDF5",
              color: sessionMsg.includes("Failed") ? "#DC2626" : "#059669",
              border: `1px solid ${sessionMsg.includes("Failed") ? "#FECACA" : "#A7F3D0"}`,
            }}
          >
            {sessionMsg}
          </div>
        )}

        {sessionsLoading ? (
          <div style={{ fontSize: 14, color: "#9ca3af", padding: "20px 0" }}>
            Loading sessions...
          </div>
        ) : sessions.length === 0 ? (
          <div style={{ fontSize: 14, color: "#9ca3af", padding: "20px 0" }}>
            No active sessions found.
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 0,
            }}
          >
            {sessions.map((s) => {
              const { browser, device } = parseUserAgent(s.userAgent);
              const lastActive = s.updatedAt ?? s.createdAt;

              return (
                <div
                  key={s.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "14px 0",
                    borderBottom: "1px solid #f3f4f6",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                    }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 8,
                        background: s.current ? "#EFF6FF" : "#F3F4F6",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <DeviceIcon device={device} />
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: "#1a1a1a",
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        {browser} on {device}
                        {s.current && (
                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 600,
                              color: "#059669",
                              background: "#ECFDF5",
                              padding: "1px 8px",
                              borderRadius: 9999,
                            }}
                          >
                            Current
                          </span>
                        )}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: "#9ca3af",
                          marginTop: 2,
                          display: "flex",
                          gap: 12,
                        }}
                      >
                        {s.ipAddress && <span>IP: {s.ipAddress}</span>}
                        {lastActive && (
                          <span>
                            Last active:{" "}
                            {new Date(lastActive).toLocaleString("en-PH", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {!s.current && (
                    <button
                      onClick={() => handleRevokeSession(s.id)}
                      disabled={revokingId === s.id}
                      style={{
                        padding: "6px 14px",
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#DC2626",
                        background: "#fff",
                        border: "1px solid #FECACA",
                        borderRadius: 6,
                        cursor:
                          revokingId === s.id ? "not-allowed" : "pointer",
                        flexShrink: 0,
                      }}
                    >
                      {revokingId === s.id ? "Revoking..." : "Revoke"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── ACCOUNT ACTIVITY LOG ───────────────────────────────── */}
      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>Recent Account Activity</div>

        <p
          style={{
            fontSize: 14,
            color: "#374151",
            marginBottom: 16,
            marginTop: 0,
          }}
        >
          Recent security events for your account.
        </p>

        {activitiesLoading ? (
          <div style={{ fontSize: 14, color: "#9ca3af", padding: "20px 0" }}>
            Loading activity...
          </div>
        ) : activities.length === 0 ? (
          <div
            style={{
              fontSize: 14,
              color: "#9ca3af",
              padding: "20px 0",
              textAlign: "center",
            }}
          >
            No recent activity to display.
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 0,
            }}
          >
            {activities.map((a) => {
              const ev = eventLabel(a.type);
              return (
                <div
                  key={a.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 0",
                    borderBottom: "1px solid #f3f4f6",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: ev.color,
                        background: ev.bg,
                        padding: "3px 10px",
                        borderRadius: 9999,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {ev.label}
                    </span>
                    <span style={{ fontSize: 13, color: "#374151" }}>
                      {a.description}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "#9ca3af",
                      whiteSpace: "nowrap",
                      marginLeft: 16,
                      display: "flex",
                      gap: 12,
                    }}
                  >
                    {a.ipAddress && <span>{a.ipAddress}</span>}
                    <span>
                      {new Date(a.timestamp).toLocaleString("en-PH", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── TWO-FACTOR AUTHENTICATION ────────────────────────────── */}
      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>Two-Factor Authentication</div>

        <p
          style={{
            fontSize: 14,
            color: "#6b7280",
            marginTop: 0,
            marginBottom: 20,
          }}
        >
          Add an extra layer of security to your account. Two-factor
          authentication requires a secondary verification step during login.
        </p>

        {/* Authenticator App */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 0",
            borderBottom: "1px solid #f3f4f6",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "#1a1a1a",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              Authenticator App
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  fontSize: 11,
                  color: "#DC2626",
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#DC2626",
                    display: "inline-block",
                  }}
                />
                Not configured
              </span>
            </div>
            <div style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>
              Use an authenticator app to generate one-time codes.
            </div>
          </div>
          <button
            disabled
            style={{
              padding: "7px 16px",
              fontSize: 13,
              fontWeight: 600,
              color: "#9ca3af",
              background: "#f3f4f6",
              border: "1px solid #e5e7eb",
              borderRadius: 6,
              cursor: "not-allowed",
            }}
          >
            Add
          </button>
        </div>

        {/* Passkey / Biometric */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 0",
            borderBottom: "1px solid #f3f4f6",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "#1a1a1a",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              Passkey / Biometric
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  fontSize: 11,
                  color: "#DC2626",
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#DC2626",
                    display: "inline-block",
                  }}
                />
                Not configured
              </span>
            </div>
            <div style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>
              Use your device fingerprint, face recognition, or a hardware
              security key.
            </div>
          </div>
          <button
            disabled
            style={{
              padding: "7px 16px",
              fontSize: 13,
              fontWeight: 600,
              color: "#9ca3af",
              background: "#f3f4f6",
              border: "1px solid #e5e7eb",
              borderRadius: 6,
              cursor: "not-allowed",
            }}
          >
            Add
          </button>
        </div>

        {/* Recovery Codes */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 0",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "#1a1a1a",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              Recovery Codes
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#6b7280",
                  background: "#f3f4f6",
                  padding: "2px 8px",
                  borderRadius: 9999,
                }}
              >
                Requires 2FA
              </span>
            </div>
            <div style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>
              Generate backup codes to use when you lose access to your
              authenticator.
            </div>
          </div>
          <button
            disabled
            style={{
              padding: "7px 16px",
              fontSize: 13,
              fontWeight: 600,
              color: "#9ca3af",
              background: "#f3f4f6",
              border: "1px solid #e5e7eb",
              borderRadius: 6,
              cursor: "not-allowed",
            }}
          >
            Generate
          </button>
        </div>

        <div
          style={{
            marginTop: 12,
            padding: "10px 14px",
            background: "#EFF6FF",
            border: "1px solid #BFDBFE",
            borderRadius: 6,
            fontSize: 13,
            color: "#1e40af",
          }}
        >
          Two-factor authentication is coming soon. We are working on adding
          TOTP, passkey, and recovery code support.
        </div>
      </div>
    </div>
  );
}
