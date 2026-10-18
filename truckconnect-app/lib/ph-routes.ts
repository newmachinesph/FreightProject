// ─── Philippine Freight Routes ───
// Real GPS coordinates for major freight hubs, ports, and routes

// ─── Major Freight Hubs ───
export interface FreightHub {
  name: string;
  city: string;
  province: string;
  region: string;
  lat: number;
  lng: number;
  type: "port" | "freeport" | "industrial" | "distribution" | "cold_storage" | "airport_cargo";
  facilities?: string[];
}

export const FREIGHT_HUBS: FreightHub[] = [
  // NCR / Metro Manila
  { name: "Manila International Container Terminal (MICT)", city: "Manila", province: "Metro Manila", region: "NCR", lat: 14.5939, lng: 120.9593, type: "port", facilities: ["Container Yard", "Reefer Plugs", "Customs"] },
  { name: "Manila South Harbor", city: "Manila", province: "Metro Manila", region: "NCR", lat: 14.5831, lng: 120.9675, type: "port", facilities: ["RoRo Terminal", "Breakbulk", "Passenger"] },
  { name: "North Harbor (Tondo)", city: "Manila", province: "Metro Manila", region: "NCR", lat: 14.6161, lng: 120.9625, type: "port", facilities: ["Domestic Shipping", "Inter-island Cargo"] },
  { name: "Navotas Fish Port Complex", city: "Navotas", province: "Metro Manila", region: "NCR", lat: 14.6617, lng: 120.9432, type: "port", facilities: ["Fish Landing", "Cold Storage", "Ice Plant"] },
  { name: "Food Terminal Inc (FTI)", city: "Taguig", province: "Metro Manila", region: "NCR", lat: 14.5176, lng: 121.0509, type: "distribution", facilities: ["FMCG Warehouse", "Distribution Center"] },
  { name: "NAIA Cargo Terminal", city: "Pasay", province: "Metro Manila", region: "NCR", lat: 14.5086, lng: 121.0194, type: "airport_cargo", facilities: ["Air Freight", "Cold Chain", "Express"] },

  // Central Luzon
  { name: "Clark Freeport Zone", city: "Mabalacat", province: "Pampanga", region: "Central Luzon", lat: 15.1860, lng: 120.5460, type: "freeport", facilities: ["PEZA", "Air Cargo", "Warehouse"] },
  { name: "Subic Bay Freeport Zone", city: "Olongapo", province: "Zambales", region: "Central Luzon", lat: 14.7944, lng: 120.2828, type: "freeport", facilities: ["Port", "Container Yard", "Bonded Warehouse"] },
  { name: "Hermosa Industrial Park", city: "Hermosa", province: "Bataan", region: "Central Luzon", lat: 14.8317, lng: 120.5272, type: "industrial" },

  // CALABARZON
  { name: "Batangas International Port", city: "Batangas City", province: "Batangas", region: "CALABARZON", lat: 13.7565, lng: 121.0583, type: "port", facilities: ["RoRo Terminal", "Container", "Inter-island"] },
  { name: "Laguna Technopark", city: "Biñan", province: "Laguna", region: "CALABARZON", lat: 14.2108, lng: 121.1653, type: "industrial", facilities: ["Manufacturing", "PEZA", "Distribution"] },
  { name: "First Philippine Industrial Park", city: "Santo Tomas", province: "Batangas", region: "CALABARZON", lat: 14.1050, lng: 121.1427, type: "industrial" },
  { name: "Cavite Export Processing Zone", city: "Rosario", province: "Cavite", region: "CALABARZON", lat: 14.4143, lng: 120.8558, type: "freeport" },

  // Visayas
  { name: "Cebu International Port", city: "Cebu City", province: "Cebu", region: "Central Visayas", lat: 10.2989, lng: 123.8908, type: "port", facilities: ["Container", "RoRo", "Reefer Plugs"] },
  { name: "Mandaue Industrial Area", city: "Mandaue", province: "Cebu", region: "Central Visayas", lat: 10.3280, lng: 123.9225, type: "industrial" },
  { name: "Mactan Economic Zone", city: "Lapu-Lapu", province: "Cebu", region: "Central Visayas", lat: 10.2900, lng: 123.9700, type: "freeport", facilities: ["PEZA", "Export Processing"] },
  { name: "Iloilo Commercial Port", city: "Iloilo City", province: "Iloilo", region: "Western Visayas", lat: 10.6918, lng: 122.5644, type: "port", facilities: ["Domestic Cargo", "RoRo"] },
  { name: "Bacolod-Bredco Port", city: "Bacolod", province: "Negros Occidental", region: "Western Visayas", lat: 10.6840, lng: 122.9470, type: "port" },
  { name: "Tacloban Port", city: "Tacloban", province: "Leyte", region: "Eastern Visayas", lat: 11.2543, lng: 124.9656, type: "port" },

  // Mindanao
  { name: "Davao Sasa Port", city: "Davao City", province: "Davao del Sur", region: "Davao Region", lat: 7.0833, lng: 125.6333, type: "port", facilities: ["Container", "Breakbulk", "Reefer"] },
  { name: "General Santos Fish Port", city: "General Santos", province: "South Cotabato", region: "SOCCSKSARGEN", lat: 6.0878, lng: 125.1672, type: "port", facilities: ["Tuna Landing", "Cold Storage", "Export"] },
  { name: "Cagayan de Oro Port (Macabalan)", city: "Cagayan de Oro", province: "Misamis Oriental", region: "Northern Mindanao", lat: 8.4809, lng: 124.6383, type: "port", facilities: ["Container", "RoRo", "Domestic Cargo"] },
  { name: "Zamboanga Port", city: "Zamboanga City", province: "Zamboanga del Sur", region: "Zamboanga Peninsula", lat: 6.9214, lng: 122.0790, type: "port" },
  { name: "PHIVIDEC Industrial Estate", city: "Tagoloan", province: "Misamis Oriental", region: "Northern Mindanao", lat: 8.5350, lng: 124.7450, type: "industrial" },

  // Northern Luzon
  { name: "Sual Port", city: "Sual", province: "Pangasinan", region: "Ilocos Region", lat: 16.0600, lng: 120.1000, type: "port" },
  { name: "Baguio Trading Post", city: "Baguio", province: "Benguet", region: "CAR", lat: 16.4023, lng: 120.5960, type: "distribution" },

  // Palawan
  { name: "Puerto Princesa Port", city: "Puerto Princesa", province: "Palawan", region: "MIMAROPA", lat: 9.7489, lng: 118.7357, type: "port" },
];

