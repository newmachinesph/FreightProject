"use client";
import { useState } from "react";
import { Thermometer, MapPin, AlertTriangle, Box, Layers, ArrowRightLeft } from "lucide-react";
import { storageZones, inventoryItems } from "@/lib/mock-data";

const typeColor: Record<string, { bg: string; color: string; border: string }> = {
  Dry:            { bg: "#FEF3C7", color: "#92400E", border: "#FDE68A" },
  Cold:           { bg: "#DBEAFE", color: "#1E40AF", border: "#93C5FD" },
  Hazmat:         { bg: "#FEE2E2", color: "#991B1B", border: "#FECACA" },
  Staging:        { bg: "#F3E8FF", color: "#6B21A8", border: "#D8B4FE" },
  Pharmaceutical: { bg: "#ECFDF5", color: "#065F46", border: "#A7F3D0" },
};

// Map grid colors per zone type
const zoneMapColors: Record<string, { fill: string; text: string }> = {
  Dry:            { fill: "#FEF3C7", text: "#92400E" },
  Cold:           { fill: "#DBEAFE", text: "#1E40AF" },
  Hazmat:         { fill: "#FEE2E2", text: "#991B1B" },
  Staging:        { fill: "#F3E8FF", text: "#6B21A8" },
  Pharmaceutical: { fill: "#ECFDF5", text: "#065F46" },
};

// Temperature thresholds for warnings
function getTempStatus(zone: typeof storageZones[0]): { ok: boolean; label: string; color: string; bg: string } {
  if (zone.type !== "Cold" && zone.type !== "Pharmaceutical") {
    return { ok: true, label: "N/A", color: "#6B7280", bg: "#F9FAFB" };
  }
  // Parse current temp
  const currentStr = zone.currentTemp || "";
  const currentNum = parseFloat(currentStr.replace(/[^\d.-]/g, ""));
  // Simple check based on zone type
  if (zone.type === "Cold") {
    if (currentNum >= -18 && currentNum <= 4) return { ok: true, label: "In Range", color: "#059669", bg: "#D1FAE5" };
    return { ok: false, label: "OUT OF RANGE", color: "#DC2626", bg: "#FEE2E2" };
  }
  if (zone.type === "Pharmaceutical") {
    if (currentNum >= 2 && currentNum <= 8) return { ok: true, label: "In Range", color: "#059669", bg: "#D1FAE5" };
    return { ok: false, label: "OUT OF RANGE", color: "#DC2626", bg: "#FEE2E2" };
  }
  return { ok: true, label: "OK", color: "#059669", bg: "#D1FAE5" };
}

function getCapacityColor(pct: number): string {
  if (pct >= 85) return "#DC2626";
  if (pct >= 70) return "#D97706";
  return "#059669";
}

