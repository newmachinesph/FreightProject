"use client";
import { use, useState } from "react";
import { ArrowLeft, Package, MapPin, Thermometer, AlertTriangle, ArrowDownToLine, ArrowUpFromLine, Barcode, Tag, TrendingUp, TrendingDown, LayoutGrid, Layers, Box, ShoppingCart, Truck as TruckIcon } from "lucide-react";
import { inventoryItems, inboundShipments, outboundShipments, storageZones } from "@/lib/mock-data";

const PURPLE = "#7C3AED";
const PURPLE_LIGHT = "#F5F3FF";
const PURPLE_BORDER = "#DDD6FE";

const statusBadge: Record<string, React.CSSProperties> = {
  in_stock:   { background: "#D1FAE5", color: "#065F46", padding: "4px 14px", borderRadius: 6, fontSize: 13, fontWeight: 600 },
  low_stock:  { background: "#FEF3C7", color: "#92400E", padding: "4px 14px", borderRadius: 6, fontSize: 13, fontWeight: 600 },
  expired:    { background: "#FEE2E2", color: "#991B1B", padding: "4px 14px", borderRadius: 6, fontSize: 13, fontWeight: 600 },
  reserved:   { background: "#E0E7FF", color: "#3730A3", padding: "4px 14px", borderRadius: 6, fontSize: 13, fontWeight: 600 },
};
const statusLabels: Record<string, string> = { in_stock: "In Stock", low_stock: "Low Stock", expired: "Expired", reserved: "Reserved" };

// Category icon colors
const categoryIcons: Record<string, { icon: string; bg: string; color: string }> = {
  "Grains & Rice": { icon: "rice", bg: "#FEF3C7", color: "#D97706" },
  "Canned Goods": { icon: "can", bg: "#FEE2E2", color: "#DC2626" },
  "Frozen Seafood": { icon: "fish", bg: "#DBEAFE", color: "#2563EB" },
  "Frozen Poultry": { icon: "poultry", bg: "#DBEAFE", color: "#2563EB" },
  "Frozen Meat": { icon: "meat", bg: "#FCE7F3", color: "#DB2777" },
  "Electronics": { icon: "elec", bg: "#EDE9FE", color: PURPLE },
  "Pharmaceutical": { icon: "pharma", bg: "#D1FAE5", color: "#059669" },
  "Condiments": { icon: "condiment", bg: "#FEF3C7", color: "#D97706" },
  "Beverages": { icon: "bev", bg: "#CFFAFE", color: "#0891B2" },
  "Snacks": { icon: "snack", bg: "#FEF3C7", color: "#D97706" },
  "Dairy": { icon: "dairy", bg: "#FEF9C3", color: "#CA8A04" },
  "Household": { icon: "house", bg: "#E0E7FF", color: "#4F46E5" },
  default: { icon: "box", bg: "#F3F4F6", color: "#6B7280" },
};

function getCategoryStyle(cat: string) {
  return categoryIcons[cat] || categoryIcons.default;
}

// Generate mock stock level data over 30 days
function generateStockHistory(item: typeof inventoryItems[0]) {
  const points: { day: number; label: string; level: number }[] = [];
  let currentLevel = item.qtyOnHand;
  // Work backwards from movements
  const sortedMovements = [...item.movements].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  // Reconstruct levels going backwards
  const levels: { date: string; level: number }[] = [{ date: "2026-03-20", level: currentLevel }];
  let lvl = currentLevel;
  for (const mov of sortedMovements) {
    if (mov.type === "out") lvl += mov.qty;
    else lvl -= mov.qty;
    levels.unshift({ date: mov.date, level: Math.max(0, lvl) });
  }
  // Generate 30 day points interpolated
  for (let d = 0; d < 30; d++) {
    const date = new Date("2026-02-19");
    date.setDate(date.getDate() + d);
    const dateStr = date.toISOString().split("T")[0];
    const label = `${date.getMonth() + 1}/${date.getDate()}`;
    // Find closest level
    let closest = levels[0].level;
    for (const l of levels) {
      if (l.date <= dateStr) closest = l.level;
    }
    points.push({ day: d, label, level: Math.max(0, closest) });
  }
  return points;
}

