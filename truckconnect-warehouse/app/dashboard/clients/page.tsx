"use client";
import { useState } from "react";
import {
  Users, Search, ShoppingBag, TrendingUp, Package, Calendar, ArrowRight,
  ChevronDown, Mail, Phone, MapPin, FileText, Star, Plus, X, CheckCircle,
} from "lucide-react";

const ACCENT = "#7C3AED";

interface CommunicationEntry {
  type: "email" | "phone" | "visit";
  date: string;
  summary: string;
}

interface OrderHistoryEntry {
  id: string;
  date: string;
  items: number;
  status: "Completed" | "In Progress" | "Pending";
  value: number;
}

interface Client {
  id: number;
  name: string;
  type: string;
  typeBadgeColor: string;
  typeBadgeBg: string;
  activeOrders: number;
  monthlyRevenue: number;
  storageArea: string;
  lastOrderDate: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  npsScore: number;
  slaCompliance: number;
  slaTarget: number;
  contractStart: string;
  contractEnd: string;
  rateAgreement: string;
  renewalDate: string;
  revenueTrend: number[];
  storageUsageTrend: number[];
  communications: CommunicationEntry[];
  orderHistory: OrderHistoryEntry[];
}

const clients: Client[] = [
  {
    id: 1, name: "SM Hypermarket", type: "Retail", typeBadgeColor: "#2563EB", typeBadgeBg: "#EFF6FF",
    activeOrders: 12, monthlyRevenue: 85000, storageArea: "120 sqm", lastOrderDate: "Mar 18, 2026",
    contactPerson: "Maria Reyes", contactEmail: "maria.reyes@smhypermarket.ph", contactPhone: "+63 917 555 1234",
    address: "SM Corporate Center, Pasay City, Metro Manila",
    npsScore: 72, slaCompliance: 98.5, slaTarget: 98,
    contractStart: "Jan 1, 2025", contractEnd: "Dec 31, 2026", rateAgreement: "Tiered (Vol. Discount)", renewalDate: "Nov 1, 2026",
    revenueTrend: [72000, 78000, 80000, 82000, 83000, 85000],
    storageUsageTrend: [95, 100, 108, 112, 118, 120],
    communications: [
      { type: "email", date: "Mar 15, 2026", summary: "Confirmed Q2 volume forecast increase of 15%" },
      { type: "phone", date: "Mar 10, 2026", summary: "Discussed holiday season storage capacity needs" },
      { type: "visit", date: "Feb 28, 2026", summary: "Quarterly business review at SM Corporate" },
    ],
    orderHistory: [
      { id: "ORD-2401", date: "Mar 18, 2026", items: 48, status: "In Progress", value: 12500 },
      { id: "ORD-2389", date: "Mar 14, 2026", items: 36, status: "Completed", value: 9800 },
      { id: "ORD-2371", date: "Mar 10, 2026", items: 52, status: "Completed", value: 14200 },
      { id: "ORD-2355", date: "Mar 06, 2026", items: 28, status: "Completed", value: 7600 },
    ],
  },
  {
    id: 2, name: "Mercury Drug", type: "Pharma", typeBadgeColor: "#059669", typeBadgeBg: "#ECFDF5",
    activeOrders: 8, monthlyRevenue: 62000, storageArea: "85 sqm", lastOrderDate: "Mar 17, 2026",
    contactPerson: "Dr. Antonio Cruz", contactEmail: "a.cruz@mercurydrug.com.ph", contactPhone: "+63 918 555 5678",
    address: "Mercury Ave, Paranaque City, Metro Manila",
    npsScore: 65, slaCompliance: 99.2, slaTarget: 98,
    contractStart: "Apr 1, 2025", contractEnd: "Mar 31, 2027", rateAgreement: "Fixed Rate (Cold Chain Premium)", renewalDate: "Feb 1, 2027",
    revenueTrend: [55000, 57000, 58000, 60000, 61000, 62000],
    storageUsageTrend: [70, 72, 75, 78, 82, 85],
    communications: [
      { type: "email", date: "Mar 14, 2026", summary: "Updated cold chain temperature compliance report sent" },
      { type: "phone", date: "Mar 08, 2026", summary: "Coordination for new pharma product line storage" },
      { type: "email", date: "Feb 25, 2026", summary: "FDA audit preparation document exchange" },
    ],
    orderHistory: [
      { id: "ORD-2398", date: "Mar 17, 2026", items: 24, status: "In Progress", value: 8900 },
      { id: "ORD-2380", date: "Mar 12, 2026", items: 18, status: "Completed", value: 6700 },
      { id: "ORD-2362", date: "Mar 07, 2026", items: 30, status: "Completed", value: 11200 },
    ],
  },
  {
    id: 3, name: "Lazada Fulfillment", type: "E-commerce", typeBadgeColor: "#D97706", typeBadgeBg: "#FFFBEB",
    activeOrders: 15, monthlyRevenue: 120000, storageArea: "200 sqm", lastOrderDate: "Mar 20, 2026",
    contactPerson: "Kevin Lim", contactEmail: "kevin.lim@lazada.com.ph", contactPhone: "+63 919 555 9012",
    address: "Lazada Warehouse Hub, Taguig City, Metro Manila",
    npsScore: 84, slaCompliance: 97.8, slaTarget: 98,
    contractStart: "Jul 1, 2025", contractEnd: "Jun 30, 2027", rateAgreement: "Per-Pick + Storage (Volume)", renewalDate: "May 1, 2027",
    revenueTrend: [88000, 95000, 100000, 108000, 115000, 120000],
    storageUsageTrend: [150, 160, 170, 180, 190, 200],
    communications: [
      { type: "phone", date: "Mar 18, 2026", summary: "Discussed 3.15 sale aftermath and restocking timeline" },
      { type: "visit", date: "Mar 12, 2026", summary: "Warehouse walkthrough for new racking installation" },
      { type: "email", date: "Mar 05, 2026", summary: "SLA performance review for February operations" },
    ],
    orderHistory: [
      { id: "ORD-2405", date: "Mar 20, 2026", items: 128, status: "In Progress", value: 18500 },
      { id: "ORD-2392", date: "Mar 16, 2026", items: 95, status: "Completed", value: 14200 },
      { id: "ORD-2378", date: "Mar 12, 2026", items: 110, status: "Completed", value: 16800 },
      { id: "ORD-2360", date: "Mar 08, 2026", items: 87, status: "Completed", value: 12400 },
    ],
  },
  {
    id: 4, name: "7-Eleven Distribution", type: "FMCG", typeBadgeColor: "#DC2626", typeBadgeBg: "#FEF2F2",
    activeOrders: 6, monthlyRevenue: 45000, storageArea: "60 sqm", lastOrderDate: "Mar 16, 2026",
    contactPerson: "Rachel Tan", contactEmail: "rachel.tan@example.com", contactPhone: "+63 920 555 3456",
    address: "7-Eleven Philippines HQ, Mandaluyong City",
    npsScore: 58, slaCompliance: 96.5, slaTarget: 98,
    contractStart: "Oct 1, 2025", contractEnd: "Sep 30, 2026", rateAgreement: "Fixed Monthly + Overages", renewalDate: "Aug 1, 2026",
    revenueTrend: [42000, 43000, 44000, 44500, 45000, 45000],
    storageUsageTrend: [55, 56, 58, 58, 60, 60],
    communications: [
      { type: "email", date: "Mar 12, 2026", summary: "Sent weekly inventory accuracy report (96.5%)" },
      { type: "phone", date: "Mar 05, 2026", summary: "Issue escalation: delayed outbound for 3 orders" },
      { type: "email", date: "Feb 27, 2026", summary: "New product onboarding checklist shared" },
    ],
    orderHistory: [
      { id: "ORD-2395", date: "Mar 16, 2026", items: 40, status: "In Progress", value: 6800 },
      { id: "ORD-2374", date: "Mar 11, 2026", items: 35, status: "Completed", value: 5900 },
      { id: "ORD-2358", date: "Mar 05, 2026", items: 42, status: "Completed", value: 7200 },
    ],
  },
  {
    id: 5, name: "Robinsons Cebu", type: "Retail", typeBadgeColor: "#2563EB", typeBadgeBg: "#EFF6FF",
    activeOrders: 4, monthlyRevenue: 38000, storageArea: "50 sqm", lastOrderDate: "Mar 14, 2026",
    contactPerson: "Sofia Mendoza", contactEmail: "sofia.mendoza@example.com", contactPhone: "+63 921 555 7890",
    address: "Robinsons Galleria Cebu, Cebu City",
    npsScore: 70, slaCompliance: 99.0, slaTarget: 98,
    contractStart: "Mar 1, 2025", contractEnd: "Feb 28, 2027", rateAgreement: "Fixed Rate (Regional)", renewalDate: "Jan 1, 2027",
    revenueTrend: [32000, 33000, 35000, 36000, 37000, 38000],
    storageUsageTrend: [42, 44, 45, 47, 48, 50],
    communications: [
      { type: "visit", date: "Mar 10, 2026", summary: "Cebu warehouse inspection and capacity review" },
      { type: "email", date: "Mar 03, 2026", summary: "Monthly storage utilization report shared" },
      { type: "phone", date: "Feb 20, 2026", summary: "Discussed potential expansion of storage area" },
    ],
    orderHistory: [
      { id: "ORD-2388", date: "Mar 14, 2026", items: 22, status: "In Progress", value: 5400 },
      { id: "ORD-2370", date: "Mar 08, 2026", items: 18, status: "Completed", value: 4200 },
    ],
  },
  {
    id: 6, name: "Shopee Hub", type: "E-commerce", typeBadgeColor: "#D97706", typeBadgeBg: "#FFFBEB",
    activeOrders: 10, monthlyRevenue: 95000, storageArea: "160 sqm", lastOrderDate: "Mar 19, 2026",
    contactPerson: "David Ong", contactEmail: "david.ong@shopee.ph", contactPhone: "+63 922 555 2345",
    address: "Shopee Philippines, BGC, Taguig City",
    npsScore: 78, slaCompliance: 98.8, slaTarget: 98,
    contractStart: "Jun 1, 2025", contractEnd: "May 31, 2027", rateAgreement: "Per-Pick + Storage (Tiered)", renewalDate: "Apr 1, 2027",
    revenueTrend: [70000, 75000, 80000, 85000, 90000, 95000],
    storageUsageTrend: [120, 130, 138, 145, 152, 160],
    communications: [
      { type: "email", date: "Mar 17, 2026", summary: "Submitted pick-and-pack accuracy report (99.5%)" },
      { type: "phone", date: "Mar 11, 2026", summary: "Planned staffing increase for April sale event" },
      { type: "visit", date: "Mar 01, 2026", summary: "Joint operations review and process optimization" },
    ],
    orderHistory: [
      { id: "ORD-2402", date: "Mar 19, 2026", items: 85, status: "In Progress", value: 13200 },
      { id: "ORD-2386", date: "Mar 15, 2026", items: 72, status: "Completed", value: 11400 },
      { id: "ORD-2368", date: "Mar 10, 2026", items: 90, status: "Completed", value: 14800 },
      { id: "ORD-2350", date: "Mar 05, 2026", items: 65, status: "Completed", value: 10200 },
    ],
  },
];

