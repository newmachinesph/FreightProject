// ─── User Types ───
export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  role: PlatformRole;
  phoneNumber?: string | null;
  phoneNumberVerified: boolean;
  banned?: boolean;
  banReason?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type PlatformRole = "user" | "admin" | "super_admin";

// ─── Session Types ───
export interface Session {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  ipAddress?: string;
  userAgent?: string;
  activeOrganizationId?: string | null;
}

// ─── Organization Types ───
export interface Organization {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
  metadata?: OrgMetadata;
  createdAt: Date;
}

export type OrgType = "tc_platform" | "enterprise_shipper" | "msme_shipper" | "carrier_fleet" | "freight_forwarder" | "warehouse_operator";

export interface OrgMetadata {
  type?: OrgType;
  marketplace_status?: MarketplaceStatus;
  marketplace_application?: MarketplaceApplication;
  [key: string]: unknown;
}

export type MarketplaceStatus = "not_listed" | "pending_review" | "approved" | "rejected" | "suspended";

export interface MarketplaceApplication {
  submittedAt: string;
  businessDocuments: {
    dtiSec?: string;
    bir?: string;
    mayorsPermit?: string;
  };
  serviceProfile: ShipperProfile | CarrierProfile | WarehouseProfile;
  termsAcceptedAt: string;
}

// ─── Service Profiles ───
export interface ShipperProfile {
  type: "shipper";
  commodityTypes: string[];
  monthlyVolume: string;
  preferredRoutes: string[];
  preferredVehicleTypes: string[];
  specialRequirements?: string[];
}

export interface CarrierProfile {
  type: "carrier";
  fleetSize: number;
  vehicleTypes: VehicleType[];
  serviceAreas: string[];
  ltfrbAccreditation?: string;
  insuranceCoverage?: string;
  specializations: string[];
}

export interface WarehouseProfile {
  type: "warehouse";
  facilityType: string[];
  totalArea: number;
  availableArea: number;
  zones: { name: string; area: number; temperature?: string }[];
  certifications: string[];
  operatingHours: string;
}

// ─── Member Types ───
export interface Member {
  id: string;
  userId: string;
  organizationId: string;
  role: OrgRole;
  createdAt: Date;
  user?: User;
}

export type OrgRole =
  | "owner" | "admin" | "member"
  | "super_admin" | "compliance_officer" | "dispute_manager"
  | "support_agent" | "ai_supervisor" | "data_quality"
  | "enterprise_admin" | "booker" | "viewer"
  | "shipper_admin" | "forwarder_admin" | "agent"
  | "carrier_owner" | "dispatcher" | "driver"
  | "warehouse_admin" | "warehouse_manager" | "warehouse_staff" | "warehouse_viewer";

// ─── Load Types ───
export type CargoType = "FTL" | "LTL" | "Reefer" | "Hazmat" | "Inter-Island";
export type VehicleType = "4-Wheeler" | "6-Wheeler Closed Van" | "6-Wheeler Open" | "10-Wheeler Wing Van" | "10-Wheeler Closed Van" | "Reefer Van" | "Flatbed" | "Tanker" | "Container Truck" | "Trailer";
export type BiddingMode = "open_auction" | "sealed_bid" | "direct_award" | "instant_book";
export type LoadStatus = "draft" | "posted" | "open" | "bidding" | "awarded" | "in_transit" | "delivered" | "cancelled";
export type RateType = "spot" | "contract";
export type PaymentTerms = "cod" | "net_7" | "net_15" | "net_30";

export interface Location {
  city: string;
  province?: string;
  region?: string;
  lat: number;
  lng: number;
}

export interface Load {
  id: string;
  orgId: string;
  origin: Location;
  destination: Location;
  pickupDate: string;
  pickupWindow?: string;
  cargoType: CargoType;
  commodity: string;
  weightKg: number;
  volumeCbm: number;
  vehicleType: VehicleType;
  numUnits?: number;
  rateType: RateType;
  offeredRate: number;
  biddingMode: BiddingMode;
  bidDeadline?: string;
  visibility: "public" | "private";
  interIsland: boolean;
  roroRoute?: string;
  paymentTerms: PaymentTerms;
  specialRequirements?: string[];
  status: LoadStatus;
  createdAt: string;
  updatedAt: string;
}

// ─── Bid Types ───
export type BidStatus = "pending" | "accepted" | "rejected" | "withdrawn" | "expired";

export interface Bid {
  id: string;
  loadId: string;
  carrierId: string;
  carrierOrgId: string;
  amount: number;
  currency: string;
  eta: string;
  notes?: string;
  status: BidStatus;
  createdAt: string;
}

