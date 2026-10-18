"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, CheckCircle, X as XIcon, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useEffect, useRef, type CSSProperties } from "react";

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

const PLANS = [
  {
    name: "Free",
    price: "\u20B10",
    period: "",
    description: "Get started with the basics. Perfect for trying out the platform and small-scale operations.",
    highlight: false,
    features: [
      "Up to 10 load postings/mo",
      "Basic shipment tracking",
      "2 team members",
      "1 organization",
      "Community support",
      "GCash payouts",
    ],
  },
  {
    name: "Starter",
    price: "\u20B12,500",
    period: "/mo",
    description: "For small businesses and independent operators scaling their freight logistics.",
    highlight: false,
    features: [
      "Up to 100 load postings/mo",
      "Real-time shipment tracking",
      "10 team members",
      "3 organizations",
      "Email support",
      "Standard analytics",
      "GCash + bank transfer payouts",
      "API access",
    ],
  },
  {
    name: "Business",
    price: "\u20B17,500",
    period: "/mo",
    description: "For growing logistics companies that need full power, unlimited postings, and priority support.",
    highlight: true,
    badge: "Most Popular",
    features: [
      "Unlimited load postings",
      "Real-time GPS tracking",
      "Unlimited team members",
      "Unlimited organizations",
      "Priority phone & chat support",
      "Advanced analytics & reports",
      "Fleet management tools",
      "Warehouse management",
      "Custom integrations",
      "Dedicated account manager",
    ],
  },
];

const COMPARISON_FEATURES = [
  { feature: "Load Postings", free: "10/mo", starter: "100/mo", business: "Unlimited" },
  { feature: "Team Members", free: "2", starter: "10", business: "Unlimited" },
  { feature: "Organizations", free: "1", starter: "3", business: "Unlimited" },
  { feature: "Shipment Tracking", free: "Basic", starter: "Real-time", business: "Real-time GPS" },
  { feature: "Analytics", free: false, starter: "Standard", business: "Advanced" },
  { feature: "Fleet Management", free: false, starter: false, business: true },
  { feature: "Warehouse Management", free: false, starter: false, business: true },
  { feature: "API Access", free: false, starter: true, business: true },
  { feature: "Priority Support", free: false, starter: false, business: true },
  { feature: "Custom Integrations", free: false, starter: false, business: true },
  { feature: "Dedicated Account Manager", free: false, starter: false, business: true },
];

const FAQS = [
  {
    q: "Is TruckConnect really free during beta?",
    a: "Yes! During our beta period, all features across all plans are available at no cost. You will be notified well in advance before any paid plans take effect, and you will be able to choose your plan at that time.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept GCash, bank transfers (BDO, BPI, Metrobank, UnionBank), and credit/debit cards. Business plan customers can also pay via check.",
  },
  {
    q: "Can I change plans later?",
    a: "Absolutely. You can upgrade or downgrade your plan at any time. When upgrading, the difference is prorated. When downgrading, the new rate takes effect at the next billing cycle.",
  },
  {
    q: "Is there a contract or lock-in period?",
    a: "No contracts and no lock-in. All plans are month-to-month. You can cancel anytime with no penalty.",
  },
  {
    q: "Do you offer discounts for annual billing?",
    a: "Yes, annual billing comes with a 20% discount. Pay for 10 months and get 12 months of service.",
  },
  {
    q: "What happens to my data if I cancel?",
    a: "Your data remains accessible for 30 days after cancellation. You can export all your data at any time. After 30 days, data is securely deleted per our privacy policy.",
  },
];

const TRUSTED_LOGOS = [
  "FastCargo PH",
  "Metro Logistics",
  "Visayas Freight",
  "Mindanao Express",
  "LuzonHaul Co.",
  "IslandLink",
];

function AnimatedNumber({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) {
      // Animate on value change after initial
      let start = display;
      const end = value;
      const duration = 600;
      const startTime = performance.now();

      function tick(now: number) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(start + (end - start) * eased);
        setDisplay(current);
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    } else {
      // First mount: animate from 0
      hasAnimated.current = true;
      const duration = 800;
      const startTime = performance.now();
      function tick(now: number) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplay(Math.round(value * eased));
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }
  }, [value]);

  return (
    <span ref={ref}>
      {prefix}
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}