// ─── RoRo Routes (Roll-on Roll-off) ───
// These are REAL ferry routes operating in the Philippines
export interface RoRoRoute {
  id: string;
  name: string;
  origin: { name: string; lat: number; lng: number };
  destination: { name: string; lat: number; lng: number };
  waypoints: { lat: number; lng: number }[]; // Sea route waypoints for realistic path rendering
  distanceNm: number; // Nautical miles
  durationHours: number;
  operators: string[];
  frequency: string;
  vehicleCapacity: string;
  notes?: string;
}

export const RORO_ROUTES: RoRoRoute[] = [
  // ─── Batangas Hub Routes ───
  {
    id: "RORO-001",
    name: "Batangas → Calapan (Mindoro)",
    origin: { name: "Batangas Port", lat: 13.7565, lng: 121.0583 },
    destination: { name: "Calapan Port", lat: 13.4115, lng: 121.1771 },
    waypoints: [
      { lat: 13.7000, lng: 121.0600 },
      { lat: 13.6200, lng: 121.0800 },
      { lat: 13.5500, lng: 121.1200 },
      { lat: 13.4800, lng: 121.1500 },
    ],
    distanceNm: 25,
    durationHours: 1.5,
    operators: ["Montenegro Shipping", "Starlite Ferries", "Besta Shipping"],
    frequency: "Every 30 minutes (peak), every hour (off-peak)",
    vehicleCapacity: "40-60 vehicles per trip",
    notes: "Busiest RoRo route in PH. Gateway to Mindoro and Visayas via Strong Republic Nautical Highway."
  },
  {
    id: "RORO-002",
    name: "Batangas → Abra de Ilog (Mindoro Occ.)",
    origin: { name: "Batangas Port", lat: 13.7565, lng: 121.0583 },
    destination: { name: "Abra de Ilog Port", lat: 13.4500, lng: 120.7300 },
    waypoints: [
      { lat: 13.7000, lng: 121.0200 },
      { lat: 13.6000, lng: 120.9000 },
      { lat: 13.5200, lng: 120.8000 },
    ],
    distanceNm: 35,
    durationHours: 2.5,
    operators: ["FastCat", "Starlite Ferries"],
    frequency: "4-6 trips daily",
    vehicleCapacity: "30-50 vehicles per trip",
  },
  {
    id: "RORO-003",
    name: "Batangas → Caticlan (Aklan/Boracay)",
    origin: { name: "Batangas Port", lat: 13.7565, lng: 121.0583 },
    destination: { name: "Caticlan Jetty Port", lat: 11.9245, lng: 121.9567 },
    waypoints: [
      { lat: 13.5000, lng: 121.1000 },
      { lat: 13.0000, lng: 121.3000 },
      { lat: 12.5000, lng: 121.6000 },
      { lat: 12.0000, lng: 121.8000 },
    ],
    distanceNm: 180,
    durationHours: 12,
    operators: ["2GO Travel", "Montenegro Shipping"],
    frequency: "2-3 trips weekly",
    vehicleCapacity: "20-30 vehicles per trip",
    notes: "Long haul RoRo. Used for Panay Island freight."
  },
  {
    id: "RORO-004",
    name: "Batangas → Roxas (Mindoro Oriental)",
    origin: { name: "Batangas Port", lat: 13.7565, lng: 121.0583 },
    destination: { name: "Roxas Port (Mindoro)", lat: 12.5900, lng: 121.5100 },
    waypoints: [
      { lat: 13.5000, lng: 121.1000 },
      { lat: 13.2000, lng: 121.2000 },
      { lat: 12.9000, lng: 121.3500 },
    ],
    distanceNm: 90,
    durationHours: 5,
    operators: ["Montenegro Shipping"],
    frequency: "Daily",
    vehicleCapacity: "25-35 vehicles per trip",
    notes: "Gateway to southern Mindoro. Connects to Bulalacao-Caticlan RoRo."
  },

  // ─── Visayas Routes ───
  {
    id: "RORO-005",
    name: "Cebu → Tubigon (Bohol)",
    origin: { name: "Cebu Port", lat: 10.2989, lng: 123.8908 },
    destination: { name: "Tubigon Port", lat: 9.9480, lng: 123.9580 },
    waypoints: [
      { lat: 10.2200, lng: 123.8900 },
      { lat: 10.1000, lng: 123.9200 },
    ],
    distanceNm: 25,
    durationHours: 2,
    operators: ["Lite Shipping", "Island Shipping"],
    frequency: "6-8 trips daily",
    vehicleCapacity: "30-40 vehicles per trip",
  },
  {
    id: "RORO-006",
    name: "Cebu → Ormoc (Leyte)",
    origin: { name: "Cebu Port", lat: 10.2989, lng: 123.8908 },
    destination: { name: "Ormoc Port", lat: 11.0075, lng: 124.6064 },
    waypoints: [
      { lat: 10.4000, lng: 124.0000 },
      { lat: 10.6000, lng: 124.2000 },
      { lat: 10.8000, lng: 124.4000 },
    ],
    distanceNm: 65,
    durationHours: 4.5,
    operators: ["Roble Shipping", "Cokaliong Shipping"],
    frequency: "3-4 trips daily",
    vehicleCapacity: "30-50 vehicles per trip",
    notes: "Key Visayas-Eastern Visayas link."
  },
  {
    id: "RORO-007",
    name: "Iloilo → Bacolod",
    origin: { name: "Iloilo Port", lat: 10.6918, lng: 122.5644 },
    destination: { name: "Bacolod-Bredco Port", lat: 10.6840, lng: 122.9470 },
    waypoints: [
      { lat: 10.6900, lng: 122.6500 },
      { lat: 10.6850, lng: 122.7500 },
      { lat: 10.6830, lng: 122.8500 },
    ],
    distanceNm: 20,
    durationHours: 1,
    operators: ["FastCat", "Weesam Express", "OceanJet"],
    frequency: "Every 30-60 minutes",
    vehicleCapacity: "25-40 vehicles per trip",
    notes: "Short crossing across Guimaras Strait."
  },

  // ─── Manila-Visayas Long Haul ───
  {
    id: "RORO-008",
    name: "Manila → Cebu",
    origin: { name: "Manila North Harbor", lat: 14.6161, lng: 120.9625 },
    destination: { name: "Cebu International Port", lat: 10.2989, lng: 123.8908 },
    waypoints: [
      // Exit Manila Bay southward
      { lat: 14.5000, lng: 120.9200 },
      { lat: 14.3500, lng: 120.8500 },
      // Around Corregidor, into South China Sea
      { lat: 14.2000, lng: 120.6500 },
      // Southwest around Lubang Island
      { lat: 13.9000, lng: 120.5000 },
      // South past Mindoro Occidental coast
      { lat: 13.5000, lng: 120.5500 },
      // Through Tablas Strait (between Mindoro & Tablas/Romblon)
      { lat: 13.0000, lng: 121.0000 },
      { lat: 12.6000, lng: 121.5000 },
      // Past Romblon into Sibuyan Sea
      { lat: 12.2000, lng: 122.0000 },
      // Visayan Sea approach
      { lat: 11.7000, lng: 122.5000 },
      { lat: 11.3000, lng: 123.0000 },
      // Around northern tip of Cebu
      { lat: 11.1000, lng: 123.5000 },
      { lat: 10.8000, lng: 123.7500 },
      // Down Cebu's east coast to port
      { lat: 10.5000, lng: 123.8500 },
    ],
    distanceNm: 380,
    durationHours: 22,
    operators: ["2GO Travel", "Trans-Asia Shipping"],
    frequency: "3-4 trips weekly",
    vehicleCapacity: "80-120 vehicles per trip",
    notes: "Major inter-island container/RoRo route."
  },
  {
    id: "RORO-009",
    name: "Manila → Cagayan de Oro",
    origin: { name: "Manila North Harbor", lat: 14.6161, lng: 120.9625 },
    destination: { name: "CDO Port (Macabalan)", lat: 8.4809, lng: 124.6383 },
    waypoints: [
      // Exit Manila Bay
      { lat: 14.5000, lng: 120.9200 },
      { lat: 14.3500, lng: 120.8500 },
      // Past Corregidor into open water
      { lat: 14.2000, lng: 120.6500 },
      // Southwest around Lubang Island
      { lat: 13.9000, lng: 120.5000 },
      // South along Mindoro Occidental
      { lat: 13.5000, lng: 120.5500 },
      // Through Tablas Strait
      { lat: 13.0000, lng: 121.0000 },
      { lat: 12.6000, lng: 121.5000 },
      // Past Romblon/Sibuyan Sea
      { lat: 12.2000, lng: 122.0000 },
      // Visayan Sea
      { lat: 11.7000, lng: 122.5000 },
      { lat: 11.2000, lng: 123.0000 },
      // Past Cebu's northern tip into Camotes Sea
      { lat: 10.8000, lng: 123.7000 },
      // Through Bohol Sea heading south
      { lat: 10.2000, lng: 124.0000 },
      { lat: 9.6000, lng: 124.2000 },
      // Approach CDO from the north
      { lat: 9.0000, lng: 124.4000 },
      { lat: 8.7000, lng: 124.5500 },
    ],
    distanceNm: 480,
    durationHours: 30,
    operators: ["2GO Travel", "Trans-Asia Shipping"],
    frequency: "2-3 trips weekly",
    vehicleCapacity: "80-120 vehicles per trip",
  },
  {
    id: "RORO-010",
    name: "Manila → Davao (via CDO)",
    origin: { name: "Manila North Harbor", lat: 14.6161, lng: 120.9625 },
    destination: { name: "Davao Sasa Port", lat: 7.0833, lng: 125.6333 },
    waypoints: [
      // Exit Manila Bay
      { lat: 14.5000, lng: 120.9200 },
      { lat: 14.3500, lng: 120.8500 },
      // Past Corregidor
      { lat: 14.2000, lng: 120.6500 },
      // Around Lubang Island
      { lat: 13.9000, lng: 120.5000 },
      // Along Mindoro Occidental coast
      { lat: 13.5000, lng: 120.5500 },
      // Through Tablas Strait
      { lat: 13.0000, lng: 121.0000 },
      { lat: 12.6000, lng: 121.5000 },
      // Sibuyan Sea
      { lat: 12.2000, lng: 122.0000 },
      // Visayan Sea
      { lat: 11.7000, lng: 122.5000 },
      { lat: 11.2000, lng: 123.0000 },
      // Past Cebu into Bohol Sea
      { lat: 10.5000, lng: 123.8000 },
      { lat: 10.0000, lng: 124.2000 },
      // South through Mindanao Sea
      { lat: 9.3000, lng: 124.5000 },
      { lat: 8.8000, lng: 125.0000 },
      // Around CDO heading east/south to Davao
      { lat: 8.2000, lng: 125.3000 },
      { lat: 7.6000, lng: 125.5000 },
    ],
    distanceNm: 600,
    durationHours: 38,
    operators: ["2GO Travel"],
    frequency: "2 trips weekly",
    vehicleCapacity: "100+ vehicles per trip",
    notes: "Longest domestic RoRo route."
  },

  // ─── Strong Republic Nautical Highway (SRNH) ───
  // This is the famous highway that connects Luzon-Visayas-Mindanao by road+ferry
  {
    id: "RORO-011",
    name: "Calapan → Roxas (Mindoro)",
    origin: { name: "Calapan Port", lat: 13.4115, lng: 121.1771 },
    destination: { name: "Roxas Port", lat: 12.5900, lng: 121.5100 },
    waypoints: [], // Land route through Mindoro
    distanceNm: 0, // Land
    durationHours: 4, // Drive time
    operators: ["Road (SRNH)"],
    frequency: "Continuous",
    vehicleCapacity: "Unlimited (road)",
    notes: "Land segment of SRNH through Mindoro island. Connects Batangas-Calapan ferry to Roxas-Caticlan ferry."
  },
  {
    id: "RORO-012",
    name: "Roxas (Mindoro) → Caticlan",
    origin: { name: "Bulalacao Port", lat: 12.3300, lng: 121.3300 },
    destination: { name: "Caticlan Jetty Port", lat: 11.9245, lng: 121.9567 },
    waypoints: [
      { lat: 12.2000, lng: 121.5000 },
      { lat: 12.0500, lng: 121.7000 },
    ],
    distanceNm: 40,
    durationHours: 3,
    operators: ["Montenegro Shipping"],
    frequency: "2-3 trips daily",
    vehicleCapacity: "20-30 vehicles per trip",
    notes: "Part of SRNH. Links Mindoro to Panay Island."
  },
  {
    id: "RORO-013",
    name: "Dumangas (Iloilo) → Bacolod",
    origin: { name: "Dumangas Port", lat: 10.8300, lng: 122.7100 },
    destination: { name: "Bacolod-Banago Port", lat: 10.7100, lng: 122.9300 },
    waypoints: [
      { lat: 10.7800, lng: 122.7800 },
      { lat: 10.7400, lng: 122.8500 },
    ],
    distanceNm: 15,
    durationHours: 1,
    operators: ["FastCat", "Weesam Express"],
    frequency: "Every 45 minutes",
    vehicleCapacity: "30 vehicles per trip",
  },

  // ─── Mindanao Routes ───
  {
    id: "RORO-014",
    name: "Liloan (Leyte) → Surigao",
    origin: { name: "Liloan Port", lat: 10.3900, lng: 125.0100 },
    destination: { name: "Surigao Port", lat: 9.7870, lng: 125.4920 },
    waypoints: [
      { lat: 10.2000, lng: 125.1500 },
      { lat: 10.0000, lng: 125.3000 },
    ],
    distanceNm: 15,
    durationHours: 0.75,
    operators: ["Maharlika Highway Ferry"],
    frequency: "Every 30 minutes",
    vehicleCapacity: "20-30 vehicles per trip",
    notes: "Part of SRNH. Shortest ferry crossing Visayas-Mindanao."
  },
  {
    id: "RORO-015",
    name: "Ozamis → Mukas (Kolambugan)",
    origin: { name: "Ozamis Port", lat: 8.1460, lng: 123.8480 },
    destination: { name: "Mukas Port", lat: 8.1200, lng: 123.9200 },
    waypoints: [],
    distanceNm: 5,
    durationHours: 0.25,
    operators: ["Cokaliong Shipping"],
    frequency: "Continuous shuttle",
    vehicleCapacity: "15-20 vehicles",
    notes: "Very short crossing across Panguil Bay. Alternative to long land route around the bay."
  },
];

