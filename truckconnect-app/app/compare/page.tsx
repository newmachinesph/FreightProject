"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Truck,
  Warehouse as WarehouseIcon,
  CheckCircle,
  XCircle,
  MapPin,
  Star,
  Plus,
  Columns,
  Award,
  TrendingUp,
  DollarSign,
  FileDown,
  X,
  Search,
  Shield,
  Zap,
  BarChart3,
  Globe,
} from "lucide-react";
import Navbar from "@/components/Navbar";

// ── Mock Carrier Data ──

interface CompareCarrier {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  pricePerKm: number;
  fleetSize: number;
  specializations: string[];
  location: string;
  verified: boolean;
  onTimeRate: string;
  avgResponseTime: string;
  insurance: string;
  yearsInBusiness: number;
  completedTrips: number;
  acceptanceRate: string;
  cargoCareRating: number;
  communicationRating: number;
  onTimeRating: number;
  estimatedManilaCebu: number;
}

const allCarriers: CompareCarrier[] = [
  {
    id: "CR-001",
    name: "PhilTrans Logistics",
    rating: 4.8,
    reviews: 127,
    pricePerKm: 42,
    fleetSize: 45,
    specializations: ["FTL", "Reefer", "Hazmat"],
    location: "Metro Manila",
    verified: true,
    onTimeRate: "96%",
    avgResponseTime: "15 min",
    insurance: "Full Coverage (\u20B150M)",
    yearsInBusiness: 12,
    completedTrips: 1240,
    acceptanceRate: "88%",
    cargoCareRating: 4.9,
    communicationRating: 4.7,
    onTimeRating: 4.8,
    estimatedManilaCebu: 78000,
  },
  {
    id: "CR-003",
    name: "IslandFreight Co.",
    rating: 4.6,
    reviews: 89,
    pricePerKm: 38,
    fleetSize: 32,
    specializations: ["Inter-Island", "RoRo", "LTL"],
    location: "Cebu City",
    verified: true,
    onTimeRate: "93%",
    avgResponseTime: "22 min",
    insurance: "Full Coverage (\u20B140M)",
    yearsInBusiness: 8,
    completedTrips: 890,
    acceptanceRate: "82%",
    cargoCareRating: 4.5,
    communicationRating: 4.4,
    onTimeRating: 4.6,
    estimatedManilaCebu: 72000,
  },
  {
    id: "CR-007",
    name: "Visayas Express",
    rating: 4.5,
    reviews: 64,
    pricePerKm: 35,
    fleetSize: 22,
    specializations: ["FTL", "LTL"],
    location: "Iloilo City",
    verified: false,
    onTimeRate: "91%",
    avgResponseTime: "30 min",
    insurance: "Basic (\u20B115M)",
    yearsInBusiness: 5,
    completedTrips: 450,
    acceptanceRate: "78%",
    cargoCareRating: 4.3,
    communicationRating: 4.2,
    onTimeRating: 4.5,
    estimatedManilaCebu: 65000,
  },
  {
    id: "CR-009",
    name: "LBC Cargo Movers",
    rating: 4.9,
    reviews: 203,
    pricePerKm: 52,
    fleetSize: 60,
    specializations: ["E-Commerce", "Last Mile", "Express"],
    location: "Metro Manila",
    verified: true,
    onTimeRate: "98%",
    avgResponseTime: "5 min",
    insurance: "Premium (\u20B1100M)",
    yearsInBusiness: 20,
    completedTrips: 2100,
    acceptanceRate: "92%",
    cargoCareRating: 4.9,
    communicationRating: 4.8,
    onTimeRating: 4.9,
    estimatedManilaCebu: 95000,
  },
  {
    id: "CR-011",
    name: "Mindanao Freight Corp",
    rating: 4.5,
    reviews: 72,
    pricePerKm: 40,
    fleetSize: 28,
    specializations: ["Reefer", "Seafood", "Agriculture"],
    location: "Davao City",
    verified: true,
    onTimeRate: "93%",
    avgResponseTime: "20 min",
    insurance: "Full Coverage (\u20B135M)",
    yearsInBusiness: 7,
    completedTrips: 720,
    acceptanceRate: "85%",
    cargoCareRating: 4.6,
    communicationRating: 4.3,
    onTimeRating: 4.5,
    estimatedManilaCebu: 82000,
  },
];

