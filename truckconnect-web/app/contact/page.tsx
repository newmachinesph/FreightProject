"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ChevronDown,
  ArrowRight,
  Building2,
  MessageSquare,
} from "lucide-react";
import { useState, type CSSProperties } from "react";

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
  width: "100%",
  justifyContent: "center",
};

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

const OFFICES = [
  { city: "Manila HQ", address: "One Bonifacio High Street, 28th Floor, BGC, Taguig City 1634" },
  { city: "Cebu Regional", address: "Cebu Business Park, Tower 2, 12th Floor, Cebu City 6000" },
  { city: "Davao Regional", address: "Abreeza Corporate Center, 8th Floor, Davao City 8000" },
];

const FAQS = [
  {
    q: "How do I get started with TruckConnect?",
    a: "Sign up for a free account, complete your company profile, and you can start posting loads or browsing available shipments immediately. Our onboarding team will guide you through the process.",
  },
  {
    q: "Do you offer enterprise pricing?",
    a: "Yes! For companies with high volume shipping needs, we offer custom enterprise plans with dedicated account managers, priority support, and volume discounts. Contact our sales team to learn more.",
  },
  {
    q: "How can I access the TruckConnect API?",
    a: "Visit our Developer portal to create an API key. We offer a free sandbox environment for testing, comprehensive documentation, and SDKs for JavaScript and Python. Rate limits vary by plan.",
  },
];

export default function ContactPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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
          <h1 style={{ fontSize: 48, fontWeight: 800, color: COLORS.white, lineHeight: 1.15, margin: "0 0 16px" }}>
            Get in Touch
          </h1>
          <p style={{ fontSize: 20, color: COLORS.gray300, lineHeight: 1.6, maxWidth: 520, margin: "0 auto" }}>
            Have questions about TruckConnect? We'd love to hear from you. Our team is ready to help.
          </p>
        </div>
      </section>

      {/* Contact Form + Info */}
      <section style={{ ...sectionPadding, backgroundColor: COLORS.white }}>
        <div style={container}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64 }} className="contact-grid">
            {/* Left: Form */}
            <div>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: COLORS.navy, margin: "0 0 8px" }}>Send us a message</h2>
              <p style={{ fontSize: 15, color: COLORS.gray500, margin: "0 0 32px", lineHeight: 1.6 }}>Fill out the form below and we'll get back to you within 24 hours.</p>

              <form onSubmit={(e) => e.preventDefault()} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div>
                  <label style={labelStyle}>Name</label>
                  <input type="text" placeholder="Juan Dela Cruz" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Email</label>
                  <input type="email" placeholder="juan@company.com" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Company</label>
                  <input type="text" placeholder="Your Company, Inc." style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Subject</label>
                  <select style={{ ...inputStyle, appearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" }}>
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="sales">Sales</option>
                    <option value="support">Support</option>
                    <option value="partnership">Partnership</option>
                    <option value="press">Press</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Message</label>
                  <textarea placeholder="Tell us how we can help..." rows={5} style={{ ...inputStyle, resize: "vertical" }} />
                </div>
                <button type="submit" style={btnPrimary}>
                  Send Message <ArrowRight size={18} />
                </button>
              </form>
            </div>

            {/* Right: Company Info */}
            <div>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: COLORS.navy, margin: "0 0 8px" }}>Company Information</h2>
              <p style={{ fontSize: 15, color: COLORS.gray500, margin: "0 0 32px", lineHeight: 1.6 }}>Reach us through any of these channels.</p>

              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                {[
                  { icon: <MapPin size={20} color={COLORS.blue} />, label: "Address", value: "One Bonifacio High Street, 28th Floor\nBGC, Taguig City 1634, Philippines" },
                  { icon: <Phone size={20} color={COLORS.blue} />, label: "Phone", value: "+63 2 8123 4567" },
                  { icon: <Mail size={20} color={COLORS.blue} />, label: "Email", value: "hello@truckconnect.ph" },
                  { icon: <Clock size={20} color={COLORS.blue} />, label: "Business Hours", value: "Monday - Friday, 8:00 AM - 6:00 PM PHT\nSaturday, 9:00 AM - 1:00 PM PHT" },
                ].map((item) => (
                  <div key={item.label} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                    <div style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: COLORS.gray50, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: `1px solid ${COLORS.gray200}` }}>
                      {item.icon}
                    </div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: COLORS.gray400, margin: "0 0 4px", textTransform: "uppercase", letterSpacing: 0.5 }}>{item.label}</p>
                      <p style={{ fontSize: 15, color: COLORS.gray700, margin: 0, lineHeight: 1.6, whiteSpace: "pre-line" }}>{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Offices */}
              <div style={{ marginTop: 40 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: COLORS.navy, margin: "0 0 20px" }}>Our Offices</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {OFFICES.map((office) => (
                    <div key={office.city} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: 16, borderRadius: 10, backgroundColor: COLORS.gray50, border: `1px solid ${COLORS.gray200}` }}>
                      <MapPin size={18} color={COLORS.blue} style={{ flexShrink: 0, marginTop: 2 }} />
                      <div>
                        <p style={{ fontSize: 15, fontWeight: 600, color: COLORS.navy, margin: "0 0 4px" }}>{office.city}</p>
                        <p style={{ fontSize: 13, color: COLORS.gray500, margin: 0, lineHeight: 1.5 }}>{office.address}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ ...sectionPadding, backgroundColor: COLORS.gray50 }}>
        <div style={{ ...container, maxWidth: 720 }}>
          <h2 style={sectionTitle}>Frequently Asked Questions</h2>
          <p style={sectionSubtitle}>Quick answers to common questions.</p>
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
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "18px 24px",
                    border: "none",
                    backgroundColor: "transparent",
                    cursor: "pointer",
                    textAlign: "left",
                    fontSize: 16,
                    fontWeight: 600,
                    color: COLORS.navy,
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
                  <div style={{ padding: "0 24px 18px" }}>
                    <p style={{ fontSize: 15, color: COLORS.gray500, lineHeight: 1.7, margin: 0 }}>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Urgent Support Banner */}
      <section style={{ backgroundColor: COLORS.blue, padding: "24px 0" }}>
        <div style={{ ...container, textAlign: "center" }}>
          <p style={{ fontSize: 16, color: COLORS.white, margin: 0, fontWeight: 500 }}>
            For urgent support, call <a href="tel:+63281234567" style={{ color: COLORS.white, fontWeight: 700, textDecoration: "underline" }}>+63 2 8123 4567</a> — available 24/7 for enterprise customers.
          </p>
        </div>
      </section>

      <Footer />

      <style>{`
        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
