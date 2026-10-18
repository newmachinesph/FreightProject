"use client";

import { use, useState } from "react";
import {
  Building2, Star, CheckCircle, ArrowLeft, MapPin, Truck, Package,
  Warehouse as WarehouseIcon, Share2, Mail, Phone, Globe, Award,
  Users, Calendar, BarChart3, Shield, Briefcase, Copy, ExternalLink,
  Snowflake, DoorOpen, Clock, Ruler, ChevronRight,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { companies, carriers, warehouses, type Company } from "@/lib/mock-data";

const typeBadgeStyles: Record<string, { color: string; bg: string; border: string; icon: typeof Truck }> = {
  carrier: { color: "#059669", bg: "#ECFDF5", border: "#059669", icon: Truck },
  shipper: { color: "#D97706", bg: "#FFFBEB", border: "#D97706", icon: Package },
  warehouse: { color: "#7C3AED", bg: "#F5F3FF", border: "#7C3AED", icon: WarehouseIcon },
};

function StarRating({ rating, size = 14, showValue = true }: { rating: number; size?: number; showValue?: boolean }) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.3 && rating - full < 0.8;
  const stars = [];
  for (let i = 0; i < 5; i++) {
    if (i < full) {
      stars.push(<Star key={i} size={size} fill="#F59E0B" color="#F59E0B" />);
    } else if (i === full && hasHalf) {
      stars.push(
        <span key={i} style={{ position: "relative", display: "inline-block", width: size, height: size }}>
          <Star size={size} fill="none" color="#E5E7EB" style={{ position: "absolute", top: 0, left: 0 }} />
          <span style={{ position: "absolute", top: 0, left: 0, width: "50%", overflow: "hidden" }}>
            <Star size={size} fill="#F59E0B" color="#F59E0B" />
          </span>
        </span>
      );
    } else {
      stars.push(<Star key={i} size={size} fill="none" color="#E5E7EB" />);
    }
  }
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 2 }}>
      {stars}
      {showValue && <span style={{ marginLeft: 4, fontSize: size - 2, fontWeight: 600, color: "#374151" }}>{rating.toFixed(1)}</span>}
    </span>
  );
}

const statusColors: Record<string, { bg: string; color: string; label: string }> = {
  available: { bg: "#ECFDF5", color: "#059669", label: "Available" },
  on_trip: { bg: "#EFF6FF", color: "#2563EB", label: "On Trip" },
  maintenance: { bg: "#FFFBEB", color: "#D97706", label: "Maintenance" },
  inactive: { bg: "#F3F4F6", color: "#6B7280", label: "Inactive" },
};

