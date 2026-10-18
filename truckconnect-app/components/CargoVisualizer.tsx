"use client";

import dynamic from "next/dynamic";

const LoadVisualizer = dynamic(
  () =>
    import("@/components/three/LoadVisualizer").then((m) => ({
      default: m.LoadVisualizer,
    })),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          height: 320,
          background: "radial-gradient(ellipse at center, #1e293b 0%, #0f172a 100%)",
          borderRadius: 12,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            border: "2px solid #334155",
            borderTopColor: "#34d399",
            borderRadius: "50%",
            animation: "cargo-spin 0.8s linear infinite",
          }}
        />
        <span style={{ fontSize: 13, color: "#64748b" }}>Building 3D scene...</span>
        <style>{`@keyframes cargo-spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    ),
  }
);

// Vehicle type mapping from the old display names to visualizer keys
const VEHICLE_MAP: Record<string, string> = {
  "4-Wheeler Closed Van": "CLOSED_VAN_4W",
  "4-Wheeler Reefer Van": "CLOSED_VAN_4W",
  "6-Wheeler Closed Van": "CLOSED_VAN_6W",
  "6-Wheeler Reefer Van": "CLOSED_VAN_6W",
  "10-Wheeler Wing Van": "WING_VAN_10W",
  "10-Wheeler Reefer Van": "WING_VAN_10W",
  "10-Wheeler Tanker": "WING_VAN_10W",
  "Flatbed Trailer": "TRAILER_40FT",
  "Container Truck": "TRAILER_40FT",
};

interface CargoVisualizerProps {
  length: number;
  width: number;
  height: number;
  weight: number;
  vehicleType?: string;
  style?: React.CSSProperties;
}

export default function CargoVisualizer({
  weight,
  vehicleType = "10-Wheeler Wing Van",
  style: containerStyle,
}: CargoVisualizerProps) {
  const truckType = VEHICLE_MAP[vehicleType] || "CLOSED_VAN_6W";
  const weightTons = Math.round((weight / 1000) * 10) / 10;

  return (
    <div style={containerStyle}>
      <LoadVisualizer
        truckType={truckType}
        weightTons={weightTons}
        cargoType="general merchandise"
        className=""
      />
    </div>
  );
}
