"use client"

import { Suspense, useMemo } from "react"
import { Canvas } from "@react-three/fiber"
import {
  OrbitControls,
  PerspectiveCamera,
  RoundedBox,
  Text,
  Grid,
  ContactShadows,
  Edges,
} from "@react-three/drei"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CargoItem {
  id: string
  label: string
  lengthFt: number
  widthFt: number
  heightFt: number
  quantity: number
  color: string
  allowSideways?: boolean
}

export interface TruckEntry {
  id: string
  truckType: string
}

export interface LoadVisualizerProps {
  /** Single truck (legacy) */
  truckType?: string
  /** Multiple trucks — rendered side-by-side in one scene */
  trucks?: TruckEntry[]
  weightTons: number
  items?: CargoItem[]
  cargoType?: string
  className?: string
}

// ---------------------------------------------------------------------------
// Truck dimensions (feet)
// ---------------------------------------------------------------------------

const SCALE = 0.3

interface TruckDims {
  length: number
  width: number
  height: number
  label: string
  maxTons: number
}

// Verified Philippine truck cargo interior dimensions (feet) & payload (tons)
const TRUCK_DIMS: Record<string, TruckDims> = {
  L300_VAN:           { length: 7,  width: 4,   height: 4,   label: "L300/Van",        maxTons: 1 },
  CLOSED_VAN_4W:      { length: 9,  width: 5.5, height: 5.5, label: "4W Closed Van",   maxTons: 2.5 },
  CLOSED_VAN_6W:      { length: 14, width: 6.5, height: 6.5, label: "6W Closed Van",   maxTons: 5 },
  FWD_TRUCK_6W:       { length: 18, width: 7,   height: 7,   label: "6W Forward",      maxTons: 7 },
  WING_VAN_10W:       { length: 32, width: 7.8, height: 7.8, label: "10W Wing Van",    maxTons: 15 },
  TRAILER_40FT:       { length: 40, width: 8,   height: 8.5, label: "40ft Trailer",    maxTons: 28 },
}

// Map legacy business-model truck types to visualizer keys
const LEGACY_MAP: Record<string, string> = {
  FOUR_WHEELER:       "CLOSED_VAN_4W",
  SIX_WHEELER_OPEN:   "FWD_TRUCK_6W",
  SIX_WHEELER_CLOSED: "CLOSED_VAN_6W",
  TEN_WHEELER:        "WING_VAN_10W",
  TRAILER:            "TRAILER_40FT",
  WING_VAN:           "WING_VAN_10W",
}

function getDims(truckType: string): TruckDims {
  return TRUCK_DIMS[truckType] || TRUCK_DIMS[LEGACY_MAP[truckType]] || TRUCK_DIMS.CLOSED_VAN_6W
}

// ---------------------------------------------------------------------------
// Cargo color by type (fallback for legacy mode)
// ---------------------------------------------------------------------------

const CARGO_COLORS: Record<string, string> = {
  "general merchandise": "#6366f1",
  "food & beverage":     "#f59e0b",
  "construction materials": "#78716c",
  "electronics":         "#3b82f6",
  "agricultural products": "#22c55e",
  "furniture":           "#a855f7",
  "machinery":           "#64748b",
}

function getCargoColor(cargoType: string): string {
  return CARGO_COLORS[cargoType.toLowerCase()] || "#6366f1"
}

