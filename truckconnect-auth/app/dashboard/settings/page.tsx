"use client";

import { useState, useEffect, useRef } from "react";
import { useSession, authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function ProfileSettingsPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState<"success" | "error">("success");

  // Avatar
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarHover, setAvatarHover] = useState(false);

  // Metadata
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [lastSignIn, setLastSignIn] = useState<string | null>(null);

  useEffect(() => {
    if (!session) return;
    fetch("/api/user/metadata")
      .then((r) => r.json())
      .then((data) => {
        const meta = data.untrustedMetadata ?? {};
        if (meta.firstName) setFirstName(meta.firstName);
        if (meta.lastName) setLastName(meta.lastName);
        if (meta.phone) setPhone(meta.phone);
        if (meta.phoneVerified) setPhoneVerified(true);
        if (data.lastSignIn) setLastSignIn(data.lastSignIn);
      })
      .catch(() => {
        const parts = session.user.name.split(" ");
        setFirstName(parts[0] ?? "");
        setLastName(parts.slice(1).join(" ") ?? "");
      });
  }, [session]);

  useEffect(() => {
    if (!session) return;
    const u = session.user as typeof session.user & {
      emailVerified?: boolean;
      image?: string | null;
    };
    setEmailVerified(!!u.emailVerified);
    if (u.image) setAvatarPreview(u.image);
  }, [session]);

  if (isPending)
    return (
      <div style={{ padding: 40, color: "#6b7280" }}>Loading...</div>
    );
  if (!session) return null;

  const u = session.user as typeof session.user & {
    role?: string;
    image?: string | null;
    createdAt?: string;
    emailVerified?: boolean;
  };

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setMsg("Please select an image file.");
      setMsgType("error");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setMsg("Image must be under 5 MB.");
      setMsgType("error");
      return;
    }
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    if (!firstName.trim()) {
      setMsg("First name is required.");
      setMsgType("error");
      return;
    }
    setSaving(true);

    try {
      const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();

      // Upload avatar if changed
      let imageUrl = u.image;
      if (avatarFile) {
        const formData = new FormData();
        formData.append("avatar", avatarFile);
        try {
          const uploadRes = await fetch("/api/user/avatar", {
            method: "POST",
            body: formData,
          });
          if (uploadRes.ok) {
            const uploadData = await uploadRes.json();
            imageUrl = uploadData.url;
          }
        } catch {
          // Avatar upload failed silently; continue saving other fields
        }
      }

      await authClient.updateUser({
        name: fullName,
        ...(imageUrl ? { image: imageUrl } : {}),
      });
      await fetch("/api/user/metadata", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          untrusted: {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            phone: phone.trim(),
          },
        }),
      });

      setAvatarFile(null);
      setMsg("Changes saved successfully.");
      setMsgType("success");
      router.refresh();
    } catch {
      setMsg("Failed to save changes. Please try again.");
      setMsgType("error");
    }

    setSaving(false);
  }

  async function handleSendVerificationEmail() {
    try {
      await authClient.sendVerificationEmail({ email: u.email });
      setMsg("Verification email sent. Check your inbox.");
      setMsgType("success");
    } catch {
      setMsg("Failed to send verification email.");
      setMsgType("error");
    }
  }

  const roleBadgeColor: Record<string, string> = {
    admin: "#DC2626",
    user: "#2563EB",
  };

  const initials =
    (firstName?.[0] ?? u.name?.[0] ?? "?").toUpperCase() +
    (lastName?.[0] ?? "").toUpperCase();

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
    fontSize: 14,
    fontWeight: 600,
    color: "#374151",
    paddingTop: 8,
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    maxWidth: 360,
    padding: "9px 12px",
    fontSize: 14,
    border: "1px solid #d1d5db",
    borderRadius: 6,
    outline: "none",
    color: "#1a1a1a",
    background: "#fff",
    boxSizing: "border-box",
  };

  const readOnlyStyle: React.CSSProperties = {
    fontSize: 14,
    color: "#6b7280",
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: 6,
    padding: "9px 12px",
    maxWidth: 360,
    boxSizing: "border-box",
  };

  const verifiedBadge = (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        fontSize: 12,
        fontWeight: 600,
        color: "#059669",
        background: "#ECFDF5",
        padding: "2px 10px",
        borderRadius: 9999,
        marginLeft: 8,
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
      Verified
    </span>
  );

  const unverifiedBadge = (onClick?: () => void) => (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        fontSize: 12,
        fontWeight: 600,
        color: "#DC2626",
        background: "#FEF2F2",
        padding: "2px 10px",
        borderRadius: 9999,
        marginLeft: 8,
        border: "1px solid #FECACA",
        cursor: onClick ? "pointer" : "default",
      }}
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#DC2626"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      {onClick ? "Verify" : "Not verified"}
    </button>
  );

  return (
    <div className="page-content" style={{ padding: "32px 40px", maxWidth: 800 }}>
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
          Profile Settings
        </h1>
        <p style={{ fontSize: 14, color: "#6b7280", margin: 0 }}>
          Manage your personal account information and profile picture.
        </p>
      </div>

      <form onSubmit={handleSave}>
        {/* ── AVATAR ──────────────────────────────────────────────── */}
        <div className="profile-section" style={sectionStyle}>
          <div style={sectionTitleStyle}>Profile Picture</div>
          <div
            className="avatar-row"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 24,
            }}
          >
            {/* Avatar circle */}
            <div
              style={{ position: "relative", cursor: "pointer" }}
              onMouseEnter={() => setAvatarHover(true)}
              onMouseLeave={() => setAvatarHover(false)}
              onClick={() => fileInputRef.current?.click()}
            >
              <div
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "3px solid #e5e7eb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: avatarPreview ? "transparent" : "#2563EB",
                  fontSize: 32,
                  fontWeight: 700,
                  color: "#fff",
                  position: "relative",
                }}
              >
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  initials
                )}

                {/* Camera overlay */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(0,0,0,0.45)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "50%",
                    opacity: avatarHover ? 1 : 0,
                    transition: "opacity 0.2s",
                  }}
                >
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                style={{ display: "none" }}
              />
            </div>

            <div>
              <div
                style={{ fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 4 }}
              >
                Upload a photo
              </div>
              <div style={{ fontSize: 13, color: "#9ca3af", marginBottom: 12 }}>
                JPG, PNG or GIF. Max 5 MB.
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={{
                  padding: "7px 16px",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#2563EB",
                  background: "#EFF6FF",
                  border: "1px solid #BFDBFE",
                  borderRadius: 6,
                  cursor: "pointer",
                }}
              >
                Choose File
              </button>
              {avatarFile && (
                <span
                  style={{
                    fontSize: 12,
                    color: "#059669",
                    marginLeft: 10,
                  }}
                >
                  New photo selected
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── PERSONAL INFO ───────────────────────────────────────── */}
        <div className="profile-section" style={sectionStyle}>
          <div style={sectionTitleStyle}>Personal Information</div>
          <div
            className="profile-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "180px 1fr",
              gap: "20px 32px",
              alignItems: "start",
            }}
          >
            {/* First name */}
            <label style={labelStyle}>First Name</label>
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Juan"
              required
              style={inputStyle}
            />

            {/* Last name */}
            <label style={labelStyle}>Last Name</label>
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="dela Cruz"
              style={inputStyle}
            />

            {/* Email */}
            <label style={labelStyle}>Email</label>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={readOnlyStyle}>{u.email}</div>
              {emailVerified
                ? verifiedBadge
                : unverifiedBadge(handleSendVerificationEmail)}
            </div>

            {/* Phone */}
            <label style={labelStyle}>Phone Number</label>
            <div style={{ display: "flex", alignItems: "center" }}>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+63 9XX XXX XXXX"
                type="tel"
                style={inputStyle}
              />
              {phone.trim().length > 0 &&
                (phoneVerified ? verifiedBadge : unverifiedBadge())}
            </div>

            {/* User ID */}
            <label style={labelStyle}>User ID</label>
            <div
              style={{
                fontFamily: "monospace",
                fontSize: 13,
                color: "#6b7280",
                background: "#f9fafb",
                border: "1px solid #e5e7eb",
                borderRadius: 6,
                padding: "9px 12px",
                maxWidth: 360,
                userSelect: "all",
              }}
            >
              {u.id}
            </div>

            {/* Role */}
            <label style={labelStyle}>Platform Role</label>
            <div style={{ paddingTop: 6 }}>
              <span
                style={{
                  display: "inline-block",
                  padding: "3px 10px",
                  fontSize: 12,
                  fontWeight: 600,
                  borderRadius: 9999,
                  color: "#fff",
                  background:
                    roleBadgeColor[u.role ?? "user"] ?? "#6b7280",
                }}
              >
                {(u.role ?? "user").charAt(0).toUpperCase() +
                  (u.role ?? "user").slice(1)}
              </span>
            </div>
          </div>
        </div>

        {/* ── ACCOUNT INFO ────────────────────────────────────────── */}
        <div className="profile-section" style={sectionStyle}>
          <div style={sectionTitleStyle}>Account Information</div>
          <div
            className="profile-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "180px 1fr",
              gap: "16px 32px",
              alignItems: "center",
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 600, color: "#374151" }}>
              Account Created
            </div>
            <div style={{ fontSize: 14, color: "#6b7280" }}>
              {u.createdAt
                ? new Date(u.createdAt).toLocaleDateString("en-PH", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "\u2014"}
            </div>

            <div style={{ fontSize: 14, fontWeight: 600, color: "#374151" }}>
              Last Sign-In
            </div>
            <div style={{ fontSize: 14, color: "#6b7280" }}>
              {lastSignIn
                ? new Date(lastSignIn).toLocaleString("en-PH", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : session.session?.createdAt
                  ? new Date(session.session.createdAt).toLocaleString("en-PH", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "\u2014"}
            </div>
          </div>
        </div>

        {/* ── SAVE ────────────────────────────────────────────────── */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            type="submit"
            disabled={saving || !firstName.trim()}
            style={{
              padding: "10px 24px",
              fontSize: 14,
              fontWeight: 600,
              color: "#fff",
              background: saving ? "#93c5fd" : "#2563EB",
              border: "none",
              borderRadius: 6,
              cursor: saving ? "not-allowed" : "pointer",
              transition: "background 0.15s",
            }}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
          {msg && (
            <span
              style={{
                fontSize: 13,
                color: msgType === "error" ? "#DC2626" : "#059669",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              {msgType === "success" && (
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
              )}
              {msg}
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
