"use client";

import {
  Search,
  Users,
  MessageSquare,
  MapPin,
  Star,
  ArrowRight,
  Package,
  Truck,
  CheckCircle,
  Clock,
  DollarSign,
  Shield,
  TrendingUp,
} from "lucide-react";
import Navbar from "@/components/Navbar";

const steps = [
  {
    number: 1,
    title: "Browse the Load Board",
    description:
      "Explore hundreds of available freight loads across the Philippines. Filter by route, cargo type, vehicle requirements, and rate. Find the perfect load that matches your capacity or shipping needs.",
    icon: Search,
    color: "#2563eb",
    bgColor: "#eff6ff",
    preview: (
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {[
          { from: "Manila", to: "Cebu City", cargo: "FMCG / Consumer Goods", rate: "85,000", status: "Bidding", statusColor: "#2563eb", statusBg: "#dbeafe" },
          { from: "Cebu City", to: "Davao City", cargo: "Agricultural Products", rate: "52,000", status: "Open", statusColor: "#166534", statusBg: "#dcfce7" },
          { from: "Clark", to: "Manila", cargo: "Electronics", rate: "18,000", status: "Awarded", statusColor: "#92400e", statusBg: "#fef3c7" },
        ].map((load, i) => (
          <div
            key={i}
            style={{
              backgroundColor: "#ffffff",
              borderRadius: 10,
              border: "1px solid #e2e8f0",
              padding: "12px 16px",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                backgroundColor: "#eff6ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Package size={16} color="#2563eb" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{load.from}</span>
                <ArrowRight size={12} color="#94a3b8" />
                <span style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{load.to}</span>
                <span style={{ fontSize: 10, fontWeight: 600, color: load.statusColor, backgroundColor: load.statusBg, padding: "1px 6px", borderRadius: 9999 }}>{load.status}</span>
              </div>
              <div style={{ fontSize: 11, color: "#94a3b8" }}>{load.cargo}</div>
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", flexShrink: 0 }}>&#8369;{load.rate}</div>
          </div>
        ))}
      </div>
    ),
  },
  {
    number: 2,
    title: "Compare Carriers",
    description:
      "Evaluate carriers side by side. Compare ratings, fleet sizes, on-time delivery rates, specializations, and pricing. Read reviews from other shippers to make informed decisions.",
    icon: Users,
    color: "#16a34a",
    bgColor: "#f0fdf4",
    preview: (
      <div style={{ display: "flex", gap: 12 }}>
        {[
          { name: "JMD Trucking", rating: 4.8, trips: 1240, onTime: "96%", fleet: 45, verified: true },
          { name: "LBC Cargo Movers", rating: 4.9, trips: 2100, onTime: "98%", fleet: 60, verified: true },
        ].map((carrier, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              backgroundColor: "#ffffff",
              borderRadius: 10,
              border: i === 1 ? "2px solid #16a34a" : "1px solid #e2e8f0",
              padding: 14,
              position: "relative",
            }}
          >
            {i === 1 && (
              <div style={{ position: "absolute", top: -10, right: 12, fontSize: 10, fontWeight: 700, color: "#ffffff", backgroundColor: "#16a34a", padding: "2px 8px", borderRadius: 9999 }}>
                Best Match
              </div>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
              <Truck size={14} color="#16a34a" />
              <span style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{carrier.name}</span>
              {carrier.verified && <CheckCircle size={12} color="#16a34a" fill="#dcfce7" />}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 6 }}>
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={12} color="#f59e0b" fill={s <= Math.floor(carrier.rating) ? "#f59e0b" : "none"} />
              ))}
              <span style={{ fontSize: 11, color: "#64748b", marginLeft: 4 }}>{carrier.rating}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {[
                { label: "Fleet", value: `${carrier.fleet} trucks` },
                { label: "Trips", value: carrier.trips.toLocaleString() },
                { label: "On-time", value: carrier.onTime },
              ].map((stat) => (
                <div key={stat.label} style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
                  <span style={{ color: "#94a3b8" }}>{stat.label}</span>
                  <span style={{ color: "#0f172a", fontWeight: 500 }}>{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    number: 3,
    title: "Get Quotes",
    description:
      "Submit bids or request instant quotes. Choose from open auctions, sealed bids, direct awards, or instant booking. Negotiate rates and terms directly with carriers or shippers.",
    icon: MessageSquare,
    color: "#f59e0b",
    bgColor: "#fffbeb",
    preview: (
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: 10,
          border: "1px solid #e2e8f0",
          padding: 16,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>Manila to Cebu City</span>
          <span style={{ fontSize: 10, fontWeight: 600, color: "#2563eb", backgroundColor: "#dbeafe", padding: "2px 8px", borderRadius: 9999 }}>Open Auction</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
          {[
            { bidder: "JMD Trucking", amount: "82,000", time: "2h ago", best: true },
            { bidder: "LBC Cargo", amount: "84,500", time: "1h ago", best: false },
            { bidder: "Batangas Port", amount: "86,000", time: "30m ago", best: false },
          ].map((bid, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 12px",
                borderRadius: 8,
                backgroundColor: bid.best ? "#f0fdf4" : "#f8fafc",
                border: bid.best ? "1px solid #bbf7d0" : "1px solid #f1f5f9",
              }}
            >
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#0f172a" }}>
                  {bid.bidder}
                  {bid.best && <span style={{ marginLeft: 6, fontSize: 10, color: "#16a34a", fontWeight: 700 }}>LOWEST</span>}
                </div>
                <div style={{ fontSize: 10, color: "#94a3b8" }}>{bid.time}</div>
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: bid.best ? "#16a34a" : "#0f172a" }}>&#8369;{bid.amount}</div>
            </div>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            gap: 8,
          }}
        >
          <div style={{ flex: 1, padding: "8px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 13, color: "#94a3b8", textAlign: "center" }}>Your bid: &#8369;___</div>
          <div style={{ padding: "8px 16px", borderRadius: 8, backgroundColor: "#f59e0b", color: "#ffffff", fontSize: 13, fontWeight: 600, textAlign: "center" }}>Place Bid</div>
        </div>
      </div>
    ),
  },
  {
    number: 4,
    title: "Track Your Shipment",
    description:
      "Monitor your cargo in real-time with GPS tracking. Get live updates on pickup, in-transit, and delivery milestones. Receive notifications for every status change along the way.",
    icon: MapPin,
    color: "#7c3aed",
    bgColor: "#faf5ff",
    preview: (
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: 10,
          border: "1px solid #e2e8f0",
          padding: 16,
        }}
      >
        {/* Route visualization */}
        <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 16 }}>
          {[
            { label: "Picked Up", done: true },
            { label: "In Transit", done: true, active: true },
            { label: "At Port", done: false },
            { label: "Delivered", done: false },
          ].map((step, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  backgroundColor: step.done ? "#7c3aed" : "#e2e8f0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1,
                  border: step.active ? "3px solid #c4b5fd" : "none",
                }}
              >
                {step.done && <CheckCircle size={12} color="#ffffff" />}
              </div>
              {i < 3 && (
                <div
                  style={{
                    position: "absolute",
                    top: 11,
                    left: "50%",
                    width: "100%",
                    height: 3,
                    backgroundColor: step.done ? "#7c3aed" : "#e2e8f0",
                    zIndex: 0,
                  }}
                />
              )}
              <span style={{ fontSize: 10, color: step.done ? "#7c3aed" : "#94a3b8", fontWeight: step.active ? 700 : 400, marginTop: 6, textAlign: "center" }}>{step.label}</span>
            </div>
          ))}
        </div>
        {/* Info row */}
        <div style={{ display: "flex", gap: 12 }}>
          {[
            { icon: Clock, label: "ETA", value: "Mar 21, 14:00" },
            { icon: Truck, label: "Driver", value: "Ricardo S." },
            { icon: MapPin, label: "Location", value: "Batangas Port" },
          ].map((info) => {
            const Icon = info.icon;
            return (
              <div key={info.label} style={{ flex: 1, backgroundColor: "#faf5ff", borderRadius: 8, padding: "8px 10px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 2 }}>
                  <Icon size={11} color="#7c3aed" />
                  <span style={{ fontSize: 10, color: "#94a3b8" }}>{info.label}</span>
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#0f172a" }}>{info.value}</div>
              </div>
            );
          })}
        </div>
      </div>
    ),
  },
  {
    number: 5,
    title: "Rate & Review",
    description:
      "After delivery, rate your experience and leave a review. Help the community by sharing feedback on carriers, timeliness, cargo handling, and communication. Build trust across the marketplace.",
    icon: Star,
    color: "#ef4444",
    bgColor: "#fef2f2",
    preview: (
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: 10,
          border: "1px solid #e2e8f0",
          padding: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <Truck size={14} color="#16a34a" />
          <span style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>JMD Trucking Services</span>
          <CheckCircle size={12} color="#16a34a" fill="#dcfce7" />
        </div>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 6 }}>Overall Rating</div>
          <div style={{ display: "flex", gap: 4 }}>
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} size={24} color="#f59e0b" fill={s <= 4 ? "#f59e0b" : "none"} style={{ cursor: "pointer" }} />
            ))}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
          {[
            { label: "On-time Delivery", value: 5 },
            { label: "Cargo Handling", value: 4 },
            { label: "Communication", value: 5 },
          ].map((cat) => (
            <div key={cat.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 12, color: "#64748b" }}>{cat.label}</span>
              <div style={{ display: "flex", gap: 2 }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={12} color="#f59e0b" fill={s <= cat.value ? "#f59e0b" : "none"} />
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12, color: "#94a3b8" }}>
          Write your review...
        </div>
      </div>
    ),
  },
];

