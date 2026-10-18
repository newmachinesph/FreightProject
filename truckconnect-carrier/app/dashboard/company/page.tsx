"use client";
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Building2, User, Phone, Mail, MapPin, CreditCard, Shield,
  Calendar, Star, Truck, Ship, Snowflake, AlertTriangle,
  Check, Edit, Globe, Upload, FileText, Clock, Award,
  TrendingUp, Navigation, MessageSquare, X,
} from "lucide-react";
import { companyProfile, vehicles, trips, phRegions } from "@/lib/mock-data";

// ── Fleet Summary Computation ───────────────────────────────────────────────
const fleetByType: Record<string, number> = {};
let totalCapacityKg = 0;
let totalCapacityCbm = 0;
vehicles.forEach((v) => {
  fleetByType[v.type] = (fleetByType[v.type] || 0) + 1;
  totalCapacityKg += v.capacity.kg;
  totalCapacityCbm += v.capacity.cbm;
});

// ── Performance Metrics (mock) ──────────────────────────────────────────────
const performanceMetrics = {
  rating: companyProfile.compliance.rating,
  completedTrips: companyProfile.compliance.completedTrips,
  onTimePercent: 94,
  acceptancePercent: 87,
  avgResponseTime: "12 min",
};

// ── Compliance Documents ────────────────────────────────────────────────────
const complianceDocs = [
  { label: "LTFRB Franchise", status: "valid" as const, expiry: "2027-06-30", ref: "LTFRB-NCR-2024-00112" },
  { label: "DOLE Clearance", status: "valid" as const, expiry: "2027-01-15", ref: "DOLE-2025-98765" },
  { label: "Comprehensive Insurance", status: "valid" as const, expiry: companyProfile.insurance.expiry, ref: companyProfile.insurance.policyNo },
  { label: "CTPL Coverage", status: companyProfile.insurance.ctpl ? "valid" as const : "expired" as const, expiry: "2026-12-31", ref: "CTPL-2024-55678" },
];

const businessDocs = [
  { label: "DTI/SEC Registration", status: "uploaded" as const, ref: companyProfile.dtiRegNo },
  { label: "BIR Certificate of Registration", status: "uploaded" as const, ref: companyProfile.birTin },
  { label: "Mayor's Permit", status: "pending" as const, ref: "Renewal pending" },
  { label: "PhilSys / National ID", status: "uploaded" as const, ref: companyProfile.philsysId },
];

// ── Mock Shipper Reviews ────────────────────────────────────────────────────
const mockReviews = [
  {
    id: 1,
    shipperName: "SouthSea Fisheries Inc.",
    rating: 5,
    comment: "Excellent reefer service. Temperature was maintained perfectly throughout the Manila-Cebu route. Driver was professional and communicated updates proactively.",
    date: "Mar 14, 2026",
    tripRoute: "Manila to Cebu City",
  },
  {
    id: 2,
    shipperName: "OfficeHub PH",
    rating: 4,
    comment: "Good handling of fragile furniture. Delivery was on time. Minor scuff on one cabinet but overall satisfied with the service.",
    date: "Mar 10, 2026",
    tripRoute: "Pampanga to Makati",
  },
  {
    id: 3,
    shipperName: "AutoZone Imports",
    rating: 5,
    comment: "Very reliable for inter-island cargo. The trailer was well-maintained and strapping was secure. Will definitely book again for Mindanao routes.",
    date: "Mar 1, 2026",
    tripRoute: "Subic to Cagayan de Oro",
  },
];

// ── Region Map Visualization ────────────────────────────────────────────────
const regionGroups: Record<string, string[]> = {
  "Luzon": ["NCR", "CAR", "Ilocos Region", "Cagayan Valley", "Central Luzon", "Calabarzon", "Mimaropa", "Bicol Region"],
  "Visayas": ["Western Visayas", "Central Visayas", "Eastern Visayas"],
  "Mindanao": ["Zamboanga Peninsula", "Northern Mindanao", "Davao Region", "Soccsksargen", "Caraga", "BARMM"],
};

