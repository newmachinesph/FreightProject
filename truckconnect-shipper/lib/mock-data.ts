// ─── Company Profile ────────────────────────────────────────────────────────

export const companyProfile = {
  name: "Manila FMCG Corp",
  industry: "Fast Moving Consumer Goods",
  contact: "Maria Santos",
  mobile: "+63 918 765 4321",
  viber: "+63 918 765 4321",
  email: "maria@manilafmcg.ph",
  billingAddress: "Unit 1201, One Ayala Tower, Makati City",
  birTin: "987-654-321-000",
  secRegNo: "SEC-CS201812345",
  pezaBoi: "PEZA-2023-001",
  shopeeId: "",
  lazadaId: "",
  monthlyVolume: "50-100 shipments",
};

// ─── Load Types ─────────────────────────────────────────────────────────────

export type LoadStatus = "draft" | "posted" | "bidding" | "awarded" | "in_transit" | "delivered" | "cancelled";

export interface Load {
  id: string;
  pickupAddress: string;
  pickupCity: string;
  deliveryAddress: string;
  deliveryCity: string;
  pickupDate: string;
  pickupWindow: string;
  deliveryDate?: string;
  cargoType: string;
  cargoCategory: string;
  commodity: string;
  weightKg: number;
  volumeCbm: number;
  vehicleNeeded: string;
  numTrucks: number;
  offeredRate: number;
  paymentTerms: string;
  interIsland: boolean;
  originIsland?: string;
  destIsland?: string;
  bocEntryNo?: string;
  specialHandling?: string;
  tempRequirement?: string;
  hazmatClass?: string;
  referenceNo?: string;
  bidDeadline?: string;
  instantBook?: boolean;
  status: LoadStatus;
  bids: number;
  postedDate: string;
  image?: string;
}

// ─── 15 Loads ───────────────────────────────────────────────────────────────