// ─── Strong Republic Nautical Highway (SRNH) ───
// Complete Luzon-Visayas-Mindanao road+ferry route
export interface SRNHSegment {
  type: "road" | "ferry";
  from: string;
  to: string;
  fromCoords: { lat: number; lng: number };
  toCoords: { lat: number; lng: number };
  distanceKm?: number;
  durationHours: number;
  roroId?: string; // Reference to RoRo route if ferry
}

export const SRNH_ROUTE: SRNHSegment[] = [
  { type: "road", from: "Manila", to: "Batangas Port", fromCoords: { lat: 14.5995, lng: 120.9842 }, toCoords: { lat: 13.7565, lng: 121.0583 }, distanceKm: 110, durationHours: 2.5 },
  { type: "ferry", from: "Batangas Port", to: "Calapan Port", fromCoords: { lat: 13.7565, lng: 121.0583 }, toCoords: { lat: 13.4115, lng: 121.1771 }, durationHours: 1.5, roroId: "RORO-001" },
  { type: "road", from: "Calapan", to: "Roxas (Mindoro)", fromCoords: { lat: 13.4115, lng: 121.1771 }, toCoords: { lat: 12.5900, lng: 121.5100 }, distanceKm: 160, durationHours: 4 },
  { type: "road", from: "Roxas", to: "Bulalacao", fromCoords: { lat: 12.5900, lng: 121.5100 }, toCoords: { lat: 12.3300, lng: 121.3300 }, distanceKm: 45, durationHours: 1 },
  { type: "ferry", from: "Bulalacao", to: "Caticlan", fromCoords: { lat: 12.3300, lng: 121.3300 }, toCoords: { lat: 11.9245, lng: 121.9567 }, durationHours: 3, roroId: "RORO-012" },
  { type: "road", from: "Caticlan", to: "Dumangas", fromCoords: { lat: 11.9245, lng: 121.9567 }, toCoords: { lat: 10.8300, lng: 122.7100 }, distanceKm: 180, durationHours: 4 },
  { type: "ferry", from: "Dumangas", to: "Bacolod", fromCoords: { lat: 10.8300, lng: 122.7100 }, toCoords: { lat: 10.7100, lng: 122.9300 }, durationHours: 1, roroId: "RORO-013" },
  { type: "road", from: "Bacolod", to: "San Carlos", fromCoords: { lat: 10.7100, lng: 122.9300 }, toCoords: { lat: 10.4920, lng: 123.4150 }, distanceKm: 120, durationHours: 3 },
  { type: "ferry", from: "San Carlos", to: "Toledo (Cebu)", fromCoords: { lat: 10.4920, lng: 123.4150 }, toCoords: { lat: 10.3770, lng: 123.6380 }, durationHours: 1.5 },
  { type: "road", from: "Toledo", to: "Cebu City", fromCoords: { lat: 10.3770, lng: 123.6380 }, toCoords: { lat: 10.2989, lng: 123.8908 }, distanceKm: 50, durationHours: 1.5 },
  { type: "road", from: "Cebu City", to: "Liloan (S. Leyte)", fromCoords: { lat: 10.2989, lng: 123.8908 }, toCoords: { lat: 10.3900, lng: 125.0100 }, distanceKm: 0, durationHours: 0 },
  { type: "ferry", from: "Liloan", to: "Surigao", fromCoords: { lat: 10.3900, lng: 125.0100 }, toCoords: { lat: 9.7870, lng: 125.4920 }, durationHours: 0.75, roroId: "RORO-014" },
  { type: "road", from: "Surigao", to: "Davao City", fromCoords: { lat: 9.7870, lng: 125.4920 }, toCoords: { lat: 7.0833, lng: 125.6333 }, distanceKm: 380, durationHours: 8 },
];

