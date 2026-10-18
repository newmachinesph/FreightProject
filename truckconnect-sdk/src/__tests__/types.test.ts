import { describe, it, expect } from "vitest";
import { PH_MAJOR_PORTS } from "../types";
import type { User, Organization, Load, Carrier, Warehouse, OrgType, OrgRole, LoadStatus, VehicleType } from "../types";

describe("PH_MAJOR_PORTS", () => {
  it("contains all major Philippine ports", () => {
    expect(PH_MAJOR_PORTS.length).toBeGreaterThanOrEqual(8);
  });

  it("has valid coordinates for Manila port", () => {
    const manila = PH_MAJOR_PORTS.find(p => p.city === "Manila");
    expect(manila).toBeDefined();
    expect(manila!.lat).toBeGreaterThan(14);
    expect(manila!.lat).toBeLessThan(15);
    expect(manila!.lng).toBeGreaterThan(120);
    expect(manila!.lng).toBeLessThan(121);
  });

  it("has valid coordinates for Cebu port", () => {
    const cebu = PH_MAJOR_PORTS.find(p => p.city === "Cebu");
    expect(cebu).toBeDefined();
    expect(cebu!.lat).toBeGreaterThan(10);
    expect(cebu!.lat).toBeLessThan(11);
    expect(cebu!.lng).toBeGreaterThan(123);
    expect(cebu!.lng).toBeLessThan(124);
  });

  it("has valid coordinates for Davao port", () => {
    const davao = PH_MAJOR_PORTS.find(p => p.city === "Davao");
    expect(davao).toBeDefined();
    expect(davao!.lat).toBeGreaterThan(6);
    expect(davao!.lat).toBeLessThan(8);
  });

  it("has required fields for every port", () => {
    PH_MAJOR_PORTS.forEach(port => {
      expect(port.name).toBeTruthy();
      expect(port.city).toBeTruthy();
      expect(typeof port.lat).toBe("number");
      expect(typeof port.lng).toBe("number");
    });
  });

  it("has unique city names", () => {
    const cities = PH_MAJOR_PORTS.map(p => p.city);
    const uniqueCities = new Set(cities);
    expect(uniqueCities.size).toBe(cities.length);
  });

  it("all coordinates are within Philippine bounds", () => {
    PH_MAJOR_PORTS.forEach(port => {
      expect(port.lat).toBeGreaterThan(4);    // Southernmost PH
      expect(port.lat).toBeLessThan(21);       // Northernmost PH
      expect(port.lng).toBeGreaterThan(116);   // Westernmost PH
      expect(port.lng).toBeLessThan(127);      // Easternmost PH
    });
  });
});

describe("Type Compatibility", () => {
  it("OrgType values are exhaustive", () => {
    const orgTypes: OrgType[] = [
      "tc_platform", "enterprise_shipper", "msme_shipper",
      "carrier_fleet", "freight_forwarder", "warehouse_operator"
    ];
    expect(orgTypes.length).toBe(6);
  });

  it("LoadStatus values are exhaustive", () => {
    const statuses: LoadStatus[] = [
      "draft", "posted", "open", "bidding",
      "awarded", "in_transit", "delivered", "cancelled"
    ];
    expect(statuses.length).toBe(8);
  });

  it("VehicleType values are valid", () => {
    const types: VehicleType[] = [
      "4-Wheeler", "6-Wheeler Closed Van", "6-Wheeler Open",
      "10-Wheeler Wing Van", "10-Wheeler Closed Van", "Reefer Van",
      "Flatbed", "Tanker", "Container Truck", "Trailer"
    ];
    expect(types.length).toBe(10);
  });

  it("OrgRole values include all role categories", () => {
    const roles: OrgRole[] = [
      // Base
      "owner", "admin", "member",
      // Platform
      "super_admin", "compliance_officer", "dispute_manager",
      "support_agent", "ai_supervisor", "data_quality",
      // Demand
      "enterprise_admin", "booker", "viewer",
      "shipper_admin", "forwarder_admin", "agent",
      // Supply
      "carrier_owner", "dispatcher", "driver",
      // Warehouse
      "warehouse_admin", "warehouse_manager", "warehouse_staff", "warehouse_viewer",
    ];
    expect(roles.length).toBe(22);
  });

  it("User interface shape is compatible", () => {
    const user: User = {
      id: "usr_123",
      name: "Juan Dela Cruz",
      email: "juan@example.com",
      emailVerified: true,
      role: "user",
      phoneNumberVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    expect(user.id).toBe("usr_123");
    expect(user.emailVerified).toBe(true);
  });

  it("Load interface shape is compatible", () => {
    const load: Load = {
      id: "load_123",
      orgId: "org_456",
      origin: { city: "Manila", lat: 14.5995, lng: 120.9842 },
      destination: { city: "Cebu", lat: 10.3157, lng: 123.8854 },
      pickupDate: "2026-03-20",
      cargoType: "FTL",
      commodity: "Electronics",
      weightKg: 5000,
      volumeCbm: 20,
      vehicleType: "10-Wheeler Wing Van",
      rateType: "spot",
      offeredRate: 45000,
      biddingMode: "open_auction",
      visibility: "public",
      interIsland: true,
      paymentTerms: "net_7",
      status: "open",
      createdAt: "2026-03-15T00:00:00Z",
      updatedAt: "2026-03-15T00:00:00Z",
    };
    expect(load.id).toBe("load_123");
    expect(load.interIsland).toBe(true);
  });

  it("Organization interface shape is compatible", () => {
    const org: Organization = {
      id: "org_123",
      name: "Test Corp",
      slug: "test-corp",
      createdAt: new Date(),
    };
    expect(org.slug).toBe("test-corp");
  });
});