export const loads: Load[] = [
  {
    id: "LD-2026-001",
    pickupAddress: "Warehouse 3, North Harbor, Tondo",
    pickupCity: "Manila",
    deliveryAddress: "SM City Cebu Warehouse, North Reclamation Area",
    deliveryCity: "Cebu",
    pickupDate: "2026-03-22",
    pickupWindow: "6:00 AM - 10:00 AM",
    deliveryDate: "2026-03-25",
    cargoType: "FMCG",
    cargoCategory: "Food/Beverage",
    commodity: "Canned goods & instant noodles",
    weightKg: 18000,
    volumeCbm: 42,
    vehicleNeeded: "Wing Van",
    numTrucks: 2,
    offeredRate: 145000,
    paymentTerms: "15 days",
    interIsland: true,
    originIsland: "Luzon",
    destIsland: "Visayas",
    specialHandling: "Keep dry, stack max 5 layers",
    referenceNo: "PO-FMCG-2026-0312",
    bidDeadline: "2026-03-21",
    status: "bidding",
    bids: 5,
    postedDate: "2026-03-18",
  },
  {
    id: "LD-2026-002",
    pickupAddress: "Samsung PH Distrib Center, Filinvest Alabang",
    pickupCity: "Makati",
    deliveryAddress: "Clark Freeport Zone, Bldg 2190",
    deliveryCity: "Clark",
    pickupDate: "2026-03-23",
    pickupWindow: "8:00 AM - 12:00 PM",
    deliveryDate: "2026-03-23",
    cargoType: "Electronics",
    cargoCategory: "Electronics",
    commodity: "Samsung tablets & accessories",
    weightKg: 4500,
    volumeCbm: 18,
    vehicleNeeded: "Closed Van",
    numTrucks: 1,
    offeredRate: 38000,
    paymentTerms: "COD",
    interIsland: false,
    specialHandling: "Fragile, temperature-sensitive",
    tempRequirement: "Below 30\u00B0C",
    referenceNo: "PO-ELEC-2026-0089",
    bidDeadline: "2026-03-22",
    status: "posted",
    bids: 2,
    postedDate: "2026-03-19",
  },
  {
    id: "LD-2026-003",
    pickupAddress: "Batangas International Port, Pier 4",
    pickupCity: "Batangas",
    deliveryAddress: "Puregold Warehouse, Pasig Blvd",
    deliveryCity: "Pasig",
    pickupDate: "2026-03-24",
    pickupWindow: "7:00 AM - 11:00 AM",
    deliveryDate: "2026-03-24",
    cargoType: "Electronics",
    cargoCategory: "Electronics",
    commodity: "Imported LED panels (China)",
    weightKg: 12000,
    volumeCbm: 35,
    vehicleNeeded: "Wing Van",
    numTrucks: 1,
    offeredRate: 52000,
    paymentTerms: "7 days",
    interIsland: false,
    bocEntryNo: "BOC-2026-BTG-04521",
    specialHandling: "Customs-cleared, fragile glass panels",
    referenceNo: "IMP-LED-2026-003",
    bidDeadline: "2026-03-23",
    status: "posted",
    bids: 3,
    postedDate: "2026-03-18",
  },
  {
    id: "LD-2026-004",
    pickupAddress: "Davao Agri Trading Hub, Km 12 Toril",
    pickupCity: "Davao",
    deliveryAddress: "GenSan Fish Port Complex, Gen. Santos City",
    deliveryCity: "General Santos",
    pickupDate: "2026-03-21",
    pickupWindow: "5:00 AM - 9:00 AM",
    deliveryDate: "2026-03-21",
    cargoType: "Agricultural",
    cargoCategory: "Agricultural",
    commodity: "Fresh bananas (Cavendish, export grade)",
    weightKg: 22000,
    volumeCbm: 55,
    vehicleNeeded: "10-Wheeler",
    numTrucks: 3,
    offeredRate: 68000,
    paymentTerms: "COD",
    interIsland: false,
    specialHandling: "Perishable, ventilated transport required",
    referenceNo: "AGR-BAN-2026-0045",
    bidDeadline: "2026-03-20",
    status: "awarded",
    bids: 7,
    postedDate: "2026-03-15",
  },
  {
    id: "LD-2026-005",
    pickupAddress: "Holcim Depot, NLEX Valenzuela",
    pickupCity: "Manila",
    deliveryAddress: "Mega Construction Site, Legazpi City",
    deliveryCity: "Naga",
    pickupDate: "2026-03-25",
    pickupWindow: "4:00 AM - 8:00 AM",
    deliveryDate: "2026-03-26",
    cargoType: "Construction",
    cargoCategory: "Construction",
    commodity: "Cement bags (40kg x 500) & steel rebars",
    weightKg: 28000,
    volumeCbm: 38,
    vehicleNeeded: "Trailer",
    numTrucks: 2,
    offeredRate: 85000,
    paymentTerms: "30 days",
    interIsland: false,
    specialHandling: "Heavy load, secure tie-downs required",
    hazmatClass: "Non-hazmat but dusty",
    referenceNo: "CON-MIX-2026-0178",
    bidDeadline: "2026-03-24",
    status: "posted",
    bids: 1,
    postedDate: "2026-03-19",
  },
  {
    id: "LD-2026-006",
    pickupAddress: "Unilab Warehouse, Mandaue City",
    pickupCity: "Cebu",
    deliveryAddress: "Mercury Drug Depot, Dumaguete City",
    deliveryCity: "Dumaguete",
    pickupDate: "2026-03-20",
    pickupWindow: "6:00 AM - 10:00 AM",
    deliveryDate: "2026-03-21",
    cargoType: "Pharmaceuticals",
    cargoCategory: "Pharmaceutical",
    commodity: "Medicines & medical supplies",
    weightKg: 3200,
    volumeCbm: 12,
    vehicleNeeded: "Reefer Van",
    numTrucks: 1,
    offeredRate: 42000,
    paymentTerms: "7 days",
    interIsland: false,
    specialHandling: "Temperature-controlled, FDA-regulated",
    tempRequirement: "2\u00B0C - 8\u00B0C",
    referenceNo: "PHARMA-2026-0067",
    bidDeadline: "2026-03-19",
    status: "in_transit",
    bids: 4,
    postedDate: "2026-03-14",
  },
  {
    id: "LD-2026-007",
    pickupAddress: "PEZA Bldg, Clark Special Economic Zone",
    pickupCity: "Clark",
    deliveryAddress: "Subic Bay Freeport Zone, Warehouse 18",
    deliveryCity: "Subic",
    pickupDate: "2026-03-22",
    pickupWindow: "9:00 AM - 1:00 PM",
    deliveryDate: "2026-03-22",
    cargoType: "Electronics",
    cargoCategory: "Electronics",
    commodity: "Semiconductor components (PEZA export)",
    weightKg: 2800,
    volumeCbm: 8,
    vehicleNeeded: "Closed Van",
    numTrucks: 1,
    offeredRate: 28000,
    paymentTerms: "15 days",
    interIsland: false,
    specialHandling: "ESD-safe packaging, no stacking",
    referenceNo: "PEZA-SEMI-2026-009",
    bidDeadline: "2026-03-21",
    status: "draft",
    bids: 0,
    postedDate: "2026-03-19",
  },
  {
    id: "LD-2026-008",
    pickupAddress: "Divisoria Garment District, Warehouse 7",
    pickupCity: "Manila",
    deliveryAddress: "SM Baguio Receiving Dock, Session Road",
    deliveryCity: "Baguio",
    pickupDate: "2026-03-26",
    pickupWindow: "3:00 AM - 7:00 AM",
    deliveryDate: "2026-03-26",
    cargoType: "Garments",
    cargoCategory: "E-commerce",
    commodity: "Winter jackets & thermal wear",
    weightKg: 6500,
    volumeCbm: 28,
    vehicleNeeded: "Closed Van",
    numTrucks: 1,
    offeredRate: 32000,
    paymentTerms: "GCash",
    interIsland: false,
    specialHandling: "Keep dry, no compression",
    referenceNo: "GAR-WIN-2026-0221",
    bidDeadline: "2026-03-25",
    status: "bidding",
    bids: 3,
    postedDate: "2026-03-17",
  },
  {
    id: "LD-2026-009",
    pickupAddress: "Magnolia Depot, NLEX Meycauayan",
    pickupCity: "Manila",
    deliveryAddress: "Puregold San Fernando, Pampanga",
    deliveryCity: "Pampanga",
    pickupDate: "2026-03-20",
    pickupWindow: "10:00 AM - 2:00 PM",
    deliveryDate: "2026-03-20",
    cargoType: "FMCG",
    cargoCategory: "Food/Beverage",
    commodity: "Ice cream & frozen desserts",
    weightKg: 1800,
    volumeCbm: 6,
    vehicleNeeded: "L300",
    numTrucks: 1,
    offeredRate: 8500,
    paymentTerms: "GCash",
    interIsland: false,
    tempRequirement: "-18\u00B0C",
    referenceNo: "FMCG-ICE-2026-0330",
    status: "delivered",
    bids: 2,
    postedDate: "2026-03-12",
  },
  {
    id: "LD-2026-010",
    pickupAddress: "Cebu Fishing Port, Consolacion",
    pickupCity: "Cebu",
    deliveryAddress: "CDO Public Market Cold Storage, Cagayan de Oro",
    deliveryCity: "CDO",
    pickupDate: "2026-03-23",
    pickupWindow: "4:00 AM - 8:00 AM",
    deliveryDate: "2026-03-25",
    cargoType: "Frozen Seafood",
    cargoCategory: "Refrigerated",
    commodity: "Frozen tuna & shrimp",
    weightKg: 15000,
    volumeCbm: 30,
    vehicleNeeded: "Reefer Van",
    numTrucks: 2,
    offeredRate: 95000,
    paymentTerms: "COD",
    interIsland: true,
    originIsland: "Visayas",
    destIsland: "Mindanao",
    specialHandling: "Maintain cold chain, -20\u00B0C required",
    tempRequirement: "-20\u00B0C",
    referenceNo: "SEA-FRZ-2026-0112",
    bidDeadline: "2026-03-22",
    status: "in_transit",
    bids: 6,
    postedDate: "2026-03-16",
  },
  {
    id: "LD-2026-011",
    pickupAddress: "Toyota Motor PH, Santa Rosa, Laguna",
    pickupCity: "Laguna",
    deliveryAddress: "AutoHub Iloilo Showroom, Mandurriao",
    deliveryCity: "Iloilo",
    pickupDate: "2026-03-27",
    pickupWindow: "6:00 AM - 10:00 AM",
    deliveryDate: "2026-03-30",
    cargoType: "Automotive Parts",
    cargoCategory: "Automotive",
    commodity: "Car body panels & engine parts",
    weightKg: 9500,
    volumeCbm: 32,
    vehicleNeeded: "Wing Van",
    numTrucks: 1,
    offeredRate: 112000,
    paymentTerms: "30 days",
    interIsland: true,
    originIsland: "Luzon",
    destIsland: "Visayas",
    specialHandling: "Fragile auto parts, anti-rust wrap required",
    referenceNo: "AUTO-TOY-2026-0088",
    bidDeadline: "2026-03-26",
    status: "posted",
    bids: 0,
    postedDate: "2026-03-19",
  },
  {
    id: "LD-2026-012",
    pickupAddress: "Lazada Fulfillment Center, Binan, Laguna",
    pickupCity: "Laguna",
    deliveryAddress: "Lazada Hub Davao, Bajada",
    deliveryCity: "Davao",
    pickupDate: "2026-03-24",
    pickupWindow: "8:00 AM - 12:00 PM",
    deliveryDate: "2026-03-28",
    cargoType: "E-commerce Parcels",
    cargoCategory: "E-commerce",
    commodity: "Mixed e-commerce parcels (3,200 units)",
    weightKg: 5600,
    volumeCbm: 40,
    vehicleNeeded: "Wing Van",
    numTrucks: 1,
    offeredRate: 135000,
    paymentTerms: "15 days",
    interIsland: true,
    originIsland: "Luzon",
    destIsland: "Mindanao",
    specialHandling: "Handle with care, sorted by zone",
    referenceNo: "ECOM-LZD-2026-0445",
    bidDeadline: "2026-03-23",
    instantBook: true,
    status: "bidding",
    bids: 4,
    postedDate: "2026-03-18",
  },
  {
    id: "LD-2026-013",
    pickupAddress: "Petron Depot, Limay, Bataan",
    pickupCity: "Bataan",
    deliveryAddress: "Shell Gas Station Network, Quezon City",
    deliveryCity: "Quezon City",
    pickupDate: "2026-03-21",
    pickupWindow: "5:00 AM - 9:00 AM",
    deliveryDate: "2026-03-21",
    cargoType: "Petroleum",
    cargoCategory: "Hazmat",
    commodity: "Diesel fuel (20,000 liters)",
    weightKg: 17000,
    volumeCbm: 20,
    vehicleNeeded: "Tanker",
    numTrucks: 1,
    offeredRate: 45000,
    paymentTerms: "7 days",
    interIsland: false,
    hazmatClass: "Class 3 - Flammable Liquids",
    specialHandling: "Hazmat-certified driver required, no smoking within 50m",
    referenceNo: "HAZ-PET-2026-0091",
    bidDeadline: "2026-03-20",
    status: "delivered",
    bids: 2,
    postedDate: "2026-03-13",
  },
  {
    id: "LD-2026-014",
    pickupAddress: "Nestle PH Factory, Cabuyao, Laguna",
    pickupCity: "Laguna",
    deliveryAddress: "7-Eleven Distribution, Taguig",
    deliveryCity: "Taguig",
    pickupDate: "2026-03-19",
    pickupWindow: "7:00 AM - 11:00 AM",
    deliveryDate: "2026-03-19",
    cargoType: "FMCG",
    cargoCategory: "Food/Beverage",
    commodity: "Coffee, milk powder, & snack bars",
    weightKg: 8200,
    volumeCbm: 24,
    vehicleNeeded: "Closed Van",
    numTrucks: 1,
    offeredRate: 18500,
    paymentTerms: "15 days",
    interIsland: false,
    specialHandling: "No direct sunlight, keep dry",
    referenceNo: "FMCG-NST-2026-0199",
    status: "delivered",
    bids: 3,
    postedDate: "2026-03-11",
  },
  {
    id: "LD-2026-015",
    pickupAddress: "Dole Philippines, Polomolok, South Cotabato",
    pickupCity: "General Santos",
    deliveryAddress: "Manila International Container Terminal",
    deliveryCity: "Manila",
    pickupDate: "2026-03-28",
    pickupWindow: "4:00 AM - 8:00 AM",
    deliveryDate: "2026-04-01",
    cargoType: "Agricultural",
    cargoCategory: "Agricultural",
    commodity: "Pineapple concentrate (export, 40 pallets)",
    weightKg: 24000,
    volumeCbm: 48,
    vehicleNeeded: "Reefer Van",
    numTrucks: 2,
    offeredRate: 185000,
    paymentTerms: "30 days",
    interIsland: true,
    originIsland: "Mindanao",
    destIsland: "Luzon",
    specialHandling: "Reefer at 2-4\u00B0C, export documentation required",
    tempRequirement: "2\u00B0C - 4\u00B0C",
    referenceNo: "AGR-DOLE-2026-0033",
    bidDeadline: "2026-03-27",
    bocEntryNo: "BOC-2026-MNL-09821",
    status: "cancelled",
    bids: 1,
    postedDate: "2026-03-17",
  },
];

