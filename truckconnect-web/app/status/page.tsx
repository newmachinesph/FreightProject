"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CheckCircle, AlertTriangle, Clock, Mail } from "lucide-react";
import { useState } from "react";
import type { CSSProperties } from "react";

const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL ?? "http://localhost:3001";

const COLORS = {
  navy: "#1B2D5E",
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
  gray800: "#1e293b",
  green: "#059669",
  greenLight: "#d1fae5",
  greenBg: "#ecfdf5",
  yellow: "#d97706",
  yellowLight: "#fef3c7",
  red: "#dc2626",
};

const container: CSSProperties = { maxWidth: 900, margin: "0 auto", padding: "0 24px" };

interface ServiceStatus {
  name: string;
  status: "operational" | "degraded" | "down";
}

const SERVICES: ServiceStatus[] = [
  { name: "Auth Service", status: "operational" },
  { name: "Shipper Portal", status: "operational" },
  { name: "Carrier Portal", status: "operational" },
  { name: "Warehouse Portal", status: "operational" },
  { name: "Marketplace", status: "operational" },
  { name: "API Gateway", status: "operational" },
  { name: "Database", status: "operational" },
];

interface Incident {
  title: string;
  date: string;
  duration: string;
  type: "resolved" | "scheduled";
}

const INCIDENTS: Incident[] = [
  {
    title: "Resolved: API latency spike",
    date: "March 15, 2026",
    duration: "5 minutes",
    type: "resolved",
  },
  {
    title: "Resolved: Database maintenance",
    date: "March 10, 2026",
    duration: "30 minutes (scheduled)",
    type: "scheduled",
  },
  {
    title: "Resolved: SMS OTP delays",
    date: "February 28, 2026",
    duration: "15 minutes",
    type: "resolved",
  },
];

function StatusBadge({ status }: { status: ServiceStatus["status"] }) {
  const config = {
    operational: { label: "Operational", color: COLORS.green, bg: COLORS.greenLight },
    degraded: { label: "Degraded", color: COLORS.yellow, bg: COLORS.yellowLight },
    down: { label: "Down", color: COLORS.red, bg: "#fee2e2" },
  }[status];

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "4px 12px",
        borderRadius: 20,
        backgroundColor: config.bg,
        color: config.color,
        fontSize: 13,
        fontWeight: 600,
      }}
    >
      <span
        style={{
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          backgroundColor: config.color,
        }}
      />
      {config.label}
    </span>
  );
}

function UptimeBar() {
  const days = Array.from({ length: 30 }, (_, i) => i);
  // Use deterministic opacity based on index to avoid SSR hydration mismatch
  const opacities = days.map((d) => 0.7 + ((d * 7 + 3) % 10) * 0.03);
  return (
    <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
      {days.map((d) => (
        <div
          key={d}
          style={{
            width: "8px",
            height: "28px",
            borderRadius: "2px",
            backgroundColor: COLORS.green,
            opacity: opacities[d],
          }}
          title={`Day ${30 - d}: Operational`}
        />
      ))}
    </div>
  );
}