// ─── Major Land Routes with Waypoints ───
export interface LandRoute {
  id: string;
  name: string;
  from: string;
  to: string;
  waypoints: { lat: number; lng: number; name?: string }[];
  distanceKm: number;
  durationHours: number;
  tollways?: string[];
  terrain: "flat" | "mountainous" | "mixed" | "coastal";
  truckRestrictions?: string;
}

export const MAJOR_LAND_ROUTES: LandRoute[] = [
  {
    id: "LR-001",
    name: "Manila → Clark (NLEX-SCTEX)",
    from: "Manila",
    to: "Clark Freeport",
    waypoints: [
      { lat: 14.6540, lng: 120.9840, name: "Balintawak Toll" },
      { lat: 14.7500, lng: 120.9500, name: "Meycauayan" },
      { lat: 14.8400, lng: 120.8900, name: "Marilao" },
      { lat: 14.9300, lng: 120.7800, name: "San Fernando" },
      { lat: 15.0300, lng: 120.6800, name: "Angeles City" },
      { lat: 15.1860, lng: 120.5460, name: "Clark" },
    ],
    distanceKm: 83,
    durationHours: 1.5,
    tollways: ["NLEX", "SCTEX"],
    terrain: "flat",
  },
  {
    id: "LR-002",
    name: "Manila → Batangas (SLEX-STAR)",
    from: "Manila",
    to: "Batangas City",
    waypoints: [
      { lat: 14.5300, lng: 121.0200, name: "Alabang" },
      { lat: 14.4200, lng: 121.0500, name: "Carmona" },
      { lat: 14.3100, lng: 121.0800, name: "Calamba" },
      { lat: 14.1500, lng: 121.1000, name: "Sto. Tomas" },
      { lat: 14.0000, lng: 121.0700, name: "Lipa" },
      { lat: 13.7565, lng: 121.0583, name: "Batangas City" },
    ],
    distanceKm: 110,
    durationHours: 2.5,
    tollways: ["SLEX", "STAR Tollway"],
    terrain: "mixed",
  },
  {
    id: "LR-003",
    name: "Manila → Baguio (TPLEX)",
    from: "Manila",
    to: "Baguio City",
    waypoints: [
      { lat: 14.6540, lng: 120.9840, name: "Balintawak" },
      { lat: 15.0300, lng: 120.6800, name: "Angeles City" },
      { lat: 15.4400, lng: 120.5900, name: "Tarlac" },
      { lat: 15.9800, lng: 120.5000, name: "Rosario (Pangasinan)" },
      { lat: 16.1600, lng: 120.5700, name: "Sison" },
      { lat: 16.4023, lng: 120.5960, name: "Baguio City" },
    ],
    distanceKm: 250,
    durationHours: 5,
    tollways: ["NLEX", "SCTEX", "TPLEX"],
    terrain: "mountainous",
    truckRestrictions: "10-wheelers restricted on Marcos Highway after 6PM. Use Kennon Road alternative.",
  },
  {
    id: "LR-004",
    name: "Manila → Naga (Bicol)",
    from: "Manila",
    to: "Naga City",
    waypoints: [
      { lat: 14.5300, lng: 121.0200, name: "Alabang" },
      { lat: 14.3100, lng: 121.0800, name: "Calamba" },
      { lat: 14.0000, lng: 121.3000, name: "Lucena" },
      { lat: 13.6000, lng: 122.2000, name: "Daet" },
      { lat: 13.6218, lng: 123.1948, name: "Naga City" },
    ],
    distanceKm: 450,
    durationHours: 9,
    tollways: ["SLEX"],
    terrain: "mixed",
    truckRestrictions: "Quezon province mountain passes can be slow during rainy season.",
  },
  {
    id: "LR-005",
    name: "Cebu City → Bogo (Northern Cebu)",
    from: "Cebu City",
    to: "Bogo",
    waypoints: [
      { lat: 10.3280, lng: 123.9225, name: "Mandaue" },
      { lat: 10.4500, lng: 123.9500, name: "Consolacion" },
      { lat: 10.6500, lng: 124.0200, name: "Sogod" },
      { lat: 11.0460, lng: 124.0030, name: "Bogo" },
    ],
    distanceKm: 100,
    durationHours: 3,
    terrain: "coastal",
  },
  {
    id: "LR-006",
    name: "Davao → General Santos",
    from: "Davao City",
    to: "General Santos",
    waypoints: [
      { lat: 7.0833, lng: 125.6333, name: "Davao Sasa" },
      { lat: 6.9500, lng: 125.5500, name: "Digos" },
      { lat: 6.7500, lng: 125.3500, name: "Bansalan" },
      { lat: 6.5000, lng: 125.2000, name: "Surallah" },
      { lat: 6.2000, lng: 125.1500, name: "Polomolok" },
      { lat: 6.0878, lng: 125.1672, name: "General Santos" },
    ],
    distanceKm: 170,
    durationHours: 3.5,
    terrain: "flat",
  },
  {
    id: "LR-007",
    name: "Davao → Cagayan de Oro",
    from: "Davao City",
    to: "Cagayan de Oro",
    waypoints: [
      { lat: 7.0833, lng: 125.6333, name: "Davao" },
      { lat: 7.3000, lng: 125.5000, name: "Tagum" },
      { lat: 7.8000, lng: 125.1000, name: "Valencia (Bukidnon)" },
      { lat: 8.1000, lng: 125.0000, name: "Malaybalay" },
      { lat: 8.3000, lng: 124.8000, name: "Claveria" },
      { lat: 8.4809, lng: 124.6383, name: "CDO" },
    ],
    distanceKm: 300,
    durationHours: 6,
    terrain: "mountainous",
    truckRestrictions: "Bukidnon plateau can be foggy. Mountain roads through Manolo Fortich require low gear.",
  },
  {
    id: "LR-008",
    name: "Clark → Subic (SCTEX)",
    from: "Clark Freeport",
    to: "Subic Bay Freeport",
    waypoints: [
      { lat: 15.1860, lng: 120.5460, name: "Clark" },
      { lat: 15.0800, lng: 120.4500, name: "Porac" },
      { lat: 14.9500, lng: 120.3500, name: "Dinalupihan" },
      { lat: 14.7944, lng: 120.2828, name: "Subic" },
    ],
    distanceKm: 55,
    durationHours: 1,
    tollways: ["SCTEX"],
    terrain: "mixed",
  },
];