// ---------------------------------------------------------------------------
// Wheel count by truck type
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function TruckBed({ truckType, offsetZ }: { truckType: string; offsetZ?: number }) {
  const dims = getDims(truckType)
  const l = dims.length * SCALE
  const w = dims.width * SCALE
  const h = dims.height * SCALE
  const t = 0.06
  const isOpen = truckType.includes("OPEN")
  const oz = offsetZ || 0

  return (
    <group position={[0, 0, oz]}>
      {/* === Cargo area floor (solid dark surface) === */}
      <mesh position={[0, -0.01, 0]} receiveShadow>
        <boxGeometry args={[l, t, w]} />
        <meshStandardMaterial color="#475569" roughness={0.7} />
      </mesh>

      {/* === Lashing rail lines on floor === */}
      {Array.from({ length: Math.max(2, Math.floor(l / 0.8)) }).map((_, i, arr) => {
        const xPos = -l / 2 + (l / (arr.length + 1)) * (i + 1)
        return (
          <mesh key={`lash-${i}`} position={[xPos, 0.02, 0]}>
            <boxGeometry args={[0.015, 0.008, w * 0.9]} />
            <meshStandardMaterial color="#1e293b" roughness={0.6} />
          </mesh>
        )
      })}

      {/* Cross lashing lines */}
      {[-1, 0, 1].map((j) => {
        const zPos = j * (w * 0.3)
        return (
          <mesh key={`lash-cross-${j}`} position={[0, 0.02, zPos]}>
            <boxGeometry args={[l * 0.9, 0.008, 0.015]} />
            <meshStandardMaterial color="#1e293b" roughness={0.6} />
          </mesh>
        )
      })}

      {/* === Side walls (semi-transparent wireframe) === */}
      <mesh position={[0, h / 2, -w / 2]}>
        <boxGeometry args={[l, h, t]} />
        <meshStandardMaterial color="#94a3b8" transparent opacity={0.25} />
      </mesh>
      <mesh position={[0, h / 2, w / 2]}>
        <boxGeometry args={[l, h, t]} />
        <meshStandardMaterial color="#94a3b8" transparent opacity={0.25} />
      </mesh>
      {/* Front wall */}
      <mesh position={[l / 2, h / 2, 0]}>
        <boxGeometry args={[t, h, w]} />
        <meshStandardMaterial color="#94a3b8" transparent opacity={0.25} />
      </mesh>
      {/* Rear wall (back of truck) */}
      <mesh position={[-l / 2, h / 2, 0]}>
        <boxGeometry args={[t, h, w]} />
        <meshStandardMaterial color="#94a3b8" transparent opacity={0.25} />
      </mesh>
      {/* Roof (if not open) */}
      {!isOpen && (
        <mesh position={[0, h, 0]}>
          <boxGeometry args={[l, t, w]} />
          <meshStandardMaterial color="#94a3b8" transparent opacity={0.12} />
        </mesh>
      )}

    </group>
  )
}

interface BoxLayout {
  position: [number, number, number]
  size: [number, number, number]
  color: string
  rotated: boolean
  overflow?: boolean
  label?: string
  dimLabel?: string
}

function CargoBox({
  position,
  size,
  color,
  overflow,
  dimLabel,
}: {
  position: [number, number, number]
  size: [number, number, number]
  color: string
  overflow?: boolean
  dimLabel?: string
}) {
  return (
    <group position={position}>
      <RoundedBox args={size} radius={0.02} smoothness={4} castShadow receiveShadow>
        <meshStandardMaterial color={color} transparent={!!overflow} opacity={overflow ? 0.5 : 0.92} />
        <Edges linewidth={1} threshold={15} color="#00000040" />
      </RoundedBox>
      {/* Dimension label on top */}
      {dimLabel && (
        <Text
          position={[0, size[1] / 2 + 0.04, 0]}
          fontSize={0.06}
          color="#e2e8f0"
          anchorX="center"
          anchorY="bottom"
          maxWidth={size[0] * 0.95}
        >
          {dimLabel}
        </Text>
      )}
    </group>
  )
}

// ---------------------------------------------------------------------------
// Rotation-aware 3D bin packing
// ---------------------------------------------------------------------------

interface Orientation {
  l: number
  w: number
  h: number
  rotated: boolean
}

function getOrientations(itemL: number, itemW: number, itemH: number, allowSideways: boolean): Orientation[] {
  const orientations: Orientation[] = [
    { l: itemL, w: itemW, h: itemH, rotated: false },
  ]
  if (allowSideways) {
    orientations.push({ l: itemW, w: itemL, h: itemH, rotated: true })
    orientations.push({ l: itemH, w: itemW, h: itemL, rotated: true })
    orientations.push({ l: itemL, w: itemH, h: itemW, rotated: true })
  } else {
    if (itemL !== itemW) {
      orientations.push({ l: itemW, w: itemL, h: itemH, rotated: true })
    }
  }
  return orientations
}

