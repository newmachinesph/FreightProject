"use client"

import { Suspense, useMemo } from "react"
import { Canvas } from "@react-three/fiber"
import {
  OrbitControls,
  PerspectiveCamera,
  Html,
  Grid,
  ContactShadows,
} from "@react-three/drei"
import * as THREE from "three"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface VehicleShowcaseProps {
  vehicleType: string
  lengthM: number
  widthM: number
  heightM: number
  maxPayloadKg: number
  maxVolumeCbm: number
  color?: string
  isReefer?: boolean
  showDimensions?: boolean
  className?: string
}

// ---------------------------------------------------------------------------
// Color map by vehicle type (subtle wall tints)
// ---------------------------------------------------------------------------

const TYPE_COLORS: Record<string, string> = {
  closed_van: "#93a5cf",
  wing_van: "#8fa4d0",
  dry_van: "#93a5cf",
  reefer: "#7dd3e8",
  flatbed: "#9ca3af",
  tanker: "#b8c0cc",
  container: "#c87f7f",
}

function getWallColor(vehicleType: string, color?: string): string {
  if (color) return color
  const key = vehicleType.toLowerCase().replace(/[\s-]/g, "_")
  for (const [k, v] of Object.entries(TYPE_COLORS)) {
    if (key.includes(k)) return v
  }
  return "#93a5cf"
}

// ---------------------------------------------------------------------------
// Dimension lines with labels
// ---------------------------------------------------------------------------

function DimensionLabels({
  length,
  width,
  height,
}: {
  length: number
  width: number
  height: number
}) {
  const labelStyle: React.CSSProperties = {
    background: "rgba(15, 23, 42, 0.85)",
    color: "#e2e8f0",
    padding: "2px 8px",
    borderRadius: "4px",
    fontSize: "11px",
    fontFamily: "monospace",
    fontWeight: 600,
    whiteSpace: "nowrap",
    pointerEvents: "none",
    border: "1px solid rgba(148, 163, 184, 0.3)",
  }

  return (
    <group>
      {/* Length label (along X axis) */}
      <Html position={[0, -0.15, width / 2 + 0.5]} center>
        <div style={labelStyle}>L: {length.toFixed(1)}m</div>
      </Html>
      <mesh position={[0, 0.05, width / 2 + 0.3]}>
        <boxGeometry args={[length, 0.01, 0.01]} />
        <meshBasicMaterial color="#f59e0b" />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh key={`ll-${side}`} position={[side * (length / 2), 0.05, width / 2 + 0.3]}>
          <boxGeometry args={[0.01, 0.15, 0.01]} />
          <meshBasicMaterial color="#f59e0b" />
        </mesh>
      ))}

      {/* Width label (along Z axis) */}
      <Html position={[length / 2 + 0.5, -0.15, 0]} center>
        <div style={labelStyle}>W: {width.toFixed(1)}m</div>
      </Html>
      <mesh position={[length / 2 + 0.3, 0.05, 0]}>
        <boxGeometry args={[0.01, 0.01, width]} />
        <meshBasicMaterial color="#f59e0b" />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh key={`wl-${side}`} position={[length / 2 + 0.3, 0.05, side * (width / 2)]}>
          <boxGeometry args={[0.01, 0.15, 0.01]} />
          <meshBasicMaterial color="#f59e0b" />
        </mesh>
      ))}

      {/* Height label (along Y axis) */}
      <Html position={[-length / 2 - 0.5, height / 2, -width / 2 - 0.3]} center>
        <div style={labelStyle}>H: {height.toFixed(1)}m</div>
      </Html>
      <mesh position={[-length / 2 - 0.3, height / 2, -width / 2 - 0.2]}>
        <boxGeometry args={[0.01, height, 0.01]} />
        <meshBasicMaterial color="#f59e0b" />
      </mesh>
      {[0, 1].map((side) => (
        <mesh key={`hl-${side}`} position={[-length / 2 - 0.3, side * height, -width / 2 - 0.2]}>
          <boxGeometry args={[0.15, 0.01, 0.01]} />
          <meshBasicMaterial color="#f59e0b" />
        </mesh>
      ))}
    </group>
  )
}

