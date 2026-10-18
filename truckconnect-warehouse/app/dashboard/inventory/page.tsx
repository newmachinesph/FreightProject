"use client";
import { useState } from "react";
import { Package, AlertTriangle, Search, Filter, Thermometer, RotateCcw, CheckSquare, Square, X, ArrowRightLeft, Printer, ClipboardList } from "lucide-react";
import { inventoryItems } from "@/lib/mock-data";

const statusBadge: Record<string, React.CSSProperties> = {
  in_stock:   { background: "#D1FAE5", color: "#065F46", padding: "3px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600 },
  low_stock:  { background: "#FEF3C7", color: "#92400E", padding: "3px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600 },
  expired:    { background: "#FEE2E2", color: "#991B1B", padding: "3px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600 },
  reserved:   { background: "#E0E7FF", color: "#3730A3", padding: "3px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600 },
};

const statusLabels: Record<string, string> = {
  in_stock: "In Stock",
  low_stock: "Low Stock",
  expired: "Expired",
  reserved: "Reserved",
};

const categoryIcons: Record<string, string> = {
  "Grains & Rice": "\u{1F33E}",
  "Canned Goods": "\u{1F96B}",
  "Frozen Seafood": "\u{1F990}",
  "Frozen Poultry": "\u{1F414}",
  "Frozen Meat": "\u{1F969}",
  "Frozen Dairy": "\u{1F9C1}",
  "Frozen Vegetables": "\u{1F966}",
  "Frozen Prepared Foods": "\u{1F959}",
  "Electronics": "\u{1F4F1}",
  "Pharmaceutical": "\u{1F48A}",
  "Condiments": "\u{1F9C2}",
  "Beverages": "\u{2615}",
  "Instant Noodles": "\u{1F35C}",
  "Snacks": "\u{1F36A}",
  "Dairy": "\u{1F95B}",
  "Household": "\u{1F9F4}",
};

const categories = ["All Categories", ...Array.from(new Set(inventoryItems.map(i => i.category)))].sort();
const zones = ["All Zones", ...Array.from(new Set(inventoryItems.map(i => i.zone)))].sort();
const statusOptions = ["All Status", "in_stock", "low_stock", "expired", "reserved"];

function getExpiryInfo(expiryDate?: string): { days: number; color: string; bg: string; label: string } | null {
  if (!expiryDate) return null;
  const today = new Date("2026-03-20");
  const exp = new Date(expiryDate);
  const days = Math.ceil((exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (days <= 0) return { days, color: "#991B1B", bg: "#FEE2E2", label: "Expired" };
  if (days <= 7) return { days, color: "#991B1B", bg: "#FEE2E2", label: `${days}d left` };
  if (days <= 30) return { days, color: "#92400E", bg: "#FEF3C7", label: `${days}d left` };
  if (days <= 90) return { days, color: "#1E40AF", bg: "#EFF6FF", label: `${days}d left` };
  return { days, color: "#6B7280", bg: "#F9FAFB", label: `${days}d` };
}

function getMaxCapacity(item: typeof inventoryItems[0]): number {
  const totalIn = item.movements.filter(m => m.type === "in").reduce((s, m) => s + m.qty, 0);
  return Math.max(totalIn, item.qtyOnHand, (item.minReorderLevel || 0) * 5);
}

export default function InventoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [zoneFilter, setZoneFilter] = useState("All Zones");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filtered = inventoryItems.filter((item) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = searchQuery === "" ||
      item.sku.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.zone.toLowerCase().includes(q) ||
      item.supplier.toLowerCase().includes(q) ||
      item.location.toLowerCase().includes(q) ||
      item.lotBatch.toLowerCase().includes(q);

    const matchesZone = zoneFilter === "All Zones" || item.zone === zoneFilter;
    const matchesCategory = categoryFilter === "All Categories" || item.category === categoryFilter;
    const matchesStatus = statusFilter === "All Status" || item.status === statusFilter;

    return matchesSearch && matchesZone && matchesCategory && matchesStatus;
  });

  const totalUnits = inventoryItems.reduce((sum, i) => sum + i.qtyOnHand, 0);
  const lowStockCount = inventoryItems.filter((i) => i.status === "low_stock").length;
  const expiredCount = inventoryItems.filter((i) => i.status === "expired").length;

  const allFilteredSelected = filtered.length > 0 && filtered.every((item) => selectedIds.has(item.sku));
  const someSelected = selectedIds.size > 0;

  const toggleSelect = (sku: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(sku)) next.delete(sku); else next.add(sku);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (allFilteredSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        filtered.forEach((item) => next.delete(item.sku));
        return next;
      });
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        filtered.forEach((item) => next.add(item.sku));
        return next;
      });
    }
  };

  const clearSelection = () => setSelectedIds(new Set());

  return (
    <>
      <header style={s.header}>
        <div>
          <h1 style={s.pageTitle}>Inventory</h1>
          <p style={s.pageSubtitle}>Track and manage {inventoryItems.length} SKUs across all zones</p>
        </div>
      </header>

      {/* Summary Cards */}
      <div style={s.statsGrid}>
        <div style={s.statCard}>
          <div style={{ ...s.statIcon, background: "#7C3AED14", color: "#7C3AED" }}><Package size={20} /></div>
          <div><div style={s.statValue}>{inventoryItems.length}</div><div style={s.statLabel}>Total SKUs</div></div>
        </div>
        <div style={s.statCard}>
          <div style={{ ...s.statIcon, background: "#2563EB14", color: "#2563EB" }}><Package size={20} /></div>
          <div><div style={s.statValue}>{totalUnits.toLocaleString()}</div><div style={s.statLabel}>Total Units</div></div>
        </div>
        <div style={s.statCard}>
          <div style={{ ...s.statIcon, background: "#D9770614", color: "#D97706" }}><AlertTriangle size={20} /></div>
          <div><div style={s.statValue}>{lowStockCount}</div><div style={s.statLabel}>Low Stock</div></div>
        </div>
        <div style={s.statCard}>
          <div style={{ ...s.statIcon, background: "#DC262614", color: "#DC2626" }}><AlertTriangle size={20} /></div>
          <div><div style={s.statValue}>{expiredCount}</div><div style={s.statLabel}>Expired</div></div>
        </div>
      </div>

      {/* Low Stock Alerts with Reorder Button */}
      {lowStockCount > 0 && (
        <div style={{ ...s.card, background: "#FFFBEB", borderColor: "#FDE68A" }}>
          <h3 style={{ ...s.cardTitle, color: "#92400E", display: "flex", alignItems: "center", gap: 8 }}>
            <AlertTriangle size={16} /> Low Stock Alerts
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 10 }}>
            {inventoryItems.filter((i) => i.status === "low_stock").map((item) => {
              const maxCap = getMaxCapacity(item);
              const fillPct = Math.round((item.qtyOnHand / maxCap) * 100);
              return (
                <div key={item.sku} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "#FEF3C7", borderRadius: 8 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <span style={{ fontSize: 16 }}>{categoryIcons[item.category] || "\u{1F4E6}"}</span>
                      <span style={{ fontWeight: 600, color: "#92400E", fontSize: 13 }}>{item.sku}</span>
                      <span style={{ color: "#78350F", fontSize: 13 }}>{item.description}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ flex: 1, maxWidth: 200, height: 6, background: "#FDE68A", borderRadius: 4, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: fillPct + "%", background: "#D97706", borderRadius: 4 }} />
                      </div>
                      <span style={{ fontSize: 11, color: "#92400E" }}>
                        <span style={{ fontWeight: 700 }}>{item.qtyOnHand}</span> / {maxCap} {item.uom}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); alert(`Reorder request initiated for ${item.sku}: ${item.description}\nSuggested qty: ${(item.minReorderLevel || 50) * 3} ${item.uom}\nSupplier: ${item.supplier}`); }}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 5,
                      padding: "7px 14px", borderRadius: 6, border: "none",
                      background: "#7C3AED", color: "#fff", fontSize: 12, fontWeight: 600,
                      cursor: "pointer", whiteSpace: "nowrap",
                    }}
                  >
                    <RotateCcw size={12} /> Reorder
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Search & Filters */}
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16, flexWrap: "wrap" }}>
        <div style={{
          flex: 1, minWidth: 250, maxWidth: 420,
          display: "flex", alignItems: "center",
          backgroundColor: "#ffffff", border: "1px solid #E5E7EB", borderRadius: 10, padding: "0 12px",
        }}>
          <Search size={16} color="#9CA3AF" />
          <input
            type="text"
            placeholder="Search by SKU, name, category, zone, supplier, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 1, padding: "10px 10px", border: "none", background: "none", outline: "none", fontSize: 13, color: "#111827" }}
          />
        </div>
        <select value={zoneFilter} onChange={(e) => setZoneFilter(e.target.value)} style={s.select}>
          {zones.map(z => <option key={z} value={z}>{z}</option>)}
        </select>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} style={s.select}>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={s.select}>
          {statusOptions.map(s => <option key={s} value={s}>{s === "All Status" ? s : statusLabels[s] || s}</option>)}
        </select>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#6B7280", fontSize: 12, marginBottom: 12 }}>
        <Filter size={12} />
        <span>{filtered.length} of {inventoryItems.length} items</span>
      </div>

      {/* Bulk Action Toolbar */}
      {someSelected && (
        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "10px 16px", marginBottom: 12,
          background: "#F5F3FF", border: "1px solid #DDD6FE", borderRadius: 10,
        }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            fontSize: 13, fontWeight: 700, color: "#7C3AED",
          }}>
            <CheckSquare size={16} /> {selectedIds.size} selected
          </span>
          <div style={{ width: 1, height: 20, background: "#DDD6FE" }} />
          <button
            onClick={() => { alert(`Transfer zone for ${selectedIds.size} item(s): ${[...selectedIds].join(", ")}`); clearSelection(); }}
            style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              padding: "6px 14px", borderRadius: 6, border: "1px solid #DDD6FE",
              background: "#EDE9FE", color: "#7C3AED", fontSize: 12, fontWeight: 600, cursor: "pointer",
            }}
          >
            <ArrowRightLeft size={13} /> Transfer Zone
          </button>
          <button
            onClick={() => { alert(`Printing labels for ${selectedIds.size} item(s)`); }}
            style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              padding: "6px 14px", borderRadius: 6, border: "1px solid #E5E7EB",
              background: "#fff", color: "#374151", fontSize: 12, fontWeight: 600, cursor: "pointer",
            }}
          >
            <Printer size={13} /> Print Labels
          </button>
          <button
            onClick={() => { alert(`Marking ${selectedIds.size} item(s) for recount`); clearSelection(); }}
            style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              padding: "6px 14px", borderRadius: 6, border: "1px solid #E5E7EB",
              background: "#fff", color: "#374151", fontSize: 12, fontWeight: 600, cursor: "pointer",
            }}
          >
            <ClipboardList size={13} /> Mark for Recount
          </button>
          <button
            onClick={clearSelection}
            style={{
              marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 4,
              padding: "6px 10px", borderRadius: 6, border: "none",
              background: "transparent", color: "#6B7280", fontSize: 12, fontWeight: 600, cursor: "pointer",
            }}
          >
            <X size={13} /> Clear
          </button>
        </div>
      )}

      {/* Inventory Table */}
      <div style={s.card}>
        <h3 style={s.cardTitle}>Inventory Items</h3>
        <div style={s.tableWrap}>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={{ ...s.th, width: 40, textAlign: "center" }}>
                  <div
                    onClick={toggleSelectAll}
                    style={{ cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                  >
                    {allFilteredSelected
                      ? <CheckSquare size={16} color="#7C3AED" />
                      : <Square size={16} color="#9CA3AF" />
                    }
                  </div>
                </th>
                {["SKU", "Description", "Category", "Stock Level", "UOM", "Location", "Zone", "Lot/Batch", "Expiry", "Temp Req", "Status", ""].map((h) => (
                  <th key={h} style={s.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => {
                const maxCap = getMaxCapacity(item);
                const fillPct = Math.min(Math.round((item.qtyOnHand / maxCap) * 100), 100);
                const barColor = item.status === "expired" ? "#DC2626" : item.status === "low_stock" ? "#D97706" : fillPct > 85 ? "#059669" : "#7C3AED";
                const expiryInfo = getExpiryInfo(item.expiryDate);
                const icon = categoryIcons[item.category] || "\u{1F4E6}";
                const isSelected = selectedIds.has(item.sku);

                return (
                  <tr key={item.sku} style={{ cursor: "pointer", background: isSelected ? "#F5F3FF" : undefined }} onClick={() => window.location.href = `/dashboard/inventory/${item.id}`}>
                    <td style={{ ...s.td, textAlign: "center", width: 40 }} onClick={(e) => { e.stopPropagation(); toggleSelect(item.sku); }}>
                      <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                        {isSelected
                          ? <CheckSquare size={16} color="#7C3AED" />
                          : <Square size={16} color="#D1D5DB" />
                        }
                      </div>
                    </td>
                    <td style={s.td}><span style={{ fontWeight: 600, color: "#7C3AED", fontFamily: "monospace" }}>{item.sku}</span></td>
                    <td style={{ ...s.td, maxWidth: 200, whiteSpace: "normal" }}>{item.description}</td>
                    <td style={s.td}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, color: "#374151" }}>
                        <span style={{ fontSize: 14 }}>{icon}</span>
                        {item.category}
                      </span>
                    </td>
                    {/* Stock Level Progress Bar */}
                    <td style={s.td}>
                      <div style={{ minWidth: 120 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                          <span style={{ fontWeight: 700, fontSize: 13, color: item.status === "low_stock" ? "#D97706" : item.status === "expired" ? "#DC2626" : "#111827" }}>
                            {item.qtyOnHand}
                          </span>
                          <span style={{ fontSize: 10, color: "#9CA3AF" }}>/ {maxCap}</span>
                        </div>
                        <div style={{ width: "100%", height: 5, background: "#F3F4F6", borderRadius: 3, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: fillPct + "%", background: barColor, borderRadius: 3, transition: "width .3s ease" }} />
                        </div>
                      </div>
                    </td>
                    <td style={s.td}>{item.uom}</td>
                    <td style={s.td}><span style={{ fontFamily: "monospace", fontSize: 12 }}>{item.location}</span></td>
                    <td style={s.td}><span style={{ fontSize: 11 }}>{item.zone}</span></td>
                    <td style={s.td}><span style={{ fontSize: 11, color: "#6B7280" }}>{item.lotBatch}</span></td>
                    {/* Expiry Countdown */}
                    <td style={s.td}>
                      {expiryInfo ? (
                        <div>
                          <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 2 }}>{item.expiryDate}</div>
                          <span style={{
                            display: "inline-block",
                            padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 600,
                            background: expiryInfo.bg, color: expiryInfo.color,
                          }}>
                            {expiryInfo.label}
                          </span>
                        </div>
                      ) : (
                        <span style={{ color: "#D1D5DB" }}>N/A</span>
                      )}
                    </td>
                    <td style={s.td}>
                      {item.tempRequirement ? (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 11, color: "#2563EB", background: "#EFF6FF", padding: "2px 6px", borderRadius: 4 }}>
                          <Thermometer size={10} />{item.tempRequirement}
                        </span>
                      ) : (
                        <span style={{ color: "#D1D5DB", fontSize: 11 }}>Ambient</span>
                      )}
                    </td>
                    <td style={s.td}><span style={statusBadge[item.status]}>{statusLabels[item.status]}</span></td>
                    {/* Quick Reorder for low stock */}
                    <td style={s.td}>
                      {item.status === "low_stock" && (
                        <button
                          onClick={(e) => { e.stopPropagation(); alert(`Reorder request initiated for ${item.sku}\nSuggested qty: ${(item.minReorderLevel || 50) * 3} ${item.uom}\nSupplier: ${item.supplier}`); }}
                          style={{
                            display: "inline-flex", alignItems: "center", gap: 4,
                            padding: "5px 10px", borderRadius: 5, border: "none",
                            background: "#7C3AED", color: "#fff", fontSize: 11, fontWeight: 600,
                            cursor: "pointer", whiteSpace: "nowrap",
                          }}
                        >
                          <RotateCcw size={10} /> Reorder
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
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
  tableWrap: { overflowX: "auto", marginTop: 14 },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 13 },
  th: { textAlign: "left", padding: "10px 12px", borderBottom: "1px solid #E5E7EB", color: "#6B7280", fontWeight: 600, fontSize: 12, whiteSpace: "nowrap" },
  td: { padding: "10px 12px", borderBottom: "1px solid #F3F4F6", color: "#374151", whiteSpace: "nowrap" },
  select: { padding: "8px 12px", border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 12, color: "#374151", background: "#fff", cursor: "pointer", outline: "none" },
};