// ---------------------------------------------------------------------------
// Free-space 3D bin packing
// ---------------------------------------------------------------------------

interface FreeSpace {
  x: number; y: number; z: number
  l: number; w: number; h: number
}

interface PackedUnit {
  il: number; iw: number; ih: number
  color: string; allowSideways: boolean; vol: number
  dimLabel?: string
}

function expandAndSort(items: CargoItem[]): PackedUnit[] {
  const units: PackedUnit[] = []
  for (const item of items) {
    if (item.quantity <= 0 || item.lengthFt <= 0 || item.widthFt <= 0 || item.heightFt <= 0) continue
    const il = item.lengthFt * SCALE
    const iw = item.widthFt * SCALE
    const ih = item.heightFt * SCALE
    const vol = il * iw * ih
    const dimLabel = `${item.lengthFt}\u00d7${item.widthFt}\u00d7${item.heightFt}`
    for (let q = 0; q < item.quantity; q++) {
      units.push({ il, iw, ih, color: item.color, allowSideways: item.allowSideways !== false, vol, dimLabel })
    }
  }
  units.sort((a, b) => b.vol - a.vol)
  return units
}

function placementScore(space: FreeSpace): number {
  return space.y * 10000 + space.x * 100 + space.z
}

function splitSpace(space: FreeSpace, bl: number, bw: number, bh: number): FreeSpace[] {
  const newSpaces: FreeSpace[] = []
  const remX = space.l - bl
  if (remX > 0.01) newSpaces.push({ x: space.x + bl, y: space.y, z: space.z, l: remX, w: space.w, h: space.h })
  const remZ = space.w - bw
  if (remZ > 0.01) newSpaces.push({ x: space.x, y: space.y, z: space.z + bw, l: bl, w: remZ, h: space.h })
  const remY = space.h - bh
  if (remY > 0.01) newSpaces.push({ x: space.x, y: space.y + bh, z: space.z, l: bl, w: bw, h: remY })
  return newSpaces
}

/** Try to place a unit into freeSpaces; returns the box + updated spaces, or null */
function placeUnit(
  unit: PackedUnit,
  freeSpaces: FreeSpace[],
  ox: number, oy: number, oz: number,
): { box: BoxLayout; newSpaces: FreeSpace[]; rotated: boolean } | null {
  const orientations = getOrientations(unit.il, unit.iw, unit.ih, unit.allowSideways)
  let bestSpace: FreeSpace | null = null
  let bestOri: Orientation | null = null
  let bestScore = Infinity

  for (const space of freeSpaces) {
    for (const ori of orientations) {
      if (ori.l <= space.l + 0.001 && ori.w <= space.w + 0.001 && ori.h <= space.h + 0.001) {
        const score = placementScore(space)
        if (score < bestScore) {
          bestScore = score
          bestSpace = space
          bestOri = ori
        }
      }
    }
  }

  if (!bestSpace || !bestOri) return null

  const bl = bestOri.l, bw = bestOri.w, bh = bestOri.h
  const box: BoxLayout = {
    position: [
      ox + bestSpace.x + bl / 2,
      oy + bestSpace.y + bh / 2,
      oz + bestSpace.z + bw / 2,
    ],
    size: [bl, bh, bw],
    color: unit.color,
    rotated: bestOri.rotated,
    dimLabel: unit.dimLabel,
  }

  let newSpaces = freeSpaces.filter(s => s !== bestSpace)
  newSpaces.push(...splitSpace(bestSpace, bl, bw, bh))
  newSpaces = newSpaces.filter(s => s.l > 0.05 && s.w > 0.05 && s.h > 0.05)
  newSpaces.sort((a, b) => placementScore(a) - placementScore(b))

  return { box, newSpaces, rotated: bestOri.rotated }
}

