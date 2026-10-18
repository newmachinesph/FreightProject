// ── Company Profile ──────────────────────────────────────────────────────────
export const companyProfile = {
  name: "JM Trucking Services",
  owner: "Jose Miguel Santos",
  mobile: "+63 917 123 4567",
  email: "jm@jmtrucking.ph",
  address: "Lot 5 Block 3, NLEX Bypass Road, Meycauayan, Bulacan",
  philsysId: "PSN-2024-XXXX-XXXX",
  dtiRegNo: "DTI-03-2022-123456",
  birTin: "123-456-789-000",
  yearsInOperation: 8,
  logo: "https://picsum.photos/seed/jmtruck/200/200",
  serviceAreas: ["NCR", "Central Luzon", "Calabarzon", "Bicol", "Western Visayas", "Central Visayas"],
  serviceTypes: ["FTL", "LTL", "Backhaul", "Reefer"] as string[],
  roro: true,
  hazmat: false,
  coldChain: true,
  nightOps: true,
  insurance: { policyNo: "INS-2024-78901", expiry: "2026-12-31", ctpl: true },
  compliance: { doleCleared: true, kycVerified: true, rating: 4.8, completedTrips: 2100 },
  baseRates: [
    { route: "NCR to Central Luzon", ratePerKm: 45, minRate: 5000 },
    { route: "NCR to Calabarzon", ratePerKm: 42, minRate: 4500 },
    { route: "NCR to Bicol", ratePerKm: 38, minRate: 25000 },
    { route: "NCR to Visayas (via RoRo)", ratePerKm: 55, minRate: 80000 },
  ],
};

// ── Vehicle Interface ────────────────────────────────────────────────────────
export interface Vehicle {
  id: string;
  type: string;
  plateNo: string;
  capacity: { kg: number; cbm: number };
  bodyType: string;
  status: "available" | "on_trip" | "maintenance" | "inactive";
  ltoOR: string;
  ltoCR: string;
  ltfrbFranchise: string;
  orcrExpiry: string;
  yearModel: number;
  make: string;
  gpsDeviceId?: string;
  fuelType: "diesel" | "gasoline";
  reefer: boolean;
  driver?: { name: string; license: string; mobile: string };
}