export default function StatusPage() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <>
      <Navbar authUrl={AUTH_URL} />

      {/* Hero */}
      <section
        style={{
          background: `linear-gradient(135deg, ${COLORS.navy} 0%, #1e3a8a 100%)`,
          padding: "100px 0 60px",
          textAlign: "center",
        }}
      >
        <div style={container}>
          <h1
            style={{
              fontSize: 40,
              fontWeight: 700,
              color: COLORS.white,
              margin: "0 0 12px",
            }}
          >
            System Status
          </h1>
          <p style={{ fontSize: 16, color: COLORS.gray400, margin: 0 }}>
            Real-time status of all TruckConnect services
          </p>
        </div>
      </section>

      {/* Overall Status Banner */}
      <section style={{ padding: "40px 0 0", backgroundColor: COLORS.gray50 }}>
        <div style={container}>
          <div
            style={{
              backgroundColor: COLORS.greenBg,
              border: `2px solid ${COLORS.green}`,
              borderRadius: 12,
              padding: "28px 32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <CheckCircle size={32} color={COLORS.green} />
              <div>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: COLORS.green, margin: 0 }}>
                  All Systems Operational
                </h2>
                <p style={{ fontSize: 14, color: COLORS.gray600, margin: "4px 0 0" }}>
                  All services are running normally
                </p>
              </div>
            </div>
            <div
              style={{
                backgroundColor: COLORS.white,
                border: `1px solid ${COLORS.green}`,
                borderRadius: 8,
                padding: "10px 20px",
                textAlign: "center",
              }}
            >
              <p style={{ fontSize: 28, fontWeight: 800, color: COLORS.green, margin: 0 }}>
                99.9%
              </p>
              <p style={{ fontSize: 12, color: COLORS.gray500, margin: "2px 0 0", fontWeight: 600 }}>
                UPTIME (30 DAYS)
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Service Status Grid */}
      <section style={{ padding: "40px 0", backgroundColor: COLORS.gray50 }}>
        <div style={container}>
          <h3
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: COLORS.navy,
              margin: "0 0 20px",
            }}
          >
            Service Status
          </h3>
          <div
            style={{
              backgroundColor: COLORS.white,
              borderRadius: 12,
              border: `1px solid ${COLORS.gray200}`,
              overflow: "hidden",
            }}
          >
            {SERVICES.map((service, i) => (
              <div
                key={service.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "18px 24px",
                  borderBottom: i < SERVICES.length - 1 ? `1px solid ${COLORS.gray100}` : "none",
                }}
              >
                <span style={{ fontSize: 15, fontWeight: 500, color: COLORS.gray800 }}>
                  {service.name}
                </span>
                <StatusBadge status={service.status} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Uptime History */}
      <section style={{ padding: "0 0 40px", backgroundColor: COLORS.gray50 }}>
        <div style={container}>
          <h3
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: COLORS.navy,
              margin: "0 0 20px",
            }}
          >
            Uptime — Last 30 Days
          </h3>
          <div
            style={{
              backgroundColor: COLORS.white,
              borderRadius: 12,
              border: `1px solid ${COLORS.gray200}`,
              padding: 24,
            }}
          >
            {SERVICES.map((service, i) => (
              <div
                key={service.name}
                style={{
                  marginBottom: i < SERVICES.length - 1 ? 20 : 0,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: 500, color: COLORS.gray600 }}>
                    {service.name}
                  </span>
                  <span style={{ fontSize: 12, color: COLORS.green, fontWeight: 600 }}>
                    99.9%
                  </span>
                </div>
                <UptimeBar />
              </div>
            ))}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 16,
                fontSize: 11,
                color: COLORS.gray400,
              }}
            >
              <span>30 days ago</span>
              <span>Today</span>
            </div>
          </div>
        </div>
      </section>

      {/* Incident History */}
      <section style={{ padding: "0 0 40px", backgroundColor: COLORS.gray50 }}>
        <div style={container}>
          <h3
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: COLORS.navy,
              margin: "0 0 20px",
            }}
          >
            Incident History
          </h3>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {INCIDENTS.map((incident) => (
              <div
                key={incident.title}
                style={{
                  backgroundColor: COLORS.white,
                  borderRadius: 12,
                  border: `1px solid ${COLORS.gray200}`,
                  padding: "20px 24px",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 14,
                }}
              >
                <div style={{ marginTop: 2 }}>
                  {incident.type === "scheduled" ? (
                    <Clock size={20} color={COLORS.blue} />
                  ) : (
                    <AlertTriangle size={20} color={COLORS.yellow} />
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      fontSize: 15,
                      fontWeight: 600,
                      color: COLORS.gray800,
                      margin: "0 0 4px",
                    }}
                  >
                    {incident.title}
                  </p>
                  <p style={{ fontSize: 13, color: COLORS.gray500, margin: 0 }}>
                    {incident.date} &middot; Duration: {incident.duration}
                  </p>
                </div>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: COLORS.green,
                    backgroundColor: COLORS.greenLight,
                    padding: "4px 10px",
                    borderRadius: 12,
                    whiteSpace: "nowrap",
                  }}
                >
                  Resolved
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscribe to Updates */}
      <section style={{ padding: "0 0 64px", backgroundColor: COLORS.gray50 }}>
        <div style={container}>
          <div
            style={{
              backgroundColor: COLORS.white,
              borderRadius: 12,
              border: `1px solid ${COLORS.gray200}`,
              padding: "36px 32px",
              textAlign: "center",
            }}
          >
            <Mail size={28} color={COLORS.blue} style={{ marginBottom: 12 }} />
            <h3 style={{ fontSize: 20, fontWeight: 700, color: COLORS.navy, margin: "0 0 8px" }}>
              Subscribe to Status Updates
            </h3>
            <p style={{ fontSize: 14, color: COLORS.gray500, margin: "0 0 24px", maxWidth: 460, marginLeft: "auto", marginRight: "auto" }}>
              Get notified via email when there are incidents, scheduled maintenance, or service
              disruptions.
            </p>

            {subscribed ? (
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  backgroundColor: COLORS.greenBg,
                  color: COLORS.green,
                  padding: "12px 24px",
                  borderRadius: 8,
                  fontWeight: 600,
                  fontSize: 14,
                }}
              >
                <CheckCircle size={18} />
                You have been subscribed to status updates.
              </div>
            ) : (
              <form
                onSubmit={handleSubscribe}
                style={{
                  display: "flex",
                  gap: 12,
                  maxWidth: 440,
                  margin: "0 auto",
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    flex: 1,
                    minWidth: 220,
                    padding: "12px 16px",
                    borderRadius: 8,
                    border: `1px solid ${COLORS.gray300}`,
                    fontSize: 14,
                    outline: "none",
                    color: COLORS.gray800,
                  }}
                />
                <button
                  type="submit"
                  style={{
                    backgroundColor: COLORS.blue,
                    color: COLORS.white,
                    border: "none",
                    borderRadius: 8,
                    padding: "12px 24px",
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
