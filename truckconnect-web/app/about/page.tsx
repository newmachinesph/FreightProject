"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ArrowRight,
  MapPin,
  Mail,
  Phone,
  Target,
  Eye,
  Heart,
  Users,
  Building2,
  Globe,
  Calendar,
  Rocket,
  TrendingUp,
  Award,
  Newspaper,
  ExternalLink,
  Briefcase,
} from "lucide-react";
import type { CSSProperties } from "react";

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

const MILESTONES = [
  { year: "2024", quarter: "Q1", title: "Company Founded", description: "TruckConnect incorporated in Manila with a vision to connect Philippine freight.", icon: <Rocket size={20} color="#ffffff" /> },
  { year: "2024", quarter: "Q3", title: "Seed Funding Secured", description: "Raised seed round led by QBO Innovation Hub and local angel investors.", icon: <TrendingUp size={20} color="#ffffff" /> },
  { year: "2025", quarter: "Q1", title: "Platform Launch", description: "Public launch of shipper and carrier portals covering Metro Manila and Central Luzon.", icon: <Calendar size={20} color="#ffffff" /> },
  { year: "2025", quarter: "Q3", title: "500+ Loads Milestone", description: "Surpassed 500 loads booked on the platform with a 97% on-time delivery rate.", icon: <Award size={20} color="#ffffff" /> },
  { year: "2025", quarter: "Q4", title: "Warehouse Portal Launch", description: "Expanded into warehousing, connecting 50+ facilities across Luzon and Visayas.", icon: <Building2 size={20} color="#ffffff" /> },
  { year: "2026", quarter: "Q1", title: "Series A Funding", description: "Closed Series A to accelerate nationwide expansion and interisland logistics.", icon: <TrendingUp size={20} color="#ffffff" /> },
];

const ADVISORS = [
  { name: "Ricardo Saludo", title: "Former VP of Logistics", company: "JGS / Robinsons Logistics", bio: "25+ years in Philippine supply chain operations and fleet management." },
  { name: "Patricia Ang", title: "Partner", company: "QBO Innovation Hub", bio: "Early-stage investor focused on logistics-tech and marketplace startups in SEA." },
  { name: "David Lim", title: "Former CTO", company: "Lalamove Philippines", bio: "Scaled engineering teams across 3 Southeast Asian markets. Advisor on platform architecture." },
];

const PRESS = [
  { outlet: "Philippine Star", headline: "TruckConnect raises seed funding to digitize Filipino freight", date: "August 2024", url: "#" },
  { outlet: "BusinessWorld", headline: "How a Manila startup is tackling the archipelago logistics gap", date: "February 2025", url: "#" },
  { outlet: "Tech in Asia", headline: "TruckConnect hits 500-load milestone, eyes Series A for interisland expansion", date: "September 2025", url: "#" },
];

const TEAM = [
  { name: "Juan Dela Cruz", role: "CEO & Co-founder", location: "Manila" },
  { name: "Maria Santos", role: "CTO & Co-founder", location: "Manila" },
  { name: "Carlos Reyes", role: "VP of Operations", location: "Cebu" },
  { name: "Ana Garcia", role: "Head of Product", location: "Manila" },
  { name: "Marco Tan", role: "Head of Sales", location: "Davao" },
  { name: "Sofia Cruz", role: "Head of Engineering", location: "Manila" },
];

const OFFICES = [
  {
    city: "Manila",
    type: "Headquarters",
    address: "BGC, Taguig City, Metro Manila",
    phone: "+63 2 8123 4567",
  },
  {
    city: "Cebu",
    type: "Regional Office",
    address: "Cebu IT Park, Cebu City",
    phone: "+63 32 234 5678",
  },
  {
    city: "Davao",
    type: "Regional Office",
    address: "Abreeza Business Park, Davao City",
    phone: "+63 82 345 6789",
  },
];

