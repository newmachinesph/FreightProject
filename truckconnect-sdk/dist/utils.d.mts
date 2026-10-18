import { VehicleType, BidStatus, LoadStatus, PaymentStatus } from './types.mjs';

declare function formatPeso(amount: number): string;
declare function formatPesoPerKm(rate: number): string;
declare function formatDate(date: string | Date): string;
declare function formatDateTime(date: string | Date): string;
declare function formatRelativeTime(date: string | Date): string;
declare function timeUntil(deadline: string | Date): string;
declare function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number;
declare function formatDistance(km: number): string;
declare function formatWeight(kg: number): string;
declare function formatVolume(cbm: number): string;
declare function estimateCO2(distanceKm: number, vehicleType: VehicleType): number;
declare function formatCO2(kg: number): string;
declare function getLoadStatusLabel(status: LoadStatus): string;
declare function getBidStatusLabel(status: BidStatus): string;
declare function getPaymentStatusLabel(status: PaymentStatus): string;
declare function getVehicleCapacity(type: VehicleType): {
    maxWeightKg: number;
    maxVolumeCbm: number;
};
declare function slugify(text: string): string;
declare function generateId(prefix?: string): string;
declare function formatRating(rating: number): string;
declare function getRatingColor(rating: number): string;

export { calculateDistance, estimateCO2, formatCO2, formatDate, formatDateTime, formatDistance, formatPeso, formatPesoPerKm, formatRating, formatRelativeTime, formatVolume, formatWeight, generateId, getBidStatusLabel, getLoadStatusLabel, getPaymentStatusLabel, getRatingColor, getVehicleCapacity, slugify, timeUntil };