const formatCurrency = (value: number) =>
  `\u20B1${value.toLocaleString("en-PH")}`;

const MONTHS = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];

function MiniSparkline({ data, color = "#059669" }: { data: number[]; color?: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 120;
  const height = 32;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg width={width} height={height} style={{ display: "block" }}>
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {data.map((v, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((v - min) / range) * (height - 4) - 2;
        return <circle key={i} cx={x} cy={y} r="2" fill={color} />;
      })}
    </svg>
  );
}

function NPSBadge({ score }: { score: number }) {
  const color = score >= 70 ? "#059669" : score >= 50 ? "#D97706" : "#DC2626";
  const bg = score >= 70 ? "#D1FAE5" : score >= 50 ? "#FEF3C7" : "#FEE2E2";
  const label = score >= 70 ? "Promoter" : score >= 50 ? "Passive" : "Detractor";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <span style={{ fontSize: 20, fontWeight: 800, color }}>{score}</span>
      <span style={{ fontSize: 10, fontWeight: 700, color, background: bg, padding: "2px 8px", borderRadius: 6 }}>{label}</span>
    </div>
  );
}

function SLABar({ compliance, target }: { compliance: number; target: number }) {
  const met = compliance >= target;
  const color = met ? "#059669" : "#DC2626";
  const bg = met ? "#D1FAE5" : "#FEE2E2";
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <span style={{ fontSize: 11, color: "#6B7280" }}>On-Time Fulfillment</span>
        <span style={{ fontSize: 12, fontWeight: 700, color }}>{compliance}%</span>
      </div>
      <div style={{ height: 8, background: "#F3F4F6", borderRadius: 4, overflow: "hidden", position: "relative" }}>
        <div style={{ width: `${compliance}%`, height: "100%", background: color, borderRadius: 4, transition: "width 0.3s" }} />
        {/* Target marker */}
        <div style={{
          position: "absolute", top: -2, left: `${target}%`, width: 2, height: 12,
          background: "#374151", borderRadius: 1,
        }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
        <span style={{ fontSize: 9, color: "#9CA3AF" }}>Target: {target}%</span>
        <span style={{ fontSize: 9, fontWeight: 600, color, background: bg, padding: "1px 6px", borderRadius: 4 }}>
          {met ? "SLA Met" : "Below SLA"}
        </span>
      </div>
    </div>
  );
}

