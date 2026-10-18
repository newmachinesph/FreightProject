// src/utils.ts
function formatPeso(amount) {
  return `\u20B1${amount.toLocaleString("en-PH", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}
function formatPesoPerKm(rate) {
  return `\u20B1${rate.toFixed(0)}/km`;
}
function formatDate(date) {
  return new Intl.DateTimeFormat("en-PH", { month: "short", day: "numeric", year: "numeric" }).format(new Date(date));
}
function formatDateTime(date) {
  return new Intl.DateTimeFormat("en-PH", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(date));
}
function formatRelativeTime(date) {
  const now = Date.now();
  const then = new Date(date).getTime();
  const diffMs = now - then;
  const diffMins = Math.floor(diffMs / 6e4);
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(date);
}
function timeUntil(deadline) {
  const diff = new Date(deadline).getTime() - Date.now();
  if (diff <= 0) return "Expired";
  const hours = Math.floor(diff / 36e5);
  if (hours < 1) return `${Math.floor(diff / 6e4)}m left`;
  if (hours < 24) return `${hours}h left`;
  return `${Math.floor(hours / 24)}d left`;
}
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
function formatDistance(km) {
  return km >= 1 ? `${km.toFixed(0)} km` : `${(km * 1e3).toFixed(0)} m`;
}
function formatWeight(kg) {
  if (kg >= 1e3) return `${(kg / 1e3).toFixed(1)} tons`;
  return `${kg.toLocaleString()} kg`;
}
function formatVolume(cbm) {
  return `${cbm.toFixed(1)} CBM`;
}
var CO2_PER_KM = {
  "4-Wheeler": 0.21,
  "6-Wheeler Closed Van": 0.35,
  "6-Wheeler Open": 0.33,
  "10-Wheeler Wing Van": 0.55,
  "10-Wheeler Closed Van": 0.52,
  "Reefer Van": 0.68,
  "Flatbed": 0.48,
  "Tanker": 0.62,
  "Container Truck": 0.58,
  "Trailer": 0.65
};
function estimateCO2(distanceKm, vehicleType) {
  const factor = CO2_PER_KM[vehicleType] ?? 0.5;
  return distanceKm * factor;
}
function formatCO2(kg) {
  if (kg >= 1e3) return `${(kg / 1e3).toFixed(1)} t CO\u2082`;
  return `${kg.toFixed(1)} kg CO\u2082`;
}
function getLoadStatusLabel(status) {
  const labels = {
    draft: "Draft",
    posted: "Posted",
    open: "Open",
    bidding: "Bidding",
    awarded: "Awarded",
    in_transit: "In Transit",
    delivered: "Delivered",
    cancelled: "Cancelled"
  };
  return labels[status] ?? status;
}
function getBidStatusLabel(status) {
  const labels = {
    pending: "Pending",
    accepted: "Accepted",
    rejected: "Rejected",
    withdrawn: "Withdrawn",
    expired: "Expired"
  };
  return labels[status] ?? status;
}
function getPaymentStatusLabel(status) {
  const labels = {
    pending: "Pending",
    processing: "Processing",
    completed: "Completed",
    failed: "Failed",
    refunded: "Refunded"
  };
  return labels[status] ?? status;
}
function getVehicleCapacity(type) {
  const caps = {
    "4-Wheeler": { maxWeightKg: 2e3, maxVolumeCbm: 6 },
    "6-Wheeler Closed Van": { maxWeightKg: 5e3, maxVolumeCbm: 18 },
    "6-Wheeler Open": { maxWeightKg: 6e3, maxVolumeCbm: 20 },
    "10-Wheeler Wing Van": { maxWeightKg: 15e3, maxVolumeCbm: 50 },
    "10-Wheeler Closed Van": { maxWeightKg: 14e3, maxVolumeCbm: 45 },
    "Reefer Van": { maxWeightKg: 12e3, maxVolumeCbm: 40 },
    "Flatbed": { maxWeightKg: 18e3, maxVolumeCbm: 60 },
    "Tanker": { maxWeightKg: 2e4, maxVolumeCbm: 25 },
    "Container Truck": { maxWeightKg: 22e3, maxVolumeCbm: 65 },
    "Trailer": { maxWeightKg: 3e4, maxVolumeCbm: 80 }
  };
  return caps[type] ?? { maxWeightKg: 1e4, maxVolumeCbm: 30 };
}
function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
function generateId(prefix = "tc") {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${timestamp}${random}`;
}
function formatRating(rating) {
  return `${rating.toFixed(1)} \u2605`;
}
function getRatingColor(rating) {
  if (rating >= 4.5) return "#059669";
  if (rating >= 4) return "#2563EB";
  if (rating >= 3) return "#D97706";
  return "#DC2626";
}
export {
  calculateDistance,
  estimateCO2,
  formatCO2,
  formatDate,
  formatDateTime,
  formatDistance,
  formatPeso,
  formatPesoPerKm,
  formatRating,
  formatRelativeTime,
  formatVolume,
  formatWeight,
  generateId,
  getBidStatusLabel,
  getLoadStatusLabel,
  getPaymentStatusLabel,
  getRatingColor,
  getVehicleCapacity,
  slugify,
  timeUntil
};
