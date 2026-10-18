"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, Handshake, Globe, Server, Send } from "lucide-react";
import { useState, type CSSProperties } from "react";

const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL ?? "http://localhost:3001";

const COLORS = {
  navy: "#1B2D5E",
  navyDark: "#142248",
  blue: "#2563EB",
  white: "#ffffff",
  gray50: "#f8fafc",
  gray100: "#f1f5f9",
  gray200: "#e2e8f0",
  gray300: "#cbd5e1",
  gray400: "#94a3b8",
  gray500: "#64748b",
  gray600: "#475569",
  gray700: "#334155",
  green: "#059669",
};

const container: CSSProperties = { maxWidth: 1200, margin: "0 auto", padding: "0 24px" };

const INTEGRATION_PARTNERS = [
  {
    name: "2GO",
    color: "#1d4ed8",
    description: "Inter-island freight and logistics across the Philippine archipelago. Integrated for seamless island-to-island shipment booking.",
  },
  {
    name: "JRS Express",
    color: "#dc2626",
    description: "Nationwide parcel and cargo delivery. Connected for last-mile delivery coordination and package tracking.",
  },
  {
    name: "Lalamove",
    color: "#f97316",
    description: "On-demand delivery for intracity and intercity logistics. Integrated for same-day and express shipments.",
  },
  {
    name: "GCash",
    color: "#007bff",
    description: "The Philippines' leading e-wallet. Integrated for instant carrier payouts and shipper payments.",
  },
  {
    name: "BDO",
    color: "#003087",
    description: "BDO Unibank banking integration for enterprise-grade fund transfers and settlement processing.",
  },
  {
    name: "Novu",
    color: "#f43f5e",
    description: "Open-source notification infrastructure. Powers real-time SMS, email, and in-app notifications across all portals.",
  },
];

const TECH_PARTNERS = [
  {
    name: "Google Maps",
    color: "#34a853",
    description: "Powering real-time route optimization, GPS tracking, and geocoding across all TruckConnect portals.",
  },
  {
    name: "Cloudflare",
    color: "#f48120",
    description: "Global CDN and DDoS protection ensuring platform reliability and security for all users.",
  },
  {
    name: "Neon Postgres",
    color: "#00e599",
    description: "Serverless PostgreSQL database powering our data layer with auto-scaling and branching for zero-downtime deployments.",
  },
  {
    name: "Vercel",
    color: "#000000",
    description: "Frontend cloud platform providing edge deployments, instant rollbacks, and global performance optimization.",
  },
];

const PARTNERSHIP_TYPES = [
  "Integration Partner",
  "Technology Partner",
  "Referral Partner",
  "Reseller Partner",
  "Strategic Alliance",
];