function ROICalculator() {
  const [volume, setVolume] = useState(50);
  const [costPerShipment, setCostPerShipment] = useState(25000);
  const [brokerFee, setBrokerFee] = useState(12);

  const currentBrokerCost = volume * costPerShipment * (brokerFee / 100);
  const tcFee = volume * costPerShipment * 0.03; // TruckConnect takes ~3%
  const monthlySavings = Math.round(currentBrokerCost - tcFee);
  const annualSavings = monthlySavings * 12;
  const costReduction = Math.round(((brokerFee - 3) / brokerFee) * 100);

  return (
    <section style={{ padding: "80px 0", backgroundColor: COLORS.white }}>
      <div style={container}>
        <h2 style={{ fontSize: 32, fontWeight: 700, color: COLORS.navy, textAlign: "center", margin: "0 0 16px" }}>
          How much could you save?
        </h2>
        <p style={{ fontSize: 18, color: COLORS.gray500, textAlign: "center", margin: "0 auto 48px", maxWidth: 560 }}>
          Use our ROI calculator to estimate your savings when you switch from traditional brokers to TruckConnect.
        </p>

        <div
          style={{
            maxWidth: 960,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 48,
            alignItems: "start",
          }}
          className="roi-grid"
        >
          {/* Inputs */}
          <div
            style={{
              backgroundColor: COLORS.gray50,
              borderRadius: 16,
              padding: 36,
              border: `1px solid ${COLORS.gray200}`,
            }}
          >
            {/* Volume slider */}
            <div style={{ marginBottom: 32 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <label style={{ fontSize: 14, fontWeight: 600, color: COLORS.gray700 }}>
                  Monthly Shipment Volume
                </label>
                <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.blue }}>{volume} shipments</span>
              </div>
              <input
                type="range"
                min={10}
                max={500}
                step={5}
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                style={{ width: "100%", accentColor: COLORS.blue, cursor: "pointer" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: COLORS.gray400, marginTop: 4 }}>
                <span>10</span>
                <span>500</span>
              </div>
            </div>

            {/* Cost per shipment slider */}
            <div style={{ marginBottom: 32 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <label style={{ fontSize: 14, fontWeight: 600, color: COLORS.gray700 }}>
                  Average Cost per Shipment
                </label>
                <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.blue }}>
                  {"\u20B1"}{costPerShipment.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min={5000}
                max={200000}
                step={1000}
                value={costPerShipment}
                onChange={(e) => setCostPerShipment(Number(e.target.value))}
                style={{ width: "100%", accentColor: COLORS.blue, cursor: "pointer" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: COLORS.gray400, marginTop: 4 }}>
                <span>{"\u20B1"}5,000</span>
                <span>{"\u20B1"}200,000</span>
              </div>
            </div>

            {/* Broker fee slider */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <label style={{ fontSize: 14, fontWeight: 600, color: COLORS.gray700 }}>
                  Current Broker Fee
                </label>
                <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.blue }}>{brokerFee}%</span>
              </div>
              <input
                type="range"
                min={5}
                max={20}
                step={1}
                value={brokerFee}
                onChange={(e) => setBrokerFee(Number(e.target.value))}
                style={{ width: "100%", accentColor: COLORS.blue, cursor: "pointer" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: COLORS.gray400, marginTop: 4 }}>
                <span>5%</span>
                <span>20%</span>
              </div>
            </div>
          </div>

          {/* Results */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div
              style={{
                padding: 28,
                borderRadius: 16,
                background: `linear-gradient(135deg, ${COLORS.navy} 0%, ${COLORS.navyDark} 100%)`,
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 13, color: COLORS.gray300, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 }}>
                Monthly Savings
              </div>
              <div style={{ fontSize: 40, fontWeight: 800, color: COLORS.white }}>
                <AnimatedNumber value={monthlySavings} prefix={"\u20B1"} />
              </div>
            </div>
            <div
              style={{
                padding: 28,
                borderRadius: 16,
                backgroundColor: "#dcfce7",
                border: "1px solid #bbf7d0",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 13, color: COLORS.green, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 }}>
                Annual Savings
              </div>
              <div style={{ fontSize: 40, fontWeight: 800, color: "#065f46" }}>
                <AnimatedNumber value={annualSavings} prefix={"\u20B1"} />
              </div>
            </div>
            <div
              style={{
                padding: 28,
                borderRadius: 16,
                backgroundColor: "#dbeafe",
                border: "1px solid #bfdbfe",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 13, color: COLORS.blue, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 }}>
                Cost Reduction
              </div>
              <div style={{ fontSize: 40, fontWeight: 800, color: "#1e40af" }}>
                <AnimatedNumber value={costReduction} suffix="%" />
              </div>
            </div>
            <p style={{ fontSize: 12, color: COLORS.gray400, textAlign: "center", margin: 0, lineHeight: 1.6 }}>
              * Estimates based on TruckConnect&apos;s average 3% platform fee vs. traditional broker fees. Actual savings may vary.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function PricingPage() {
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
              display: "inline-block",
              padding: "6px 16px",
              borderRadius: 999,
              backgroundColor: "#dcfce7",
              color: COLORS.green,
              fontSize: 13,
              fontWeight: 600,
              marginBottom: 24,
            }}
          >
            Free During Beta
          </div>
          <h1 style={{ fontSize: 44, fontWeight: 800, color: COLORS.white, margin: "0 0 16px", lineHeight: 1.15 }}>
            Simple, transparent pricing
          </h1>
          <p style={{ fontSize: 20, color: COLORS.gray300, margin: "0 auto", maxWidth: 560, lineHeight: 1.6 }}>
            Start free during beta. When we launch paid plans, choose the one that fits your business.
          </p>
        </div>
      </section>

      {/* Plan Cards */}
      <section style={{ padding: "80px 0", backgroundColor: COLORS.gray50 }}>
        <div style={container}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 24,
              maxWidth: 1000,
              margin: "0 auto",
            }}
          >
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                style={{
                  backgroundColor: COLORS.white,
                  borderRadius: 16,
                  padding: 40,
                  border: plan.highlight ? `2px solid ${COLORS.blue}` : `1px solid ${COLORS.gray200}`,
                  position: "relative",
                  boxShadow: plan.highlight ? "0 8px 30px rgba(37, 99, 235, 0.12)" : "0 2px 8px rgba(0,0,0,0.04)",
                }}
              >
                {plan.badge && (
                  <div
                    style={{
                      position: "absolute",
                      top: -12,
                      left: "50%",
                      transform: "translateX(-50%)",
                      padding: "4px 16px",
                      borderRadius: 999,
                      backgroundColor: COLORS.blue,
                      color: COLORS.white,
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    {plan.badge}
                  </div>
                )}
                <h3 style={{ fontSize: 20, fontWeight: 700, color: COLORS.navy, margin: "0 0 8px" }}>
                  {plan.name}
                </h3>
                <div style={{ marginBottom: 16 }}>
                  <span style={{ fontSize: 40, fontWeight: 800, color: COLORS.navy }}>{plan.price}</span>
                  <span style={{ fontSize: 16, color: COLORS.gray500 }}>{plan.period}</span>
                </div>
                <p style={{ fontSize: 14, color: COLORS.gray500, lineHeight: 1.6, margin: "0 0 32px", minHeight: 42 }}>
                  {plan.description}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 32 }}>
                  {plan.features.map((f) => (
                    <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: COLORS.gray700 }}>
                      <CheckCircle size={16} color={COLORS.green} />
                      {f}
                    </div>
                  ))}
                </div>
                <a
                  href={`${AUTH_URL}/sign-up`}
                  style={{
                    display: "block",
                    textAlign: "center",
                    padding: "12px 24px",
                    backgroundColor: plan.highlight ? COLORS.blue : "transparent",
                    color: plan.highlight ? COLORS.white : COLORS.blue,
                    border: plan.highlight ? "none" : `2px solid ${COLORS.blue}`,
                    borderRadius: 8,
                    fontSize: 15,
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  {plan.name === "Free" ? "Get Started Free" : `Start ${plan.name}`}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted By / Customer Logos */}
      <section style={{ padding: "60px 0", backgroundColor: COLORS.white }}>
        <div style={container}>
          <p style={{ fontSize: 14, fontWeight: 600, color: COLORS.gray400, textAlign: "center", textTransform: "uppercase", letterSpacing: 2, margin: "0 0 32px" }}>
            Trusted by logistics companies across the Philippines
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(6, 1fr)",
              gap: 20,
              maxWidth: 900,
              margin: "0 auto",
            }}
            className="logos-grid"
          >
            {TRUSTED_LOGOS.map((name) => (
              <div
                key={name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "20px 12px",
                  borderRadius: 10,
                  border: `1px solid ${COLORS.gray200}`,
                  backgroundColor: COLORS.gray50,
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.gray400, textAlign: "center", lineHeight: 1.3 }}>
                  {name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI Calculator */}
      <ROICalculator />

      {/* Feature Comparison Table */}
      <section style={{ padding: "80px 0", backgroundColor: COLORS.gray50 }}>
        <div style={container}>
          <h2 style={{ fontSize: 32, fontWeight: 700, color: COLORS.navy, textAlign: "center", margin: "0 0 16px" }}>
            Feature Comparison
          </h2>
          <p style={{ fontSize: 18, color: COLORS.gray500, textAlign: "center", margin: "0 auto 48px", maxWidth: 500 }}>
            See exactly what you get with each plan.
          </p>

          <div style={{ maxWidth: 800, margin: "0 auto", borderRadius: 12, overflow: "hidden", border: `1px solid ${COLORS.gray200}` }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ backgroundColor: COLORS.navy, color: COLORS.white }}>
                  <th style={{ padding: "14px 20px", textAlign: "left", fontWeight: 600 }}>Feature</th>
                  <th style={{ padding: "14px 20px", textAlign: "center", fontWeight: 600 }}>Free</th>
                  <th style={{ padding: "14px 20px", textAlign: "center", fontWeight: 600 }}>Starter</th>
                  <th style={{ padding: "14px 20px", textAlign: "center", fontWeight: 600 }}>Business</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_FEATURES.map((row, i) => (
                  <tr key={row.feature} style={{ backgroundColor: i % 2 === 0 ? COLORS.white : COLORS.gray50, borderBottom: `1px solid ${COLORS.gray200}` }}>
                    <td style={{ padding: "12px 20px", fontWeight: 500, color: COLORS.gray700 }}>{row.feature}</td>
                    {[row.free, row.starter, row.business].map((val, ci) => (
                      <td key={ci} style={{ padding: "12px 20px", textAlign: "center" }}>
                        {typeof val === "boolean" ? (
                          val ? <CheckCircle size={16} color={COLORS.green} /> : <XIcon size={16} color={COLORS.gray300} />
                        ) : (
                          <span style={{ color: COLORS.gray600, fontWeight: 500 }}>{val}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: "80px 0", backgroundColor: COLORS.white }}>
        <div style={container}>
          <h2 style={{ fontSize: 32, fontWeight: 700, color: COLORS.navy, textAlign: "center", margin: "0 0 16px" }}>
            Frequently Asked Questions
          </h2>
          <p style={{ fontSize: 18, color: COLORS.gray500, textAlign: "center", margin: "0 auto 48px", maxWidth: 500 }}>
            Everything you need to know about our pricing.
          </p>

          <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", flexDirection: "column", gap: 12 }}>
            {FAQS.map((faq) => (
              <FaqItem key={faq.q} question={faq.q} answer={faq.a} />
            ))}
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
            Start free today
          </h2>
          <p style={{ fontSize: 18, color: COLORS.gray300, margin: "0 0 32px" }}>
            No credit card required. All features available during beta.
          </p>
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
        </div>
      </section>

      <Footer />

      <style>{`
        @media (max-width: 768px) {
          .roi-grid {
            grid-template-columns: 1fr !important;
          }
          .logos-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (max-width: 480px) {
          .logos-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        borderRadius: 12,
        border: "1px solid #e2e8f0",
        overflow: "hidden",
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          padding: "20px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: 16,
          fontWeight: 600,
          color: "#1B2D5E",
          textAlign: "left",
        }}
      >
        {question}
        {open ? <ChevronUp size={20} color="#94a3b8" /> : <ChevronDown size={20} color="#94a3b8" />}
      </button>
      {open && (
        <div style={{ padding: "0 24px 20px", fontSize: 15, color: "#64748b", lineHeight: 1.7 }}>
          {answer}
        </div>
      )}
    </div>
  );
}