export default function HowItWorksPage() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f1f5f9" }}>
      <Navbar />

      {/* Hero */}
      <div
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          padding: "64px 24px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: 36,
            fontWeight: 800,
            color: "#ffffff",
            marginBottom: 12,
          }}
        >
          How It Works
        </h1>
        <p
          style={{
            fontSize: 16,
            color: "#94a3b8",
            maxWidth: 560,
            margin: "0 auto",
            lineHeight: 1.6,
          }}
        >
          TruckConnect makes freight logistics simple. From finding loads to
          tracking deliveries, here is how our marketplace works in 5 easy
          steps.
        </p>
      </div>

      {/* Steps */}
      <div
        style={{
          maxWidth: 960,
          margin: "0 auto",
          padding: "48px 24px 64px",
        }}
      >
        {steps.map((step, i) => {
          const Icon = step.icon;
          const isEven = i % 2 === 1;
          return (
            <div
              key={step.number}
              style={{
                display: "flex",
                gap: 40,
                marginBottom: 56,
                flexDirection: isEven ? "row-reverse" : "row",
                alignItems: "flex-start",
              }}
              className="hiw-step"
            >
              {/* Content */}
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 16,
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      backgroundColor: step.bgColor,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon size={22} color={step.color} />
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: step.color,
                        textTransform: "uppercase",
                        letterSpacing: 1,
                      }}
                    >
                      Step {step.number}
                    </div>
                    <h2
                      style={{
                        fontSize: 22,
                        fontWeight: 700,
                        color: "#0f172a",
                        margin: 0,
                      }}
                    >
                      {step.title}
                    </h2>
                  </div>
                </div>
                <p
                  style={{
                    fontSize: 15,
                    color: "#64748b",
                    lineHeight: 1.7,
                    marginBottom: 0,
                  }}
                >
                  {step.description}
                </p>
              </div>
              {/* Preview */}
              <div
                style={{
                  flex: 1,
                  backgroundColor: "#f8fafc",
                  borderRadius: 14,
                  border: "1px solid #e2e8f0",
                  padding: 16,
                }}
              >
                {step.preview}
              </div>
            </div>
          );
        })}

        {/* Value props */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 20,
            marginBottom: 48,
          }}
          className="hiw-values"
        >
          {[
            { icon: Shield, title: "Verified Carriers", desc: "All carriers are LTFRB-registered with insurance coverage." },
            { icon: TrendingUp, title: "Competitive Rates", desc: "Transparent bidding drives fair market pricing." },
            { icon: DollarSign, title: "Flexible Payments", desc: "COD, 7-day, 14-day, or 30-day payment terms." },
          ].map((v) => {
            const VIcon = v.icon;
            return (
              <div
                key={v.title}
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: 12,
                  border: "1px solid #e2e8f0",
                  padding: "24px 20px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    backgroundColor: "#eff6ff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 12px",
                  }}
                >
                  <VIcon size={20} color="#2563eb" />
                </div>
                <h3
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: "#0f172a",
                    marginBottom: 6,
                  }}
                >
                  {v.title}
                </h3>
                <p style={{ fontSize: 13, color: "#64748b", margin: 0, lineHeight: 1.5 }}>
                  {v.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div
          style={{
            textAlign: "center",
            padding: "48px 24px",
            backgroundColor: "#ffffff",
            borderRadius: 16,
            border: "1px solid #e2e8f0",
          }}
        >
          <h2
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: "#0f172a",
              marginBottom: 10,
            }}
          >
            Ready to get started?
          </h2>
          <p
            style={{
              fontSize: 15,
              color: "#64748b",
              marginBottom: 24,
              maxWidth: 420,
              margin: "0 auto 24px",
            }}
          >
            Browse available loads and find the best carriers for your freight
            needs today.
          </p>
          <a
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 32px",
              borderRadius: 10,
              backgroundColor: "#2563eb",
              color: "#ffffff",
              fontSize: 15,
              fontWeight: 600,
              textDecoration: "none",
              boxShadow: "0 4px 14px rgba(37,99,235,0.3)",
            }}
          >
            Start Browsing
            <ArrowRight size={16} />
          </a>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hiw-step { flex-direction: column !important; }
          .hiw-values { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