export default function StorageZonesPage() {
  const [transferFrom, setTransferFrom] = useState("");
  const [transferTo, setTransferTo] = useState("");
  const [showTransfer, setShowTransfer] = useState(false);

  const totalArea = storageZones.reduce((sum, z) => sum + z.area, 0);
  const totalUsed = storageZones.reduce((sum, z) => sum + z.usedArea, 0);
  const totalShelves = storageZones.reduce((sum, z) => sum + z.shelves, 0);
  const overallPct = Math.round((totalUsed / totalArea) * 100);

  return (
    <>
      <header style={{ ...s.header, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 style={s.pageTitle}>Storage Zones</h1>
          <p style={s.pageSubtitle}>Visual overview of warehouse zones, capacity, and temperature monitoring</p>
        </div>
        <button
          onClick={() => setShowTransfer(!showTransfer)}
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "10px 18px", borderRadius: 8, border: "none",
            background: "#7C3AED", color: "#fff", fontSize: 14, fontWeight: 600,
            cursor: "pointer",
          }}
        >
          <ArrowRightLeft size={16} /> Transfer Stock
        </button>
      </header>

      {/* Transfer Stock Panel */}
      {showTransfer && (
        <div style={{ ...s.card, background: "#F5F3FF", borderColor: "#DDD6FE" }}>
          <h3 style={{ ...s.cardTitle, color: "#6D28D9", display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <ArrowRightLeft size={16} /> Transfer Stock Between Zones
          </h3>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-end", flexWrap: "wrap" }}>
            <div>
              <label style={{ display: "block", fontSize: 11, color: "#6D28D9", fontWeight: 600, marginBottom: 4 }}>From Zone</label>
              <select
                value={transferFrom}
                onChange={(e) => setTransferFrom(e.target.value)}
                style={{ padding: "8px 12px", border: "1px solid #DDD6FE", borderRadius: 8, fontSize: 13, minWidth: 180 }}
              >
                <option value="">Select zone...</option>
                {storageZones.map(z => <option key={z.id} value={z.name}>{z.name}</option>)}
              </select>
            </div>
            <div style={{ fontSize: 18, color: "#7C3AED", fontWeight: 700, paddingBottom: 8 }}>&rarr;</div>
            <div>
              <label style={{ display: "block", fontSize: 11, color: "#6D28D9", fontWeight: 600, marginBottom: 4 }}>To Zone</label>
              <select
                value={transferTo}
                onChange={(e) => setTransferTo(e.target.value)}
                style={{ padding: "8px 12px", border: "1px solid #DDD6FE", borderRadius: 8, fontSize: 13, minWidth: 180 }}
              >
                <option value="">Select zone...</option>
                {storageZones.filter(z => z.name !== transferFrom).map(z => <option key={z.id} value={z.name}>{z.name}</option>)}
              </select>
            </div>
            <button
              onClick={() => {
                if (transferFrom && transferTo) {
                  alert(`Transfer initiated: ${transferFrom} \u2192 ${transferTo}\nPlease select items to transfer on the next screen.`);
                }
              }}
              style={{
                padding: "8px 18px", borderRadius: 8, border: "none",
                background: transferFrom && transferTo ? "#7C3AED" : "#D1D5DB",
                color: "#fff", fontSize: 13, fontWeight: 600, cursor: transferFrom && transferTo ? "pointer" : "not-allowed",
              }}
              disabled={!transferFrom || !transferTo}
            >
              Start Transfer
            </button>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div style={s.statsGrid}>
        <div style={s.statCard}>
          <div style={{ ...s.statIcon, background: "#7C3AED14", color: "#7C3AED" }}><MapPin size={20} /></div>
          <div><div style={s.statValue}>{storageZones.length}</div><div style={s.statLabel}>Total Zones</div></div>
        </div>
        <div style={s.statCard}>
          <div style={{ ...s.statIcon, background: "#2563EB14", color: "#2563EB" }}><Layers size={20} /></div>
          <div><div style={s.statValue}>{totalArea.toLocaleString()} sqm</div><div style={s.statLabel}>Total Area</div></div>
        </div>
        <div style={s.statCard}>
          <div style={{ ...s.statIcon, background: "#D9770614", color: "#D97706" }}><Box size={20} /></div>
          <div><div style={s.statValue}>{totalShelves}</div><div style={s.statLabel}>Total Shelves</div></div>
        </div>
        <div style={s.statCard}>
          <div style={{ ...s.statIcon, background: overallPct > 80 ? "#DC262614" : "#05966914", color: overallPct > 80 ? "#DC2626" : "#059669" }}>
            <Layers size={20} />
          </div>
          <div><div style={s.statValue}>{overallPct}%</div><div style={s.statLabel}>Overall Utilization</div></div>
        </div>
      </div>

      {/* Visual Zone Map / Floor Plan */}
      <div style={s.card}>
        <h3 style={{ ...s.cardTitle, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <MapPin size={16} color="#7C3AED" /> Warehouse Floor Plan
        </h3>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1.5fr 1fr 1fr",
          gridTemplateRows: "1fr 1fr",
          gap: 8,
          height: 220,
          padding: 8,
          background: "#F9FAFB",
          borderRadius: 12,
          border: "2px dashed #E5E7EB",
        }}>
          {storageZones.map((zone) => {
            const pct = Math.round((zone.usedArea / zone.area) * 100);
            const mc = zoneMapColors[zone.type] || zoneMapColors.Dry;
            const capColor = getCapacityColor(pct);
            const isCold = zone.type === "Cold" || zone.type === "Pharmaceutical";
            const tempSt = getTempStatus(zone);

            return (
              <div
                key={zone.id}
                style={{
                  background: mc.fill,
                  borderRadius: 10,
                  padding: "12px 14px",
                  border: `2px solid ${pct > 85 ? "#DC2626" : zone.color}`,
                  display: "flex", flexDirection: "column", justifyContent: "space-between",
                  position: "relative", overflow: "hidden",
                  gridColumn: zone.type === "Cold" ? "span 2" : undefined,
                }}
              >
                {/* Utilization fill background */}
                <div style={{
                  position: "absolute", bottom: 0, left: 0, right: 0,
                  height: pct + "%",
                  background: `${zone.color}15`,
                  transition: "height .4s ease",
                }} />
                <div style={{ position: "relative", zIndex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: mc.text }}>{zone.name}</span>
                    {isCold && (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 11, fontWeight: 600, color: tempSt.ok ? "#2563EB" : "#DC2626" }}>
                        <Thermometer size={10} /> {zone.currentTemp}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 10, color: mc.text, opacity: 0.8, marginTop: 2 }}>{zone.area} sqm</div>
                </div>
                <div style={{ position: "relative", zIndex: 1 }}>
                  {/* Capacity bar */}
                  <div style={{ width: "100%", height: 6, background: "#ffffff80", borderRadius: 4, overflow: "hidden", marginBottom: 4 }}>
                    <div style={{ height: "100%", width: pct + "%", background: capColor, borderRadius: 4, transition: "width .4s ease" }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 10, color: mc.text, opacity: 0.7 }}>{zone.usedArea} / {zone.area} sqm</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: capColor }}>{pct}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {/* Map legend */}
        <div style={{ display: "flex", gap: 16, marginTop: 12, justifyContent: "center" }}>
          {Object.entries(typeColor).map(([type, colors]) => (
            <div key={type} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 10, height: 10, borderRadius: 3, background: colors.bg, border: `1px solid ${colors.border}` }} />
              <span style={{ fontSize: 11, color: "#6B7280" }}>{type}</span>
            </div>
          ))}
          <span style={{ fontSize: 11, color: "#9CA3AF", borderLeft: "1px solid #E5E7EB", paddingLeft: 12 }}>
            Bar: <span style={{ color: "#059669" }}>&lt;70%</span> | <span style={{ color: "#D97706" }}>70-85%</span> | <span style={{ color: "#DC2626" }}>&gt;85%</span>
          </span>
        </div>
      </div>

      {/* Overall Capacity Bar */}
      <div style={s.card}>
        <h3 style={s.cardTitle}>Overall Warehouse Capacity</h3>
        <p style={{ fontSize: 13, color: "#6B7280", margin: "4px 0 14px" }}>
          {totalUsed.toLocaleString()} sqm used of {totalArea.toLocaleString()} sqm total
        </p>
        <div style={{ width: "100%", height: 14, background: "#F3F4F6", borderRadius: 8, overflow: "hidden" }}>
          <div style={{
            height: "100%", width: overallPct + "%",
            background: overallPct > 80 ? "linear-gradient(90deg, #EF4444, #F87171)" : "linear-gradient(90deg, #7C3AED, #A855F7)",
            borderRadius: 8, transition: "width .4s ease",
          }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
          <span style={{ fontSize: 12, color: "#9CA3AF" }}>0 sqm</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#7C3AED" }}>{overallPct}% utilized</span>
          <span style={{ fontSize: 12, color: "#9CA3AF" }}>{totalArea.toLocaleString()} sqm</span>
        </div>
      </div>

      {/* Zone Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 16, marginBottom: 24 }}>
        {storageZones.map((zone) => {
          const pct = Math.round((zone.usedArea / zone.area) * 100);
          const tc = typeColor[zone.type] || typeColor.Dry;
          const itemsInZone = inventoryItems.filter((i) => i.zone === zone.name).length;
          const isCold = zone.type === "Cold" || zone.type === "Pharmaceutical";
          const tempSt = getTempStatus(zone);
          const capColor = getCapacityColor(pct);

          return (
            <div key={zone.id} style={{ background: "#fff", border: `1px solid ${tc.border}`, borderRadius: 12, padding: "22px 24px", position: "relative", overflow: "hidden" }}>
              {/* Color strip at top */}
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: zone.color }} />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div>
                  <h4 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: 0 }}>{zone.name}</h4>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
                    <span style={{
                      padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600,
                      background: tc.bg, color: tc.color,
                    }}>
                      {zone.type}
                    </span>
                    {isCold && (
                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: 4,
                        padding: "3px 8px", borderRadius: 4, fontSize: 11, fontWeight: 600,
                        color: "#2563EB", background: "#EFF6FF",
                      }}>
                        <Thermometer size={10} /> {zone.currentTemp}
                      </span>
                    )}
                  </div>
                </div>
                <span style={{ fontSize: 28, fontWeight: 800, color: pct > 85 ? "#DC2626" : zone.color }}>{pct}%</span>
              </div>

              {/* Capacity Bar with thresholds */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: "#6B7280" }}>{zone.usedArea.toLocaleString()} / {zone.area.toLocaleString()} sqm</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: capColor }}>
                    {pct < 70 ? "Normal" : pct < 85 ? "Moderate" : "Critical"}
                  </span>
                </div>
                <div style={{ width: "100%", height: 10, background: "#F3F4F6", borderRadius: 6, overflow: "hidden", position: "relative" }}>
                  <div style={{
                    height: "100%", width: pct + "%",
                    background: pct > 85 ? "#EF4444" : pct > 70 ? "#D97706" : `linear-gradient(90deg, ${zone.color}, ${zone.color}AA)`,
                    borderRadius: 6, transition: "width .4s ease",
                  }} />
                  {/* Threshold markers */}
                  <div style={{ position: "absolute", top: 0, left: "70%", width: 1, height: "100%", background: "#D9770640" }} />
                  <div style={{ position: "absolute", top: 0, left: "85%", width: 1, height: "100%", background: "#DC262640" }} />
                </div>
                {pct > 85 && (
                  <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 6 }}>
                    <AlertTriangle size={12} color="#DC2626" />
                    <span style={{ fontSize: 11, color: "#DC2626", fontWeight: 600 }}>High utilization - near capacity</span>
                  </div>
                )}
              </div>

              {/* Zone Stats */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                <div style={{ padding: "10px 12px", background: "#F9FAFB", borderRadius: 8 }}>
                  <div style={{ fontSize: 10, color: "#9CA3AF", marginBottom: 2 }}>Area</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{zone.area.toLocaleString()} sqm</div>
                </div>
                <div style={{ padding: "10px 12px", background: "#F9FAFB", borderRadius: 8 }}>
                  <div style={{ fontSize: 10, color: "#9CA3AF", marginBottom: 2 }}>Available</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#059669" }}>{(zone.area - zone.usedArea).toLocaleString()} sqm</div>
                </div>
                <div style={{ padding: "10px 12px", background: "#F9FAFB", borderRadius: 8 }}>
                  <div style={{ fontSize: 10, color: "#9CA3AF", marginBottom: 2 }}>SKUs</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{itemsInZone}</div>
                </div>
              </div>

              {/* Temperature info for cold zones with warning logic */}
              {isCold && (
                <div style={{
                  marginTop: 12, padding: "10px 14px", borderRadius: 8,
                  background: tempSt.ok ? "#EFF6FF" : "#FEE2E2",
                  border: `1px solid ${tempSt.ok ? "#BFDBFE" : "#FECACA"}`,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <Thermometer size={14} color={tempSt.ok ? "#2563EB" : "#DC2626"} />
                      <span style={{ fontSize: 12, fontWeight: 600, color: tempSt.ok ? "#1E40AF" : "#991B1B" }}>Temperature</span>
                    </div>
                    <span style={{ fontSize: 12, color: "#6B7280" }}>Target: {zone.temp}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
                    <span style={{ fontSize: 16, fontWeight: 700, color: tempSt.ok ? "#2563EB" : "#DC2626" }}>{zone.currentTemp}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: tempSt.color, background: tempSt.bg, padding: "2px 8px", borderRadius: 4 }}>
                      {tempSt.ok ? "Compliant" : "ALERT"}
                    </span>
                  </div>
                  {!tempSt.ok && (
                    <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 6 }}>
                      <AlertTriangle size={12} color="#DC2626" />
                      <span style={{ fontSize: 11, color: "#991B1B", fontWeight: 600 }}>Temperature out of acceptable range! Immediate action required.</span>
                    </div>
                  )}
                </div>
              )}

              {zone.shelves > 0 && (
                <div style={{ marginTop: 12, fontSize: 12, color: "#6B7280" }}>
                  {zone.shelves} shelves / racks
                </div>
              )}

              {/* Quick Action: Transfer */}
              <div style={{ marginTop: 12, display: "flex", justifyContent: "flex-end" }}>
                <button
                  onClick={() => { setTransferFrom(zone.name); setShowTransfer(true); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 4,
                    padding: "6px 12px", borderRadius: 6,
                    border: "1px solid #DDD6FE", background: "#F5F3FF",
                    color: "#7C3AED", fontSize: 11, fontWeight: 600, cursor: "pointer",
                  }}
                >
                  <ArrowRightLeft size={10} /> Transfer From Here
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

const s: Record<string, React.CSSProperties> = {
  header: { marginBottom: 28 },
  pageTitle: { fontSize: 24, fontWeight: 800, color: "#111827", margin: 0 },
  pageSubtitle: { fontSize: 14, color: "#6B7280", marginTop: 4 },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 },
  statCard: { background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: "18px 20px", display: "flex", alignItems: "center", gap: 14 },
  statIcon: { width: 42, height: 42, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" },
  statValue: { fontSize: 22, fontWeight: 800, color: "#111827" },
  statLabel: { fontSize: 12, color: "#6B7280", marginTop: 2 },
  card: { background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: "20px 24px", marginBottom: 20 },
  cardTitle: { fontSize: 16, fontWeight: 700, color: "#111827", margin: 0 },
};
