import { describe, it, expect } from "vitest";
import {
  formatPeso, formatPesoPerKm, formatDate, formatDateTime, formatRelativeTime,
  timeUntil, calculateDistance, formatDistance, formatWeight, formatVolume,
  estimateCO2, formatCO2, getLoadStatusLabel, getBidStatusLabel,
  getPaymentStatusLabel, getVehicleCapacity, slugify, generateId,
  formatRating, getRatingColor
} from "../utils";

describe("Currency Formatting", () => {
  it("formats peso amounts correctly", () => {
    expect(formatPeso(0)).toBe("₱0");
    expect(formatPeso(1000)).toContain("1,000") || expect(formatPeso(1000)).toContain("1000");
    expect(formatPeso(50000.5)).toContain("50,000") || expect(formatPeso(50000.5)).toContain("50000");
    expect(formatPeso(1234567)).toContain("1,234,567") || expect(formatPeso(1234567)).toContain("1234567");
  });

  it("formats peso per km correctly", () => {
    expect(formatPesoPerKm(45)).toBe("₱45/km");
    expect(formatPesoPerKm(38.7)).toBe("₱39/km");
  });
});

describe("Date Formatting", () => {
  it("formats dates correctly", () => {
    const result = formatDate("2026-03-15T00:00:00Z");
    expect(result).toBeTruthy();
    expect(typeof result).toBe("string");
  });

  it("formats date-times correctly", () => {
    const result = formatDateTime("2026-03-15T14:30:00Z");
    expect(result).toBeTruthy();
  });

  it("formats relative time correctly", () => {
    const now = new Date();
    expect(formatRelativeTime(now.toISOString())).toBe("just now");

    const fiveMinAgo = new Date(now.getTime() - 5 * 60000);
    expect(formatRelativeTime(fiveMinAgo.toISOString())).toBe("5m ago");

    const twoHoursAgo = new Date(now.getTime() - 2 * 3600000);
    expect(formatRelativeTime(twoHoursAgo.toISOString())).toBe("2h ago");

    const threeDaysAgo = new Date(now.getTime() - 3 * 86400000);
    expect(formatRelativeTime(threeDaysAgo.toISOString())).toBe("3d ago");
  });

  it("falls back to formatted date for times older than 7 days", () => {
    const twoWeeksAgo = new Date(Date.now() - 14 * 86400000);
    const result = formatRelativeTime(twoWeeksAgo.toISOString());
    // Should fall back to formatDate, not "Xd ago"
    expect(result).not.toContain("d ago");
    expect(result).toBeTruthy();
  });

  it("handles timeUntil correctly", () => {
    const pastDate = new Date(Date.now() - 1000);
    expect(timeUntil(pastDate.toISOString())).toBe("Expired");

    const futureDate = new Date(Date.now() + 2 * 3600000);
    const result = timeUntil(futureDate.toISOString());
    expect(result).toContain("h left");
  });

  it("timeUntil shows minutes for < 1 hour", () => {
    const soon = new Date(Date.now() + 30 * 60000);
    const result = timeUntil(soon.toISOString());
    expect(result).toContain("m left");
  });

  it("timeUntil shows days for > 24 hours", () => {
    const farFuture = new Date(Date.now() + 3 * 86400000);
    const result = timeUntil(farFuture.toISOString());
    expect(result).toContain("d left");
  });
});

describe("Distance Calculation", () => {
  it("calculates distance between Manila and Cebu", () => {
    const dist = calculateDistance(14.5995, 120.9842, 10.3157, 123.8854);
    expect(dist).toBeGreaterThan(500);
    expect(dist).toBeLessThan(600);
  });

  it("returns 0 for same point", () => {
    expect(calculateDistance(14.5, 120.9, 14.5, 120.9)).toBe(0);
  });

  it("calculates short distances accurately", () => {
    // Two points ~1km apart in Manila
    const dist = calculateDistance(14.5995, 120.9842, 14.6085, 120.9842);
    expect(dist).toBeGreaterThan(0.5);
    expect(dist).toBeLessThan(2);
  });

  it("formats distance correctly", () => {
    expect(formatDistance(150)).toBe("150 km");
    expect(formatDistance(0.5)).toBe("500 m");
  });

  it("formats distance with rounding", () => {
    expect(formatDistance(150.7)).toBe("151 km");
    expect(formatDistance(0.123)).toBe("123 m");
  });
});