/** Render star rating with filled/half/empty stars */
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

export default function CompanyProfilePage() {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...companyProfile });

  const handleSave = () => {
    setEditing(false);
  };

  const completedTrips = trips.filter(t => t.status === "delivered");
  const onTimeTrips = completedTrips.filter(t => {
    if (!t.endDate) return false;
    return true; // mock: assume most are on-time
  });

  return (
    <DashboardLayout>
      <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111827", margin: 0 }}>Company Profile</h1>
          <p style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}>Manage your carrier company information</p>
        </div>
        <button onClick={() => editing ? handleSave() : setEditing(true)} style={{
          padding: "10px 20px", borderRadius: 8, border: "none",
          background: editing ? "#059669" : "#2563EB", color: "#FFFFFF",
          fontSize: 13, fontWeight: 600, cursor: "pointer",
          display: "flex", alignItems: "center", gap: 6,
        }}>
          {editing ? <><Check size={14} /> Save Changes</> : <><Edit size={14} /> Edit Profile</>}
        </button>
      </div>

      {/* Company Logo + Header Card */}
      <div style={{ ...panel, marginBottom: 24, display: "flex", alignItems: "center", gap: 24 }}>
        <div style={{
          width: 100, height: 100, borderRadius: 16, border: "2px dashed #E5E7EB",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          background: "#F9FAFB", cursor: "pointer", flexShrink: 0,
        }}>
          <Upload size={24} color="#9CA3AF" />
          <span style={{ fontSize: 10, color: "#9CA3AF", marginTop: 4, fontWeight: 600 }}>Upload Logo</span>
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#111827", margin: 0 }}>{form.name}</h2>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 8, flexWrap: "wrap" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "#6B7280" }}>
              <User size={13} /> {form.owner}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "#6B7280" }}>
              <MapPin size={13} /> {form.address}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "#6B7280" }}>
              <Phone size={13} /> {form.mobile}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "#6B7280" }}>
              <Mail size={13} /> {form.email}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
            <span style={{ padding: "3px 10px", borderRadius: 4, fontSize: 11, fontWeight: 600, background: "#DCFCE7", color: "#16A34A" }}>
              KYC Verified
            </span>
            <span style={{ padding: "3px 10px", borderRadius: 4, fontSize: 11, fontWeight: 600, background: "#DBEAFE", color: "#2563EB" }}>
              {form.yearsInOperation} Years in Operation
            </span>
            <span style={{ padding: "3px 10px", borderRadius: 4, fontSize: 11, fontWeight: 600, background: "#EFF6FF", color: "#2563EB" }}>
              LTFRB Franchised
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* Business Information */}
        <div style={panel}>
          <h3 style={sectionTitle}><Building2 size={16} /> Business Information</h3>
          <div style={{ display: "grid", gap: 16 }}>
            <ProfileField label="Business Name" value={form.name} editing={editing}
              onChange={(v) => setForm({ ...form, name: v })} />
            <ProfileField label="Owner / Contact Person" value={form.owner} editing={editing}
              onChange={(v) => setForm({ ...form, owner: v })} icon={<User size={12} />} />
            <ProfileField label="Mobile Number" value={form.mobile} editing={editing}
              onChange={(v) => setForm({ ...form, mobile: v })} icon={<Phone size={12} />} />
            <ProfileField label="Email Address" value={form.email} editing={editing}
              onChange={(v) => setForm({ ...form, email: v })} icon={<Mail size={12} />} />
            <ProfileField label="Business Address" value={form.address} editing={editing}
              onChange={(v) => setForm({ ...form, address: v })} icon={<MapPin size={12} />} />
            <ProfileField label="LTFRB Franchise No." value="LTFRB-NCR-2024-00112" editing={false}
              onChange={() => {}} icon={<CreditCard size={12} />} />
            <ProfileField label="Years in Operation" value={String(form.yearsInOperation)} editing={editing}
              onChange={(v) => setForm({ ...form, yearsInOperation: Number(v) })} icon={<Calendar size={12} />} />
          </div>
        </div>

        {/* Fleet Summary */}
        <div style={panel}>
          <h3 style={sectionTitle}><Truck size={16} /> Fleet Summary</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            <div style={{ textAlign: "center", padding: 14, background: "#F9FAFB", borderRadius: 8 }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#2563EB" }}>{vehicles.length}</div>
              <div style={{ fontSize: 12, color: "#6B7280" }}>Total Vehicles</div>
            </div>
            <div style={{ textAlign: "center", padding: 14, background: "#F9FAFB", borderRadius: 8 }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#059669" }}>
                {vehicles.filter(v => v.status === "available" || v.status === "on_trip").length}
              </div>
              <div style={{ fontSize: 12, color: "#6B7280" }}>Active Vehicles</div>
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>By Vehicle Type</div>
            <div style={{ display: "grid", gap: 6 }}>
              {Object.entries(fleetByType).sort((a, b) => b[1] - a[1]).map(([type, cnt]) => (
                <div key={type} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "6px 12px", background: "#F9FAFB", borderRadius: 6, fontSize: 13,
                }}>
                  <span style={{ color: "#374151", fontWeight: 500 }}>{type}</span>
                  <span style={{ fontWeight: 700, color: "#2563EB" }}>{cnt}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ padding: 12, background: "#EFF6FF", borderRadius: 8, textAlign: "center" }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#2563EB" }}>{(totalCapacityKg / 1000).toFixed(0)}t</div>
              <div style={{ fontSize: 11, color: "#6B7280" }}>Total Capacity (tons)</div>
            </div>
            <div style={{ padding: 12, background: "#F0FDF4", borderRadius: 8, textAlign: "center" }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#059669" }}>{totalCapacityCbm.toFixed(0)} CBM</div>
              <div style={{ fontSize: 11, color: "#6B7280" }}>Total Capacity (CBM)</div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div style={panel}>
          <h3 style={sectionTitle}><TrendingUp size={16} /> Performance Metrics</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div style={{ textAlign: "center", padding: 16, background: "#F9FAFB", borderRadius: 8 }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#F59E0B" }}>{performanceMetrics.rating}</div>
              <div style={{ fontSize: 12, color: "#6B7280" }}>Rating</div>
              <div style={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
                <StarRating rating={performanceMetrics.rating} size={14} showValue={false} />
              </div>
            </div>
            <div style={{ textAlign: "center", padding: 16, background: "#F9FAFB", borderRadius: 8 }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#2563EB" }}>{performanceMetrics.completedTrips.toLocaleString()}</div>
              <div style={{ fontSize: 12, color: "#6B7280" }}>Completed Trips</div>
            </div>
            <div style={{ textAlign: "center", padding: 16, background: "#F9FAFB", borderRadius: 8 }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#16A34A" }}>{performanceMetrics.onTimePercent}%</div>
              <div style={{ fontSize: 12, color: "#6B7280" }}>On-Time Delivery</div>
            </div>
            <div style={{ textAlign: "center", padding: 16, background: "#F9FAFB", borderRadius: 8 }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#7C3AED" }}>{performanceMetrics.acceptancePercent}%</div>
              <div style={{ fontSize: 12, color: "#6B7280" }}>Acceptance Rate</div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 10, padding: "10px 14px",
              background: "#F9FAFB", borderRadius: 8,
            }}>
              <Clock size={16} color="#D97706" />
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>{performanceMetrics.avgResponseTime}</div>
                <div style={{ fontSize: 11, color: "#6B7280" }}>Avg Response Time</div>
              </div>
            </div>
            <div style={{
              display: "flex", alignItems: "center", gap: 10, padding: "10px 14px",
              background: "#F9FAFB", borderRadius: 8,
            }}>
              <Navigation size={16} color="#2563EB" />
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>
                  {trips.filter(t => t.status !== "delivered").length}
                </div>
                <div style={{ fontSize: 11, color: "#6B7280" }}>Active Trips</div>
              </div>
            </div>
          </div>
        </div>

        {/* Service Areas Map */}
        <div style={panel}>
          <h3 style={sectionTitle}><Globe size={16} /> Service Areas &amp; Coverage</h3>
          <div style={{ marginBottom: 16 }}>
            {Object.entries(regionGroups).map(([island, regions]) => {
              const coveredInIsland = regions.filter(r => form.serviceAreas.includes(r));
              const percentage = Math.round((coveredInIsland.length / regions.length) * 100);
              return (
                <div key={island} style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{island}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: percentage > 0 ? "#2563EB" : "#9CA3AF" }}>
                      {coveredInIsland.length}/{regions.length} regions ({percentage}%)
                    </span>
                  </div>
                  {/* Coverage bar */}
                  <div style={{ height: 6, background: "#F3F4F6", borderRadius: 3, marginBottom: 8 }}>
                    <div style={{
                      height: "100%", borderRadius: 3, width: `${percentage}%`,
                      background: percentage === 100 ? "#16A34A" : percentage > 50 ? "#2563EB" : percentage > 0 ? "#D97706" : "#E5E7EB",
                      transition: "width 0.3s ease",
                    }} />
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {regions.map(r => {
                      const isCovered = form.serviceAreas.includes(r);
                      return editing ? (
                        <button key={r} onClick={() => {
                          setForm({
                            ...form,
                            serviceAreas: isCovered
                              ? form.serviceAreas.filter(a => a !== r)
                              : [...form.serviceAreas, r],
                          });
                        }} style={{
                          padding: "3px 10px", borderRadius: 4, border: "1px solid",
                          borderColor: isCovered ? "#2563EB" : "#E5E7EB",
                          background: isCovered ? "#EFF6FF" : "#FFFFFF",
                          color: isCovered ? "#2563EB" : "#9CA3AF",
                          fontSize: 11, fontWeight: 500, cursor: "pointer",
                        }}>
                          {r}
                        </button>
                      ) : (
                        <span key={r} style={{
                          padding: "3px 10px", borderRadius: 4, fontSize: 11, fontWeight: 600,
                          background: isCovered ? "#EFF6FF" : "#F9FAFB",
                          color: isCovered ? "#2563EB" : "#D1D5DB",
                        }}>
                          {r}
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Compliance Status */}
        <div style={panel}>
          <h3 style={sectionTitle}><Shield size={16} /> Compliance Status</h3>
          <div style={{ display: "grid", gap: 10 }}>
            {complianceDocs.map((doc) => {
              const expDate = new Date(doc.expiry);
              const now = new Date("2026-03-20");
              const daysLeft = Math.ceil((expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
              const isExpiring = daysLeft <= 90 && daysLeft > 0;
              const isExpired = daysLeft <= 0;
              return (
                <div key={doc.label} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "10px 14px", borderRadius: 8,
                  background: isExpired ? "#FEF2F2" : isExpiring ? "#FFFBEB" : "#F0FDF4",
                  border: `1px solid ${isExpired ? "#FECACA" : isExpiring ? "#FDE68A" : "#BBF7D0"}`,
                }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{doc.label}</div>
                    <div style={{ fontSize: 11, color: "#6B7280", fontFamily: "monospace", marginTop: 2 }}>{doc.ref}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span style={{
                      padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 700,
                      background: isExpired ? "#FEE2E2" : isExpiring ? "#FEF3C7" : "#DCFCE7",
                      color: isExpired ? "#DC2626" : isExpiring ? "#D97706" : "#16A34A",
                    }}>
                      {isExpired ? "EXPIRED" : isExpiring ? "EXPIRING SOON" : "VALID"}
                    </span>
                    <div style={{ fontSize: 10, color: "#9CA3AF", marginTop: 4 }}>
                      Exp: {doc.expiry} {!isExpired && `(${daysLeft}d)`}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Business Documents */}
        <div style={panel}>
          <h3 style={sectionTitle}><FileText size={16} /> Business Documents</h3>
          <div style={{ display: "grid", gap: 10 }}>
            {businessDocs.map((doc) => (
              <div key={doc.label} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "10px 14px", borderRadius: 8,
                background: "#F9FAFB", border: "1px solid #E5E7EB",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 6,
                    background: doc.status === "uploaded" ? "#DCFCE7" : "#FEF3C7",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {doc.status === "uploaded" ? (
                      <Check size={14} color="#16A34A" />
                    ) : (
                      <Clock size={14} color="#D97706" />
                    )}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{doc.label}</div>
                    <div style={{ fontSize: 11, color: "#9CA3AF", fontFamily: "monospace" }}>{doc.ref}</div>
                  </div>
                </div>
                <span style={{
                  padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 700,
                  background: doc.status === "uploaded" ? "#DCFCE7" : "#FEF3C7",
                  color: doc.status === "uploaded" ? "#16A34A" : "#D97706",
                  textTransform: "uppercase",
                }}>
                  {doc.status === "uploaded" ? "Uploaded" : "Pending"}
                </span>
              </div>
            ))}
            <button style={{
              padding: "8px 16px", borderRadius: 6, border: "1px dashed #D1D5DB",
              background: "#FFFFFF", color: "#6B7280", fontSize: 12, fontWeight: 600,
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            }}>
              <Upload size={12} /> Upload New Document
            </button>
          </div>
        </div>

        {/* Service Types & Capabilities */}
        <div style={panel}>
          <h3 style={sectionTitle}><Truck size={16} /> Service Types &amp; Capabilities</h3>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Service Types</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {form.serviceTypes.map((st) => (
                <span key={st} style={{ padding: "4px 12px", borderRadius: 6, fontSize: 12, fontWeight: 600, background: "#F3F4F6", color: "#374151" }}>
                  {st}
                </span>
              ))}
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <CapabilityToggle label="Inter-Island / RoRo" icon={<Ship size={14} />} enabled={form.roro} />
            <CapabilityToggle label="Cold Chain / Reefer" icon={<Snowflake size={14} />} enabled={form.coldChain} />
            <CapabilityToggle label="Hazmat" icon={<AlertTriangle size={14} />} enabled={form.hazmat} />
            <CapabilityToggle label="Night Operations" icon={<Calendar size={14} />} enabled={form.nightOps} />
          </div>

          {/* Rate Card */}
          {form.baseRates && form.baseRates.length > 0 && (
            <div style={{ marginTop: 20 }}>
              <div style={{ fontSize: 11, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Base Rates</div>
              {form.baseRates.map((r, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #F3F4F6", fontSize: 13 }}>
                  <span style={{ color: "#374151" }}>{r.route}</span>
                  <div style={{ display: "flex", gap: 12 }}>
                    <span style={{ color: "#9CA3AF" }}>{"\u20B1"}{r.ratePerKm}/km</span>
                    <span style={{ color: "#6B7280", fontWeight: 600 }}>Min: {"\u20B1"}{r.minRate.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Reviews - full width */}
        <div style={{ ...panel, gridColumn: "1 / -1" }}>
          <h3 style={sectionTitle}><MessageSquare size={16} /> Recent Shipper Reviews</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {mockReviews.map((review) => (
              <div key={review.id} style={{
                padding: 16, borderRadius: 10, background: "#F9FAFB", border: "1px solid #E5E7EB",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{review.shipperName}</div>
                    <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>{review.tripRoute}</div>
                  </div>
                  <StarRating rating={review.rating} size={12} showValue={false} />
                </div>
                <p style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.5, margin: 0 }}>
                  &ldquo;{review.comment}&rdquo;
                </p>
                <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 10 }}>{review.date}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Registration & Compliance (original) */}
        <div style={panel}>
          <h3 style={sectionTitle}><CreditCard size={16} /> Registration &amp; Compliance</h3>
          <div style={{ display: "grid", gap: 16 }}>
            <ProfileField label="PhilSys / National ID" value={form.philsysId} editing={editing}
              onChange={(v) => setForm({ ...form, philsysId: v })} />
            <ProfileField label="DTI / SEC Registration No." value={form.dtiRegNo} editing={editing}
              onChange={(v) => setForm({ ...form, dtiRegNo: v })} />
            <ProfileField label="BIR TIN" value={form.birTin} editing={editing}
              onChange={(v) => setForm({ ...form, birTin: v })} />
            <div>
              <div style={{ fontSize: 11, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>DOLE Driver Clearance</div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {form.compliance.doleCleared ? (
                  <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "#16A34A", fontWeight: 600 }}>
                    <Check size={14} /> Cleared
                  </span>
                ) : (
                  <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "#DC2626", fontWeight: 600 }}>
                    <AlertTriangle size={14} /> Not Cleared
                  </span>
                )}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>KYC Status</div>
              <span style={{
                padding: "3px 10px", borderRadius: 4, fontSize: 11, fontWeight: 600,
                background: form.compliance.kycVerified ? "#DCFCE7" : "#FEF3C7",
                color: form.compliance.kycVerified ? "#16A34A" : "#D97706",
              }}>
                {form.compliance.kycVerified ? "Verified" : "Pending"}
              </span>
            </div>
          </div>
        </div>

        {/* Insurance */}
        <div style={panel}>
          <h3 style={sectionTitle}><Shield size={16} /> Insurance</h3>
          <div style={{ display: "grid", gap: 16 }}>
            <ProfileField label="Insurance Policy No." value={form.insurance.policyNo} editing={editing}
              onChange={(v) => setForm({ ...form, insurance: { ...form.insurance, policyNo: v } })} />
            <ProfileField label="Insurance Expiry" value={form.insurance.expiry} editing={editing}
              onChange={(v) => setForm({ ...form, insurance: { ...form.insurance, expiry: v } })} />
            <div>
              <div style={{ fontSize: 11, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>CTPL Coverage</div>
              <span style={{
                padding: "3px 10px", borderRadius: 4, fontSize: 11, fontWeight: 600,
                background: form.insurance.ctpl ? "#DCFCE7" : "#FEE2E2",
                color: form.insurance.ctpl ? "#16A34A" : "#DC2626",
              }}>
                {form.insurance.ctpl ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function ProfileField({ label, value, editing, onChange, icon }: {
  label: string; value: string; editing: boolean; onChange: (v: string) => void; icon?: React.ReactNode;
}) {
  return (
    <div>
      <div style={{ fontSize: 11, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4, display: "flex", alignItems: "center", gap: 4 }}>
        {icon} {label}
      </div>
      {editing ? (
        <input value={value} onChange={(e) => onChange(e.target.value)} style={{
          width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid #E5E7EB",
          fontSize: 13, outline: "none", boxSizing: "border-box",
        }} />
      ) : (
        <div style={{ fontSize: 14, color: "#111827", fontWeight: 500 }}>{value}</div>
      )}
    </div>
  );
}

function CapabilityToggle({ label, icon, enabled }: { label: string; icon: React.ReactNode; enabled: boolean }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8, padding: "8px 12px",
      background: enabled ? "#ECFDF5" : "#F9FAFB", borderRadius: 6,
      border: `1px solid ${enabled ? "#A7F3D0" : "#E5E7EB"}`,
    }}>
      <div style={{ color: enabled ? "#059669" : "#9CA3AF" }}>{icon}</div>
      <span style={{ fontSize: 12, fontWeight: 600, color: enabled ? "#059669" : "#9CA3AF" }}>{label}</span>
      <span style={{ marginLeft: "auto", fontSize: 10, fontWeight: 700, color: enabled ? "#059669" : "#9CA3AF" }}>
        {enabled ? "YES" : "NO"}
      </span>
    </div>
  );
}

const panel: React.CSSProperties = {
  background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 12, padding: 24,
};

const sectionTitle: React.CSSProperties = {
  fontSize: 15, fontWeight: 700, color: "#111827", margin: "0 0 16px 0",
  display: "flex", alignItems: "center", gap: 8,
};