// ─── Carrier Types ───
export interface Carrier {
  id: string;
  orgId: string;
  name: string;
  location: Location;
  vehicleCount: number;
  vehicleTypes: VehicleType[];
  lanes: string[];
  rating: number;
  completedTrips: number;
  baseRate: number;
  verified: boolean;
  specializations: string[];
  ltfrb?: string;
  insurance?: string;
  contactPerson: string;
  phone: string;
}

// ─── Warehouse Types ───
export interface Warehouse {
  id: string;
  orgId: string;
  name: string;
  location: Location & { province: string };
  totalArea: number;
  availableArea: number;
  types: string[];
  rate: number;
  rating: number;
  zones: { name: string; area: number; temperature: string; shelves: number }[];
  loadingDocks: number;
  operatingHours: string;
  security: string[];
  certifications: string[];
  contactPerson: string;
  phone: string;
}

// ─── Trip Types ───
export type TripStatus = "assigned" | "pickup" | "in_transit" | "at_port" | "delivered" | "completed" | "cancelled";

export interface Trip {
  id: string;
  loadId: string;
  carrierId: string;
  driverId?: string;
  vehicleId?: string;
  status: TripStatus;
  currentLocation?: Location;
  estimatedArrival?: string;
  actualPickup?: string;
  actualDelivery?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Inventory Types (Warehouse) ───
export interface InventoryItem {
  id: string;
  warehouseId: string;
  sku: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  zoneId: string;
  minStock: number;
  maxStock: number;
  expirationDate?: string;
  batchNumber?: string;
  status: "in_stock" | "low_stock" | "out_of_stock" | "expired";
  lastUpdated: string;
}

// ─── Payment Types ───
export type PaymentStatus = "pending" | "processing" | "completed" | "failed" | "refunded";

export interface Payment {
  id: string;
  loadId: string;
  payerId: string;
  payeeId: string;
  amount: number;
  currency: string;
  method: "gcash" | "bank_transfer" | "check" | "card";
  status: PaymentStatus;
  dueDate: string;
  paidAt?: string;
  createdAt: string;
}

// ─── API Key Types ───
export interface ApiKey {
  id: string;
  orgId: string;
  name: string;
  prefix: string;
  expiresAt?: Date;
  lastUsedAt?: Date;
  revokedAt?: Date;
  createdAt: Date;
}

// ─── Webhook Types ───
export type WebhookEventType =
  | "user.created" | "user.updated" | "user.banned" | "user.unbanned"
  | "session.created" | "session.revoked"
  | "organization.created" | "organization.updated" | "organization.deleted"
  | "member.added" | "member.removed" | "member.role_updated"
  | "api_key.created" | "api_key.revoked"
  | "load.created" | "load.updated" | "load.cancelled"
  | "bid.placed" | "bid.accepted" | "bid.rejected"
  | "trip.started" | "trip.completed"
  | "payment.completed" | "payment.failed";

// ─── Notification Types ───
export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  body: string;
  read: boolean;
  data?: Record<string, unknown>;
  createdAt: string;
}

// ─── Carbon / Sustainability ───
export interface CarbonEstimate {
  loadId: string;
  distanceKm: number;
  vehicleType: VehicleType;
  estimatedCO2Kg: number;
  methodology: string;
}

// ─── Philippine Geography ───
export type PhRegion = "NCR" | "CAR" | "Region I" | "Region II" | "Region III" | "CALABARZON" | "MIMAROPA" | "Region V" | "Region VI" | "Region VII" | "Region VIII" | "Region IX" | "Region X" | "Region XI" | "Region XII" | "CARAGA" | "BARMM";

export const PH_MAJOR_PORTS = [
  { name: "Manila International Container Terminal", city: "Manila", lat: 14.5939, lng: 120.9593 },
  { name: "Batangas Port", city: "Batangas", lat: 13.7565, lng: 121.0583 },
  { name: "Cebu International Port", city: "Cebu", lat: 10.2989, lng: 123.8908 },
  { name: "Cagayan de Oro Port", city: "Cagayan de Oro", lat: 8.4809, lng: 124.6383 },
  { name: "Davao Sasa Port", city: "Davao", lat: 7.0833, lng: 125.6333 },
  { name: "General Santos Port", city: "General Santos", lat: 6.0878, lng: 125.1672 },
  { name: "Subic Bay Freeport", city: "Subic", lat: 14.7944, lng: 120.2828 },
  { name: "Iloilo Port", city: "Iloilo", lat: 10.6918, lng: 122.5644 },
] as const;