export default function ClientsPage() {
  const [search, setSearch] = useState("");
  const [expandedClient, setExpandedClient] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const filtered = clients.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.type.toLowerCase().includes(search.toLowerCase())
  );

  const totalRevenue = clients.reduce((sum, c) => sum + c.monthlyRevenue, 0);
  const totalOrders = clients.reduce((sum, c) => sum + c.activeOrders, 0);
  const avgNPS = Math.round(clients.reduce((sum, c) => sum + c.npsScore, 0) / clients.length);

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <Users size={22} color={ACCENT} />
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: 0 }}>
              Client Portal
            </h1>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            style={{
              padding: "9px 20px", borderRadius: 10, border: "none", cursor: "pointer",
              background: ACCENT, color: "#fff", fontSize: 13, fontWeight: 700,
              display: "flex", alignItems: "center", gap: 6,
              boxShadow: "0 2px 8px rgba(124,58,237,0.18)",
            }}
          >
            <Plus size={15} /> Add New Client
          </button>
        </div>
        <p style={{ fontSize: 14, color: "#6B7280", margin: 0 }}>
          Manage warehouse clients, contracts, and performance
        </p>
      </div>

      {/* Add New Client Modal */}
      {showAddModal && (
        <div
          style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
          }}
          onClick={() => setShowAddModal(false)}
        >
          <div onClick={(e) => e.stopPropagation()} style={{
            background: "#fff", borderRadius: 16, padding: "28px 32px", width: 520, maxWidth: "90vw",
            boxShadow: "0 20px 60px rgba(0,0,0,0.2)", maxHeight: "90vh", overflowY: "auto",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "#111827", margin: 0 }}>Add New Client</h2>
              <button onClick={() => setShowAddModal(false)} style={{ border: "none", background: "transparent", cursor: "pointer", padding: 4 }}>
                <X size={20} color="#6B7280" />
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { label: "Company Name", placeholder: "e.g. Puregold Price Club" },
                { label: "Client Type", placeholder: "e.g. Retail, Pharma, E-commerce, FMCG" },
                { label: "Contact Person", placeholder: "Full name" },
                { label: "Email Address", placeholder: "email@company.com" },
                { label: "Phone Number", placeholder: "+63 9XX XXX XXXX" },
                { label: "Business Address", placeholder: "Full address" },
              ].map((field) => (
                <div key={field.label}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>{field.label}</label>
                  <input
                    type="text"
                    placeholder={field.placeholder}
                    style={{
                      width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #E5E7EB",
                      fontSize: 13, boxSizing: "border-box", outline: "none",
                    }}
                  />
                </div>
              ))}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>Contract Start</label>
                  <input type="date" style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 13, boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>Contract End</label>
                  <input type="date" style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 13, boxSizing: "border-box" }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>Rate Agreement</label>
                <select style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 13, boxSizing: "border-box", background: "#fff" }}>
                  <option>Fixed Monthly</option>
                  <option>Per-Pick + Storage</option>
                  <option>Tiered (Volume Discount)</option>
                  <option>Fixed Rate (Regional)</option>
                  <option>Custom</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>Allocated Storage Area (sqm)</label>
                <input type="number" placeholder="e.g. 100" style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 13, boxSizing: "border-box" }} />
              </div>
              <button
                style={{
                  width: "100%", padding: "11px 0", borderRadius: 8, border: "none",
                  background: ACCENT, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer",
                  marginTop: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                }}
              >
                <CheckCircle size={16} /> Create Client
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Total Monthly Revenue", value: formatCurrency(totalRevenue), icon: TrendingUp, color: "#059669", bg: "#ECFDF5" },
          { label: "Active Clients", value: clients.length.toString(), icon: Users, color: ACCENT, bg: "#F5F3FF" },
          { label: "Total Active Orders", value: totalOrders.toString(), icon: Package, color: "#2563EB", bg: "#EFF6FF" },
          { label: "Average NPS Score", value: avgNPS.toString(), icon: Star, color: "#D97706", bg: "#FFFBEB" },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              style={{
                background: "#FFFFFF",
                borderRadius: 12,
                padding: "18px 20px",
                border: "1px solid #E5E7EB",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: 0.5 }}>
                  {card.label}
                </span>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: card.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={16} color={card.color} />
                </div>
              </div>
              <div style={{ fontSize: 26, fontWeight: 700, color: "#111827" }}>{card.value}</div>
            </div>
          );
        })}
      </div>

      {/* Search */}
      <div style={{ marginBottom: 20 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "#FFFFFF",
            border: "1px solid #E5E7EB",
            borderRadius: 10,
            padding: "8px 14px",
            maxWidth: 400,
          }}
        >
          <Search size={16} color="#9CA3AF" />
          <input
            type="text"
            placeholder="Search by client name or type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              fontSize: 14,
              color: "#111827",
              background: "transparent",
            }}
          />
        </div>
      </div>

      {/* Client cards list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: 40, color: "#9CA3AF", fontSize: 14 }}>
            No clients found matching your search.
          </div>
        )}
        {filtered.map((client) => {
          const isExpanded = expandedClient === client.id;
          return (
            <div
              key={client.id}
              style={{
                background: "#FFFFFF",
                borderRadius: 12,
                border: isExpanded ? `1.5px solid ${ACCENT}` : "1px solid #E5E7EB",
                overflow: "hidden",
                transition: "border-color .15s",
              }}
            >
              {/* Main card row */}
              <div
                onClick={() => setExpandedClient(isExpanded ? null : client.id)}
                style={{
                  padding: "20px 22px",
                  cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 14, flex: 1, minWidth: 0 }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: 10, background: `${ACCENT}10`,
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    <ShoppingBag size={20} color={ACCENT} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: 0 }}>{client.name}</h3>
                      <span style={{
                        fontSize: 11, fontWeight: 600, color: client.typeBadgeColor,
                        background: client.typeBadgeBg, padding: "2px 10px", borderRadius: 10,
                      }}>
                        {client.type}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: "#6B7280" }}>
                      {client.activeOrders} active orders &middot; {formatCurrency(client.monthlyRevenue)}/mo &middot; {client.storageArea}
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
                  <NPSBadge score={client.npsScore} />
                  <ChevronDown size={18} color="#9CA3AF" style={{ transform: isExpanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                </div>
              </div>

              {/* Expanded detail view */}
              {isExpanded && (
                <div style={{
                  padding: "0 22px 22px", borderTop: "1px solid #F3F4F6",
                }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, paddingTop: 20 }}>
                    {/* Contact Details */}
                    <div style={{
                      background: "#F9FAFB", borderRadius: 10, padding: "16px 18px",
                    }}>
                      <h4 style={{ fontSize: 13, fontWeight: 700, color: "#111827", margin: "0 0 12px" }}>Contact Details</h4>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <Users size={13} color="#6B7280" />
                          <span style={{ fontSize: 12, color: "#374151", fontWeight: 600 }}>{client.contactPerson}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <Mail size={13} color="#6B7280" />
                          <span style={{ fontSize: 12, color: "#2563EB" }}>{client.contactEmail}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <Phone size={13} color="#6B7280" />
                          <span style={{ fontSize: 12, color: "#374151" }}>{client.contactPhone}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                          <MapPin size={13} color="#6B7280" style={{ flexShrink: 0, marginTop: 1 }} />
                          <span style={{ fontSize: 12, color: "#374151" }}>{client.address}</span>
                        </div>
                      </div>
                    </div>

                    {/* Contract Details */}
                    <div style={{
                      background: "#F9FAFB", borderRadius: 10, padding: "16px 18px",
                    }}>
                      <h4 style={{ fontSize: 13, fontWeight: 700, color: "#111827", margin: "0 0 12px" }}>Contract Details</h4>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <div>
                          <div style={{ fontSize: 10, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 0.5 }}>Period</div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>{client.contractStart} - {client.contractEnd}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: 10, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 0.5 }}>Rate Agreement</div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>{client.rateAgreement}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: 10, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 0.5 }}>Renewal Date</div>
                          <div style={{
                            fontSize: 12, fontWeight: 700, color: "#D97706",
                            display: "flex", alignItems: "center", gap: 4,
                          }}>
                            <Calendar size={12} /> {client.renewalDate}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* SLA Tracking */}
                    <div style={{
                      background: "#F9FAFB", borderRadius: 10, padding: "16px 18px",
                    }}>
                      <h4 style={{ fontSize: 13, fontWeight: 700, color: "#111827", margin: "0 0 12px" }}>SLA Performance</h4>
                      <SLABar compliance={client.slaCompliance} target={client.slaTarget} />
                      <div style={{ marginTop: 14 }}>
                        <div style={{ fontSize: 10, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>Client Satisfaction (NPS)</div>
                        <NPSBadge score={client.npsScore} />
                      </div>
                    </div>
                  </div>

                  {/* Revenue trend + Storage usage */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
                    <div style={{ background: "#F9FAFB", borderRadius: 10, padding: "16px 18px" }}>
                      <h4 style={{ fontSize: 13, fontWeight: 700, color: "#111827", margin: "0 0 10px" }}>Revenue Trend (6 Months)</h4>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <MiniSparkline data={client.revenueTrend} color="#059669" />
                        <div>
                          <div style={{ fontSize: 16, fontWeight: 800, color: "#059669" }}>{formatCurrency(client.revenueTrend[5])}</div>
                          <div style={{ fontSize: 10, color: "#6B7280" }}>
                            {client.revenueTrend[5] > client.revenueTrend[0]
                              ? `+${Math.round(((client.revenueTrend[5] - client.revenueTrend[0]) / client.revenueTrend[0]) * 100)}%`
                              : "Flat"
                            } vs 6mo ago
                          </div>
                        </div>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                        {MONTHS.map((m, i) => (
                          <span key={m} style={{ fontSize: 9, color: "#9CA3AF" }}>{m}</span>
                        ))}
                      </div>
                    </div>

                    <div style={{ background: "#F9FAFB", borderRadius: 10, padding: "16px 18px" }}>
                      <h4 style={{ fontSize: 13, fontWeight: 700, color: "#111827", margin: "0 0 10px" }}>Storage Usage Trend (6 Months)</h4>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <MiniSparkline data={client.storageUsageTrend} color={ACCENT} />
                        <div>
                          <div style={{ fontSize: 16, fontWeight: 800, color: ACCENT }}>{client.storageUsageTrend[5]} sqm</div>
                          <div style={{ fontSize: 10, color: "#6B7280" }}>
                            {client.storageUsageTrend[5] > client.storageUsageTrend[0]
                              ? `+${client.storageUsageTrend[5] - client.storageUsageTrend[0]} sqm`
                              : "Stable"
                            } growth
                          </div>
                        </div>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                        {MONTHS.map((m) => (
                          <span key={m} style={{ fontSize: 9, color: "#9CA3AF" }}>{m}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Communication Log + Order History */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
                    {/* Communication Log */}
                    <div style={{ background: "#F9FAFB", borderRadius: 10, padding: "16px 18px" }}>
                      <h4 style={{ fontSize: 13, fontWeight: 700, color: "#111827", margin: "0 0 12px" }}>Communication Log</h4>
                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {client.communications.map((comm, idx) => (
                          <div key={idx} style={{
                            display: "flex", gap: 10, paddingBottom: idx < client.communications.length - 1 ? 10 : 0,
                            borderBottom: idx < client.communications.length - 1 ? "1px solid #E5E7EB" : "none",
                          }}>
                            <div style={{
                              width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                              background: comm.type === "email" ? "#EFF6FF" : comm.type === "phone" ? "#ECFDF5" : "#FEF3C7",
                              display: "flex", alignItems: "center", justifyContent: "center",
                            }}>
                              {comm.type === "email" && <Mail size={13} color="#2563EB" />}
                              {comm.type === "phone" && <Phone size={13} color="#059669" />}
                              {comm.type === "visit" && <MapPin size={13} color="#D97706" />}
                            </div>
                            <div>
                              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <span style={{
                                  fontSize: 10, fontWeight: 700, textTransform: "uppercase",
                                  color: comm.type === "email" ? "#2563EB" : comm.type === "phone" ? "#059669" : "#D97706",
                                }}>
                                  {comm.type === "visit" ? "Site Visit" : comm.type}
                                </span>
                                <span style={{ fontSize: 10, color: "#9CA3AF" }}>{comm.date}</span>
                              </div>
                              <div style={{ fontSize: 12, color: "#374151", marginTop: 2 }}>{comm.summary}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order History */}
                    <div style={{ background: "#F9FAFB", borderRadius: 10, padding: "16px 18px" }}>
                      <h4 style={{ fontSize: 13, fontWeight: 700, color: "#111827", margin: "0 0 12px" }}>Recent Orders</h4>
                      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                        {client.orderHistory.map((order, idx) => (
                          <div key={order.id} style={{
                            display: "flex", justifyContent: "space-between", alignItems: "center",
                            padding: "8px 0",
                            borderBottom: idx < client.orderHistory.length - 1 ? "1px solid #E5E7EB" : "none",
                          }}>
                            <div>
                              <div style={{ fontSize: 12, fontWeight: 600, color: "#111827" }}>{order.id}</div>
                              <div style={{ fontSize: 10, color: "#6B7280" }}>{order.date} &middot; {order.items} items</div>
                            </div>
                            <div style={{ textAlign: "right" }}>
                              <div style={{ fontSize: 12, fontWeight: 700, color: "#059669" }}>{formatCurrency(order.value)}</div>
                              <span style={{
                                fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 6,
                                background: order.status === "Completed" ? "#D1FAE5" : order.status === "In Progress" ? "#FEF3C7" : "#F3F4F6",
                                color: order.status === "Completed" ? "#065F46" : order.status === "In Progress" ? "#92400E" : "#6B7280",
                              }}>
                                {order.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