// ─── Bid Type ───────────────────────────────────────────────────────────────

export interface Bid {
  id: string;
  loadId: string;
  carrier: string;
  carrierRating: number;
  tripsCompleted: number;
  bidAmount: number;
  vehicleOffered: string;
  plateNo: string;
  estimatedPickup: string;
  estimatedDelivery: string;
  notes: string;
  submittedAt: string;
}

export const bids: Bid[] = [
  { id: "BID-001", loadId: "LD-2026-001", carrier: "Luzon-Visayas Freight Lines", carrierRating: 4.6, tripsCompleted: 18, bidAmount: 140000, vehicleOffered: "Wing Van (2 units)", plateNo: "MNL 3301 / MNL 3302", estimatedPickup: "2026-03-22 07:00", estimatedDelivery: "2026-03-25 14:00", notes: "RoRo via Batangas-Cebu route", submittedAt: "2026-03-18 10:30" },
  { id: "BID-002", loadId: "LD-2026-001", carrier: "Island Express Logistics", carrierRating: 4.3, tripsCompleted: 9, bidAmount: 148000, vehicleOffered: "Wing Van (2 units)", plateNo: "CEB 1102 / CEB 1103", estimatedPickup: "2026-03-22 08:00", estimatedDelivery: "2026-03-26 10:00", notes: "Via Lite Ferry, can handle 18t", submittedAt: "2026-03-18 14:15" },
  { id: "BID-003", loadId: "LD-2026-001", carrier: "Pacific Cargo Corp", carrierRating: 4.8, tripsCompleted: 32, bidAmount: 138000, vehicleOffered: "Wing Van (2 units)", plateNo: "MNL 5510 / MNL 5511", estimatedPickup: "2026-03-22 06:30", estimatedDelivery: "2026-03-24 18:00", notes: "Express RoRo, priority vessel slot", submittedAt: "2026-03-19 08:00" },
  { id: "BID-004", loadId: "LD-2026-001", carrier: "Visayan Truckers Coop", carrierRating: 4.1, tripsCompleted: 5, bidAmount: 152000, vehicleOffered: "Wing Van (2 units)", plateNo: "CEB 7721 / CEB 7722", estimatedPickup: "2026-03-22 09:00", estimatedDelivery: "2026-03-26 16:00", notes: "Standard RoRo service", submittedAt: "2026-03-19 11:45" },
  { id: "BID-005", loadId: "LD-2026-001", carrier: "FastHaul Mindanao", carrierRating: 3.9, tripsCompleted: 3, bidAmount: 155000, vehicleOffered: "Wing Van (2 units)", plateNo: "DVO 3300 / DVO 3301", estimatedPickup: "2026-03-22 10:00", estimatedDelivery: "2026-03-27 09:00", notes: "Can also deliver to satellite warehouses", submittedAt: "2026-03-19 16:20" },
  { id: "BID-006", loadId: "LD-2026-002", carrier: "NLEX Express Haulers", carrierRating: 4.5, tripsCompleted: 15, bidAmount: 36000, vehicleOffered: "Closed Van", plateNo: "MNL 8801", estimatedPickup: "2026-03-23 08:30", estimatedDelivery: "2026-03-23 16:00", notes: "Climate-controlled van available", submittedAt: "2026-03-19 09:00" },
  { id: "BID-007", loadId: "LD-2026-002", carrier: "Clark Logistics Inc.", carrierRating: 4.7, tripsCompleted: 22, bidAmount: 35500, vehicleOffered: "Closed Van", plateNo: "CLK 2201", estimatedPickup: "2026-03-23 09:00", estimatedDelivery: "2026-03-23 14:30", notes: "Based in Clark, fast turnaround", submittedAt: "2026-03-19 10:15" },
  { id: "BID-008", loadId: "LD-2026-008", carrier: "Mountain Province Haulers", carrierRating: 4.4, tripsCompleted: 11, bidAmount: 30000, vehicleOffered: "Closed Van", plateNo: "BAG 1100", estimatedPickup: "2026-03-26 04:00", estimatedDelivery: "2026-03-26 14:00", notes: "Expert in Baguio mountain routes", submittedAt: "2026-03-18 08:00" },
  { id: "BID-009", loadId: "LD-2026-008", carrier: "Metro Manila Express", carrierRating: 4.2, tripsCompleted: 8, bidAmount: 31500, vehicleOffered: "Closed Van", plateNo: "MNL 4450", estimatedPickup: "2026-03-26 03:30", estimatedDelivery: "2026-03-26 12:00", notes: "Experienced driver, knows Kennon Road", submittedAt: "2026-03-18 11:30" },
  { id: "BID-010", loadId: "LD-2026-008", carrier: "Cordillera Transport Co.", carrierRating: 4.6, tripsCompleted: 19, bidAmount: 29500, vehicleOffered: "Closed Van", plateNo: "BAG 2200", estimatedPickup: "2026-03-26 03:00", estimatedDelivery: "2026-03-26 11:00", notes: "Local Baguio carrier, fastest ETA", submittedAt: "2026-03-18 15:00" },
  { id: "BID-011", loadId: "LD-2026-012", carrier: "Philippines Interisland Freight", carrierRating: 4.5, tripsCompleted: 14, bidAmount: 130000, vehicleOffered: "Wing Van", plateNo: "MNL 6600", estimatedPickup: "2026-03-24 09:00", estimatedDelivery: "2026-03-28 18:00", notes: "Regular Luzon-Mindanao RoRo service", submittedAt: "2026-03-18 13:00" },
  { id: "BID-012", loadId: "LD-2026-012", carrier: "Davao Express Lines", carrierRating: 4.3, tripsCompleted: 7, bidAmount: 132000, vehicleOffered: "Wing Van", plateNo: "DVO 1100", estimatedPickup: "2026-03-24 08:00", estimatedDelivery: "2026-03-27 20:00", notes: "Direct vessel route available", submittedAt: "2026-03-18 16:00" },
  { id: "BID-013", loadId: "LD-2026-012", carrier: "SouthStar Cargo", carrierRating: 4.0, tripsCompleted: 4, bidAmount: 138000, vehicleOffered: "Wing Van", plateNo: "CDO 5500", estimatedPickup: "2026-03-24 10:00", estimatedDelivery: "2026-03-29 10:00", notes: "Insurance included up to 2M PHP", submittedAt: "2026-03-19 09:30" },
  { id: "BID-014", loadId: "LD-2026-012", carrier: "JM Express Trucking", carrierRating: 4.8, tripsCompleted: 24, bidAmount: 128000, vehicleOffered: "Wing Van", plateNo: "MNL 5578", estimatedPickup: "2026-03-24 08:30", estimatedDelivery: "2026-03-27 14:00", notes: "Priority handling for e-commerce", submittedAt: "2026-03-19 07:45" },
];

