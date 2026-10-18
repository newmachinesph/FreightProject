"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ArrowRight,
  Heart,
  Rocket,
  Wifi,
  MapPin,
  Briefcase,
  Clock,
  Shield,
  BookOpen,
  Palmtree,
  TrendingUp,
  Gift,
  Star,
  Users,
  Target,
  Zap,
} from "lucide-react";
import type { CSSProperties } from "react";

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
const sectionTitle: CSSProperties = { fontSize: 32, fontWeight: 700, color: COLORS.navy, textAlign: "center", marginBottom: 16, margin: "0 0 16px" };
const sectionSubtitle: CSSProperties = { fontSize: 18, color: COLORS.gray500, textAlign: "center", marginBottom: 48, maxWidth: 600, margin: "0 auto 48px", lineHeight: 1.6 };

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

const WHY_CARDS = [
  {
    icon: <Target size={28} color={COLORS.blue} />,
    title: "Mission-Driven",
    desc: "We're modernizing logistics for 110 million Filipinos. Every line of code, every deal closed, and every feature shipped makes Philippine supply chains faster, cheaper, and more transparent.",
  },
  {
    icon: <Rocket size={28} color="#059669" />,
    title: "Fast-Growing",
    desc: "Backed by top investors with triple-digit growth, we're scaling rapidly across the Philippines. Join now and help shape the company culture and product direction from the ground floor.",
  },
  {
    icon: <Wifi size={28} color="#7c3aed" />,
    title: "Remote-First",
    desc: "Work from anywhere in the Philippines (or the world). We believe great talent isn't limited by geography. Flexible hours, async communication, and results-oriented culture.",
  },
];

const POSITIONS = [
  { title: "Senior Full-Stack Engineer", department: "Engineering", location: "Manila / Remote", type: "Full-time" },
  { title: "Product Designer", department: "Design", location: "Manila", type: "Full-time" },
  { title: "Business Development Manager - Visayas", department: "Sales", location: "Cebu", type: "Full-time" },
  { title: "DevOps Engineer", department: "Engineering", location: "Remote", type: "Full-time" },
  { title: "Customer Success Manager", department: "Operations", location: "Manila", type: "Full-time" },
  { title: "Data Analyst", department: "Data", location: "Manila / Remote", type: "Full-time" },
];

const BENEFITS = [
  { icon: <Shield size={24} color={COLORS.blue} />, title: "Health Insurance", desc: "Comprehensive HMO coverage for you and your dependents from day one." },
  { icon: <Wifi size={24} color="#059669" />, title: "Remote Work", desc: "Work from anywhere with a monthly internet and co-working stipend." },
  { icon: <TrendingUp size={24} color="#7c3aed" />, title: "Stock Options", desc: "Equity in a high-growth startup so you share in our success." },
  { icon: <Palmtree size={24} color={COLORS.amber} />, title: "Unlimited PTO", desc: "Take the time you need. We trust you to manage your own schedule." },
  { icon: <BookOpen size={24} color={COLORS.red} />, title: "Learning Budget", desc: "Annual education budget for courses, conferences, and books." },
  { icon: <Users size={24} color="#0ea5e9" />, title: "Team Retreats", desc: "Quarterly team gatherings at beautiful Philippine destinations." },
];

const VALUES = [
  { title: "Ship with urgency", desc: "Move fast, learn faster. Our customers can't wait." },
  { title: "Default to transparency", desc: "Share context freely. Trust is our foundation." },
  { title: "Own your outcomes", desc: "Take responsibility end-to-end. No finger-pointing." },
  { title: "Elevate each other", desc: "We win as a team. Mentor, support, and celebrate." },
];

const DEPT_COLORS: Record<string, string> = {
  Engineering: COLORS.blue,
  Design: "#7c3aed",
  Sales: "#059669",
  Operations: COLORS.amber,
  Data: "#0ea5e9",
};

