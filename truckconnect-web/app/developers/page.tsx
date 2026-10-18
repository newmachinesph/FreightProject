"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ArrowRight,
  Code2,
  Webhook,
  Box,
  Shield,
  Key,
  Zap,
  Timer,
  Terminal,
} from "lucide-react";
import type { CSSProperties } from "react";

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
};

const container: CSSProperties = { maxWidth: 1200, margin: "0 auto", padding: "0 24px" };
const sectionPadding: CSSProperties = { padding: "80px 0" };
const sectionTitle: CSSProperties = { fontSize: 32, fontWeight: 700, color: COLORS.navy, textAlign: "center", margin: "0 0 16px" };
const sectionSubtitle: CSSProperties = { fontSize: 18, color: COLORS.gray500, textAlign: "center", maxWidth: 600, margin: "0 auto 48px", lineHeight: 1.6 };

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
};

const btnOutline: CSSProperties = {
  ...btnPrimary,
  backgroundColor: "transparent",
  border: `2px solid ${COLORS.white}`,
  color: COLORS.white,
};

const INTEGRATIONS = [
  {
    icon: <Code2 size={28} color={COLORS.blue} />,
    title: "REST API",
    desc: "Full-featured RESTful API with JSON responses. Manage loads, carriers, shipments, and payments programmatically.",
    badge: "v2.0",
  },
  {
    icon: <Box size={28} color="#059669" />,
    title: "JavaScript SDK",
    desc: "Type-safe SDK for Node.js and browsers. Install via npm and start integrating in minutes with built-in error handling.",
    badge: "npm",
  },
  {
    icon: <Webhook size={28} color="#7c3aed" />,
    title: "Webhooks",
    desc: "Real-time event notifications for shipment updates, payment confirmations, and carrier status changes delivered to your endpoint.",
    badge: "Real-time",
  },
];

const FEATURES = [
  { icon: <Timer size={20} color={COLORS.blue} />, title: "Rate Limiting", desc: "1,000 req/min on free tier, 10,000 on Pro. Burst-friendly with automatic backoff." },
  { icon: <Key size={20} color="#059669" />, title: "JWT Authentication", desc: "Secure token-based auth with automatic refresh. API keys for server-to-server calls." },
  { icon: <Terminal size={20} color="#7c3aed" />, title: "Sandbox Environment", desc: "Full-featured sandbox with mock data. Test without affecting production shipments." },
  { icon: <Zap size={20} color={COLORS.amber} />, title: "Real-time Webhooks", desc: "Sub-second event delivery with automatic retries and dead-letter queue support." },
];

const curlExample = `curl -X POST https://api.truckconnect.ph/v2/loads \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "origin": "Manila",
    "destination": "Cebu",
    "weight_kg": 5000,
    "vehicle_type": "closed_van",
    "pickup_date": "2026-03-20"
  }'`;

const jsExample = `import { TruckConnect } from '@truckconnect/sdk';

const tc = new TruckConnect({
  apiKey: process.env.TC_API_KEY,
  sandbox: true,
});

// Create a new load
const load = await tc.loads.create({
  origin: 'Manila',
  destination: 'Cebu',
  weightKg: 5000,
  vehicleType: 'closed_van',
  pickupDate: '2026-03-20',
});

console.log(\`Load created: \${load.id}\`);

// Get real-time quotes
const quotes = await tc.quotes.list({
  loadId: load.id,
  sortBy: 'price',
});`;

const codeBlockStyle: CSSProperties = {
  backgroundColor: COLORS.gray900,
  borderRadius: 12,
  padding: 24,
  overflowX: "auto",
  fontFamily: "'SF Mono', 'Fira Code', 'Cascadia Code', monospace",
  fontSize: 13,
  lineHeight: 1.7,
  color: "#e2e8f0",
  border: `1px solid ${COLORS.gray700}`,
  margin: 0,
  whiteSpace: "pre",
};