// ─── Booking Types ──────────────────────────────────────────────────────────

export type BookingStatus = "confirmed" | "picked_up" | "in_transit" | "delivered" | "cancelled";

export interface Booking {
  id: string;
  loadId: string;
  route: string;
  carrier: string;
  carrierRating: number;
  carrierContact: string;
  vehicle: string;
  plateNo: string;
  agreedRate: number;
  paymentTerms: string;
  paymentStatus: "Pending" | "Processing" | "Paid";
  status: BookingStatus;
  date: string;
}

// ─── 8 Bookings ─────────────────────────────────────────────────────────────

export const bookings: Booking[] = [
  {
    id: "BK-2026-001",
    loadId: "LD-2026-004",
    route: "Davao \u2192 General Santos",
    carrier: "Mindanao Agri Haulers",
    carrierRating: 4.4,
    carrierContact: "+63 922 111 2233",
    vehicle: "10-Wheeler (3 units)",
    plateNo: "DVO 7812 / DVO 7813 / DVO 7814",
    agreedRate: 65000,
    paymentTerms: "COD",
    paymentStatus: "Pending",
    status: "confirmed",
    date: "2026-03-16",
  },
  {
    id: "BK-2026-002",
    loadId: "LD-2026-006",
    route: "Cebu \u2192 Dumaguete",
    carrier: "Visayas Cold Chain Co.",
    carrierRating: 4.7,
    carrierContact: "+63 917 333 4455",
    vehicle: "Reefer Van",
    plateNo: "CEB 2245",
    agreedRate: 40000,
    paymentTerms: "7 days",
    paymentStatus: "Processing",
    status: "in_transit",
    date: "2026-03-15",
  },
  {
    id: "BK-2026-003",
    loadId: "LD-2026-010",
    route: "Cebu \u2192 CDO",
    carrier: "Island Reefer Transport",
    carrierRating: 4.5,
    carrierContact: "+63 920 555 6677",
    vehicle: "Reefer Van (2 units)",
    plateNo: "CEB 9031 / CEB 9032",
    agreedRate: 92000,
    paymentTerms: "COD",
    paymentStatus: "Pending",
    status: "in_transit",
    date: "2026-03-17",
  },
  {
    id: "BK-2026-004",
    loadId: "LD-2026-009",
    route: "Manila \u2192 Pampanga",
    carrier: "JM Express Trucking",
    carrierRating: 4.8,
    carrierContact: "+63 918 777 8899",
    vehicle: "L300 Reefer",
    plateNo: "MNL 5578",
    agreedRate: 8200,
    paymentTerms: "GCash",
    paymentStatus: "Paid",
    status: "delivered",
    date: "2026-03-13",
  },
  {
    id: "BK-2026-005",
    loadId: "LD-2026-001",
    route: "Manila \u2192 Cebu",
    carrier: "Luzon-Visayas Freight Lines",
    carrierRating: 4.6,
    carrierContact: "+63 916 222 3344",
    vehicle: "Wing Van (2 units)",
    plateNo: "MNL 3301 / MNL 3302",
    agreedRate: 140000,
    paymentTerms: "15 days",
    paymentStatus: "Pending",
    status: "confirmed",
    date: "2026-03-19",
  },
  {
    id: "BK-2026-006",
    loadId: "LD-2026-005",
    route: "Manila \u2192 Naga (Bicol)",
    carrier: "Bicol Express Logistics",
    carrierRating: 4.2,
    carrierContact: "+63 919 444 5566",
    vehicle: "Trailer (2 units)",
    plateNo: "MNL 6612 / MNL 6613",
    agreedRate: 82000,
    paymentTerms: "30 days",
    paymentStatus: "Pending",
    status: "cancelled",
    date: "2026-03-18",
  },
  {
    id: "BK-2026-007",
    loadId: "LD-2026-013",
    route: "Bataan \u2192 Quezon City",
    carrier: "PetroFleet Philippines",
    carrierRating: 4.3,
    carrierContact: "+63 921 888 9900",
    vehicle: "Tanker",
    plateNo: "BTN 4401",
    agreedRate: 43000,
    paymentTerms: "7 days",
    paymentStatus: "Paid",
    status: "delivered",
    date: "2026-03-14",
  },
  {
    id: "BK-2026-008",
    loadId: "LD-2026-014",
    route: "Laguna \u2192 Taguig",
    carrier: "Metro Manila Express",
    carrierRating: 4.2,
    carrierContact: "+63 917 666 7788",
    vehicle: "Closed Van",
    plateNo: "MNL 4450",
    agreedRate: 17800,
    paymentTerms: "15 days",
    paymentStatus: "Paid",
    status: "delivered",
    date: "2026-03-11",
  },
];