// ── Fleet: 12 Vehicles ───────────────────────────────────────────────────────
export const vehicles: Vehicle[] = [
  {
    id: "v1", type: "L300 Van", plateNo: "NCR 1234",
    capacity: { kg: 1000, cbm: 4 }, bodyType: "Closed",
    status: "available", ltoOR: "OR-2026-NCR-001234", ltoCR: "CR-2026-NCR-001234",
    ltfrbFranchise: "LTFRB-NCR-2024-00112", orcrExpiry: "2027-01-15",
    yearModel: 2021, make: "Mitsubishi", gpsDeviceId: "GPS-L300-01",
    fuelType: "gasoline", reefer: false,
    driver: { name: "Mang Jun", license: "N04-21-012345", mobile: "+63 918 111 2233" },
  },
  {
    id: "v2", type: "Closed Van", plateNo: "ABC 5678",
    capacity: { kg: 2000, cbm: 10 }, bodyType: "Closed",
    status: "on_trip", ltoOR: "OR-2026-NCR-005678", ltoCR: "CR-2026-NCR-005678",
    ltfrbFranchise: "LTFRB-NCR-2024-00113", orcrExpiry: "2026-12-01",
    yearModel: 2022, make: "Isuzu NLR", gpsDeviceId: "GPS-NLR-02",
    fuelType: "diesel", reefer: false,
    driver: { name: "Kuya Boy", license: "N04-22-023456", mobile: "+63 917 222 3344" },
  },
  {
    id: "v3", type: "Elf Truck", plateNo: "DEF 9012",
    capacity: { kg: 3000, cbm: 14 }, bodyType: "Closed",
    status: "available", ltoOR: "OR-2026-R3-009012", ltoCR: "CR-2026-R3-009012",
    ltfrbFranchise: "LTFRB-R3-2023-00087", orcrExpiry: "2026-09-30",
    yearModel: 2020, make: "Isuzu Elf", gpsDeviceId: "GPS-ELF-03",
    fuelType: "diesel", reefer: false,
    driver: { name: "Tito Rex", license: "N03-20-034567", mobile: "+63 919 333 4455" },
  },
  {
    id: "v4", type: "Wing Van", plateNo: "GHI 3456",
    capacity: { kg: 7000, cbm: 28 }, bodyType: "Wing Van",
    status: "on_trip", ltoOR: "OR-2026-NCR-003456", ltoCR: "CR-2026-NCR-003456",
    ltfrbFranchise: "LTFRB-NCR-2024-00114", orcrExpiry: "2027-03-20",
    yearModel: 2023, make: "Isuzu Forward", gpsDeviceId: "GPS-FWD-04",
    fuelType: "diesel", reefer: false,
    driver: { name: "Mang Eddie", license: "N04-23-045678", mobile: "+63 920 444 5566" },
  },
  {
    id: "v5", type: "Dropside", plateNo: "JKL 7890",
    capacity: { kg: 8000, cbm: 32 }, bodyType: "Open/Dropside",
    status: "maintenance", ltoOR: "OR-2026-R3-007890", ltoCR: "CR-2026-R3-007890",
    ltfrbFranchise: "LTFRB-R3-2023-00088", orcrExpiry: "2026-06-15",
    yearModel: 2019, make: "Hino", fuelType: "diesel", reefer: false,
    driver: { name: "Kuya Mark", license: "N03-19-056789", mobile: "+63 921 555 6677" },
  },
  {
    id: "v6", type: "10-Wheeler", plateNo: "MNO 1234",
    capacity: { kg: 15000, cbm: 60 }, bodyType: "Wing Van",
    status: "on_trip", ltoOR: "OR-2026-R3-001234B", ltoCR: "CR-2026-R3-001234B",
    ltfrbFranchise: "LTFRB-NCR-2024-00115", orcrExpiry: "2027-05-10",
    yearModel: 2024, make: "Isuzu Giga", gpsDeviceId: "GPS-GIGA-06",
    fuelType: "diesel", reefer: false,
    driver: { name: "Tito Bert", license: "N04-24-067890", mobile: "+63 922 666 7788" },
  },
  {
    id: "v7", type: "Refrigerated Van", plateNo: "PQR 5678",
    capacity: { kg: 5000, cbm: 20 }, bodyType: "Refrigerated",
    status: "available", ltoOR: "OR-2026-NCR-005678B", ltoCR: "CR-2026-NCR-005678B",
    ltfrbFranchise: "LTFRB-NCR-2024-00116", orcrExpiry: "2026-11-20",
    yearModel: 2022, make: "Isuzu NQR", gpsDeviceId: "GPS-NQR-07",
    fuelType: "diesel", reefer: true,
    driver: { name: "Mang Dodo", license: "N04-22-078901", mobile: "+63 923 777 8899" },
  },
  {
    id: "v8", type: "Trailer", plateNo: "STU 9012",
    capacity: { kg: 25000, cbm: 67 }, bodyType: "Flatbed",
    status: "available", ltoOR: "OR-2026-R3-009012B", ltoCR: "CR-2026-R3-009012B",
    ltfrbFranchise: "LTFRB-NCR-2024-00117", orcrExpiry: "2026-08-05",
    yearModel: 2021, make: "Sinotruk", gpsDeviceId: "GPS-SINO-08",
    fuelType: "diesel", reefer: false,
    driver: { name: "Kuya Nonoy", license: "N03-21-089012", mobile: "+63 924 888 9900" },
  },
  {
    id: "v9", type: "Sedan", plateNo: "WXY 3344",
    capacity: { kg: 300, cbm: 1.5 }, bodyType: "Sedan",
    status: "available", ltoOR: "OR-2026-NCR-003344", ltoCR: "CR-2026-NCR-003344",
    ltfrbFranchise: "LTFRB-NCR-2024-00118", orcrExpiry: "2027-02-28",
    yearModel: 2023, make: "Toyota Vios", gpsDeviceId: "GPS-VIOS-09",
    fuelType: "gasoline", reefer: false,
  },
  {
    id: "v10", type: "MPV/SUV", plateNo: "ZAB 5566",
    capacity: { kg: 500, cbm: 2.5 }, bodyType: "SUV",
    status: "available", ltoOR: "OR-2026-NCR-005566", ltoCR: "CR-2026-NCR-005566",
    ltfrbFranchise: "LTFRB-NCR-2024-00119", orcrExpiry: "2027-04-15",
    yearModel: 2024, make: "Toyota Innova", gpsDeviceId: "GPS-INN-10",
    fuelType: "diesel", reefer: false,
  },
  {
    id: "v11", type: "Tanker", plateNo: "CDE 7788",
    capacity: { kg: 20000, cbm: 25 }, bodyType: "Tanker",
    status: "inactive", ltoOR: "OR-2026-R3-007788", ltoCR: "CR-2026-R3-007788",
    ltfrbFranchise: "LTFRB-R3-2023-00090", orcrExpiry: "2026-05-01",
    yearModel: 2018, make: "Hino 700", fuelType: "diesel", reefer: false,
  },
  {
    id: "v12", type: "Closed Van", plateNo: "FGH 9900",
    capacity: { kg: 3500, cbm: 16 }, bodyType: "Closed",
    status: "on_trip", ltoOR: "OR-2026-NCR-009900", ltoCR: "CR-2026-NCR-009900",
    ltfrbFranchise: "LTFRB-NCR-2024-00120", orcrExpiry: "2027-06-30",
    yearModel: 2024, make: "Isuzu NMR", gpsDeviceId: "GPS-NMR-12",
    fuelType: "diesel", reefer: false,
    driver: { name: "Mang Rolly", license: "N04-24-099012", mobile: "+63 925 999 0011" },
  },
];

// ── Driver Interface ─────────────────────────────────────────────────────────
export interface Driver {
  id: string;
  name: string;
  phone: string;
  licenseNo: string;
  licenseExpiry: string;
  vehicleAssigned: string | null;
  status: "active" | "on_trip" | "off_duty" | "inactive";
  age: number;
  address: string;
  emergencyContact: string;
}