export default function DevelopersPage() {
  return (
    <div style={{ minHeight: "100vh" }}>
      <Navbar />

      {/* Hero */}
      <section
        style={{
          background: `linear-gradient(135deg, ${COLORS.navy} 0%, ${COLORS.navyDark} 100%)`,
          padding: "100px 0 80px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", top: -120, right: -120, width: 400, height: 400, borderRadius: "50%", background: "rgba(37, 99, 235, 0.08)" }} />
        <div style={{ position: "absolute", bottom: -80, left: -80, width: 300, height: 300, borderRadius: "50%", background: "rgba(37, 99, 235, 0.06)" }} />
        <div style={{ ...container, position: "relative", zIndex: 1, textAlign: "center" }}>
          <div style={{ display: "inline-block", padding: "6px 16px", borderRadius: 999, backgroundColor: "rgba(37, 99, 235, 0.15)", color: "#93bbfd", fontSize: 13, fontWeight: 600, marginBottom: 24, letterSpacing: 0.5 }}>
            Developer Platform
          </div>
          <h1 style={{ fontSize: 48, fontWeight: 800, color: COLORS.white, lineHeight: 1.15, margin: "0 0 16px" }}>
            Build on TruckConnect
          </h1>
          <p style={{ fontSize: 20, color: COLORS.gray300, lineHeight: 1.6, maxWidth: 560, margin: "0 auto 40px" }}>
            RESTful APIs, SDKs, and webhooks for freight automation
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <a href={`${AUTH_URL}/dashboard`} style={btnPrimary}>
              Get API Key <ArrowRight size={18} />
            </a>
            <a href="http://localhost:3001/docs" style={btnOutline}>
              View API Docs
            </a>
          </div>
        </div>
      </section>

      {/* Integration Options */}
      <section style={{ ...sectionPadding, backgroundColor: COLORS.white }}>
        <div style={container}>
          <h2 style={sectionTitle}>Three Ways to Integrate</h2>
          <p style={sectionSubtitle}>Choose the integration method that works best for your use case.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32 }} className="dev-grid-3">
            {INTEGRATIONS.map((item) => (
              <div key={item.title} style={{ padding: 32, borderRadius: 12, border: `1px solid ${COLORS.gray200}`, backgroundColor: COLORS.white, position: "relative" }}>
                <span style={{ position: "absolute", top: 16, right: 16, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 999, backgroundColor: COLORS.gray100, color: COLORS.gray500, textTransform: "uppercase", letterSpacing: 0.5 }}>
                  {item.badge}
                </span>
                <div style={{ width: 56, height: 56, borderRadius: 12, backgroundColor: COLORS.gray50, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                  {item.icon}
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: COLORS.navy, margin: "0 0 12px" }}>{item.title}</h3>
                <p style={{ fontSize: 15, color: COLORS.gray500, lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Code Examples */}
      <section style={{ ...sectionPadding, backgroundColor: COLORS.gray50 }}>
        <div style={container}>
          <h2 style={sectionTitle}>Start Building in Minutes</h2>
          <p style={sectionSubtitle}>Simple, well-documented APIs that get you from zero to production fast.</p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, maxWidth: 1000, margin: "0 auto" }} className="dev-grid-2">
            {/* cURL */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <Terminal size={18} color={COLORS.gray500} />
                <span style={{ fontSize: 14, fontWeight: 600, color: COLORS.gray600 }}>cURL</span>
              </div>
              <pre style={codeBlockStyle}>{curlExample}</pre>
            </div>

            {/* JS SDK */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <Code2 size={18} color={COLORS.gray500} />
                <span style={{ fontSize: 14, fontWeight: 600, color: COLORS.gray600 }}>JavaScript SDK</span>
              </div>
              <pre style={codeBlockStyle}>{jsExample}</pre>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ ...sectionPadding, backgroundColor: COLORS.white }}>
        <div style={container}>
          <h2 style={sectionTitle}>Built for Production</h2>
          <p style={sectionSubtitle}>Enterprise-grade infrastructure you can rely on.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24, maxWidth: 800, margin: "0 auto" }} className="dev-grid-2">
            {FEATURES.map((f) => (
              <div key={f.title} style={{ display: "flex", gap: 16, padding: 24, borderRadius: 12, border: `1px solid ${COLORS.gray200}`, backgroundColor: COLORS.white }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: COLORS.gray50, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {f.icon}
                </div>
                <div>
                  <h4 style={{ fontSize: 16, fontWeight: 600, color: COLORS.navy, margin: "0 0 6px" }}>{f.title}</h4>
                  <p style={{ fontSize: 14, color: COLORS.gray500, lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: `linear-gradient(135deg, ${COLORS.navy} 0%, ${COLORS.navyDark} 100%)`, padding: "64px 0" }}>
        <div style={{ ...container, textAlign: "center" }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: COLORS.white, margin: "0 0 16px" }}>Ready to Build?</h2>
          <p style={{ fontSize: 18, color: COLORS.gray300, margin: "0 0 32px", lineHeight: 1.6 }}>
            Create a free API key and start integrating TruckConnect into your logistics workflow.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <a href={`${AUTH_URL}/dashboard`} style={btnPrimary}>
              Get Started <ArrowRight size={18} />
            </a>
            <a href="http://localhost:3001/docs" style={{ ...btnPrimary, backgroundColor: "transparent", border: `2px solid ${COLORS.white}` }}>
              API Documentation
            </a>
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        @media (max-width: 768px) {
          .dev-grid-3 { grid-template-columns: 1fr !important; }
          .dev-grid-2 { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