// ─── Philippine Vehicle Specifications (Real PH Market) ───
export interface VehicleSpec {
  type: string;
  localName: string; // What Filipino truckers call it
  make: string[];
  lengthFt: number;
  widthFt: number;
  heightFt: number;
  lengthM: number;
  widthM: number;
  heightM: number;
  maxPayloadKg: number;
  maxVolumeCbm: number;
  grossVehicleWeight: number;
  axles: number;
  fuelType: "diesel" | "gasoline";
  avgFuelConsumption: string; // km/L
  image: string; // Placeholder for vehicle image reference
  color: string; // 3D model color
}

export const VEHICLE_SPECS: VehicleSpec[] = [
  {
    type: "L300 Van",
    localName: "L-tree",
    make: ["Mitsubishi L300"],
    lengthFt: 7, widthFt: 4.5, heightFt: 4.5,
    lengthM: 2.13, widthM: 1.37, heightM: 1.37,
    maxPayloadKg: 1000, maxVolumeCbm: 4,
    grossVehicleWeight: 2800, axles: 2,
    fuelType: "diesel", avgFuelConsumption: "10-12 km/L",
    image: "/vehicles/l300.svg", color: "#94a3b8",
  },
  {
    type: "Closed Van (4W)",
    localName: "Elf / NLR",
    make: ["Isuzu NLR", "Isuzu NKR", "Hyundai HD36"],
    lengthFt: 10, widthFt: 5.5, heightFt: 5.5,
    lengthM: 3.05, widthM: 1.68, heightM: 1.68,
    maxPayloadKg: 2500, maxVolumeCbm: 10,
    grossVehicleWeight: 5500, axles: 2,
    fuelType: "diesel", avgFuelConsumption: "8-10 km/L",
    image: "/vehicles/closed-van-4w.svg", color: "#60a5fa",
  },
  {
    type: "Closed Van (6W)",
    localName: "Forward / NQR",
    make: ["Isuzu NQR", "Isuzu Forward", "Hino 300"],
    lengthFt: 14, widthFt: 6.5, heightFt: 7,
    lengthM: 4.27, widthM: 1.98, heightM: 2.13,
    maxPayloadKg: 5000, maxVolumeCbm: 18,
    grossVehicleWeight: 8500, axles: 2,
    fuelType: "diesel", avgFuelConsumption: "6-8 km/L",
    image: "/vehicles/closed-van-6w.svg", color: "#3b82f6",
  },
  {
    type: "Wing Van (6W)",
    localName: "Wing Van Patok",
    make: ["Isuzu Forward Wing", "Hino 500 Wing"],
    lengthFt: 20, widthFt: 7, heightFt: 7.5,
    lengthM: 6.10, widthM: 2.13, heightM: 2.29,
    maxPayloadKg: 7000, maxVolumeCbm: 28,
    grossVehicleWeight: 11000, axles: 2,
    fuelType: "diesel", avgFuelConsumption: "5-7 km/L",
    image: "/vehicles/wing-van-6w.svg", color: "#2563eb",
  },
  {
    type: "10-Wheeler Wing Van",
    localName: "Ten-wheeler / Giga",
    make: ["Isuzu Giga", "Hino 700", "Sinotruk Howo"],
    lengthFt: 32, widthFt: 7.8, heightFt: 7.8,
    lengthM: 9.75, widthM: 2.38, heightM: 2.38,
    maxPayloadKg: 15000, maxVolumeCbm: 55,
    grossVehicleWeight: 23000, axles: 3,
    fuelType: "diesel", avgFuelConsumption: "3-5 km/L",
    image: "/vehicles/wing-van-10w.svg", color: "#1d4ed8",
  },
  {
    type: "Reefer Van (4W)",
    localName: "Reefer Elf",
    make: ["Isuzu NLR Reefer", "Hyundai HD36 Reefer"],
    lengthFt: 9, widthFt: 5, heightFt: 5,
    lengthM: 2.74, widthM: 1.52, heightM: 1.52,
    maxPayloadKg: 2000, maxVolumeCbm: 6,
    grossVehicleWeight: 5200, axles: 2,
    fuelType: "diesel", avgFuelConsumption: "7-9 km/L",
    image: "/vehicles/reefer-4w.svg", color: "#06b6d4",
  },
  {
    type: "Reefer Van (6W)",
    localName: "Reefer Forward",
    make: ["Isuzu NQR Reefer", "Hino 300 Reefer"],
    lengthFt: 14, widthFt: 6.5, heightFt: 6.5,
    lengthM: 4.27, widthM: 1.98, heightM: 1.98,
    maxPayloadKg: 4500, maxVolumeCbm: 16,
    grossVehicleWeight: 8200, axles: 2,
    fuelType: "diesel", avgFuelConsumption: "5-7 km/L",
    image: "/vehicles/reefer-6w.svg", color: "#0891b2",
  },
  {
    type: "Reefer Van (10W)",
    localName: "Reefer Giga",
    make: ["Isuzu Giga Reefer", "Hino 700 Reefer"],
    lengthFt: 30, widthFt: 7.5, heightFt: 7.5,
    lengthM: 9.14, widthM: 2.29, heightM: 2.29,
    maxPayloadKg: 12000, maxVolumeCbm: 48,
    grossVehicleWeight: 22000, axles: 3,
    fuelType: "diesel", avgFuelConsumption: "2.5-4 km/L",
    image: "/vehicles/reefer-10w.svg", color: "#0e7490",
  },
  {
    type: "Flatbed Trailer",
    localName: "Flatbed / Lowbed",
    make: ["Sinotruk Howo Flatbed", "Shacman Flatbed"],
    lengthFt: 40, widthFt: 8, heightFt: 2,
    lengthM: 12.19, widthM: 2.44, heightM: 0.61,
    maxPayloadKg: 25000, maxVolumeCbm: 60,
    grossVehicleWeight: 40000, axles: 5,
    fuelType: "diesel", avgFuelConsumption: "2-3 km/L",
    image: "/vehicles/flatbed.svg", color: "#78716c",
  },
  {
    type: "Tanker",
    localName: "Tanker",
    make: ["Sinotruk Howo Tanker", "Hino 700 Tanker"],
    lengthFt: 28, widthFt: 8, heightFt: 8,
    lengthM: 8.53, widthM: 2.44, heightM: 2.44,
    maxPayloadKg: 20000, maxVolumeCbm: 25,
    grossVehicleWeight: 35000, axles: 4,
    fuelType: "diesel", avgFuelConsumption: "2-3 km/L",
    image: "/vehicles/tanker.svg", color: "#a8a29e",
  },
  {
    type: "Container Truck (20ft)",
    localName: "Kontainer / Chassis",
    make: ["Sinotruk Howo Chassis", "Hino 700 Chassis"],
    lengthFt: 20, widthFt: 8, heightFt: 8.5,
    lengthM: 6.10, widthM: 2.44, heightM: 2.59,
    maxPayloadKg: 18000, maxVolumeCbm: 33,
    grossVehicleWeight: 30000, axles: 3,
    fuelType: "diesel", avgFuelConsumption: "2.5-4 km/L",
    image: "/vehicles/container-20ft.svg", color: "#dc2626",
  },
  {
    type: "Container Truck (40ft)",
    localName: "Forty-footer",
    make: ["Sinotruk Howo 6x4 Chassis", "Shacman F3000"],
    lengthFt: 40, widthFt: 8, heightFt: 8.5,
    lengthM: 12.19, widthM: 2.44, heightM: 2.59,
    maxPayloadKg: 28000, maxVolumeCbm: 67,
    grossVehicleWeight: 45000, axles: 5,
    fuelType: "diesel", avgFuelConsumption: "1.5-3 km/L",
    image: "/vehicles/container-40ft.svg", color: "#b91c1c",
  },
  {
    type: "Dropside (6W)",
    localName: "Dropside / Open Truck",
    make: ["Isuzu Forward Dropside", "Hino 300 Dropside"],
    lengthFt: 16, widthFt: 7, heightFt: 4,
    lengthM: 4.88, widthM: 2.13, heightM: 1.22,
    maxPayloadKg: 6000, maxVolumeCbm: 12,
    grossVehicleWeight: 10000, axles: 2,
    fuelType: "diesel", avgFuelConsumption: "5-7 km/L",
    image: "/vehicles/dropside.svg", color: "#f59e0b",
  },
];