// ── Mock Warehouse Data ──

interface CompareWarehouse {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  pricePerSqm: number;
  totalArea: number;
  type: string;
  location: string;
  verified: boolean;
  securityLevel: string;
  loadingDocks: number;
  temperatureControl: string;
  yearsInBusiness: number;
  occupancyRate: string;
  operatingHours: string;
  certifications: string[];
  estimated500sqm: number;
}

const allWarehouses: CompareWarehouse[] = [
  {
    id: "WH-001",
    name: "Manila Central Warehouse",
    rating: 4.7,
    reviews: 84,
    pricePerSqm: 350,
    totalArea: 5000,
    type: "Dry",
    location: "Tondo, Manila",
    verified: true,
    securityLevel: "24/7 CCTV + Guards",
    loadingDocks: 8,
    temperatureControl: "N/A",
    yearsInBusiness: 15,
    occupancyRate: "76%",
    operatingHours: "24/7",
    certifications: ["ISO 9001", "PEZA"],
    estimated500sqm: 175000,
  },
  {
    id: "WH-004",
    name: "Cebu Cold Storage Hub",
    rating: 4.5,
    reviews: 52,
    pricePerSqm: 520,
    totalArea: 2500,
    type: "Cold",
    location: "Mandaue, Cebu",
    verified: true,
    securityLevel: "24/7 CCTV + Guards",
    loadingDocks: 4,
    temperatureControl: "-18\u00B0C to 4\u00B0C",
    yearsInBusiness: 7,
    occupancyRate: "68%",
    operatingHours: "24/7",
    certifications: ["HACCP", "FDA"],
    estimated500sqm: 260000,
  },
  {
    id: "WH-009",
    name: "Clark Bonded Zone",
    rating: 4.8,
    reviews: 96,
    pricePerSqm: 480,
    totalArea: 8000,
    type: "Bonded",
    location: "Clark, Pampanga",
    verified: true,
    securityLevel: "Military-grade",
    loadingDocks: 12,
    temperatureControl: "N/A",
    yearsInBusiness: 20,
    occupancyRate: "56%",
    operatingHours: "Mon-Sat 6AM-10PM",
    certifications: ["BOC Licensed", "ISO 28000", "PEZA"],
    estimated500sqm: 240000,
  },
  {
    id: "WH-012",
    name: "Davao Agri Cold Storage",
    rating: 4.4,
    reviews: 38,
    pricePerSqm: 490,
    totalArea: 3200,
    type: "Cold",
    location: "Toril, Davao City",
    verified: true,
    securityLevel: "24/7 CCTV + Guards",
    loadingDocks: 5,
    temperatureControl: "-25\u00B0C to 8\u00B0C",
    yearsInBusiness: 5,
    occupancyRate: "100%",
    operatingHours: "24/7",
    certifications: ["HACCP", "DA Accredited"],
    estimated500sqm: 245000,
  },
];

type CompareMode = "carriers" | "warehouses";
type CompareTab = "overview" | "pricing" | "performance" | "fleet" | "coverage";

function computeCarrierScore(c: CompareCarrier): number {
  const ratingScore = (c.rating / 5) * 30;
  const priceScore = ((60 - c.pricePerKm) / 30) * 20; // lower price = higher score
  const fleetScore = Math.min(c.fleetSize / 60, 1) * 15;
  const verifiedScore = c.verified ? 10 : 0;
  const onTimeScore = (parseFloat(c.onTimeRate) / 100) * 15;
  const experienceScore = Math.min(c.yearsInBusiness / 20, 1) * 10;
  return Math.round(ratingScore + priceScore + fleetScore + verifiedScore + onTimeScore + experienceScore);
}

