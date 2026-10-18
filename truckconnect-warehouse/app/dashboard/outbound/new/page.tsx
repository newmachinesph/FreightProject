"use client";
import { useState, useMemo } from "react";
import {
  ArrowLeft, Search, Plus, Trash2, CheckCircle, Package, Truck,
  ArrowRight, ArrowLeftIcon, User, ShoppingCart, ClipboardList,
  Calendar, AlertTriangle, Box, Clock, Shield,
} from "lucide-react";
import { inventoryItems, knownCarriers } from "@/lib/mock-data";

const PURPLE = "#7C3AED";
const PURPLE_LIGHT = "#F5F3FF";
const PURPLE_BORDER = "#DDD6FE";

interface PickedItem {
  id: string;
  sku: string;
  description: string;
  available: number;
  qty: number;
  uom: string;
  weight?: number;
}

// Mock customers
const customers = [
  { id: "cust-1", name: "SM Hypermarket - MOA", address: "SM Mall of Asia, J.W. Diokno Blvd, Pasay City 1300" },
  { id: "cust-2", name: "Mercury Drug - QC Branch", address: "Mercury Drug Warehouse, Quezon Ave, Quezon City 1100" },
  { id: "cust-3", name: "Lazada Fulfillment Center", address: "Lazada Warehouse, Laguna Technopark, Binan, Laguna 4024" },
  { id: "cust-4", name: "Robinsons Supermarket - Cebu", address: "Robinsons Galleria Cebu, Gen. Maxilom Ave, Cebu City 6000" },
  { id: "cust-5", name: "Puregold - Clark", address: "Puregold Price Club, M.A. Roxas Hwy, Clark Freeport Zone 2023" },
  { id: "cust-6", name: "7-Eleven Distribution Center", address: "7-Eleven Philippines DC, Lawton Ave, Taguig City 1630" },
  { id: "cust-7", name: "Shopee Fulfillment Hub", address: "Shopee Xpress Hub, Dr. A. Santos Ave, Paranaque City 1700" },
  { id: "cust-8", name: "Watsons - Makati", address: "Watsons Warehouse, Chino Roces Ave, Makati City 1230" },
];

// Carrier capacities
const carrierDetails: Record<string, { type: string; maxWeight: number; maxItems: number }> = {
  "JRS Express Trucking": { type: "6-Wheeler Truck", maxWeight: 5000, maxItems: 200 },
  "Luen Thai Logistics": { type: "Reefer Van", maxWeight: 3000, maxItems: 120 },
  "2GO Cargo": { type: "Cargo Van", maxWeight: 4000, maxItems: 180 },
  "Maersk Philippines": { type: "Container Ship", maxWeight: 20000, maxItems: 2000 },
  "Entrego Freight": { type: "10-Wheeler Truck", maxWeight: 8000, maxItems: 400 },
  "Ninja Van Freight": { type: "Closed Van", maxWeight: 2000, maxItems: 100 },
  "Evergreen Shipping": { type: "Container Ship", maxWeight: 20000, maxItems: 2000 },
  "Flash Express": { type: "L300 Van", maxWeight: 1000, maxItems: 60 },
  "LBC Express Cargo": { type: "Wing Van", maxWeight: 6000, maxItems: 300 },
  "Transportify": { type: "4-Wheeler Truck", maxWeight: 3000, maxItems: 150 },
  "Lalamove Truck": { type: "Small Truck", maxWeight: 1500, maxItems: 80 },
  "AP Cargo": { type: "Cargo Van", maxWeight: 3500, maxItems: 160 },
};

// Priority levels
const priorities = [
  { value: "standard", label: "Standard", days: 5, color: "#6B7280", bg: "#F3F4F6" },
  { value: "express", label: "Express", days: 2, color: "#D97706", bg: "#FEF3C7" },
  { value: "rush", label: "Rush", days: 1, color: "#DC2626", bg: "#FEE2E2" },
];

const wizardSteps = [
  { key: "customer", label: "Select Customer", icon: User },
  { key: "items", label: "Select Items", icon: ShoppingCart },
  { key: "carrier", label: "Assign Carrier", icon: Truck },
  { key: "review", label: "Review & Submit", icon: ClipboardList },
] as const;

