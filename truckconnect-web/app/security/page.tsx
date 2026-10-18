"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Shield,
  Lock,
  Server,
  FileCheck,
  Eye,
  ArrowRight,
  CheckCircle,
  Key,
  Globe,
  AlertTriangle,
  Activity,
  FileText,
} from "lucide-react";
import type { CSSProperties, ReactNode } from "react";

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

interface SecuritySection {
  icon: ReactNode;
  title: string;
  description: string;
  items: string[];
  bgColor: string;
  iconColor: string;
}

const SECURITY_SECTIONS: SecuritySection[] = [
  {
    icon: <Lock size={28} />,
    title: "Data Protection",
    description: "Your data is encrypted at rest and in transit using industry-standard protocols.",
    bgColor: "#dbeafe",
    iconColor: COLORS.blue,
    items: [
      "AES-256 encryption at rest for all stored data",
      "TLS 1.3 for all data in transit (HTTPS everywhere)",
      "Data residency within Philippine-compliant cloud regions",
      "Regular automated backups with point-in-time recovery",
      "Secure data deletion upon account cancellation (30-day grace period)",
    ],
  },
  {
    icon: <Key size={28} />,
    title: "Authentication & Access Control",
    description: "Multi-layered authentication keeps accounts secure with modern security standards.",
    bgColor: "#dcfce7",
    iconColor: COLORS.green,
    items: [
      "Strong password policies with bcrypt hashing",
      "Session management with automatic expiration and revocation",
      "API key security with scoped permissions and rotation support",
      "Role-based access control (RBAC) across all portals",
      "OAuth 2.0 and social login support (Google, GitHub)",
      "Rate-limited authentication endpoints to prevent brute force",
    ],
  },
  {
    icon: <Server size={28} />,
    title: "Infrastructure Security",
    description: "Enterprise-grade cloud infrastructure with multiple layers of protection.",
    bgColor: "#fef3c7",
    iconColor: "#d97706",
    items: [
      "Hosted on Vercel Edge Network with global CDN",
      "Cloudflare DDoS protection and Web Application Firewall",
      "Rate limiting on all API endpoints (configurable per plan)",
      "Serverless architecture eliminates server-level vulnerabilities",
      "Automated security patches and zero-downtime deployments",
      "Database isolation with Neon serverless PostgreSQL",
    ],
  },
  {
    icon: <FileCheck size={28} />,
    title: "Regulatory Compliance",
    description: "Built to comply with Philippine logistics, trade, and financial regulations.",
    bgColor: "#ede9fe",
    iconColor: "#7c3aed",
    items: [
      "LTFRB compliance verification for all registered carriers",
      "DTI business registration validation for marketplace participants",
      "BSP e-money regulations compliance for GCash integration",
      "Data Privacy Act of 2012 (Republic Act No. 10173) compliance",
      "National Privacy Commission registration",
      "Anti-Money Laundering Act compliance for financial transactions",
    ],
  },
  {
    icon: <Eye size={28} />,
    title: "Audit & Monitoring",
    description: "Comprehensive logging and monitoring for full visibility into platform activity.",
    bgColor: "#fce7f3",
    iconColor: "#db2777",
    items: [
      "Complete audit logs for all user actions and data changes",
      "Webhook security with HMAC-SHA256 signature verification",
      "Real-time monitoring and alerting for suspicious activity",
      "Automated anomaly detection on authentication patterns",
      "API request logging with configurable retention policies",
      "Incident response procedures with defined SLAs",
    ],
  },
];

