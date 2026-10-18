interface User {
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
type PlatformRole = "user" | "admin" | "super_admin";
interface Session {
    id: string;
    userId: string;
    token: string;
    expiresAt: Date;
    ipAddress?: string;
    userAgent?: string;
    activeOrganizationId?: string | null;
}
interface Organization {
    id: string;
    name: string;
    slug: string;
    logo?: string | null;
    metadata?: OrgMetadata;
    createdAt: Date;
}
type OrgType = "tc_platform" | "enterprise_shipper" | "msme_shipper" | "carrier_fleet" | "freight_forwarder" | "warehouse_operator";
interface OrgMetadata {
    type?: OrgType;
    marketplace_status?: MarketplaceStatus;
    marketplace_application?: MarketplaceApplication;
    [key: string]: unknown;
}
type MarketplaceStatus = "not_listed" | "pending_review" | "approved" | "rejected" | "suspended";
interface MarketplaceApplication {
    submittedAt: string;
    businessDocuments: {
        dtiSec?: string;
        bir?: string;
        mayorsPermit?: string;
    };
    serviceProfile: ShipperProfile | CarrierProfile | WarehouseProfile;
    termsAcceptedAt: string;
}
interface ShipperProfile {
    type: "shipper";
    commodityTypes: string[];
    monthlyVolume: string;
    preferredRoutes: string[];
    preferredVehicleTypes: string[];
    specialRequirements?: string[];
}
interface CarrierProfile {
    type: "carrier";
    fleetSize: number;
    vehicleTypes: VehicleType[];
    serviceAreas: string[];
    ltfrbAccreditation?: string;
    insuranceCoverage?: string;
    specializations: string[];
}
interface WarehouseProfile {
    type: "warehouse";
    facilityType: string[];
    totalArea: number;
    availableArea: number;
    zones: {
        name: string;
        area: number;
        temperature?: string;
    }[];
    certifications: string[];
    operatingHours: string;
}
interface Member {
    id: string;
    userId: string;
    organizationId: string;
    role: OrgRole;
    createdAt: Date;
    user?: User;
}
type OrgRole = "owner" | "admin" | "member" | "super_admin" | "compliance_officer" | "dispute_manager" | "support_agent" | "ai_supervisor" | "data_quality" | "enterprise_admin" | "booker" | "viewer" | "shipper_admin" | "forwarder_admin" | "agent" | "carrier_owner" | "dispatcher" | "driver" | "warehouse_admin" | "warehouse_manager" | "warehouse_staff" | "warehouse_viewer";
type CargoType = "FTL" | "LTL" | "Reefer" | "Hazmat" | "Inter-Island";
type VehicleType = "4-Wheeler" | "6-Wheeler Closed Van" | "6-Wheeler Open" | "10-Wheeler Wing Van" | "10-Wheeler Closed Van" | "Reefer Van" | "Flatbed" | "Tanker" | "Container Truck" | "Trailer";
type BiddingMode = "open_auction" | "sealed_bid" | "direct_award" | "instant_book";
type LoadStatus = "draft" | "posted" | "open" | "bidding" | "awarded" | "in_transit" | "delivered" | "cancelled";
type RateType = "spot" | "contract";
type PaymentTerms = "cod" | "net_7" | "net_15" | "net_30";
interface Location {
    city: string;
    province?: string;
    region?: string;
    lat: number;
    lng: number;
}
interface Load {
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
type BidStatus = "pending" | "accepted" | "rejected" | "withdrawn" | "expired";
interface Bid {
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
interface Carrier {
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
interface Warehouse {
    id: string;
    orgId: string;
    name: string;
    location: Location & {
        province: string;
    };
    totalArea: number;
    availableArea: number;
    types: string[];
    rate: number;
    rating: number;
    zones: {
        name: string;
        area: number;
        temperature: string;
        shelves: number;
    }[];
    loadingDocks: number;
    operatingHours: string;
    security: string[];
    certifications: string[];
    contactPerson: string;
    phone: string;
}
type TripStatus = "assigned" | "pickup" | "in_transit" | "at_port" | "delivered" | "completed" | "cancelled";
interface Trip {
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
interface InventoryItem {
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
type PaymentStatus = "pending" | "processing" | "completed" | "failed" | "refunded";
interface Payment {
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
interface ApiKey {
    id: string;
    orgId: string;
    name: string;
    prefix: string;
    expiresAt?: Date;
    lastUsedAt?: Date;
    revokedAt?: Date;
    createdAt: Date;
}
type WebhookEventType = "user.created" | "user.updated" | "user.banned" | "user.unbanned" | "session.created" | "session.revoked" | "organization.created" | "organization.updated" | "organization.deleted" | "member.added" | "member.removed" | "member.role_updated" | "api_key.created" | "api_key.revoked" | "load.created" | "load.updated" | "load.cancelled" | "bid.placed" | "bid.accepted" | "bid.rejected" | "trip.started" | "trip.completed" | "payment.completed" | "payment.failed";
interface Notification {
    id: string;
    userId: string;
    type: string;
    title: string;
    body: string;
    read: boolean;
    data?: Record<string, unknown>;
    createdAt: string;
}
interface CarbonEstimate {
    loadId: string;
    distanceKm: number;
    vehicleType: VehicleType;
    estimatedCO2Kg: number;
    methodology: string;
}
type PhRegion = "NCR" | "CAR" | "Region I" | "Region II" | "Region III" | "CALABARZON" | "MIMAROPA" | "Region V" | "Region VI" | "Region VII" | "Region VIII" | "Region IX" | "Region X" | "Region XI" | "Region XII" | "CARAGA" | "BARMM";
declare const PH_MAJOR_PORTS: readonly [{
    readonly name: "Manila International Container Terminal";
    readonly city: "Manila";
    readonly lat: 14.5939;
    readonly lng: 120.9593;
}, {
    readonly name: "Batangas Port";
    readonly city: "Batangas";
    readonly lat: 13.7565;
    readonly lng: 121.0583;
}, {
    readonly name: "Cebu International Port";
    readonly city: "Cebu";
    readonly lat: 10.2989;
    readonly lng: 123.8908;
}, {
    readonly name: "Cagayan de Oro Port";
    readonly city: "Cagayan de Oro";
    readonly lat: 8.4809;
    readonly lng: 124.6383;
}, {
    readonly name: "Davao Sasa Port";
    readonly city: "Davao";
    readonly lat: 7.0833;
    readonly lng: 125.6333;
}, {
    readonly name: "General Santos Port";
    readonly city: "General Santos";
    readonly lat: 6.0878;
    readonly lng: 125.1672;
}, {
    readonly name: "Subic Bay Freeport";
    readonly city: "Subic";
    readonly lat: 14.7944;
    readonly lng: 120.2828;
}, {
    readonly name: "Iloilo Port";
    readonly city: "Iloilo";
    readonly lat: 10.6918;
    readonly lng: 122.5644;
}];

export { type ApiKey, type Bid, type BidStatus, type BiddingMode, type CarbonEstimate, type CargoType, type Carrier, type CarrierProfile, type InventoryItem, type Load, type LoadStatus, type Location, type MarketplaceApplication, type MarketplaceStatus, type Member, type Notification, type OrgMetadata, type OrgRole, type OrgType, type Organization, PH_MAJOR_PORTS, type Payment, type PaymentStatus, type PaymentTerms, type PhRegion, type PlatformRole, type RateType, type Session, type ShipperProfile, type Trip, type TripStatus, type User, type VehicleType, type Warehouse, type WarehouseProfile, type WebhookEventType };