// ─── Realistic Rate Calculator ───
export function calculateFreightRate(distanceKm: number, vehicleType: string, cargoType: string, isInterIsland: boolean): { min: number; max: number; avg: number } {
  const baseRates: Record<string, number> = {
    "L300 Van": 35,
    "Closed Van (4W)": 38,
    "Closed Van (6W)": 42,
    "Wing Van (6W)": 45,
    "10-Wheeler Wing Van": 48,
    "Reefer Van (4W)": 50,
    "Reefer Van (6W)": 55,
    "Reefer Van (10W)": 60,
    "Flatbed Trailer": 52,
    "Tanker": 58,
    "Container Truck (20ft)": 50,
    "Container Truck (40ft)": 55,
    "Dropside (6W)": 40,
  };

  const cargoMultiplier: Record<string, number> = {
    "FMCG": 1.0,
    "Agricultural": 0.9,
    "Electronics": 1.3,
    "Pharmaceuticals": 1.5,
    "Hazmat": 1.8,
    "Construction": 0.85,
    "Frozen Seafood": 1.4,
    "General Cargo": 1.0,
  };

  const base = baseRates[vehicleType] ?? 45;
  const multiplier = cargoMultiplier[cargoType] ?? 1.0;
  const interIslandSurcharge = isInterIsland ? 1.35 : 1.0;
  const minCharge = vehicleType.includes("L300") ? 3000 : vehicleType.includes("10-Wheeler") ? 15000 : 5000;

  const rawRate = distanceKm * base * multiplier * interIslandSurcharge;
  const rate = Math.max(rawRate, minCharge);

  return {
    min: Math.round(rate * 0.85),
    max: Math.round(rate * 1.15),
    avg: Math.round(rate),
  };
}

