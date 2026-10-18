"use client";
import { useState } from "react";
import {
  Tag, Printer, Package, Search, Plus, Minus, X, CheckCircle, ArrowDownToLine, QrCode,
  Clock, FileText, Maximize2,
} from "lucide-react";
import { inventoryItems, inboundShipments } from "@/lib/mock-data";

interface LabelItem {
  id: string;
  sku: string;
  description: string;
  zone: string;
  location: string;
  expiryDate?: string;
  barcode?: string;
  qty: number;
}

type LabelTemplate = "standard" | "detailed" | "minimal";
type BarcodeFormat = "code128" | "code39" | "ean13";
type LabelSize = "2x1" | "4x2" | "4x6";

interface PrintJob {
  id: string;
  timestamp: string;
  itemCount: number;
  labelCount: number;
  template: LabelTemplate;
  status: "Completed" | "In Progress" | "Failed";
}

const LABEL_SIZE_MAP: Record<LabelSize, { label: string; width: number; height: number; scale: number }> = {
  "2x1": { label: "2\" x 1\"", width: 200, height: 100, scale: 0.55 },
  "4x2": { label: "4\" x 2\"", width: 380, height: 190, scale: 0.85 },
  "4x6": { label: "4\" x 6\"", width: 380, height: 540, scale: 1.0 },
};

const TEMPLATE_INFO: Record<LabelTemplate, { label: string; desc: string }> = {
  standard: { label: "Standard", desc: "Barcode + SKU + Product Name" },
  detailed: { label: "Detailed", desc: "All fields including zone, location, expiry" },
  minimal: { label: "Minimal", desc: "Barcode + SKU only" },
};

const initialPrintHistory: PrintJob[] = [
  { id: "PJ-001", timestamp: "2026-03-20 09:45", itemCount: 5, labelCount: 24, template: "standard", status: "Completed" },
  { id: "PJ-002", timestamp: "2026-03-19 14:22", itemCount: 12, labelCount: 48, template: "detailed", status: "Completed" },
  { id: "PJ-003", timestamp: "2026-03-19 08:10", itemCount: 3, labelCount: 9, template: "minimal", status: "Completed" },
  { id: "PJ-004", timestamp: "2026-03-18 16:33", itemCount: 8, labelCount: 32, template: "standard", status: "Failed" },
  { id: "PJ-005", timestamp: "2026-03-18 11:05", itemCount: 20, labelCount: 100, template: "detailed", status: "Completed" },
];

/* Generate a deterministic QR-like pattern from SKU string */
function generateQRPattern(sku: string): boolean[] {
  const cells: boolean[] = [];
  let hash = 0;
  for (let i = 0; i < sku.length; i++) {
    hash = ((hash << 5) - hash + sku.charCodeAt(i)) | 0;
  }
  for (let i = 0; i < 64; i++) {
    const row = Math.floor(i / 8);
    const col = i % 8;
    // QR corner patterns
    const isTopLeft = row < 3 && col < 3;
    const isTopRight = row < 3 && col > 4;
    const isBottomLeft = row > 4 && col < 3;
    if (isTopLeft || isTopRight || isBottomLeft) {
      // Finder pattern: solid border with empty center
      const isBorder = row === 0 || row === 2 || col === 0 || col === 2 || col === 5 || col === 7;
      const isCenter = (row === 1 && (col === 1 || col === 6)) || (row === 6 && col === 1);
      cells.push(isBorder || isCenter);
    } else {
      // Data: seeded from SKU hash
      cells.push(((hash * (i + 7) + i * 13) & 0xff) > 120);
    }
  }
  return cells;
}

