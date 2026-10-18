"use client";

import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";

const LoadVisualizerDemo = dynamic(
  () =>
    import("@/components/three/LoadVisualizerDemo").then((m) => ({
      default: m.LoadVisualizerDemo,
    })),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          height: 500,
          background: "#0f172a",
          borderRadius: 16,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            border: "2px solid #334155",
            borderTopColor: "#34d399",
            borderRadius: "50%",
            animation: "calc-spin 0.8s linear infinite",
          }}
        />
        <span style={{ fontSize: 13, color: "#64748b" }}>Loading Cargo Calculator...</span>
        <style>{`@keyframes calc-spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    ),
  }
);

export default function CargoCalculatorPage() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      <Navbar active="Cargo Calculator" />

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "24px 24px 64px" }}>
        {/* Header */}
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "#0f172a", margin: "0 0 6px" }}>
            Cargo Calculator
          </h1>
          <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>
            Plan your load with 3D bin-packing visualization. Add cargo items, choose truck types,
            and see exactly how everything fits.
          </p>
        </div>

        {/* Demo component */}
        <LoadVisualizerDemo />
      </div>
    </div>
  );
}