export default function SecurityPage() {
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
            <Shield size={32} color={COLORS.white} />
          </div>
          <h1 style={{ fontSize: 44, fontWeight: 800, color: COLORS.white, margin: "0 0 16px", lineHeight: 1.15 }}>
            Security & Trust
          </h1>
          <p style={{ fontSize: 20, color: COLORS.gray300, margin: "0 auto", maxWidth: 620, lineHeight: 1.6 }}>
            Your data security and privacy are foundational to everything we build. Here is how we protect your business.
          </p>
        </div>
      </section>

      {/* Security Sections */}
      {SECURITY_SECTIONS.map((section, idx) => (
        <section
          key={section.title}
          style={{
            padding: "80px 0",
            backgroundColor: idx % 2 === 0 ? COLORS.white : COLORS.gray50,
          }}
        >
          <div style={container}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1.5fr",
                gap: 64,
                alignItems: "start",
              }}
              className="security-grid"
            >
              {/* Left: Title */}
              <div>
                <div
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 14,
                    backgroundColor: section.bgColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 20,
                    color: section.iconColor,
                  }}
                >
                  {section.icon}
                </div>
                <h2 style={{ fontSize: 28, fontWeight: 700, color: COLORS.navy, margin: "0 0 12px" }}>
                  {section.title}
                </h2>
                <p style={{ fontSize: 16, color: COLORS.gray500, lineHeight: 1.7, margin: 0 }}>
                  {section.description}
                </p>
              </div>

              {/* Right: Items */}
              <div
                style={{
                  backgroundColor: COLORS.white,
                  borderRadius: 16,
                  padding: 32,
                  border: `1px solid ${COLORS.gray200}`,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                  {section.items.map((item) => (
                    <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                      <CheckCircle
                        size={18}
                        color={COLORS.green}
                        style={{ marginTop: 2, flexShrink: 0 }}
                      />
                      <span style={{ fontSize: 15, color: COLORS.gray700, lineHeight: 1.6 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* SOC 2 Badge */}
      <section style={{ padding: "80px 0", backgroundColor: COLORS.white }}>
        <div style={container}>
          <div
            style={{
              maxWidth: 700,
              margin: "0 auto",
              textAlign: "center",
              padding: 48,
              borderRadius: 20,
              border: `2px dashed ${COLORS.gray300}`,
              backgroundColor: COLORS.gray50,
            }}
          >
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: 20,
                backgroundColor: "#dbeafe",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px",
              }}
            >
              <Shield size={40} color={COLORS.blue} />
            </div>
            <div
              style={{
                display: "inline-block",
                padding: "6px 16px",
                borderRadius: 999,
                backgroundColor: "#fef3c7",
                color: "#d97706",
                fontSize: 12,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: 1,
                marginBottom: 16,
              }}
            >
              Coming Soon
            </div>
            <h3 style={{ fontSize: 26, fontWeight: 700, color: COLORS.navy, margin: "0 0 12px" }}>
              SOC 2 Type II Certification
            </h3>
            <p style={{ fontSize: 16, color: COLORS.gray500, lineHeight: 1.7, margin: 0, maxWidth: 500, marginLeft: "auto", marginRight: "auto" }}>
              We are actively working towards SOC 2 Type II certification to provide our enterprise customers with
              independently verified assurance of our security controls, availability, and data integrity.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Security Team CTA */}
      <section
        style={{
          background: `linear-gradient(135deg, ${COLORS.navy} 0%, ${COLORS.navyDark} 100%)`,
          padding: "80px 0",
          textAlign: "center",
        }}
      >
        <div style={container}>
          <h2 style={{ fontSize: 36, fontWeight: 700, color: COLORS.white, margin: "0 0 16px" }}>
            Questions about security?
          </h2>
          <p style={{ fontSize: 18, color: COLORS.gray300, margin: "0 0 12px" }}>
            Our security team is available to answer your questions and discuss your compliance requirements.
          </p>
          <p style={{ fontSize: 15, color: COLORS.gray400, margin: "0 0 32px" }}>
            Report vulnerabilities responsibly at security@truckconnect.ph
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href="mailto:security@truckconnect.ph"
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
              Contact Security Team <ArrowRight size={18} />
            </a>
            <a
              href={`${AUTH_URL}/sign-up`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 28px",
                backgroundColor: "transparent",
                color: COLORS.white,
                border: `2px solid rgba(255,255,255,0.3)`,
                borderRadius: 8,
                fontSize: 16,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Get Started Free
            </a>
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        @media (max-width: 768px) {
          .security-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
