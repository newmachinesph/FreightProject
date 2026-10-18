"use client"

import dynamic from "next/dynamic"
import type { VehicleShowcaseProps } from "./three/VehicleShowcase"

const VehicleShowcase = dynamic(() => import("./three/VehicleShowcase"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: "100%",
        height: "100%",
        minHeight: 350,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(15, 23, 42, 0.5)",
        borderRadius: "12px",
        color: "#94a3b8",
        fontFamily: "system-ui, sans-serif",
        fontSize: "14px",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            width: 32,
            height: 32,
            margin: "0 auto 12px",
            border: "3px solid #334155",
            borderTopColor: "#6366f1",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        Loading 3D model...
      </div>
    </div>
  ),
})

export default function VehicleShowcaseWrapper(props: VehicleShowcaseProps) {
  return <VehicleShowcase {...props} />
}
