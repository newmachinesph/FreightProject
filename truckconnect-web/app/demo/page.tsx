"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ArrowRight,
  CheckCircle,
  ChevronDown,
  Monitor,
  Package,
  Satellite,
  Truck,
  Warehouse,
  MessageSquare,
  Users,
  Clock,
  HelpCircle,
} from "lucide-react";
import { useState, type CSSProperties, type FormEvent } from "react";

const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL ?? "http://localhost:3001";

const COLORS = {
  navy: "#1B2D5E",
  navyDark: "#142248",
  blue: "#2563EB",
  blueHover: "#1d4ed8",
  white: "#ffffff",
  gray50: "#f8fafc",
  gray100: "#f1f5f9",
  gray200: "#e2e8f0",
  gray300: "#cbd5e1",
  gray400: "#94a3b8",
  gray500: "#64748b",
  gray600: "#475569",
  gray700: "#334155",
  gray800: "#1e293b",
  gray900: "#0f172a",
  green: "#059669",
  amber: "#d97706",
  red: "#dc2626",
};

const container: CSSProperties = { maxWidth: 1200, margin: "0 auto", padding: "0 24px" };
const sectionPadding: CSSProperties = { padding: "80px 0" };

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "12px 16px",
  borderRadius: 8,
  border: `1px solid ${COLORS.gray200}`,
  fontSize: 15,
  color: COLORS.gray800,
  outline: "none",
  transition: "border-color 0.2s",
  boxSizing: "border-box",
  fontFamily: "inherit",
};

const labelStyle: CSSProperties = {
  display: "block",
  fontSize: 14,
  fontWeight: 600,
  color: COLORS.gray700,
  marginBottom: 6,
};

const btnPrimary: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "14px 28px",
  backgroundColor: COLORS.blue,
  color: COLORS.white,
  border: "none",
  borderRadius: 8,
  fontSize: 16,
  fontWeight: 600,
  cursor: "pointer",
  textDecoration: "none",
  transition: "background-color 0.2s",
  width: "100%",
  justifyContent: "center",
};

const DEMO_ITEMS = [
  { icon: <Monitor size={20} />, label: "Platform walkthrough" },
  { icon: <Package size={20} />, label: "Load posting demo" },
  { icon: <Satellite size={20} />, label: "Real-time tracking" },
  { icon: <Truck size={20} />, label: "Fleet management" },
  { icon: <Warehouse size={20} />, label: "Warehouse operations" },
  { icon: <MessageSquare size={20} />, label: "Q&A session" },
];

const FAQS = [
  {
    q: "How long is the demo?",
    a: "Demos typically run 30 minutes. We tailor the session to your needs, so it could be shorter or longer depending on the features you want to explore.",
  },
  {
    q: "Is the demo free?",
    a: "Absolutely. The demo is completely free with no obligations. We want to make sure TruckConnect is the right fit for your business before you commit.",
  },
  {
    q: "Can I invite my team?",
    a: "Yes, we encourage it! Invite as many team members as you like. The more stakeholders who see the platform, the easier it is to evaluate and get buy-in.",
  },
];

const COMPANY_SIZES = ["1-10 employees", "11-50 employees", "51-200 employees", "201-500 employees", "500+ employees"];

