// ── Facility Profile ──

export const facilityProfile = {
  name: "Clark Freeport Cold Storage Hub",
  address: "Bldg 2114, Manuel Roxas Highway, Clark Freeport Zone, Pampanga",
  region: "Central Luzon",
  island: "Luzon",
  totalArea: 5000, // sqm
  availableCapacity: { sqm: 2100, pallets: 840 },
  type: "Cold Storage + Dry" as const,
  operatingHours: "24/7",
  pezaAccredited: true,
  baiFdaLicense: "FDA-LTO-2024-CS-001",
  loadingDocks: 8,
  ceilingHeight: 12,
  reeferZones: 2,
  rateCard: 450, // PHP per sqm per month
  zones: [
    { name: "Zone A - Dry Storage", area: 2000, temp: "ambient", shelves: 120 },
    { name: "Zone B - Cold Storage", area: 1500, temp: "-18\u00B0C to 4\u00B0C", shelves: 80 },
    { name: "Zone C - Staging/Cross-Dock", area: 1000, temp: "ambient", shelves: 0 },
    { name: "Zone D - Pharmaceutical", area: 500, temp: "2\u00B0C to 8\u00B0C", shelves: 40 },
  ],
  security: ["CCTV 24/7", "Access Control", "Fire Suppression", "Guard 24/7"],
};

export const warehouseTypes = [
  "Dry",
  "Cold Storage",
  "Bonded",
  "Cross-dock",
  "Fulfillment Center",
  "Cold Storage + Dry",
] as const;

// ── Storage Zones ──

export interface StorageZone {
  id: string;
  name: string;
  type: "Dry" | "Cold" | "Hazmat" | "Staging" | "Pharmaceutical";
  area: number;
  usedArea: number;
  shelves: number;
  temp: string;
  currentTemp?: string;
  color: string;
}

export const storageZones: StorageZone[] = [
  { id: "zone-a", name: "Dry Storage A", type: "Dry", area: 1200, usedArea: 900, shelves: 72, temp: "Ambient", currentTemp: "26\u00B0C", color: "#D97706" },
  { id: "zone-b", name: "Dry Storage B", type: "Dry", area: 800, usedArea: 600, shelves: 48, temp: "Ambient", currentTemp: "27\u00B0C", color: "#F59E0B" },
  { id: "zone-c", name: "Cold Storage", type: "Cold", area: 1500, usedArea: 1200, shelves: 80, temp: "-18\u00B0C to 4\u00B0C", currentTemp: "-16\u00B0C", color: "#2563EB" },
  { id: "zone-d", name: "Hazmat / Chemical", type: "Hazmat", area: 300, usedArea: 180, shelves: 20, temp: "Ambient", currentTemp: "25\u00B0C", color: "#DC2626" },
  { id: "zone-e", name: "Staging Area", type: "Staging", area: 700, usedArea: 350, shelves: 0, temp: "Ambient", currentTemp: "28\u00B0C", color: "#7C3AED" },
];

// ── Inventory Items ── (50 SKUs)

export interface InventoryItem {
  id: string;
  sku: string;
  description: string;
  category: string;
  uom: string;
  qtyOnHand: number;
  location: string;
  zone: string;
  lotBatch: string;
  expiryDate?: string;
  dateReceived: string;
  barcode?: string;
  rfidTag?: string;
  minReorderLevel?: number;
  supplier: string;
  weight?: number;
  tempRequirement?: string;
  status: "in_stock" | "low_stock" | "expired" | "reserved";
  movements: StockMovement[];
}

export interface StockMovement {
  date: string;
  type: "in" | "out";
  qty: number;
  reference: string;
  note?: string;
}