// ── Drivers: 6 drivers ───────────────────────────────────────────────────────
export const drivers: Driver[] = [
  { id: "d1", name: "Mang Jun", phone: "+63 918 111 2233", licenseNo: "N04-21-012345", licenseExpiry: "2028-06-30", vehicleAssigned: "NCR 1234", status: "active", age: 42, address: "Meycauayan, Bulacan", emergencyContact: "+63 918 111 0000" },
  { id: "d2", name: "Kuya Boy", phone: "+63 917 222 3344", licenseNo: "N04-22-023456", licenseExpiry: "2026-04-20", vehicleAssigned: "ABC 5678", status: "on_trip", age: 35, address: "Valenzuela City", emergencyContact: "+63 917 222 0000" },
  { id: "d3", name: "Tito Rex", phone: "+63 919 333 4455", licenseNo: "N03-20-034567", licenseExpiry: "2027-12-15", vehicleAssigned: "DEF 9012", status: "active", age: 48, address: "San Jose del Monte, Bulacan", emergencyContact: "+63 919 333 0000" },
  { id: "d4", name: "Mang Eddie", phone: "+63 920 444 5566", licenseNo: "N04-23-045678", licenseExpiry: "2028-03-20", vehicleAssigned: "GHI 3456", status: "on_trip", age: 38, address: "Caloocan City", emergencyContact: "+63 920 444 0000" },
  { id: "d5", name: "Tito Bert", phone: "+63 922 666 7788", licenseNo: "N04-24-067890", licenseExpiry: "2029-05-10", vehicleAssigned: "MNO 1234", status: "on_trip", age: 44, address: "Malolos, Bulacan", emergencyContact: "+63 922 666 0000" },
  { id: "d6", name: "Mang Dodo", phone: "+63 923 777 8899", licenseNo: "N04-22-078901", licenseExpiry: "2027-11-20", vehicleAssigned: "PQR 5678", status: "active", age: 40, address: "Marilao, Bulacan", emergencyContact: "+63 923 777 0000" },
];

// ── Load Board Interface ─────────────────────────────────────────────────────
export interface Load {
  id: string;
  origin: string;
  destination: string;
  cargoType: string;
  cargoCategory: string;
  weight: number;
  cbm: number;
  vehicleNeeded: string;
  rate: number;
  budgetMin: number;
  budgetMax: number;
  shipperName: string;
  loadType: "FTL" | "LTL" | "Reefer" | "Inter-Island";
  paymentTerms: string;
  bidDeadline: string;
  postedDate: string;
  interIsland: boolean;
  roroRequired: boolean;
  bidCount: number;
  description: string;
}