describe("Weight & Volume", () => {
  it("formats weight in kg correctly", () => {
    expect(formatWeight(500)).toContain("500");
    expect(formatWeight(500)).toContain("kg");
  });

  it("formats weight in tons for >= 1000 kg", () => {
    expect(formatWeight(15000)).toContain("15.0");
    expect(formatWeight(15000)).toContain("tons");
  });

  it("formats weight at boundary (1000 kg)", () => {
    expect(formatWeight(1000)).toContain("1.0");
    expect(formatWeight(1000)).toContain("tons");
  });

  it("formats volume correctly", () => {
    expect(formatVolume(25.3)).toBe("25.3 CBM");
    expect(formatVolume(0)).toBe("0.0 CBM");
    expect(formatVolume(100.99)).toBe("101.0 CBM");
  });
});

describe("Carbon Estimation", () => {
  it("estimates CO2 for known vehicle types", () => {
    const co2 = estimateCO2(100, "10-Wheeler Wing Van");
    expect(co2).toBeGreaterThan(0);
    expect(co2).toBeCloseTo(55); // 100km * 0.55
  });

  it("estimates CO2 for 4-Wheeler", () => {
    const co2 = estimateCO2(100, "4-Wheeler");
    expect(co2).toBe(21); // 100km * 0.21
  });

  it("estimates CO2 for Reefer Van (highest factor)", () => {
    const co2 = estimateCO2(100, "Reefer Van");
    expect(co2).toBe(68); // 100km * 0.68
  });

  it("uses default factor for unknown types", () => {
    const co2 = estimateCO2(100, "Unknown" as any);
    expect(co2).toBe(50); // 100km * 0.5 default
  });

  it("returns 0 for 0 distance", () => {
    expect(estimateCO2(0, "4-Wheeler")).toBe(0);
  });

  it("formats CO2 in kg correctly", () => {
    expect(formatCO2(55)).toBe("55.0 kg CO₂");
  });

  it("formats CO2 in tonnes for >= 1000 kg", () => {
    expect(formatCO2(1500)).toBe("1.5 t CO₂");
  });
});

describe("Status Labels", () => {
  it("returns correct load status labels", () => {
    expect(getLoadStatusLabel("draft")).toBe("Draft");
    expect(getLoadStatusLabel("posted")).toBe("Posted");
    expect(getLoadStatusLabel("open")).toBe("Open");
    expect(getLoadStatusLabel("bidding")).toBe("Bidding");
    expect(getLoadStatusLabel("awarded")).toBe("Awarded");
    expect(getLoadStatusLabel("in_transit")).toBe("In Transit");
    expect(getLoadStatusLabel("delivered")).toBe("Delivered");
    expect(getLoadStatusLabel("cancelled")).toBe("Cancelled");
  });

  it("returns correct bid status labels", () => {
    expect(getBidStatusLabel("pending")).toBe("Pending");
    expect(getBidStatusLabel("accepted")).toBe("Accepted");
    expect(getBidStatusLabel("rejected")).toBe("Rejected");
    expect(getBidStatusLabel("withdrawn")).toBe("Withdrawn");
    expect(getBidStatusLabel("expired")).toBe("Expired");
  });

  it("returns correct payment status labels", () => {
    expect(getPaymentStatusLabel("pending")).toBe("Pending");
    expect(getPaymentStatusLabel("processing")).toBe("Processing");
    expect(getPaymentStatusLabel("completed")).toBe("Completed");
    expect(getPaymentStatusLabel("failed")).toBe("Failed");
    expect(getPaymentStatusLabel("refunded")).toBe("Refunded");
  });
});

