"use client";

import { use, useState, useMemo } from "react";
import {
  MapPin, ArrowRight, ArrowLeft, Package,
  Phone, Gavel, Star, CheckCircle, Anchor, Zap, Shield,
  Calendar, Clock, CreditCard, Truck, Box, Weight,
  Navigation, Leaf, Ship, Route as RouteIcon, Info,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import MapView from "@/components/MapView";
import CargoVisualizer from "@/components/CargoVisualizer";
import { loads } from "@/lib/mock-data";
import type { MarketplaceLoad } from "@/lib/mock-data";
import {
  RORO_ROUTES, MAJOR_LAND_ROUTES, FREIGHT_HUBS, VEHICLE_SPECS,
  estimateRouteCO2,
  type RoRoRoute, type LandRoute, type FreightHub,
} from "@/lib/ph-routes";

const statusColors: Record<MarketplaceLoad["status"], { bg: string; text: string; label: string; glow: string }> = {
  open: { bg: "#059669", text: "#ffffff", label: "Open", glow: "0 0 8px rgba(5,150,105,0.4)" },
  bidding: { bg: "#d97706", text: "#ffffff", label: "Bidding", glow: "0 0 8px rgba(217,119,6,0.4)" },
  awarded: { bg: "#2563eb", text: "#ffffff", label: "Awarded", glow: "0 0 8px rgba(37,99,235,0.4)" },
  in_transit: { bg: "#7c3aed", text: "#ffffff", label: "In Transit", glow: "0 0 8px rgba(124,58,237,0.4)" },
  delivered: { bg: "#6b7280", text: "#ffffff", label: "Delivered", glow: "0 0 8px rgba(107,114,128,0.4)" },
};

const biddingModeLabels: Record<string, { label: string; color: string; icon: typeof Gavel }> = {
  open_auction: { label: "Open Auction", color: "#D97706", icon: Gavel },
  sealed_bid: { label: "Sealed Bid", color: "#7C3AED", icon: Package },
  direct_award: { label: "Direct Award", color: "#059669", icon: Zap },
  instant_book: { label: "Instant Book", color: "#2563EB", icon: Zap },
};

function formatRate(rate: number): string {
  return new Intl.NumberFormat("en-PH").format(rate);
}

// Estimate cargo dimensions from volume and vehicle type
function estimateDimensions(volumeCbm: number, vehicleType: string): { l: number; w: number; h: number } {
  const cbrt = Math.cbrt(volumeCbm);
  if (vehicleType.includes("Flatbed")) return { l: cbrt * 1.8, w: cbrt * 0.9, h: cbrt * 0.6 };
  if (vehicleType.includes("Tanker")) return { l: cbrt * 1.5, w: cbrt * 0.8, h: cbrt * 0.8 };
  return { l: cbrt * 1.4, w: cbrt * 0.9, h: cbrt * 0.8 };
}

// Find closest freight hub by coordinates
function findClosestHub(lat: number, lng: number): FreightHub | null {
  let closest: FreightHub | null = null;
  let minDist = Infinity;
  for (const hub of FREIGHT_HUBS) {
    const d = Math.sqrt((hub.lat - lat) ** 2 + (hub.lng - lng) ** 2);
    if (d < minDist) {
      minDist = d;
      closest = hub;
    }
  }
  return minDist < 1.0 ? closest : null; // Within ~1 degree (~110km)
}

// Match RoRo routes relevant to this load
function findMatchingRoRoRoutes(load: MarketplaceLoad): RoRoRoute[] {
  if (!load.interIsland || !load.roroRoute) return [];
  const routeStr = load.roroRoute.toLowerCase();
  return RORO_ROUTES.filter((rr) => {
    const originName = rr.origin.name.toLowerCase();
    const destName = rr.destination.name.toLowerCase();
    const routeName = rr.name.toLowerCase();
    // Check if the RoRo route's origin/destination cities appear in the load's roroRoute string
    return routeStr.split(" - ").some((seg) => {
      const s = seg.trim().toLowerCase();
      return originName.includes(s) || destName.includes(s) || routeName.includes(s);
    });
  });
}

// Match land route for origin/destination
function findMatchingLandRoute(load: MarketplaceLoad): LandRoute | null {
  const oCity = load.origin.city.toLowerCase();
  const dCity = load.destination.city.toLowerCase();
  return MAJOR_LAND_ROUTES.find((lr) => {
    const from = lr.from.toLowerCase();
    const to = lr.to.toLowerCase();
    return (
      (from.includes(oCity) || oCity.includes(from)) &&
      (to.includes(dCity) || dCity.includes(to))
    ) || (
      (from.includes(dCity) || dCity.includes(from)) &&
      (to.includes(oCity) || oCity.includes(to))
    );
  }) || null;
}

// Get vehicle SVG path from vehicle type
function getVehicleSvgPath(vehicleType: string): string | null {
  const spec = VEHICLE_SPECS.find((v) =>
    vehicleType.toLowerCase().includes(v.type.toLowerCase()) ||
    v.type.toLowerCase().includes(vehicleType.toLowerCase().replace(/\d+-wheeler\s*/i, ""))
  );
  return spec?.image || null;
}

// Fuzzy vehicle spec match
function findVehicleSpec(vehicleType: string): typeof VEHICLE_SPECS[0] | null {
  // Try exact match first
  let spec = VEHICLE_SPECS.find((v) => v.type === vehicleType);
  if (spec) return spec;
  // Fuzzy match: check if keywords match
  const vt = vehicleType.toLowerCase();
  spec = VEHICLE_SPECS.find((v) => {
    const t = v.type.toLowerCase();
    if (vt.includes("reefer") && t.includes("reefer")) {
      if (vt.includes("4") && t.includes("4")) return true;
      if (vt.includes("6") && t.includes("6")) return true;
      if (vt.includes("10") && t.includes("10")) return true;
    }
    if (vt.includes("closed van") && t.includes("closed van")) {
      if (vt.includes("4") && t.includes("4")) return true;
      if (vt.includes("6") && t.includes("6")) return true;
    }
    if (vt.includes("wing van") && t.includes("wing van")) {
      if (vt.includes("10") && t.includes("10")) return true;
      if (vt.includes("6") && t.includes("6")) return true;
    }
    if (vt.includes("flatbed") && t.includes("flatbed")) return true;
    if (vt.includes("tanker") && t.includes("tanker")) return true;
    if (vt.includes("container") && t.includes("container")) {
      if (vt.includes("40") && t.includes("40")) return true;
      if (vt.includes("20") && t.includes("20")) return true;
    }
    if (vt.includes("dropside") && t.includes("dropside")) return true;
    if (vt.includes("l300") && t.includes("l300")) return true;
    return false;
  });
  return spec || null;
}

// Mock bids data
const mockBids = [
  { carrier: "JMD Trucking Services", amount: 78000, eta: 18, rating: 4.8, verified: true, time: "2h ago" },
  { carrier: "Visayas Express Haulers", amount: 82000, eta: 22, rating: 4.6, verified: true, time: "4h ago" },
  { carrier: "Batangas Port Carriers", amount: 75000, eta: 20, rating: 4.6, verified: true, time: "5h ago" },
  { carrier: "Pampanga Hauling Co", amount: 80000, eta: 24, rating: 4.3, verified: false, time: "6h ago" },
];

export default function LoadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const load = loads.find((l) => l.id === id);
  const [bidAmount, setBidAmount] = useState("");

  // Route data computations
  const routeData = useMemo(() => {
    if (!load) return null;

    const roroRoutes = findMatchingRoRoRoutes(load);
    const landRoute = findMatchingLandRoute(load);
    const originHub = findClosestHub(load.origin.lat, load.origin.lng);
    const destHub = findClosestHub(load.destination.lat, load.destination.lng);
    const vehicleSpec = findVehicleSpec(load.vehicleType);
    const vehicleSvg = vehicleSpec?.image || getVehicleSvgPath(load.vehicleType);

    // Calculate total distance for CO2
    let totalDistanceKm = 0;
    if (landRoute) {
      totalDistanceKm = landRoute.distanceKm;
    } else if (roroRoutes.length > 0) {
      // Estimate land + sea distance
      totalDistanceKm = roroRoutes.reduce((sum, r) => sum + r.distanceNm * 1.852, 0);
      // Add estimated land segments
      totalDistanceKm += 150; // avg land segments
    } else {
      // Estimate from coordinates
      const latDiff = Math.abs(load.origin.lat - load.destination.lat);
      const lngDiff = Math.abs(load.origin.lng - load.destination.lng);
      totalDistanceKm = Math.sqrt(latDiff ** 2 + lngDiff ** 2) * 111 * 1.3; // rough road factor
    }

    const co2 = estimateRouteCO2(totalDistanceKm, vehicleSpec?.type || load.vehicleType);

    // Build map markers and routes
    const markers: { lat: number; lng: number; label: string; color: string; info: string }[] = [
      {
        lat: load.origin.lat, lng: load.origin.lng, label: load.origin.city, color: "#2563eb",
        info: `Origin: ${load.origin.city}${load.origin.barangay ? `, ${load.origin.barangay}` : ""}`,
      },
      {
        lat: load.destination.lat, lng: load.destination.lng, label: load.destination.city, color: "#059669",
        info: `Destination: ${load.destination.city}${load.destination.barangay ? `, ${load.destination.barangay}` : ""}`,
      },
    ];

    // Add port markers for RoRo loads
    if (roroRoutes.length > 0) {
      roroRoutes.forEach((rr) => {
        if (!markers.some((m) => Math.abs(m.lat - rr.origin.lat) < 0.01 && Math.abs(m.lng - rr.origin.lng) < 0.01)) {
          markers.push({
            lat: rr.origin.lat, lng: rr.origin.lng, label: rr.origin.name, color: "#06b6d4",
            info: `Port: ${rr.origin.name}`,
          });
        }
        if (!markers.some((m) => Math.abs(m.lat - rr.destination.lat) < 0.01 && Math.abs(m.lng - rr.destination.lng) < 0.01)) {
          markers.push({
            lat: rr.destination.lat, lng: rr.destination.lng, label: rr.destination.name, color: "#06b6d4",
            info: `Port: ${rr.destination.name}`,
          });
        }
      });
    }

    // Build route polylines
    const routes: { origin: { lat: number; lng: number }; destination: { lat: number; lng: number }; waypoints?: { lat: number; lng: number }[]; color: string; dashed?: boolean; useDirections?: boolean }[] = [];

    if (roroRoutes.length > 0) {
      // Add ferry segments as dashed cyan lines
      roroRoutes.forEach((rr) => {
        routes.push({
          origin: rr.origin,
          destination: rr.destination,
          waypoints: rr.waypoints.length > 0 ? rr.waypoints : undefined,
          color: "#06b6d4",
          dashed: true,
        });
      });
      // Add land segments connecting origin to first port and last port to destination
      if (roroRoutes.length > 0) {
        const firstPort = roroRoutes[0].origin;
        const lastPort = roroRoutes[roroRoutes.length - 1].destination;
        // Origin to first port (land)
        if (Math.abs(load.origin.lat - firstPort.lat) > 0.05 || Math.abs(load.origin.lng - firstPort.lng) > 0.05) {
          routes.push({
            origin: { lat: load.origin.lat, lng: load.origin.lng },
            destination: firstPort,
            color: "#3b82f6",
            useDirections: true,
          });
        }
        // Last port to destination (land)
        if (Math.abs(load.destination.lat - lastPort.lat) > 0.05 || Math.abs(load.destination.lng - lastPort.lng) > 0.05) {
          routes.push({
            origin: lastPort,
            destination: { lat: load.destination.lat, lng: load.destination.lng },
            color: "#3b82f6",
            useDirections: true,
          });
        }
      }
    } else if (landRoute) {
      // Show land route with waypoints
      routes.push({
        origin: { lat: landRoute.waypoints[0]?.lat ?? load.origin.lat, lng: landRoute.waypoints[0]?.lng ?? load.origin.lng },
        destination: { lat: landRoute.waypoints[landRoute.waypoints.length - 1]?.lat ?? load.destination.lat, lng: landRoute.waypoints[landRoute.waypoints.length - 1]?.lng ?? load.destination.lng },
        waypoints: landRoute.waypoints.slice(1, -1),
        color: "#3b82f6",
        useDirections: true,
      });
    } else {
      // Fallback: straight line
      routes.push({
        origin: { lat: load.origin.lat, lng: load.origin.lng },
        destination: { lat: load.destination.lat, lng: load.destination.lng },
        color: "#3b82f6",
        useDirections: true,
      });
    }

    return {
      roroRoutes,
      landRoute,
      originHub,
      destHub,
      vehicleSpec,
      vehicleSvg,
      totalDistanceKm: Math.round(totalDistanceKm),
      co2,
      markers,
      routes,
    };
  }, [load]);

  if (!load) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
        <Navbar active="Load Board" />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "calc(100vh - 56px)" }}>
          <div style={{ textAlign: "center" }}>
            <Package size={48} color="#9CA3AF" />
            <h1 style={{ fontSize: 24, fontWeight: 700, color: "#111827", marginTop: 16 }}>Load not found</h1>
            <p style={{ color: "#6B7280", marginBottom: 24 }}>The load &quot;{id}&quot; does not exist.</p>
            <a href="/" style={{ color: "#2563EB", textDecoration: "none", fontWeight: 500 }}>Back to Load Board</a>
          </div>
        </div>
      </div>
    );
  }

  const sc = statusColors[load.status];
  const bm = biddingModeLabels[load.biddingMode];
  const BmIcon = bm.icon;
  const dims = estimateDimensions(load.volumeCbm, load.vehicleType);
  const showBids = load.bids > 0 && (load.status === "bidding" || load.status === "open");

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      <Navbar active="Load Board" />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "20px 24px 64px" }}>
        {/* Breadcrumb */}
        <a href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#6B7280", fontSize: 13, textDecoration: "none", marginBottom: 16 }}>
          <ArrowLeft size={14} /> Back to Load Board
        </a>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: "#0f172a", margin: 0 }}>{load.id}</h1>
            <span style={{
              padding: "4px 12px", borderRadius: 8, fontSize: 12, fontWeight: 700,
              backgroundColor: sc.bg, color: sc.text, boxShadow: sc.glow,
            }}>{sc.label}</span>
            {load.interIsland && (
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 4,
                padding: "4px 10px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                backgroundColor: "#0891b215", color: "#0891b2",
              }}>
                <Anchor size={12} /> Inter-Island
              </span>
            )}
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 4,
              padding: "4px 10px", borderRadius: 8, fontSize: 12, fontWeight: 600,
              backgroundColor: `${bm.color}15`, color: bm.color,
            }}>
              <BmIcon size={12} /> {bm.label}
            </span>
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, color: "#059669" }}>
            {"\u20B1"}{formatRate(load.offeredRate)}
          </div>
        </div>

        {/* Route header */}
        <div style={{
          backgroundColor: "#ffffff", borderRadius: 12, border: "1px solid #e2e8f0",
          padding: "16px 24px", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "center", gap: 24,
        }}>
          <div style={{ textAlign: "center" }}>
            <MapPin size={20} color="#2563eb" />
            <div style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", marginTop: 2 }}>{load.origin.city}</div>
            {load.origin.barangay && <div style={{ fontSize: 12, color: "#6B7280" }}>{load.origin.barangay}</div>}
            {routeData?.originHub && (
              <div style={{ fontSize: 10, color: "#3b82f6", marginTop: 2 }}>{routeData.originHub.name}</div>
            )}
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <div style={{ width: 120, height: 2, backgroundColor: "#e2e8f0", position: "relative" }}>
              <div style={{ position: "absolute", top: -9, left: "50%", transform: "translateX(-50%)" }}>
                <ArrowRight size={18} color="#2563eb" />
              </div>
            </div>
            {load.roroRoute && (
              <div style={{ fontSize: 10, color: "#0891B2", fontWeight: 500, marginTop: 4 }}>{load.roroRoute}</div>
            )}
            {routeData && (
              <div style={{ fontSize: 10, color: "#6B7280", marginTop: 2 }}>{routeData.totalDistanceKm} km</div>
            )}
          </div>
          <div style={{ textAlign: "center" }}>
            <MapPin size={20} color="#059669" />
            <div style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", marginTop: 2 }}>{load.destination.city}</div>
            {load.destination.barangay && <div style={{ fontSize: 12, color: "#6B7280" }}>{load.destination.barangay}</div>}
            {routeData?.destHub && (
              <div style={{ fontSize: 10, color: "#059669", marginTop: 2 }}>{routeData.destHub.name}</div>
            )}
          </div>
        </div>

        {/* Main content: 2 columns */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {/* Left column: Map + Route Details + Cargo */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Route Map */}
            <div style={{ backgroundColor: "#ffffff", borderRadius: 12, border: "1px solid #e2e8f0", padding: 16 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", margin: "0 0 12px", display: "flex", alignItems: "center", gap: 6 }}>
                <MapPin size={14} color="#2563eb" /> Route Map
                {load.interIsland && (
                  <span style={{ fontSize: 10, color: "#06b6d4", fontWeight: 500, marginLeft: 8 }}>
                    <Ship size={10} style={{ display: "inline", verticalAlign: "middle", marginRight: 2 }} />
                    Ferry routes shown as dashed cyan lines
                  </span>
                )}
              </h3>
              <MapView
                markers={routeData?.markers || [
                  { lat: load.origin.lat, lng: load.origin.lng, label: load.origin.city, color: "#2563eb", info: `Origin: ${load.origin.city}` },
                  { lat: load.destination.lat, lng: load.destination.lng, label: load.destination.city, color: "#059669", info: `Destination: ${load.destination.city}` },
                ]}
                routes={routeData?.routes || [
                  { origin: { lat: load.origin.lat, lng: load.origin.lng }, destination: { lat: load.destination.lat, lng: load.destination.lng }, color: "#3b82f6" },
                ]}
                height={280}
              />
              {/* Map legend */}
              {load.interIsland && (
                <div style={{ display: "flex", gap: 16, marginTop: 8, paddingTop: 8, borderTop: "1px solid #f1f5f9" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#64748b" }}>
                    <div style={{ width: 20, height: 3, backgroundColor: "#3b82f6", borderRadius: 2 }} />
                    Land route
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#64748b" }}>
                    <div style={{ width: 20, height: 3, background: "repeating-linear-gradient(90deg, #06b6d4 0px, #06b6d4 4px, transparent 4px, transparent 8px)", borderRadius: 2 }} />
                    Ferry route
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#64748b" }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#06b6d4" }} />
                    Port
                  </div>
                </div>
              )}
            </div>

            {/* Route Details Section */}
            {routeData && (routeData.landRoute || routeData.roroRoutes.length > 0) && (
              <div style={{ backgroundColor: "#ffffff", borderRadius: 12, border: "1px solid #e2e8f0", padding: 20 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", margin: "0 0 14px", display: "flex", alignItems: "center", gap: 6 }}>
                  <RouteIcon size={14} color="#2563eb" /> Route Details
                </h3>

                {/* Land route info */}
                {routeData.landRoute && (
                  <div style={{ marginBottom: routeData.roroRoutes.length > 0 ? 16 : 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#3b82f6", marginBottom: 8, display: "flex", alignItems: "center", gap: 4 }}>
                      <Navigation size={12} /> Land Route: {routeData.landRoute.name}
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      <div style={{ padding: "8px 12px", background: "#f8fafc", borderRadius: 8 }}>
                        <div style={{ fontSize: 11, color: "#6B7280" }}>Distance</div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>{routeData.landRoute.distanceKm} km</div>
                      </div>
                      <div style={{ padding: "8px 12px", background: "#f8fafc", borderRadius: 8 }}>
                        <div style={{ fontSize: 11, color: "#6B7280" }}>Est. Travel Time</div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>{routeData.landRoute.durationHours}h</div>
                      </div>
                      <div style={{ padding: "8px 12px", background: "#f8fafc", borderRadius: 8 }}>
                        <div style={{ fontSize: 11, color: "#6B7280" }}>Terrain</div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", textTransform: "capitalize" }}>{routeData.landRoute.terrain}</div>
                      </div>
                      {routeData.landRoute.tollways && routeData.landRoute.tollways.length > 0 && (
                        <div style={{ padding: "8px 12px", background: "#f8fafc", borderRadius: 8 }}>
                          <div style={{ fontSize: 11, color: "#6B7280" }}>Tollways</div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: "#0f172a" }}>{routeData.landRoute.tollways.join(", ")}</div>
                        </div>
                      )}
                    </div>
                    {routeData.landRoute.truckRestrictions && (
                      <div style={{ marginTop: 8, padding: "8px 12px", background: "#FEF3C7", borderRadius: 8 }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: "#92400E", marginBottom: 2 }}>Truck Restrictions</div>
                        <div style={{ fontSize: 12, color: "#78350F" }}>{routeData.landRoute.truckRestrictions}</div>
                      </div>
                    )}
                  </div>
                )}

                {/* Ferry/RoRo route info */}
                {routeData.roroRoutes.length > 0 && (
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#06b6d4", marginBottom: 8, display: "flex", alignItems: "center", gap: 4 }}>
                      <Ship size={12} /> Ferry Crossings ({routeData.roroRoutes.length})
                    </div>
                    {routeData.roroRoutes.map((rr) => (
                      <div key={rr.id} style={{ padding: "10px 14px", background: "#f0fdfa", borderRadius: 8, border: "1px solid #ccfbf1", marginBottom: 8 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a", marginBottom: 6 }}>{rr.name}</div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
                          <div>
                            <div style={{ fontSize: 10, color: "#6B7280" }}>Distance</div>
                            <div style={{ fontSize: 12, fontWeight: 600, color: "#0f172a" }}>{rr.distanceNm} NM</div>
                          </div>
                          <div>
                            <div style={{ fontSize: 10, color: "#6B7280" }}>Crossing Time</div>
                            <div style={{ fontSize: 12, fontWeight: 600, color: "#0f172a" }}>{rr.durationHours}h</div>
                          </div>
                          <div>
                            <div style={{ fontSize: 10, color: "#6B7280" }}>Frequency</div>
                            <div style={{ fontSize: 11, fontWeight: 500, color: "#0f172a" }}>{rr.frequency}</div>
                          </div>
                        </div>
                        <div style={{ marginTop: 6, fontSize: 11, color: "#64748b" }}>
                          <span style={{ fontWeight: 600 }}>Operators:</span> {rr.operators.join(", ")}
                        </div>
                        {rr.notes && (
                          <div style={{ marginTop: 4, fontSize: 11, color: "#0891b2", fontStyle: "italic" }}>{rr.notes}</div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* CO2 Estimate */}
                <div style={{ marginTop: 12, padding: "12px 14px", background: "#f0fdf4", borderRadius: 8, border: "1px solid #dcfce7" }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#166534", marginBottom: 6, display: "flex", alignItems: "center", gap: 4 }}>
                    <Leaf size={12} /> Carbon Footprint Estimate
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                    <div>
                      <div style={{ fontSize: 10, color: "#6B7280" }}>Total CO2</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#166534" }}>{routeData.co2.totalKg} kg</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: "#6B7280" }}>Per Ton-km</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#166534" }}>{routeData.co2.perTonKm} kg</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: "#6B7280" }}>Trees Equivalent</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#166534" }}>{routeData.co2.treesEquivalent} trees/yr</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* CO2 card when no detailed route */}
            {routeData && !routeData.landRoute && routeData.roroRoutes.length === 0 && (
              <div style={{ backgroundColor: "#ffffff", borderRadius: 12, border: "1px solid #e2e8f0", padding: 20 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", margin: "0 0 14px", display: "flex", alignItems: "center", gap: 6 }}>
                  <Leaf size={14} color="#166534" /> Carbon Footprint
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                  <div style={{ padding: "8px 12px", background: "#f0fdf4", borderRadius: 8 }}>
                    <div style={{ fontSize: 10, color: "#6B7280" }}>Total CO2</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#166534" }}>{routeData.co2.totalKg} kg</div>
                  </div>
                  <div style={{ padding: "8px 12px", background: "#f0fdf4", borderRadius: 8 }}>
                    <div style={{ fontSize: 10, color: "#6B7280" }}>Per Ton-km</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#166534" }}>{routeData.co2.perTonKm} kg</div>
                  </div>
                  <div style={{ padding: "8px 12px", background: "#f0fdf4", borderRadius: 8 }}>
                    <div style={{ fontSize: 10, color: "#6B7280" }}>Trees/yr Equiv</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#166534" }}>{routeData.co2.treesEquivalent}</div>
                  </div>
                </div>
              </div>
            )}

            {/* 3D Cargo Visualizer */}
            <div style={{ backgroundColor: "#ffffff", borderRadius: 12, border: "1px solid #e2e8f0", padding: 16 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", margin: "0 0 12px", display: "flex", alignItems: "center", gap: 6 }}>
                <Box size={14} color="#7c3aed" /> Cargo Dimensions
              </h3>
              <CargoVisualizer
                length={dims.l}
                width={dims.w}
                height={dims.h}
                weight={load.weightKg}
                vehicleType={load.vehicleType}
              />
            </div>
          </div>

          {/* Right column: Details + Bids */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Cargo Details */}
            <div style={{ backgroundColor: "#ffffff", borderRadius: 12, border: "1px solid #e2e8f0", padding: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", margin: "0 0 14px" }}>Cargo Details</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { label: "Commodity", value: load.commodity },
                  { label: "Cargo Type", value: load.cargoType },
                  { label: "Weight", value: `${formatRate(load.weightKg)} kg (${(load.weightKg / 1000).toFixed(1)}T)` },
                  { label: "Volume", value: `${load.volumeCbm} CBM` },
                  { label: "Units", value: load.numUnits.toString() },
                ].map((row) => (
                  <div key={row.label} style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 13, color: "#6B7280" }}>{row.label}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{row.value}</span>
                  </div>
                ))}
                {/* Vehicle type with SVG icon */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13, color: "#6B7280" }}>Vehicle Type</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {routeData?.vehicleSvg && (
                      <img
                        src={routeData.vehicleSvg}
                        alt={load.vehicleType}
                        width={80}
                        height={40}
                        style={{ objectFit: "contain" }}
                      />
                    )}
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{load.vehicleType}</span>
                  </div>
                </div>
                {/* Show vehicle spec details if found */}
                {routeData?.vehicleSpec && (
                  <div style={{ padding: "10px 12px", background: "#f8fafc", borderRadius: 8, marginTop: 4 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#64748b", marginBottom: 4 }}>
                      {routeData.vehicleSpec.localName} ({routeData.vehicleSpec.make[0]})
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 4, fontSize: 11 }}>
                      <div>
                        <span style={{ color: "#9CA3AF" }}>Payload: </span>
                        <span style={{ color: "#0f172a", fontWeight: 600 }}>{(routeData.vehicleSpec.maxPayloadKg / 1000).toFixed(0)}T</span>
                      </div>
                      <div>
                        <span style={{ color: "#9CA3AF" }}>Volume: </span>
                        <span style={{ color: "#0f172a", fontWeight: 600 }}>{routeData.vehicleSpec.maxVolumeCbm} CBM</span>
                      </div>
                      <div>
                        <span style={{ color: "#9CA3AF" }}>Fuel: </span>
                        <span style={{ color: "#0f172a", fontWeight: 600 }}>{routeData.vehicleSpec.avgFuelConsumption}</span>
                      </div>
                    </div>
                  </div>
                )}
                {load.specialRequirements && (
                  <div style={{ marginTop: 6, padding: "10px 12px", background: "#FEF3C7", borderRadius: 8 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#92400E", marginBottom: 2 }}>Special Requirements</div>
                    <div style={{ fontSize: 12, color: "#78350F" }}>{load.specialRequirements}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Pricing & Logistics */}
            <div style={{ backgroundColor: "#ffffff", borderRadius: 12, border: "1px solid #e2e8f0", padding: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", margin: "0 0 14px" }}>Pricing & Logistics</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { label: "Rate Type", value: load.rateType === "spot" ? "Spot" : "Contract" },
                  { label: "Pickup Date", value: load.pickupDate },
                  { label: "Pickup Window", value: load.pickupWindow },
                  { label: "Payment Terms", value: load.paymentTerms },
                  { label: "Bid Deadline", value: new Date(load.bidDeadline).toLocaleString("en-PH") },
                  { label: "Visibility", value: load.visibility === "public" ? "Public" : "Private" },
                ].map((row) => (
                  <div key={row.label} style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 13, color: "#6B7280" }}>{row.label}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{row.value}</span>
                  </div>
                ))}
                {load.portPickup && (
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 13, color: "#6B7280" }}>Port Pickup</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#0891B2" }}>{load.portPickup}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Shipper Info */}
            <div style={{ backgroundColor: "#ffffff", borderRadius: 12, border: "1px solid #e2e8f0", padding: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", margin: "0 0 14px" }}>Shipper</h3>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 10, backgroundColor: "#EFF6FF",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Package size={22} color="#2563EB" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>{load.shipper.name}</span>
                    {load.shipper.verified && (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 3, padding: "2px 8px", borderRadius: 9999, fontSize: 10, fontWeight: 600, color: "#2563EB", backgroundColor: "#EFF6FF" }}>
                        <CheckCircle size={10} /> Verified
                      </span>
                    )}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                    <Star size={13} color="#F59E0B" fill="#F59E0B" />
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{load.shipper.rating}</span>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 11, color: "#6B7280" }}>Bids</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: load.bids > 0 ? "#D97706" : "#9CA3AF" }}>{load.bids}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bids Section */}
        <div style={{ marginTop: 20 }}>
          <div style={{ backgroundColor: "#ffffff", borderRadius: 12, border: "1px solid #e2e8f0", padding: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", margin: "0 0 16px", display: "flex", alignItems: "center", gap: 6 }}>
              <Gavel size={14} color="#d97706" /> Bids ({load.bids})
            </h3>

            {showBids && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                {mockBids.slice(0, load.bids).map((bid, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "12px 16px",
                      backgroundColor: "#f8fafc",
                      borderRadius: 8,
                      border: "1px solid #f1f5f9",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: 8,
                        background: "linear-gradient(135deg, #1e293b, #334155)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <Truck size={16} color="#94a3b8" />
                      </div>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{bid.carrier}</span>
                          {bid.verified && <CheckCircle size={11} color="#2563eb" />}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#94a3b8" }}>
                          <span style={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <Star size={10} color="#f59e0b" fill="#f59e0b" /> {bid.rating}
                          </span>
                          <span>ETA: {bid.eta}h</span>
                          <span>{bid.time}</span>
                        </div>
                      </div>
                    </div>
                    <span style={{ fontSize: 16, fontWeight: 700, color: "#059669" }}>
                      {"\u20B1"}{formatRate(bid.amount)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Place bid form */}
            {(load.status === "open" || load.status === "bidding") ? (
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
                  <div>
                    <label style={{ fontSize: 11, color: "#6B7280", display: "block", marginBottom: 4 }}>Your Bid ({"\u20B1"})</label>
                    <input
                      type="text"
                      placeholder={formatRate(load.offeredRate)}
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 14, color: "#0f172a", background: "#fff", boxSizing: "border-box", outline: "none" }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, color: "#6B7280", display: "block", marginBottom: 4 }}>Vehicle Type</label>
                    <input type="text" placeholder={load.vehicleType} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 14, color: "#9CA3AF", background: "#f9fafb", boxSizing: "border-box" }} readOnly />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, color: "#6B7280", display: "block", marginBottom: 4 }}>ETA (hours)</label>
                    <input type="text" placeholder="e.g. 24" style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 14, color: "#0f172a", background: "#fff", boxSizing: "border-box", outline: "none" }} />
                  </div>
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <button
                    style={{
                      flex: 1, padding: "12px 24px", border: "none", borderRadius: 10,
                      fontSize: 14, fontWeight: 600, color: "#ffffff", backgroundColor: "#2563eb",
                      cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    }}
                    onClick={() => alert("Sign in required to place bids")}
                  >
                    <Gavel size={16} /> Place Bid
                  </button>
                  <button
                    style={{
                      padding: "12px 24px", border: "1px solid #e2e8f0", borderRadius: 10,
                      fontSize: 14, fontWeight: 600, color: "#64748b", backgroundColor: "#ffffff",
                      cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    }}
                    onClick={() => alert("Sign in required to contact shipper")}
                  >
                    <Phone size={16} /> Contact
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ padding: 20, background: "#f3f4f6", borderRadius: 10, textAlign: "center" }}>
                <p style={{ fontSize: 14, color: "#6B7280", margin: 0 }}>
                  This load is {load.status === "awarded" ? "already awarded" : load.status === "in_transit" ? "currently in transit" : "already delivered"}. Bidding is closed.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
