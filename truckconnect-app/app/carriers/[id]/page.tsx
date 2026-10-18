"use client";

import { use, useMemo, useState } from "react";
import {
  Truck, Star, CheckCircle, ArrowLeft, MapPin, Route, Award,
  MessageSquare, Shield, Briefcase, Box, Filter,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import MapView from "@/components/MapView";
import VehicleShowcaseWrapper from "@/components/VehicleShowcaseWrapper";
import { carriers, companies, type FleetVehicle } from "@/lib/mock-data";
import {
  MAJOR_LAND_ROUTES, FREIGHT_HUBS, VEHICLE_SPECS,
  type LandRoute, type FreightHub,
} from "@/lib/ph-routes";

// Mock reviews
const mockReviews = [
  { name: "Manila FMCG Corp", rating: 5, comment: "Excellent service, always on time. Cargo arrived in perfect condition.", date: "March 15, 2026" },
  { name: "Cebu Furniture Exports", rating: 4, comment: "Good communication and fair pricing. Would use again for inter-island loads.", date: "March 10, 2026" },
  { name: "Subic Freeport Logistics", rating: 5, comment: "Very professional team. Hazmat handling was compliant and efficient.", date: "March 5, 2026" },
];

/** Render star rating with filled/half/empty stars */
function StarRating({ rating, size = 14, showValue = true }: { rating: number; size?: number; showValue?: boolean }) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.3 && rating - full < 0.8;
  const stars = [];
  for (let i = 0; i < 5; i++) {
    if (i < full) {
      stars.push(<Star key={i} size={size} fill="#F59E0B" color="#F59E0B" />);
    } else if (i === full && hasHalf) {
      stars.push(
        <span key={i} style={{ position: "relative", display: "inline-block", width: size, height: size }}>
          <Star size={size} fill="none" color="#E5E7EB" style={{ position: "absolute", top: 0, left: 0 }} />
          <span style={{ position: "absolute", top: 0, left: 0, width: "50%", overflow: "hidden" }}>
            <Star size={size} fill="#F59E0B" color="#F59E0B" />
          </span>
        </span>
      );
    } else {
      stars.push(<Star key={i} size={size} fill="none" color="#E5E7EB" />);
    }
  }
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 2 }}>
      {stars}
      {showValue && <span style={{ marginLeft: 4, fontSize: size - 2, fontWeight: 600, color: "#374151" }}>{rating.toFixed(1)}</span>}
    </span>
  );
}

// Find closest freight hub by city name
function findHubByCity(city: string): FreightHub | null {
  const c = city.toLowerCase();
  return FREIGHT_HUBS.find((h) =>
    h.city.toLowerCase().includes(c) || c.includes(h.city.toLowerCase()) ||
    h.name.toLowerCase().includes(c)
  ) || null;
}

// Map of common lane city names to coordinate lookup
const laneCoords: Record<string, { lat: number; lng: number }> = {
  "Manila": { lat: 14.5995, lng: 120.9842 },
  "Cebu": { lat: 10.3157, lng: 123.8854 },
  "CDO": { lat: 8.4542, lng: 124.6319 },
  "Davao": { lat: 7.1907, lng: 125.4553 },
  "GenSan": { lat: 6.1164, lng: 125.1716 },
  "Clark": { lat: 15.185, lng: 120.5466 },
  "Subic": { lat: 14.8226, lng: 120.282 },
  "Batangas": { lat: 13.7565, lng: 121.0583 },
  "Iloilo": { lat: 10.7202, lng: 122.5621 },
  "Zamboanga": { lat: 6.9214, lng: 122.079 },
  "Bacolod": { lat: 10.6840, lng: 122.9570 },
  "Baguio": { lat: 16.4023, lng: 120.596 },
  "Pangasinan": { lat: 15.979, lng: 120.4436 },
  "La Union": { lat: 16.619, lng: 120.317 },
  "General Santos": { lat: 6.0878, lng: 125.1672 },
  "Naga": { lat: 13.6218, lng: 123.1948 },
};

// Find matching land route for a lane
function findLandRouteForLane(from: string, to: string): LandRoute | null {
  const f = from.toLowerCase();
  const t = to.toLowerCase();
  return MAJOR_LAND_ROUTES.find((lr) => {
    const lrFrom = lr.from.toLowerCase();
    const lrTo = lr.to.toLowerCase();
    return (
      (lrFrom.includes(f) || f.includes(lrFrom)) &&
      (lrTo.includes(t) || t.includes(lrTo))
    ) || (
      (lrFrom.includes(t) || t.includes(lrFrom)) &&
      (lrTo.includes(f) || f.includes(lrTo))
    );
  }) || null;
}