export default function DemoPage() {
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div style={{ minHeight: "100vh" }}>
      <Navbar />

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section
        style={{
          background: `linear-gradient(135deg, ${COLORS.navy} 0%, ${COLORS.navyDark} 100%)`,
          padding: "100px 0 60px",
        }}
      >
        <div style={{ ...container, textAlign: "center" }}>
          <h1 style={{ fontSize: 44, fontWeight: 700, color: COLORS.white, margin: "0 0 16px" }}>
            See TruckConnect in Action
          </h1>
          <p style={{ fontSize: 18, color: COLORS.gray300, lineHeight: 1.6, maxWidth: 560, margin: "0 auto" }}>
            Get a personalized walkthrough of the platform and see how TruckConnect can streamline your logistics operations.
          </p>
        </div>
      </section>

      {/* ── Form + What You'll See ──────────────────────────────────────── */}
      <section style={sectionPadding}>
        <div
          style={{
            ...container,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 48,
            alignItems: "start",
          }}
        >
          {/* Left: Form */}
          <div
            style={{
              padding: 40,
              borderRadius: 16,
              border: `1px solid ${COLORS.gray200}`,
              backgroundColor: COLORS.white,
              boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
            }}
          >
            <h2 style={{ fontSize: 24, fontWeight: 700, color: COLORS.navy, margin: "0 0 8px" }}>
              Book your demo
            </h2>
            <p style={{ fontSize: 15, color: COLORS.gray500, margin: "0 0 28px", lineHeight: 1.5 }}>
              Fill out the form and our team will reach out within one business day.
            </p>

            {submitted ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <CheckCircle size={48} color={COLORS.green} style={{ marginBottom: 16 }} />
                <h3 style={{ fontSize: 20, fontWeight: 700, color: COLORS.navy, margin: "0 0 8px" }}>
                  Request received!
                </h3>
                <p style={{ fontSize: 15, color: COLORS.gray500, margin: 0, lineHeight: 1.5 }}>
                  We&apos;ll be in touch shortly to schedule your demo.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <label style={labelStyle}>Name *</label>
                    <input type="text" required placeholder="Juan Dela Cruz" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Company *</label>
                    <input type="text" required placeholder="Your company" style={inputStyle} />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <label style={labelStyle}>Email *</label>
                    <input type="email" required placeholder="you@company.com" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Phone</label>
                    <input type="tel" placeholder="+63 9XX XXX XXXX" style={inputStyle} />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Company Size</label>
                  <div style={{ position: "relative" }}>
                    <select
                      style={{
                        ...inputStyle,
                        appearance: "none",
                        paddingRight: 40,
                        backgroundColor: COLORS.white,
                      }}
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Select size
                      </option>
                      {COMPANY_SIZES.map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={18}
                      color={COLORS.gray400}
                      style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
                    />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Message</label>
                  <textarea
                    rows={3}
                    placeholder="Tell us about your logistics needs..."
                    style={{ ...inputStyle, resize: "vertical" }}
                  />
                </div>
                <button type="submit" style={btnPrimary}>
                  Request Demo
                  <ArrowRight size={18} />
                </button>
              </form>
            )}
          </div>

          {/* Right: What You'll See */}
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: COLORS.navy, margin: "0 0 8px" }}>
              What you&apos;ll see
            </h2>
            <p style={{ fontSize: 15, color: COLORS.gray500, margin: "0 0 28px", lineHeight: 1.5 }}>
              Our demo covers everything you need to evaluate TruckConnect for your business.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {DEMO_ITEMS.map((item) => (
                <div
                  key={item.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    padding: "16px 20px",
                    borderRadius: 12,
                    border: `1px solid ${COLORS.gray200}`,
                    backgroundColor: COLORS.white,
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      background: "#dbeafe",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      color: COLORS.blue,
                    }}
                  >
                    {item.icon}
                  </div>
                  <span style={{ fontSize: 16, fontWeight: 600, color: COLORS.gray700 }}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Prefer to explore on your own? ─────────────────────────────── */}
      <section style={{ backgroundColor: COLORS.gray50, padding: "48px 0" }}>
        <div style={{ ...container, textAlign: "center" }}>
          <p style={{ fontSize: 16, color: COLORS.gray600, margin: "0 0 12px" }}>
            Prefer to explore on your own?
          </p>
          <a
            href={`${AUTH_URL}/sign-up`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 16,
              fontWeight: 600,
              color: COLORS.blue,
              textDecoration: "none",
            }}
          >
            Create a free account and start now
            <ArrowRight size={16} />
          </a>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────────── */}
      <section style={sectionPadding}>
        <div style={{ ...container, maxWidth: 720 }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: COLORS.navy, textAlign: "center", margin: "0 0 40px" }}>
            Frequently asked questions
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {FAQS.map((faq, i) => (
              <div
                key={i}
                style={{
                  borderRadius: 12,
                  border: `1px solid ${COLORS.gray200}`,
                  backgroundColor: COLORS.white,
                  overflow: "hidden",
                }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "18px 20px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 16,
                    fontWeight: 600,
                    color: COLORS.gray800,
                    textAlign: "left",
                    fontFamily: "inherit",
                  }}
                >
                  {faq.q}
                  <ChevronDown
                    size={18}
                    color={COLORS.gray400}
                    style={{
                      transition: "transform 0.2s",
                      transform: openFaq === i ? "rotate(180deg)" : "rotate(0deg)",
                      flexShrink: 0,
                    }}
                  />
                </button>
                {openFaq === i && (
                  <div style={{ padding: "0 20px 18px", fontSize: 15, color: COLORS.gray500, lineHeight: 1.6 }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        @media (max-width: 768px) {
          section > div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