// ── Load Board: 15 Available Loads ───────────────────────────────────────────
export const loads: Load[] = [
  {
    id: "l1", origin: "Manila (Navotas Fish Port)", destination: "Cebu City (Carbon Market)",
    cargoType: "Frozen Seafood", cargoCategory: "Perishable", weight: 14000, cbm: 40,
    vehicleNeeded: "Refrigerated Van", rate: 145000, budgetMin: 130000, budgetMax: 160000,
    shipperName: "SouthSea Fisheries Inc.", loadType: "Reefer",
    paymentTerms: "7 days after ePOD", bidDeadline: "2026-03-20", postedDate: "2026-03-19",
    interIsland: true, roroRequired: true, bidCount: 3,
    description: "Temperature-controlled transport of frozen bangus and galunggong. Maintain -18C throughout transit. RoRo ferry via Batangas-Cebu route.",
  },
  {
    id: "l2", origin: "Batangas Port", destination: "Davao City (DMSF)",
    cargoType: "Canned Goods", cargoCategory: "FMCG", weight: 18000, cbm: 55,
    vehicleNeeded: "10-Wheeler", rate: 165000, budgetMin: 150000, budgetMax: 180000,
    shipperName: "NutriPack Corp.", loadType: "FTL",
    paymentTerms: "COD upon delivery", bidDeadline: "2026-03-21", postedDate: "2026-03-19",
    interIsland: true, roroRequired: true, bidCount: 5,
    description: "Full truckload of assorted canned goods for distribution center in Davao. Palletized cargo, 40 pallets total.",
  },
  {
    id: "l3", origin: "San Fernando, Pampanga", destination: "Makati CBD",
    cargoType: "Office Furniture", cargoCategory: "General Cargo", weight: 3500, cbm: 18,
    vehicleNeeded: "Elf Truck", rate: 18000, budgetMin: 15000, budgetMax: 22000,
    shipperName: "OfficeHub PH", loadType: "LTL",
    paymentTerms: "3 days after ePOD", bidDeadline: "2026-03-20", postedDate: "2026-03-18",
    interIsland: false, roroRequired: false, bidCount: 2,
    description: "Office desks, chairs, and cabinets for new BGC office. Careful handling required - some items are glass-top.",
  },
  {
    id: "l4", origin: "Calamba, Laguna", destination: "Iloilo City",
    cargoType: "Frozen Meat", cargoCategory: "Perishable", weight: 10000, cbm: 30,
    vehicleNeeded: "Refrigerated Van", rate: 110000, budgetMin: 95000, budgetMax: 120000,
    shipperName: "MeatWorld PH", loadType: "Reefer",
    paymentTerms: "14 days after ePOD", bidDeadline: "2026-03-22", postedDate: "2026-03-18",
    interIsland: true, roroRequired: true, bidCount: 1,
    description: "Frozen pork and chicken for Iloilo supermarket chain. Temperature must be maintained at -15C to -20C.",
  },
  {
    id: "l5", origin: "Subic Bay Freeport", destination: "Cagayan de Oro",
    cargoType: "Auto Parts (CBU)", cargoCategory: "Automotive", weight: 12000, cbm: 45,
    vehicleNeeded: "10-Wheeler", rate: 135000, budgetMin: 120000, budgetMax: 150000,
    shipperName: "AutoZone Imports", loadType: "FTL",
    paymentTerms: "7 days after ePOD", bidDeadline: "2026-03-21", postedDate: "2026-03-17",
    interIsland: true, roroRequired: true, bidCount: 4,
    description: "Completely built-up auto parts including bumpers, doors, and engine components. Fragile - requires careful loading.",
  },
  {
    id: "l6", origin: "Quezon City (Balintawak)", destination: "Baguio City",
    cargoType: "Beverages (Cases)", cargoCategory: "FMCG", weight: 5200, cbm: 22,
    vehicleNeeded: "Wing Van", rate: 28000, budgetMin: 22000, budgetMax: 32000,
    shipperName: "FreshDrinks Inc.", loadType: "LTL",
    paymentTerms: "COD upon delivery", bidDeadline: "2026-03-20", postedDate: "2026-03-17",
    interIsland: false, roroRequired: false, bidCount: 6,
    description: "Assorted juice drinks and bottled water. 200 cases total. Delivery to warehouse in La Trinidad.",
  },
  {
    id: "l7", origin: "Taguig (BGC)", destination: "Zamboanga City",
    cargoType: "Construction Materials", cargoCategory: "Construction", weight: 20000, cbm: 58,
    vehicleNeeded: "Trailer", rate: 185000, budgetMin: 170000, budgetMax: 200000,
    shipperName: "BuildRight Supply Co.", loadType: "Inter-Island",
    paymentTerms: "30 days invoice", bidDeadline: "2026-03-23", postedDate: "2026-03-16",
    interIsland: true, roroRequired: true, bidCount: 2,
    description: "Steel bars, cement bags, and roofing materials for a construction project in Zamboanga. Heavy cargo - trailer required.",
  },
  {
    id: "l8", origin: "Meycauayan, Bulacan", destination: "Legazpi City, Albay",
    cargoType: "Rice (50kg sacks)", cargoCategory: "Agriculture", weight: 7000, cbm: 25,
    vehicleNeeded: "Dropside", rate: 35000, budgetMin: 28000, budgetMax: 40000,
    shipperName: "Bicol Harvest Trading", loadType: "FTL",
    paymentTerms: "COD upon delivery", bidDeadline: "2026-03-20", postedDate: "2026-03-16",
    interIsland: false, roroRequired: false, bidCount: 3,
    description: "140 sacks of premium rice for distribution in Bicol region. Dry cargo - must keep away from moisture.",
  },
  {
    id: "l9", origin: "Manila (Port Area)", destination: "General Santos City",
    cargoType: "Electronics (Appliances)", cargoCategory: "Electronics", weight: 9000, cbm: 35,
    vehicleNeeded: "10-Wheeler", rate: 155000, budgetMin: 140000, budgetMax: 170000,
    shipperName: "PhilTech Logistics", loadType: "FTL",
    paymentTerms: "14 days after ePOD", bidDeadline: "2026-03-22", postedDate: "2026-03-15",
    interIsland: true, roroRequired: true, bidCount: 2,
    description: "Refrigerators, washing machines, and air conditioning units. Fragile electronics - secure strapping required.",
  },
  {
    id: "l10", origin: "Valenzuela City", destination: "Tarlac City",
    cargoType: "FMCG (Grocery)", cargoCategory: "FMCG", weight: 1500, cbm: 6,
    vehicleNeeded: "Closed Van", rate: 8500, budgetMin: 7000, budgetMax: 10000,
    shipperName: "QuickMart Distribution", loadType: "LTL",
    paymentTerms: "3 days after ePOD", bidDeadline: "2026-03-20", postedDate: "2026-03-19",
    interIsland: false, roroRequired: false, bidCount: 1,
    description: "Assorted grocery items for supermarket restocking. Mixed dry goods and personal care products.",
  },
  {
    id: "l11", origin: "Clark Freeport, Pampanga", destination: "Tacloban City, Leyte",
    cargoType: "Medical Supplies", cargoCategory: "Pharmaceutical", weight: 4000, cbm: 18,
    vehicleNeeded: "Closed Van", rate: 95000, budgetMin: 85000, budgetMax: 110000,
    shipperName: "MedSupply PH", loadType: "Inter-Island",
    paymentTerms: "7 days after ePOD", bidDeadline: "2026-03-21", postedDate: "2026-03-18",
    interIsland: true, roroRequired: true, bidCount: 0,
    description: "Medical supplies including PPE, IV fluids, and surgical instruments. Priority delivery - hospital restocking.",
  },
  {
    id: "l12", origin: "Pasig City", destination: "Angeles City, Pampanga",
    cargoType: "Garments (Retail)", cargoCategory: "Textile", weight: 800, cbm: 5,
    vehicleNeeded: "L300 Van", rate: 6500, budgetMin: 5000, budgetMax: 8000,
    shipperName: "StyleWear Corp.", loadType: "LTL",
    paymentTerms: "COD upon delivery", bidDeadline: "2026-03-19", postedDate: "2026-03-18",
    interIsland: false, roroRequired: false, bidCount: 4,
    description: "Boxes of retail clothing for mall outlets. 30 boxes of assorted garments.",
  },
  {
    id: "l13", origin: "Cavite Export Zone", destination: "Bacolod City, Negros Occidental",
    cargoType: "Semiconductors", cargoCategory: "Electronics", weight: 2500, cbm: 10,
    vehicleNeeded: "Closed Van", rate: 88000, budgetMin: 80000, budgetMax: 100000,
    shipperName: "ChipTech Manufacturing", loadType: "Inter-Island",
    paymentTerms: "14 days after ePOD", bidDeadline: "2026-03-22", postedDate: "2026-03-17",
    interIsland: true, roroRequired: true, bidCount: 1,
    description: "Sensitive electronic components. Anti-static packaging. Climate-controlled preferred but not required.",
  },
  {
    id: "l14", origin: "Marikina City", destination: "Lipa City, Batangas",
    cargoType: "Shoes (Export Quality)", cargoCategory: "Textile", weight: 1200, cbm: 8,
    vehicleNeeded: "L300 Van", rate: 5500, budgetMin: 4500, budgetMax: 7000,
    shipperName: "Marikina Shoe Hub", loadType: "LTL",
    paymentTerms: "COD upon delivery", bidDeadline: "2026-03-20", postedDate: "2026-03-19",
    interIsland: false, roroRequired: false, bidCount: 2,
    description: "Export-quality leather shoes. 50 boxes for warehouse storage in Lipa.",
  },
  {
    id: "l15", origin: "Paranaque (NAIA area)", destination: "Puerto Princesa, Palawan",
    cargoType: "Resort Supplies", cargoCategory: "General Cargo", weight: 6000, cbm: 30,
    vehicleNeeded: "Wing Van", rate: 125000, budgetMin: 110000, budgetMax: 140000,
    shipperName: "Island Resorts Group", loadType: "Inter-Island",
    paymentTerms: "7 days after ePOD", bidDeadline: "2026-03-23", postedDate: "2026-03-16",
    interIsland: true, roroRequired: true, bidCount: 0,
    description: "Furniture, linens, and amenities for new resort opening. Mixed cargo requiring careful handling.",
  },
];