export const inventoryItems: InventoryItem[] = [
  {
    id: "inv-001", sku: "DRY-1001", description: "Premium Jasmine Rice 50kg", category: "Grains & Rice",
    uom: "bags", qtyOnHand: 240, location: "A1-R3-S2", zone: "Dry Storage A",
    lotBatch: "LOT-2026-0301", dateReceived: "2026-03-01", barcode: "4800012345001", rfidTag: "RFID-A001",
    minReorderLevel: 50, supplier: "Santos Agri Trading, Nueva Ecija", weight: 50, status: "in_stock",
    movements: [
      { date: "2026-03-01", type: "in", qty: 300, reference: "INB-5001", note: "Initial receipt" },
      { date: "2026-03-10", type: "out", qty: 40, reference: "OUT-6001" },
      { date: "2026-03-15", type: "out", qty: 20, reference: "OUT-6005" },
    ],
  },
  {
    id: "inv-002", sku: "DRY-1002", description: "Century Tuna Flakes in Oil 155g x48", category: "Canned Goods",
    uom: "cases", qtyOnHand: 180, location: "A1-R1-S4", zone: "Dry Storage A",
    lotBatch: "LOT-2026-0215", expiryDate: "2028-02-15", dateReceived: "2026-02-20",
    barcode: "4800012345002", minReorderLevel: 40,
    supplier: "Century Pacific Food Inc, Taguig", weight: 7.4, status: "in_stock",
    movements: [
      { date: "2026-02-20", type: "in", qty: 200, reference: "INB-5005" },
      { date: "2026-03-12", type: "out", qty: 20, reference: "OUT-6001" },
    ],
  },
  {
    id: "inv-003", sku: "DRY-1003", description: "Argentina Corned Beef 260g x24", category: "Canned Goods",
    uom: "cases", qtyOnHand: 12, location: "A2-R2-S1", zone: "Dry Storage B",
    lotBatch: "LOT-2026-0110", expiryDate: "2028-01-10", dateReceived: "2026-01-15",
    barcode: "4800012345003", minReorderLevel: 30,
    supplier: "CDO Foodsphere Inc, Valenzuela", weight: 6.2, status: "low_stock",
    movements: [
      { date: "2026-01-15", type: "in", qty: 100, reference: "INB-5005" },
      { date: "2026-02-20", type: "out", qty: 50, reference: "OUT-6003" },
      { date: "2026-03-10", type: "out", qty: 38, reference: "OUT-6004" },
    ],
  },
  {
    id: "inv-004", sku: "CLD-2001", description: "Frozen Bangus Belly 1kg", category: "Frozen Seafood",
    uom: "boxes", qtyOnHand: 320, location: "B1-R1-S3", zone: "Cold Storage",
    lotBatch: "LOT-2026-0310", expiryDate: "2026-09-10", dateReceived: "2026-03-10",
    barcode: "4800012345004", minReorderLevel: 60,
    supplier: "GenSan Frozen Foods, General Santos", weight: 1, tempRequirement: "-18\u00B0C", status: "in_stock",
    movements: [
      { date: "2026-03-10", type: "in", qty: 350, reference: "INB-5002" },
      { date: "2026-03-14", type: "out", qty: 30, reference: "OUT-6004" },
    ],
  },
  {
    id: "inv-005", sku: "CLD-2002", description: "Frozen Tiger Prawns 500g", category: "Frozen Seafood",
    uom: "boxes", qtyOnHand: 8, location: "B1-R2-S2", zone: "Cold Storage",
    lotBatch: "LOT-2026-0225", expiryDate: "2026-08-25", dateReceived: "2026-02-28",
    barcode: "4800012345005", minReorderLevel: 40,
    supplier: "Mindanao Seafood Exporters, Davao", weight: 0.5, tempRequirement: "-18\u00B0C", status: "low_stock",
    movements: [
      { date: "2026-02-28", type: "in", qty: 60, reference: "INB-5002" },
      { date: "2026-03-10", type: "out", qty: 32, reference: "OUT-6004" },
      { date: "2026-03-15", type: "out", qty: 20, reference: "OUT-6003" },
    ],
  },
  {
    id: "inv-006", sku: "ELC-3001", description: "Samsung Galaxy Tab A9 Tablet 64GB", category: "Electronics",
    uom: "pcs", qtyOnHand: 60, location: "A3-R1-S1", zone: "Dry Storage A",
    lotBatch: "LOT-2026-0305", dateReceived: "2026-03-05",
    barcode: "8806094000001", rfidTag: "RFID-E001", minReorderLevel: 15,
    supplier: "Samsung Philippines, Taguig", weight: 0.48, status: "in_stock",
    movements: [
      { date: "2026-03-05", type: "in", qty: 100, reference: "INB-5004" },
      { date: "2026-03-12", type: "out", qty: 40, reference: "OUT-6003" },
    ],
  },
  {
    id: "inv-007", sku: "PHR-4001", description: "Biogesic Paracetamol 500mg x100 tabs", category: "Pharmaceutical",
    uom: "boxes", qtyOnHand: 500, location: "D1-R1-S2", zone: "Hazmat / Chemical",
    lotBatch: "LOT-2026-0201", expiryDate: "2028-02-01", dateReceived: "2026-02-05",
    barcode: "4800012345007", minReorderLevel: 100,
    supplier: "Unilab Inc, Mandaluyong", weight: 0.6, tempRequirement: "2\u00B0C to 8\u00B0C", status: "in_stock",
    movements: [
      { date: "2026-02-05", type: "in", qty: 600, reference: "INB-5003" },
      { date: "2026-03-10", type: "out", qty: 100, reference: "OUT-6002" },
    ],
  },
  {
    id: "inv-008", sku: "DRY-1004", description: "Del Monte Tomato Ketchup 320g x24", category: "Condiments",
    uom: "cases", qtyOnHand: 150, location: "A1-R4-S3", zone: "Dry Storage A",
    lotBatch: "LOT-2026-0220", expiryDate: "2027-08-20", dateReceived: "2026-02-25",
    barcode: "4800012345008", minReorderLevel: 30,
    supplier: "Del Monte Philippines, Bukidnon", weight: 7.7, status: "in_stock",
    movements: [
      { date: "2026-02-25", type: "in", qty: 200, reference: "INB-5005" },
      { date: "2026-03-16", type: "out", qty: 50, reference: "OUT-6005" },
    ],
  },
  {
    id: "inv-009", sku: "DRY-1005", description: "Nestle Coffee Mate 450g x12", category: "Beverages",
    uom: "cases", qtyOnHand: 200, location: "A2-R1-S2", zone: "Dry Storage B",
    lotBatch: "LOT-2026-0301", expiryDate: "2027-09-01", dateReceived: "2026-03-05",
    barcode: "4800012345009", minReorderLevel: 50,
    supplier: "Nestle Philippines, Cabuyao", weight: 5.4, status: "in_stock",
    movements: [
      { date: "2026-03-05", type: "in", qty: 250, reference: "INB-5008" },
      { date: "2026-03-14", type: "out", qty: 50, reference: "OUT-6006" },
    ],
  },
  {
    id: "inv-010", sku: "CLD-2003", description: "Chilled Whole Chicken 1.2kg", category: "Frozen Poultry",
    uom: "pcs", qtyOnHand: 150, location: "B2-R1-S1", zone: "Cold Storage",
    lotBatch: "LOT-2026-0315", expiryDate: "2026-03-25", dateReceived: "2026-03-15",
    barcode: "4800012345010", minReorderLevel: 40,
    supplier: "Bounty Fresh, Bulacan", weight: 1.2, tempRequirement: "0\u00B0C to 4\u00B0C", status: "in_stock",
    movements: [
      { date: "2026-03-15", type: "in", qty: 150, reference: "INB-5006" },
    ],
  },
  {
    id: "inv-011", sku: "PHR-4002", description: "Insulin Vials NovoRapid 10mL x5", category: "Pharmaceutical",
    uom: "boxes", qtyOnHand: 5, location: "D1-R2-S1", zone: "Hazmat / Chemical",
    lotBatch: "LOT-2026-0210", expiryDate: "2027-02-10", dateReceived: "2026-02-15",
    barcode: "4800012345011", minReorderLevel: 10,
    supplier: "Zuellig Pharma, Makati", weight: 0.3, tempRequirement: "2\u00B0C to 8\u00B0C", status: "low_stock",
    movements: [
      { date: "2026-02-15", type: "in", qty: 20, reference: "INB-5003" },
      { date: "2026-03-10", type: "out", qty: 15, reference: "OUT-6002" },
    ],
  },
  {
    id: "inv-012", sku: "DRY-1006", description: "Kopiko Brown Coffee 25g x30", category: "Beverages",
    uom: "cases", qtyOnHand: 400, location: "A1-R2-S5", zone: "Dry Storage A",
    lotBatch: "LOT-2026-0228", expiryDate: "2027-08-28", dateReceived: "2026-03-02",
    barcode: "4800012345012", minReorderLevel: 60,
    supplier: "Mayora Indah Philippines, Laguna", weight: 0.75, status: "in_stock",
    movements: [
      { date: "2026-03-02", type: "in", qty: 500, reference: "INB-5007" },
      { date: "2026-03-16", type: "out", qty: 100, reference: "OUT-6005" },
    ],
  },
  {
    id: "inv-013", sku: "ELC-3002", description: "Portable Bluetooth Speaker JBL Go 3", category: "Electronics",
    uom: "pcs", qtyOnHand: 3, location: "A3-R2-S1", zone: "Dry Storage A",
    lotBatch: "LOT-2026-0120", dateReceived: "2026-01-25",
    barcode: "6925281900001", minReorderLevel: 10,
    supplier: "JBL/Harman Philippines, Pasig", weight: 0.21, status: "low_stock",
    movements: [
      { date: "2026-01-25", type: "in", qty: 30, reference: "INB-5004" },
      { date: "2026-03-12", type: "out", qty: 27, reference: "OUT-6003" },
    ],
  },
  {
    id: "inv-014", sku: "CLD-2004", description: "Magnolia Ice Cream Tub 1.3L Vanilla", category: "Frozen Dairy",
    uom: "pcs", qtyOnHand: 0, location: "B1-R3-S1", zone: "Cold Storage",
    lotBatch: "LOT-2025-1201", expiryDate: "2026-03-01", dateReceived: "2025-12-05",
    barcode: "4800012345014", minReorderLevel: 30,
    supplier: "San Miguel Foods, Manila", weight: 1.3, tempRequirement: "-18\u00B0C", status: "expired",
    movements: [
      { date: "2025-12-05", type: "in", qty: 80, reference: "INB-4090" },
      { date: "2026-02-25", type: "out", qty: 80, reference: "OUT-5990" },
    ],
  },
  {
    id: "inv-015", sku: "DRY-1007", description: "Lucky Me Pancit Canton Original 60g x48", category: "Instant Noodles",
    uom: "cases", qtyOnHand: 350, location: "A2-R3-S4", zone: "Dry Storage B",
    lotBatch: "LOT-2026-0312", expiryDate: "2027-03-12", dateReceived: "2026-03-14",
    barcode: "4800012345015", minReorderLevel: 60,
    supplier: "Monde Nissin, Sta. Rosa", weight: 2.9, status: "in_stock",
    movements: [
      { date: "2026-03-14", type: "in", qty: 350, reference: "INB-5008" },
    ],
  },
  // Additional 35 items to reach 50
  {
    id: "inv-016", sku: "DRY-1008", description: "Silver Swan Soy Sauce 1L x12", category: "Condiments",
    uom: "cases", qtyOnHand: 220, location: "A1-R5-S1", zone: "Dry Storage A",
    lotBatch: "LOT-2026-0305", expiryDate: "2028-03-05", dateReceived: "2026-03-08",
    barcode: "4800012345016", minReorderLevel: 40,
    supplier: "NutriAsia Inc, Marilao", weight: 12.0, status: "in_stock",
    movements: [{ date: "2026-03-08", type: "in", qty: 220, reference: "INB-5005" }],
  },
  {
    id: "inv-017", sku: "DRY-1009", description: "Datu Puti Vinegar 1L x12", category: "Condiments",
    uom: "cases", qtyOnHand: 180, location: "A1-R5-S2", zone: "Dry Storage A",
    lotBatch: "LOT-2026-0305", expiryDate: "2028-06-05", dateReceived: "2026-03-08",
    barcode: "4800012345017", minReorderLevel: 40,
    supplier: "NutriAsia Inc, Marilao", weight: 12.0, status: "in_stock",
    movements: [{ date: "2026-03-08", type: "in", qty: 180, reference: "INB-5005" }],
  },
  {
    id: "inv-018", sku: "BEV-5001", description: "San Miguel Pale Pilsen 330mL x24", category: "Beverages",
    uom: "cases", qtyOnHand: 500, location: "A2-R4-S1", zone: "Dry Storage B",
    lotBatch: "LOT-2026-0310", expiryDate: "2027-03-10", dateReceived: "2026-03-12",
    barcode: "4800012345018", minReorderLevel: 80,
    supplier: "San Miguel Brewery, Manila", weight: 8.5, status: "in_stock",
    movements: [{ date: "2026-03-12", type: "in", qty: 500, reference: "INB-5008" }],
  },
  {
    id: "inv-019", sku: "BEV-5002", description: "C2 Green Tea Apple 500mL x24", category: "Beverages",
    uom: "cases", qtyOnHand: 300, location: "A2-R4-S2", zone: "Dry Storage B",
    lotBatch: "LOT-2026-0301", expiryDate: "2027-03-01", dateReceived: "2026-03-05",
    barcode: "4800012345019", minReorderLevel: 50,
    supplier: "Universal Robina Corp, Pasig", weight: 12.5, status: "in_stock",
    movements: [{ date: "2026-03-05", type: "in", qty: 300, reference: "INB-5008" }],
  },
  {
    id: "inv-020", sku: "BEV-5003", description: "Cobra Energy Drink 350mL x24", category: "Beverages",
    uom: "cases", qtyOnHand: 15, location: "A2-R4-S3", zone: "Dry Storage B",
    lotBatch: "LOT-2026-0215", expiryDate: "2027-02-15", dateReceived: "2026-02-20",
    barcode: "4800012345020", minReorderLevel: 40,
    supplier: "Asia Brewery Inc, Cabuyao", weight: 8.8, status: "low_stock",
    movements: [
      { date: "2026-02-20", type: "in", qty: 100, reference: "INB-5005" },
      { date: "2026-03-10", type: "out", qty: 85, reference: "OUT-6005" },
    ],
  },
  {
    id: "inv-021", sku: "CLD-2005", description: "Frozen Pork Tocino 500g x20", category: "Frozen Meat",
    uom: "cases", qtyOnHand: 200, location: "B1-R4-S1", zone: "Cold Storage",
    lotBatch: "LOT-2026-0310", expiryDate: "2026-09-10", dateReceived: "2026-03-12",
    barcode: "4800012345021", minReorderLevel: 40,
    supplier: "Virginia Foods, Quezon City", weight: 10.0, tempRequirement: "-18\u00B0C", status: "in_stock",
    movements: [{ date: "2026-03-12", type: "in", qty: 200, reference: "INB-5006" }],
  },
  {
    id: "inv-022", sku: "CLD-2006", description: "Frozen Longganisa Lucban 500g x20", category: "Frozen Meat",
    uom: "cases", qtyOnHand: 160, location: "B1-R4-S2", zone: "Cold Storage",
    lotBatch: "LOT-2026-0308", expiryDate: "2026-09-08", dateReceived: "2026-03-10",
    barcode: "4800012345022", minReorderLevel: 30,
    supplier: "Purefoods Corp, Marikina", weight: 10.0, tempRequirement: "-18\u00B0C", status: "in_stock",
    movements: [{ date: "2026-03-10", type: "in", qty: 160, reference: "INB-5006" }],
  },
  {
    id: "inv-023", sku: "CLD-2007", description: "Frozen Squid Rings 500g x10", category: "Frozen Seafood",
    uom: "cases", qtyOnHand: 90, location: "B1-R2-S3", zone: "Cold Storage",
    lotBatch: "LOT-2026-0301", expiryDate: "2026-09-01", dateReceived: "2026-03-05",
    barcode: "4800012345023", minReorderLevel: 20,
    supplier: "GenSan Frozen Foods, General Santos", weight: 5.0, tempRequirement: "-18\u00B0C", status: "in_stock",
    movements: [{ date: "2026-03-05", type: "in", qty: 90, reference: "INB-5002" }],
  },
  {
    id: "inv-024", sku: "DRY-1010", description: "Skyflakes Crackers 200g x30", category: "Snacks",
    uom: "cases", qtyOnHand: 280, location: "A1-R3-S4", zone: "Dry Storage A",
    lotBatch: "LOT-2026-0228", expiryDate: "2027-08-28", dateReceived: "2026-03-02",
    barcode: "4800012345024", minReorderLevel: 50,
    supplier: "M.Y. San Corp, Paranaque", weight: 6.0, status: "in_stock",
    movements: [{ date: "2026-03-02", type: "in", qty: 280, reference: "INB-5005" }],
  },
  {
    id: "inv-025", sku: "DRY-1011", description: "Oishi Prawn Crackers 60g x48", category: "Snacks",
    uom: "cases", qtyOnHand: 190, location: "A1-R3-S5", zone: "Dry Storage A",
    lotBatch: "LOT-2026-0310", expiryDate: "2027-03-10", dateReceived: "2026-03-12",
    barcode: "4800012345025", minReorderLevel: 40,
    supplier: "Liwayway Marketing Corp, Pasig", weight: 2.9, status: "in_stock",
    movements: [{ date: "2026-03-12", type: "in", qty: 190, reference: "INB-5008" }],
  },
  {
    id: "inv-026", sku: "DRY-1012", description: "Jack n Jill Chippy BBQ 200g x24", category: "Snacks",
    uom: "cases", qtyOnHand: 140, location: "A2-R1-S3", zone: "Dry Storage B",
    lotBatch: "LOT-2026-0315", expiryDate: "2027-03-15", dateReceived: "2026-03-16",
    barcode: "4800012345026", minReorderLevel: 30,
    supplier: "Universal Robina Corp, Pasig", weight: 4.8, status: "in_stock",
    movements: [{ date: "2026-03-16", type: "in", qty: 140, reference: "INB-5008" }],
  },
  {
    id: "inv-027", sku: "PHR-4003", description: "Neozep Forte Tablets x100", category: "Pharmaceutical",
    uom: "boxes", qtyOnHand: 300, location: "D1-R1-S3", zone: "Hazmat / Chemical",
    lotBatch: "LOT-2026-0301", expiryDate: "2028-03-01", dateReceived: "2026-03-05",
    barcode: "4800012345027", minReorderLevel: 50,
    supplier: "Unilab Inc, Mandaluyong", weight: 0.4, tempRequirement: "2\u00B0C to 8\u00B0C", status: "in_stock",
    movements: [{ date: "2026-03-05", type: "in", qty: 300, reference: "INB-5003" }],
  },
  {
    id: "inv-028", sku: "PHR-4004", description: "Solmux 500mg Capsules x100", category: "Pharmaceutical",
    uom: "boxes", qtyOnHand: 250, location: "D1-R1-S4", zone: "Hazmat / Chemical",
    lotBatch: "LOT-2026-0228", expiryDate: "2028-02-28", dateReceived: "2026-03-02",
    barcode: "4800012345028", minReorderLevel: 40,
    supplier: "Unilab Inc, Mandaluyong", weight: 0.5, tempRequirement: "2\u00B0C to 8\u00B0C", status: "in_stock",
    movements: [{ date: "2026-03-02", type: "in", qty: 250, reference: "INB-5003" }],
  },
  {
    id: "inv-029", sku: "ELC-3003", description: "Xiaomi Redmi Earbuds Basic 2", category: "Electronics",
    uom: "pcs", qtyOnHand: 45, location: "A3-R2-S2", zone: "Dry Storage A",
    lotBatch: "LOT-2026-0301", dateReceived: "2026-03-05",
    barcode: "6934177700001", rfidTag: "RFID-E003", minReorderLevel: 10,
    supplier: "Xiaomi Philippines, BGC", weight: 0.05, status: "in_stock",
    movements: [{ date: "2026-03-05", type: "in", qty: 50, reference: "INB-5004" }, { date: "2026-03-14", type: "out", qty: 5, reference: "OUT-6003" }],
  },
  {
    id: "inv-030", sku: "ELC-3004", description: "Anker PowerCore 10000mAh Power Bank", category: "Electronics",
    uom: "pcs", qtyOnHand: 80, location: "A3-R2-S3", zone: "Dry Storage A",
    lotBatch: "LOT-2026-0310", dateReceived: "2026-03-12",
    barcode: "8480012345030", rfidTag: "RFID-E004", minReorderLevel: 15,
    supplier: "Anker Philippines, Makati", weight: 0.2, status: "in_stock",
    movements: [{ date: "2026-03-12", type: "in", qty: 80, reference: "INB-5004" }],
  },
  {
    id: "inv-031", sku: "DRY-1013", description: "Marca Pina Dried Mango 100g x48", category: "Snacks",
    uom: "cases", qtyOnHand: 120, location: "A1-R4-S1", zone: "Dry Storage A",
    lotBatch: "LOT-2026-0305", expiryDate: "2027-09-05", dateReceived: "2026-03-08",
    barcode: "4800012345031", minReorderLevel: 25,
    supplier: "Profood International Corp, Cebu", weight: 4.8, status: "in_stock",
    movements: [{ date: "2026-03-08", type: "in", qty: 120, reference: "INB-5005" }],
  },
  {
    id: "inv-032", sku: "DRY-1014", description: "Bear Brand Powdered Milk 900g x6", category: "Dairy",
    uom: "cases", qtyOnHand: 100, location: "A2-R2-S3", zone: "Dry Storage B",
    lotBatch: "LOT-2026-0301", expiryDate: "2027-09-01", dateReceived: "2026-03-05",
    barcode: "4800012345032", minReorderLevel: 20,
    supplier: "Nestle Philippines, Cabuyao", weight: 5.4, status: "in_stock",
    movements: [{ date: "2026-03-05", type: "in", qty: 100, reference: "INB-5008" }],
  },
  {
    id: "inv-033", sku: "DRY-1015", description: "Alaska Evaporated Milk 370mL x48", category: "Dairy",
    uom: "cases", qtyOnHand: 175, location: "A2-R2-S4", zone: "Dry Storage B",
    lotBatch: "LOT-2026-0310", expiryDate: "2027-09-10", dateReceived: "2026-03-12",
    barcode: "4800012345033", minReorderLevel: 30,
    supplier: "Alaska Milk Corp, Makati", weight: 17.8, status: "in_stock",
    movements: [{ date: "2026-03-12", type: "in", qty: 175, reference: "INB-5008" }],
  },
  {
    id: "inv-034", sku: "CLD-2008", description: "Frozen Cream Dory Fillet 1kg x10", category: "Frozen Seafood",
    uom: "cases", qtyOnHand: 65, location: "B1-R3-S2", zone: "Cold Storage",
    lotBatch: "LOT-2026-0312", expiryDate: "2026-09-12", dateReceived: "2026-03-14",
    barcode: "4800012345034", minReorderLevel: 15,
    supplier: "Mindanao Seafood Exporters, Davao", weight: 10.0, tempRequirement: "-18\u00B0C", status: "in_stock",
    movements: [{ date: "2026-03-14", type: "in", qty: 65, reference: "INB-5002" }],
  },
  {
    id: "inv-035", sku: "CLD-2009", description: "Frozen Mixed Vegetables 1kg x12", category: "Frozen Vegetables",
    uom: "cases", qtyOnHand: 110, location: "B2-R1-S2", zone: "Cold Storage",
    lotBatch: "LOT-2026-0308", expiryDate: "2027-03-08", dateReceived: "2026-03-10",
    barcode: "4800012345035", minReorderLevel: 20,
    supplier: "Dole Philippines, South Cotabato", weight: 12.0, tempRequirement: "-18\u00B0C", status: "in_stock",
    movements: [{ date: "2026-03-10", type: "in", qty: 110, reference: "INB-5006" }],
  },
  {
    id: "inv-036", sku: "DRY-1016", description: "Nescafe Classic 200g x12", category: "Beverages",
    uom: "cases", qtyOnHand: 230, location: "A1-R2-S3", zone: "Dry Storage A",
    lotBatch: "LOT-2026-0305", expiryDate: "2028-03-05", dateReceived: "2026-03-08",
    barcode: "4800012345036", minReorderLevel: 40,
    supplier: "Nestle Philippines, Cabuyao", weight: 2.4, status: "in_stock",
    movements: [{ date: "2026-03-08", type: "in", qty: 230, reference: "INB-5008" }],
  },
  {
    id: "inv-037", sku: "DRY-1017", description: "Great Taste White 3-in-1 30g x30", category: "Beverages",
    uom: "cases", qtyOnHand: 320, location: "A1-R2-S4", zone: "Dry Storage A",
    lotBatch: "LOT-2026-0310", expiryDate: "2027-09-10", dateReceived: "2026-03-12",
    barcode: "4800012345037", minReorderLevel: 50,
    supplier: "Universal Robina Corp, Pasig", weight: 0.9, status: "in_stock",
    movements: [{ date: "2026-03-12", type: "in", qty: 320, reference: "INB-5008" }],
  },
  {
    id: "inv-038", sku: "DRY-1018", description: "Rebisco Hansel Sandwich Crackers x48", category: "Snacks",
    uom: "cases", qtyOnHand: 95, location: "A2-R3-S1", zone: "Dry Storage B",
    lotBatch: "LOT-2026-0315", expiryDate: "2027-03-15", dateReceived: "2026-03-16",
    barcode: "4800012345038", minReorderLevel: 20,
    supplier: "Republic Biscuit Corp, Pasig", weight: 3.2, status: "in_stock",
    movements: [{ date: "2026-03-16", type: "in", qty: 95, reference: "INB-5008" }],
  },
  {
    id: "inv-039", sku: "CLD-2010", description: "Eden Cheese Original 440g x12", category: "Dairy",
    uom: "cases", qtyOnHand: 85, location: "B2-R2-S1", zone: "Cold Storage",
    lotBatch: "LOT-2026-0310", expiryDate: "2026-09-10", dateReceived: "2026-03-12",
    barcode: "4800012345039", minReorderLevel: 15,
    supplier: "Mondelez Philippines, Paranaque", weight: 5.3, tempRequirement: "0\u00B0C to 4\u00B0C", status: "in_stock",
    movements: [{ date: "2026-03-12", type: "in", qty: 85, reference: "INB-5006" }],
  },
  {
    id: "inv-040", sku: "DRY-1019", description: "555 Sardines in Tomato Sauce 155g x48", category: "Canned Goods",
    uom: "cases", qtyOnHand: 260, location: "A1-R1-S5", zone: "Dry Storage A",
    lotBatch: "LOT-2026-0301", expiryDate: "2029-03-01", dateReceived: "2026-03-05",
    barcode: "4800012345040", minReorderLevel: 40,
    supplier: "Century Pacific Food Inc, Taguig", weight: 7.4, status: "in_stock",
    movements: [{ date: "2026-03-05", type: "in", qty: 260, reference: "INB-5005" }],
  },
  {
    id: "inv-041", sku: "DRY-1020", description: "Mega Sardines in Natural Oil 155g x48", category: "Canned Goods",
    uom: "cases", qtyOnHand: 210, location: "A1-R1-S6", zone: "Dry Storage A",
    lotBatch: "LOT-2026-0305", expiryDate: "2029-03-05", dateReceived: "2026-03-08",
    barcode: "4800012345041", minReorderLevel: 40,
    supplier: "Mega Global Corp, Sonza", weight: 7.4, status: "in_stock",
    movements: [{ date: "2026-03-08", type: "in", qty: 210, reference: "INB-5005" }],
  },
  {
    id: "inv-042", sku: "PHR-4005", description: "Decolgen Forte x100 tablets", category: "Pharmaceutical",
    uom: "boxes", qtyOnHand: 180, location: "D1-R2-S2", zone: "Hazmat / Chemical",
    lotBatch: "LOT-2026-0301", expiryDate: "2028-03-01", dateReceived: "2026-03-05",
    barcode: "4800012345042", minReorderLevel: 30,
    supplier: "Unilab Inc, Mandaluyong", weight: 0.4, tempRequirement: "2\u00B0C to 8\u00B0C", status: "in_stock",
    movements: [{ date: "2026-03-05", type: "in", qty: 180, reference: "INB-5003" }],
  },
  {
    id: "inv-043", sku: "ELC-3005", description: "TP-Link WiFi Router Archer C6", category: "Electronics",
    uom: "pcs", qtyOnHand: 25, location: "A3-R1-S2", zone: "Dry Storage A",
    lotBatch: "LOT-2026-0312", dateReceived: "2026-03-14",
    barcode: "6935364000001", rfidTag: "RFID-E005", minReorderLevel: 5,
    supplier: "TP-Link Philippines, Makati", weight: 0.39, status: "in_stock",
    movements: [{ date: "2026-03-14", type: "in", qty: 25, reference: "INB-5004" }],
  },
  {
    id: "inv-044", sku: "DRY-1021", description: "UFC Banana Ketchup 550g x24", category: "Condiments",
    uom: "cases", qtyOnHand: 145, location: "A1-R5-S3", zone: "Dry Storage A",
    lotBatch: "LOT-2026-0310", expiryDate: "2027-09-10", dateReceived: "2026-03-12",
    barcode: "4800012345044", minReorderLevel: 30,
    supplier: "NutriAsia Inc, Marilao", weight: 13.2, status: "in_stock",
    movements: [{ date: "2026-03-12", type: "in", qty: 145, reference: "INB-5005" }],
  },
  {
    id: "inv-045", sku: "CLD-2011", description: "Nestle All Purpose Cream 250mL x24", category: "Dairy",
    uom: "cases", qtyOnHand: 70, location: "B2-R2-S2", zone: "Cold Storage",
    lotBatch: "LOT-2026-0315", expiryDate: "2026-06-15", dateReceived: "2026-03-16",
    barcode: "4800012345045", minReorderLevel: 15,
    supplier: "Nestle Philippines, Cabuyao", weight: 6.0, tempRequirement: "0\u00B0C to 4\u00B0C", status: "in_stock",
    movements: [{ date: "2026-03-16", type: "in", qty: 70, reference: "INB-5008" }],
  },
  {
    id: "inv-046", sku: "DRY-1022", description: "Ajinomoto Umami Seasoning 100g x48", category: "Condiments",
    uom: "cases", qtyOnHand: 310, location: "A1-R5-S4", zone: "Dry Storage A",
    lotBatch: "LOT-2026-0301", expiryDate: "2029-03-01", dateReceived: "2026-03-05",
    barcode: "4800012345046", minReorderLevel: 50,
    supplier: "Ajinomoto Philippines, Lucena", weight: 4.8, status: "in_stock",
    movements: [{ date: "2026-03-05", type: "in", qty: 310, reference: "INB-5005" }],
  },
  {
    id: "inv-047", sku: "CLD-2012", description: "Frozen Lumpia Shanghai 500g x20", category: "Frozen Prepared Foods",
    uom: "cases", qtyOnHand: 6, location: "B1-R4-S3", zone: "Cold Storage",
    lotBatch: "LOT-2026-0225", expiryDate: "2026-08-25", dateReceived: "2026-02-28",
    barcode: "4800012345047", minReorderLevel: 15,
    supplier: "CDO Foodsphere Inc, Valenzuela", weight: 10.0, tempRequirement: "-18\u00B0C", status: "low_stock",
    movements: [
      { date: "2026-02-28", type: "in", qty: 40, reference: "INB-5005" },
      { date: "2026-03-14", type: "out", qty: 34, reference: "OUT-6004" },
    ],
  },
  {
    id: "inv-048", sku: "DRY-1023", description: "Birch Tree Full Cream Milk 1kg x6", category: "Dairy",
    uom: "cases", qtyOnHand: 88, location: "A2-R2-S5", zone: "Dry Storage B",
    lotBatch: "LOT-2026-0312", expiryDate: "2027-03-12", dateReceived: "2026-03-14",
    barcode: "4800012345048", minReorderLevel: 15,
    supplier: "Century Pacific Food Inc, Taguig", weight: 6.0, status: "in_stock",
    movements: [{ date: "2026-03-14", type: "in", qty: 88, reference: "INB-5008" }],
  },
  {
    id: "inv-049", sku: "DRY-1024", description: "Champion Detergent Powder 1kg x12", category: "Household",
    uom: "cases", qtyOnHand: 450, location: "A2-R5-S1", zone: "Dry Storage B",
    lotBatch: "LOT-2026-0301", dateReceived: "2026-03-05",
    barcode: "4800012345049", minReorderLevel: 60,
    supplier: "PureChem Industries, Bulacan", weight: 12.0, status: "in_stock",
    movements: [{ date: "2026-03-05", type: "in", qty: 450, reference: "INB-5005" }],
  },
  {
    id: "inv-050", sku: "DRY-1025", description: "Surf Powder Detergent 2.2kg x6", category: "Household",
    uom: "cases", qtyOnHand: 380, location: "A2-R5-S2", zone: "Dry Storage B",
    lotBatch: "LOT-2026-0305", dateReceived: "2026-03-08",
    barcode: "4800012345050", minReorderLevel: 50,
    supplier: "Unilever Philippines, Taguig", weight: 13.2, status: "in_stock",
    movements: [{ date: "2026-03-08", type: "in", qty: 380, reference: "INB-5005" }],
  },
];