interface TruckPackResult {
  truckType: string
  offsetZ: number
  boxes: BoxLayout[]
  volumeUtil: number
  placed: number
}

interface MultiTruckResult {
  truckResults: TruckPackResult[]
  overflowBoxes: BoxLayout[]
  totalPlaced: number
  totalRequested: number
  sidewaysUsed: boolean
}

/** Pack items across multiple trucks in one scene, with overflow */
function packMultiTruck(
  truckTypes: string[],
  items: CargoItem[],
): MultiTruckResult {
  const pad = 0.04
  const totalRequested = items.reduce((s, i) => s + Math.max(0, i.quantity), 0)
  const units = expandAndSort(items)

  // Compute Z offsets so trucks sit side by side along Z axis
  const truckWidths = truckTypes.map(t => getDims(t).width * SCALE)
  const GAP = 0.6
  const totalSpan = truckWidths.reduce((s, w) => s + w, 0) + GAP * (truckTypes.length - 1)
  const offsets: number[] = []
  let cursor = -totalSpan / 2
  for (const w of truckWidths) {
    offsets.push(cursor + w / 2)
    cursor += w + GAP
  }

  // Prepare free-space lists per truck
  const truckFreeSpaces: FreeSpace[][] = truckTypes.map(t => {
    const d = getDims(t)
    const usableL = d.length * SCALE - pad * 2
    const usableW = d.width * SCALE - pad * 2
    const usableH = d.height * SCALE - pad * 2
    return [{ x: 0, y: 0, z: 0, l: usableL, w: usableW, h: usableH }]
  })
  const truckBoxes: BoxLayout[][] = truckTypes.map(() => [])
  const truckVolumes: number[] = truckTypes.map(() => 0)
  let sidewaysUsed = false
  const overflow: PackedUnit[] = []

  // For each unit, try each truck (round-robin preference: least-filled first)
  for (const unit of units) {
    let placed = false

    // Sort truck indices by current fill volume (least filled first)
    const sortedIndices = truckTypes.map((_, i) => i).sort((a, b) => truckVolumes[a] - truckVolumes[b])

    for (const ti of sortedIndices) {
      const dims = getDims(truckTypes[ti])
      const tl = dims.length * SCALE
      const tw = dims.width * SCALE
      const ox = -tl / 2 + pad
      const oy = 0.02
      const ozLocal = -tw / 2 + pad

      const result = placeUnit(unit, truckFreeSpaces[ti], ox, oy, ozLocal)
      if (result) {
        // Offset the box position by the truck's Z offset
        const [bx, by, bz] = result.box.position
        result.box.position = [bx, by, bz + offsets[ti]]
        truckBoxes[ti].push(result.box)
        truckFreeSpaces[ti] = result.newSpaces
        truckVolumes[ti] += unit.il * unit.iw * unit.ih
        if (result.rotated) sidewaysUsed = true
        placed = true
        break
      }
    }

    if (!placed) overflow.push(unit)
  }

  // Build per-truck results
  const truckResults: TruckPackResult[] = truckTypes.map((tt, i) => {
    const d = getDims(tt)
    const truckVol = (d.length * SCALE - pad * 2) * (d.width * SCALE - pad * 2) * (d.height * SCALE - pad * 2)
    return {
      truckType: tt,
      offsetZ: offsets[i],
      boxes: truckBoxes[i],
      volumeUtil: truckVol > 0 ? Math.min((truckVolumes[i] / truckVol) * 100, 100) : 0,
      placed: truckBoxes[i].length,
    }
  })

  // Overflow boxes placed beyond the rightmost truck end on X
  const maxTruckHalfLen = Math.max(...truckTypes.map(t => getDims(t).length * SCALE / 2))
  const overflowStartX = maxTruckHalfLen + 0.4
  const overflowBoxes: BoxLayout[] = []
  let ovX = overflowStartX
  let ovZ = offsets[0] || 0
  const maxTruckHalfW = Math.max(...truckTypes.map(t => getDims(t).width * SCALE / 2))
  let ovRowMaxL = 0

  for (const unit of overflow) {
    const bl = unit.il, bw = unit.iw, bh = unit.ih
    if (ovZ + bw / 2 > (offsets[offsets.length - 1] || 0) + maxTruckHalfW) {
      ovZ = (offsets[0] || 0) - maxTruckHalfW + pad
      ovX += ovRowMaxL + pad
      ovRowMaxL = 0
    }
    overflowBoxes.push({
      position: [ovX + bl / 2, 0.02 + bh / 2, ovZ + bw / 2],
      size: [bl, bh, bw],
      color: unit.color,
      rotated: false,
      overflow: true,
      dimLabel: unit.dimLabel,
    })
    ovZ += bw + pad
    ovRowMaxL = Math.max(ovRowMaxL, bl)
  }

  return {
    truckResults,
    overflowBoxes,
    totalPlaced: truckResults.reduce((s, r) => s + r.placed, 0),
    totalRequested,
    sidewaysUsed,
  }
}