export default function CreateOutboundPage() {
  const [step, setStep] = useState(0);
  const [selectedCustomer, setSelectedCustomer] = useState<typeof customers[0] | null>(null);
  const [customConsignee, setCustomConsignee] = useState("");
  const [customAddress, setCustomAddress] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [customerSearch, setCustomerSearch] = useState("");
  const [pickedItems, setPickedItems] = useState<PickedItem[]>([]);
  const [carrier, setCarrier] = useState("");
  const [priority, setPriority] = useState("standard");
  const [shipByDate, setShipByDate] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const consignee = selectedCustomer?.name || customConsignee;
  const deliveryAddress = selectedCustomer?.address || customAddress;

  const availableItems = inventoryItems.filter(
    (i) => i.status !== "expired" && i.qtyOnHand > 0 && !pickedItems.find((p) => p.id === i.id)
  );

  const filteredItems = searchQuery === ""
    ? availableItems.slice(0, 10)
    : availableItems.filter(
        (i) =>
          i.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
          i.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          i.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 10);

  const filteredCustomers = customerSearch === ""
    ? customers
    : customers.filter(c => c.name.toLowerCase().includes(customerSearch.toLowerCase()));

  const addItem = (item: typeof inventoryItems[0]) => {
    setPickedItems((prev) => [...prev, {
      id: item.id,
      sku: item.sku,
      description: item.description,
      available: item.qtyOnHand,
      qty: 1,
      uom: item.uom,
      weight: item.weight,
    }]);
    setSearchQuery("");
  };

  const removeItem = (id: string) => {
    setPickedItems((prev) => prev.filter((p) => p.id !== id));
  };

  const updateQty = (id: string, qty: number) => {
    setPickedItems((prev) => prev.map((p) => p.id === id ? { ...p, qty: Math.max(1, Math.min(qty, p.available)) } : p));
  };

  const waybillNumber = useMemo(() => `DR-2026-${String(7000 + Math.floor(Math.random() * 1000)).padStart(4, "0")}`, []);

  const totalWeight = pickedItems.reduce((acc, p) => acc + (p.weight || 0) * p.qty, 0);
  const totalItems = pickedItems.reduce((acc, p) => acc + p.qty, 0);
  const selectedCarrierInfo = carrierDetails[carrier];
  const carrierCapacityOk = selectedCarrierInfo ? totalWeight <= selectedCarrierInfo.maxWeight && totalItems <= selectedCarrierInfo.maxItems : true;

  // Compute ship-by date based on priority
  const computedShipBy = useMemo(() => {
    if (shipByDate) return shipByDate;
    const p = priorities.find(pr => pr.value === priority);
    const d = new Date("2026-03-20");
    d.setDate(d.getDate() + (p?.days || 5));
    return d.toISOString().split("T")[0];
  }, [priority, shipByDate]);

  const canProceed = [
    // Step 0: Customer
    consignee.trim() !== "" && deliveryAddress.trim() !== "",
    // Step 1: Items
    pickedItems.length > 0 && pickedItems.every((p) => p.qty > 0 && p.qty <= p.available),
    // Step 2: Carrier
    carrier !== "" && carrierCapacityOk,
    // Step 3: Review (always true if previous steps ok)
    true,
  ];

  if (submitted) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <div style={{
          width: 80, height: 80, borderRadius: "50%", background: "#D1FAE5",
          display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px",
        }}>
          <CheckCircle size={40} color="#059669" />
        </div>
        <h2 style={{ color: "#111827", marginTop: 16 }}>Outbound Order Created</h2>
        <p style={{ color: "#6B7280", marginTop: 8 }}>
          Waybill: <strong style={{ color: PURPLE }}>{waybillNumber}</strong> &mdash; {pickedItems.length} item(s) assigned to {carrier}
        </p>
        <div style={{ padding: "16px 24px", background: PURPLE_LIGHT, borderRadius: 10, border: `1px solid ${PURPLE_BORDER}`, display: "inline-block", marginTop: 16 }}>
          <div style={{ fontSize: 12, color: "#6B7280" }}>Ship to</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{consignee}</div>
          <div style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>by {computedShipBy}</div>
        </div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 24 }}>
          <a href="/dashboard/outbound" style={{ padding: "10px 20px", borderRadius: 8, background: PURPLE, color: "#fff", textDecoration: "none", fontWeight: 600, fontSize: 14 }}>
            Back to Outbound
          </a>
          <a href="/dashboard/outbound/new" style={{ padding: "10px 20px", borderRadius: 8, background: "#F3F4F6", color: "#374151", textDecoration: "none", fontWeight: 600, fontSize: 14 }}>
            Create Another
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      <a href="/dashboard/outbound" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#6B7280", textDecoration: "none", fontSize: 13, marginBottom: 20 }}>
        <ArrowLeft size={14} /> Back to Outbound
      </a>

      <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111827", margin: "0 0 4px" }}>Create Outbound Shipment</h1>
      <p style={{ fontSize: 14, color: "#6B7280", marginTop: 0, marginBottom: 24 }}>Step-by-step order creation wizard</p>

      {/* Step Wizard Progress */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, marginBottom: 32, padding: "0 20px" }}>
        {wizardSteps.map((ws, idx) => {
          const Icon = ws.icon;
          const isActive = idx === step;
          const isCompleted = idx < step;
          return (
            <div key={ws.key} style={{ display: "flex", alignItems: "center", flex: idx < wizardSteps.length - 1 ? 1 : "none" }}>
              <div
                onClick={() => { if (idx < step) setStep(idx); }}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center", cursor: idx < step ? "pointer" : "default",
                  position: "relative", minWidth: 80,
                }}
              >
                <div style={{
                  width: isActive ? 44 : 38, height: isActive ? 44 : 38, borderRadius: "50%",
                  background: isCompleted ? PURPLE : isActive ? PURPLE : "#E5E7EB",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  border: isActive ? `3px solid ${PURPLE}40` : "none",
                  boxShadow: isActive ? `0 0 0 4px ${PURPLE}15` : "none",
                  transition: "all 0.3s",
                }}>
                  {isCompleted ? (
                    <CheckCircle size={18} color="#fff" />
                  ) : (
                    <Icon size={18} color={isActive ? "#fff" : "#9CA3AF"} />
                  )}
                </div>
                <span style={{
                  fontSize: 11, fontWeight: isActive ? 700 : 500, marginTop: 6,
                  color: isCompleted || isActive ? PURPLE : "#9CA3AF",
                  whiteSpace: "nowrap",
                }}>
                  {ws.label}
                </span>
              </div>
              {idx < wizardSteps.length - 1 && (
                <div style={{ flex: 1, height: 3, background: "#E5E7EB", margin: "0 8px", marginBottom: 20, borderRadius: 2, overflow: "hidden" }}>
                  <div style={{
                    height: "100%", borderRadius: 2, transition: "width 0.4s",
                    width: isCompleted ? "100%" : "0%",
                    background: `linear-gradient(90deg, ${PURPLE}, #A78BFA)`,
                  }} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Step 1: Select Customer */}
      {step === 0 && (
        <div style={s.card}>
          <h3 style={s.cardTitle}>
            <span style={s.stepBadge}>1</span>
            Select Customer
          </h3>
          <p style={{ fontSize: 13, color: "#6B7280", margin: "8px 0 16px" }}>Choose an existing customer or enter a new one</p>

          {/* Customer search */}
          <div style={{
            display: "flex", alignItems: "center",
            backgroundColor: "#F9FAFB", border: `1px solid ${PURPLE_BORDER}`, borderRadius: 10, padding: "0 12px", marginBottom: 16,
          }}>
            <Search size={16} color="#9CA3AF" />
            <input
              type="text"
              placeholder="Search customers..."
              value={customerSearch}
              onChange={(e) => setCustomerSearch(e.target.value)}
              style={{ flex: 1, padding: "10px 10px", border: "none", background: "none", outline: "none", fontSize: 13, color: "#111827" }}
            />
          </div>

          {/* Customer cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10, marginBottom: 20 }}>
            {filteredCustomers.map(c => (
              <div
                key={c.id}
                onClick={() => { setSelectedCustomer(c); setCustomConsignee(""); setCustomAddress(""); }}
                style={{
                  padding: "14px 16px", borderRadius: 10, cursor: "pointer", transition: "all 0.2s",
                  border: selectedCustomer?.id === c.id ? `2px solid ${PURPLE}` : "1px solid #E5E7EB",
                  background: selectedCustomer?.id === c.id ? PURPLE_LIGHT : "#fff",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: selectedCustomer?.id === c.id ? `${PURPLE}20` : "#F3F4F6",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <User size={14} color={selectedCustomer?.id === c.id ? PURPLE : "#9CA3AF"} />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{c.name}</div>
                    <div style={{ fontSize: 11, color: "#6B7280", marginTop: 1 }}>{c.address.substring(0, 40)}...</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Or enter manually */}
          <div style={{ borderTop: "1px solid #E5E7EB", paddingTop: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#6B7280", marginBottom: 12 }}>Or enter manually:</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={s.fieldLabel}>Consignee / Customer Name</label>
                <input
                  type="text"
                  value={customConsignee}
                  onChange={(e) => { setCustomConsignee(e.target.value); setSelectedCustomer(null); }}
                  placeholder="e.g., SM Hypermarket - MOA"
                  style={s.input}
                />
              </div>
              <div>
                <label style={s.fieldLabel}>Delivery Address</label>
                <input
                  type="text"
                  value={customAddress}
                  onChange={(e) => { setCustomAddress(e.target.value); setSelectedCustomer(null); }}
                  placeholder="Full delivery address"
                  style={s.input}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Select Items */}
      {step === 1 && (
        <div style={s.card}>
          <h3 style={s.cardTitle}>
            <span style={s.stepBadge}>2</span>
            Select Items from Inventory
          </h3>
          <p style={{ fontSize: 13, color: "#6B7280", margin: "8px 0 0" }}>
            Shipping to: <strong style={{ color: "#111827" }}>{consignee}</strong>
          </p>

          {/* Search */}
          <div style={{ marginTop: 16, marginBottom: 12 }}>
            <div style={{
              display: "flex", alignItems: "center",
              backgroundColor: "#F9FAFB", border: `1px solid ${PURPLE_BORDER}`, borderRadius: 10, padding: "0 12px",
            }}>
              <Search size={16} color="#9CA3AF" />
              <input
                type="text"
                placeholder="Search by SKU, description, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ flex: 1, padding: "10px 10px", border: "none", background: "none", outline: "none", fontSize: 13, color: "#111827" }}
              />
            </div>
          </div>

          {/* Search Results */}
          {searchQuery.length > 0 && filteredItems.length > 0 && (
            <div style={{ border: `1px solid ${PURPLE_BORDER}`, borderRadius: 8, marginBottom: 16, maxHeight: 250, overflow: "auto" }}>
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => addItem(item)}
                  style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "10px 14px", borderBottom: "1px solid #F3F4F6", cursor: "pointer",
                    transition: "background 0.1s",
                  }}
                >
                  <div>
                    <span style={{ fontFamily: "monospace", fontWeight: 600, color: PURPLE, fontSize: 12, marginRight: 8 }}>{item.sku}</span>
                    <span style={{ fontSize: 13, color: "#111827" }}>{item.description}</span>
                    <span style={{ fontSize: 11, color: "#9CA3AF", marginLeft: 8 }}>({item.category})</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{
                      fontSize: 12, fontWeight: 600,
                      color: item.qtyOnHand > (item.minReorderLevel || 0) ? "#059669" : "#D97706",
                    }}>
                      {item.qtyOnHand} {item.uom}
                    </span>
                    <div style={{
                      width: 24, height: 24, borderRadius: 6, background: PURPLE_LIGHT,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <Plus size={14} color={PURPLE} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {searchQuery.length > 0 && filteredItems.length === 0 && (
            <div style={{ padding: 16, textAlign: "center", color: "#9CA3AF", fontSize: 13, border: "1px solid #E5E7EB", borderRadius: 8, marginBottom: 16 }}>
              No matching items found
            </div>
          )}

          {/* Picked Items */}
          {pickedItems.length > 0 ? (
            <>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr>
                    {["SKU", "Description", "Available", "Qty to Ship", "Stock Check", ""].map((h) => (
                      <th key={h} style={s.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pickedItems.map((item) => {
                    const overStock = item.qty > item.available;
                    const pctUsed = Math.round((item.qty / item.available) * 100);
                    return (
                      <tr key={item.id} style={{ background: overStock ? "#FEF2F2" : "transparent" }}>
                        <td style={s.td}>
                          <span style={{ fontFamily: "monospace", fontWeight: 600, color: PURPLE }}>{item.sku}</span>
                        </td>
                        <td style={{ ...s.td, maxWidth: 220, whiteSpace: "normal" }}>{item.description}</td>
                        <td style={s.td}>
                          <span style={{ fontWeight: 600, color: "#059669" }}>{item.available} {item.uom}</span>
                        </td>
                        <td style={s.td}>
                          <input
                            type="number"
                            min={1}
                            max={item.available}
                            value={item.qty}
                            onChange={(e) => updateQty(item.id, parseInt(e.target.value) || 1)}
                            style={{
                              width: 80, padding: "6px 8px",
                              border: overStock ? "1px solid #FECACA" : "1px solid #E5E7EB",
                              borderRadius: 6, fontSize: 13, textAlign: "center",
                              background: overStock ? "#FEF2F2" : "#fff",
                            }}
                          />
                        </td>
                        <td style={s.td}>
                          <div style={{ width: 60 }}>
                            <div style={{ width: "100%", height: 4, background: "#E5E7EB", borderRadius: 2, overflow: "hidden" }}>
                              <div style={{
                                height: "100%", borderRadius: 2,
                                width: `${Math.min(100, pctUsed)}%`,
                                background: pctUsed > 80 ? "#DC2626" : pctUsed > 50 ? "#D97706" : "#059669",
                              }} />
                            </div>
                            <div style={{ fontSize: 9, color: "#6B7280", marginTop: 2 }}>{pctUsed}% of stock</div>
                          </div>
                        </td>
                        <td style={s.td}>
                          <button onClick={() => removeItem(item.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex" }}>
                            <Trash2 size={16} color="#DC2626" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {/* Summary */}
              <div style={{ display: "flex", gap: 16, marginTop: 12, padding: "10px 14px", background: PURPLE_LIGHT, borderRadius: 8, border: `1px solid ${PURPLE_BORDER}` }}>
                <div>
                  <span style={{ fontSize: 10, color: "#6B7280" }}>Items: </span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: PURPLE }}>{pickedItems.length} SKUs</span>
                </div>
                <div>
                  <span style={{ fontSize: 10, color: "#6B7280" }}>Total Qty: </span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: PURPLE }}>{totalItems}</span>
                </div>
                <div>
                  <span style={{ fontSize: 10, color: "#6B7280" }}>Est. Weight: </span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: PURPLE }}>{totalWeight.toFixed(1)} kg</span>
                </div>
              </div>
            </>
          ) : (
            <div style={{ padding: "30px 16px", textAlign: "center", color: "#9CA3AF", fontSize: 13, border: `1px dashed ${PURPLE_BORDER}`, borderRadius: 10 }}>
              <Package size={28} color={PURPLE_BORDER} style={{ marginBottom: 8 }} />
              <p style={{ margin: 0 }}>Search and add items from inventory above</p>
            </div>
          )}
        </div>
      )}

      {/* Step 3: Assign Carrier */}
      {step === 2 && (
        <div style={s.card}>
          <h3 style={s.cardTitle}>
            <span style={s.stepBadge}>3</span>
            Assign Carrier &amp; Schedule
          </h3>
          <p style={{ fontSize: 13, color: "#6B7280", margin: "8px 0 16px" }}>
            {totalItems} items ({totalWeight.toFixed(1)} kg) to {consignee}
          </p>

          {/* Priority Selection */}
          <div style={{ marginBottom: 20 }}>
            <label style={s.fieldLabel}>Shipping Priority</label>
            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              {priorities.map(p => (
                <div
                  key={p.value}
                  onClick={() => { setPriority(p.value); setShipByDate(""); }}
                  style={{
                    flex: 1, padding: "14px 16px", borderRadius: 10, cursor: "pointer",
                    border: priority === p.value ? `2px solid ${PURPLE}` : "1px solid #E5E7EB",
                    background: priority === p.value ? PURPLE_LIGHT : "#fff",
                    textAlign: "center", transition: "all 0.2s",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                    <Clock size={14} color={priority === p.value ? PURPLE : p.color} />
                    <span style={{ fontSize: 14, fontWeight: 700, color: priority === p.value ? PURPLE : "#111827" }}>{p.label}</span>
                  </div>
                  <div style={{ fontSize: 11, color: "#6B7280", marginTop: 4 }}>{p.days} business day{p.days > 1 ? "s" : ""}</div>
                  <div style={{
                    marginTop: 6, fontSize: 10, padding: "2px 8px", borderRadius: 4,
                    background: priority === p.value ? `${PURPLE}15` : p.bg, color: priority === p.value ? PURPLE : p.color,
                    display: "inline-block", fontWeight: 600,
                  }}>
                    Ship by {(() => { const d = new Date("2026-03-20"); d.setDate(d.getDate() + p.days); return d.toLocaleDateString("en-US", { month: "short", day: "numeric" }); })()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
            <div>
              <label style={s.fieldLabel}>Ship-By Date (or override)</label>
              <input
                type="date"
                value={shipByDate || computedShipBy}
                onChange={(e) => setShipByDate(e.target.value)}
                style={s.input}
              />
            </div>
            <div>
              <label style={s.fieldLabel}>Waybill / DR Number</label>
              <div style={{ padding: "10px 14px", background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 8, fontFamily: "monospace", fontWeight: 600, color: PURPLE, fontSize: 14 }}>
                {waybillNumber}
                <span style={{ fontSize: 11, color: "#9CA3AF", marginLeft: 8, fontFamily: "system-ui" }}>Auto-generated</span>
              </div>
            </div>
          </div>

          {/* Carrier Selection */}
          <label style={s.fieldLabel}>Select Carrier</label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginTop: 8 }}>
            {knownCarriers.map((c) => {
              const info = carrierDetails[c] || { type: "Standard", maxWeight: 5000, maxItems: 200 };
              const isSelected = carrier === c;
              const capacityFit = totalWeight <= info.maxWeight && totalItems <= info.maxItems;
              return (
                <div
                  key={c}
                  onClick={() => setCarrier(c)}
                  style={{
                    padding: "12px 14px", borderRadius: 10, cursor: "pointer",
                    border: isSelected ? `2px solid ${PURPLE}` : "1px solid #E5E7EB",
                    background: isSelected ? PURPLE_LIGHT : "#fff",
                    transition: "all 0.2s", opacity: capacityFit ? 1 : 0.5,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <Truck size={16} color={isSelected ? PURPLE : "#6B7280"} />
                    <span style={{ fontSize: 12, fontWeight: 600, color: isSelected ? PURPLE : "#111827" }}>{c}</span>
                  </div>
                  <div style={{ fontSize: 10, color: "#6B7280" }}>{info.type}</div>
                  <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                    <span style={{ fontSize: 9, color: "#9CA3AF" }}>Max {info.maxWeight.toLocaleString()} kg</span>
                    <span style={{ fontSize: 9, color: "#9CA3AF" }}>{info.maxItems} items</span>
                  </div>
                  {!capacityFit && (
                    <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4 }}>
                      <AlertTriangle size={10} color="#D97706" />
                      <span style={{ fontSize: 9, color: "#D97706", fontWeight: 600 }}>Over capacity</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 4: Review */}
      {step === 3 && (
        <div style={s.card}>
          <h3 style={s.cardTitle}>
            <span style={s.stepBadge}>4</span>
            Review &amp; Submit
          </h3>
          <p style={{ fontSize: 13, color: "#6B7280", margin: "8px 0 20px" }}>Please review all details before submitting</p>

          {/* Summary sections */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
            {/* Customer */}
            <div style={{ padding: "16px 20px", background: PURPLE_LIGHT, borderRadius: 10, border: `1px solid ${PURPLE_BORDER}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                <User size={14} color={PURPLE} />
                <span style={{ fontSize: 12, fontWeight: 700, color: PURPLE, textTransform: "uppercase" }}>Customer</span>
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>{consignee}</div>
              <div style={{ fontSize: 12, color: "#6B7280", marginTop: 4 }}>{deliveryAddress}</div>
            </div>

            {/* Carrier */}
            <div style={{ padding: "16px 20px", background: PURPLE_LIGHT, borderRadius: 10, border: `1px solid ${PURPLE_BORDER}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                <Truck size={14} color={PURPLE} />
                <span style={{ fontSize: 12, fontWeight: 700, color: PURPLE, textTransform: "uppercase" }}>Carrier</span>
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>{carrier}</div>
              <div style={{ fontSize: 12, color: "#6B7280", marginTop: 4 }}>
                {selectedCarrierInfo?.type} &mdash; Waybill: <span style={{ fontFamily: "monospace", color: PURPLE }}>{waybillNumber}</span>
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div style={{ padding: "12px 16px", background: "#F9FAFB", borderRadius: 8, border: "1px solid #E5E7EB", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Calendar size={14} color={PURPLE} />
              <span style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>Ship by: {computedShipBy}</span>
            </div>
            <span style={{
              padding: "4px 12px", borderRadius: 6, fontSize: 11, fontWeight: 600,
              background: priorities.find(p => p.value === priority)?.bg || "#F3F4F6",
              color: priorities.find(p => p.value === priority)?.color || "#6B7280",
            }}>
              {priorities.find(p => p.value === priority)?.label} Priority
            </span>
          </div>

          {/* Items table */}
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, marginBottom: 16 }}>
            <thead>
              <tr>
                {["SKU", "Description", "Quantity", "UOM", "Est. Weight"].map((h) => (
                  <th key={h} style={s.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pickedItems.map((item) => (
                <tr key={item.id}>
                  <td style={s.td}><span style={{ fontFamily: "monospace", fontWeight: 600, color: PURPLE }}>{item.sku}</span></td>
                  <td style={{ ...s.td, maxWidth: 220, whiteSpace: "normal" }}>{item.description}</td>
                  <td style={s.td}><span style={{ fontWeight: 700 }}>{item.qty}</span></td>
                  <td style={s.td}>{item.uom}</td>
                  <td style={s.td}>{item.weight ? `${(item.weight * item.qty).toFixed(1)} kg` : "N/A"}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ borderTop: "2px solid #E5E7EB" }}>
                <td colSpan={2} style={{ ...s.td, fontWeight: 700, color: "#111827" }}>Total</td>
                <td style={{ ...s.td, fontWeight: 700, color: PURPLE }}>{totalItems}</td>
                <td style={s.td}></td>
                <td style={{ ...s.td, fontWeight: 700, color: PURPLE }}>{totalWeight.toFixed(1)} kg</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      {/* Navigation Buttons */}
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 40 }}>
        <div>
          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "12px 24px", borderRadius: 8, border: "1px solid #E5E7EB",
                background: "#fff", color: "#374151", fontSize: 14, fontWeight: 600, cursor: "pointer",
              }}
            >
              <ArrowLeftIcon size={16} /> Previous
            </button>
          )}
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <a href="/dashboard/outbound" style={{
            padding: "12px 24px", borderRadius: 8, border: "1px solid #E5E7EB",
            background: "#fff", color: "#374151", textDecoration: "none", fontSize: 14, fontWeight: 600,
          }}>
            Cancel
          </a>
          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed[step]}
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "12px 28px", borderRadius: 8, border: "none",
                background: canProceed[step] ? PURPLE : "#E5E7EB",
                color: canProceed[step] ? "#fff" : "#9CA3AF",
                fontSize: 14, fontWeight: 600, cursor: canProceed[step] ? "pointer" : "not-allowed",
              }}
            >
              Next <ArrowRight size={16} />
            </button>
          ) : (
            <button
              onClick={() => setSubmitted(true)}
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "12px 28px", borderRadius: 8, border: "none",
                background: PURPLE, color: "#fff",
                fontSize: 14, fontWeight: 600, cursor: "pointer",
              }}
            >
              <Truck size={16} />
              Create Outbound Order
            </button>
          )}
        </div>
      </div>
    </>
  );
}

const s: Record<string, React.CSSProperties> = {
  card: { background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: "20px 24px", marginBottom: 20 },
  cardTitle: { fontSize: 16, fontWeight: 700, color: "#111827", margin: 0, display: "flex", alignItems: "center", gap: 10 },
  stepBadge: {
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    width: 26, height: 26, borderRadius: "50%", background: PURPLE, color: "#fff",
    fontSize: 13, fontWeight: 700,
  },
  fieldLabel: { display: "block", fontSize: 12, color: "#6B7280", fontWeight: 600, marginBottom: 6 },
  input: { width: "100%", padding: "10px 14px", border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 13, color: "#111827", outline: "none" },
  th: { textAlign: "left", padding: "10px 12px", borderBottom: "1px solid #E5E7EB", color: "#6B7280", fontWeight: 600, fontSize: 12, whiteSpace: "nowrap" },
  td: { padding: "10px 12px", borderBottom: "1px solid #F3F4F6", color: "#374151", whiteSpace: "nowrap" },
};