/* Generate barcode bars from string, format-dependent look */
function generateBarcodePattern(code: string, format: BarcodeFormat): { width: number; filled: boolean }[] {
  const bars: { width: number; filled: boolean }[] = [];
  let seed = 0;
  for (let i = 0; i < code.length; i++) seed = ((seed << 3) + code.charCodeAt(i)) | 0;

  if (format === "ean13") {
    // EAN-13: start guard, 6 digits, center guard, 6 digits, end guard
    bars.push({ width: 1, filled: true }, { width: 1, filled: false }, { width: 1, filled: true }); // start
    for (let i = 0; i < 24; i++) {
      bars.push({ width: ((seed * (i + 1)) & 3) === 0 ? 2 : 1, filled: i % 2 === 0 });
    }
    bars.push({ width: 1, filled: false }, { width: 1, filled: true }, { width: 1, filled: false }, { width: 1, filled: true }, { width: 1, filled: false }); // center
    for (let i = 0; i < 24; i++) {
      bars.push({ width: ((seed * (i + 25)) & 3) === 0 ? 2 : 1, filled: i % 2 === 0 });
    }
    bars.push({ width: 1, filled: true }, { width: 1, filled: false }, { width: 1, filled: true }); // end
  } else if (format === "code39") {
    // Code 39: wider bars with gaps
    for (let i = 0; i < 35; i++) {
      const w = ((seed * (i + 3) + i * 7) & 7) > 4 ? 3 : ((seed * (i + 1)) & 3) > 1 ? 2 : 1;
      bars.push({ width: w, filled: i % 2 === 0 });
    }
  } else {
    // Code 128
    for (let i = 0; i < 40; i++) {
      const w = (i % 3 === 0) ? 3 : (i % 2 === 0) ? 2 : 1;
      bars.push({ width: w, filled: i % 2 === 0 || ((seed * i) & 3) === 0 });
    }
  }
  return bars;
}