// ─── CO2 Estimation based on PH vehicle data ───
export function estimateRouteCO2(distanceKm: number, vehicleType: string, loadPercentage: number = 0.75): {
  totalKg: number;
  perTonKm: number;
  treesEquivalent: number;
} {
  // g CO2 per km at full load (Philippine diesel truck averages)
  const emissionFactors: Record<string, number> = {
    "L300 Van": 180,
    "Closed Van (4W)": 250,
    "Closed Van (6W)": 380,
    "Wing Van (6W)": 450,
    "10-Wheeler Wing Van": 650,
    "Reefer Van (4W)": 320, // +25% for reefer unit
    "Reefer Van (6W)": 500,
    "Reefer Van (10W)": 850,
    "Flatbed Trailer": 700,
    "Tanker": 680,
    "Container Truck (20ft)": 600,
    "Container Truck (40ft)": 750,
    "Dropside (6W)": 400,
  };

  const factor = emissionFactors[vehicleType] ?? 500;
  const adjustedFactor = factor * (0.6 + 0.4 * loadPercentage); // Empty truck still uses 60% fuel
  const totalKg = (distanceKm * adjustedFactor) / 1000;
  const specs = VEHICLE_SPECS.find(v => v.type === vehicleType);
  const maxPayload = specs?.maxPayloadKg ?? 10000;
  const perTonKm = (adjustedFactor / (maxPayload / 1000 * loadPercentage)) / 1000;
  const treesEquivalent = totalKg / 22; // 1 tree absorbs ~22kg CO2/year

  return { totalKg: Math.round(totalKg * 10) / 10, perTonKm: Math.round(perTonKm * 1000) / 1000, treesEquivalent: Math.round(treesEquivalent * 10) / 10 };
}