export default function PartnersPage() {
  const [formData, setFormData] = useState({
    company: "",
    name: "",
    email: "",
    partnershipType: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const inputStyle: CSSProperties = {
    width: "100%",
    padding: "12px 16px",
    borderRadius: 8,
    border: `1px solid ${COLORS.gray200}`,
    fontSize: 15,
    color: COLORS.gray700,
    outline: "none",
    transition: "border-color 0.2s",
    backgroundColor: COLORS.white,
    boxSizing: "border-box",
  };

  const labelStyle: CSSProperties = {
    fontSize: 14,
    fontWeight: 600,
    color: COLORS.gray700,
    marginBottom: 6,
    display: "block",
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      <Navbar />

      {/* Hero */}
      <section
        style={{
          background: `linear-gradient(135deg, ${COLORS.navy} 0%, ${COLORS.navyDark} 100%)`,
          padding: "80px 0 60px",
          textAlign: "center",
        }}
      >
        <div style={container}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              backgroundColor: "rgba(255,255,255,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
            }}
          >
            <Handshake size={32} color={COLORS.white} />
          </div>
          <h1 style={{ fontSize: 44, fontWeight: 800, color: COLORS.white, margin: "0 0 16px", lineHeight: 1.15 }}>
            Partner with TruckConnect
          </h1>
          <p style={{ fontSize: 20, color: COLORS.gray300, margin: "0 auto", maxWidth: 600, lineHeight: 1.6 }}>
            Join our ecosystem of logistics, technology, and financial partners building the future of Philippine freight.
          </p>
        </div>
      </section>

      {/* Integration Partners */}
      <section style={{ padding: "80px 0", backgroundColor: COLORS.white }}>
        <div style={container}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <Globe size={24} color={COLORS.blue} />
            <h2 style={{ fontSize: 28, fontWeight: 700, color: COLORS.navy, margin: 0 }}>Integration Partners</h2>
          </div>
          <p style={{ fontSize: 16, color: COLORS.gray500, margin: "0 0 40px", maxWidth: 600 }}>
            We integrate with leading Philippine logistics, payment, and delivery platforms to provide a seamless experience.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 24,
            }}
            className="partners-grid"
          >
            {INTEGRATION_PARTNERS.map((partner) => (
              <div
                key={partner.name}
                style={{
                  padding: 28,
                  borderRadius: 16,
                  border: `1px solid ${COLORS.gray200}`,
                  backgroundColor: COLORS.white,
                  transition: "box-shadow 0.2s",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                }}
              >
                {/* Logo placeholder */}
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 12,
                    backgroundColor: `${partner.color}15`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 16,
                  }}
                >
                  <span style={{ fontSize: 16, fontWeight: 800, color: partner.color }}>
                    {partner.name.slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: COLORS.navy, margin: "0 0 8px" }}>
                  {partner.name}
                </h3>
                <p style={{ fontSize: 14, color: COLORS.gray500, lineHeight: 1.7, margin: 0 }}>
                  {partner.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Partners */}
      <section style={{ padding: "80px 0", backgroundColor: COLORS.gray50 }}>
        <div style={container}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <Server size={24} color={COLORS.blue} />
            <h2 style={{ fontSize: 28, fontWeight: 700, color: COLORS.navy, margin: 0 }}>Technology Partners</h2>
          </div>
          <p style={{ fontSize: 16, color: COLORS.gray500, margin: "0 0 40px", maxWidth: 600 }}>
            Our platform is built on best-in-class infrastructure from trusted technology providers.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 24,
            }}
            className="tech-grid"
          >
            {TECH_PARTNERS.map((partner) => (
              <div
                key={partner.name}
                style={{
                  padding: 28,
                  borderRadius: 16,
                  border: `1px solid ${COLORS.gray200}`,
                  backgroundColor: COLORS.white,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 10,
                    backgroundColor: `${partner.color}15`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 16,
                  }}
                >
                  <span style={{ fontSize: 14, fontWeight: 800, color: partner.color }}>
                    {partner.name.slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: COLORS.navy, margin: "0 0 8px" }}>
                  {partner.name}
                </h3>
                <p style={{ fontSize: 13, color: COLORS.gray500, lineHeight: 1.7, margin: 0 }}>
                  {partner.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Become a Partner Form */}
      <section style={{ padding: "80px 0", backgroundColor: COLORS.white }}>
        <div style={container}>
          <div style={{ maxWidth: 640, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 14,
                  backgroundColor: "#dbeafe",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                }}
              >
                <Send size={24} color={COLORS.blue} />
              </div>
              <h2 style={{ fontSize: 32, fontWeight: 700, color: COLORS.navy, margin: "0 0 12px" }}>
                Become a Partner
              </h2>
              <p style={{ fontSize: 16, color: COLORS.gray500, margin: 0 }}>
                Interested in partnering with TruckConnect? Fill out the form and our partnerships team will be in touch.
              </p>
            </div>

            {submitted ? (
              <div
                style={{
                  textAlign: "center",
                  padding: 48,
                  borderRadius: 16,
                  backgroundColor: "#dcfce7",
                  border: "1px solid #bbf7d0",
                }}
              >
                <div style={{ fontSize: 48, marginBottom: 16 }}>&#10003;</div>
                <h3 style={{ fontSize: 22, fontWeight: 700, color: "#065f46", margin: "0 0 8px" }}>
                  Thank you for your interest!
                </h3>
                <p style={{ fontSize: 16, color: "#047857", margin: 0 }}>
                  Our partnerships team will review your application and get back to you within 2 business days.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 24,
                  padding: 40,
                  borderRadius: 16,
                  border: `1px solid ${COLORS.gray200}`,
                  backgroundColor: COLORS.gray50,
                }}
              >
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }} className="form-grid">
                  <div>
                    <label style={labelStyle}>Company Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Your company"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Full name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      style={inputStyle}
                    />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }} className="form-grid">
                  <div>
                    <label style={labelStyle}>Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="you@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Partnership Type</label>
                    <select
                      required
                      value={formData.partnershipType}
                      onChange={(e) => setFormData({ ...formData, partnershipType: e.target.value })}
                      style={{ ...inputStyle, appearance: "auto" as CSSProperties["appearance"] }}
                    >
                      <option value="">Select type...</option>
                      {PARTNERSHIP_TYPES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Message</label>
                  <textarea
                    rows={4}
                    placeholder="Tell us about your company and how you'd like to partner..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    style={{ ...inputStyle, resize: "vertical" as CSSProperties["resize"] }}
                  />
                </div>
                <button
                  type="submit"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    padding: "14px 28px",
                    backgroundColor: COLORS.blue,
                    color: COLORS.white,
                    border: "none",
                    borderRadius: 8,
                    fontSize: 16,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "background-color 0.2s",
                  }}
                >
                  Submit Partnership Inquiry <ArrowRight size={18} />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        @media (max-width: 768px) {
          .partners-grid {
            grid-template-columns: 1fr !important;
          }
          .tech-grid {
            grid-template-columns: 1fr 1fr !important;
          }
          .form-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 480px) {
          .tech-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
