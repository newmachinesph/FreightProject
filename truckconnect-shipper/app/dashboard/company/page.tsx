"use client";
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { companyProfile, payments, bookings, loads, formatPeso, preferredCarriers } from "@/lib/mock-data";
import {
  Building2,
  User,
  Phone,
  Mail,
  MapPin,
  FileText,
  ShoppingBag,
  Truck,
  Check,
  Edit3,
  Upload,
  Camera,
  Star,
  Shield,
  FileCheck2,
  AlertCircle,
  CheckCircle2,
  Clock,
  TrendingUp,
  BarChart3,
  Package,
  DollarSign,
  Award,
  Image,
} from "lucide-react";

// Computed stats
const totalShipments = loads.filter((l) => l.status === "delivered").length;
const totalSpend = payments.filter((p) => p.status === "Paid").reduce((sum, p) => sum + p.amount, 0);
const avgCostPerShipment = totalShipments > 0 ? Math.round(totalSpend / totalShipments) : 0;
const totalBookings = bookings.filter((b) => b.status === "delivered" || b.status === "in_transit" || b.status === "confirmed").length;
const activeLoads = loads.filter((l) => ["posted", "bidding", "awarded", "in_transit"].includes(l.status)).length;

// Document upload status mock
const businessDocuments = [
  { name: "DTI / SEC Certificate", status: "uploaded" as const, fileName: "SEC-CS201812345.pdf", uploadDate: "2025-11-15" },
  { name: "BIR Certificate of Registration", status: "uploaded" as const, fileName: "BIR-COR-2024.pdf", uploadDate: "2025-11-15" },
  { name: "Mayor's Business Permit", status: "pending" as const, fileName: null, uploadDate: null },
  { name: "Valid Government ID (Authorized Rep)", status: "uploaded" as const, fileName: "GovID-MariaSantos.jpg", uploadDate: "2025-11-16" },
  { name: "Proof of Billing Address", status: "not_uploaded" as const, fileName: null, uploadDate: null },
];

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
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({ ...companyProfile });

  const set = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = () => {
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const industries = [
    "Fast Moving Consumer Goods", "Electronics & Technology", "Construction & Building Materials",
    "Pharmaceuticals & Healthcare", "Agricultural & Farming", "Automotive & Parts",
    "Food & Beverage", "E-commerce & Retail", "Manufacturing", "Petroleum & Chemicals",
    "Textile & Garments", "Logistics & Distribution", "Other",
  ];

  const volumeOptions = [
    "1-10 shipments", "10-25 shipments", "25-50 shipments",
    "50-100 shipments", "100-250 shipments", "250+ shipments",
  ];

  const docStatusConfig = {
    uploaded: { bg: "#DCFCE7", color: "#166534", icon: CheckCircle2, label: "Uploaded" },
    pending: { bg: "#FEF3C7", color: "#92400E", icon: Clock, label: "Pending Review" },
    not_uploaded: { bg: "#FEE2E2", color: "#991B1B", icon: AlertCircle, label: "Not Uploaded" },
  };

  return (
    <DashboardLayout activeNav="/dashboard/company">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111827", margin: 0 }}>Company Profile</h1>
          <p style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}>Manage your shipper company information</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {saved && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "8px 16px", background: "#DCFCE7", color: "#059669", borderRadius: 8, fontSize: 13, fontWeight: 600 }}>
              <Check size={14} /> Saved successfully
            </span>
          )}
          {!editing ? (
            <button onClick={() => setEditing(true)} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 20px", background: "#2563EB", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
              <Edit3 size={16} /> Edit Profile
            </button>
          ) : (
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setEditing(false)} style={{ padding: "10px 20px", background: "#fff", color: "#374151", border: "1px solid #D1D5DB", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
              <button onClick={handleSave} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 20px", background: "#059669", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                <Check size={16} /> Save Changes
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Company Logo + Header Banner */}
      <div style={{
        background: "linear-gradient(135deg, #EFF6FF 0%, #F0FDF4 100%)",
        border: "1px solid #DBEAFE", borderRadius: 14,
        padding: "28px 32px", marginBottom: 20,
        display: "flex", alignItems: "center", gap: 24,
      }}>
        {/* Logo placeholder with upload */}
        <div style={{ position: "relative" }}>
          <div style={{
            width: 96, height: 96, borderRadius: 16,
            background: "#fff", border: "2px dashed #D1D5DB",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4,
            cursor: editing ? "pointer" : "default",
            transition: "border-color 0.2s",
            ...(editing ? { borderColor: "#2563EB" } : {}),
          }}>
            <Building2 size={28} color="#9CA3AF" />
            <span style={{ fontSize: 9, color: "#9CA3AF", fontWeight: 600, textTransform: "uppercase" as const }}>Company Logo</span>
          </div>
          {editing && (
            <div style={{
              position: "absolute", bottom: -4, right: -4,
              width: 28, height: 28, borderRadius: "50%",
              background: "#2563EB", color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", boxShadow: "0 2px 6px rgba(37,99,235,0.3)",
            }}>
              <Camera size={14} />
            </div>
          )}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#111827" }}>{form.name}</div>
          <div style={{ fontSize: 14, color: "#6B7280", marginTop: 2 }}>{form.industry}</div>
          <div style={{ display: "flex", gap: 16, marginTop: 10, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#374151" }}>
              <MapPin size={12} color="#6B7280" />
              {form.billingAddress}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#374151" }}>
              <Mail size={12} color="#6B7280" />
              {form.email}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#374151" }}>
              <Phone size={12} color="#6B7280" />
              {form.mobile}
            </div>
          </div>
        </div>
        {editing && (
          <button style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "8px 16px", background: "#fff", color: "#2563EB",
            border: "1px solid #BFDBFE", borderRadius: 8,
            fontSize: 12, fontWeight: 600, cursor: "pointer",
          }}>
            <Upload size={14} /> Upload Logo
          </button>
        )}
      </div>

      {/* Shipping History Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14, marginBottom: 20 }}>
        {[
          { label: "Total Shipments", value: totalShipments.toString(), icon: Package, color: "#2563EB", bg: "#EFF6FF" },
          { label: "Active Loads", value: activeLoads.toString(), icon: Truck, color: "#D97706", bg: "#FFFBEB" },
          { label: "Total Spend", value: formatPeso(totalSpend), icon: DollarSign, color: "#059669", bg: "#ECFDF5" },
          { label: "Avg Cost / Shipment", value: formatPeso(avgCostPerShipment), icon: TrendingUp, color: "#7C3AED", bg: "#F5F3FF" },
          { label: "Shipper Rating", value: "4.7", icon: Star, color: "#F59E0B", bg: "#FFFBEB" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} style={{
              background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12,
              padding: "16px 18px", display: "flex", alignItems: "center", gap: 12,
            }}>
              <div style={{
                width: 42, height: 42, borderRadius: 10,
                background: stat.bg, display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <Icon size={20} color={stat.color} />
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#111827" }}>{stat.value}</div>
                <div style={{ fontSize: 10, color: "#9CA3AF", fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: 0.3 }}>{stat.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Business Information */}
        <div style={s.card}>
          <div style={s.sectionHeader}>
            <Building2 size={18} color="#2563EB" />
            <h2 style={s.sectionTitle}>Business Information</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={s.field}>
              <label style={s.label}>Business Name</label>
              {editing ? (
                <input type="text" style={s.input} value={form.name} onChange={(e) => set("name", e.target.value)} />
              ) : (
                <div style={s.value}>{form.name}</div>
              )}
            </div>
            <div style={s.field}>
              <label style={s.label}>Industry / Sector</label>
              {editing ? (
                <select style={s.select} value={form.industry} onChange={(e) => set("industry", e.target.value)}>
                  {industries.map((i) => <option key={i} value={i}>{i}</option>)}
                </select>
              ) : (
                <div style={s.value}>{form.industry}</div>
              )}
            </div>
            <div style={s.field}>
              <label style={s.label}>Monthly Volume Estimate</label>
              {editing ? (
                <select style={s.select} value={form.monthlyVolume} onChange={(e) => set("monthlyVolume", e.target.value)}>
                  {volumeOptions.map((v) => <option key={v} value={v}>{v}</option>)}
                </select>
              ) : (
                <div style={s.value}>{form.monthlyVolume}</div>
              )}
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div style={s.card}>
          <div style={s.sectionHeader}>
            <User size={18} color="#059669" />
            <h2 style={s.sectionTitle}>Contact Information</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={s.field}>
              <label style={s.label}><User size={12} style={{ marginRight: 4, verticalAlign: "middle" }} />Contact Person</label>
              {editing ? (
                <input type="text" style={s.input} value={form.contact} onChange={(e) => set("contact", e.target.value)} />
              ) : (
                <div style={s.value}>{form.contact}</div>
              )}
            </div>
            <div style={s.field}>
              <label style={s.label}><Phone size={12} style={{ marginRight: 4, verticalAlign: "middle" }} />Mobile / Viber</label>
              {editing ? (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <input type="text" style={s.input} value={form.mobile} onChange={(e) => set("mobile", e.target.value)} placeholder="Mobile" />
                  <input type="text" style={s.input} value={form.viber} onChange={(e) => set("viber", e.target.value)} placeholder="Viber" />
                </div>
              ) : (
                <div style={s.value}>{form.mobile} {form.viber !== form.mobile && `(Viber: ${form.viber})`}</div>
              )}
            </div>
            <div style={s.field}>
              <label style={s.label}><Mail size={12} style={{ marginRight: 4, verticalAlign: "middle" }} />Email</label>
              {editing ? (
                <input type="email" style={s.input} value={form.email} onChange={(e) => set("email", e.target.value)} />
              ) : (
                <div style={s.value}>{form.email}</div>
              )}
            </div>
            <div style={s.field}>
              <label style={s.label}><MapPin size={12} style={{ marginRight: 4, verticalAlign: "middle" }} />Billing Address</label>
              {editing ? (
                <textarea rows={2} style={{ ...s.input, resize: "vertical", fontFamily: "inherit" }} value={form.billingAddress} onChange={(e) => set("billingAddress", e.target.value)} />
              ) : (
                <div style={s.value}>{form.billingAddress}</div>
              )}
            </div>
          </div>
        </div>

        {/* Business Documents Section */}
        <div style={s.card}>
          <div style={s.sectionHeader}>
            <Shield size={18} color="#DC2626" />
            <h2 style={s.sectionTitle}>Business Documents</h2>
            <span style={{
              marginLeft: "auto", fontSize: 11, padding: "3px 10px",
              borderRadius: 999, fontWeight: 600,
              background: businessDocuments.filter(d => d.status === "uploaded").length === businessDocuments.length ? "#DCFCE7" : "#FEF3C7",
              color: businessDocuments.filter(d => d.status === "uploaded").length === businessDocuments.length ? "#166534" : "#92400E",
            }}>
              {businessDocuments.filter(d => d.status === "uploaded").length}/{businessDocuments.length} Complete
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {businessDocuments.map((doc) => {
              const config = docStatusConfig[doc.status];
              const StatusIcon = config.icon;
              return (
                <div key={doc.name} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "12px 16px", borderRadius: 10,
                  border: "1px solid",
                  borderColor: doc.status === "not_uploaded" ? "#FECACA" : doc.status === "pending" ? "#FDE68A" : "#D1FAE5",
                  background: doc.status === "not_uploaded" ? "#FFF5F5" : doc.status === "pending" ? "#FFFBEB" : "#F0FDF4",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <StatusIcon size={16} color={config.color} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{doc.name}</div>
                      {doc.fileName && (
                        <div style={{ fontSize: 11, color: "#6B7280", marginTop: 2 }}>{doc.fileName} - {doc.uploadDate}</div>
                      )}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{
                      fontSize: 10, padding: "3px 8px", borderRadius: 999,
                      background: config.bg, color: config.color, fontWeight: 600,
                    }}>
                      {config.label}
                    </span>
                    {doc.status !== "uploaded" && (
                      <button style={{
                        display: "inline-flex", alignItems: "center", gap: 4,
                        padding: "4px 10px", background: "#fff", border: "1px solid #D1D5DB",
                        borderRadius: 6, fontSize: 11, fontWeight: 600, color: "#374151",
                        cursor: "pointer",
                      }}>
                        <Upload size={10} /> Upload
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Government Registrations */}
        <div style={s.card}>
          <div style={s.sectionHeader}>
            <FileText size={18} color="#D97706" />
            <h2 style={s.sectionTitle}>Government Registrations</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={s.field}>
              <label style={s.label}>BIR TIN</label>
              {editing ? (
                <input type="text" style={s.input} value={form.birTin} onChange={(e) => set("birTin", e.target.value)} placeholder="e.g. 987-654-321-000" />
              ) : (
                <div style={{ ...s.value, fontFamily: "monospace" }}>{form.birTin}</div>
              )}
            </div>
            <div style={s.field}>
              <label style={s.label}>SEC / DTI Registration No.</label>
              {editing ? (
                <input type="text" style={s.input} value={form.secRegNo} onChange={(e) => set("secRegNo", e.target.value)} placeholder="e.g. SEC-CS201812345" />
              ) : (
                <div style={{ ...s.value, fontFamily: "monospace" }}>{form.secRegNo}</div>
              )}
            </div>
            <div style={s.field}>
              <label style={s.label}>PEZA / BOI Accreditation</label>
              {editing ? (
                <input type="text" style={s.input} value={form.pezaBoi} onChange={(e) => set("pezaBoi", e.target.value)} placeholder="e.g. PEZA-2023-001 (optional)" />
              ) : (
                <div style={s.value}>{form.pezaBoi || <span style={{ color: "#9CA3AF", fontStyle: "italic" }}>Not set</span>}</div>
              )}
            </div>
          </div>
        </div>

        {/* Preferred Carriers */}
        <div style={s.card}>
          <div style={s.sectionHeader}>
            <Award size={18} color="#2563EB" />
            <h2 style={s.sectionTitle}>Preferred Carriers</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {preferredCarriers.map((carrier, idx) => (
              <div key={carrier.name} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "14px 18px", borderRadius: 10,
                background: idx === 0 ? "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)" : "#F9FAFB",
                border: idx === 0 ? "1px solid #93C5FD" : "1px solid #E5E7EB",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  {/* Rank badge */}
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%",
                    background: idx === 0 ? "#2563EB" : idx === 1 ? "#6B7280" : "#9CA3AF",
                    color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 13, fontWeight: 800, flexShrink: 0,
                  }}>
                    #{idx + 1}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{carrier.name}</div>
                    <div style={{ fontSize: 11, color: "#6B7280", marginTop: 2 }}>{carrier.trips} trips completed</div>
                  </div>
                </div>
                <StarRating rating={carrier.rating} size={12} />
              </div>
            ))}
          </div>
        </div>

        {/* E-commerce Integration */}
        <div style={s.card}>
          <div style={s.sectionHeader}>
            <ShoppingBag size={18} color="#7C3AED" />
            <h2 style={s.sectionTitle}>E-commerce Integration (Optional)</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={s.field}>
              <label style={s.label}>Shopee Seller ID</label>
              {editing ? (
                <input type="text" style={s.input} value={form.shopeeId} onChange={(e) => set("shopeeId", e.target.value)} placeholder="Enter your Shopee seller ID" />
              ) : (
                <div style={s.value}>{form.shopeeId || <span style={{ color: "#9CA3AF", fontStyle: "italic" }}>Not connected</span>}</div>
              )}
            </div>
            <div style={s.field}>
              <label style={s.label}>Lazada Seller ID</label>
              {editing ? (
                <input type="text" style={s.input} value={form.lazadaId} onChange={(e) => set("lazadaId", e.target.value)} placeholder="Enter your Lazada seller ID" />
              ) : (
                <div style={s.value}>{form.lazadaId || <span style={{ color: "#9CA3AF", fontStyle: "italic" }}>Not connected</span>}</div>
              )}
            </div>
          </div>
          <div style={{ marginTop: 16, padding: "10px 14px", background: "#F5F3FF", borderRadius: 8, border: "1px solid #DDD6FE" }}>
            <div style={{ fontSize: 12, color: "#6D28D9", fontWeight: 600 }}>Integration Note</div>
            <div style={{ fontSize: 11, color: "#7C3AED", marginTop: 2 }}>Connecting your Shopee/Lazada account enables automatic load creation from your e-commerce orders.</div>
          </div>
        </div>
      </div>

      {/* Shipping Profile Summary - enhanced */}
      <div style={{ ...s.card, marginTop: 20 }}>
        <div style={s.sectionHeader}>
          <BarChart3 size={18} color="#2563EB" />
          <h2 style={s.sectionTitle}>Shipping Profile Summary</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
          <div style={s.summaryItem}>
            <div style={s.summaryNumber}>15</div>
            <div style={s.summaryLabel}>Total Loads Posted</div>
            <div style={{ marginTop: 6, display: "flex", alignItems: "center", justifyContent: "center", gap: 3, fontSize: 11, color: "#059669", fontWeight: 600 }}>
              <TrendingUp size={12} /> +3 this month
            </div>
          </div>
          <div style={s.summaryItem}>
            <div style={s.summaryNumber}>{totalBookings}</div>
            <div style={s.summaryLabel}>Completed Bookings</div>
            <div style={{ marginTop: 6, fontSize: 11, color: "#6B7280" }}>
              {Math.round((totalBookings / 15) * 100)}% completion rate
            </div>
          </div>
          <div style={s.summaryItem}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
              <div style={s.summaryNumber}>4.7</div>
              <Star size={18} color="#F59E0B" fill="#F59E0B" style={{ marginTop: -4 }} />
            </div>
            <div style={s.summaryLabel}>Shipper Rating</div>
            <div style={{ marginTop: 6, fontSize: 11, color: "#6B7280" }}>
              Based on carrier feedback
            </div>
          </div>
          <div style={s.summaryItem}>
            <div style={s.summaryNumber}>98%</div>
            <div style={s.summaryLabel}>On-time Payment</div>
            <div style={{ marginTop: 6, display: "flex", alignItems: "center", justifyContent: "center", gap: 3, fontSize: 11, color: "#059669", fontWeight: 600 }}>
              <CheckCircle2 size={12} /> Excellent
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

const s: Record<string, React.CSSProperties> = {
  card: { background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: "24px 28px" },
  sectionHeader: { display: "flex", alignItems: "center", gap: 8, marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid #F3F4F6" },
  sectionTitle: { fontSize: 15, fontWeight: 700, color: "#111827", margin: 0 },
  field: { display: "flex", flexDirection: "column" },
  label: { fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6, display: "flex", alignItems: "center" },
  input: { padding: "10px 12px", border: "1px solid #D1D5DB", borderRadius: 8, fontSize: 14, color: "#111827", outline: "none", background: "#fff" },
  select: { padding: "10px 12px", border: "1px solid #D1D5DB", borderRadius: 8, fontSize: 14, color: "#111827", outline: "none", background: "#fff", cursor: "pointer" },
  value: { fontSize: 14, color: "#111827", fontWeight: 500, padding: "10px 0" },
  summaryItem: { textAlign: "center" as const, padding: "20px 16px", background: "#F9FAFB", borderRadius: 12, border: "1px solid #F3F4F6" },
  summaryNumber: { fontSize: 28, fontWeight: 800, color: "#2563EB" },
  summaryLabel: { fontSize: 12, color: "#6B7280", marginTop: 4 },
};