// ── Bid Interface ────────────────────────────────────────────────────────────
export interface Bid {
  id: string;
  loadId: string;
  loadRoute: string;
  offeredRate: number;
  vehiclePlate: string;
  vehicleType: string;
  proposedPickup: string;
  message: string;
  status: "pending" | "accepted" | "rejected" | "expired";
  submittedDate: string;
}

// ── Bids: 8 bids ────────────────────────────────────────────────────────────
export const bids: Bid[] = [
  { id: "BID-001", loadId: "l1", loadRoute: "Manila - Cebu City", offeredRate: 140000, vehiclePlate: "PQR 5678", vehicleType: "Refrigerated Van", proposedPickup: "2026-03-20 06:00", message: "We have a reefer van with temperature logging. Can maintain -18C.", status: "pending", submittedDate: "2026-03-19" },
  { id: "BID-002", loadId: "l2", loadRoute: "Batangas - Davao City", offeredRate: 158000, vehiclePlate: "MNO 1234", vehicleType: "10-Wheeler", proposedPickup: "2026-03-21 04:00", message: "Available 10-wheeler with experienced Mindanao driver.", status: "pending", submittedDate: "2026-03-19" },
  { id: "BID-003", loadId: "l3", loadRoute: "Pampanga - Makati", offeredRate: 16500, vehiclePlate: "DEF 9012", vehicleType: "Elf Truck", proposedPickup: "2026-03-20 08:00", message: "Can do same-day delivery. Padded interior for furniture.", status: "accepted", submittedDate: "2026-03-18" },
  { id: "BID-004", loadId: "l6", loadRoute: "QC - Baguio", offeredRate: 26000, vehiclePlate: "GHI 3456", vehicleType: "Wing Van", proposedPickup: "2026-03-20 03:00", message: "Early morning departure to avoid Baguio traffic.", status: "accepted", submittedDate: "2026-03-17" },
  { id: "BID-005", loadId: "l8", loadRoute: "Bulacan - Legazpi", offeredRate: 33000, vehiclePlate: "JKL 7890", vehicleType: "Dropside", proposedPickup: "2026-03-20 05:00", message: "Experienced in Bicol route. Dropside suitable for sack loading.", status: "rejected", submittedDate: "2026-03-16" },
  { id: "BID-006", loadId: "l5", loadRoute: "Subic - Cagayan de Oro", offeredRate: 130000, vehiclePlate: "MNO 1234", vehicleType: "10-Wheeler", proposedPickup: "2026-03-22 04:00", message: "Can provide extra strapping for fragile auto parts.", status: "expired", submittedDate: "2026-03-15" },
  { id: "BID-007", loadId: "l10", loadRoute: "Valenzuela - Tarlac", offeredRate: 8000, vehiclePlate: "ABC 5678", vehicleType: "Closed Van", proposedPickup: "2026-03-20 07:00", message: "Short haul, can deliver within the day.", status: "pending", submittedDate: "2026-03-19" },
  { id: "BID-008", loadId: "l12", loadRoute: "Pasig - Angeles City", offeredRate: 6000, vehiclePlate: "NCR 1234", vehicleType: "L300 Van", proposedPickup: "2026-03-19 14:00", message: "Available this afternoon for pickup.", status: "pending", submittedDate: "2026-03-19" },
];

// ── Trip Interface ───────────────────────────────────────────────────────────
export interface Trip {
  id: string;
  loadId: string;
  origin: string;
  destination: string;
  shipperName: string;
  vehiclePlate: string;
  vehicleType: string;
  driver: string;
  status: "assigned" | "picked_up" | "in_transit" | "delivered";
  rate: number;
  startDate: string;
  endDate?: string;
  epodStatus?: "pending" | "uploaded" | "confirmed";
  interIsland: boolean;
  milestones: { label: string; date: string; done: boolean }[];
}