// Fallback: single cargo type weight-based packing
function packWeightBased(truckType: string, weightTons: number, cargoType: string): BoxLayout[] {
  const dims = getDims(truckType)
  const tl = dims.length * SCALE
  const tw = dims.width * SCALE
  const th = dims.height * SCALE
  const pad = 0.06
  const color = getCargoColor(cargoType || "general merchandise")

  const fillRatio = Math.min(weightTons / dims.maxTons, 1)
  const boxCount = Math.max(1, Math.min(12, Math.round(fillRatio * 12)))
  const cols = Math.min(boxCount, 3)
  const rows = Math.ceil(boxCount / cols)

  const usableL = tl - pad * 2
  const usableW = tw - pad * 2
  const usableH = th - pad * 2

  const boxL = usableL / rows - pad
  const boxW = usableW / cols - pad
  const boxH = Math.min(usableH * 0.4, usableH * fillRatio * 0.6 + 0.2)

  const boxes: BoxLayout[] = []
  for (let i = 0; i < boxCount; i++) {
    const row = Math.floor(i / cols)
    const col = i % cols
    const x = -tl / 2 + pad + boxL / 2 + row * (boxL + pad)
    const z = -tw / 2 + pad + boxW / 2 + col * (boxW + pad)
    const y = boxH / 2 + 0.02
    boxes.push({ position: [x, y, z], size: [boxL, boxH, boxW], color, rotated: false })
  }
  return boxes
}

// ---------------------------------------------------------------------------
// Scene — supports multiple trucks in one view
// ---------------------------------------------------------------------------