// ── Inbound Shipments ── (10 shipments)

export interface InboundShipmentItem {
  sku: string;
  description: string;
  qtyExpected: number;
  qtyReceived?: number;
  condition?: "Good" | "Damaged" | "Partial";
}

export interface InboundShipment {
  shipmentId: string;
  origin: string;
  supplier: string;
  carrier: string;
  items: string;
  itemDetails: InboundShipmentItem[];
  expectedDate: string;
  status: "Expected" | "Arriving" | "Received" | "Inspecting" | "Put Away";
  bocEntry?: string;
  containerNo?: string;
  poNumber: string;
  qtyExpected: number;
}

export const inboundShipments: InboundShipment[] = [
  {
    shipmentId: "INB-5001",
    origin: "Nueva Ecija",
    supplier: "Santos Agri Trading",
    carrier: "JRS Express Trucking",
    items: "Jasmine Rice x120, Kopiko Coffee x80",
    itemDetails: [
      { sku: "DRY-1001", description: "Premium Jasmine Rice 50kg", qtyExpected: 120 },
      { sku: "DRY-1006", description: "Kopiko Brown Coffee 25g x30", qtyExpected: 80 },
    ],
    expectedDate: "2026-03-19",
    status: "Arriving",
    poNumber: "PO-2026-0301",
    qtyExpected: 200,
  },
  {
    shipmentId: "INB-5002",
    origin: "General Santos",
    supplier: "GenSan Frozen Foods",
    carrier: "Luen Thai Logistics",
    items: "Frozen Bangus x60, Frozen Prawns x40",
    itemDetails: [
      { sku: "CLD-2001", description: "Frozen Bangus Belly 1kg", qtyExpected: 60 },
      { sku: "CLD-2002", description: "Frozen Tiger Prawns 500g", qtyExpected: 40 },
    ],
    expectedDate: "2026-03-19",
    status: "Arriving",
    poNumber: "PO-2026-0305",
    qtyExpected: 100,
  },
  {
    shipmentId: "INB-5003",
    origin: "Makati City",
    supplier: "Zuellig Pharma",
    carrier: "2GO Cargo",
    items: "Biogesic x200, Insulin Vials x30",
    itemDetails: [
      { sku: "PHR-4001", description: "Biogesic Paracetamol 500mg x100 tabs", qtyExpected: 200 },
      { sku: "PHR-4002", description: "Insulin Vials NovoRapid 10mL x5", qtyExpected: 30 },
    ],
    expectedDate: "2026-03-20",
    status: "Expected",
    poNumber: "PO-2026-0308",
    qtyExpected: 230,
  },
  {
    shipmentId: "INB-5004",
    origin: "Shenzhen, China",
    supplier: "Samsung Philippines (Import)",
    carrier: "Maersk Philippines",
    items: "Samsung Galaxy Tab A9 x200",
    itemDetails: [
      { sku: "ELC-3001", description: "Samsung Galaxy Tab A9 Tablet 64GB", qtyExpected: 200 },
    ],
    expectedDate: "2026-03-21",
    status: "Expected",
    bocEntry: "BOC-2026-IMP-04521",
    containerNo: "MSKU-7281940",
    poNumber: "PO-2026-0312",
    qtyExpected: 200,
  },
  {
    shipmentId: "INB-5005",
    origin: "San Fernando, Pampanga",
    supplier: "CDO Foodsphere Inc",
    carrier: "Entrego Freight",
    items: "Corned Beef x50, Tuna Flakes x60",
    itemDetails: [
      { sku: "DRY-1003", description: "Argentina Corned Beef 260g x24", qtyExpected: 50 },
      { sku: "DRY-1002", description: "Century Tuna Flakes in Oil 155g x48", qtyExpected: 60 },
    ],
    expectedDate: "2026-03-18",
    status: "Received",
    poNumber: "PO-2026-0228",
    qtyExpected: 110,
  },
  {
    shipmentId: "INB-5006",
    origin: "Meycauayan, Bulacan",
    supplier: "Bounty Fresh",
    carrier: "Ninja Van Freight",
    items: "Chilled Chicken x80",
    itemDetails: [
      { sku: "CLD-2003", description: "Chilled Whole Chicken 1.2kg", qtyExpected: 80 },
    ],
    expectedDate: "2026-03-17",
    status: "Put Away",
    poNumber: "PO-2026-0225",
    qtyExpected: 80,
  },
  {
    shipmentId: "INB-5007",
    origin: "Bangkok, Thailand",
    supplier: "Mayora Indah (Import)",
    carrier: "Evergreen Shipping",
    items: "Kopiko Brown Coffee x500",
    itemDetails: [
      { sku: "DRY-1006", description: "Kopiko Brown Coffee 25g x30", qtyExpected: 500 },
    ],
    expectedDate: "2026-03-22",
    status: "Expected",
    bocEntry: "BOC-2026-IMP-04588",
    containerNo: "EGHU-3041562",
    poNumber: "PO-2026-0315",
    qtyExpected: 500,
  },
  {
    shipmentId: "INB-5008",
    origin: "Cabuyao, Laguna",
    supplier: "Nestle Philippines",
    carrier: "Flash Express",
    items: "Nestle Coffee Mate x120, Lucky Me x200",
    itemDetails: [
      { sku: "DRY-1005", description: "Nestle Coffee Mate 450g x12", qtyExpected: 120 },
      { sku: "DRY-1007", description: "Lucky Me Pancit Canton Original 60g x48", qtyExpected: 200 },
    ],
    expectedDate: "2026-03-19",
    status: "Inspecting",
    poNumber: "PO-2026-0310",
    qtyExpected: 320,
  },
  {
    shipmentId: "INB-5009",
    origin: "Lucena City, Quezon",
    supplier: "Ajinomoto Philippines",
    carrier: "LBC Express Cargo",
    items: "Ajinomoto Seasoning x150, Soy Sauce x100",
    itemDetails: [
      { sku: "DRY-1022", description: "Ajinomoto Umami Seasoning 100g x48", qtyExpected: 150 },
      { sku: "DRY-1008", description: "Silver Swan Soy Sauce 1L x12", qtyExpected: 100 },
    ],
    expectedDate: "2026-03-23",
    status: "Expected",
    poNumber: "PO-2026-0318",
    qtyExpected: 250,
  },
  {
    shipmentId: "INB-5010",
    origin: "Binan, Laguna",
    supplier: "Unilever Philippines",
    carrier: "Transportify",
    items: "Surf Detergent x200, Champion Detergent x150",
    itemDetails: [
      { sku: "DRY-1025", description: "Surf Powder Detergent 2.2kg x6", qtyExpected: 200 },
      { sku: "DRY-1024", description: "Champion Detergent Powder 1kg x12", qtyExpected: 150 },
    ],
    expectedDate: "2026-03-20",
    status: "Expected",
    poNumber: "PO-2026-0319",
    qtyExpected: 350,
  },
];