export default function CareersPage() {
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
            We're Hiring
          </div>
          <h1 style={{ fontSize: 48, fontWeight: 800, color: COLORS.white, lineHeight: 1.15, margin: "0 0 24px", maxWidth: 700, marginLeft: "auto", marginRight: "auto" }}>
            Join the Team Building the Future of Philippine Logistics
          </h1>
          <p style={{ fontSize: 20, color: COLORS.gray300, lineHeight: 1.6, maxWidth: 560, margin: "0 auto 40px" }}>
            Help us connect shippers, carriers, and warehouses across 7,000 islands. We're looking for passionate people who want to make a real impact.
          </p>
          <a href="#positions" style={btnPrimary}>
            View Open Positions <ArrowRight size={18} />
          </a>
        </div>
      </section>

      {/* Why TruckConnect */}
      <section style={{ ...sectionPadding, backgroundColor: COLORS.white }}>
        <div style={container}>
          <h2 style={sectionTitle}>Why Work at TruckConnect?</h2>
          <p style={sectionSubtitle}>We're not just building software — we're transforming how goods move across the Philippines.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32 }} className="careers-grid-3">
            {WHY_CARDS.map((card) => (
              <div key={card.title} style={{ padding: 32, borderRadius: 12, border: `1px solid ${COLORS.gray200}`, backgroundColor: COLORS.white }}>
                <div style={{ width: 56, height: 56, borderRadius: 12, backgroundColor: COLORS.gray50, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                  {card.icon}
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: COLORS.navy, margin: "0 0 12px" }}>{card.title}</h3>
                <p style={{ fontSize: 15, color: COLORS.gray500, lineHeight: 1.7, margin: 0 }}>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section id="positions" style={{ ...sectionPadding, backgroundColor: COLORS.gray50 }}>
        <div style={container}>
          <h2 style={sectionTitle}>Open Positions</h2>
          <p style={sectionSubtitle}>Find your next role and help us scale logistics technology across Southeast Asia.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 800, margin: "0 auto" }}>
            {POSITIONS.map((pos) => (
              <div
                key={pos.title}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "24px 28px",
                  borderRadius: 12,
                  backgroundColor: COLORS.white,
                  border: `1px solid ${COLORS.gray200}`,
                  flexWrap: "wrap",
                  gap: 16,
                }}
              >
                <div style={{ flex: 1, minWidth: 240 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 600, color: COLORS.navy, margin: "0 0 8px" }}>{pos.title}</h3>
                  <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 13, color: COLORS.white, backgroundColor: DEPT_COLORS[pos.department] ?? COLORS.blue, padding: "3px 10px", borderRadius: 999, fontWeight: 500 }}>
                      {pos.department}
                    </span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 13, color: COLORS.gray500 }}>
                      <MapPin size={14} /> {pos.location}
                    </span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 13, color: COLORS.gray500 }}>
                      <Clock size={14} /> {pos.type}
                    </span>
                  </div>
                </div>
                <button style={{ ...btnPrimary, padding: "10px 24px", fontSize: 14 }}>Apply</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section style={{ ...sectionPadding, backgroundColor: COLORS.white }}>
        <div style={container}>
          <h2 style={sectionTitle}>Benefits & Perks</h2>
          <p style={sectionSubtitle}>We take care of our team so they can focus on doing their best work.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }} className="careers-grid-3">
            {BENEFITS.map((b) => (
              <div key={b.title} style={{ padding: 28, borderRadius: 12, backgroundColor: COLORS.gray50, textAlign: "center" }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: COLORS.white, display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 16, border: `1px solid ${COLORS.gray200}` }}>
                  {b.icon}
                </div>
                <h4 style={{ fontSize: 16, fontWeight: 600, color: COLORS.navy, margin: "0 0 8px" }}>{b.title}</h4>
                <p style={{ fontSize: 14, color: COLORS.gray500, lineHeight: 1.6, margin: 0 }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Culture & Values */}
      <section style={{ ...sectionPadding, backgroundColor: COLORS.gray50 }}>
        <div style={container}>
          <h2 style={sectionTitle}>Our Values</h2>
          <p style={sectionSubtitle}>The principles that guide how we work, build, and grow together.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24, maxWidth: 800, margin: "0 auto" }} className="careers-grid-2">
            {VALUES.map((v, i) => (
              <div key={v.title} style={{ padding: 28, borderRadius: 12, backgroundColor: COLORS.white, border: `1px solid ${COLORS.gray200}`, display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: COLORS.blue, color: COLORS.white, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 16, flexShrink: 0 }}>
                  {i + 1}
                </div>
                <div>
                  <h4 style={{ fontSize: 16, fontWeight: 600, color: COLORS.navy, margin: "0 0 6px" }}>{v.title}</h4>
                  <p style={{ fontSize: 14, color: COLORS.gray500, lineHeight: 1.6, margin: 0 }}>{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: `linear-gradient(135deg, ${COLORS.navy} 0%, ${COLORS.navyDark} 100%)`, padding: "64px 0" }}>
        <div style={{ ...container, textAlign: "center" }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: COLORS.white, margin: "0 0 16px" }}>Don't see your role?</h2>
          <p style={{ fontSize: 18, color: COLORS.gray300, margin: "0 0 32px", lineHeight: 1.6 }}>
            We're always looking for talented people. Send us your resume and we'll reach out when the right position opens up.
          </p>
          <a href="mailto:careers@truckconnect.ph" style={btnPrimary}>
            Send Us Your Resume <ArrowRight size={18} />
          </a>
        </div>
      </section>

      <Footer />

      <style>{`
        @media (max-width: 768px) {
          .careers-grid-3 { grid-template-columns: 1fr !important; }
          .careers-grid-2 { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