// Find vehicle spec by type name (fuzzy)
function findVehicleSpec(vehicleType: string): typeof VEHICLE_SPECS[0] | null {
  let spec = VEHICLE_SPECS.find((v) => v.type === vehicleType);
  if (spec) return spec;
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

// Status color map
const statusColors: Record<string, { bg: string; color: string; label: string }> = {
  available: { bg: "#ECFDF5", color: "#059669", label: "Available" },
  on_trip: { bg: "#EFF6FF", color: "#2563EB", label: "On Trip" },
  maintenance: { bg: "#FFFBEB", color: "#D97706", label: "Maintenance" },
  inactive: { bg: "#F3F4F6", color: "#6B7280", label: "Inactive" },
};

const fleetFilterTabs = ["All", "Available", "On Trip", "Maintenance"] as const;

export default function CarrierDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const carrier = carriers.find((c) => c.id === id);
  const [fleetFilter, setFleetFilter] = useState<string>("All");
  const [showcaseVehicleType, setShowcaseVehicleType] = useState<string>("");

  // Compute route data for service lanes
  const routeData = useMemo(() => {
    if (!carrier) return null;

    const serviceMarkers: { lat: number; lng: number; label: string; color: string; info: string }[] = [];
    const serviceRoutes: { origin: { lat: number; lng: number }; destination: { lat: number; lng: number }; waypoints?: { lat: number; lng: number }[]; color: string; dashed?: boolean; useDirections?: boolean }[] = [];

    // Add carrier HQ marker
    serviceMarkers.push({
      lat: carrier.location.lat,
      lng: carrier.location.lng,
      label: `${carrier.name} HQ`,
      color: "#2563eb",
      info: `Headquarters: ${carrier.location.city}`,
    });

    carrier.lanes.forEach((lane) => {
      const parts = lane.split(" - ");
      if (parts.length === 2) {
        const originKey = Object.keys(laneCoords).find((k) => parts[0].includes(k));
        const destKey = Object.keys(laneCoords).find((k) => parts[1].includes(k));
        if (originKey && destKey) {
          const o = laneCoords[originKey];
          const d = laneCoords[destKey];
          if (!serviceMarkers.find((m) => m.lat === o.lat && m.lng === o.lng)) {
            serviceMarkers.push({ lat: o.lat, lng: o.lng, label: originKey, color: "#059669", info: `Service area: ${originKey}` });
          }
          if (!serviceMarkers.find((m) => m.lat === d.lat && m.lng === d.lng)) {
            serviceMarkers.push({ lat: d.lat, lng: d.lng, label: destKey, color: "#059669", info: `Service area: ${destKey}` });
          }

          // Try to find a matching land route for realistic waypoints
          const landRoute = findLandRouteForLane(originKey, destKey);
          if (landRoute && landRoute.waypoints.length > 0) {
            serviceRoutes.push({
              origin: o,
              destination: d,
              waypoints: landRoute.waypoints.map((wp) => ({ lat: wp.lat, lng: wp.lng })),
              color: "#3b82f680",
              useDirections: true,
            });
          } else {
            serviceRoutes.push({ origin: o, destination: d, color: "#3b82f680", useDirections: true });
          }
        }
      }
    });

    // Vehicle specs for fleet
    const vehicleSpecs = carrier.vehicleTypes.map((vt) => ({
      type: vt,
      spec: findVehicleSpec(vt),
    })).filter((v) => v.spec !== null) as { type: string; spec: typeof VEHICLE_SPECS[0] }[];

    // Primary vehicle (first one with a spec)
    const primaryVehicle = vehicleSpecs.length > 0 ? vehicleSpecs[0] : null;

    return { serviceMarkers, serviceRoutes, vehicleSpecs, primaryVehicle };
  }, [carrier]);

  // Fleet statistics
  const fleetStats = useMemo(() => {
    if (!carrier) return { available: 0, on_trip: 0, maintenance: 0, inactive: 0, total: 0 };
    const stats = { available: 0, on_trip: 0, maintenance: 0, inactive: 0, total: carrier.fleet.length };
    carrier.fleet.forEach((v) => {
      if (v.status === "available") stats.available++;
      else if (v.status === "on_trip") stats.on_trip++;
      else if (v.status === "maintenance") stats.maintenance++;
      else stats.inactive++;
    });
    return stats;
  }, [carrier]);

  // Vehicle type breakdown
  const typeBreakdown = useMemo(() => {
    if (!carrier) return [];
    const map = new Map<string, number>();
    carrier.fleet.forEach((v) => {
      map.set(v.type, (map.get(v.type) || 0) + 1);
    });
    return Array.from(map.entries()).map(([type, count]) => ({ type, count })).sort((a, b) => b.count - a.count);
  }, [carrier]);

  // Filtered fleet
  const filteredFleet = useMemo(() => {
    if (!carrier) return [];
    if (fleetFilter === "All") return carrier.fleet;
    const statusMap: Record<string, string> = { "Available": "available", "On Trip": "on_trip", "Maintenance": "maintenance" };
    const status = statusMap[fleetFilter];
    return carrier.fleet.filter((v) => v.status === status);
  }, [carrier, fleetFilter]);

  // Showcase vehicle spec (for dropdown switching)
  const showcaseSpec = useMemo(() => {
    if (!routeData) return null;
    if (showcaseVehicleType) {
      const found = routeData.vehicleSpecs.find((v) => v.type === showcaseVehicleType);
      return found || routeData.primaryVehicle;
    }
    return routeData.primaryVehicle;
  }, [routeData, showcaseVehicleType]);

  if (!carrier) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
        <Navbar active="Carriers" />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "calc(100vh - 56px)" }}>
          <div style={{ textAlign: "center" }}>
            <Truck size={48} color="#9CA3AF" />
            <h1 style={{ fontSize: 24, fontWeight: 700, color: "#111827", marginTop: 16 }}>Carrier not found</h1>
            <p style={{ color: "#6B7280", marginBottom: 24 }}>The carrier &quot;{id}&quot; does not exist.</p>
            <a href="/carriers" style={{ color: "#2563EB", textDecoration: "none", fontWeight: 500 }}>Back to Carrier Directory</a>
          </div>
        </div>
      </div>
    );
  }

  const linkedCompany = companies.find((c) => c.carrierId === carrier.id);
  const onTimeRate = Math.round(85 + carrier.rating * 2);
  const acceptanceRate = Math.round(70 + carrier.rating * 4);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      <Navbar active="Carriers" />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 24px 64px" }}>
        <a href="/carriers" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#6B7280", fontSize: 13, textDecoration: "none", marginBottom: 16 }}>
          <ArrowLeft size={14} /> Back to Carrier Directory
        </a>

        {/* Header Card */}
        <div style={{
          backgroundColor: "#ffffff", borderRadius: 12, border: "1px solid #e2e8f0",
          padding: 24, marginBottom: 20,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{
              width: 64, height: 64, borderRadius: 14,
              background: "linear-gradient(135deg, #1e293b, #334155)",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <Truck size={32} color="#94a3b8" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <h1 style={{ fontSize: 24, fontWeight: 700, color: "#0f172a", margin: 0 }}>{carrier.name}</h1>
                {carrier.verified && (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 10px", borderRadius: 9999, fontSize: 11, fontWeight: 600, color: "#2563EB", backgroundColor: "#EFF6FF" }}>
                    <CheckCircle size={12} /> Verified
                  </span>
                )}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#6B7280", fontSize: 13, marginBottom: 6 }}>
                <MapPin size={14} /> {carrier.location.city}, {carrier.location.region}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <StarRating rating={carrier.rating} size={16} />
                <span style={{ fontSize: 13, color: "#9CA3AF", marginLeft: 4 }}>({carrier.completedTrips} trips)</span>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, maxWidth: 300 }}>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
                {carrier.specializations.map((sp) => (
                  <span key={sp} style={{ padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600, color: "#374151", background: "#f1f5f9" }}>{sp}</span>
                ))}
              </div>
              {linkedCompany && (
                <a href={`/company/${linkedCompany.slug}`} style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                  color: "#2563EB", backgroundColor: "#EFF6FF", border: "1px solid #BFDBFE",
                  textDecoration: "none",
                }}>
                  <Briefcase size={13} /> View Company Profile
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
          {[
            { label: "Fleet Size", value: `${carrier.vehicleCount} trucks`, icon: Truck, color: "#2563EB", bg: "#EFF6FF" },
            { label: "Completed Trips", value: carrier.completedTrips.toLocaleString(), icon: Award, color: "#059669", bg: "#ECFDF5" },
            { label: "On-Time Rate", value: `${onTimeRate}%`, icon: Route, color: "#d97706", bg: "#FFFBEB" },
            { label: "Acceptance", value: `${acceptanceRate}%`, icon: CheckCircle, color: "#7c3aed", bg: "#f5f3ff" },
          ].map((stat) => (
            <div key={stat.label} style={{
              backgroundColor: "#ffffff", borderRadius: 10, border: "1px solid #e2e8f0",
              padding: "16px 20px", display: "flex", alignItems: "center", gap: 12,
            }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: stat.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <stat.icon size={20} color={stat.color} />
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#0f172a" }}>{stat.value}</div>
                <div style={{ fontSize: 12, color: "#6B7280" }}>{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ═══════════════════════ FLEET INVENTORY SECTION ═══════════════════════ */}
        <div style={{ backgroundColor: "#ffffff", borderRadius: 12, border: "1px solid #e2e8f0", padding: 20, marginBottom: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", margin: "0 0 16px", display: "flex", alignItems: "center", gap: 8 }}>
            <Truck size={18} color="#2563EB" /> Fleet Inventory
            <span style={{ fontSize: 12, fontWeight: 500, color: "#6B7280", marginLeft: 4 }}>({carrier.fleet.length} vehicles)</span>
          </h3>

          {/* Fleet Summary Bar */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", height: 32, borderRadius: 8, overflow: "hidden", marginBottom: 8 }}>
              {fleetStats.available > 0 && (
                <div style={{ flex: fleetStats.available, backgroundColor: "#059669", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 11, fontWeight: 700, minWidth: 32 }}>
                  {fleetStats.available}
                </div>
              )}
              {fleetStats.on_trip > 0 && (
                <div style={{ flex: fleetStats.on_trip, backgroundColor: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 11, fontWeight: 700, minWidth: 32 }}>
                  {fleetStats.on_trip}
                </div>
              )}
              {fleetStats.maintenance > 0 && (
                <div style={{ flex: fleetStats.maintenance, backgroundColor: "#D97706", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 11, fontWeight: 700, minWidth: 32 }}>
                  {fleetStats.maintenance}
                </div>
              )}
              {fleetStats.inactive > 0 && (
                <div style={{ flex: fleetStats.inactive, backgroundColor: "#9CA3AF", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 11, fontWeight: 700, minWidth: 32 }}>
                  {fleetStats.inactive}
                </div>
              )}
            </div>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              {[
                { label: "Available", count: fleetStats.available, color: "#059669" },
                { label: "On Trip", count: fleetStats.on_trip, color: "#2563EB" },
                { label: "Maintenance", count: fleetStats.maintenance, color: "#D97706" },
                { label: "Inactive", count: fleetStats.inactive, color: "#9CA3AF" },
              ].map((s) => (
                <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: s.color }} />
                  <span style={{ color: "#374151", fontWeight: 500 }}>{s.label}</span>
                  <span style={{ color: "#6B7280" }}>({s.count})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Vehicle Type Breakdown */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#6B7280", marginBottom: 8 }}>Vehicle Type Breakdown</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {typeBreakdown.map((tb) => (
                <div key={tb.type} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 12, color: "#374151", fontWeight: 500, minWidth: 180 }}>{tb.type}</span>
                  <div style={{ flex: 1, height: 16, backgroundColor: "#f1f5f9", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{
                      width: `${(tb.count / carrier.fleet.length) * 100}%`,
                      height: "100%",
                      backgroundColor: "#3b82f6",
                      borderRadius: 4,
                      minWidth: 20,
                      display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 6,
                    }}>
                      <span style={{ fontSize: 10, color: "#fff", fontWeight: 700 }}>{tb.count}</span>
                    </div>
                  </div>
                  <span style={{ fontSize: 11, color: "#6B7280", minWidth: 60 }}>{tb.count} truck{tb.count > 1 ? "s" : ""}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Filter Tabs */}
          <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
            {fleetFilterTabs.map((tab) => {
              const isActive = fleetFilter === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setFleetFilter(tab)}
                  style={{
                    padding: "6px 16px", border: "1px solid #e2e8f0", borderRadius: 8,
                    cursor: "pointer", fontSize: 12, fontWeight: 600,
                    color: isActive ? "#fff" : "#6B7280",
                    backgroundColor: isActive
                      ? tab === "Available" ? "#059669"
                        : tab === "On Trip" ? "#2563EB"
                        : tab === "Maintenance" ? "#D97706"
                        : "#2563EB"
                      : "#fff",
                    transition: "all 0.15s",
                  }}
                >
                  {tab}
                  {tab !== "All" && (
                    <span style={{ marginLeft: 4, opacity: 0.8 }}>
                      ({tab === "Available" ? fleetStats.available : tab === "On Trip" ? fleetStats.on_trip : fleetStats.maintenance})
                    </span>
                  )}
                  {tab === "All" && (
                    <span style={{ marginLeft: 4, opacity: 0.8 }}>({carrier.fleet.length})</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Fleet Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {filteredFleet.map((vehicle) => {
              const st = statusColors[vehicle.status] || statusColors.inactive;
              return (
                <div key={vehicle.id} style={{
                  backgroundColor: "#f8fafc", borderRadius: 10, border: "1px solid #e5e7eb",
                  padding: 14, display: "flex", flexDirection: "column", gap: 8,
                  transition: "box-shadow 0.15s",
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; }}
                >
                  {/* Top row: image + plate */}
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <img
                      src={vehicle.image}
                      alt={vehicle.type}
                      width={80}
                      height={48}
                      style={{ objectFit: "contain", flexShrink: 0 }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", letterSpacing: 1, fontFamily: "monospace" }}>
                        {vehicle.plateNo}
                      </div>
                      <div style={{ fontSize: 12, color: "#6B7280" }}>
                        {vehicle.make} &middot; {vehicle.yearModel}
                      </div>
                    </div>
                  </div>

                  {/* Type name */}
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{vehicle.type}</div>

                  {/* Capacity */}
                  <div style={{ fontSize: 12, color: "#6B7280" }}>
                    Capacity: {vehicle.capacity.kg.toLocaleString()} kg / {vehicle.capacity.cbm} CBM
                  </div>

                  {/* Badges row */}
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                    {/* Status badge */}
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: 4,
                      padding: "3px 10px", borderRadius: 9999,
                      fontSize: 11, fontWeight: 600,
                      color: st.color, backgroundColor: st.bg,
                    }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: st.color }} />
                      {st.label}
                    </span>

                    {/* Reefer badge */}
                    {vehicle.reefer && (
                      <span style={{
                        padding: "3px 10px", borderRadius: 9999,
                        fontSize: 11, fontWeight: 600,
                        color: "#0891B2", backgroundColor: "#ECFEFF",
                      }}>
                        Reefer
                      </span>
                    )}

                    {/* GPS indicator */}
                    {vehicle.gpsEnabled && (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, color: "#059669" }}>
                        <span style={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: "#059669", boxShadow: "0 0 4px #059669" }} />
                        GPS
                      </span>
                    )}
                  </div>

                  {/* Driver */}
                  {vehicle.driver && (
                    <div style={{ fontSize: 12, color: "#6B7280", display: "flex", alignItems: "center", gap: 4 }}>
                      <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      {vehicle.driver}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {filteredFleet.length === 0 && (
            <div style={{ textAlign: "center", padding: "32px 0", color: "#9CA3AF", fontSize: 13 }}>
              No vehicles match the selected filter.
            </div>
          )}
        </div>

        {/* Two columns */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
          {/* Service Areas Map */}
          <div style={{ backgroundColor: "#ffffff", borderRadius: 12, border: "1px solid #e2e8f0", padding: 16 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", margin: "0 0 12px", display: "flex", alignItems: "center", gap: 6 }}>
              <MapPin size={14} color="#2563eb" /> Service Areas
            </h3>
            <MapView
              markers={routeData?.serviceMarkers || []}
              routes={routeData?.serviceRoutes || []}
              height={260}
            />
          </div>

          {/* Fleet Breakdown with SVG icons */}
          <div style={{ backgroundColor: "#ffffff", borderRadius: 12, border: "1px solid #e2e8f0", padding: 16 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", margin: "0 0 12px" }}>Fleet Breakdown</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {carrier.vehicleTypes.map((vt) => {
                const spec = routeData?.vehicleSpecs.find((v) => v.type === vt);
                return (
                  <div key={vt} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", backgroundColor: "#f8fafc", borderRadius: 8, border: "1px solid #f1f5f9" }}>
                    {spec?.spec?.image ? (
                      <img
                        src={spec.spec.image}
                        alt={vt}
                        width={48}
                        height={28}
                        style={{ objectFit: "contain" }}
                      />
                    ) : (
                      <Truck size={16} color="#2563EB" />
                    )}
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: 13, color: "#374151", fontWeight: 500, display: "block" }}>{vt}</span>
                      {spec?.spec && (
                        <span style={{ fontSize: 11, color: "#9CA3AF" }}>
                          {spec.spec.localName} | {(spec.spec.maxPayloadKg / 1000).toFixed(0)}T max | {spec.spec.maxVolumeCbm} CBM
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <h3 style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", margin: "20px 0 12px" }}>Service Lanes</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {carrier.lanes.map((lane) => {
                const parts = lane.split(" - ");
                const originKey = parts.length === 2 ? Object.keys(laneCoords).find((k) => parts[0].includes(k)) : null;
                const destKey = parts.length === 2 ? Object.keys(laneCoords).find((k) => parts[1].includes(k)) : null;
                const landRoute = originKey && destKey ? findLandRouteForLane(originKey, destKey) : null;
                return (
                  <div key={lane} style={{ padding: "10px 14px", backgroundColor: "#f8fafc", borderRadius: 8, border: "1px solid #f1f5f9" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Route size={16} color="#059669" />
                      <span style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>{lane}</span>
                    </div>
                    {landRoute && (
                      <div style={{ marginTop: 6, marginLeft: 26, display: "flex", gap: 12, fontSize: 11, color: "#6B7280" }}>
                        <span>{landRoute.distanceKm} km</span>
                        <span>{landRoute.durationHours}h drive</span>
                        {landRoute.tollways && <span>via {landRoute.tollways.join(", ")}</span>}
                        <span style={{ textTransform: "capitalize" }}>{landRoute.terrain} terrain</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 3D Vehicle Showcase */}
        {showcaseSpec && (
          <div style={{ backgroundColor: "#ffffff", borderRadius: 12, border: "1px solid #e2e8f0", padding: 20, marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", margin: 0, display: "flex", alignItems: "center", gap: 6 }}>
                <Box size={14} color="#7c3aed" /> Fleet Capacity
              </h3>
              {/* Vehicle type dropdown */}
              {routeData && routeData.vehicleSpecs.length > 1 && (
                <select
                  value={showcaseVehicleType || (routeData.primaryVehicle?.type || "")}
                  onChange={(e) => setShowcaseVehicleType(e.target.value)}
                  style={{
                    padding: "5px 10px", border: "1px solid #e2e8f0", borderRadius: 8,
                    fontSize: 12, color: "#374151", backgroundColor: "#f8fafc",
                    cursor: "pointer", outline: "none", fontWeight: 500,
                  }}
                >
                  {routeData.vehicleSpecs.map((v) => (
                    <option key={v.type} value={v.type}>{v.type}</option>
                  ))}
                </select>
              )}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, alignItems: "start" }}>
              <div style={{ height: 350, borderRadius: 12, overflow: "hidden" }}>
                <VehicleShowcaseWrapper
                  vehicleType={showcaseSpec.spec.type}
                  lengthM={showcaseSpec.spec.lengthM}
                  widthM={showcaseSpec.spec.widthM}
                  heightM={showcaseSpec.spec.heightM}
                  maxPayloadKg={showcaseSpec.spec.maxPayloadKg}
                  maxVolumeCbm={showcaseSpec.spec.maxVolumeCbm}
                  color={showcaseSpec.spec.color}
                  isReefer={showcaseSpec.spec.type.toLowerCase().includes("reefer")}
                  showDimensions
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>
                  {showcaseSpec.spec.type}
                </div>
                <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 8 }}>
                  a.k.a. &quot;{showcaseSpec.spec.localName}&quot; | {showcaseSpec.spec.make[0]}
                </div>
                {[
                  { label: "Max Payload", value: `${(showcaseSpec.spec.maxPayloadKg / 1000).toFixed(0)} tons` },
                  { label: "Max Volume", value: `${showcaseSpec.spec.maxVolumeCbm} CBM` },
                  { label: "Dimensions (LxWxH)", value: `${showcaseSpec.spec.lengthFt}' x ${showcaseSpec.spec.widthFt}' x ${showcaseSpec.spec.heightFt}'` },
                  { label: "GVW", value: `${(showcaseSpec.spec.grossVehicleWeight / 1000).toFixed(0)} tons` },
                  { label: "Axles", value: showcaseSpec.spec.axles.toString() },
                  { label: "Fuel Economy", value: showcaseSpec.spec.avgFuelConsumption },
                ].map((row) => (
                  <div key={row.label} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #f1f5f9" }}>
                    <span style={{ fontSize: 13, color: "#6B7280" }}>{row.label}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{row.value}</span>
                  </div>
                ))}
                {/* All vehicle types in fleet */}
                <div style={{ marginTop: 8 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#6B7280", marginBottom: 6 }}>Full Fleet</div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {routeData?.vehicleSpecs.map((v) => (
                      <div
                        key={v.type}
                        onClick={() => setShowcaseVehicleType(v.type)}
                        style={{
                          display: "flex", alignItems: "center", gap: 4,
                          padding: "4px 8px", borderRadius: 6,
                          background: (showcaseVehicleType || routeData.primaryVehicle?.type) === v.type ? "#DBEAFE" : "#f1f5f9",
                          border: (showcaseVehicleType || routeData.primaryVehicle?.type) === v.type ? "1px solid #93C5FD" : "1px solid transparent",
                          fontSize: 11, cursor: "pointer",
                          transition: "all 0.15s",
                        }}
                      >
                        {v.spec.image && (
                          <img src={v.spec.image} alt={v.type} width={32} height={18} style={{ objectFit: "contain" }} />
                        )}
                        <span style={{ color: "#374151", fontWeight: 500 }}>{v.type}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Compliance & Contact */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
          <div style={{ backgroundColor: "#ffffff", borderRadius: 12, border: "1px solid #e2e8f0", padding: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", margin: "0 0 14px", display: "flex", alignItems: "center", gap: 6 }}>
              <Shield size={14} color="#7C3AED" /> Compliance & Insurance
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { label: "LTFRB License", value: carrier.ltfrb },
                { label: "DOTC Permit", value: carrier.dotcPermit ? "Active" : "Pending", color: carrier.dotcPermit ? "#059669" : "#DC2626" },
                { label: "Insurance", value: carrier.insurance },
              ].map((row) => (
                <div key={row.label} style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 13, color: "#6B7280" }}>{row.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: row.color || "#0f172a", fontFamily: row.label === "LTFRB License" ? "monospace" : "inherit" }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ backgroundColor: "#ffffff", borderRadius: 12, border: "1px solid #e2e8f0", padding: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", margin: "0 0 14px", display: "flex", alignItems: "center", gap: 6 }}>
              <Briefcase size={14} color="#2563EB" /> Contact
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { label: "Contact Person", value: carrier.contactPerson },
                { label: "Phone", value: carrier.phone },
                { label: "Base Rate", value: `\u20B1${carrier.baseRate}/km` },
              ].map((row) => (
                <div key={row.label} style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 13, color: "#6B7280" }}>{row.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div style={{ backgroundColor: "#ffffff", borderRadius: 12, border: "1px solid #e2e8f0", padding: 20, marginBottom: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", margin: "0 0 14px", display: "flex", alignItems: "center", gap: 6 }}>
            <Star size={14} color="#f59e0b" /> Reviews
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {mockReviews.map((review, i) => (
              <div key={i} style={{ padding: "14px 16px", backgroundColor: "#f8fafc", borderRadius: 8, border: "1px solid #f1f5f9" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{review.name}</span>
                    <StarRating rating={review.rating} size={11} showValue={false} />
                  </div>
                  <span style={{ fontSize: 11, color: "#94a3b8" }}>{review.date}</span>
                </div>
                <p style={{ fontSize: 13, color: "#64748b", margin: 0, lineHeight: 1.5 }}>{review.comment}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Action */}
        <button
          onClick={() => alert("Sign in required to request a quote")}
          style={{
            width: "100%", padding: "14px 24px", border: "none", borderRadius: 10,
            fontSize: 14, fontWeight: 600, color: "#ffffff", backgroundColor: "#2563eb",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}
        >
          <MessageSquare size={16} /> Request Quote
        </button>
      </div>
    </div>
  );
}