export default function LabelsPage() {
  const [search, setSearch] = useState("");
  const [selectedItems, setSelectedItems] = useState<LabelItem[]>([]);
  const [previewItem, setPreviewItem] = useState<LabelItem | null>(null);
  const [batchMode, setBatchMode] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState("");
  const [printSuccess, setPrintSuccess] = useState(false);
  const [template, setTemplate] = useState<LabelTemplate>("standard");
  const [barcodeFormat, setBarcodeFormat] = useState<BarcodeFormat>("code128");
  const [labelSize, setLabelSize] = useState<LabelSize>("4x2");
  const [printHistory, setPrintHistory] = useState<PrintJob[]>(initialPrintHistory);

  const filteredInventory = inventoryItems.filter(
    (i) =>
      i.sku.toLowerCase().includes(search.toLowerCase()) ||
      i.description.toLowerCase().includes(search.toLowerCase()) ||
      i.category.toLowerCase().includes(search.toLowerCase())
  );

  const addItem = (item: typeof inventoryItems[0]) => {
    const exists = selectedItems.find((s) => s.id === item.id);
    if (exists) return;
    const labelItem: LabelItem = {
      id: item.id,
      sku: item.sku,
      description: item.description,
      zone: item.zone,
      location: item.location,
      expiryDate: item.expiryDate,
      barcode: item.barcode || `48000${item.sku.replace(/\D/g, "").padStart(7, "0")}`,
      qty: 1,
    };
    setSelectedItems([...selectedItems, labelItem]);
    if (!previewItem) setPreviewItem(labelItem);
  };

  const removeItem = (id: string) => {
    const updated = selectedItems.filter((s) => s.id !== id);
    setSelectedItems(updated);
    if (previewItem?.id === id) setPreviewItem(updated.length > 0 ? updated[0] : null);
  };

  const updateQty = (id: string, delta: number) => {
    setSelectedItems(
      selectedItems.map((s) =>
        s.id === id ? { ...s, qty: Math.max(1, Math.min(100, s.qty + delta)) } : s
      )
    );
  };

  const handleBatchAdd = () => {
    if (!selectedShipment) return;
    const shipment = inboundShipments.find((s) => s.id === selectedShipment);
    if (!shipment) return;
    const newItems: LabelItem[] = shipment.items.map((si) => {
      const inv = inventoryItems.find((i) => i.sku === si.sku);
      return {
        id: `batch-${si.sku}`,
        sku: si.sku,
        description: si.description,
        zone: inv?.zone || "Staging Area",
        location: inv?.location || "Pending",
        expiryDate: inv?.expiryDate,
        barcode: inv?.barcode || `48000${si.sku.replace(/\D/g, "").padStart(7, "0")}`,
        qty: si.qty,
      };
    });
    setSelectedItems((prev) => {
      const existingIds = new Set(prev.map((p) => p.sku));
      const unique = newItems.filter((n) => !existingIds.has(n.sku));
      return [...prev, ...unique];
    });
    if (!previewItem && newItems.length > 0) setPreviewItem(newItems[0]);
  };

  const handlePrint = () => {
    const newJob: PrintJob = {
      id: `PJ-${String(printHistory.length + 1).padStart(3, "0")}`,
      timestamp: new Date().toISOString().replace("T", " ").slice(0, 16),
      itemCount: selectedItems.length,
      labelCount: totalLabels,
      template,
      status: "Completed",
    };
    setPrintHistory([newJob, ...printHistory].slice(0, 5));
    setPrintSuccess(true);
    setTimeout(() => setPrintSuccess(false), 3000);
  };

  const totalLabels = selectedItems.reduce((sum, s) => sum + s.qty, 0);
  const sizeConfig = LABEL_SIZE_MAP[labelSize];

  const pendingShipments = inboundShipments.filter(
    (s) => s.status === "In Transit" || s.status === "At Dock" || s.status === "Received"
  );

  const selectedShipmentData = inboundShipments.find((s) => s.id === selectedShipment);

  return (
    <>
      <header style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111827", margin: 0 }}>Labels / Barcodes</h1>
        <p style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}>Generate and print labels for inventory items and inbound shipments.</p>
      </header>

      {/* Mode toggle */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <button
          onClick={() => setBatchMode(false)}
          style={{
            padding: "8px 20px", borderRadius: 8, border: "1px solid #E5E7EB", cursor: "pointer",
            background: !batchMode ? "#7C3AED" : "#fff", color: !batchMode ? "#fff" : "#374151",
            fontWeight: 600, fontSize: 13,
          }}
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <Package size={14} /> Individual Items
          </span>
        </button>
        <button
          onClick={() => setBatchMode(true)}
          style={{
            padding: "8px 20px", borderRadius: 8, border: "1px solid #E5E7EB", cursor: "pointer",
            background: batchMode ? "#7C3AED" : "#fff", color: batchMode ? "#fff" : "#374151",
            fontWeight: 600, fontSize: 13,
          }}
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <ArrowDownToLine size={14} /> Batch from Shipment
          </span>
        </button>
      </div>

      {/* ── Label Configuration Row ──────────────── */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 20,
      }}>
        {/* Template Selection */}
        <div style={s.card}>
          <h4 style={{ fontSize: 13, fontWeight: 700, color: "#111827", margin: "0 0 10px" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><FileText size={14} color="#7C3AED" /> Label Template</span>
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {(["standard", "detailed", "minimal"] as LabelTemplate[]).map((t) => (
              <label key={t} style={{
                display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", borderRadius: 8,
                border: template === t ? "1.5px solid #7C3AED" : "1px solid #E5E7EB",
                background: template === t ? "#F5F3FF" : "#fff", cursor: "pointer",
              }}>
                <input
                  type="radio" name="template" checked={template === t}
                  onChange={() => setTemplate(t)}
                  style={{ accentColor: "#7C3AED" }}
                />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#111827" }}>{TEMPLATE_INFO[t].label}</div>
                  <div style={{ fontSize: 10, color: "#6B7280" }}>{TEMPLATE_INFO[t].desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Barcode Format */}
        <div style={s.card}>
          <h4 style={{ fontSize: 13, fontWeight: 700, color: "#111827", margin: "0 0 10px" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Tag size={14} color="#7C3AED" /> Barcode Format</span>
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {([
              { value: "code128" as BarcodeFormat, label: "Code 128", desc: "High density, alphanumeric" },
              { value: "code39" as BarcodeFormat, label: "Code 39", desc: "Alphanumeric, wide adoption" },
              { value: "ean13" as BarcodeFormat, label: "EAN-13", desc: "International retail standard" },
            ]).map((f) => (
              <label key={f.value} style={{
                display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", borderRadius: 8,
                border: barcodeFormat === f.value ? "1.5px solid #7C3AED" : "1px solid #E5E7EB",
                background: barcodeFormat === f.value ? "#F5F3FF" : "#fff", cursor: "pointer",
              }}>
                <input
                  type="radio" name="barcodeFormat" checked={barcodeFormat === f.value}
                  onChange={() => setBarcodeFormat(f.value)}
                  style={{ accentColor: "#7C3AED" }}
                />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#111827" }}>{f.label}</div>
                  <div style={{ fontSize: 10, color: "#6B7280" }}>{f.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Label Size */}
        <div style={s.card}>
          <h4 style={{ fontSize: 13, fontWeight: 700, color: "#111827", margin: "0 0 10px" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Maximize2 size={14} color="#7C3AED" /> Label Size</span>
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {(["2x1", "4x2", "4x6"] as LabelSize[]).map((sz) => (
              <label key={sz} style={{
                display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", borderRadius: 8,
                border: labelSize === sz ? "1.5px solid #7C3AED" : "1px solid #E5E7EB",
                background: labelSize === sz ? "#F5F3FF" : "#fff", cursor: "pointer",
              }}>
                <input
                  type="radio" name="labelSize" checked={labelSize === sz}
                  onChange={() => setLabelSize(sz)}
                  style={{ accentColor: "#7C3AED" }}
                />
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{
                    width: LABEL_SIZE_MAP[sz].width * 0.08, height: LABEL_SIZE_MAP[sz].height * 0.08,
                    border: "1.5px solid #7C3AED", borderRadius: 2, background: labelSize === sz ? "#EDE9FE" : "#F9FAFB",
                  }} />
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#111827" }}>{LABEL_SIZE_MAP[sz].label}</div>
                    <div style={{ fontSize: 10, color: "#6B7280" }}>{LABEL_SIZE_MAP[sz].width / 10}mm x {LABEL_SIZE_MAP[sz].height / 10}mm</div>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Left Column: Item selection */}
        <div>
          {/* Batch shipment selector */}
          {batchMode && (
            <div style={s.card}>
              <h3 style={s.cardTitle}>Select Inbound Shipment</h3>
              <p style={{ fontSize: 12, color: "#6B7280", margin: "4px 0 12px" }}>Generate labels for all items in a shipment.</p>
              <div style={{ display: "flex", gap: 8 }}>
                <select
                  value={selectedShipment}
                  onChange={(e) => setSelectedShipment(e.target.value)}
                  style={{
                    flex: 1, padding: "8px 12px", borderRadius: 8, border: "1px solid #E5E7EB",
                    fontSize: 13, background: "#fff", color: "#111827",
                  }}
                >
                  <option value="">-- Select a shipment --</option>
                  {pendingShipments.map((sh) => (
                    <option key={sh.id} value={sh.id}>
                      {sh.id} &mdash; {sh.shipper} ({sh.items.length} items) [{sh.status}]
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleBatchAdd}
                  disabled={!selectedShipment}
                  style={{
                    padding: "8px 16px", borderRadius: 8, border: "none", cursor: selectedShipment ? "pointer" : "not-allowed",
                    background: selectedShipment ? "#7C3AED" : "#E5E7EB", color: selectedShipment ? "#fff" : "#9CA3AF",
                    fontWeight: 600, fontSize: 13,
                  }}
                >
                  Add All Items
                </button>
              </div>

              {/* Batch shipment item preview */}
              {selectedShipmentData && (
                <div style={{ marginTop: 14, padding: "10px 12px", background: "#F5F3FF", borderRadius: 8 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#7C3AED", marginBottom: 8 }}>
                    Shipment Items ({selectedShipmentData.items.length})
                  </div>
                  {selectedShipmentData.items.map((si, idx) => (
                    <div key={idx} style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      padding: "4px 0", borderBottom: idx < selectedShipmentData.items.length - 1 ? "1px solid #EDE9FE" : "none",
                    }}>
                      <div>
                        <span style={{ fontSize: 11, fontWeight: 600, color: "#111827" }}>{si.description}</span>
                        <span style={{ fontSize: 10, color: "#6B7280", marginLeft: 6, fontFamily: "monospace" }}>{si.sku}</span>
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 600, color: "#7C3AED" }}>x{si.qty}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Individual item search */}
          {!batchMode && (
            <div style={s.card}>
              <h3 style={s.cardTitle}>Search Inventory</h3>
              <div style={{ position: "relative", marginTop: 12 }}>
                <Search size={16} style={{ position: "absolute", left: 12, top: 10, color: "#9CA3AF" }} />
                <input
                  type="text"
                  placeholder="Search by SKU, name, or category..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    width: "100%", padding: "8px 12px 8px 36px", borderRadius: 8,
                    border: "1px solid #E5E7EB", fontSize: 13, boxSizing: "border-box",
                  }}
                />
              </div>
              <div style={{ maxHeight: 360, overflowY: "auto", marginTop: 12 }}>
                {filteredInventory.slice(0, 20).map((item) => {
                  const isSelected = selectedItems.some((s) => s.id === item.id);
                  return (
                    <div
                      key={item.id}
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "8px 10px", borderBottom: "1px solid #F3F4F6",
                        background: isSelected ? "#F5F3FF" : "transparent",
                      }}
                    >
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "#111827" }}>{item.description}</div>
                        <div style={{ fontSize: 11, color: "#6B7280" }}>
                          <span style={{ fontFamily: "monospace", color: "#7C3AED" }}>{item.sku}</span>
                          {" "}&middot; {item.zone} &middot; {item.location}
                        </div>
                      </div>
                      <button
                        onClick={() => isSelected ? removeItem(item.id) : addItem(item)}
                        style={{
                          padding: "4px 10px", borderRadius: 6, border: "none", cursor: "pointer",
                          background: isSelected ? "#FEE2E2" : "#7C3AED14",
                          color: isSelected ? "#DC2626" : "#7C3AED",
                          fontSize: 11, fontWeight: 600, flexShrink: 0,
                        }}
                      >
                        {isSelected ? "Remove" : "Add"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Selected items queue */}
          <div style={s.card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <h3 style={s.cardTitle}>Label Queue ({selectedItems.length} items, {totalLabels} labels)</h3>
              {selectedItems.length > 0 && (
                <button
                  onClick={() => { setSelectedItems([]); setPreviewItem(null); }}
                  style={{ padding: "4px 10px", borderRadius: 6, border: "none", cursor: "pointer", background: "#FEE2E2", color: "#DC2626", fontSize: 11, fontWeight: 600 }}
                >
                  Clear All
                </button>
              )}
            </div>
            {selectedItems.length === 0 ? (
              <div style={{ padding: 24, textAlign: "center", color: "#9CA3AF", fontSize: 13 }}>
                No items selected. Search and add items above.
              </div>
            ) : (
              <div style={{ maxHeight: 240, overflowY: "auto" }}>
                {selectedItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setPreviewItem(item)}
                    style={{
                      display: "flex", alignItems: "center", gap: 10, padding: "8px 10px",
                      borderBottom: "1px solid #F3F4F6", cursor: "pointer",
                      background: previewItem?.id === item.id ? "#F5F3FF" : "transparent",
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "#111827", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {item.description}
                      </div>
                      <div style={{ fontSize: 11, color: "#6B7280", fontFamily: "monospace" }}>{item.sku}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                      <button onClick={(e) => { e.stopPropagation(); updateQty(item.id, -1); }} style={s.qtyBtn}><Minus size={12} /></button>
                      <span style={{ width: 28, textAlign: "center", fontSize: 13, fontWeight: 700 }}>{item.qty}</span>
                      <button onClick={(e) => { e.stopPropagation(); updateQty(item.id, 1); }} style={s.qtyBtn}><Plus size={12} /></button>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); removeItem(item.id); }}
                      style={{ padding: 4, border: "none", background: "transparent", cursor: "pointer", color: "#DC2626" }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Print button */}
            {selectedItems.length > 0 && (
              <button
                onClick={handlePrint}
                style={{
                  width: "100%", padding: "12px 0", borderRadius: 8, border: "none", cursor: "pointer",
                  background: "#7C3AED", color: "#fff", fontSize: 14, fontWeight: 700, marginTop: 16,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                }}
              >
                <Printer size={18} />
                Print {totalLabels} Label{totalLabels !== 1 ? "s" : ""} ({TEMPLATE_INFO[template].label}, {LABEL_SIZE_MAP[labelSize].label})
              </button>
            )}

            {/* Print success message */}
            {printSuccess && (
              <div style={{
                marginTop: 12, padding: "10px 14px", borderRadius: 8,
                background: "#D1FAE5", color: "#065F46", fontSize: 13, fontWeight: 600,
                display: "flex", alignItems: "center", gap: 8,
              }}>
                <CheckCircle size={16} />
                {totalLabels} label{totalLabels !== 1 ? "s" : ""} sent to printer queue successfully.
              </div>
            )}
          </div>

          {/* Print Job Queue / History */}
          <div style={s.card}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <Clock size={16} color="#7C3AED" />
              <h3 style={s.cardTitle}>Print History</h3>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {printHistory.map((job, idx) => (
                <div key={job.id} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "10px 0", borderBottom: idx < printHistory.length - 1 ? "1px solid #F3F4F6" : "none",
                }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#111827" }}>{job.id}</div>
                    <div style={{ fontSize: 11, color: "#6B7280" }}>
                      {job.timestamp} &middot; {job.itemCount} items &middot; {job.labelCount} labels &middot; {TEMPLATE_INFO[job.template].label}
                    </div>
                  </div>
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 8,
                    background: job.status === "Completed" ? "#D1FAE5" : job.status === "In Progress" ? "#FEF3C7" : "#FEE2E2",
                    color: job.status === "Completed" ? "#065F46" : job.status === "In Progress" ? "#92400E" : "#991B1B",
                  }}>
                    {job.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Label Preview */}
        <div>
          <div style={s.card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={s.cardTitle}>Label Preview</h3>
              {previewItem && (
                <span style={{ fontSize: 11, color: "#6B7280", background: "#F3F4F6", padding: "3px 10px", borderRadius: 6 }}>
                  {LABEL_SIZE_MAP[labelSize].label} &middot; {TEMPLATE_INFO[template].label} &middot; {barcodeFormat === "code128" ? "Code 128" : barcodeFormat === "code39" ? "Code 39" : "EAN-13"}
                </span>
              )}
            </div>

            {!previewItem ? (
              <div style={{ padding: 60, textAlign: "center", color: "#9CA3AF", fontSize: 13, border: "2px dashed #E5E7EB", borderRadius: 12 }}>
                Select an item to preview its label.
              </div>
            ) : (
              <div style={{
                display: "flex", justifyContent: "center", alignItems: "center",
                background: "#F9FAFB", borderRadius: 12, padding: 24, minHeight: 200,
              }}>
                <div style={{
                  border: "2px solid #111827", borderRadius: 8,
                  padding: labelSize === "2x1" ? 10 : labelSize === "4x2" ? 18 : 24,
                  background: "#fff",
                  width: sizeConfig.width, minHeight: sizeConfig.height,
                  transform: `scale(${sizeConfig.scale})`, transformOrigin: "top center",
                  boxSizing: "border-box",
                  display: "flex", flexDirection: "column", justifyContent: "space-between",
                }}>
                  {/* Label header - standard & detailed */}
                  {template !== "minimal" && (
                    <div style={{
                      display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                      marginBottom: labelSize === "4x6" ? 16 : 10,
                      paddingBottom: labelSize === "4x6" ? 12 : 8,
                      borderBottom: "2px solid #111827",
                    }}>
                      <div>
                        <div style={{ fontSize: labelSize === "2x1" ? 7 : 10, color: "#6B7280", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>TruckConnect Warehouse</div>
                        <div style={{ fontSize: labelSize === "2x1" ? 6 : 9, color: "#9CA3AF", marginTop: 1 }}>Clark Freeport Zone</div>
                      </div>
                      <Tag size={labelSize === "2x1" ? 12 : 20} color="#111827" />
                    </div>
                  )}

                  {/* Barcode */}
                  <div style={{ textAlign: "center", marginBottom: labelSize === "4x6" ? 16 : 10 }}>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 0, height: labelSize === "2x1" ? 28 : labelSize === "4x6" ? 60 : 44 }}>
                      {generateBarcodePattern(previewItem.barcode || previewItem.sku, barcodeFormat).map((bar, i) => (
                        <div
                          key={i}
                          style={{
                            width: bar.width * (labelSize === "2x1" ? 0.7 : 1),
                            height: bar.filled ? "100%" : 0,
                            background: bar.filled ? "#111827" : "transparent",
                            marginRight: bar.filled ? 0 : bar.width * (labelSize === "2x1" ? 0.7 : 1),
                          }}
                        />
                      ))}
                    </div>
                    <div style={{
                      fontSize: labelSize === "2x1" ? 8 : 11, fontFamily: "monospace", color: "#374151",
                      marginTop: 3, letterSpacing: 2,
                    }}>
                      {previewItem.barcode}
                    </div>
                    <div style={{ fontSize: labelSize === "2x1" ? 6 : 9, color: "#9CA3AF", marginTop: 1 }}>
                      {barcodeFormat === "code128" ? "Code 128" : barcodeFormat === "code39" ? "Code 39" : "EAN-13"}
                    </div>
                  </div>

                  {/* SKU */}
                  <div style={{ marginBottom: labelSize === "4x6" ? 14 : 8 }}>
                    <div style={{ fontSize: labelSize === "2x1" ? 6 : 9, color: "#6B7280", textTransform: "uppercase", letterSpacing: 1, marginBottom: 1 }}>SKU</div>
                    <div style={{ fontSize: labelSize === "2x1" ? 12 : 20, fontWeight: 800, fontFamily: "monospace", color: "#111827" }}>{previewItem.sku}</div>
                  </div>

                  {/* Product name - standard & detailed */}
                  {template !== "minimal" && (
                    <div style={{ marginBottom: labelSize === "4x6" ? 14 : 8 }}>
                      <div style={{ fontSize: labelSize === "2x1" ? 6 : 9, color: "#6B7280", textTransform: "uppercase", letterSpacing: 1, marginBottom: 1 }}>Product</div>
                      <div style={{ fontSize: labelSize === "2x1" ? 9 : 14, fontWeight: 700, color: "#111827" }}>{previewItem.description}</div>
                    </div>
                  )}

                  {/* Zone & Location - detailed only */}
                  {template === "detailed" && (
                    <>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: labelSize === "4x6" ? 14 : 8 }}>
                        <div>
                          <div style={{ fontSize: labelSize === "2x1" ? 6 : 9, color: "#6B7280", textTransform: "uppercase", letterSpacing: 1, marginBottom: 1 }}>Zone</div>
                          <div style={{ fontSize: labelSize === "2x1" ? 9 : 13, fontWeight: 700, color: "#374151" }}>{previewItem.zone}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: labelSize === "2x1" ? 6 : 9, color: "#6B7280", textTransform: "uppercase", letterSpacing: 1, marginBottom: 1 }}>Location</div>
                          <div style={{ fontSize: labelSize === "2x1" ? 9 : 13, fontWeight: 700, fontFamily: "monospace", color: "#374151" }}>{previewItem.location}</div>
                        </div>
                      </div>

                      {previewItem.expiryDate && (
                        <div style={{ marginBottom: labelSize === "4x6" ? 14 : 8 }}>
                          <div style={{ fontSize: labelSize === "2x1" ? 6 : 9, color: "#6B7280", textTransform: "uppercase", letterSpacing: 1, marginBottom: 1 }}>Expiry Date</div>
                          <div style={{
                            fontSize: labelSize === "2x1" ? 9 : 14, fontWeight: 700, color: "#DC2626",
                            padding: "3px 8px", background: "#FEE2E2", borderRadius: 4, display: "inline-block",
                          }}>
                            {previewItem.expiryDate}
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* QR code + footer */}
                  <div style={{
                    display: "flex", justifyContent: "space-between", alignItems: "flex-end",
                    paddingTop: labelSize === "4x6" ? 12 : 8, borderTop: "1px dashed #D1D5DB",
                  }}>
                    <div style={{
                      width: labelSize === "2x1" ? 36 : 56, height: labelSize === "2x1" ? 36 : 56,
                      border: "2px solid #111827", borderRadius: 3,
                      display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gridTemplateRows: "repeat(8, 1fr)", gap: 0,
                      overflow: "hidden",
                    }}>
                      {generateQRPattern(previewItem.sku).map((filled, i) => (
                        <div key={i} style={{ background: filled ? "#111827" : "#fff" }} />
                      ))}
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: labelSize === "2x1" ? 6 : 9, color: "#9CA3AF" }}>Generated: 2026-03-20</div>
                      <div style={{ fontSize: labelSize === "2x1" ? 6 : 9, color: "#9CA3AF" }}>Qty: {previewItem.qty}</div>
                      <div style={{ fontSize: labelSize === "2x1" ? 5 : 8, color: "#D1D5DB", marginTop: 2 }}>
                        {LABEL_SIZE_MAP[labelSize].label}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Label size info */}
            {previewItem && (
              <div style={{ textAlign: "center", marginTop: 16, fontSize: 11, color: "#9CA3AF" }}>
                Label size: {LABEL_SIZE_MAP[labelSize].label} &middot; {TEMPLATE_INFO[template].label} template &middot; Thermal printer compatible
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

const s: Record<string, React.CSSProperties> = {
  card: { background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: "20px 24px", marginBottom: 20 },
  cardTitle: { fontSize: 16, fontWeight: 700, color: "#111827", margin: 0 },
  qtyBtn: {
    width: 24, height: 24, borderRadius: 6, border: "1px solid #E5E7EB", background: "#F9FAFB",
    display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", padding: 0,
  },
};
