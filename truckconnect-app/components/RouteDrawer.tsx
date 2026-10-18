"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  TerraDraw,
  TerraDrawLineStringMode,
  TerraDrawSelectMode,
  TerraDrawRenderMode,
} from "terra-draw";
import { TerraDrawGoogleMapsAdapter } from "terra-draw-google-maps-adapter";

export interface DrawnRoute {
  id: string;
  coordinates: [number, number][]; // [lng, lat] pairs
}

interface RouteDrawerProps {
  map: google.maps.Map;
  onSave?: (routes: DrawnRoute[]) => void;
  onModeChange?: (mode: string) => void;
}

type DrawMode = "linestring" | "select" | "render";

const TOOLBAR_STYLES = {
  wrapper: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "8px 12px",
    backgroundColor: "rgba(15, 23, 42, 0.92)",
    borderRadius: 10,
    border: "1px solid rgba(51, 65, 85, 0.6)",
    backdropFilter: "blur(8px)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
  } as React.CSSProperties,
  button: (isActive: boolean, color?: string) =>
    ({
      display: "flex",
      alignItems: "center",
      gap: 6,
      padding: "6px 12px",
      fontSize: 12,
      fontWeight: 500,
      borderRadius: 6,
      border: isActive
        ? `1px solid ${color || "rgba(52,211,153,0.4)"}`
        : "1px solid transparent",
      backgroundColor: isActive
        ? `${color || "rgba(52,211,153,0.15)"}`
        : "transparent",
      color: isActive ? "#e2e8f0" : "#94a3b8",
      cursor: "pointer",
      transition: "all 0.15s",
      minHeight: 32,
    }) as React.CSSProperties,
  separator: {
    width: 1,
    height: 20,
    backgroundColor: "rgba(51, 65, 85, 0.5)",
    margin: "0 2px",
  } as React.CSSProperties,
  label: {
    fontSize: 10,
    fontWeight: 600,
    color: "#64748b",
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
    marginRight: 4,
  } as React.CSSProperties,
};

// SVG icons for toolbar buttons
function PenIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 19l7-7 3 3-7 7-3-3z" />
      <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
      <path d="M2 2l7.586 7.586" />
      <circle cx="11" cy="11" r="2" />
    </svg>
  );
}

function PointerIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
      <path d="M13 13l6 6" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default function RouteDrawer({ map, onSave, onModeChange }: RouteDrawerProps) {
  const drawRef = useRef<TerraDraw | null>(null);
  const [activeMode, setActiveMode] = useState<DrawMode>("linestring");
  const [featureCount, setFeatureCount] = useState(0);

  // Initialize terra-draw
  useEffect(() => {
    if (!map || drawRef.current) return;

    const google = (window as any).google;
    if (!google?.maps) return;

    const draw = new TerraDraw({
      adapter: new TerraDrawGoogleMapsAdapter({
        map,
        lib: google.maps,
      }),
      modes: [
        new TerraDrawLineStringMode(),
        new TerraDrawSelectMode({
          flags: {
            linestring: {
              feature: {
                draggable: true,
              },
            },
          },
        }),
        new TerraDrawRenderMode({ modeName: "render", styles: {} }),
      ],
    });

    draw.start();
    draw.setMode("linestring");
    drawRef.current = draw;

    // Listen for changes to update feature count
    draw.on("change", () => {
      const snapshot = draw.getSnapshot();
      const lines = snapshot.filter(
        (f) => f.geometry.type === "LineString" && f.properties.mode !== "render"
      );
      setFeatureCount(lines.length);
    });

    return () => {
      try {
        draw.stop();
      } catch {
        // terra-draw may already be stopped
      }
      drawRef.current = null;
    };
  }, [map]);

  const setMode = useCallback(
    (mode: DrawMode) => {
      if (!drawRef.current) return;
      drawRef.current.setMode(mode);
      setActiveMode(mode);
      onModeChange?.(mode);
    },
    [onModeChange]
  );

  const clearAll = useCallback(() => {
    if (!drawRef.current) return;
    drawRef.current.clear();
    setFeatureCount(0);
  }, []);

  const handleSave = useCallback(() => {
    if (!drawRef.current) return;

    const snapshot = drawRef.current.getSnapshot();
    const routes: DrawnRoute[] = snapshot
      .filter(
        (f) => f.geometry.type === "LineString" && f.properties.mode !== "render"
      )
      .map((f) => ({
        id: String(f.id),
        coordinates: (f.geometry as { type: string; coordinates: [number, number][] }).coordinates,
      }));

    // Switch to render mode after saving
    drawRef.current.setMode("render");
    setActiveMode("render");
    onSave?.(routes);
  }, [onSave]);

  return (
    <div style={TOOLBAR_STYLES.wrapper}>
      <span style={TOOLBAR_STYLES.label}>Route Draw</span>

      <button
        type="button"
        onClick={() => setMode("linestring")}
        style={TOOLBAR_STYLES.button(activeMode === "linestring")}
        title="Draw Route — click points on the map to draw a route line"
      >
        <PenIcon />
        Draw Route
      </button>

      <button
        type="button"
        onClick={() => setMode("select")}
        style={TOOLBAR_STYLES.button(activeMode === "select")}
        title="Select & Edit — click a drawn route to select and drag it"
      >
        <PointerIcon />
        Select/Edit
      </button>

      <div style={TOOLBAR_STYLES.separator} />

      <button
        type="button"
        onClick={clearAll}
        style={TOOLBAR_STYLES.button(false, "rgba(239,68,68,0.15)")}
        title="Clear all drawn routes"
      >
        <TrashIcon />
        Clear All
      </button>

      <button
        type="button"
        onClick={handleSave}
        disabled={featureCount === 0}
        style={{
          ...TOOLBAR_STYLES.button(false, "rgba(52,211,153,0.15)"),
          opacity: featureCount === 0 ? 0.4 : 1,
          cursor: featureCount === 0 ? "default" : "pointer",
        }}
        title="Save drawn routes and finish editing"
      >
        <CheckIcon />
        Done/Save
        {featureCount > 0 && (
          <span
            style={{
              backgroundColor: "rgba(52,211,153,0.2)",
              color: "#6ee7b7",
              borderRadius: 9999,
              padding: "1px 6px",
              fontSize: 10,
              fontWeight: 600,
            }}
          >
            {featureCount}
          </span>
        )}
      </button>
    </div>
  );
}
