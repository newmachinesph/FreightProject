"use client";
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { ArrowLeft, Check } from "lucide-react";
import { vehicleTypes, bodyTypes, fuelTypes } from "@/lib/mock-data";

export default function AddVehiclePage() {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    type: "", plateNo: "", capacityKg: "", capacityCbm: "", bodyType: "",
    ltoOR: "", ltoCR: "", orcrExpiry: "", ltfrbFranchise: "",
    yearModel: "", make: "", fuelType: "diesel", gpsDeviceId: "", reefer: false,
  });

  const update = (key: string, value: string | boolean) => setForm((f) => ({ ...f, [key]: value }));

  const handleSave = () => {
    if (!form.type || !form.plateNo || !form.capacityKg || !form.capacityCbm || !form.bodyType) {
      alert("Please fill in all required fields.");
      return;
    }
    setSaved(true);
    setTimeout(() => { window.location.href = "/dashboard/fleet"; }, 1500);
  };

  return (
    <DashboardLayout>
      <div style={{ marginBottom: 24 }}>
        <a href="/dashboard/fleet" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "#6B7280", textDecoration: "none", marginBottom: 8 }}>
          <ArrowLeft size={14} /> Back to Fleet
        </a>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111827", margin: 0 }}>Add New Vehicle</h1>
        <p style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}>Register a new vehicle to your fleet</p>
      </div>

      {saved && (
        <div style={{ background: "#ECFDF5", border: "1px solid #A7F3D0", borderRadius: 8, padding: "12px 20px", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
          <Check size={16} color="#059669" />
          <span style={{ fontSize: 14, color: "#059669", fontWeight: 600 }}>Vehicle added successfully! Redirecting...</span>
        </div>
      )}

      <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 12, padding: 32, maxWidth: 800 }}>
        {/* Basic Info */}
        <h2 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: "0 0 16px 0" }}>Vehicle Information</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
          <Field label="Vehicle Type *">
            <select value={form.type} onChange={(e) => update("type", e.target.value)} style={selectStyle}>
              <option value="">Select type...</option>
              {vehicleTypes.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Plate Number *">
            <input value={form.plateNo} onChange={(e) => update("plateNo", e.target.value)} placeholder="e.g. ABC 1234" style={inputStyle} />
          </Field>
          <Field label="Payload Capacity (kg) *">
            <input type="number" value={form.capacityKg} onChange={(e) => update("capacityKg", e.target.value)} placeholder="e.g. 5000" style={inputStyle} />
          </Field>
          <Field label="Payload Capacity (CBM) *">
            <input type="number" value={form.capacityCbm} onChange={(e) => update("capacityCbm", e.target.value)} placeholder="e.g. 20" style={inputStyle} />
          </Field>
          <Field label="Body Type *">
            <select value={form.bodyType} onChange={(e) => update("bodyType", e.target.value)} style={selectStyle}>
              <option value="">Select body type...</option>
              {bodyTypes.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </Field>
          <Field label="Year Model">
            <input type="number" value={form.yearModel} onChange={(e) => update("yearModel", e.target.value)} placeholder="e.g. 2023" style={inputStyle} />
          </Field>
          <Field label="Make / Brand">
            <input value={form.make} onChange={(e) => update("make", e.target.value)} placeholder="e.g. Isuzu" style={inputStyle} />
          </Field>
          <Field label="Fuel Type">
            <select value={form.fuelType} onChange={(e) => update("fuelType", e.target.value)} style={selectStyle}>
              {fuelTypes.map((f) => <option key={f} value={f}>{f.charAt(0).toUpperCase() + f.slice(1)}</option>)}
            </select>
          </Field>
        </div>

        {/* Registration */}
        <h2 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: "0 0 16px 0" }}>Registration &amp; Compliance</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
          <Field label="LTO OR Number">
            <input value={form.ltoOR} onChange={(e) => update("ltoOR", e.target.value)} placeholder="e.g. OR-2026-NCR-001234" style={inputStyle} />
          </Field>
          <Field label="LTO CR Number">
            <input value={form.ltoCR} onChange={(e) => update("ltoCR", e.target.value)} placeholder="e.g. CR-2026-NCR-001234" style={inputStyle} />
          </Field>
          <Field label="OR/CR Expiry Date">
            <input type="date" value={form.orcrExpiry} onChange={(e) => update("orcrExpiry", e.target.value)} style={inputStyle} />
          </Field>
          <Field label="LTFRB Franchise No">
            <input value={form.ltfrbFranchise} onChange={(e) => update("ltfrbFranchise", e.target.value)} placeholder="e.g. LTFRB-NCR-2024-00112" style={inputStyle} />
          </Field>
        </div>

        {/* Tracking */}
        <h2 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: "0 0 16px 0" }}>Tracking &amp; Features</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
          <Field label="GPS Device ID">
            <input value={form.gpsDeviceId} onChange={(e) => update("gpsDeviceId", e.target.value)} placeholder="e.g. GPS-001" style={inputStyle} />
          </Field>
          <Field label="Reefer Capable">
            <div style={{ display: "flex", alignItems: "center", gap: 8, paddingTop: 4 }}>
              <button onClick={() => update("reefer", !form.reefer)} style={{
                width: 44, height: 24, borderRadius: 12, border: "none", cursor: "pointer",
                background: form.reefer ? "#2563EB" : "#D1D5DB", position: "relative", transition: "background 0.2s",
              }}>
                <div style={{
                  width: 18, height: 18, borderRadius: "50%", background: "#FFFFFF",
                  position: "absolute", top: 3, left: form.reefer ? 23 : 3, transition: "left 0.2s",
                }} />
              </button>
              <span style={{ fontSize: 13, color: "#4B5563" }}>{form.reefer ? "Yes" : "No"}</span>
            </div>
          </Field>
        </div>

        <div style={{ display: "flex", gap: 12, paddingTop: 16, borderTop: "1px solid #E5E7EB" }}>
          <button onClick={handleSave} style={{
            padding: "12px 32px", borderRadius: 8, border: "none", background: "#2563EB",
            color: "#FFFFFF", fontSize: 14, fontWeight: 600, cursor: "pointer",
          }}>
            Save Vehicle
          </button>
          <a href="/dashboard/fleet" style={{
            padding: "12px 32px", borderRadius: 8, border: "1px solid #E5E7EB",
            background: "#FFFFFF", color: "#4B5563", fontSize: 14, fontWeight: 600,
            textDecoration: "none", display: "inline-flex", alignItems: "center",
          }}>
            Cancel
          </a>
        </div>
      </div>
    </DashboardLayout>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #E5E7EB",
  fontSize: 13, outline: "none", boxSizing: "border-box",
};

const selectStyle: React.CSSProperties = {
  ...inputStyle, background: "#FFFFFF", cursor: "pointer",
};