// ── Outbound Shipments ── (8 orders)

export interface OutboundShipmentItem {
  sku: string;
  description: string;
  qtyOrdered: number;
  qtyPicked?: number;
}

export interface OutboundShipment {
  orderId: string;
  consignee: string;
  destination: string;
  deliveryAddress: string;
  items: string;
  itemDetails: OutboundShipmentItem[];
  status: "Picking" | "Packing" | "QC_Check" | "Ready" | "Dispatched";
  shipBy: string;
  carrier: string;
  waybillDr: string;
  qcPassed?: boolean;
  packingList?: string;
}

export const outboundShipments: OutboundShipment[] = [
  {
    orderId: "OUT-6001",
    consignee: "SM Hypermarket - MOA",
    destination: "Mall of Asia, Pasay City",
    deliveryAddress: "SM Mall of Asia, J.W. Diokno Blvd, Pasay City 1300",
    items: "Jasmine Rice x40, Tuna Flakes x30",
    itemDetails: [
      { sku: "DRY-1001", description: "Premium Jasmine Rice 50kg", qtyOrdered: 40, qtyPicked: 20 },
      { sku: "DRY-1002", description: "Century Tuna Flakes in Oil 155g x48", qtyOrdered: 30, qtyPicked: 15 },
    ],
    status: "Picking",
    shipBy: "2026-03-20",
    carrier: "JRS Express Trucking",
    waybillDr: "DR-2026-6001",
  },
  {
    orderId: "OUT-6002",
    consignee: "Mercury Drug - QC Branch",
    destination: "Quezon City, Metro Manila",
    deliveryAddress: "Mercury Drug Warehouse, Quezon Ave, Quezon City 1100",
    items: "Biogesic x100, Insulin Vials x10",
    itemDetails: [
      { sku: "PHR-4001", description: "Biogesic Paracetamol 500mg x100 tabs", qtyOrdered: 100, qtyPicked: 100 },
      { sku: "PHR-4002", description: "Insulin Vials NovoRapid 10mL x5", qtyOrdered: 10, qtyPicked: 10 },
    ],
    status: "QC_Check",
    shipBy: "2026-03-19",
    carrier: "2GO Cargo",
    waybillDr: "DR-2026-6002",
    qcPassed: true,
  },
  {
    orderId: "OUT-6003",
    consignee: "Lazada Fulfillment Center",
    destination: "Binan, Laguna",
    deliveryAddress: "Lazada Warehouse, Laguna Technopark, Binan, Laguna 4024",
    items: "Samsung Tablets x50, BT Speaker x20",
    itemDetails: [
      { sku: "ELC-3001", description: "Samsung Galaxy Tab A9 Tablet 64GB", qtyOrdered: 50, qtyPicked: 50 },
      { sku: "ELC-3002", description: "Portable Bluetooth Speaker JBL Go 3", qtyOrdered: 20, qtyPicked: 20 },
    ],
    status: "Dispatched",
    shipBy: "2026-03-18",
    carrier: "Ninja Van Freight",
    waybillDr: "WB-2026-LZD-003",
    qcPassed: true,
    packingList: "PL-2026-003",
  },
  {
    orderId: "OUT-6004",
    consignee: "Robinsons Supermarket - Cebu",
    destination: "Cebu City, Cebu",
    deliveryAddress: "Robinsons Galleria Cebu, Gen. Maxilom Ave, Cebu City 6000",
    items: "Frozen Bangus x30, Frozen Prawns x20",
    itemDetails: [
      { sku: "CLD-2001", description: "Frozen Bangus Belly 1kg", qtyOrdered: 30, qtyPicked: 30 },
      { sku: "CLD-2002", description: "Frozen Tiger Prawns 500g", qtyOrdered: 20, qtyPicked: 20 },
    ],
    status: "Packing",
    shipBy: "2026-03-21",
    carrier: "Luen Thai Logistics",
    waybillDr: "DR-2026-6004",
  },
  {
    orderId: "OUT-6005",
    consignee: "Puregold - Clark",
    destination: "Clark Freeport, Pampanga",
    deliveryAddress: "Puregold Price Club, M.A. Roxas Hwy, Clark Freeport Zone 2023",
    items: "Del Monte Ketchup x40, Kopiko Coffee x60",
    itemDetails: [
      { sku: "DRY-1004", description: "Del Monte Tomato Ketchup 320g x24", qtyOrdered: 40, qtyPicked: 10 },
      { sku: "DRY-1006", description: "Kopiko Brown Coffee 25g x30", qtyOrdered: 60, qtyPicked: 20 },
    ],
    status: "Picking",
    shipBy: "2026-03-22",
    carrier: "Entrego Freight",
    waybillDr: "DR-2026-6005",
  },
  {
    orderId: "OUT-6006",
    consignee: "Watsons - Makati",
    destination: "Makati City, Metro Manila",
    deliveryAddress: "Watsons Warehouse, Chino Roces Ave, Makati City 1230",
    items: "Biogesic x50, Coffee Mate x30",
    itemDetails: [
      { sku: "PHR-4001", description: "Biogesic Paracetamol 500mg x100 tabs", qtyOrdered: 50, qtyPicked: 50 },
      { sku: "DRY-1005", description: "Nestle Coffee Mate 450g x12", qtyOrdered: 30, qtyPicked: 30 },
    ],
    status: "Dispatched",
    shipBy: "2026-03-17",
    carrier: "Flash Express",
    waybillDr: "WB-2026-WAT-006",
    qcPassed: true,
    packingList: "PL-2026-006",
  },
  {
    orderId: "OUT-6007",
    consignee: "7-Eleven Distribution Center",
    destination: "Taguig City, Metro Manila",
    deliveryAddress: "7-Eleven Philippines DC, Lawton Ave, Taguig City 1630",
    items: "Lucky Me x100, Skyflakes x80, C2 Tea x60",
    itemDetails: [
      { sku: "DRY-1007", description: "Lucky Me Pancit Canton Original 60g x48", qtyOrdered: 100, qtyPicked: 100 },
      { sku: "DRY-1010", description: "Skyflakes Crackers 200g x30", qtyOrdered: 80, qtyPicked: 80 },
      { sku: "BEV-5002", description: "C2 Green Tea Apple 500mL x24", qtyOrdered: 60, qtyPicked: 60 },
    ],
    status: "Ready",
    shipBy: "2026-03-19",
    carrier: "Transportify",
    waybillDr: "DR-2026-6007",
    qcPassed: true,
    packingList: "PL-2026-007",
  },
  {
    orderId: "OUT-6008",
    consignee: "Shopee Fulfillment Hub",
    destination: "Paranaque City, Metro Manila",
    deliveryAddress: "Shopee Xpress Hub, Dr. A. Santos Ave, Paranaque City 1700",
    items: "Earbuds x20, Power Bank x30, WiFi Router x10",
    itemDetails: [
      { sku: "ELC-3003", description: "Xiaomi Redmi Earbuds Basic 2", qtyOrdered: 20 },
      { sku: "ELC-3004", description: "Anker PowerCore 10000mAh Power Bank", qtyOrdered: 30 },
      { sku: "ELC-3005", description: "TP-Link WiFi Router Archer C6", qtyOrdered: 10 },
    ],
    status: "Picking",
    shipBy: "2026-03-22",
    carrier: "Ninja Van Freight",
    waybillDr: "DR-2026-6008",
  },
];

// ── Known Carriers ──

export const knownCarriers = [
  "JRS Express Trucking",
  "Luen Thai Logistics",
  "2GO Cargo",
  "Maersk Philippines",
  "Entrego Freight",
  "Ninja Van Freight",
  "Evergreen Shipping",
  "Flash Express",
  "LBC Express Cargo",
  "Transportify",
  "Lalamove Truck",
  "AP Cargo",
];

// ── Report Data ──

export const monthlyVolume = [
  { month: "Oct 2025", inbound: 42, outbound: 38 },
  { month: "Nov 2025", inbound: 51, outbound: 45 },
  { month: "Dec 2025", inbound: 68, outbound: 62 },
  { month: "Jan 2026", inbound: 55, outbound: 48 },
  { month: "Feb 2026", inbound: 47, outbound: 44 },
  { month: "Mar 2026", inbound: 58, outbound: 52 },
];

export const capacityTrend = [
  { month: "Oct 2025", utilization: 52 },
  { month: "Nov 2025", utilization: 55 },
  { month: "Dec 2025", utilization: 63 },
  { month: "Jan 2026", utilization: 58 },
  { month: "Feb 2026", utilization: 54 },
  { month: "Mar 2026", utilization: 58 },
];