// ─── Payment Types ──────────────────────────────────────────────────────────

export type PaymentStatus = "Paid" | "Pending" | "Processing" | "Overdue";
export type PaymentMethod = "GCash" | "Bank Transfer" | "COD" | "Check";

export interface Payment {
  id: string;
  invoice: string;
  loadId: string;
  route: string;
  carrier: string;
  amount: number;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  dueDate: string;
  paidDate?: string;
}

// ─── 10 Payments ────────────────────────────────────────────────────────────

export const payments: Payment[] = [
  {
    id: "PAY-001",
    invoice: "INV-2026-001",
    loadId: "LD-2026-009",
    route: "Manila \u2192 Pampanga",
    carrier: "JM Express Trucking",
    amount: 8200,
    paymentMethod: "GCash",
    status: "Paid",
    dueDate: "2026-03-13",
    paidDate: "2026-03-13",
  },
  {
    id: "PAY-002",
    invoice: "INV-2026-002",
    loadId: "LD-2026-004",
    route: "Davao \u2192 General Santos",
    carrier: "Mindanao Agri Haulers",
    amount: 65000,
    paymentMethod: "COD",
    status: "Pending",
    dueDate: "2026-03-21",
  },
  {
    id: "PAY-003",
    invoice: "INV-2026-003",
    loadId: "LD-2026-006",
    route: "Cebu \u2192 Dumaguete",
    carrier: "Visayas Cold Chain Co.",
    amount: 40000,
    paymentMethod: "Bank Transfer",
    status: "Processing",
    dueDate: "2026-03-22",
  },
  {
    id: "PAY-004",
    invoice: "INV-2026-004",
    loadId: "LD-2026-001",
    route: "Manila \u2192 Cebu",
    carrier: "Luzon-Visayas Freight Lines",
    amount: 140000,
    paymentMethod: "Check",
    status: "Overdue",
    dueDate: "2026-03-10",
  },
  {
    id: "PAY-005",
    invoice: "INV-2026-005",
    loadId: "LD-2026-010",
    route: "Cebu \u2192 CDO",
    carrier: "Island Reefer Transport",
    amount: 92000,
    paymentMethod: "Bank Transfer",
    status: "Pending",
    dueDate: "2026-03-25",
  },
  {
    id: "PAY-006",
    invoice: "INV-2026-006",
    loadId: "LD-2026-013",
    route: "Bataan \u2192 Quezon City",
    carrier: "PetroFleet Philippines",
    amount: 43000,
    paymentMethod: "Bank Transfer",
    status: "Paid",
    dueDate: "2026-03-21",
    paidDate: "2026-03-18",
  },
  {
    id: "PAY-007",
    invoice: "INV-2026-007",
    loadId: "LD-2026-014",
    route: "Laguna \u2192 Taguig",
    carrier: "Metro Manila Express",
    amount: 17800,
    paymentMethod: "Bank Transfer",
    status: "Paid",
    dueDate: "2026-04-03",
    paidDate: "2026-03-19",
  },
  {
    id: "PAY-008",
    invoice: "INV-2026-008",
    loadId: "LD-2026-005",
    route: "Manila \u2192 Naga (Bicol)",
    carrier: "Bicol Express Logistics",
    amount: 82000,
    paymentMethod: "Check",
    status: "Pending",
    dueDate: "2026-04-17",
  },
  {
    id: "PAY-009",
    invoice: "INV-2026-009",
    loadId: "LD-2026-012",
    route: "Laguna \u2192 Davao",
    carrier: "JM Express Trucking",
    amount: 128000,
    paymentMethod: "Bank Transfer",
    status: "Pending",
    dueDate: "2026-04-08",
  },
  {
    id: "PAY-010",
    invoice: "INV-2026-010",
    loadId: "LD-2026-011",
    route: "Laguna \u2192 Iloilo",
    carrier: "Philippines Interisland Freight",
    amount: 112000,
    paymentMethod: "Check",
    status: "Pending",
    dueDate: "2026-04-26",
  },
];