describe("Vehicle Capacity", () => {
  it("returns correct capacity for 10-Wheeler Wing Van", () => {
    const cap = getVehicleCapacity("10-Wheeler Wing Van");
    expect(cap.maxWeightKg).toBe(15000);
    expect(cap.maxVolumeCbm).toBe(50);
  });

  it("returns correct capacity for 4-Wheeler", () => {
    const cap = getVehicleCapacity("4-Wheeler");
    expect(cap.maxWeightKg).toBe(2000);
    expect(cap.maxVolumeCbm).toBe(6);
  });

  it("returns correct capacity for Trailer (largest)", () => {
    const cap = getVehicleCapacity("Trailer");
    expect(cap.maxWeightKg).toBe(30000);
    expect(cap.maxVolumeCbm).toBe(80);
  });

  it("returns default for unknown types", () => {
    const cap = getVehicleCapacity("Unknown" as any);
    expect(cap.maxWeightKg).toBe(10000);
    expect(cap.maxVolumeCbm).toBe(30);
  });

  it("returns capacity for all known vehicle types", () => {
    const types = [
      "4-Wheeler", "6-Wheeler Closed Van", "6-Wheeler Open",
      "10-Wheeler Wing Van", "10-Wheeler Closed Van", "Reefer Van",
      "Flatbed", "Tanker", "Container Truck", "Trailer",
    ] as const;
    types.forEach((type) => {
      const cap = getVehicleCapacity(type);
      expect(cap.maxWeightKg).toBeGreaterThan(0);
      expect(cap.maxVolumeCbm).toBeGreaterThan(0);
    });
  });
});

describe("Slug Generation", () => {
  it("creates valid slugs", () => {
    expect(slugify("Manila FMCG Corp")).toBe("manila-fmcg-corp");
    expect(slugify("Hello   World!!!")).toBe("hello-world");
    expect(slugify("  Leading Trailing  ")).toBe("leading-trailing");
  });

  it("handles special characters", () => {
    expect(slugify("Café & Résumé")).toBe("caf-r-sum");
    expect(slugify("test--double")).toBe("test-double");
  });

  it("handles single word", () => {
    expect(slugify("hello")).toBe("hello");
  });

  it("handles numbers", () => {
    expect(slugify("Route 66")).toBe("route-66");
  });
});

describe("ID Generation", () => {
  it("generates IDs with prefix", () => {
    const id = generateId("load");
    expect(id.startsWith("load_")).toBe(true);
    expect(id.length).toBeGreaterThan(10);
  });

  it("generates IDs with default prefix", () => {
    const id = generateId();
    expect(id.startsWith("tc_")).toBe(true);
  });

  it("generates unique IDs", () => {
    const id1 = generateId();
    const id2 = generateId();
    expect(id1).not.toBe(id2);
  });

  it("generates IDs with custom prefixes", () => {
    const id = generateId("bid");
    expect(id.startsWith("bid_")).toBe(true);
  });
});

describe("Rating", () => {
  it("formats rating correctly", () => {
    expect(formatRating(4.5)).toBe("4.5 ★");
    expect(formatRating(3.0)).toBe("3.0 ★");
    expect(formatRating(5.0)).toBe("5.0 ★");
  });

  it("returns green for excellent ratings (>= 4.5)", () => {
    expect(getRatingColor(4.8)).toBe("#059669");
    expect(getRatingColor(4.5)).toBe("#059669");
    expect(getRatingColor(5.0)).toBe("#059669");
  });

  it("returns blue for good ratings (>= 4.0)", () => {
    expect(getRatingColor(4.2)).toBe("#2563EB");
    expect(getRatingColor(4.0)).toBe("#2563EB");
  });

  it("returns amber for average ratings (>= 3.0)", () => {
    expect(getRatingColor(3.5)).toBe("#D97706");
    expect(getRatingColor(3.0)).toBe("#D97706");
  });

  it("returns red for poor ratings (< 3.0)", () => {
    expect(getRatingColor(2.0)).toBe("#DC2626");
    expect(getRatingColor(1.0)).toBe("#DC2626");
    expect(getRatingColor(0)).toBe("#DC2626");
  });
});