// ── Trips: 10 trips ─────────────────────────────────────────────────────────
export const trips: Trip[] = [
  {
    id: "TRP-2026-001", loadId: "l1", origin: "Manila (Navotas Fish Port)", destination: "Cebu City (Carbon Market)",
    shipperName: "SouthSea Fisheries Inc.", vehiclePlate: "MNO 1234", vehicleType: "10-Wheeler",
    driver: "Tito Bert", status: "in_transit", rate: 145000, startDate: "2026-03-16",
    interIsland: true,
    milestones: [
      { label: "Assigned", date: "2026-03-16 08:00", done: true },
      { label: "Picked Up", date: "2026-03-16 10:30", done: true },
      { label: "In Transit", date: "2026-03-16 11:00", done: true },
      { label: "Delivered", date: "", done: false },
    ],
  },
  {
    id: "TRP-2026-002", loadId: "l2", origin: "Batangas Port", destination: "Davao City (DMSF)",
    shipperName: "NutriPack Corp.", vehiclePlate: "GHI 3456", vehicleType: "Wing Van",
    driver: "Mang Eddie", status: "in_transit", rate: 120000, startDate: "2026-03-17",
    interIsland: true,
    milestones: [
      { label: "Assigned", date: "2026-03-17 06:00", done: true },
      { label: "Picked Up", date: "2026-03-17 08:00", done: true },
      { label: "In Transit", date: "2026-03-17 09:00", done: true },
      { label: "Delivered", date: "", done: false },
    ],
  },
  {
    id: "TRP-2026-003", loadId: "l6", origin: "Quezon City (Balintawak)", destination: "Baguio City",
    shipperName: "FreshDrinks Inc.", vehiclePlate: "ABC 5678", vehicleType: "Closed Van",
    driver: "Kuya Boy", status: "picked_up", rate: 28000, startDate: "2026-03-18",
    interIsland: false,
    milestones: [
      { label: "Assigned", date: "2026-03-18 03:00", done: true },
      { label: "Picked Up", date: "2026-03-18 05:30", done: true },
      { label: "In Transit", date: "", done: false },
      { label: "Delivered", date: "", done: false },
    ],
  },
  {
    id: "TRP-2026-004", loadId: "l3", origin: "San Fernando, Pampanga", destination: "Makati CBD",
    shipperName: "OfficeHub PH", vehiclePlate: "DEF 9012", vehicleType: "Elf Truck",
    driver: "Tito Rex", status: "delivered", rate: 18000, startDate: "2026-03-14", endDate: "2026-03-14",
    epodStatus: "confirmed", interIsland: false,
    milestones: [
      { label: "Assigned", date: "2026-03-14 07:00", done: true },
      { label: "Picked Up", date: "2026-03-14 08:30", done: true },
      { label: "In Transit", date: "2026-03-14 09:00", done: true },
      { label: "Delivered", date: "2026-03-14 13:00", done: true },
    ],
  },
  {
    id: "TRP-2026-005", loadId: "l4", origin: "Calamba, Laguna", destination: "Iloilo City",
    shipperName: "MeatWorld PH", vehiclePlate: "PQR 5678", vehicleType: "Refrigerated Van",
    driver: "Mang Dodo", status: "delivered", rate: 110000, startDate: "2026-03-10", endDate: "2026-03-13",
    epodStatus: "confirmed", interIsland: true,
    milestones: [
      { label: "Assigned", date: "2026-03-10 05:00", done: true },
      { label: "Picked Up", date: "2026-03-10 07:00", done: true },
      { label: "In Transit", date: "2026-03-10 08:00", done: true },
      { label: "Delivered", date: "2026-03-13 14:00", done: true },
    ],
  },
  {
    id: "TRP-2026-006", loadId: "l8", origin: "Meycauayan, Bulacan", destination: "Legazpi City, Albay",
    shipperName: "Bicol Harvest Trading", vehiclePlate: "NCR 1234", vehicleType: "L300 Van",
    driver: "Mang Jun", status: "delivered", rate: 35000, startDate: "2026-03-08", endDate: "2026-03-09",
    epodStatus: "uploaded", interIsland: false,
    milestones: [
      { label: "Assigned", date: "2026-03-08 04:00", done: true },
      { label: "Picked Up", date: "2026-03-08 06:00", done: true },
      { label: "In Transit", date: "2026-03-08 07:00", done: true },
      { label: "Delivered", date: "2026-03-09 10:00", done: true },
    ],
  },
  {
    id: "TRP-2026-007", loadId: "l10", origin: "Valenzuela City", destination: "Tarlac City",
    shipperName: "QuickMart Distribution", vehiclePlate: "FGH 9900", vehicleType: "Closed Van",
    driver: "Mang Rolly", status: "assigned", rate: 8500, startDate: "2026-03-19",
    interIsland: false,
    milestones: [
      { label: "Assigned", date: "2026-03-19 06:00", done: true },
      { label: "Picked Up", date: "", done: false },
      { label: "In Transit", date: "", done: false },
      { label: "Delivered", date: "", done: false },
    ],
  },
  {
    id: "TRP-2026-008", loadId: "l5", origin: "Subic Bay Freeport", destination: "Cagayan de Oro",
    shipperName: "AutoZone Imports", vehiclePlate: "STU 9012", vehicleType: "Trailer",
    driver: "Kuya Nonoy", status: "delivered", rate: 135000, startDate: "2026-03-05", endDate: "2026-03-09",
    epodStatus: "confirmed", interIsland: true,
    milestones: [
      { label: "Assigned", date: "2026-03-05 04:00", done: true },
      { label: "Picked Up", date: "2026-03-05 06:00", done: true },
      { label: "In Transit", date: "2026-03-05 07:00", done: true },
      { label: "Delivered", date: "2026-03-09 16:00", done: true },
    ],
  },
  {
    id: "TRP-2026-009", loadId: "l9", origin: "Manila (Port Area)", destination: "General Santos City",
    shipperName: "PhilTech Logistics", vehiclePlate: "MNO 1234", vehicleType: "10-Wheeler",
    driver: "Tito Bert", status: "delivered", rate: 155000, startDate: "2026-02-25", endDate: "2026-03-01",
    epodStatus: "confirmed", interIsland: true,
    milestones: [
      { label: "Assigned", date: "2026-02-25 05:00", done: true },
      { label: "Picked Up", date: "2026-02-25 08:00", done: true },
      { label: "In Transit", date: "2026-02-25 09:00", done: true },
      { label: "Delivered", date: "2026-03-01 14:00", done: true },
    ],
  },
  {
    id: "TRP-2026-010", loadId: "l7", origin: "Taguig (BGC)", destination: "Zamboanga City",
    shipperName: "BuildRight Supply Co.", vehiclePlate: "STU 9012", vehicleType: "Trailer",
    driver: "Kuya Nonoy", status: "delivered", rate: 185000, startDate: "2026-02-15", endDate: "2026-02-22",
    epodStatus: "confirmed", interIsland: true,
    milestones: [
      { label: "Assigned", date: "2026-02-15 04:00", done: true },
      { label: "Picked Up", date: "2026-02-15 07:00", done: true },
      { label: "In Transit", date: "2026-02-15 08:00", done: true },
      { label: "Delivered", date: "2026-02-22 11:00", done: true },
    ],
  },
];