export default function AboutPage() {
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
          <h1 style={{ fontSize: 44, fontWeight: 800, color: COLORS.white, margin: "0 0 16px", lineHeight: 1.15 }}>
            Built in the Philippines,
            <br />
            for the Philippines
          </h1>
          <p style={{ fontSize: 20, color: COLORS.gray300, margin: "0 auto", maxWidth: 560, lineHeight: 1.6 }}>
            We are on a mission to modernize freight logistics across the Philippine archipelago.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section style={{ padding: "80px 0" }}>
        <div style={container}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 32,
              maxWidth: 900,
              margin: "0 auto",
            }}
          >
            {[
              {
                icon: <Target size={32} color={COLORS.blue} />,
                title: "Our Mission",
                text: "To connect every shipper, carrier, and warehouse in the Philippines through a single, transparent platform — eliminating middlemen, reducing costs, and making freight logistics accessible to businesses of all sizes.",
              },
              {
                icon: <Eye size={32} color={COLORS.blue} />,
                title: "Our Vision",
                text: "A Philippines where any business can move goods across the archipelago as easily as sending a message — with full visibility, fair pricing, and reliable delivery from island to island.",
              },
              {
                icon: <Heart size={32} color={COLORS.blue} />,
                title: "Our Values",
                text: "Transparency in every transaction. Fairness for every participant. Reliability that businesses can count on. Innovation that solves real problems for Filipino logistics operators.",
              },
            ].map((item) => (
              <div
                key={item.title}
                style={{
                  padding: 40,
                  borderRadius: 16,
                  border: `1px solid ${COLORS.gray200}`,
                  backgroundColor: COLORS.white,
                }}
              >
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 16,
                    backgroundColor: "#dbeafe",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 24,
                  }}
                >
                  {item.icon}
                </div>
                <h3 style={{ fontSize: 22, fontWeight: 700, color: COLORS.navy, margin: "0 0 12px" }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: 15, color: COLORS.gray500, lineHeight: 1.7, margin: 0 }}>
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section style={{ padding: "80px 0", backgroundColor: COLORS.gray50 }}>
        <div style={{ ...container, maxWidth: 800 }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, color: COLORS.navy, textAlign: "center", margin: "0 0 16px" }}>
            Our Story
          </h2>
          <div style={{ fontSize: 16, color: COLORS.gray600, lineHeight: 1.8, textAlign: "center" }}>
            <p style={{ margin: "0 0 16px" }}>
              TruckConnect was born from a simple frustration: moving freight across the Philippines
              is harder than it should be. With over 7,600 islands, fragmented logistics providers,
              and opaque pricing, businesses waste time, money, and opportunities every day.
            </p>
            <p style={{ margin: "0 0 16px" }}>
              Founded in 2024 in Manila, we set out to build the platform we wished existed — one
              that connects shippers directly with carriers, provides real-time tracking, and offers
              transparent pricing without the middlemen.
            </p>
            <p style={{ margin: 0 }}>
              Today, TruckConnect serves hundreds of businesses across Luzon, Visayas, and Mindanao,
              with a growing network of verified carriers and warehouse operators. We are just getting
              started.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline / Milestones */}
      <section style={{ padding: "80px 0" }}>
        <div style={container}>
          <h2 style={{ fontSize: 32, fontWeight: 700, color: COLORS.navy, textAlign: "center", margin: "0 0 16px" }}>
            Our Journey
          </h2>
          <p style={{ fontSize: 18, color: COLORS.gray500, textAlign: "center", margin: "0 auto 56px", maxWidth: 520 }}>
            Key milestones on our mission to transform Philippine logistics.
          </p>

          <div style={{ position: "relative", maxWidth: 700, margin: "0 auto" }}>
            {/* Vertical line */}
            <div
              style={{
                position: "absolute",
                left: 24,
                top: 0,
                bottom: 0,
                width: 3,
                backgroundColor: COLORS.gray200,
                borderRadius: 2,
              }}
            />

            {MILESTONES.map((m, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 24,
                  marginBottom: i < MILESTONES.length - 1 ? 40 : 0,
                  position: "relative",
                }}
              >
                {/* Dot */}
                <div
                  style={{
                    width: 48,
                    height: 48,
                    minWidth: 48,
                    borderRadius: "50%",
                    backgroundColor: COLORS.blue,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    zIndex: 1,
                    boxShadow: "0 0 0 6px #ffffff",
                  }}
                >
                  {m.icon}
                </div>

                {/* Content */}
                <div
                  style={{
                    flex: 1,
                    padding: "20px 28px",
                    borderRadius: 12,
                    border: `1px solid ${COLORS.gray200}`,
                    backgroundColor: COLORS.white,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: COLORS.blue,
                        backgroundColor: "#dbeafe",
                        padding: "3px 10px",
                        borderRadius: 20,
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                      }}
                    >
                      {m.year} {m.quarter}
                    </span>
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: COLORS.navy, margin: "0 0 6px" }}>
                    {m.title}
                  </h3>
                  <p style={{ fontSize: 14, color: COLORS.gray500, lineHeight: 1.6, margin: 0 }}>
                    {m.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advisors */}
      <section style={{ padding: "80px 0", backgroundColor: COLORS.gray50 }}>
        <div style={container}>
          <h2 style={{ fontSize: 32, fontWeight: 700, color: COLORS.navy, textAlign: "center", margin: "0 0 16px" }}>
            Investors &amp; Advisors
          </h2>
          <p style={{ fontSize: 18, color: COLORS.gray500, textAlign: "center", margin: "0 auto 48px", maxWidth: 540 }}>
            Industry veterans guiding our growth and strategy.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 24,
              maxWidth: 960,
              margin: "0 auto",
            }}
          >
            {ADVISORS.map((a) => (
              <div
                key={a.name}
                style={{
                  padding: 32,
                  borderRadius: 12,
                  border: `1px solid ${COLORS.gray200}`,
                  backgroundColor: COLORS.white,
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    backgroundColor: "#dbeafe",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 20,
                  }}
                >
                  <Briefcase size={24} color={COLORS.blue} />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: COLORS.navy, margin: "0 0 4px" }}>
                  {a.name}
                </h3>
                <p style={{ fontSize: 14, color: COLORS.blue, fontWeight: 600, margin: "0 0 4px" }}>
                  {a.title}
                </p>
                <p style={{ fontSize: 13, color: COLORS.gray400, fontWeight: 500, margin: "0 0 12px" }}>
                  {a.company}
                </p>
                <p style={{ fontSize: 14, color: COLORS.gray500, lineHeight: 1.6, margin: 0 }}>
                  {a.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Press & Media */}
      <section style={{ padding: "80px 0" }}>
        <div style={container}>
          <h2 style={{ fontSize: 32, fontWeight: 700, color: COLORS.navy, textAlign: "center", margin: "0 0 16px" }}>
            Press &amp; Media
          </h2>
          <p style={{ fontSize: 18, color: COLORS.gray500, textAlign: "center", margin: "0 auto 48px", maxWidth: 480 }}>
            TruckConnect in the news.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 24,
              maxWidth: 1000,
              margin: "0 auto",
            }}
          >
            {PRESS.map((p) => (
              <a
                key={p.headline}
                href={p.url}
                style={{
                  textDecoration: "none",
                  padding: 28,
                  borderRadius: 12,
                  border: `1px solid ${COLORS.gray200}`,
                  backgroundColor: COLORS.white,
                  display: "block",
                  transition: "box-shadow 0.2s",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      backgroundColor: "#dbeafe",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Newspaper size={18} color={COLORS.blue} />
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: COLORS.navy, margin: 0 }}>
                      {p.outlet}
                    </p>
                    <p style={{ fontSize: 12, color: COLORS.gray400, margin: 0 }}>
                      {p.date}
                    </p>
                  </div>
                </div>
                <p style={{ fontSize: 16, fontWeight: 600, color: COLORS.navy, lineHeight: 1.5, margin: "0 0 12px" }}>
                  {p.headline}
                </p>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 13, color: COLORS.blue, fontWeight: 600 }}>
                  Read Article <ExternalLink size={13} />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section style={{ padding: "80px 0", backgroundColor: COLORS.gray50 }}>
        <div style={container}>
          <h2 style={{ fontSize: 32, fontWeight: 700, color: COLORS.navy, textAlign: "center", margin: "0 0 16px" }}>
            Our Team
          </h2>
          <p style={{ fontSize: 18, color: COLORS.gray500, textAlign: "center", margin: "0 auto 48px", maxWidth: 500 }}>
            Filipino logistics and technology experts building the future of freight.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 24,
              maxWidth: 900,
              margin: "0 auto",
            }}
          >
            {TEAM.map((member) => (
              <div
                key={member.name}
                style={{
                  textAlign: "center",
                  padding: 32,
                  borderRadius: 12,
                  border: `1px solid ${COLORS.gray200}`,
                  backgroundColor: COLORS.white,
                }}
              >
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: "50%",
                    backgroundColor: "#dbeafe",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px",
                  }}
                >
                  <Users size={28} color={COLORS.blue} />
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: COLORS.navy, margin: "0 0 4px" }}>
                  {member.name}
                </h3>
                <p style={{ fontSize: 14, color: COLORS.blue, fontWeight: 500, margin: "0 0 4px" }}>
                  {member.role}
                </p>
                <p style={{ fontSize: 13, color: COLORS.gray400, margin: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                  <MapPin size={12} /> {member.location}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Offices */}
      <section style={{ padding: "80px 0" }}>
        <div style={container}>
          <h2 style={{ fontSize: 32, fontWeight: 700, color: COLORS.navy, textAlign: "center", margin: "0 0 16px" }}>
            Our Offices
          </h2>
          <p style={{ fontSize: 18, color: COLORS.gray500, textAlign: "center", margin: "0 auto 48px", maxWidth: 500 }}>
            Strategically located across the major Philippine logistics hubs.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 24,
              maxWidth: 960,
              margin: "0 auto",
            }}
          >
            {OFFICES.map((office) => (
              <div
                key={office.city}
                style={{
                  padding: 32,
                  borderRadius: 12,
                  border: `1px solid ${COLORS.gray200}`,
                  backgroundColor: COLORS.white,
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    backgroundColor: "#dbeafe",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 20,
                  }}
                >
                  <Building2 size={24} color={COLORS.blue} />
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: COLORS.navy, margin: "0 0 4px" }}>
                  {office.city}
                </h3>
                <p style={{ fontSize: 13, color: COLORS.blue, fontWeight: 600, margin: "0 0 16px", textTransform: "uppercase", letterSpacing: 0.5 }}>
                  {office.type}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: COLORS.gray600 }}>
                    <MapPin size={14} color={COLORS.gray400} />
                    {office.address}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: COLORS.gray600 }}>
                    <Phone size={14} color={COLORS.gray400} />
                    {office.phone}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section style={{ padding: "80px 0" }}>
        <div style={{ ...container, maxWidth: 600, textAlign: "center" }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, color: COLORS.navy, margin: "0 0 16px" }}>
            Get in Touch
          </h2>
          <p style={{ fontSize: 16, color: COLORS.gray500, lineHeight: 1.6, margin: "0 0 32px" }}>
            Have questions? Want to partner with us? We would love to hear from you.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "center" }}>
            <a
              href="mailto:hello@truckconnect.ph"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 16,
                color: COLORS.blue,
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              <Mail size={18} /> hello@truckconnect.ph
            </a>
            <a
              href="tel:+6328123-4567"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 16,
                color: COLORS.blue,
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              <Phone size={18} /> +63 2 8123 4567
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          background: `linear-gradient(135deg, ${COLORS.navy} 0%, ${COLORS.navyDark} 100%)`,
          padding: "80px 0",
          textAlign: "center",
        }}
      >
        <div style={container}>
          <h2 style={{ fontSize: 36, fontWeight: 700, color: COLORS.white, margin: "0 0 16px" }}>
            Join the movement
          </h2>
          <p style={{ fontSize: 18, color: COLORS.gray300, margin: "0 0 32px" }}>
            Be part of the platform transforming Philippine freight logistics.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href={`${AUTH_URL}/sign-up`}
              style={{
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
                textDecoration: "none",
              }}
            >
              Get Started Free <ArrowRight size={18} />
            </a>
            <a
              href="mailto:careers@truckconnect.ph"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 28px",
                backgroundColor: "transparent",
                color: COLORS.white,
                border: `2px solid ${COLORS.white}`,
                borderRadius: 8,
                fontSize: 16,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              View Careers
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
