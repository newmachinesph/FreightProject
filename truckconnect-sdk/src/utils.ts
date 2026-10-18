import type { LoadStatus, BidStatus, PaymentStatus, VehicleType, CargoType } from "./types";

// ─── Currency formatting (Philippine Peso) ───
export function formatPeso(amount: number): string {
  return `\u20B1${amount.toLocaleString("en-PH", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

export function formatPesoPerKm(rate: number): string {
  return `\u20B1${rate.toFixed(0)}/km`;
}

// ─── Date formatting ───
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-PH", { month: "short", day: "numeric", year: "numeric" }).format(new Date(date));
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat("en-PH", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(date));
}

export function formatRelativeTime(date: string | Date): string {
  const now = Date.now();
  const then = new Date(date).getTime();
  const diffMs = now - then;
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(date);
}

export function timeUntil(deadline: string | Date): string {
  const diff = new Date(deadline).getTime() - Date.now();
  if (diff <= 0) return "Expired";
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return `${Math.floor(diff / 60000)}m left`;
  if (hours < 24) return `${hours}h left`;
  return `${Math.floor(hours / 24)}d left`;
}

// ─── Distance calculation (Haversine) ───
export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function formatDistance(km: number): string {
  return km >= 1 ? `${km.toFixed(0)} km` : `${(km * 1000).toFixed(0)} m`;
}

// ─── Weight & Volume ───
export function formatWeight(kg: number): string {
  if (kg >= 1000) return `${(kg / 1000).toFixed(1)} tons`;
  return `${kg.toLocaleString()} kg`;
}

export function formatVolume(cbm: number): string {
  return `${cbm.toFixed(1)} CBM`;
}

// ─── Carbon Estimation ───
const CO2_PER_KM: Record<string, number> = {
  "4-Wheeler": 0.21,
  "6-Wheeler Closed Van": 0.35,
  "6-Wheeler Open": 0.33,
  "10-Wheeler Wing Van": 0.55,
  "10-Wheeler Closed Van": 0.52,
  "Reefer Van": 0.68,
  "Flatbed": 0.48,
  "Tanker": 0.62,
  "Container Truck": 0.58,
  "Trailer": 0.65,
};

export function estimateCO2(distanceKm: number, vehicleType: VehicleType): number {
  const factor = CO2_PER_KM[vehicleType] ?? 0.5;
  return distanceKm * factor;
}

export function formatCO2(kg: number): string {
  if (kg >= 1000) return `${(kg / 1000).toFixed(1)} t CO\u2082`;
  return `${kg.toFixed(1)} kg CO\u2082`;
}

// ─── Status Labels ───
export function getLoadStatusLabel(status: LoadStatus): string {
  const labels: Record<LoadStatus, string> = {
    draft: "Draft", posted: "Posted", open: "Open", bidding: "Bidding",
    awarded: "Awarded", in_transit: "In Transit", delivered: "Delivered", cancelled: "Cancelled",
  };
  return labels[status] ?? status;
}

export function getBidStatusLabel(status: BidStatus): string {
  const labels: Record<BidStatus, string> = {
    pending: "Pending", accepted: "Accepted", rejected: "Rejected",
    withdrawn: "Withdrawn", expired: "Expired",
  };
  return labels[status] ?? status;
}

export function getPaymentStatusLabel(status: PaymentStatus): string {
  const labels: Record<PaymentStatus, string> = {
    pending: "Pending", processing: "Processing", completed: "Completed",
    failed: "Failed", refunded: "Refunded",
  };
  return labels[status] ?? status;
}

// ─── Vehicle Capacity ───
export function getVehicleCapacity(type: VehicleType): { maxWeightKg: number; maxVolumeCbm: number } {
  const caps: Record<string, { maxWeightKg: number; maxVolumeCbm: number }> = {
    "4-Wheeler": { maxWeightKg: 2000, maxVolumeCbm: 6 },
    "6-Wheeler Closed Van": { maxWeightKg: 5000, maxVolumeCbm: 18 },
    "6-Wheeler Open": { maxWeightKg: 6000, maxVolumeCbm: 20 },
    "10-Wheeler Wing Van": { maxWeightKg: 15000, maxVolumeCbm: 50 },
    "10-Wheeler Closed Van": { maxWeightKg: 14000, maxVolumeCbm: 45 },
    "Reefer Van": { maxWeightKg: 12000, maxVolumeCbm: 40 },
    "Flatbed": { maxWeightKg: 18000, maxVolumeCbm: 60 },
    "Tanker": { maxWeightKg: 20000, maxVolumeCbm: 25 },
    "Container Truck": { maxWeightKg: 22000, maxVolumeCbm: 65 },
    "Trailer": { maxWeightKg: 30000, maxVolumeCbm: 80 },
  };
  return caps[type] ?? { maxWeightKg: 10000, maxVolumeCbm: 30 };
}

// ─── Slug generation ───
export function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

// ─── ID generation ───
export function generateId(prefix: string = "tc"): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${timestamp}${random}`;
}

// ─── Rating display ───
export function formatRating(rating: number): string {
  return `${rating.toFixed(1)} \u2605`;
}

export function getRatingColor(rating: number): string {
  if (rating >= 4.5) return "#059669";
  if (rating >= 4.0) return "#2563EB";
  if (rating >= 3.0) return "#D97706";
  return "#DC2626";
}