// ---------------------------------------------------------------------------
// Info panel
// ---------------------------------------------------------------------------

function InfoPanel({
  vehicleType,
  maxPayloadKg,
  maxVolumeCbm,
  length,
  width,
  height,
  yPos,
}: {
  vehicleType: string
  maxPayloadKg: number
  maxVolumeCbm: number
  length: number
  width: number
  height: number
  yPos: number
}) {
  const payloadTons = (maxPayloadKg / 1000).toFixed(1)
  return (
    <Html position={[0, yPos + 0.8, 0]} center>
      <div
        style={{
          background: "rgba(15, 23, 42, 0.9)",
          color: "#e2e8f0",
          padding: "8px 14px",
          borderRadius: "8px",
          fontSize: "12px",
          fontFamily: "system-ui, sans-serif",
          pointerEvents: "none",
          border: "1px solid rgba(99, 102, 241, 0.4)",
          minWidth: "160px",
          textAlign: "center",
          lineHeight: 1.6,
        }}
      >
        <div style={{ fontWeight: 700, fontSize: "13px", marginBottom: 4, color: "#a5b4fc" }}>
          {vehicleType.replace(/_/g, " ")}
        </div>
        <div>{length.toFixed(1)} x {width.toFixed(1)} x {height.toFixed(1)} m</div>
        <div>Payload: <span style={{ color: "#34d399", fontWeight: 600 }}>{payloadTons}t</span></div>
        <div>Volume: <span style={{ color: "#38bdf8", fontWeight: 600 }}>{maxVolumeCbm.toFixed(1)} CBM</span></div>
      </div>
    </Html>
  )
}

// ---------------------------------------------------------------------------
// Cargo container shapes
// ---------------------------------------------------------------------------

/** Closed Van / Wing Van / Default: box with semi-transparent walls */
function BoxContainer({
  length,
  width,
  height,
  wallColor,
  isWingVan,
}: {
  length: number
  width: number
  height: number
  wallColor: string
  isWingVan?: boolean
}) {
  const wallThickness = 0.04
  const darkerColor = new THREE.Color(wallColor).offsetHSL(0, 0, -0.1).getStyle()

  return (
    <group>
      {/* Floor (solid) */}
      <mesh position={[0, 0, 0]} receiveShadow castShadow>
        <boxGeometry args={[length, wallThickness, width]} />
        <meshStandardMaterial color="#475569" roughness={0.7} />
      </mesh>

      {/* Front wall */}
      <mesh position={[-length / 2, height / 2, 0]}>
        <boxGeometry args={[wallThickness, height, width]} />
        <meshStandardMaterial color={wallColor} transparent opacity={0.3} roughness={0.3} />
      </mesh>

      {/* Rear wall */}
      <mesh position={[length / 2, height / 2, 0]}>
        <boxGeometry args={[wallThickness, height, width]} />
        <meshStandardMaterial color={wallColor} transparent opacity={0.3} roughness={0.3} />
      </mesh>

      {/* Left wall */}
      <mesh position={[0, height / 2, -width / 2]}>
        <boxGeometry args={[length, height, wallThickness]} />
        <meshStandardMaterial color={wallColor} transparent opacity={0.3} roughness={0.3} />
      </mesh>

      {/* Right wall -- wing van: tilted open */}
      {isWingVan ? (
        <group position={[0, height, width / 2]}>
          <mesh
            position={[0, height * 0.35, width * 0.25]}
            rotation={[Math.PI / 3, 0, 0]}
          >
            <boxGeometry args={[length, height, wallThickness]} />
            <meshStandardMaterial color={wallColor} transparent opacity={0.25} roughness={0.3} />
          </mesh>
        </group>
      ) : (
        <mesh position={[0, height / 2, width / 2]}>
          <boxGeometry args={[length, height, wallThickness]} />
          <meshStandardMaterial color={wallColor} transparent opacity={0.3} roughness={0.3} />
        </mesh>
      )}

      {/* Roof */}
      <mesh position={[0, height, 0]}>
        <boxGeometry args={[length, wallThickness, width]} />
        <meshStandardMaterial color={wallColor} transparent opacity={0.15} roughness={0.3} />
      </mesh>

      {/* Wireframe edges for clarity */}
      <mesh position={[0, height / 2, 0]}>
        <boxGeometry args={[length, height, width]} />
        <meshBasicMaterial color={darkerColor} wireframe transparent opacity={0.15} />
      </mesh>
    </group>
  )
}