export default function CompanyProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const company = companies.find((c) => c.slug === slug);
  const [activeTab, setActiveTab] = useState<string>("");
  const [copied, setCopied] = useState(false);

  if (!company) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
        <Navbar active="Companies" />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "calc(100vh - 56px)" }}>
          <div style={{ textAlign: "center" }}>
            <Building2 size={48} color="#9CA3AF" />
            <h1 style={{ fontSize: 24, fontWeight: 700, color: "#111827", marginTop: 16 }}>Company not found</h1>
            <p style={{ color: "#6B7280", marginBottom: 24 }}>The company &quot;{slug}&quot; does not exist.</p>
            <a href="/company" style={{ color: "#2563EB", textDecoration: "none", fontWeight: 500 }}>Back to Company Directory</a>
          </div>
        </div>
      </div>
    );
  }

  // Linked data
  const linkedCarrier = company.carrierId ? carriers.find((c) => c.id === company.carrierId) : null;
  const linkedWarehouses = company.warehouseIds ? warehouses.filter((w) => company.warehouseIds!.includes(w.id)) : [];

  // Collect all reviews
  const allReviews = [
    ...(linkedCarrier?.reviews.map((r) => ({ ...r, source: "Carrier" })) || []),
    // Warehouse reviews are mock from the detail pages, so we'll generate some
    ...linkedWarehouses.flatMap((wh) => [
      { author: "Logistics Client", rating: 5, text: `Excellent warehouse facility at ${wh.name}. Well-maintained and professional staff.`, date: "2026-02-15", source: "Warehouse" },
      { author: "Supply Chain Manager", rating: 4, text: `Great location and reliable operations at ${wh.location.city}. Would recommend for storage needs.`, date: "2026-01-20", source: "Warehouse" },
    ]),
  ];

  // Build tabs
  const tabs: { key: string; label: string }[] = [];
  if (company.types.includes("carrier")) tabs.push({ key: "fleet", label: "Fleet" });
  if (company.types.includes("warehouse")) tabs.push({ key: "facilities", label: "Facilities" });
  if (company.types.includes("shipper")) tabs.push({ key: "shipping", label: "Shipping Activity" });
  tabs.push({ key: "reviews", label: `Reviews (${allReviews.length})` });
  tabs.push({ key: "contact", label: "Contact" });

  const currentTab = activeTab || tabs[0]?.key || "reviews";

  const yearsInBusiness = new Date().getFullYear() - parseInt(company.founded);
  const initials = company.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  const handleShare = () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Fleet stats for carrier tab
  const fleetStats = linkedCarrier ? (() => {
    const stats = { available: 0, on_trip: 0, maintenance: 0, inactive: 0, total: linkedCarrier.fleet.length };
    linkedCarrier.fleet.forEach((v) => {
      if (v.status === "available") stats.available++;
      else if (v.status === "on_trip") stats.on_trip++;
      else if (v.status === "maintenance") stats.maintenance++;
      else stats.inactive++;
    });
    return stats;
  })() : null;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      <Navbar active="Companies" />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 24px 64px" }}>
        <a href="/company" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#6B7280", fontSize: 13, textDecoration: "none", marginBottom: 16 }}>
          <ArrowLeft size={14} /> Back to Company Directory
        </a>

        {/* ── Header Card ── */}
        <div style={{
          backgroundColor: "#ffffff", borderRadius: 14, border: "1px solid #e2e8f0",
          padding: 28, marginBottom: 20, position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "linear-gradient(90deg, #2563eb, #059669, #D97706)" }} />

          <div style={{ display: "flex", alignItems: "flex-start", gap: 20 }}>
            {/* Logo / Initials */}
            <div style={{
              width: 80, height: 80, borderRadius: 20,
              background: "linear-gradient(135deg, #1e293b, #334155)",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <span style={{ fontSize: 28, fontWeight: 800, color: "#94a3b8" }}>{initials}</span>
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <h1 style={{ fontSize: 28, fontWeight: 800, color: "#0f172a", margin: 0 }}>{company.name}</h1>
                {company.verified && (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 10px", borderRadius: 9999, fontSize: 11, fontWeight: 600, color: "#2563EB", backgroundColor: "#EFF6FF" }}>
                    <CheckCircle size={12} /> Verified
                  </span>
                )}
              </div>

              {/* Type badges */}
              <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                {company.types.map((type) => {
                  const style = typeBadgeStyles[type];
                  const Icon = style.icon;
                  return (
                    <span key={type} style={{
                      display: "inline-flex", alignItems: "center", gap: 4,
                      padding: "4px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                      color: style.color, backgroundColor: style.bg, border: `1px solid ${style.border}22`,
                    }}>
                      <Icon size={12} /> {type.charAt(0).toUpperCase() + type.slice(1)}
                    </span>
                  );
                })}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 16, color: "#6B7280", fontSize: 13, marginBottom: 8 }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                  <MapPin size={14} /> {company.headquarters.city}, {company.headquarters.province}
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                  <Calendar size={14} /> Founded {company.founded}
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                  <Users size={14} /> Member since {company.memberSince}
                </span>
              </div>

              <StarRating rating={company.rating} size={18} />
            </div>

            {/* Action buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 }}>
              <button
                onClick={handleShare}
                style={{
                  display: "flex", alignItems: "center", gap: 6, padding: "8px 16px",
                  borderRadius: 8, border: "1px solid #e2e8f0", backgroundColor: "#ffffff",
                  fontSize: 13, fontWeight: 600, color: "#374151", cursor: "pointer",
                }}
              >
                {copied ? <><Copy size={14} /> Copied!</> : <><Share2 size={14} /> Share Profile</>}
              </button>
              <button
                onClick={() => setActiveTab("contact")}
                style={{
                  display: "flex", alignItems: "center", gap: 6, padding: "8px 16px",
                  borderRadius: 8, border: "none", backgroundColor: "#2563EB",
                  fontSize: 13, fontWeight: 600, color: "#ffffff", cursor: "pointer",
                }}
              >
                <Mail size={14} /> Contact Company
              </button>
            </div>
          </div>
        </div>

        {/* ── About Section ── */}
        <div style={{
          backgroundColor: "#ffffff", borderRadius: 12, border: "1px solid #e2e8f0",
          padding: 24, marginBottom: 20,
        }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", margin: "0 0 12px" }}>About</h2>
          <p style={{ fontSize: 14, color: "#4B5563", lineHeight: 1.7, margin: "0 0 20px" }}>{company.description}</p>

          {/* Key Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
            {[
              { label: "Transactions", value: company.totalTransactions.toLocaleString(), icon: BarChart3, color: "#2563EB", bg: "#EFF6FF" },
              { label: "Employees", value: company.employeeCount, icon: Users, color: "#059669", bg: "#ECFDF5" },
              { label: "Years in Business", value: yearsInBusiness.toString(), icon: Calendar, color: "#D97706", bg: "#FFFBEB" },
              { label: "Rating", value: company.rating.toFixed(1), icon: Star, color: "#9D174D", bg: "#FDF2F8" },
            ].map((stat) => (
              <div key={stat.label} style={{
                backgroundColor: stat.bg, borderRadius: 10, padding: 16, textAlign: "center",
              }}>
                <stat.icon size={20} color={stat.color} style={{ marginBottom: 6 }} />
                <div style={{ fontSize: 20, fontWeight: 800, color: stat.color }}>{stat.value}</div>
                <div style={{ fontSize: 11, color: "#6B7280", marginTop: 2 }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Certifications */}
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 13, fontWeight: 600, color: "#6B7280", margin: "0 0 8px", textTransform: "uppercase", letterSpacing: 0.5 }}>Certifications</h3>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {company.certifications.map((cert) => (
                <span key={cert} style={{
                  display: "inline-flex", alignItems: "center", gap: 4,
                  padding: "4px 12px", borderRadius: 6, fontSize: 12, fontWeight: 500,
                  color: "#374151", backgroundColor: "#F3F4F6", border: "1px solid #E5E7EB",
                }}>
                  <Award size={12} color="#6B7280" /> {cert}
                </span>
              ))}
            </div>
          </div>

          {/* Social Proof */}
          <div>
            <h3 style={{ fontSize: 13, fontWeight: 600, color: "#6B7280", margin: "0 0 8px", textTransform: "uppercase", letterSpacing: 0.5 }}>Key Metrics</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
              {company.socialProof.map((sp) => (
                <div key={sp.metric} style={{
                  padding: "10px 14px", borderRadius: 8, border: "1px solid #E5E7EB",
                }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "#0f172a" }}>{sp.value}</div>
                  <div style={{ fontSize: 11, color: "#6B7280" }}>{sp.metric}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div style={{ display: "flex", gap: 0, borderBottom: "2px solid #E5E7EB", marginBottom: 20 }}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: "10px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer",
                border: "none", backgroundColor: "transparent",
                color: currentTab === tab.key ? "#2563EB" : "#6B7280",
                borderBottom: currentTab === tab.key ? "2px solid #2563EB" : "2px solid transparent",
                marginBottom: -2,
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Fleet Tab ── */}
        {currentTab === "fleet" && linkedCarrier && fleetStats && (
          <div>
            {/* Fleet Summary */}
            <div style={{
              backgroundColor: "#ffffff", borderRadius: 12, border: "1px solid #e2e8f0",
              padding: 24, marginBottom: 16,
            }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", margin: "0 0 16px" }}>Fleet Overview</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
                {[
                  { label: "Total", value: fleetStats.total, color: "#374151", bg: "#F3F4F6" },
                  { label: "Available", value: fleetStats.available, color: "#059669", bg: "#ECFDF5" },
                  { label: "On Trip", value: fleetStats.on_trip, color: "#2563EB", bg: "#EFF6FF" },
                  { label: "Maintenance", value: fleetStats.maintenance, color: "#D97706", bg: "#FFFBEB" },
                  { label: "Inactive", value: fleetStats.inactive, color: "#6B7280", bg: "#F3F4F6" },
                ].map((s) => (
                  <div key={s.label} style={{
                    backgroundColor: s.bg, borderRadius: 8, padding: 14, textAlign: "center",
                  }}>
                    <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</div>
                    <div style={{ fontSize: 11, color: "#6B7280" }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Vehicle Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
              {linkedCarrier.fleet.map((v) => {
                const st = statusColors[v.status];
                return (
                  <div key={v.id} style={{
                    backgroundColor: "#ffffff", borderRadius: 10, border: "1px solid #e2e8f0",
                    padding: 16, display: "flex", alignItems: "center", gap: 14,
                  }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: 10,
                      backgroundColor: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <Truck size={22} color="#64748b" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>{v.type}</div>
                      <div style={{ fontSize: 12, color: "#6B7280" }}>{v.make} &middot; {v.plateNo}</div>
                      <div style={{ fontSize: 11, color: "#9CA3AF" }}>
                        {v.capacity.kg.toLocaleString()} kg / {v.capacity.cbm} cbm
                        {v.reefer && <span style={{ color: "#2563EB", marginLeft: 6 }}>Reefer</span>}
                      </div>
                    </div>
                    <span style={{
                      padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600,
                      color: st.color, backgroundColor: st.bg,
                    }}>
                      {st.label}
                    </span>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: 16, textAlign: "center" }}>
              <a href={`/carriers/${linkedCarrier.id}`} style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                color: "#2563EB", fontSize: 13, fontWeight: 600, textDecoration: "none",
              }}>
                View full carrier details <ChevronRight size={14} />
              </a>
            </div>
          </div>
        )}

        {/* ── Facilities Tab ── */}
        {currentTab === "facilities" && linkedWarehouses.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {linkedWarehouses.map((wh) => {
              const utilization = Math.round(((wh.totalArea - wh.availableArea) / wh.totalArea) * 100);
              return (
                <div key={wh.id} style={{
                  backgroundColor: "#ffffff", borderRadius: 12, border: "1px solid #e2e8f0",
                  padding: 24,
                }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", margin: "0 0 4px" }}>{wh.name}</h3>
                  <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 16, display: "flex", alignItems: "center", gap: 4 }}>
                    <MapPin size={14} /> {wh.location.city}, {wh.location.province}
                  </div>

                  {/* Stats */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 16 }}>
                    {[
                      { label: "Total Area", value: `${wh.totalArea.toLocaleString()} sqm`, color: "#7C3AED", bg: "#F5F3FF" },
                      { label: "Available", value: `${wh.availableArea.toLocaleString()} sqm`, color: "#059669", bg: "#ECFDF5" },
                      { label: "Utilization", value: `${utilization}%`, color: "#D97706", bg: "#FFFBEB" },
                      { label: "Loading Docks", value: wh.loadingDocks.toString(), color: "#2563EB", bg: "#EFF6FF" },
                    ].map((s) => (
                      <div key={s.label} style={{ backgroundColor: s.bg, borderRadius: 8, padding: 12, textAlign: "center" }}>
                        <div style={{ fontSize: 18, fontWeight: 700, color: s.color }}>{s.value}</div>
                        <div style={{ fontSize: 11, color: "#6B7280" }}>{s.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Zones */}
                  <h4 style={{ fontSize: 13, fontWeight: 600, color: "#6B7280", margin: "0 0 8px", textTransform: "uppercase", letterSpacing: 0.5 }}>Zones</h4>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 16 }}>
                    {wh.zones.map((zone) => (
                      <div key={zone.name} style={{
                        padding: 12, borderRadius: 8, border: "1px solid #E5E7EB",
                      }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a", marginBottom: 4 }}>{zone.name}</div>
                        <div style={{ fontSize: 12, color: "#6B7280" }}>{zone.area.toLocaleString()} sqm &middot; {zone.temp}</div>
                        <div style={{ fontSize: 11, color: "#9CA3AF" }}>{zone.shelves} shelves</div>
                      </div>
                    ))}
                  </div>

                  {/* Certifications */}
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
                    {wh.certifications.map((cert) => (
                      <span key={cert} style={{
                        padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600,
                        color: "#374151", backgroundColor: "#F3F4F6",
                      }}>
                        {cert}
                      </span>
                    ))}
                  </div>

                  <a href={`/warehouses/${wh.id}`} style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    color: "#2563EB", fontSize: 13, fontWeight: 600, textDecoration: "none",
                  }}>
                    View full warehouse details <ChevronRight size={14} />
                  </a>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Shipping Activity Tab ── */}
        {currentTab === "shipping" && (
          <div style={{
            backgroundColor: "#ffffff", borderRadius: 12, border: "1px solid #e2e8f0",
            padding: 24,
          }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", margin: "0 0 16px" }}>Shipping Activity</h3>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 }}>
              {[
                { label: "Monthly Volume", value: "350+ loads", color: "#2563EB", bg: "#EFF6FF" },
                { label: "Avg. Load Value", value: "\u20B155,000", color: "#059669", bg: "#ECFDF5" },
                { label: "Active Routes", value: "12", color: "#D97706", bg: "#FFFBEB" },
              ].map((s) => (
                <div key={s.label} style={{ backgroundColor: s.bg, borderRadius: 8, padding: 16, textAlign: "center" }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>

            <h4 style={{ fontSize: 13, fontWeight: 600, color: "#6B7280", margin: "0 0 8px", textTransform: "uppercase", letterSpacing: 0.5 }}>Top Routes</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
              {[
                { route: "Manila - Cebu", volume: "85 loads/mo", share: 24 },
                { route: "Manila - Clark", volume: "62 loads/mo", share: 18 },
                { route: "Manila - Davao", volume: "48 loads/mo", share: 14 },
                { route: "Cebu - Iloilo", volume: "35 loads/mo", share: 10 },
                { route: "Batangas - Manila", volume: "30 loads/mo", share: 9 },
              ].map((r) => (
                <div key={r.route} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 160, fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{r.route}</div>
                  <div style={{ flex: 1, height: 8, backgroundColor: "#F3F4F6", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ width: `${r.share * 3}%`, height: "100%", backgroundColor: "#2563EB", borderRadius: 4 }} />
                  </div>
                  <div style={{ width: 100, fontSize: 12, color: "#6B7280", textAlign: "right" }}>{r.volume}</div>
                </div>
              ))}
            </div>

            <h4 style={{ fontSize: 13, fontWeight: 600, color: "#6B7280", margin: "0 0 8px", textTransform: "uppercase", letterSpacing: 0.5 }}>Cargo Types</h4>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["FMCG / Consumer Goods", "Electronics", "Agricultural Products", "Pharmaceuticals", "Construction Materials", "Beverages"].map((ct) => (
                <span key={ct} style={{
                  padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 500,
                  color: "#374151", backgroundColor: "#F3F4F6", border: "1px solid #E5E7EB",
                }}>
                  {ct}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ── Reviews Tab ── */}
        {currentTab === "reviews" && (
          <div>
            {/* Rating Summary */}
            <div style={{
              backgroundColor: "#ffffff", borderRadius: 12, border: "1px solid #e2e8f0",
              padding: 24, marginBottom: 16,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 48, fontWeight: 800, color: "#0f172a" }}>{company.rating.toFixed(1)}</div>
                  <StarRating rating={company.rating} size={20} showValue={false} />
                  <div style={{ fontSize: 12, color: "#6B7280", marginTop: 4 }}>{allReviews.length} reviews</div>
                </div>
                <div style={{ flex: 1 }}>
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = allReviews.filter((r) => r.rating === star).length;
                    const pct = allReviews.length > 0 ? (count / allReviews.length) * 100 : 0;
                    return (
                      <div key={star} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 12, color: "#6B7280", width: 20 }}>{star}</span>
                        <Star size={12} fill="#F59E0B" color="#F59E0B" />
                        <div style={{ flex: 1, height: 6, backgroundColor: "#F3F4F6", borderRadius: 3, overflow: "hidden" }}>
                          <div style={{ width: `${pct}%`, height: "100%", backgroundColor: "#F59E0B", borderRadius: 3 }} />
                        </div>
                        <span style={{ fontSize: 12, color: "#9CA3AF", width: 24 }}>{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Individual Reviews */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {allReviews.map((review, i) => (
                <div key={i} style={{
                  backgroundColor: "#ffffff", borderRadius: 10, border: "1px solid #e2e8f0",
                  padding: 20,
                }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: 18, backgroundColor: "#EFF6FF",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 13, fontWeight: 700, color: "#2563EB",
                      }}>
                        {review.author.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>{review.author}</div>
                        <div style={{ fontSize: 11, color: "#9CA3AF" }}>{review.date} &middot; {review.source}</div>
                      </div>
                    </div>
                    <StarRating rating={review.rating} size={14} showValue={false} />
                  </div>
                  <p style={{ fontSize: 13, color: "#4B5563", lineHeight: 1.6, margin: 0 }}>{review.text}</p>
                </div>
              ))}
            </div>

            {allReviews.length === 0 && (
              <div style={{
                backgroundColor: "#ffffff", borderRadius: 10, border: "1px solid #e2e8f0",
                padding: 40, textAlign: "center",
              }}>
                <Star size={32} color="#E5E7EB" />
                <p style={{ color: "#6B7280", marginTop: 12 }}>No reviews yet.</p>
              </div>
            )}
          </div>
        )}

        {/* ── Contact Tab ── */}
        {currentTab === "contact" && (
          <div style={{
            backgroundColor: "#ffffff", borderRadius: 12, border: "1px solid #e2e8f0",
            padding: 24,
          }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", margin: "0 0 20px" }}>Contact Information</h3>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              <div>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Mail size={18} color="#2563EB" />
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: "#9CA3AF" }}>Email</div>
                      <a href={`mailto:${company.contact.email}`} style={{ fontSize: 14, fontWeight: 500, color: "#2563EB", textDecoration: "none" }}>{company.contact.email}</a>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: "#ECFDF5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Phone size={18} color="#059669" />
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: "#9CA3AF" }}>Phone</div>
                      <div style={{ fontSize: 14, fontWeight: 500, color: "#0f172a" }}>{company.contact.phone}</div>
                    </div>
                  </div>
                  {company.contact.website && (
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: "#FFFBEB", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Globe size={18} color="#D97706" />
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: "#9CA3AF" }}>Website</div>
                        <a href={company.contact.website} target="_blank" rel="noopener noreferrer" style={{ fontSize: 14, fontWeight: 500, color: "#2563EB", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
                          {company.contact.website.replace("https://", "")} <ExternalLink size={12} />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <div style={{
                  backgroundColor: "#f8fafc", borderRadius: 10, padding: 20, border: "1px solid #E5E7EB",
                }}>
                  <h4 style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", margin: "0 0 12px" }}>Headquarters</h4>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, color: "#4B5563", marginBottom: 12 }}>
                    <MapPin size={16} color="#6B7280" />
                    {company.headquarters.city}, {company.headquarters.province}
                  </div>
                  <button style={{
                    width: "100%", padding: "10px 16px", borderRadius: 8,
                    border: "2px solid #2563EB", backgroundColor: "#ffffff",
                    fontSize: 14, fontWeight: 600, color: "#2563EB", cursor: "pointer",
                  }}>
                    Request Quote
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