function Scene({ trucks, truckType, weightTons, items, cargoType }: {
  trucks?: TruckEntry[]
  truckType?: string
  weightTons: number
  items?: CargoItem[]
  cargoType?: string
}) {
  const truckTypes = trucks && trucks.length > 0
    ? trucks.map(t => t.truckType)
    : [truckType || "CLOSED_VAN_6W"]

  const multiResult = useMemo(() => {
    if (items && items.length > 0 && items.some(i => i.quantity > 0)) {
      return packMultiTruck(truckTypes, items)
    }
    return null
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(truckTypes), items])

  const singleFallback = useMemo(() => {
    if (multiResult) return null
    return packWeightBased(truckTypes[0], weightTons, cargoType || "")
  }, [truckTypes, weightTons, cargoType, multiResult])

  const allBoxes: BoxLayout[] = multiResult
    ? multiResult.truckResults.flatMap(r => r.boxes)
    : singleFallback || []

  const overflowBoxes = multiResult?.overflowBoxes || []
  const isOverloaded = overflowBoxes.length > 0

  // Compute total truck capacity
  const totalMaxTons = truckTypes.reduce((s, t) => s + getDims(t).maxTons, 0)
  const weightUtil = Math.min((weightTons / totalMaxTons) * 100, 100)
  const isWeightOver = weightTons > totalMaxTons

  // Compute Z offsets for truck beds (same logic as packing)
  const GAP = 0.6
  const truckWidths = truckTypes.map(t => getDims(t).width * SCALE)
  const totalSpan = truckWidths.reduce((s, w) => s + w, 0) + GAP * (truckTypes.length - 1)
  const offsets: number[] = []
  let cursor = -totalSpan / 2
  for (const w of truckWidths) {
    offsets.push(cursor + w / 2)
    cursor += w + GAP
  }

  const maxHeight = Math.max(...truckTypes.map(t => getDims(t).height * SCALE))
  const maxHalfLen = Math.max(...truckTypes.map(t => getDims(t).length * SCALE / 2))

  // Utilization label
  let utilLabel: string
  let utilColor: string

  if (multiResult) {
    const avgVol = multiResult.truckResults.length > 0
      ? multiResult.truckResults.reduce((s, r) => s + r.volumeUtil, 0) / multiResult.truckResults.length
      : 0

    if (isOverloaded || isWeightOver) {
      utilColor = "#ef4444"
      const overCount = multiResult.totalRequested - multiResult.totalPlaced
      utilLabel = `OVERLOADED \u2014 ${overCount} item${overCount !== 1 ? "s" : ""} won't fit`
    } else {
      const primary = Math.max(avgVol, weightUtil)
      utilColor = primary < 50 ? "#22c55e" : primary < 80 ? "#f59e0b" : "#ef4444"
      const sidewaysTag = multiResult.sidewaysUsed ? " rotated" : ""
      utilLabel = `${Math.round(avgVol)}% vol \u00b7 ${Math.round(weightUtil)}% wt${sidewaysTag}`
    }
  } else {
    utilColor = weightUtil < 50 ? "#22c55e" : weightUtil < 80 ? "#f59e0b" : "#ef4444"
    utilLabel = isWeightOver ? `OVERLOADED \u2014 ${Math.round(weightUtil)}% weight` : `${Math.round(weightUtil)}% Utilization`
  }

  // Camera distance adjusts based on scene size
  const sceneWidth = totalSpan + 2
  const camDist = Math.max(4, sceneWidth * 0.7)
  const camX = isOverloaded ? camDist + 1.5 : camDist

  return (
    <>
      <PerspectiveCamera makeDefault position={[camX, camDist * 0.65, camDist * 0.85]} fov={45} />
      <OrbitControls enablePan={false} minDistance={2} maxDistance={20} maxPolarAngle={Math.PI / 2.1} />

      {/* Improved lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 5]} intensity={0.9} castShadow />
      <directionalLight position={[-3, 6, -3]} intensity={0.35} />
      <directionalLight position={[0, 4, 8]} intensity={0.25} />

      {/* Contact shadows for ground realism */}
      <ContactShadows
        position={[0, -0.019, 0]}
        opacity={0.4}
        scale={30}
        blur={2.5}
        far={10}
        color="#000000"
      />

      {/* Render each truck bed */}
      {truckTypes.map((tt, i) => (
        <TruckBed key={`bed-${i}`} truckType={tt} offsetZ={offsets[i]} />
      ))}

      {/* Per-truck labels */}
      {truckTypes.length > 1 && truckTypes.map((tt, i) => {
        const d = getDims(tt)
        const vu = multiResult?.truckResults[i]?.volumeUtil
        return (
          <Text
            key={`label-${i}`}
            position={[0, -0.3, offsets[i]]}
            fontSize={0.14}
            color="#64748b"
            anchorX="center"
            anchorY="middle"
          >
            {`#${i + 1} ${d.label}${vu !== undefined ? ` \u00b7 ${Math.round(vu)}%` : ""}`}
          </Text>
        )
      })}

      {/* All cargo boxes */}
      {allBoxes.map((box, i) => (
        <CargoBox
          key={`in-${i}`}
          position={box.position}
          size={box.size}
          color={box.color}
          dimLabel={box.dimLabel}
        />
      ))}

      {/* Overflow boxes */}
      {overflowBoxes.map((box, i) => (
        <CargoBox
          key={`ov-${i}`}
          position={box.position}
          size={box.size}
          color={box.color}
          overflow
          dimLabel={box.dimLabel}
        />
      ))}

      {/* Red zone under overflow */}
      {isOverloaded && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[maxHalfLen + 1.2, -0.015, 0]}>
          <planeGeometry args={[2, totalSpan + 1]} />
          <meshStandardMaterial color="#ef4444" transparent opacity={0.12} />
        </mesh>
      )}

      {/* Grid floor */}
      <Grid
        position={[0, -0.02, 0]}
        args={[30, 30]}
        cellSize={0.5}
        cellThickness={0.5}
        cellColor="#334155"
        sectionSize={2}
        sectionThickness={1}
        sectionColor="#475569"
        fadeDistance={18}
        fadeStrength={1}
        infiniteGrid
      />

      <Text
        position={[0, maxHeight + 0.4, 0]}
        fontSize={isOverloaded ? 0.2 : 0.18}
        color={utilColor}
        anchorX="center"
        anchorY="middle"
      >
        {utilLabel}
      </Text>
    </>
  )
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function LoadVisualizer({
  truckType,
  trucks,
  weightTons,
  items,
  cargoType,
  className = "",
}: LoadVisualizerProps) {
  const truckTypes = trucks && trucks.length > 0
    ? trucks.map(t => t.truckType)
    : [truckType || "CLOSED_VAN_6W"]

  const totalItems = items?.reduce((s, i) => s + i.quantity, 0) || 0
  const dimsLabels = truckTypes.map(t => getDims(t).label).join(" + ")

  const a11ySummary = totalItems > 0
    ? `3D visualization of ${totalItems} cargo items across ${truckTypes.length} truck${truckTypes.length > 1 ? "s" : ""} (${dimsLabels})`
    : `3D visualization of ${weightTons}T cargo in ${dimsLabels}`

  return (
    <div className={className}>
      <div style={{
        overflow: "hidden",
        backgroundColor: "#020617",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}>
        <Suspense
          fallback={
            <div style={{
              aspectRatio: "4/3",
              minHeight: 320,
              backgroundColor: "#020617",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
            }}>
              <div style={{
                width: 40,
                height: 40,
                border: "2px solid #334155",
                borderTopColor: "#34d399",
                borderRadius: "50%",
                animation: "lv-spin 0.8s linear infinite",
              }} />
              <span style={{ fontSize: 13, color: "#64748b", letterSpacing: "0.05em" }}>Building 3D scene&hellip;</span>
              <style>{`@keyframes lv-spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          }
        >
          <div
            role="img"
            aria-label={a11ySummary}
            style={{
              aspectRatio: "4/3",
              minHeight: 320,
              flex: 1,
            }}
          >
            <Canvas shadows style={{ height: "100%", width: "100%", background: "#0a0f1a" }}>
              <Scene trucks={trucks} truckType={truckType} weightTons={weightTons} items={items} cargoType={cargoType} />
            </Canvas>
          </div>
        </Suspense>

        <div style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "4px 16px",
          borderTop: "1px solid #1e293b",
          padding: "8px 16px",
          fontSize: 12,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontWeight: 600, color: "#e2e8f0" }}>{dimsLabels}</span>
            {truckTypes.length > 1 && (
              <span style={{ color: "#64748b" }}>{truckTypes.length} trucks</span>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, color: "#64748b" }}>
            {totalItems > 0 && (
              <span style={{ fontVariantNumeric: "tabular-nums" }}>
                {totalItems} items &middot; {items?.length} {(items?.length ?? 0) === 1 ? "type" : "types"}
              </span>
            )}
            <span style={{ fontWeight: 500, color: "#cbd5e1", fontVariantNumeric: "tabular-nums" }}>{weightTons}T</span>
            {cargoType && <span>{cargoType}</span>}
          </div>
        </div>
      </div>
    </div>
  )
}
