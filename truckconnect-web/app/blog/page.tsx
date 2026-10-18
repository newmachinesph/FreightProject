"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
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
};

const container: CSSProperties = { maxWidth: 1200, margin: "0 auto", padding: "0 24px" };
const sectionPadding: CSSProperties = { padding: "80px 0" };

const CATEGORIES = ["All", "Industry", "Product", "Engineering", "Company"] as const;

const CATEGORY_COLORS: Record<string, string> = {
  Industry: "#059669",
  Product: COLORS.blue,
  Engineering: "#7c3aed",
  Company: COLORS.amber,
};

const GRADIENT_MAP: Record<string, string> = {
  Industry: "linear-gradient(135deg, #059669 0%, #0d9488 100%)",
  Product: "linear-gradient(135deg, #2563EB 0%, #3b82f6 100%)",
  Engineering: "linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)",
  Company: "linear-gradient(135deg, #d97706 0%, #f59e0b 100%)",
};

const POSTS = [
  {
    title: "How AI is Transforming Philippine Freight",
    category: "Industry",
    date: "Mar 15, 2026",
    excerpt: "Artificial intelligence is reshaping how goods move across the Philippine archipelago. From demand forecasting to route optimization, here's what's changing.",
  },
  {
    title: "Introducing Real-Time Carbon Tracking",
    category: "Product",
    date: "Mar 10, 2026",
    excerpt: "TruckConnect now tracks the carbon footprint of every shipment. Learn how we're helping shippers meet their sustainability goals across the supply chain.",
  },
  {
    title: "Why We Built TruckConnect on Next.js 16",
    category: "Engineering",
    date: "Mar 5, 2026",
    excerpt: "A deep dive into our tech stack decisions and why Next.js 16 was the right choice. We cover performance, DX, and lessons learned from our migration.",
  },
  {
    title: "Manila-Cebu: The Busiest Freight Corridor",
    category: "Industry",
    date: "Feb 28, 2026",
    excerpt: "The Manila-Cebu route handles over 40% of inter-island freight in the Philippines. We analyze the data behind this critical logistics corridor.",
  },
  {
    title: "Meet Our New Carrier Portal",
    category: "Product",
    date: "Feb 20, 2026",
    excerpt: "We've completely redesigned the carrier experience with faster load matching, instant payouts, and a mobile-first interface for drivers on the road.",
  },
  {
    title: "Series A: Growing Philippine Logistics Tech",
    category: "Company",
    date: "Feb 15, 2026",
    excerpt: "We're excited to announce our Series A funding round. Here's our vision for scaling TruckConnect across the Philippines and Southeast Asia.",
  },
];

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const filtered = activeCategory === "All" ? POSTS : POSTS.filter((p) => p.category === activeCategory);

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
            TruckConnect Blog
          </h1>
          <p style={{ fontSize: 20, color: COLORS.gray300, lineHeight: 1.6, maxWidth: 560, margin: "0 auto" }}>
            Insights on Philippine logistics, freight tech, and supply chain
          </p>
        </div>
      </section>

      {/* Category Filter + Posts */}
      <section style={{ ...sectionPadding, backgroundColor: COLORS.gray50 }}>
        <div style={container}>
          {/* Category pills */}
          <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 48, flexWrap: "wrap" }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: "8px 20px",
                  borderRadius: 999,
                  border: "none",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  backgroundColor: activeCategory === cat ? COLORS.blue : COLORS.white,
                  color: activeCategory === cat ? COLORS.white : COLORS.gray600,
                  boxShadow: activeCategory === cat ? "none" : `0 1px 3px rgba(0,0,0,0.08)`,
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Posts grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 32 }} className="blog-grid">
            {filtered.map((post) => (
              <article
                key={post.title}
                style={{
                  borderRadius: 12,
                  overflow: "hidden",
                  backgroundColor: COLORS.white,
                  border: `1px solid ${COLORS.gray200}`,
                  transition: "box-shadow 0.2s",
                }}
              >
                {/* Thumbnail placeholder */}
                <div
                  style={{
                    height: 180,
                    background: GRADIENT_MAP[post.category],
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span style={{ fontSize: 40, opacity: 0.3, color: COLORS.white, fontWeight: 800 }}>TC</span>
                </div>

                <div style={{ padding: 24 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        padding: "3px 10px",
                        borderRadius: 999,
                        backgroundColor: `${CATEGORY_COLORS[post.category]}15`,
                        color: CATEGORY_COLORS[post.category],
                      }}
                    >
                      {post.category}
                    </span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 13, color: COLORS.gray400 }}>
                      <Calendar size={13} /> {post.date}
                    </span>
                  </div>
                  <h3 style={{ fontSize: 20, fontWeight: 700, color: COLORS.navy, margin: "0 0 10px", lineHeight: 1.3 }}>
                    {post.title}
                  </h3>
                  <p style={{ fontSize: 14, color: COLORS.gray500, lineHeight: 1.7, margin: "0 0 16px" }}>
                    {post.excerpt}
                  </p>
                  <a
                    href="#"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: 14,
                      fontWeight: 600,
                      color: COLORS.blue,
                      textDecoration: "none",
                    }}
                  >
                    Read More <ArrowRight size={15} />
                  </a>
                </div>
              </article>
            ))}
          </div>

          {/* Pagination placeholder */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginTop: 48 }}>
            <button style={{ width: 40, height: 40, borderRadius: 8, border: `1px solid ${COLORS.gray200}`, backgroundColor: COLORS.white, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ChevronLeft size={18} color={COLORS.gray400} />
            </button>
            {[1, 2, 3].map((n) => (
              <button
                key={n}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 8,
                  border: "none",
                  backgroundColor: n === 1 ? COLORS.blue : COLORS.white,
                  color: n === 1 ? COLORS.white : COLORS.gray600,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  boxShadow: n !== 1 ? `0 1px 3px rgba(0,0,0,0.08)` : "none",
                }}
              >
                {n}
              </button>
            ))}
            <button style={{ width: 40, height: 40, borderRadius: 8, border: `1px solid ${COLORS.gray200}`, backgroundColor: COLORS.white, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ChevronRight size={18} color={COLORS.gray400} />
            </button>
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        @media (max-width: 768px) {
          .blog-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