// Parse location string like "A1-R3-S2"
function parseLocation(loc: string) {
  const parts = loc.split("-");
  const zone = parts[0]?.[0] || "?";
  const aisle = parts[0]?.slice(1) || "?";
  const rack = parts[1]?.replace("R", "") || "?";
  const shelf = parts[2]?.replace("S", "") || "?";
  return { zone, aisle, rack, shelf };
}

export default function InventoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const item = inventoryItems.find((i) => i.id === id);
  const [activeTab, setActiveTab] = useState<"timeline" | "chart" | "linked">("timeline");

  if (!item) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <h2 style={{ color: "#111827" }}>Item Not Found</h2>
        <p style={{ color: "#6B7280" }}>No inventory item with ID &quot;{id}&quot;</p>
        <a href="/dashboard/inventory" style={{ color: PURPLE, fontWeight: 600 }}>&larr; Back to Inventory</a>
      </div>
    );
  }

  const stockHistory = generateStockHistory(item);
  const loc = parseLocation(item.location);
  const maxLevel = item.minReorderLevel ? Math.max(item.qtyOnHand, (item.minReorderLevel || 0) * 2.5, ...stockHistory.map(p => p.level)) : Math.max(item.qtyOnHand, ...stockHistory.map(p => p.level));
  const maxThreshold = item.minReorderLevel ? Math.round(item.minReorderLevel * 2) : undefined;
  const catStyle = getCategoryStyle(item.category);

  // Find linked inbound shipments
  const linkedInbound = inboundShipments.filter(s => s.itemDetails.some(d => d.sku === item.sku));
  // Find linked outbound shipments
  const linkedOutbound = outboundShipments.filter(s => s.itemDetails.some(d => d.sku === item.sku));

  // Zone info
  const matchedZone = storageZones.find(z => z.name === item.zone);

  return (
    <>
      {/* Back link */}
      <a href="/dashboard/inventory" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#6B7280", textDecoration: "none", fontSize: 13, marginBottom: 20 }}>
        <ArrowLeft size={14} /> Back to Inventory
      </a>

      {/* Header with Product Image Placeholder */}
      <div style={{ display: "flex", gap: 24, marginBottom: 28, flexWrap: "wrap" }}>
        {/* Product Image */}
        <div style={{
          width: 120, height: 120, borderRadius: 16, background: catStyle.bg,
          border: `2px solid ${catStyle.color}20`, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <Box size={36} color={catStyle.color} />
          <span style={{ fontSize: 10, fontWeight: 600, color: catStyle.color, marginTop: 6, textTransform: "uppercase" }}>
            {item.category}
          </span>
        </div>

        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111827", margin: 0 }}>{item.description}</h1>
              <p style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}>
                <span style={{ fontFamily: "monospace", fontWeight: 600, color: PURPLE }}>{item.sku}</span> &mdash; {item.category}
              </p>
              <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                <span style={statusBadge[item.status]}>{statusLabels[item.status]}</span>
                {item.tempRequirement && (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 12px", borderRadius: 6, fontSize: 12, fontWeight: 600, background: "#EFF6FF", color: "#2563EB" }}>
                    <Thermometer size={12} /> {item.tempRequirement}
                  </span>
                )}
                {item.supplier && (
                  <span style={{ padding: "4px 12px", borderRadius: 6, fontSize: 12, fontWeight: 500, background: "#F3F4F6", color: "#6B7280" }}>
                    {item.supplier}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Cards Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16, marginBottom: 24 }}>
        {/* Stock Info */}
        <div style={s.card}>
          <h3 style={s.cardTitle}><Package size={16} style={{ verticalAlign: "middle", marginRight: 8, color: PURPLE }} />Stock Information</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
            <div>
              <div style={s.fieldLabel}>Quantity on Hand</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: item.status === "low_stock" ? "#D97706" : item.status === "expired" ? "#DC2626" : "#111827" }}>
                {item.qtyOnHand} <span style={{ fontSize: 14, fontWeight: 500, color: "#6B7280" }}>{item.uom}</span>
              </div>
            </div>
            <div>
              <div style={s.fieldLabel}>Min Reorder Level</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#6B7280" }}>
                {item.minReorderLevel ?? "N/A"} <span style={{ fontSize: 14, fontWeight: 500, color: "#9CA3AF" }}>{item.uom}</span>
              </div>
            </div>
            <div>
              <div style={s.fieldLabel}>Unit of Measure</div>
              <div style={s.fieldValue}>{item.uom}</div>
            </div>
            <div>
              <div style={s.fieldLabel}>Weight per Unit</div>
              <div style={s.fieldValue}>{item.weight ? `${item.weight} kg` : "N/A"}</div>
            </div>
          </div>
          {item.status === "low_stock" && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 16, padding: "10px 14px", background: "#FEF3C7", borderRadius: 8 }}>
              <AlertTriangle size={16} color="#D97706" />
              <span style={{ fontSize: 13, fontWeight: 600, color: "#92400E" }}>Below reorder level - restock recommended</span>
            </div>
          )}
        </div>

        {/* Reorder Point Visualization */}
        <div style={s.card}>
          <h3 style={s.cardTitle}><TrendingUp size={16} style={{ verticalAlign: "middle", marginRight: 8, color: PURPLE }} />Reorder Point Visualization</h3>
          {item.minReorderLevel ? (
            <div style={{ marginTop: 16 }}>
              {/* Visual gauge */}
              <div style={{ position: "relative", height: 160, display: "flex", alignItems: "flex-end", gap: 0 }}>
                {/* Max threshold zone (green) */}
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "100%", display: "flex", flexDirection: "column" }}>
                  {/* Overstocked zone */}
                  <div style={{ flex: maxThreshold ? (maxLevel - maxThreshold) / maxLevel : 0.2, background: "#FEF3C720", borderRadius: "8px 8px 0 0", borderBottom: maxThreshold ? "2px dashed #D97706" : "none", position: "relative" }}>
                    {maxThreshold && (
                      <span style={{ position: "absolute", right: 4, bottom: -8, fontSize: 9, fontWeight: 600, color: "#D97706", background: "#FEF3C7", padding: "1px 6px", borderRadius: 4 }}>
                        MAX {maxThreshold}
                      </span>
                    )}
                  </div>
                  {/* Healthy zone (green) */}
                  <div style={{ flex: maxThreshold ? (maxThreshold - item.minReorderLevel) / maxLevel : 0.5, background: "#D1FAE520" }}></div>
                  {/* Reorder line */}
                  <div style={{ height: 0, borderTop: "2px dashed #DC2626", position: "relative" }}>
                    <span style={{ position: "absolute", right: 4, top: -8, fontSize: 9, fontWeight: 600, color: "#DC2626", background: "#FEE2E2", padding: "1px 6px", borderRadius: 4 }}>
                      MIN {item.minReorderLevel}
                    </span>
                  </div>
                  {/* Danger zone (red) */}
                  <div style={{ flex: item.minReorderLevel / maxLevel, background: "#FEE2E220", borderRadius: "0 0 8px 8px" }}></div>
                </div>
                {/* Current stock bar */}
                <div style={{ position: "relative", zIndex: 2, width: "100%", display: "flex", justifyContent: "center" }}>
                  <div style={{ width: 80, display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{
                      width: 60, borderRadius: "8px 8px 0 0",
                      height: `${Math.min(100, (item.qtyOnHand / maxLevel) * 100)}%`,
                      minHeight: 8,
                      background: item.qtyOnHand <= item.minReorderLevel
                        ? "linear-gradient(180deg, #EF4444, #FCA5A5)"
                        : item.qtyOnHand >= (maxThreshold || Infinity)
                          ? "linear-gradient(180deg, #D97706, #FCD34D)"
                          : `linear-gradient(180deg, ${PURPLE}, #A78BFA)`,
                      transition: "height 0.4s ease",
                      position: "absolute",
                      bottom: 0,
                    }} />
                  </div>
                </div>
              </div>
              <div style={{ textAlign: "center", marginTop: 8 }}>
                <span style={{ fontSize: 20, fontWeight: 800, color: PURPLE }}>{item.qtyOnHand}</span>
                <span style={{ fontSize: 12, color: "#6B7280", marginLeft: 4 }}>{item.uom} current</span>
              </div>
              {/* Legend */}
              <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: "#FEE2E2", border: "1px solid #FECACA" }} />
                  <span style={{ fontSize: 10, color: "#6B7280" }}>Critical</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: "#D1FAE5", border: "1px solid #A7F3D0" }} />
                  <span style={{ fontSize: 10, color: "#6B7280" }}>Healthy</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: "#FEF3C7", border: "1px solid #FDE68A" }} />
                  <span style={{ fontSize: 10, color: "#6B7280" }}>Overstock</span>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ padding: 30, textAlign: "center", color: "#9CA3AF", fontSize: 13, marginTop: 16 }}>
              No reorder level configured for this SKU
            </div>
          )}
        </div>

        {/* Location Details with Mini Zone Map */}
        <div style={s.card}>
          <h3 style={s.cardTitle}><MapPin size={16} style={{ verticalAlign: "middle", marginRight: 8, color: PURPLE }} />Location & Storage</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
            <div>
              <div style={s.fieldLabel}>Full Location</div>
              <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "monospace", color: PURPLE }}>{item.location}</div>
            </div>
            <div>
              <div style={s.fieldLabel}>Zone</div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {matchedZone && <div style={{ width: 10, height: 10, borderRadius: 3, background: matchedZone.color }} />}
                <span style={s.fieldValue}>{item.zone}</span>
              </div>
            </div>
          </div>
          {/* Detailed breakdown */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginTop: 16 }}>
            {[
              { label: "Zone", value: loc.zone, icon: <LayoutGrid size={14} color={PURPLE} /> },
              { label: "Aisle", value: loc.aisle, icon: <Layers size={14} color={PURPLE} /> },
              { label: "Rack", value: `R${loc.rack}`, icon: <Package size={14} color={PURPLE} /> },
              { label: "Shelf", value: `S${loc.shelf}`, icon: <Box size={14} color={PURPLE} /> },
            ].map(({ label, value, icon }) => (
              <div key={label} style={{
                padding: "12px 10px", borderRadius: 10, background: PURPLE_LIGHT,
                border: `1px solid ${PURPLE_BORDER}`, textAlign: "center",
              }}>
                <div style={{ marginBottom: 4 }}>{icon}</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: PURPLE }}>{value}</div>
                <div style={{ fontSize: 10, color: "#6B7280", fontWeight: 600, textTransform: "uppercase" }}>{label}</div>
              </div>
            ))}
          </div>
          {/* Mini zone map */}
          {matchedZone && (
            <div style={{ marginTop: 16, padding: "12px 14px", background: "#F9FAFB", borderRadius: 8, border: "1px solid #E5E7EB" }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#6B7280", marginBottom: 8, textTransform: "uppercase" }}>Zone Map - {matchedZone.name}</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 4 }}>
                {Array.from({ length: 24 }).map((_, i) => {
                  const isHighlighted = i === (parseInt(loc.aisle) - 1) * 6 + (parseInt(loc.rack) - 1);
                  return (
                    <div key={i} style={{
                      height: 20, borderRadius: 3,
                      background: isHighlighted ? PURPLE : i % 3 === 0 ? `${matchedZone.color}30` : "#E5E7EB",
                      border: isHighlighted ? `2px solid ${PURPLE}` : "1px solid #D1D5DB",
                      position: "relative",
                    }}>
                      {isHighlighted && (
                        <div style={{
                          position: "absolute", top: -18, left: "50%", transform: "translateX(-50%)",
                          fontSize: 8, fontWeight: 700, color: PURPLE, whiteSpace: "nowrap",
                          background: "#fff", padding: "1px 4px", borderRadius: 3, border: `1px solid ${PURPLE_BORDER}`,
                        }}>
                          HERE
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                <span style={{ fontSize: 9, color: "#9CA3AF" }}>Area: {matchedZone.area} sqm</span>
                <span style={{ fontSize: 9, color: "#9CA3AF" }}>
                  Utilization: {Math.round((matchedZone.usedArea / matchedZone.area) * 100)}%
                </span>
                {matchedZone.currentTemp && (
                  <span style={{ fontSize: 9, color: "#2563EB", display: "flex", alignItems: "center", gap: 2 }}>
                    <Thermometer size={8} /> {matchedZone.currentTemp}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Tracking */}
        <div style={s.card}>
          <h3 style={s.cardTitle}><Barcode size={16} style={{ verticalAlign: "middle", marginRight: 8, color: PURPLE }} />Tracking & Identity</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
            <div>
              <div style={s.fieldLabel}>Lot / Batch Number</div>
              <div style={{ fontFamily: "monospace", fontWeight: 600, color: "#111827" }}>{item.lotBatch}</div>
            </div>
            <div>
              <div style={s.fieldLabel}>Barcode / QR</div>
              <div style={{ fontFamily: "monospace", fontWeight: 600, color: "#111827" }}>{item.barcode || "N/A"}</div>
            </div>
            <div>
              <div style={s.fieldLabel}>RFID Tag</div>
              <div style={{ fontFamily: "monospace", color: "#111827" }}>{item.rfidTag || "Not assigned"}</div>
            </div>
            <div>
              <div style={s.fieldLabel}>Date Received</div>
              <div style={s.fieldValue}>{item.dateReceived}</div>
            </div>
          </div>
          {/* Expiry */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16, paddingTop: 16, borderTop: "1px solid #F3F4F6" }}>
            <div>
              <div style={s.fieldLabel}>Expiry Date</div>
              {item.expiryDate ? (
                <div style={{ fontSize: 16, fontWeight: 700, color: item.status === "expired" ? "#DC2626" : "#111827" }}>
                  {item.expiryDate}
                  {item.status === "expired" && <span style={{ fontSize: 11, marginLeft: 8, color: "#DC2626", background: "#FEE2E2", padding: "2px 8px", borderRadius: 4 }}>EXPIRED</span>}
                </div>
              ) : (
                <div style={s.fieldValue}>No expiry</div>
              )}
            </div>
            <div>
              <div style={s.fieldLabel}>Supplier</div>
              <div style={{ ...s.fieldValue, fontSize: 13 }}>{item.supplier}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stock Level Chart (30 days) */}
      <div style={s.card}>
        <h3 style={s.cardTitle}>
          <TrendingUp size={16} style={{ verticalAlign: "middle", marginRight: 8, color: PURPLE }} />
          Stock Level - Last 30 Days
        </h3>
        <div style={{ marginTop: 16, position: "relative", height: 180 }}>
          {/* Y-axis labels */}
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 20, width: 40, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <span style={{ fontSize: 9, color: "#9CA3AF" }}>{Math.round(maxLevel)}</span>
            <span style={{ fontSize: 9, color: "#9CA3AF" }}>{Math.round(maxLevel / 2)}</span>
            <span style={{ fontSize: 9, color: "#9CA3AF" }}>0</span>
          </div>
          {/* Chart area */}
          <div style={{ marginLeft: 44, height: 160, position: "relative", borderBottom: "1px solid #E5E7EB", borderLeft: "1px solid #E5E7EB" }}>
            {/* Reorder line */}
            {item.minReorderLevel && (
              <div style={{
                position: "absolute", left: 0, right: 0,
                bottom: `${(item.minReorderLevel / maxLevel) * 100}%`,
                borderTop: "1.5px dashed #DC2626", zIndex: 2,
              }}>
                <span style={{ position: "absolute", right: 0, top: -12, fontSize: 8, color: "#DC2626", fontWeight: 600, background: "#FEE2E2", padding: "1px 4px", borderRadius: 3 }}>
                  Reorder: {item.minReorderLevel}
                </span>
              </div>
            )}
            {/* SVG line chart */}
            <svg width="100%" height="100%" viewBox="0 0 300 160" preserveAspectRatio="none" style={{ position: "absolute", left: 0, top: 0 }}>
              {/* Gradient fill */}
              <defs>
                <linearGradient id="stockGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor={PURPLE} stopOpacity="0.2" />
                  <stop offset="100%" stopColor={PURPLE} stopOpacity="0.02" />
                </linearGradient>
              </defs>
              {/* Area fill */}
              <path
                d={`M0,${160 - (stockHistory[0].level / maxLevel) * 160} ${stockHistory.map((p, i) => `L${(i / 29) * 300},${160 - (p.level / maxLevel) * 160}`).join(" ")} L300,160 L0,160 Z`}
                fill="url(#stockGradient)"
              />
              {/* Line */}
              <polyline
                points={stockHistory.map((p, i) => `${(i / 29) * 300},${160 - (p.level / maxLevel) * 160}`).join(" ")}
                fill="none"
                stroke={PURPLE}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Dots at movement dates */}
              {stockHistory.map((p, i) => {
                const hasMovement = item.movements.some(m => {
                  const d = new Date("2026-02-19");
                  d.setDate(d.getDate() + i);
                  return m.date === d.toISOString().split("T")[0];
                });
                if (!hasMovement) return null;
                return (
                  <circle
                    key={i}
                    cx={(i / 29) * 300}
                    cy={160 - (p.level / maxLevel) * 160}
                    r="4"
                    fill="#fff"
                    stroke={PURPLE}
                    strokeWidth="2"
                  />
                );
              })}
            </svg>
          </div>
          {/* X-axis labels */}
          <div style={{ marginLeft: 44, display: "flex", justifyContent: "space-between", paddingTop: 4 }}>
            {stockHistory.filter((_, i) => i % 7 === 0 || i === 29).map((p) => (
              <span key={p.label} style={{ fontSize: 9, color: "#9CA3AF" }}>{p.label}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs: Movement Timeline / Linked Shipments */}
      <div style={{ display: "flex", gap: 0, marginBottom: 0, borderBottom: "2px solid #E5E7EB" }}>
        {[
          { key: "timeline" as const, label: "Stock Movements", icon: <ArrowDownToLine size={14} /> },
          { key: "chart" as const, label: "Movement Timeline", icon: <TrendingDown size={14} /> },
          { key: "linked" as const, label: "Linked Shipments", icon: <TruckIcon size={14} /> },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              display: "flex", alignItems: "center", gap: 6, padding: "12px 20px",
              border: "none", background: "none", fontSize: 13, fontWeight: 600,
              color: activeTab === tab.key ? PURPLE : "#6B7280",
              borderBottom: activeTab === tab.key ? `2px solid ${PURPLE}` : "2px solid transparent",
              cursor: "pointer", marginBottom: -2, transition: "all 0.2s",
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "timeline" && (
        <div style={{ ...s.card, borderTop: "none", borderRadius: "0 0 12px 12px" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr>
                  {["Date", "Type", "Quantity", "Reference", "Note"].map((h) => (
                    <th key={h} style={s.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {item.movements.map((mov, idx) => (
                  <tr key={idx}>
                    <td style={s.td}>{mov.date}</td>
                    <td style={s.td}>
                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: 4,
                        padding: "3px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600,
                        background: mov.type === "in" ? "#D1FAE5" : "#FEE2E2",
                        color: mov.type === "in" ? "#065F46" : "#991B1B",
                      }}>
                        {mov.type === "in" ? <ArrowDownToLine size={12} /> : <ArrowUpFromLine size={12} />}
                        {mov.type === "in" ? "Inbound" : "Outbound"}
                      </span>
                    </td>
                    <td style={s.td}>
                      <span style={{ fontWeight: 700, color: mov.type === "in" ? "#059669" : "#DC2626" }}>
                        {mov.type === "in" ? "+" : "-"}{mov.qty}
                      </span>
                    </td>
                    <td style={s.td}>
                      <a href={mov.type === "in" ? `/dashboard/inbound/${mov.reference}` : "#"} style={{ fontFamily: "monospace", color: PURPLE, textDecoration: "none", fontWeight: 600 }}>
                        {mov.reference}
                      </a>
                    </td>
                    <td style={s.td}>{mov.note || <span style={{ color: "#D1D5DB" }}>--</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "chart" && (
        <div style={{ ...s.card, borderTop: "none", borderRadius: "0 0 12px 12px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {[...item.movements].reverse().map((mov, idx) => (
              <div key={idx} style={{ display: "flex", gap: 16, position: "relative" }}>
                {/* Timeline line */}
                <div style={{ width: 40, display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
                  <div style={{
                    width: 12, height: 12, borderRadius: "50%", flexShrink: 0, zIndex: 2,
                    background: mov.type === "in" ? "#059669" : "#DC2626",
                    border: "2px solid #fff", boxShadow: "0 0 0 2px " + (mov.type === "in" ? "#D1FAE5" : "#FEE2E2"),
                  }} />
                  {idx < item.movements.length - 1 && (
                    <div style={{ width: 2, flex: 1, background: "#E5E7EB" }} />
                  )}
                </div>
                {/* Content */}
                <div style={{ flex: 1, paddingBottom: 24 }}>
                  <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 4 }}>{mov.date}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: 4,
                      padding: "4px 12px", borderRadius: 6, fontSize: 12, fontWeight: 600,
                      background: mov.type === "in" ? "#D1FAE5" : "#FEE2E2",
                      color: mov.type === "in" ? "#065F46" : "#991B1B",
                    }}>
                      {mov.type === "in" ? <ArrowDownToLine size={12} /> : <ArrowUpFromLine size={12} />}
                      {mov.type === "in" ? "Received" : "Shipped"}
                    </span>
                    <span style={{ fontWeight: 700, color: mov.type === "in" ? "#059669" : "#DC2626", fontSize: 14 }}>
                      {mov.type === "in" ? "+" : "-"}{mov.qty} {item.uom}
                    </span>
                    <a href={mov.type === "in" ? `/dashboard/inbound/${mov.reference}` : "#"} style={{ fontFamily: "monospace", fontSize: 11, color: PURPLE, textDecoration: "none", fontWeight: 600 }}>
                      {mov.reference}
                    </a>
                  </div>
                  {mov.note && <div style={{ fontSize: 12, color: "#6B7280", marginTop: 4 }}>{mov.note}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "linked" && (
        <div style={{ ...s.card, borderTop: "none", borderRadius: "0 0 12px 12px" }}>
          {/* Linked Inbound */}
          <div style={{ marginBottom: 24 }}>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: "#111827", margin: "0 0 12px", display: "flex", alignItems: "center", gap: 6 }}>
              <ArrowDownToLine size={14} color="#059669" /> Inbound Orders ({linkedInbound.length})
            </h4>
            {linkedInbound.length > 0 ? (
              <div style={{ display: "grid", gap: 8 }}>
                {linkedInbound.map(s => {
                  const itemDetail = s.itemDetails.find(d => d.sku === item.sku);
                  return (
                    <a key={s.shipmentId} href={`/dashboard/inbound/${s.shipmentId}`} style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      padding: "12px 16px", borderRadius: 8, border: "1px solid #E5E7EB", textDecoration: "none",
                      background: "#F9FAFB", transition: "all 0.2s",
                    }}>
                      <div>
                        <span style={{ fontFamily: "monospace", fontWeight: 700, color: PURPLE, fontSize: 13 }}>{s.shipmentId}</span>
                        <span style={{ fontSize: 12, color: "#6B7280", marginLeft: 8 }}>{s.supplier}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: "#059669" }}>+{itemDetail?.qtyExpected} {item.uom}</span>
                        <span style={{
                          padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 600,
                          background: s.status === "Put Away" ? "#D1FAE5" : s.status === "Received" ? "#ECFDF5" : "#E0E7FF",
                          color: s.status === "Put Away" ? "#065F46" : s.status === "Received" ? "#059669" : "#3730A3",
                        }}>
                          {s.status}
                        </span>
                      </div>
                    </a>
                  );
                })}
              </div>
            ) : (
              <div style={{ padding: 16, textAlign: "center", color: "#9CA3AF", fontSize: 13 }}>No linked inbound shipments</div>
            )}
          </div>
          {/* Linked Outbound */}
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: "#111827", margin: "0 0 12px", display: "flex", alignItems: "center", gap: 6 }}>
              <ArrowUpFromLine size={14} color="#DC2626" /> Outbound Orders ({linkedOutbound.length})
            </h4>
            {linkedOutbound.length > 0 ? (
              <div style={{ display: "grid", gap: 8 }}>
                {linkedOutbound.map(s => {
                  const itemDetail = s.itemDetails.find(d => d.sku === item.sku);
                  return (
                    <a key={s.orderId} href={`/dashboard/outbound/${s.orderId}`} style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      padding: "12px 16px", borderRadius: 8, border: "1px solid #E5E7EB", textDecoration: "none",
                      background: "#F9FAFB", transition: "all 0.2s",
                    }}>
                      <div>
                        <span style={{ fontFamily: "monospace", fontWeight: 700, color: PURPLE, fontSize: 13 }}>{s.orderId}</span>
                        <span style={{ fontSize: 12, color: "#6B7280", marginLeft: 8 }}>{s.consignee}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: "#DC2626" }}>-{itemDetail?.qtyOrdered} {item.uom}</span>
                        <span style={{
                          padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 600,
                          background: s.status === "Dispatched" ? "#D1FAE5" : s.status === "Ready" ? "#ECFDF5" : "#FEF3C7",
                          color: s.status === "Dispatched" ? "#065F46" : s.status === "Ready" ? "#059669" : "#92400E",
                        }}>
                          {s.status}
                        </span>
                      </div>
                    </a>
                  );
                })}
              </div>
            ) : (
              <div style={{ padding: 16, textAlign: "center", color: "#9CA3AF", fontSize: 13 }}>No linked outbound orders</div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

const s: Record<string, React.CSSProperties> = {
  card: { background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: "20px 24px", marginBottom: 0 },
  cardTitle: { fontSize: 15, fontWeight: 700, color: "#111827", margin: 0 },
  fieldLabel: { fontSize: 11, color: "#9CA3AF", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.3, marginBottom: 4 },
  fieldValue: { fontSize: 14, fontWeight: 600, color: "#111827" },
  th: { textAlign: "left", padding: "10px 12px", borderBottom: "1px solid #E5E7EB", color: "#6B7280", fontWeight: 600, fontSize: 12, whiteSpace: "nowrap" },
  td: { padding: "10px 12px", borderBottom: "1px solid #F3F4F6", color: "#374151", whiteSpace: "nowrap" },
};