// ─── Helpers ────────────────────────────────────────────────────────────────

export function formatPeso(amount: number): string {
  return `\u20B1${amount.toLocaleString()}`;
}

export function getActiveLoads() {
  return loads.filter((l) => ["posted", "bidding", "awarded"].includes(l.status)).length;
}

export function getInTransit() {
  return loads.filter((l) => l.status === "in_transit").length;
}

export function getDeliveredThisMonth() {
  return loads.filter((l) => l.status === "delivered").length;
}

export function getTotalSpend() {
  return payments.reduce((sum, p) => sum + p.amount, 0);
}

export function getMonthlySpend() {
  return bookings
    .filter((b) => b.status === "delivered" || b.status === "in_transit" || b.status === "confirmed")
    .reduce((sum, b) => sum + b.agreedRate, 0);
}

export function getBidsForLoad(loadId: string) {
  return bids.filter((b) => b.loadId === loadId);
}

export function getBookingForLoad(loadId: string) {
  return bookings.find((b) => b.loadId === loadId);
}

// ─── Preferred / Blocked Carriers ───────────────────────────────────────────

export const preferredCarriers = [
  { name: "JM Express Trucking", trips: 24, rating: 4.8 },
  { name: "Luzon-Visayas Freight Lines", trips: 18, rating: 4.6 },
  { name: "Visayas Cold Chain Co.", trips: 12, rating: 4.7 },
];

