"use client";
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import Link from "next/link";
import {
  FileText,
  Plus,
  Pencil,
  Trash2,
  Truck,
  Snowflake,
  ArrowRight,
  Calendar,
  Weight,
  Package,
} from "lucide-react";

// ─── Types ───

interface LoadTemplate {
  id: number;
  name: string;
  origin: string;
  destination: string;
  vehicleType: string;
  vehicleIcon: "truck" | "reefer";
  weight: number;
  cargoType: string;
  rate: number;
  lastUsed: string;
}

// ─── Mock Data ───

const initialTemplates: LoadTemplate[] = [
  {
    id: 1,
    name: "Manila \u2192 Cebu FMCG Weekly",
    origin: "Manila",
    destination: "Cebu",
    vehicleType: "10-Wheeler Wing Van",
    vehicleIcon: "truck",
    weight: 18000,
    cargoType: "FMCG",
    rate: 85000,
    lastUsed: "Mar 15, 2026",
  },
  {
    id: 2,
    name: "Clark \u2192 Subic Electronics",
    origin: "Clark",
    destination: "Subic",
    vehicleType: "4-Wheeler Closed Van",
    vehicleIcon: "truck",
    weight: 2800,
    cargoType: "Electronics",
    rate: 18000,
    lastUsed: "Mar 12, 2026",
  },
  {
    id: 3,
    name: "Manila \u2192 Baguio Garments",
    origin: "Manila",
    destination: "Baguio",
    vehicleType: "6-Wheeler Closed Van",
    vehicleIcon: "truck",
    weight: 6500,
    cargoType: "Garments",
    rate: 32000,
    lastUsed: "Mar 8, 2026",
  },
  {
    id: 4,
    name: "Davao \u2192 GenSan Seafood",
    origin: "Davao",
    destination: "General Santos",
    vehicleType: "Reefer Van",
    vehicleIcon: "reefer",
    weight: 10000,
    cargoType: "Frozen Seafood",
    rate: 45000,
    lastUsed: "Mar 5, 2026",
  },
];

// ─── Component ───

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<LoadTemplate[]>(initialTemplates);

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this template?")) {
      setTemplates((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const VehicleIcon = ({ type }: { type: "truck" | "reefer" }) => {
    if (type === "reefer") return <Snowflake size={18} color="#2563EB" />;
    return <Truck size={18} color="#2563EB" />;
  };

  return (
    <DashboardLayout activeNav="/dashboard/templates">
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111827", margin: 0 }}>Load Templates</h1>
          <p style={{ fontSize: 13, color: "#6B7280", margin: "4px 0 0" }}>
            Save and reuse common shipment configurations
          </p>
        </div>
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "#2563EB",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "10px 18px",
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          <Plus size={16} /> Create Template
        </button>
      </div>

      {/* Template Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 16 }}>
        {templates.map((t) => (
          <div
            key={t.id}
            style={{
              background: "#fff",
              borderRadius: 12,
              border: "1px solid #E5E7EB",
              padding: 20,
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            {/* Template name + badge */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: "#EFF6FF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  <FileText size={20} color="#2563EB" />
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: "#9CA3AF", display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                    <Calendar size={11} /> Last used: {t.lastUsed}
                  </div>
                </div>
              </div>
            </div>

            {/* Details grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {/* Route */}
              <div style={{ background: "#F9FAFB", borderRadius: 8, padding: "10px 12px" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>Route</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>
                  {t.origin} <ArrowRight size={11} style={{ verticalAlign: "middle", margin: "0 2px" }} /> {t.destination}
                </div>
              </div>

              {/* Vehicle */}
              <div style={{ background: "#F9FAFB", borderRadius: 8, padding: "10px 12px" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>Vehicle</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", display: "flex", alignItems: "center", gap: 4 }}>
                  <VehicleIcon type={t.vehicleIcon} /> {t.vehicleType}
                </div>
              </div>

              {/* Weight */}
              <div style={{ background: "#F9FAFB", borderRadius: 8, padding: "10px 12px" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>Weight</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", display: "flex", alignItems: "center", gap: 4 }}>
                  <Weight size={13} color="#6B7280" /> {t.weight.toLocaleString()} kg
                </div>
              </div>

              {/* Cargo */}
              <div style={{ background: "#F9FAFB", borderRadius: 8, padding: "10px 12px" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>Cargo</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", display: "flex", alignItems: "center", gap: 4 }}>
                  <Package size={13} color="#6B7280" /> {t.cargoType}
                </div>
              </div>
            </div>

            {/* Rate */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderTop: "1px solid #F3F4F6" }}>
              <div>
                <span style={{ fontSize: 11, color: "#9CA3AF" }}>Rate: </span>
                <span style={{ fontSize: 16, fontWeight: 800, color: "#2563EB" }}>{"\u20B1"}{t.rate.toLocaleString()}</span>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 8 }}>
              <Link
                href={`/dashboard/loads/new?template=${t.id}`}
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  background: "#2563EB",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "10px 14px",
                  fontSize: 13,
                  fontWeight: 700,
                  textDecoration: "none",
                  cursor: "pointer",
                }}
              >
                <Plus size={14} /> Use Template
              </Link>
              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#F9FAFB",
                  border: "1px solid #E5E7EB",
                  borderRadius: 8,
                  padding: "10px 12px",
                  cursor: "pointer",
                }}
                title="Edit template"
              >
                <Pencil size={14} color="#6B7280" />
              </button>
              <button
                onClick={() => handleDelete(t.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#FEF2F2",
                  border: "1px solid #FECACA",
                  borderRadius: 8,
                  padding: "10px 12px",
                  cursor: "pointer",
                }}
                title="Delete template"
              >
                <Trash2 size={14} color="#DC2626" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
