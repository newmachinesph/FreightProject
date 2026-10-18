"use client";

import { useState, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signUp, authClient } from "@/lib/auth-client";
import { Truck, Check, Phone } from "lucide-react";

const PASSWORD_RULES = [
  { label: "At least 10 characters", test: (p: string) => p.length >= 10 },
  { label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "One lowercase letter", test: (p: string) => /[a-z]/.test(p) },
  { label: "One digit", test: (p: string) => /\d/.test(p) },
];

function PasswordStrengthMeter({ password }: { password: string }) {
  const passed = PASSWORD_RULES.filter(r => r.test(password)).length;
  const strength = password.length === 0 ? 0 : passed;
  const colors = ["#DC2626", "#F59E0B", "#F59E0B", "#22C55E", "#059669"];
  const labels = ["", "Weak", "Fair", "Good", "Strong"];

  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>
        {[0, 1, 2, 3].map(i => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 3,
              borderRadius: 2,
              background: i < strength ? colors[strength] : "var(--border)",
              transition: "background 0.2s",
            }}
          />
        ))}
      </div>
      {password.length > 0 && (
        <div style={{ fontSize: 11, color: colors[strength], fontWeight: 600, marginBottom: 8 }}>
          {labels[strength]}
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {PASSWORD_RULES.map(rule => {
          const met = rule.test(password);
          return (
            <div
              key={rule.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 12,
                color: met ? "#059669" : "var(--text-4)",
                transition: "color 0.2s",
              }}
            >
              {met ? (
                <Check size={13} strokeWidth={3} />
              ) : (
                <div style={{
                  width: 13,
                  height: 13,
                  borderRadius: "50%",
                  border: "1.5px solid var(--border)",
                  flexShrink: 0,
                }} />
              )}
              {rule.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}

type Step = "register" | "verify";

function SignUpInner() {
  const router = useRouter();
  const params = useSearchParams();
  const redirectTo = params.get("redirect");

  // Registration fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // OTP verification
  const [step, setStep] = useState<Step>("register");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const passwordValid = useMemo(
    () => PASSWORD_RULES.every(r => r.test(password)),
    [password],
  );

  // Normalize PH phone: accept 09xx, +639xx, 639xx formats
  function normalizePhone(raw: string): string {
    const digits = raw.replace(/\D/g, "");
    if (digits.startsWith("0") && digits.length === 11) return `+63${digits.slice(1)}`;
    if (digits.startsWith("63") && digits.length === 12) return `+${digits}`;
    if (digits.startsWith("9") && digits.length === 10) return `+63${digits}`;
    return raw.startsWith("+") ? raw : `+${digits}`;
  }

  async function sendOtp(phoneNumber: string) {
    const res = await authClient.phoneNumber.sendOtp({ phoneNumber });
    if (res.error) throw new Error(res.error.message ?? "Failed to send OTP");
  }

  function startResendCooldown() {
    setResendCooldown(60);
    const interval = setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirm) { setError("Passwords do not match."); return; }
    if (!passwordValid) { setError("Password does not meet all requirements."); return; }
    if (!phone.trim()) { setError("Mobile number is required."); return; }

    setLoading(true);
    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
    const normalizedPhone = normalizePhone(phone.trim());

    // 1. Create account
    const { error: err } = await signUp.email({ name: fullName, email, password });
    if (err) {
      setError(err.message ?? "Registration failed.");
      setLoading(false);
      return;
    }

    // 2. Store metadata (name, phone)
    await fetch("/api/user/metadata", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        untrusted: { firstName: firstName.trim(), lastName: lastName.trim(), phone: normalizedPhone },
      }),
    }).catch(() => {});

    // 3. Send OTP to the phone number
    try {
      await sendOtp(normalizedPhone);
      startResendCooldown();
      setStep("verify");
    } catch (otpErr) {
      // Account created but OTP failed — still move to verify step
      console.error("[sign-up] OTP send failed:", otpErr);
      setStep("verify");
    }

    setLoading(false);
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setOtpError("");
    setOtpLoading(true);

    const normalizedPhone = normalizePhone(phone.trim());

    try {
      const res = await authClient.phoneNumber.verify({
        phoneNumber: normalizedPhone,
        code: otp.trim(),
      });
      if (res.error) {
        setOtpError(res.error.message ?? "Invalid code. Try again.");
        setOtpLoading(false);
        return;
      }
      // Success — go to dashboard
      router.push(redirectTo || "/dashboard");
    } catch {
      setOtpError("Verification failed. Try again.");
      setOtpLoading(false);
    }
  }

  async function handleResend() {
    if (resendCooldown > 0) return;
    setOtpError("");
    try {
      await sendOtp(normalizePhone(phone.trim()));
      startResendCooldown();
    } catch (err) {
      setOtpError(err instanceof Error ? err.message : "Failed to resend code");
    }
  }

  // ── OTP Verification Step ──
  if (step === "verify") {
    return (
      <div style={{ width: "100%", maxWidth: 440 }} className="animate-in">
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: 52, height: 52,
            background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
            borderRadius: 14, marginBottom: 16,
            boxShadow: "0 4px 16px rgba(5, 150, 105, 0.3)",
          }}>
            <Phone size={26} color="#fff" />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "#fff", margin: "0 0 4px" }}>
            Verify your number
          </h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, margin: 0 }}>
            We sent a 6-digit code to {normalizePhone(phone.trim())}
          </p>
        </div>

        <div className="card" style={{ padding: 32, boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}>
          <form onSubmit={handleVerifyOtp}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-2)", marginBottom: 6 }}>
                  Verification Code
                </label>
                <input
                  className="field"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="123456"
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, ""))}
                  required
                  autoFocus
                  style={{ fontSize: 20, letterSpacing: "0.3em", textAlign: "center", fontWeight: 700 }}
                />
              </div>

              {otpError && (
                <div role="alert" style={{
                  background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10,
                  padding: "10px 14px", fontSize: 13, color: "#DC2626",
                }}>
                  {otpError}
                </div>
              )}

              <button
                className="btn-primary"
                type="submit"
                disabled={otpLoading || otp.length < 6}
                style={{ width: "100%", justifyContent: "center", padding: "12px 20px", fontSize: 15, background: "var(--blue)" }}
              >
                {otpLoading ? "Verifying..." : "Verify & Continue"}
              </button>

              <div style={{ textAlign: "center", fontSize: 13, color: "var(--text-3)" }}>
                Didn&apos;t receive the code?{" "}
                {resendCooldown > 0 ? (
                  <span style={{ color: "var(--text-4)" }}>Resend in {resendCooldown}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    style={{ color: "var(--blue)", fontWeight: 600, background: "none", border: "none", cursor: "pointer", padding: 0 }}
                  >
                    Resend Code
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // ── Registration Step ──
  return (
    <div style={{ width: "100%", maxWidth: 440 }} className="animate-in">
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          width: 52, height: 52,
          background: "linear-gradient(135deg, #2563EB 0%, #1d4ed8 100%)",
          borderRadius: 14, marginBottom: 16,
          boxShadow: "0 4px 16px rgba(37, 99, 235, 0.3)",
        }}>
          <Truck size={26} color="#fff" />
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#fff", margin: "0 0 4px", letterSpacing: "-0.5px" }}>
          Create your account
        </h1>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, margin: 0 }}>
          Get started with TruckConnect for free
        </p>
      </div>

      <div className="card" style={{ padding: 32, boxShadow: "0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)" }}>
        <form onSubmit={handleRegister}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* First + Last Name row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-2)", marginBottom: 6 }}>
                  First Name
                </label>
                <input
                  className="field" type="text" placeholder="Juan"
                  value={firstName} onChange={e => setFirstName(e.target.value)}
                  required autoFocus
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-2)", marginBottom: 6 }}>
                  Last Name
                </label>
                <input
                  className="field" type="text" placeholder="dela Cruz"
                  value={lastName} onChange={e => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-2)", marginBottom: 6 }}>
                Email Address
              </label>
              <input
                className="field" type="email" placeholder="juan@example.com"
                value={email} onChange={e => setEmail(e.target.value)}
                required
              />
              <div style={{ fontSize: 11, color: "var(--text-4)", marginTop: 4 }}>
                Used for welcome message and account recovery
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-2)", marginBottom: 6 }}>
                Mobile Number
              </label>
              <input
                className="field" type="tel" placeholder="09171234567"
                value={phone} onChange={e => setPhone(e.target.value)}
                required
              />
              <div style={{ fontSize: 11, color: "var(--text-4)", marginTop: 4 }}>
                Philippine mobile number — we&apos;ll send a verification code via SMS
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-2)", marginBottom: 6 }}>
                Password
              </label>
              <input
                className="field" type="password" placeholder="Create a strong password"
                value={password} onChange={e => setPassword(e.target.value)}
                required
              />
              <PasswordStrengthMeter password={password} />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-2)", marginBottom: 6 }}>
                Confirm Password
              </label>
              <input
                className="field" type="password" placeholder="Repeat your password"
                value={confirm} onChange={e => setConfirm(e.target.value)}
                required
                style={
                  confirm.length > 0 && password !== confirm
                    ? { borderColor: "#DC2626" }
                    : confirm.length > 0 && password === confirm
                    ? { borderColor: "#059669" }
                    : undefined
                }
              />
              {confirm.length > 0 && password !== confirm && (
                <div style={{ fontSize: 12, color: "#DC2626", marginTop: 4 }}>
                  Passwords do not match
                </div>
              )}
            </div>

            {error && (
              <div role="alert" style={{
                background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10,
                padding: "12px 16px", display: "flex", alignItems: "flex-start", gap: 10,
                fontSize: 13, color: "#DC2626",
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
                  <circle cx="12" cy="12" r="10" stroke="#DC2626" strokeWidth="2"/>
                  <path d="M12 8v4M12 16h.01" stroke="#DC2626" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 2 }}>Registration error</div>
                  <div style={{ color: "#B91C1C" }}>{error}</div>
                </div>
              </div>
            )}

            <button
              className="btn-primary" type="submit" disabled={loading}
              style={{ width: "100%", justifyContent: "center", padding: "12px 20px", fontSize: 15, background: "var(--blue)", marginTop: 4 }}
            >
              {loading ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ animation: "spin 1s linear infinite" }}>
                    <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5" />
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                  Creating account...
                </>
              ) : "Create Account"}
            </button>
          </div>
        </form>

        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "24px 0 20px" }}>
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          <span style={{ fontSize: 12, color: "var(--text-4)", fontWeight: 500 }}>Or</span>
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
        </div>

        <div style={{ textAlign: "center" }}>
          <a
            href={`/sign-in${redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : ""}`}
            style={{ fontSize: 14, color: "var(--text-3)", textDecoration: "none", fontWeight: 500 }}
          >
            Already have an account?{" "}
            <span style={{ color: "var(--blue)", fontWeight: 600 }}>Sign in</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, textAlign: "center", color: "rgba(255,255,255,0.5)" }}>Loading...</div>}>
      <SignUpInner />
    </Suspense>
  );
}