// ── Document Interface ───────────────────────────────────────────────────────
export type DocStatus = "valid" | "expiring_soon" | "expired";

export interface Doc {
  id: string;
  name: string;
  type: "OR/CR" | "License" | "LTFRB" | "CTPL" | "NBI" | "Drug Test" | "ePOD" | "Waybill";
  category: "Vehicle Docs" | "Driver Docs" | "Insurance" | "Trip Docs";
  reference: string;
  status: DocStatus;
  expiry: string;
}

// ── Documents ────────────────────────────────────────────────────────────────
export const documents: Doc[] = [
  { id: "DOC-001", name: "OR/CR - NCR 1234 (L300 Van)", type: "OR/CR", category: "Vehicle Docs", reference: "NCR 1234", status: "valid", expiry: "2027-01-15" },
  { id: "DOC-002", name: "OR/CR - MNO 1234 (10-Wheeler)", type: "OR/CR", category: "Vehicle Docs", reference: "MNO 1234", status: "valid", expiry: "2027-05-10" },
  { id: "DOC-003", name: "LTFRB Franchise - NCR 1234", type: "LTFRB", category: "Vehicle Docs", reference: "LTFRB-NCR-2024-00112", status: "valid", expiry: "2027-06-30" },
  { id: "DOC-004", name: "LTFRB Franchise - JKL 7890 (Dropside)", type: "LTFRB", category: "Vehicle Docs", reference: "LTFRB-R3-2023-00088", status: "expiring_soon", expiry: "2026-04-15" },
  { id: "DOC-005", name: "LTO Pro License - Mang Jun", type: "License", category: "Driver Docs", reference: "N04-21-012345", status: "valid", expiry: "2028-06-30" },
  { id: "DOC-006", name: "LTO Pro License - Kuya Boy", type: "License", category: "Driver Docs", reference: "N04-22-023456", status: "expiring_soon", expiry: "2026-04-20" },
  { id: "DOC-007", name: "NBI Clearance - Mang Eddie", type: "NBI", category: "Driver Docs", reference: "NBI-2025-1234567", status: "valid", expiry: "2027-03-20" },
  { id: "DOC-008", name: "Drug Test Cert - Tito Bert", type: "Drug Test", category: "Driver Docs", reference: "DT-2025-08901", status: "expired", expiry: "2026-02-28" },
  { id: "DOC-009", name: "CTPL - NCR 1234", type: "CTPL", category: "Insurance", reference: "INS-CTPL-2024-001", status: "valid", expiry: "2026-12-31" },
  { id: "DOC-010", name: "CTPL - GHI 3456", type: "CTPL", category: "Insurance", reference: "INS-CTPL-2024-002", status: "expiring_soon", expiry: "2026-04-10" },
  { id: "DOC-011", name: "ePOD - TRP-2026-004 (Pampanga to Makati)", type: "ePOD", category: "Trip Docs", reference: "TRP-2026-004", status: "valid", expiry: "-" },
  { id: "DOC-012", name: "Waybill - TRP-2026-005 (Laguna to Iloilo)", type: "Waybill", category: "Trip Docs", reference: "TRP-2026-005", status: "valid", expiry: "-" },
];

// ── Earnings Interface ───────────────────────────────────────────────────────
export interface Earning {
  id: string;
  tripId: string;
  route: string;
  shipperName: string;
  amount: number;
  status: "paid" | "pending" | "processing";
  payoutMethod: "GCash" | "Bank Transfer";
  date: string;
}

