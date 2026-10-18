"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import type { DrawnRoute } from "./RouteDrawer";

const RouteDrawer = dynamic(() => import("./RouteDrawer"), { ssr: false });

interface MapMarker {
  lat: number;
  lng: number;
  label: string;
  color?: string;
  info?: string;
}

interface MapRoute {
  origin: { lat: number; lng: number };
  destination: { lat: number; lng: number };
  waypoints?: { lat: number; lng: number }[];
  color?: string;
  dashed?: boolean;
  useDirections?: boolean; // Use Google Directions API for actual road path
}

interface MapRegion {
  center: { lat: number; lng: number };
  radius: number;
  color?: string;
  label?: string;
}

interface MapViewProps {
  markers?: MapMarker[];
  routes?: MapRoute[];
  regions?: MapRegion[];
  center?: { lat: number; lng: number };
  zoom?: number;
  height?: number | string;
  style?: React.CSSProperties;
  /** When true, shows the route drawing toolbar powered by terra-draw */
  enableDrawing?: boolean;
  /** Called when user clicks Done/Save with drawn routes */
  onDrawingSave?: (routes: DrawnRoute[]) => void;
}

const DARK_MAP_STYLES = [
  { elementType: "geometry", stylers: [{ color: "#0f172a" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0f172a" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#64748b" }] },
  { featureType: "administrative", elementType: "geometry.stroke", stylers: [{ color: "#1e293b" }] },
  { featureType: "administrative.land_parcel", elementType: "labels.text.fill", stylers: [{ color: "#475569" }] },
  { featureType: "poi", elementType: "geometry", stylers: [{ color: "#1e293b" }] },
  { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#64748b" }] },
  { featureType: "poi.park", elementType: "geometry.fill", stylers: [{ color: "#1a2e1a" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#1e293b" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#0f172a" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#334155" }] },
  { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#1e293b" }] },
  { featureType: "transit", elementType: "geometry", stylers: [{ color: "#1e293b" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#0c1426" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#334155" }] },
];

const PH_CENTER = { lat: 12.0, lng: 122.5 };
const PH_ZOOM = 6;

/**
 * Catmull-Rom spline interpolation for smooth sea/ferry route curves.
 * Takes a set of waypoints and returns a densely interpolated path.
 */
function interpolateSeaRoute(
  points: { lat: number; lng: number }[]
): { lat: number; lng: number }[] {
  if (points.length < 2) return points;
  const result: { lat: number; lng: number }[] = [];

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = i > 0 ? points[i - 1] : points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = i < points.length - 2 ? points[i + 2] : p2;

    // Catmull-Rom spline interpolation for smooth curves
    for (let t = 0; t <= 1; t += 0.05) {
      const t2 = t * t;
      const t3 = t2 * t;
      const lat =
        0.5 *
        (2 * p1.lat +
          (-p0.lat + p2.lat) * t +
          (2 * p0.lat - 5 * p1.lat + 4 * p2.lat - p3.lat) * t2 +
          (-p0.lat + 3 * p1.lat - 3 * p2.lat + p3.lat) * t3);
      const lng =
        0.5 *
        (2 * p1.lng +
          (-p0.lng + p2.lng) * t +
          (2 * p0.lng - 5 * p1.lng + 4 * p2.lng - p3.lng) * t2 +
          (-p0.lng + 3 * p1.lng - 3 * p2.lng + p3.lng) * t3);
      result.push({ lat, lng });
    }
  }

  result.push(points[points.length - 1]);
  return result;
}

export default function MapView({
  markers = [],
  routes = [],
  regions = [],
  center = PH_CENTER,
  zoom = PH_ZOOM,
  height = 400,
  style,
  enableDrawing = false,
  onDrawingSave,
}: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const overlaysRef = useRef<{
    markers: google.maps.Marker[];
    polylines: google.maps.Polyline[];
    circles: google.maps.Circle[];
    directionsRenderers: google.maps.DirectionsRenderer[];
  }>({ markers: [], polylines: [], circles: [], directionsRenderers: [] });
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const mapInitializedRef = useRef(false);
  const [drawingActive, setDrawingActive] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  // Cache for DirectionsService results to avoid repeated API calls
  const directionsCacheRef = useRef<
    Map<string, google.maps.DirectionsResult>
  >(new Map());

  // ── Step 1: Load Google Maps script (once) ──
  useEffect(() => {
    if (typeof window === "undefined") return;
    if ((window as any).google?.maps) {
      setLoaded(true);
      return;
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      setError(true);
      return;
    }

    const existing = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existing) {
      if ((window as any).google?.maps) {
        setLoaded(true);
      } else {
        existing.addEventListener("load", () => setLoaded(true));
        existing.addEventListener("error", () => setError(true));
      }
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry,routes`;
    script.async = true;
    script.defer = true;
    script.onload = () => setLoaded(true);
    script.onerror = () => setError(true);
    document.head.appendChild(script);
  }, []);

  // ── Step 2: Initialize map (once, never recreated) ──
  useEffect(() => {
    if (!loaded || !mapRef.current || error || mapInitializedRef.current) return;
    if (!(window as any).google?.maps) return;

    const map = new google.maps.Map(mapRef.current, {
      center,
      zoom,
      styles: DARK_MAP_STYLES,
      disableDefaultUI: true,
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    });

    mapInstanceRef.current = map;
    mapInitializedRef.current = true;
    setMapReady(true);
  }, [loaded, error]); // Only depends on loaded/error — NOT markers/routes

  // ── Helper: clear all overlays ──
  const clearOverlays = useCallback(() => {
    const ov = overlaysRef.current;
    ov.markers.forEach((m) => m.setMap(null));
    ov.polylines.forEach((p) => p.setMap(null));
    ov.circles.forEach((c) => c.setMap(null));
    ov.directionsRenderers.forEach((dr) => dr.setMap(null));
    ov.markers = [];
    ov.polylines = [];
    ov.circles = [];
    ov.directionsRenderers = [];
  }, []);

  // ── Helper: build cache key for a route ──
  const buildCacheKey = useCallback((r: MapRoute): string => {
    const wpKey = (r.waypoints || [])
      .map((wp) => `${wp.lat.toFixed(5)},${wp.lng.toFixed(5)}`)
      .join("|");
    return `${r.origin.lat.toFixed(5)},${r.origin.lng.toFixed(5)}->${r.destination.lat.toFixed(5)},${r.destination.lng.toFixed(5)}::${wpKey}`;
  }, []);

  // ── Helper: render a road route using DirectionsService ──
  const renderDirectionsRoute = useCallback(
    (map: google.maps.Map, r: MapRoute, ov: typeof overlaysRef.current) => {
      const cacheKey = buildCacheKey(r);
      const cached = directionsCacheRef.current.get(cacheKey);

      const renderer = new google.maps.DirectionsRenderer({
        map,
        suppressMarkers: true, // We render our own markers
        suppressInfoWindows: true,
        polylineOptions: {
          strokeColor: r.color || "#3b82f6",
          strokeOpacity: 0.85,
          strokeWeight: 4,
        },
      });
      ov.directionsRenderers.push(renderer);

      const applyFallback = () => {
        // Remove the unused renderer
        renderer.setMap(null);
        // Fallback to straight polyline
        const path =
          r.waypoints && r.waypoints.length > 0
            ? [r.origin, ...r.waypoints, r.destination]
            : [r.origin, r.destination];
        const polyline = new google.maps.Polyline({
          path,
          geodesic: true,
          strokeColor: r.color || "#3b82f6",
          strokeOpacity: 0.8,
          strokeWeight: 3,
          map,
        });
        ov.polylines.push(polyline);
      };

      if (cached) {
        renderer.setDirections(cached);
        return;
      }

      const directionsService = new google.maps.DirectionsService();

      // Build waypoints for Directions API (max 8 waypoints for free tier)
      const dirWaypoints = (r.waypoints || []).slice(0, 8).map((wp) => ({
        location: new google.maps.LatLng(wp.lat, wp.lng),
        stopover: false,
      }));

      directionsService.route(
        {
          origin: r.origin,
          destination: r.destination,
          waypoints: dirWaypoints,
          travelMode: google.maps.TravelMode.DRIVING,
          optimizeWaypoints: false,
        },
        (result, status) => {
          if (status === "OK" && result) {
            directionsCacheRef.current.set(cacheKey, result);
            renderer.setDirections(result);
          } else {
            applyFallback();
          }
        }
      );
    },
    [buildCacheKey]
  );

  // ── Helper: render a sea/ferry route with smooth curves ──
  const renderSeaRoute = useCallback(
    (map: google.maps.Map, r: MapRoute, ov: typeof overlaysRef.current) => {
      const rawPoints =
        r.waypoints && r.waypoints.length > 0
          ? [r.origin, ...r.waypoints, r.destination]
          : [r.origin, r.destination];

      // Interpolate for a smooth curved path
      const smoothPath = interpolateSeaRoute(rawPoints);

      const polyline = new google.maps.Polyline({
        path: smoothPath,
        geodesic: true,
        strokeColor: r.color || "#06b6d4",
        strokeOpacity: 0,
        strokeWeight: 3,
        map,
        icons: [
          {
            icon: {
              path: "M 0,-1 0,1",
              strokeOpacity: 0.8,
              strokeWeight: 3,
              scale: 3,
            },
            offset: "0",
            repeat: "16px",
          },
        ],
      });
      ov.polylines.push(polyline);
    },
    []
  );

  // ── Helper: render a standard straight polyline route ──
  const renderStraightRoute = useCallback(
    (map: google.maps.Map, r: MapRoute, ov: typeof overlaysRef.current) => {
      const path =
        r.waypoints && r.waypoints.length > 0
          ? [r.origin, ...r.waypoints, r.destination]
          : [r.origin, r.destination];
      const polyline = new google.maps.Polyline({
        path,
        geodesic: true,
        strokeColor: r.color || "#3b82f6",
        strokeOpacity: 0.8,
        strokeWeight: 3,
        map,
      });
      ov.polylines.push(polyline);
    },
    []
  );

  // ── Step 3: Update overlays when markers/routes/regions change ──
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear previous overlays
    clearOverlays();
    const ov = overlaysRef.current;

    // Add markers
    markers.forEach((m) => {
      const markerColor = m.color || "#2563eb";
      const marker = new google.maps.Marker({
        position: { lat: m.lat, lng: m.lng },
        map,
        title: m.label,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: markerColor,
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 2,
          scale: 8,
        },
        animation: google.maps.Animation.DROP,
      });

      if (m.info) {
        const infoWindow = new google.maps.InfoWindow({
          content: `<div style="font-family:system-ui;padding:4px 0;min-width:160px;">
            <div style="font-weight:700;font-size:14px;color:#0f172a;margin-bottom:4px;">${m.label}</div>
            <div style="font-size:12px;color:#64748b;">${m.info}</div>
          </div>`,
        });
        marker.addListener("click", () => infoWindow.open(map, marker));
      }

      ov.markers.push(marker);
    });

    // Add routes — choose rendering strategy per route
    routes.forEach((r) => {
      if (r.useDirections) {
        // Road route: use Google Directions API for actual road path
        renderDirectionsRoute(map, r, ov);
      } else if (r.dashed) {
        // Sea/ferry route: smooth curved dashed polyline
        renderSeaRoute(map, r, ov);
      } else {
        // Standard straight polyline
        renderStraightRoute(map, r, ov);
      }
    });

    // Add regions (circles)
    regions.forEach((reg) => {
      const circle = new google.maps.Circle({
        center: reg.center,
        radius: reg.radius,
        fillColor: reg.color || "#2563eb",
        fillOpacity: 0.15,
        strokeColor: reg.color || "#2563eb",
        strokeOpacity: 0.4,
        strokeWeight: 2,
        map,
      });
      ov.circles.push(circle);

      if (reg.label) {
        const labelMarker = new google.maps.Marker({
          position: reg.center,
          map,
          label: {
            text: reg.label,
            color: "#e2e8f0",
            fontSize: "11px",
            fontWeight: "600",
          },
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: "transparent",
            fillOpacity: 0,
            strokeWeight: 0,
            scale: 0,
          },
        });
        ov.markers.push(labelMarker);
      }
    });

    // Smooth pan/zoom to content
    if (markers.length > 1 || routes.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      markers.forEach((m) => bounds.extend({ lat: m.lat, lng: m.lng }));
      routes.forEach((r) => {
        bounds.extend(r.origin);
        bounds.extend(r.destination);
        r.waypoints?.forEach((wp) => bounds.extend(wp));
      });
      map.fitBounds(bounds, 60);
    } else if (markers.length === 1) {
      map.panTo({ lat: markers[0].lat, lng: markers[0].lng });
      map.setZoom(12);
    } else if (regions.length > 0) {
      // Show PH overview with regions
      map.panTo(PH_CENTER);
      map.setZoom(PH_ZOOM);
    } else {
      // Nothing to show — smooth return to PH overview
      map.panTo(PH_CENTER);
      map.setZoom(PH_ZOOM);
    }
  }, [markers, routes, regions, clearOverlays, renderDirectionsRoute, renderSeaRoute, renderStraightRoute]);

  const handleDrawingSave = useCallback(
    (drawnRoutes: DrawnRoute[]) => {
      setDrawingActive(false);
      onDrawingSave?.(drawnRoutes);
    },
    [onDrawingSave]
  );

  if (error) {
    return (
      <div
        style={{
          height,
          background: "linear-gradient(135deg, #0f172a, #1e293b)",
          borderRadius: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 8,
          ...style,
        }}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        <span style={{ fontSize: 13, color: "#64748b" }}>Map unavailable</span>
      </div>
    );
  }

  if (!loaded) {
    return (
      <div
        style={{
          height,
          background: "linear-gradient(135deg, #0f172a, #1e293b)",
          borderRadius: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          ...style,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 20,
              height: 20,
              border: "2px solid #334155",
              borderTopColor: "#3b82f6",
              borderRadius: "50%",
              animation: "map-spin 0.8s linear infinite",
            }}
          />
          <span style={{ fontSize: 13, color: "#64748b" }}>Loading map...</span>
        </div>
        <style>{`@keyframes map-spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ position: "relative", height, width: "100%" }}>
      <div
        ref={mapRef}
        style={{
          height: "100%",
          width: "100%",
          borderRadius: 12,
          overflow: "hidden",
          ...style,
        }}
      />

      {/* Draw Route button — shown when enableDrawing is true but drawing is not active */}
      {enableDrawing && !drawingActive && mapReady && (
        <button
          type="button"
          onClick={() => setDrawingActive(true)}
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 14px",
            fontSize: 13,
            fontWeight: 500,
            borderRadius: 8,
            border: "1px solid rgba(52,211,153,0.3)",
            backgroundColor: "rgba(15, 23, 42, 0.92)",
            color: "#6ee7b7",
            cursor: "pointer",
            backdropFilter: "blur(8px)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            zIndex: 10,
            transition: "all 0.15s",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 19l7-7 3 3-7 7-3-3z" />
            <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
            <path d="M2 2l7.586 7.586" />
            <circle cx="11" cy="11" r="2" />
          </svg>
          Draw Route
        </button>
      )}

      {/* Drawing toolbar — shown when drawing mode is active */}
      {enableDrawing && drawingActive && mapReady && mapInstanceRef.current && (
        <div
          style={{
            position: "absolute",
            top: 12,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10,
          }}
        >
          <RouteDrawer
            map={mapInstanceRef.current}
            onSave={handleDrawingSave}
          />
        </div>
      )}
    </div>
  );
}