export const blockedCarriers = [
  { name: "QuickHaul PH", reason: "Late deliveries (3x)" },
  { name: "NoShow Trucking", reason: "No-show on pickup" },
];

// ─── Constants for Post Load wizard ────────────────────────────────────────

export const vehicleTypes = [
  "Sedan", "MPV/SUV", "L300", "Closed Van", "Dropside", "Elf",
  "Wing Van", "10-Wheeler", "Trailer", "Tanker", "Reefer Van",
];

export const cargoCategories = [
  "General", "Refrigerated", "Hazmat", "Electronics", "Construction",
  "Food/Beverage", "E-commerce", "Automotive", "Pharmaceutical", "Agricultural",
];

export const phCities = [
  "Manila", "Makati", "Quezon City", "Pasig", "Taguig", "Laguna",
  "Cebu", "Davao", "Clark", "Batangas", "Subic", "Bataan",
  "Baguio", "Naga", "Iloilo", "CDO", "General Santos",
  "Pampanga", "Dumaguete", "Legazpi", "Zamboanga", "Tacloban",
];

export const islands = ["Luzon", "Visayas", "Mindanao"];

export const paymentTermOptions = ["COD", "7 days", "15 days", "30 days", "GCash"];

export const timeWindows = [
  "3:00 AM - 7:00 AM", "4:00 AM - 8:00 AM", "5:00 AM - 9:00 AM",
  "6:00 AM - 10:00 AM", "7:00 AM - 11:00 AM", "8:00 AM - 12:00 PM",
  "9:00 AM - 1:00 PM", "10:00 AM - 2:00 PM", "11:00 AM - 3:00 PM",
  "12:00 PM - 4:00 PM", "1:00 PM - 5:00 PM", "2:00 PM - 6:00 PM",
];