// ── Earnings: 3 months of data ───────────────────────────────────────────────
export const earnings: Earning[] = [
  // March 2026
  { id: "E-001", tripId: "TRP-2026-004", route: "Pampanga - Makati", shipperName: "OfficeHub PH", amount: 18000, status: "paid", payoutMethod: "GCash", date: "2026-03-15" },
  { id: "E-002", tripId: "TRP-2026-005", route: "Laguna - Iloilo", shipperName: "MeatWorld PH", amount: 110000, status: "paid", payoutMethod: "Bank Transfer", date: "2026-03-14" },
  { id: "E-003", tripId: "TRP-2026-006", route: "Bulacan - Legazpi", shipperName: "Bicol Harvest Trading", amount: 35000, status: "paid", payoutMethod: "GCash", date: "2026-03-10" },
  { id: "E-004", tripId: "TRP-2026-001", route: "Manila - Cebu", shipperName: "SouthSea Fisheries Inc.", amount: 145000, status: "processing", payoutMethod: "Bank Transfer", date: "2026-03-17" },
  { id: "E-005", tripId: "TRP-2026-002", route: "Batangas - Davao", shipperName: "NutriPack Corp.", amount: 120000, status: "pending", payoutMethod: "Bank Transfer", date: "2026-03-18" },
  { id: "E-006", tripId: "TRP-2026-003", route: "QC - Baguio", shipperName: "FreshDrinks Inc.", amount: 28000, status: "pending", payoutMethod: "GCash", date: "2026-03-19" },
  { id: "E-007", tripId: "TRP-2026-008", route: "Subic - CDO", shipperName: "AutoZone Imports", amount: 135000, status: "paid", payoutMethod: "Bank Transfer", date: "2026-03-10" },
  { id: "E-008", tripId: "TRP-2026-009", route: "Manila - GenSan", shipperName: "PhilTech Logistics", amount: 155000, status: "paid", payoutMethod: "Bank Transfer", date: "2026-03-03" },
  // February 2026
  { id: "E-009", tripId: "TRP-2026-010", route: "Taguig - Zamboanga", shipperName: "BuildRight Supply Co.", amount: 185000, status: "paid", payoutMethod: "Bank Transfer", date: "2026-02-23" },
  { id: "E-010", tripId: "TRP-2025-095", route: "Manila - Bacolod", shipperName: "SugarKing Corp.", amount: 92000, status: "paid", payoutMethod: "Bank Transfer", date: "2026-02-18" },
  { id: "E-011", tripId: "TRP-2025-094", route: "Bulacan - Dagupan", shipperName: "NorthBound Trading", amount: 22000, status: "paid", payoutMethod: "GCash", date: "2026-02-12" },
  { id: "E-012", tripId: "TRP-2025-093", route: "Cavite - Naga", shipperName: "BicolExpress Logistics", amount: 45000, status: "paid", payoutMethod: "Bank Transfer", date: "2026-02-05" },
  // January 2026
  { id: "E-013", tripId: "TRP-2025-090", route: "Manila - Cebu", shipperName: "VisMin Distributors", amount: 138000, status: "paid", payoutMethod: "Bank Transfer", date: "2026-01-28" },
  { id: "E-014", tripId: "TRP-2025-089", route: "Pampanga - Baguio", shipperName: "Highland Traders", amount: 25000, status: "paid", payoutMethod: "GCash", date: "2026-01-20" },
  { id: "E-015", tripId: "TRP-2025-088", route: "QC - Batangas", shipperName: "SouthPort Inc.", amount: 15000, status: "paid", payoutMethod: "GCash", date: "2026-01-15" },
  { id: "E-016", tripId: "TRP-2025-087", route: "Valenzuela - Subic", shipperName: "FreeportCargo", amount: 18000, status: "paid", payoutMethod: "Bank Transfer", date: "2026-01-08" },
];

// ── Computed Stats ───────────────────────────────────────────────────────────
export const carrierStats = {
  fleetSize: vehicles.length,
  activeVehicles: vehicles.filter((v) => v.status === "available" || v.status === "on_trip").length,
  activeTrips: trips.filter((t) => t.status !== "delivered").length,
  openBids: bids.filter((b) => b.status === "pending").length,
  availableLoads: loads.length,
  monthlyRevenue: earnings.filter((e) => e.date.startsWith("2026-03")).reduce((sum, e) => sum + e.amount, 0),
};

// ── PH Regions ───────────────────────────────────────────────────────────────
export const phRegions = [
  "NCR", "CAR", "Ilocos Region", "Cagayan Valley", "Central Luzon",
  "Calabarzon", "Mimaropa", "Bicol Region", "Western Visayas",
  "Central Visayas", "Eastern Visayas", "Zamboanga Peninsula",
  "Northern Mindanao", "Davao Region", "Soccsksargen", "Caraga", "BARMM",
];

// ── Vehicle Types ────────────────────────────────────────────────────────────
export const vehicleTypes = [
  "Sedan", "MPV/SUV", "L300 Van", "Closed Van", "Dropside", "Elf Truck",
  "Wing Van", "10-Wheeler", "Trailer", "Tanker", "Refrigerated Van",
];

export const bodyTypes = [
  "Sedan", "SUV", "Closed", "Open/Dropside", "Wing Van", "Flatbed",
  "Refrigerated", "Tanker", "Curtainsider",
];

export const fuelTypes = ["diesel", "gasoline"] as const;