function computeWarehouseScore(w: CompareWarehouse): number {
  const ratingScore = (w.rating / 5) * 30;
  const priceScore = ((600 - w.pricePerSqm) / 300) * 20;
  const areaScore = Math.min(w.totalArea / 8000, 1) * 15;
  const verifiedScore = w.verified ? 10 : 0;
  const dockScore = Math.min(w.loadingDocks / 12, 1) * 15;
  const experienceScore = Math.min(w.yearsInBusiness / 20, 1) * 10;
  return Math.round(ratingScore + priceScore + areaScore + verifiedScore + dockScore + experienceScore);
}

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 85 ? "#059669" : score >= 70 ? "#d97706" : "#DC2626";
  const bg = score >= 85 ? "#DCFCE7" : score >= 70 ? "#FEF3C7" : "#FEE2E2";
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: "50%",
        backgroundColor: bg, border: `2px solid ${color}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 16, fontWeight: 800, color,
      }}>
        {score}
      </div>
      <span style={{ fontSize: 9, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5 }}>
        TC Score
      </span>
    </div>
  );
}

function RecommendBadge({ label, color, bg }: { label: string; color: string; bg: string }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 3,
      padding: "3px 8px", borderRadius: 9999, fontSize: 10, fontWeight: 700,
      backgroundColor: bg, color,
    }}>
      <Award size={10} /> {label}
    </span>
  );
}

export default function ComparePage() {
  const [mode, setMode] = useState<CompareMode>("carriers");
  const [activeTab, setActiveTab] = useState<CompareTab>("overview");
  const [selectedCarrierIds, setSelectedCarrierIds] = useState<string[]>(["CR-001", "CR-003", "CR-007"]);
  const [selectedWarehouseIds, setSelectedWarehouseIds] = useState<string[]>(["WH-001", "WH-004", "WH-009"]);
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedCarriers = allCarriers.filter((c) => selectedCarrierIds.includes(c.id));
  const selectedWarehouses = allWarehouses.filter((w) => selectedWarehouseIds.includes(w.id));

  const items = mode === "carriers" ? selectedCarriers : selectedWarehouses;
  const maxItems = 4;

  // Compute recommendation badges
  const getCarrierBadges = (carriers: CompareCarrier[]) => {
    if (carriers.length === 0) return {};
    const scores = carriers.map(computeCarrierScore);
    const bestOverallIdx = scores.indexOf(Math.max(...scores));
    const bestValueIdx = carriers.reduce((best, c, i) => (c.pricePerKm < carriers[best].pricePerKm ? i : best), 0);
    const bestRatingIdx = carriers.reduce((best, c, i) => (c.rating > carriers[best].rating ? i : best), 0);

    const badges: Record<string, { label: string; color: string; bg: string }[]> = {};
    carriers.forEach((c, i) => {
      badges[c.id] = [];
      if (i === bestOverallIdx) badges[c.id].push({ label: "Best Overall", color: "#059669", bg: "#DCFCE7" });
      if (i === bestValueIdx && i !== bestOverallIdx) badges[c.id].push({ label: "Best Value", color: "#2563eb", bg: "#EFF6FF" });
      if (i === bestRatingIdx && i !== bestOverallIdx) badges[c.id].push({ label: "Best Rating", color: "#d97706", bg: "#FEF3C7" });
    });
    return badges;
  };

  const getWarehouseBadges = (warehouses: CompareWarehouse[]) => {
    if (warehouses.length === 0) return {};
    const scores = warehouses.map(computeWarehouseScore);
    const bestOverallIdx = scores.indexOf(Math.max(...scores));
    const bestValueIdx = warehouses.reduce((best, w, i) => (w.pricePerSqm < warehouses[best].pricePerSqm ? i : best), 0);
    const bestRatingIdx = warehouses.reduce((best, w, i) => (w.rating > warehouses[best].rating ? i : best), 0);

    const badges: Record<string, { label: string; color: string; bg: string }[]> = {};
    warehouses.forEach((w, i) => {
      badges[w.id] = [];
      if (i === bestOverallIdx) badges[w.id].push({ label: "Best Overall", color: "#059669", bg: "#DCFCE7" });
      if (i === bestValueIdx && i !== bestOverallIdx) badges[w.id].push({ label: "Best Value", color: "#2563eb", bg: "#EFF6FF" });
      if (i === bestRatingIdx && i !== bestOverallIdx) badges[w.id].push({ label: "Best Rating", color: "#d97706", bg: "#FEF3C7" });
    });
    return badges;
  };

  const carrierBadges = getCarrierBadges(selectedCarriers);
  const warehouseBadges = getWarehouseBadges(selectedWarehouses);

  // Remove item
  const removeItem = (id: string) => {
    if (mode === "carriers") setSelectedCarrierIds((prev) => prev.filter((i) => i !== id));
    else setSelectedWarehouseIds((prev) => prev.filter((i) => i !== id));
  };

  // Add item
  const addItem = (id: string) => {
    if (mode === "carriers") {
      if (selectedCarrierIds.length < maxItems) setSelectedCarrierIds((prev) => [...prev, id]);
    } else {
      if (selectedWarehouseIds.length < maxItems) setSelectedWarehouseIds((prev) => [...prev, id]);
    }
    setShowAddPanel(false);
    setSearchQuery("");
  };

  const availableToAdd = mode === "carriers"
    ? allCarriers.filter((c) => !selectedCarrierIds.includes(c.id)).filter((c) => !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : allWarehouses.filter((w) => !selectedWarehouseIds.includes(w.id)).filter((w) => !searchQuery || w.name.toLowerCase().includes(searchQuery.toLowerCase()));

  // Best-in-row helpers
  function getBestIndex(vals: number[], direction: "highest" | "lowest"): number {
    if (vals.length === 0) return -1;
    if (direction === "highest") return vals.indexOf(Math.max(...vals));
    return vals.indexOf(Math.min(...vals));
  }

  // Tab config
  const compareTabs: { key: CompareTab; label: string; icon: typeof BarChart3 }[] = [
    { key: "overview", label: "Overview", icon: BarChart3 },
    { key: "pricing", label: "Pricing", icon: DollarSign },
    { key: "performance", label: "Performance", icon: Zap },
    { key: "fleet", label: mode === "carriers" ? "Fleet/Capacity" : "Capacity", icon: Truck },
    { key: "coverage", label: "Coverage", icon: Globe },
  ];

  // Row rendering
  type RowDef = { label: string; values: (string | number)[]; numericValues?: number[]; best?: "highest" | "lowest" };

  function getOverviewRows(): RowDef[] {
    if (mode === "carriers") {
      return [
        { label: "TruckConnect Score", values: selectedCarriers.map(computeCarrierScore), numericValues: selectedCarriers.map(computeCarrierScore), best: "highest" },
        { label: "Rating", values: selectedCarriers.map((c) => `${c.rating} (${c.reviews})`), numericValues: selectedCarriers.map((c) => c.rating), best: "highest" },
        { label: "Verified", values: selectedCarriers.map((c) => c.verified ? "Yes" : "No") },
        { label: "Location", values: selectedCarriers.map((c) => c.location) },
        { label: "Years in Business", values: selectedCarriers.map((c) => c.yearsInBusiness), numericValues: selectedCarriers.map((c) => c.yearsInBusiness), best: "highest" },
        { label: "Specializations", values: selectedCarriers.map((c) => c.specializations.join(", ")) },
      ];
    }
    return [
      { label: "TruckConnect Score", values: selectedWarehouses.map(computeWarehouseScore), numericValues: selectedWarehouses.map(computeWarehouseScore), best: "highest" },
      { label: "Rating", values: selectedWarehouses.map((w) => `${w.rating} (${w.reviews})`), numericValues: selectedWarehouses.map((w) => w.rating), best: "highest" },
      { label: "Verified", values: selectedWarehouses.map((w) => w.verified ? "Yes" : "No") },
      { label: "Type", values: selectedWarehouses.map((w) => w.type) },
      { label: "Location", values: selectedWarehouses.map((w) => w.location) },
      { label: "Years in Business", values: selectedWarehouses.map((w) => w.yearsInBusiness), numericValues: selectedWarehouses.map((w) => w.yearsInBusiness), best: "highest" },
    ];
  }

  function getPricingRows(): RowDef[] {
    if (mode === "carriers") {
      return [
        { label: "Price per km", values: selectedCarriers.map((c) => `\u20B1${c.pricePerKm}`), numericValues: selectedCarriers.map((c) => c.pricePerKm), best: "lowest" },
        { label: "Est. Manila \u2192 Cebu (FTL)", values: selectedCarriers.map((c) => `\u20B1${c.estimatedManilaCebu.toLocaleString()}`), numericValues: selectedCarriers.map((c) => c.estimatedManilaCebu), best: "lowest" },
        { label: "Insurance Coverage", values: selectedCarriers.map((c) => c.insurance) },
      ];
    }
    return [
      { label: "Price per sqm/mo", values: selectedWarehouses.map((w) => `\u20B1${w.pricePerSqm}`), numericValues: selectedWarehouses.map((w) => w.pricePerSqm), best: "lowest" },
      { label: "Est. 500 sqm/month", values: selectedWarehouses.map((w) => `\u20B1${w.estimated500sqm.toLocaleString()}`), numericValues: selectedWarehouses.map((w) => w.estimated500sqm), best: "lowest" },
      { label: "Occupancy Rate", values: selectedWarehouses.map((w) => w.occupancyRate) },
    ];
  }

  function getPerformanceRows(): RowDef[] {
    if (mode === "carriers") {
      return [
        { label: "On-Time Rate", values: selectedCarriers.map((c) => c.onTimeRate), numericValues: selectedCarriers.map((c) => parseFloat(c.onTimeRate)), best: "highest" },
        { label: "Acceptance Rate", values: selectedCarriers.map((c) => c.acceptanceRate), numericValues: selectedCarriers.map((c) => parseFloat(c.acceptanceRate)), best: "highest" },
        { label: "Avg Response Time", values: selectedCarriers.map((c) => c.avgResponseTime) },
        { label: "Completed Trips", values: selectedCarriers.map((c) => c.completedTrips.toLocaleString()), numericValues: selectedCarriers.map((c) => c.completedTrips), best: "highest" },
        { label: "On-Time Rating", values: selectedCarriers.map((c) => `${c.onTimeRating}/5`), numericValues: selectedCarriers.map((c) => c.onTimeRating), best: "highest" },
        { label: "Communication Rating", values: selectedCarriers.map((c) => `${c.communicationRating}/5`), numericValues: selectedCarriers.map((c) => c.communicationRating), best: "highest" },
        { label: "Cargo Care Rating", values: selectedCarriers.map((c) => `${c.cargoCareRating}/5`), numericValues: selectedCarriers.map((c) => c.cargoCareRating), best: "highest" },
      ];
    }
    return [
      { label: "Security Level", values: selectedWarehouses.map((w) => w.securityLevel) },
      { label: "Operating Hours", values: selectedWarehouses.map((w) => w.operatingHours) },
      { label: "Certifications", values: selectedWarehouses.map((w) => w.certifications.join(", ")) },
    ];
  }

  function getFleetRows(): RowDef[] {
    if (mode === "carriers") {
      return [
        { label: "Fleet Size", values: selectedCarriers.map((c) => `${c.fleetSize} vehicles`), numericValues: selectedCarriers.map((c) => c.fleetSize), best: "highest" },
        { label: "Specializations", values: selectedCarriers.map((c) => c.specializations.join(", ")) },
      ];
    }
    return [
      { label: "Total Area", values: selectedWarehouses.map((w) => `${w.totalArea.toLocaleString()} sqm`), numericValues: selectedWarehouses.map((w) => w.totalArea), best: "highest" },
      { label: "Loading Docks", values: selectedWarehouses.map((w) => w.loadingDocks), numericValues: selectedWarehouses.map((w) => w.loadingDocks), best: "highest" },
      { label: "Temperature Control", values: selectedWarehouses.map((w) => w.temperatureControl) },
    ];
  }

  function getCoverageRows(): RowDef[] {
    if (mode === "carriers") {
      return [
        { label: "Location (HQ)", values: selectedCarriers.map((c) => c.location) },
        { label: "Specializations", values: selectedCarriers.map((c) => c.specializations.join(", ")) },
      ];
    }
    return [
      { label: "Location", values: selectedWarehouses.map((w) => w.location) },
      { label: "Type", values: selectedWarehouses.map((w) => w.type) },
    ];
  }

  const rowsByTab: Record<CompareTab, () => RowDef[]> = {
    overview: getOverviewRows,
    pricing: getPricingRows,
    performance: getPerformanceRows,
    fleet: getFleetRows,
    coverage: getCoverageRows,
  };

  const rows = rowsByTab[activeTab]();

  const currentBadges = mode === "carriers" ? carrierBadges : warehouseBadges;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      <Navbar active="Compare" />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 24px 64px" }}>
        <a href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#6B7280", fontSize: 13, textDecoration: "none", marginBottom: 16 }}>
          <ArrowLeft size={14} /> Back to Marketplace
        </a>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "8px 0 6px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Columns size={24} color="#2563eb" />
            <h1 style={{ fontSize: 26, fontWeight: 700, color: "#0f172a", margin: 0 }}>Compare</h1>
          </div>
          <button
            onClick={() => alert("PDF export coming soon!")}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "8px 16px", border: "1px solid #e2e8f0", borderRadius: 8,
              cursor: "pointer", fontSize: 13, fontWeight: 500, color: "#374151",
              backgroundColor: "#ffffff",
            }}
          >
            <FileDown size={14} /> Save as PDF
          </button>
        </div>
        <p style={{ fontSize: 14, color: "#6B7280", margin: "0 0 24px" }}>Compare carriers or warehouses side by side with weighted scoring</p>

        {/* Mode Toggle */}
        <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
          <button
            onClick={() => { setMode("carriers"); setActiveTab("overview"); }}
            style={{
              padding: "8px 20px", border: "1px solid #e2e8f0", borderRadius: 8,
              cursor: "pointer", fontSize: 13, fontWeight: mode === "carriers" ? 600 : 400,
              color: mode === "carriers" ? "#2563eb" : "#6B7280",
              backgroundColor: mode === "carriers" ? "#EFF6FF" : "#ffffff",
              display: "flex", alignItems: "center", gap: 6, transition: "all 0.15s",
            }}
          >
            <Truck size={14} /> Carriers ({selectedCarriers.length})
          </button>
          <button
            onClick={() => { setMode("warehouses"); setActiveTab("overview"); }}
            style={{
              padding: "8px 20px", border: "1px solid #e2e8f0", borderRadius: 8,
              cursor: "pointer", fontSize: 13, fontWeight: mode === "warehouses" ? 600 : 400,
              color: mode === "warehouses" ? "#7c3aed" : "#6B7280",
              backgroundColor: mode === "warehouses" ? "#F5F3FF" : "#ffffff",
              display: "flex", alignItems: "center", gap: 6, transition: "all 0.15s",
            }}
          >
            <WarehouseIcon size={14} /> Warehouses ({selectedWarehouses.length})
          </button>
        </div>

        {/* Dimension Tabs */}
        <div style={{ display: "flex", gap: 2, marginBottom: 20, borderBottom: "1px solid #e2e8f0", paddingBottom: 0 }}>
          {compareTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  padding: "8px 14px", border: "none", borderBottom: isActive ? "2px solid #2563eb" : "2px solid transparent",
                  cursor: "pointer", fontSize: 12, fontWeight: isActive ? 600 : 400,
                  color: isActive ? "#2563eb" : "#6B7280",
                  backgroundColor: "transparent",
                  display: "flex", alignItems: "center", gap: 5, transition: "all 0.15s",
                  marginBottom: -1,
                }}
              >
                <Icon size={13} /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* Comparison Table */}
        <div style={{
          backgroundColor: "#ffffff",
          borderRadius: 12,
          border: "1px solid #e2e8f0",
          overflow: "hidden",
        }}>
          {/* Header Row */}
          <div style={{
            display: "grid",
            gridTemplateColumns: `180px repeat(${items.length}, 1fr)${items.length < maxItems ? " 80px" : ""}`,
            borderBottom: "2px solid #e2e8f0",
          }}>
            <div style={{ padding: "16px 20px", backgroundColor: "#f8fafc", fontWeight: 600, fontSize: 12, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5, display: "flex", alignItems: "center" }}>
              Feature
            </div>
            {items.map((item: any) => {
              const badges = currentBadges[item.id] ?? [];
              const score = mode === "carriers" ? computeCarrierScore(item) : computeWarehouseScore(item);
              return (
                <div key={item.id} style={{ padding: "16px 16px", textAlign: "center", borderLeft: "1px solid #e2e8f0", position: "relative" }}>
                  {/* Remove button */}
                  {items.length > 2 && (
                    <button
                      onClick={() => removeItem(item.id)}
                      style={{
                        position: "absolute", top: 8, right: 8,
                        background: "none", border: "none", cursor: "pointer", padding: 2,
                      }}
                      title="Remove from comparison"
                    >
                      <X size={14} color="#94a3b8" />
                    </button>
                  )}

                  <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
                    <ScoreBadge score={score} />
                  </div>

                  <div style={{
                    width: 40, height: 40, borderRadius: 10, margin: "0 auto 6px",
                    backgroundColor: mode === "carriers" ? "#ECFDF5" : "#F5F3FF",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {mode === "carriers"
                      ? <Truck size={20} color="#059669" />
                      : <WarehouseIcon size={20} color="#7c3aed" />
                    }
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", marginBottom: 2 }}>{item.name}</div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, fontSize: 11, color: "#94a3b8", marginBottom: 6 }}>
                    <Star size={10} color="#d97706" fill="#d97706" /> {item.rating} ({item.reviews})
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 3 }}>
                    {badges.map((b) => (
                      <RecommendBadge key={b.label} label={b.label} color={b.color} bg={b.bg} />
                    ))}
                  </div>
                </div>
              );
            })}
            {items.length < maxItems && (
              <div style={{ padding: "16px 12px", textAlign: "center", borderLeft: "1px solid #e2e8f0", backgroundColor: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <button
                  onClick={() => setShowAddPanel(!showAddPanel)}
                  style={{
                    padding: "8px 12px", border: "1px dashed #cbd5e1", borderRadius: 8,
                    cursor: "pointer", fontSize: 11, fontWeight: 500, color: "#94a3b8",
                    backgroundColor: "transparent", display: "flex", alignItems: "center", gap: 4,
                  }}
                >
                  <Plus size={12} /> Add
                </button>
              </div>
            )}
          </div>

          {/* Data Rows */}
          {rows.map((row, rowIdx) => {
            const bestIdx = row.best && row.numericValues ? getBestIndex(row.numericValues, row.best) : -1;
            return (
              <div
                key={row.label}
                style={{
                  display: "grid",
                  gridTemplateColumns: `180px repeat(${items.length}, 1fr)${items.length < maxItems ? " 80px" : ""}`,
                  borderBottom: rowIdx < rows.length - 1 ? "1px solid #f1f5f9" : "none",
                }}
              >
                <div style={{
                  padding: "12px 20px", backgroundColor: "#f8fafc",
                  fontSize: 13, fontWeight: 500, color: "#374151",
                  display: "flex", alignItems: "center",
                }}>
                  {row.label}
                </div>
                {row.values.map((val, colIdx) => {
                  const isBest = colIdx === bestIdx;
                  return (
                    <div
                      key={colIdx}
                      style={{
                        padding: "12px 16px",
                        textAlign: "center",
                        borderLeft: "1px solid #f1f5f9",
                        fontSize: 13,
                        fontWeight: isBest ? 700 : 400,
                        color: isBest ? "#059669" : "#374151",
                        backgroundColor: isBest ? "#F0FDF4" : "transparent",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 4,
                      }}
                    >
                      {row.label === "Verified" ? (
                        val === "Yes" ? <CheckCircle size={16} color="#059669" /> : <XCircle size={16} color="#94a3b8" />
                      ) : (
                        <span>{String(val)}</span>
                      )}
                    </div>
                  );
                })}
                {items.length < maxItems && (
                  <div style={{ padding: "12px", borderLeft: "1px solid #f1f5f9", backgroundColor: "#f8fafc" }} />
                )}
              </div>
            );
          })}
        </div>

        {/* Add Panel */}
        {showAddPanel && (
          <div style={{
            marginTop: 16, backgroundColor: "#ffffff", borderRadius: 12,
            border: "1px solid #e2e8f0", padding: 20,
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: "#0f172a", margin: 0 }}>
                Add {mode === "carriers" ? "Carrier" : "Warehouse"} to Compare
              </h3>
              <button onClick={() => { setShowAddPanel(false); setSearchQuery(""); }} style={{ background: "none", border: "none", cursor: "pointer" }}>
                <X size={18} color="#94a3b8" />
              </button>
            </div>
            <div style={{ position: "relative", marginBottom: 12 }}>
              <Search size={14} color="#94a3b8" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }} />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${mode}...`}
                style={{
                  width: "100%", padding: "8px 12px 8px 30px", border: "1px solid #e2e8f0", borderRadius: 8,
                  fontSize: 13, color: "#374151", outline: "none", boxSizing: "border-box",
                }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {availableToAdd.length === 0 ? (
                <p style={{ fontSize: 13, color: "#94a3b8", textAlign: "center", padding: 16 }}>
                  No more {mode} available to add.
                </p>
              ) : (
                (availableToAdd as any[]).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => addItem(item.id)}
                    style={{
                      display: "flex", alignItems: "center", gap: 10, padding: "10px 14px",
                      border: "1px solid #e2e8f0", borderRadius: 8, cursor: "pointer",
                      backgroundColor: "#ffffff", textAlign: "left", width: "100%",
                      transition: "background-color 0.1s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f8fafc")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}
                  >
                    <div style={{
                      width: 36, height: 36, borderRadius: 8,
                      backgroundColor: mode === "carriers" ? "#ECFDF5" : "#F5F3FF",
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}>
                      {mode === "carriers" ? <Truck size={16} color="#059669" /> : <WarehouseIcon size={16} color="#7c3aed" />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{item.name}</div>
                      <div style={{ fontSize: 11, color: "#94a3b8" }}>
                        <Star size={9} color="#d97706" fill="#d97706" /> {item.rating} &middot; {item.location}
                      </div>
                    </div>
                    <Plus size={16} color="#2563eb" />
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        {/* Cost-benefit analysis */}
        <div style={{
          marginTop: 20, backgroundColor: "#ffffff", borderRadius: 12,
          border: "1px solid #e2e8f0", padding: 20,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <DollarSign size={18} color="#059669" />
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", margin: 0 }}>Cost-Benefit Analysis</h3>
          </div>

          {mode === "carriers" ? (
            <div>
              <p style={{ fontSize: 13, color: "#64748b", marginBottom: 12 }}>
                Estimated cost for a sample FTL route: <strong>Manila {"\u2192"} Cebu City</strong> (approx. 570 km via RoRo)
              </p>
              <div style={{ display: "grid", gridTemplateColumns: `repeat(${selectedCarriers.length}, 1fr)`, gap: 12 }}>
                {selectedCarriers.map((c) => {
                  const score = computeCarrierScore(c);
                  return (
                    <div key={c.id} style={{
                      padding: 16, borderRadius: 10, border: "1px solid #e2e8f0",
                      textAlign: "center",
                    }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 4 }}>{c.name}</div>
                      <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", marginBottom: 4 }}>
                        {"\u20B1"}{c.estimatedManilaCebu.toLocaleString()}
                      </div>
                      <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 8 }}>
                        {"\u20B1"}{c.pricePerKm}/km &middot; {c.onTimeRate} on-time
                      </div>
                      <div style={{
                        display: "inline-block", padding: "3px 10px", borderRadius: 9999,
                        fontSize: 11, fontWeight: 700,
                        backgroundColor: score >= 85 ? "#DCFCE7" : score >= 70 ? "#FEF3C7" : "#FEE2E2",
                        color: score >= 85 ? "#059669" : score >= 70 ? "#92400E" : "#DC2626",
                      }}>
                        Score: {score}/100
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div>
              <p style={{ fontSize: 13, color: "#64748b", marginBottom: 12 }}>
                Estimated monthly cost for <strong>500 sqm</strong> of warehouse space
              </p>
              <div style={{ display: "grid", gridTemplateColumns: `repeat(${selectedWarehouses.length}, 1fr)`, gap: 12 }}>
                {selectedWarehouses.map((w) => {
                  const score = computeWarehouseScore(w);
                  return (
                    <div key={w.id} style={{
                      padding: 16, borderRadius: 10, border: "1px solid #e2e8f0",
                      textAlign: "center",
                    }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 4 }}>{w.name}</div>
                      <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", marginBottom: 4 }}>
                        {"\u20B1"}{w.estimated500sqm.toLocaleString()}/mo
                      </div>
                      <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 8 }}>
                        {"\u20B1"}{w.pricePerSqm}/sqm &middot; {w.type} &middot; {w.loadingDocks} docks
                      </div>
                      <div style={{
                        display: "inline-block", padding: "3px 10px", borderRadius: 9999,
                        fontSize: 11, fontWeight: 700,
                        backgroundColor: score >= 85 ? "#DCFCE7" : score >= 70 ? "#FEF3C7" : "#FEE2E2",
                        color: score >= 85 ? "#059669" : score >= 70 ? "#92400E" : "#DC2626",
                      }}>
                        Score: {score}/100
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div style={{ marginTop: 16, fontSize: 12, color: "#94a3b8", textAlign: "center" }}>
          Green highlighted cells indicate the best value in each row. TruckConnect Score is weighted: Rating (30%), Price (20%), Fleet/Area (15%), Verified (10%), Performance (15%), Experience (10%). Add up to 4 items to compare.
        </div>
      </div>
    </div>
  );
}
