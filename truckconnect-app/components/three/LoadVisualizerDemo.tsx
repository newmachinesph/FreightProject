"use client"

import { useState, useCallback, useId } from "react"
import dynamic from "next/dynamic"
import type { CargoItem, TruckEntry } from "./LoadVisualizer"

const LoadVisualizer = dynamic(
  () => import("@/components/three/LoadVisualizer").then(m => ({ default: m.LoadVisualizer })),
  {
    ssr: false,
    loading: () => (
      <div style={{
        aspectRatio: "4/3",
        minHeight: 320,
        backgroundColor: "#0a0f1a",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
      }}>
        <div style={{
          width: 40,
          height: 40,
          border: "2px solid #334155",
          borderTopColor: "#34d399",
          borderRadius: "50%",
          animation: "lvd-spin 0.8s linear infinite",
        }} />
        <span style={{ fontSize: 13, color: "#64748b", letterSpacing: "0.05em" }}>Building 3D scene&hellip;</span>
        <style>{`@keyframes lvd-spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    ),
  }
)

const ITEM_COLORS = [
  "#4f7df0", "#e8913a", "#3bba6a", "#d45d5d", "#9b6fd4",
  "#d4709b", "#2ba897", "#c77830", "#617899", "#8b8b3d",
]

let nextId = 1
function makeId() { return `item-${nextId++}` }

function createItem(overrides?: Partial<CargoItem>): CargoItem {
  const id = makeId()
  return {
    id,
    label: overrides?.label || "Cargo",
    lengthFt: overrides?.lengthFt || 3,
    widthFt: overrides?.widthFt || 2,
    heightFt: overrides?.heightFt || 2,
    quantity: overrides?.quantity || 5,
    color: overrides?.color || ITEM_COLORS[0],
    allowSideways: overrides?.allowSideways ?? true,
  }
}

let nextTruckId = 1
function makeTruckId() { return `truck-${nextTruckId++}` }

interface Preset {
  label: string
  shortLabel: string
  trucks: { truckType: string }[]
  loadPct: number
  items: Omit<CargoItem, "id">[]
}

const PRESETS: Preset[] = [
  {
    label: "Rice Sacks to Cebu",
    shortLabel: "Rice",
    trucks: [{ truckType: "WING_VAN_10W" }],
    loadPct: 85,
    items: [
      { label: "Rice Sacks (50kg)", lengthFt: 2.5, widthFt: 1.5, heightFt: 1, quantity: 40, color: "#f59e0b", allowSideways: true },
      { label: "Wooden Pallets (48x40)", lengthFt: 4, widthFt: 3.3, heightFt: 0.5, quantity: 10, color: "#a1887f", allowSideways: true },
    ],
  },
  {
    label: "Canned Goods NCR Distribution",
    shortLabel: "Canned Goods",
    trucks: [{ truckType: "CLOSED_VAN_6W" }],
    loadPct: 90,
    items: [
      { label: "Canned Goods Cases (24-pk)", lengthFt: 1.5, widthFt: 1, heightFt: 1, quantity: 200, color: "#ef4444", allowSideways: true },
      { label: "Condiments Cases", lengthFt: 2, widthFt: 1.5, heightFt: 1.5, quantity: 50, color: "#ef4444", allowSideways: true },
      { label: "Snacks/Chips Boxes", lengthFt: 2.5, widthFt: 2, heightFt: 2, quantity: 30, color: "#ef4444", allowSideways: true },
    ],
  },
  {
    label: "Construction Materials Batangas",
    shortLabel: "Construction",
    trucks: [{ truckType: "FWD_TRUCK_6W" }, { truckType: "TRAILER_40FT" }],
    loadPct: 75,
    items: [
      { label: "Steel Bar Bundles (6m)", lengthFt: 20, widthFt: 1, heightFt: 1, quantity: 5, color: "#78716c", allowSideways: false },
      { label: "Cement Bags (40kg)", lengthFt: 2, widthFt: 1.5, heightFt: 0.5, quantity: 100, color: "#78716c", allowSideways: true },
      { label: "Plywood Sheets", lengthFt: 8, widthFt: 4, heightFt: 0.3, quantity: 20, color: "#a1887f", allowSideways: false },
      { label: "Hollow Blocks (per pallet)", lengthFt: 4, widthFt: 3.3, heightFt: 3, quantity: 4, color: "#78716c", allowSideways: false },
    ],
  },
  {
    label: "Frozen Seafood Mindanao",
    shortLabel: "Frozen Seafood",
    trucks: [{ truckType: "CLOSED_VAN_6W" }],
    loadPct: 80,
    items: [
      { label: "Frozen Tuna Boxes", lengthFt: 3, widthFt: 2, heightFt: 1.5, quantity: 60, color: "#06b6d4", allowSideways: true },
      { label: "Ice Blocks", lengthFt: 2, widthFt: 1, heightFt: 1, quantity: 40, color: "#06b6d4", allowSideways: true },
      { label: "Styrofoam Containers", lengthFt: 2.5, widthFt: 2, heightFt: 2, quantity: 25, color: "#06b6d4", allowSideways: false },
    ],
  },
  {
    label: "E-commerce Fulfillment Manila",
    shortLabel: "E-commerce",
    trucks: [{ truckType: "WING_VAN_10W" }],
    loadPct: 70,
    items: [
      { label: "Small Parcels", lengthFt: 1, widthFt: 0.8, heightFt: 0.5, quantity: 500, color: "#8b5cf6", allowSideways: true },
      { label: "Medium Boxes", lengthFt: 2, widthFt: 1.5, heightFt: 1, quantity: 100, color: "#8b5cf6", allowSideways: true },
      { label: "Large Appliance Boxes", lengthFt: 3, widthFt: 2.5, heightFt: 3, quantity: 10, color: "#8b5cf6", allowSideways: true },
      { label: "Bubble Wrap Rolls", lengthFt: 4, widthFt: 1, heightFt: 1, quantity: 15, color: "#8b5cf6", allowSideways: true },
    ],
  },
  {
    label: "Agricultural Products Visayas",
    shortLabel: "Agricultural",
    trucks: [{ truckType: "WING_VAN_10W" }],
    loadPct: 85,
    items: [
      { label: "Banana Crates", lengthFt: 2, widthFt: 1.5, heightFt: 1.5, quantity: 80, color: "#22c55e", allowSideways: true },
      { label: "Coconut Sacks", lengthFt: 3, widthFt: 2, heightFt: 2, quantity: 30, color: "#22c55e", allowSideways: true },
      { label: "Dried Fish Boxes", lengthFt: 2, widthFt: 1.5, heightFt: 1, quantity: 40, color: "#22c55e", allowSideways: true },
      { label: "Mango Crates", lengthFt: 2, widthFt: 1.5, heightFt: 1, quantity: 60, color: "#22c55e", allowSideways: true },
    ],
  },
]

// Verified PH truck types — cargo interior dims & payload from manufacturer specs
const TRUCK_OPTIONS = [
  { value: "L300_VAN",       label: "L300/Van",        maxTons: 1,    dims: "7\u00d74\u00d74 ft" },
  { value: "CLOSED_VAN_4W",  label: "4W Closed Van",   maxTons: 2.5,  dims: "9\u00d75.5\u00d75.5 ft" },
  { value: "CLOSED_VAN_6W",  label: "6W Closed Van",   maxTons: 4.5,  dims: "13\u00d76\u00d76 ft" },
  { value: "FWD_TRUCK_6W",   label: "6W Forward",      maxTons: 7,    dims: "17\u00d77\u00d77 ft" },
  { value: "WING_VAN_10W",   label: "10W Wing Van",    maxTons: 15,   dims: "32\u00d77.5\u00d77.5 ft" },
  { value: "TRAILER_40FT",   label: "40ft Trailer",    maxTons: 28,   dims: "40\u00d78\u00d78.5 ft" },
]

// ── Styled subcomponents ──

function DimensionInput({ id, label, value, min, max, step, onChange }: {
  id: string; label: string; value: number; min: number; max: number; step: number;
  onChange: (v: number) => void
}) {
  return (
    <div>
      <label
        htmlFor={id}
        style={{
          display: "block",
          fontSize: 10,
          fontWeight: 500,
          color: "#94a3b8",
          marginBottom: 2,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        {label}
      </label>
      <input
        id={id}
        type="number" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          width: "100%",
          boxSizing: "border-box",
          borderRadius: 6,
          border: "1px solid #334155",
          backgroundColor: "#1e293b",
          padding: "6px 8px",
          fontSize: 12,
          color: "#e2e8f0",
          fontVariantNumeric: "tabular-nums",
          outline: "none",
        }}
      />
    </div>
  )
}

function getTruckMaxTons(truckType: string): number {
  return TRUCK_OPTIONS.find(o => o.value === truckType)?.maxTons ?? 7
}

// ── Styles ──

const styles = {
  wrapper: {
    borderRadius: 16,
    overflow: "hidden" as const,
    backgroundColor: "#0f172a",
    boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
    border: "1px solid rgba(255,255,255,0.05)",
  },
  presetStrip: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    padding: "10px 12px",
    backgroundColor: "rgba(30,41,59,0.6)",
    borderBottom: "1px solid rgba(51,65,85,0.5)",
    overflowX: "auto" as const,
  },
  presetLabel: {
    fontSize: 10,
    fontWeight: 500,
    color: "#64748b",
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
    marginRight: 8,
    flexShrink: 0,
  },
  presetBtn: (isActive: boolean) => ({
    flexShrink: 0,
    borderRadius: 6,
    padding: "6px 12px",
    fontSize: 12,
    fontWeight: 500,
    border: isActive ? "1px solid rgba(52,211,153,0.3)" : "1px solid transparent",
    backgroundColor: isActive ? "rgba(52,211,153,0.15)" : "transparent",
    color: isActive ? "#6ee7b7" : "#94a3b8",
    cursor: "pointer",
    transition: "all 0.15s",
  }),
  grid: {
    display: "grid",
    gridTemplateColumns: "340px 1fr",
  } as React.CSSProperties,
  controlsPanel: {
    borderRight: "1px solid rgba(51,65,85,0.5)",
    padding: 16,
    maxHeight: 600,
    overflowY: "auto" as const,
    display: "flex",
    flexDirection: "column" as const,
    gap: 16,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: 500,
    color: "#94a3b8",
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
  },
  smallBtn: (bg: string, color: string) => ({
    borderRadius: 6,
    backgroundColor: bg,
    padding: "4px 10px",
    fontSize: 10,
    fontWeight: 500,
    color: color,
    border: "none",
    cursor: "pointer",
    minHeight: 28,
    transition: "all 0.15s",
  }),
  truckChip: (isActive: boolean) => ({
    borderRadius: 6,
    padding: "6px 10px",
    fontSize: 12,
    fontWeight: 500,
    border: isActive ? "1px solid rgba(52,211,153,0.3)" : "1px solid rgba(51,65,85,0.5)",
    backgroundColor: isActive ? "rgba(52,211,153,0.15)" : "#1e293b",
    color: isActive ? "#6ee7b7" : "#94a3b8",
    cursor: "pointer",
    transition: "all 0.15s",
  }),
  select: {
    width: "100%",
    boxSizing: "border-box" as const,
    borderRadius: 6,
    border: "1px solid #334155",
    backgroundColor: "#1e293b",
    padding: "8px 12px",
    fontSize: 13,
    color: "#e2e8f0",
    outline: "none",
  },
  cargoCard: {
    borderRadius: 8,
    backgroundColor: "rgba(30,41,59,0.8)",
    padding: 12,
    border: "1px solid rgba(51,65,85,0.5)",
  },
  colorDot: (c: string, isSelected: boolean) => ({
    width: 20,
    height: 20,
    borderRadius: "50%",
    backgroundColor: c,
    cursor: "pointer",
    transition: "transform 0.15s",
    border: "none",
    outline: isSelected ? "2px solid rgba(255,255,255,0.6)" : "1px solid rgba(255,255,255,0.1)",
    outlineOffset: 1,
    transform: isSelected ? "scale(1.1)" : "none",
  }),
}

// ══════════════════════════════════════
//  MAIN COMPONENT
// ══════════════════════════════════════

export function LoadVisualizerDemo() {
  const uid = useId()
  const [trucks, setTrucks] = useState<TruckEntry[]>([
    { id: makeTruckId(), truckType: "CLOSED_VAN_6W" },
  ])
  const [activeTruckIdx, setActiveTruckIdx] = useState(0)
  const [loadPct, setLoadPct] = useState(70)
  const [activePreset, setActivePreset] = useState<string | null>(null)
  const [items, setItems] = useState<CargoItem[]>([
    createItem({ label: "Boxes", lengthFt: 3, widthFt: 2, heightFt: 2, quantity: 8, color: ITEM_COLORS[0] }),
  ])

  const loadId = `${uid}-load`
  const currentTruck = trucks[activeTruckIdx] || trucks[0]

  // Compute total weight from truck capacities x load %
  const totalMaxTons = trucks.reduce((s, t) => s + getTruckMaxTons(t.truckType), 0)
  const weightTons = Math.round((totalMaxTons * loadPct / 100) * 10) / 10

  const addItem = useCallback(() => {
    setItems(prev => [
      ...prev,
      createItem({
        label: `Cargo ${prev.length + 1}`,
        color: ITEM_COLORS[prev.length % ITEM_COLORS.length],
      }),
    ])
    setActivePreset(null)
  }, [])

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(i => i.id !== id))
    setActivePreset(null)
  }, [])

  const updateItem = useCallback((id: string, field: keyof CargoItem, value: string | number | boolean) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, [field]: value } : i))
    setActivePreset(null)
  }, [])

  const addTruck = useCallback(() => {
    setTrucks(prev => [...prev, { id: makeTruckId(), truckType: "CLOSED_VAN_6W" }])
    setActiveTruckIdx(prev => prev + 1)
    setActivePreset(null)
  }, [])

  const removeTruck = useCallback((idx: number) => {
    setTrucks(prev => prev.filter((_, i) => i !== idx))
    setActiveTruckIdx(prev => Math.min(prev, trucks.length - 2))
    setActivePreset(null)
  }, [trucks.length])

  const updateTruckType = useCallback((idx: number, truckType: string) => {
    setTrucks(prev => prev.map((t, i) => i === idx ? { ...t, truckType } : t))
    setActivePreset(null)
  }, [])

  function applyPreset(p: Preset) {
    setTrucks(p.trucks.map(t => ({ id: makeTruckId(), truckType: t.truckType })))
    setActiveTruckIdx(0)
    setLoadPct(p.loadPct)
    setItems(p.items.map(item => createItem(item)))
    setActivePreset(p.label)
  }

  return (
    <div style={styles.wrapper}>
      {/* Preset strip */}
      <div style={styles.presetStrip} role="toolbar" aria-label="Load presets">
        <span style={styles.presetLabel}>Try</span>
        {PRESETS.map((p) => {
          const isActive = activePreset === p.label
          return (
            <button
              key={p.label}
              type="button"
              onClick={() => applyPreset(p)}
              aria-pressed={isActive}
              style={styles.presetBtn(isActive)}
            >
              {p.label}
            </button>
          )
        })}
      </div>

      <div style={styles.grid}>
        {/* Controls panel */}
        <div style={styles.controlsPanel}>
          {/* Trucks */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={styles.sectionLabel}>
                Trucks ({trucks.length})
              </span>
              <button
                type="button"
                onClick={addTruck}
                style={styles.smallBtn("#334155", "#cbd5e1")}
              >
                + Add Truck
              </button>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {trucks.map((truck, idx) => {
                const opt = TRUCK_OPTIONS.find(o => o.value === truck.truckType)
                const isActive = idx === activeTruckIdx
                return (
                  <div key={truck.id} style={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <button
                      type="button"
                      onClick={() => setActiveTruckIdx(idx)}
                      style={styles.truckChip(isActive)}
                    >
                      {opt?.label || truck.truckType}{" "}
                      <span style={{ fontSize: 10, opacity: 0.6 }}>#{idx + 1} &middot; {opt?.maxTons}T</span>
                    </button>
                    {trucks.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTruck(idx)}
                        style={{ background: "none", border: "none", color: "#475569", cursor: "pointer", fontSize: 14, padding: 4 }}
                        aria-label={`Remove truck #${idx + 1}`}
                      >
                        &times;
                      </button>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Active truck type selector */}
            <div style={{ marginTop: 8 }}>
              <label
                htmlFor={`${uid}-truck-${activeTruckIdx}`}
                style={{ display: "block", fontSize: 10, fontWeight: 500, color: "#94a3b8", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}
              >
                Truck #{activeTruckIdx + 1} Type
              </label>
              <select
                id={`${uid}-truck-${activeTruckIdx}`}
                value={currentTruck.truckType}
                onChange={(e) => updateTruckType(activeTruckIdx, e.target.value)}
                style={styles.select}
              >
                {TRUCK_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label} — {o.maxTons}T &middot; {o.dims}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Load % */}
          <div>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 6 }}>
              <label htmlFor={loadId} style={{ fontSize: 10, fontWeight: 500, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>Load</label>
              <span style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0", fontVariantNumeric: "tabular-nums" }}>
                {loadPct}<span style={{ color: "#64748b", fontWeight: 400, marginLeft: 2 }}>%</span>
                <span style={{ color: "#64748b", fontWeight: 400, marginLeft: 8, fontSize: 12 }}>{weightTons}T / {totalMaxTons}T</span>
              </span>
            </div>
            <input
              id={loadId}
              type="range" min={10} max={120} step={5} value={loadPct}
              onChange={(e) => { setLoadPct(Number(e.target.value)); setActivePreset(null) }}
              style={{
                width: "100%",
                height: 6,
                borderRadius: 9999,
                cursor: "pointer",
                accentColor: "#34d399",
                background: "#334155",
              }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#475569", marginTop: 4 }}>
              <span>10%</span><span>100%</span><span style={{ color: "rgba(239,68,68,0.6)" }}>120%</span>
            </div>
          </div>

          {/* Cargo items */}
          <div style={{ paddingTop: 8, borderTop: "1px solid rgba(51,65,85,0.5)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={styles.sectionLabel}>
                Cargo Items ({items.length})
              </span>
              <button
                type="button"
                onClick={addItem}
                style={{
                  borderRadius: 6,
                  backgroundColor: "#059669",
                  padding: "6px 12px",
                  fontSize: 12,
                  fontWeight: 500,
                  color: "#ffffff",
                  border: "none",
                  cursor: "pointer",
                  minHeight: 32,
                }}
              >
                + Add Item
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {items.map((item) => (
                <div key={item.id} style={styles.cargoCard}>
                  {/* Item header */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <div
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: 2,
                        flexShrink: 0,
                        border: "1px solid rgba(255,255,255,0.1)",
                        backgroundColor: item.color,
                      }}
                      aria-hidden="true"
                    />
                    <input
                      type="text"
                      value={item.label}
                      onChange={(e) => updateItem(item.id, "label", e.target.value)}
                      style={{
                        flex: 1,
                        background: "transparent",
                        fontSize: 12,
                        fontWeight: 500,
                        color: "#e2e8f0",
                        border: "none",
                        outline: "none",
                        minWidth: 0,
                      }}
                      placeholder="Item name"
                      aria-label="Cargo item name"
                    />
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#64748b",
                          fontSize: 12,
                          fontWeight: 500,
                          cursor: "pointer",
                          minWidth: 44,
                          minHeight: 28,
                          textAlign: "right" as const,
                        }}
                        aria-label={`Remove ${item.label}`}
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  {/* Dimensions */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 6, marginBottom: 10 }}>
                    <DimensionInput id={`${uid}-${item.id}-l`} label="L (ft)" value={item.lengthFt} min={0.5} max={32} step={0.5} onChange={(v) => updateItem(item.id, "lengthFt", v)} />
                    <DimensionInput id={`${uid}-${item.id}-w`} label="W (ft)" value={item.widthFt} min={0.5} max={8} step={0.5} onChange={(v) => updateItem(item.id, "widthFt", v)} />
                    <DimensionInput id={`${uid}-${item.id}-h`} label="H (ft)" value={item.heightFt} min={0.5} max={8.5} step={0.5} onChange={(v) => updateItem(item.id, "heightFt", v)} />
                    <DimensionInput id={`${uid}-${item.id}-q`} label="Qty" value={item.quantity} min={1} max={500} step={1} onChange={(v) => updateItem(item.id, "quantity", v)} />
                  </div>

                  {/* Sideways toggle + color */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", minHeight: 28 }}>
                      <input
                        type="checkbox"
                        checked={item.allowSideways !== false}
                        onChange={(e) => updateItem(item.id, "allowSideways", e.target.checked)}
                        style={{ width: 16, height: 16, cursor: "pointer", accentColor: "#34d399" }}
                      />
                      <span style={{ fontSize: 11, color: "#94a3b8" }}>Allow sideways loading</span>
                    </label>
                    <div style={{ display: "flex", gap: 6 }} role="radiogroup" aria-label={`Color for ${item.label}`}>
                      {ITEM_COLORS.slice(0, 6).map(c => (
                        <button
                          key={c}
                          type="button"
                          role="radio"
                          aria-checked={item.color === c}
                          aria-label={`Color ${c}`}
                          onClick={() => updateItem(item.id, "color", c)}
                          style={styles.colorDot(c, item.color === c)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3D Viewport */}
        <div style={{ position: "relative" }}>
          <LoadVisualizer
            trucks={trucks}
            weightTons={weightTons}
            items={items}
          />
        </div>
      </div>
    </div>
  )
}