/** Reefer: box with blue tint + reefer unit on one end */
function ReeferContainer({
  length,
  width,
  height,
  wallColor,
}: {
  length: number
  width: number
  height: number
  wallColor: string
}) {
  return (
    <group>
      <BoxContainer length={length} width={width} height={height} wallColor="#7dd3e8" />

      {/* Blue tint overlay for insulation look */}
      <mesh position={[0, height / 2, 0]}>
        <boxGeometry args={[length * 0.98, height * 0.98, width * 0.98]} />
        <meshPhysicalMaterial color="#67e8f9" transparent opacity={0.06} roughness={0.1} />
      </mesh>

      {/* Reefer unit: small box on front end */}
      <mesh position={[-length / 2 - 0.2, height * 0.7, 0]} castShadow>
        <boxGeometry args={[0.4, 0.5, width * 0.6]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.3} metalness={0.6} />
      </mesh>
      {/* Fan circle on reefer unit */}
      <mesh position={[-length / 2 - 0.41, height * 0.7, 0]} rotation={[0, Math.PI / 2, 0]}>
        <circleGeometry args={[0.15, 24]} />
        <meshStandardMaterial color="#475569" metalness={0.4} roughness={0.5} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

/** Flatbed: open top, low side walls */
function FlatbedContainer({
  length,
  width,
  wallColor,
}: {
  length: number
  width: number
  wallColor: string
}) {
  const sideHeight = 0.4
  const wallThickness = 0.04
  const stakeCount = Math.max(4, Math.floor(length / 1.2))

  return (
    <group>
      {/* Floor (solid platform) */}
      <mesh position={[0, 0, 0]} receiveShadow castShadow>
        <boxGeometry args={[length, 0.08, width]} />
        <meshStandardMaterial color="#475569" roughness={0.6} metalness={0.3} />
      </mesh>

      {/* Low side walls (semi-transparent) */}
      {[-1, 1].map((side) => (
        <mesh key={`sw-${side}`} position={[0, sideHeight / 2, side * (width / 2)]}>
          <boxGeometry args={[length, sideHeight, wallThickness]} />
          <meshStandardMaterial color={wallColor} transparent opacity={0.35} roughness={0.5} />
        </mesh>
      ))}

      {/* Front headboard */}
      <mesh position={[-length / 2, sideHeight / 2, 0]}>
        <boxGeometry args={[wallThickness, sideHeight, width]} />
        <meshStandardMaterial color={wallColor} transparent opacity={0.4} roughness={0.5} />
      </mesh>

      {/* Side stakes (vertical posts) */}
      {Array.from({ length: stakeCount }).map((_, i) => {
        const x = -length / 2 + (length / (stakeCount - 1)) * i
        return [-1, 1].map((side) => (
          <mesh key={`stake-${i}-${side}`} position={[x, sideHeight / 2, side * (width / 2)]}>
            <boxGeometry args={[0.04, sideHeight + 0.1, 0.04]} />
            <meshStandardMaterial color="#64748b" roughness={0.6} metalness={0.4} />
          </mesh>
        ))
      })}
    </group>
  )
}

/** Tanker: cylindrical shape */
function TankerContainer({
  length,
  width,
  wallColor,
}: {
  length: number
  width: number
  wallColor: string
}) {
  const radius = Math.min(width, 2.2) / 2

  return (
    <group>
      {/* Cylinder body */}
      <mesh
        position={[0, radius, 0]}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
      >
        <cylinderGeometry args={[radius, radius, length, 32]} />
        <meshStandardMaterial
          color={wallColor || "#c0c0c0"}
          transparent
          opacity={0.35}
          metalness={0.6}
          roughness={0.2}
        />
      </mesh>

      {/* Hemispherical end caps */}
      {[-1, 1].map((side) => (
        <mesh
          key={`cap-${side}`}
          position={[side * (length / 2), radius, 0]}
          rotation={[0, side === 1 ? 0 : Math.PI, 0]}
        >
          <sphereGeometry args={[radius, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial
            color={wallColor || "#d4d4d8"}
            transparent
            opacity={0.35}
            metalness={0.5}
            roughness={0.3}
          />
        </mesh>
      ))}

      {/* Wireframe outline */}
      <mesh
        position={[0, radius, 0]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <cylinderGeometry args={[radius, radius, length, 16]} />
        <meshBasicMaterial color="#94a3b8" wireframe transparent opacity={0.2} />
      </mesh>
    </group>
  )
}

/** Container: box with corrugated texture lines */
function ShippingContainer({
  length,
  width,
  height,
  wallColor,
}: {
  length: number
  width: number
  height: number
  wallColor: string
}) {
  const wallThickness = 0.04
  const corrugationCount = Math.max(10, Math.floor(length / 0.35))
  const darkerColor = new THREE.Color(wallColor).offsetHSL(0, 0, -0.08).getStyle()

  return (
    <group>
      {/* Floor (solid) */}
      <mesh position={[0, 0, 0]} receiveShadow castShadow>
        <boxGeometry args={[length, wallThickness, width]} />
        <meshStandardMaterial color="#475569" roughness={0.7} />
      </mesh>

      {/* Front wall */}
      <mesh position={[-length / 2, height / 2, 0]}>
        <boxGeometry args={[wallThickness, height, width]} />
        <meshStandardMaterial color={wallColor} transparent opacity={0.35} roughness={0.4} />
      </mesh>

      {/* Rear wall */}
      <mesh position={[length / 2, height / 2, 0]}>
        <boxGeometry args={[wallThickness, height, width]} />
        <meshStandardMaterial color={wallColor} transparent opacity={0.35} roughness={0.4} />
      </mesh>

      {/* Side walls */}
      {[-1, 1].map((side) => (
        <mesh key={`sw-${side}`} position={[0, height / 2, side * (width / 2)]}>
          <boxGeometry args={[length, height, wallThickness]} />
          <meshStandardMaterial color={wallColor} transparent opacity={0.35} roughness={0.4} />
        </mesh>
      ))}

      {/* Roof */}
      <mesh position={[0, height, 0]}>
        <boxGeometry args={[length, wallThickness, width]} />
        <meshStandardMaterial color={wallColor} transparent opacity={0.2} roughness={0.4} />
      </mesh>

      {/* Corrugation lines on both sides */}
      {[-1, 1].map((side) =>
        Array.from({ length: corrugationCount }).map((_, i) => {
          const x = -length / 2 + (length / corrugationCount) * (i + 0.5)
          return (
            <mesh key={`corr-${side}-${i}`} position={[x, height / 2, side * (width / 2 + 0.02)]}>
              <boxGeometry args={[length / corrugationCount * 0.3, height * 0.85, 0.015]} />
              <meshStandardMaterial color={darkerColor} roughness={0.6} metalness={0.2} />
            </mesh>
          )
        })
      )}

      {/* Corner castings (8 corners) */}
      {[-1, 1].map((xSide) =>
        [-1, 1].map((zSide) =>
          [0, 1].map((yTop) => (
            <mesh
              key={`cc-${xSide}-${zSide}-${yTop}`}
              position={[
                xSide * (length / 2 - 0.06),
                yTop * height + (yTop === 0 ? 0.06 : -0.06),
                zSide * (width / 2 - 0.04),
              ]}
            >
              <boxGeometry args={[0.12, 0.12, 0.08]} />
              <meshStandardMaterial color="#1e293b" roughness={0.6} metalness={0.4} />
            </mesh>
          ))
        )
      )}
    </group>
  )
}

// ---------------------------------------------------------------------------
// Cargo container scene
// ---------------------------------------------------------------------------

function ContainerScene({
  vehicleType,
  lengthM,
  widthM,
  heightM,
  maxPayloadKg,
  maxVolumeCbm,
  color,
  isReefer,
  showDimensions = true,
}: VehicleShowcaseProps) {
  const wallColor = getWallColor(vehicleType, color)
  const type = vehicleType.toLowerCase().replace(/[\s-]/g, "_")

  const isTanker = type.includes("tanker")
  const isContainer = type.includes("container")
  const isFlatbed = type.includes("flatbed") || type.includes("flat_bed")
  const isWingVan = type.includes("wing")
  const isReeferType = isReefer || type.includes("reefer")

  const visualHeight = isFlatbed ? 0.4 : isTanker ? Math.min(widthM, 2.2) : heightM

  return (
    <group>
      {/* Cargo container */}
      {isReeferType ? (
        <ReeferContainer length={lengthM} width={widthM} height={heightM} wallColor={wallColor} />
      ) : isTanker ? (
        <TankerContainer length={lengthM} width={widthM} wallColor={wallColor} />
      ) : isFlatbed ? (
        <FlatbedContainer length={lengthM} width={widthM} wallColor={wallColor} />
      ) : isContainer ? (
        <ShippingContainer length={lengthM} width={widthM} height={heightM} wallColor={wallColor} />
      ) : isWingVan ? (
        <BoxContainer length={lengthM} width={widthM} height={heightM} wallColor={wallColor} isWingVan />
      ) : (
        <BoxContainer length={lengthM} width={widthM} height={heightM} wallColor={wallColor} />
      )}

      {/* Dimension labels */}
      {showDimensions && (
        <DimensionLabels
          length={lengthM}
          width={widthM}
          height={isTanker || isFlatbed ? visualHeight : heightM}
        />
      )}

      {/* Info panel */}
      <InfoPanel
        vehicleType={vehicleType}
        maxPayloadKg={maxPayloadKg}
        maxVolumeCbm={maxVolumeCbm}
        length={lengthM}
        width={widthM}
        height={heightM}
        yPos={Math.max(visualHeight, heightM) + 0.3}
      />
    </group>
  )
}

// ---------------------------------------------------------------------------
// Main exported component
// ---------------------------------------------------------------------------

export default function VehicleShowcase(props: VehicleShowcaseProps) {
  const { className, lengthM, widthM, heightM } = props
  const maxDim = Math.max(lengthM, widthM, heightM)
  const camDist = Math.max(maxDim * 1.8, 6)

  return (
    <div className={className} style={{ width: "100%", height: "100%", minHeight: 350 }}>
      <Canvas shadows dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
        <Suspense fallback={null}>
          <PerspectiveCamera
            makeDefault
            position={[camDist * 0.75, camDist * 0.45, camDist * 0.65]}
            fov={38}
            near={0.1}
            far={200}
          />
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            minDistance={camDist * 0.4}
            maxDistance={camDist * 2.5}
            maxPolarAngle={Math.PI / 2 - 0.05}
            autoRotate
            autoRotateSpeed={0.5}
            enableDamping
            dampingFactor={0.08}
          />

          {/* Soft lighting -- white/light feel */}
          <ambientLight intensity={0.6} />
          <directionalLight
            position={[8, 12, 6]}
            intensity={1.0}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-camera-far={50}
            shadow-camera-left={-15}
            shadow-camera-right={15}
            shadow-camera-top={15}
            shadow-camera-bottom={-15}
          />
          <directionalLight position={[-5, 8, -4]} intensity={0.4} />

          {/* Scene */}
          <ContainerScene {...props} />

          {/* Contact shadows */}
          <ContactShadows
            position={[0, -0.01, 0]}
            opacity={0.3}
            scale={40}
            blur={2.5}
            far={20}
            color="#000000"
          />

          {/* Ground grid for scale reference */}
          <Grid
            position={[0, -0.01, 0]}
            args={[40, 40]}
            cellSize={1}
            cellThickness={0.5}
            cellColor="#cbd5e1"
            sectionSize={5}
            sectionThickness={1}
            sectionColor="#94a3b8"
            fadeDistance={30}
            infiniteGrid
          />
        </Suspense>
      </Canvas>
    </div>
  )
}
