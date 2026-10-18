"use client";
import { useState, useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import VehicleIcon from "@/components/VehicleIcon";
import {
  Users, Phone, CreditCard, Truck, Search, Plus,
  AlertTriangle, Check, X, ChevronDown, ChevronUp, Shield,
  Calendar, Navigation, Star, Clock, MapPin, Heart,
  Activity, FileText, User,
} from "lucide-react";
import { drivers, vehicles, trips } from "@/lib/mock-data";
import type { Driver } from "@/lib/mock-data";

const statusStyle: Record<string, { bg: string; color: string; label: string }> = {
  active: { bg: "#DCFCE7", color: "#16A34A", label: "Active" },
  on_trip: { bg: "#DBEAFE", color: "#2563EB", label: "On Trip" },
  off_duty: { bg: "#FEF3C7", color: "#D97706", label: "Off Duty" },
  inactive: { bg: "#F3F4F6", color: "#6B7280", label: "Inactive" },
};

/** Get license expiry status with color coding */
function getLicenseStatus(expiryDate: string): { daysLeft: number; color: string; bg: string; label: string } {
  const expiry = new Date(expiryDate);
  const now = new Date("2026-03-20");
  const diff = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (diff < 0) return { daysLeft: diff, color: "#DC2626", bg: "#FEE2E2", label: "Expired" };
  if (diff <= 30) return { daysLeft: diff, color: "#DC2626", bg: "#FEE2E2", label: `${diff}d left` };
  if (diff <= 90) return { daysLeft: diff, color: "#D97706", bg: "#FEF3C7", label: `${diff}d left` };
  return { daysLeft: diff, color: "#16A34A", bg: "#DCFCE7", label: "Valid" };
}

// ── Mock driver compliance data ─────────────────────────────────────────────
const driverCompliance: Record<string, { drugTest: string; medicalClearance: string; nbiClearance: string; licenseType: string }> = {
  d1: { drugTest: "2026-01-15", medicalClearance: "2026-02-10", nbiClearance: "2027-01-20", licenseType: "Professional" },
  d2: { drugTest: "2025-11-20", medicalClearance: "2025-12-05", nbiClearance: "2026-08-15", licenseType: "Professional" },
  d3: { drugTest: "2026-02-28", medicalClearance: "2026-03-01", nbiClearance: "2027-06-10", licenseType: "Professional" },
  d4: { drugTest: "2026-03-10", medicalClearance: "2026-03-12", nbiClearance: "2027-03-20", licenseType: "Professional" },
  d5: { drugTest: "2025-08-15", medicalClearance: "2025-09-01", nbiClearance: "2027-05-10", licenseType: "Professional (1-2-3)" },
  d6: { drugTest: "2026-01-22", medicalClearance: "2026-01-25", nbiClearance: "2027-11-20", licenseType: "Professional" },
};

// ── Mock driver performance stats ───────────────────────────────────────────
const driverPerformance: Record<string, { tripsCompleted: number; onTimePercent: number; rating: number }> = {
  d1: { tripsCompleted: 342, onTimePercent: 96, rating: 4.9 },
  d2: { tripsCompleted: 215, onTimePercent: 89, rating: 4.5 },
  d3: { tripsCompleted: 478, onTimePercent: 94, rating: 4.7 },
  d4: { tripsCompleted: 289, onTimePercent: 92, rating: 4.6 },
  d5: { tripsCompleted: 561, onTimePercent: 97, rating: 4.8 },
  d6: { tripsCompleted: 198, onTimePercent: 91, rating: 4.4 },
};

// ── Mock trip history for each driver ───────────────────────────────────────
const driverTripHistory: Record<string, { date: string; route: string; status: string; cargo: string }[]> = {
  d1: [
    { date: "Mar 8-9, 2026", route: "Bulacan to Legazpi", status: "Delivered", cargo: "Rice (50kg sacks)" },
    { date: "Mar 2, 2026", route: "Meycauayan to Tarlac", status: "Delivered", cargo: "FMCG Grocery" },
    { date: "Feb 25, 2026", route: "QC to Baguio", status: "Delivered", cargo: "Beverages" },
    { date: "Feb 18, 2026", route: "Valenzuela to Angeles", status: "Delivered", cargo: "Garments" },
    { date: "Feb 10, 2026", route: "Manila to Pampanga", status: "Delivered", cargo: "Electronics" },
  ],
  d2: [
    { date: "Mar 18, 2026", route: "QC to Baguio", status: "In Transit", cargo: "Beverages (Cases)" },
    { date: "Mar 10, 2026", route: "Valenzuela to Tarlac", status: "Delivered", cargo: "FMCG" },
    { date: "Mar 1, 2026", route: "Manila to Dagupan", status: "Delivered", cargo: "Canned Goods" },
    { date: "Feb 20, 2026", route: "Bulacan to Baguio", status: "Delivered", cargo: "Fresh Produce" },
    { date: "Feb 12, 2026", route: "QC to Clark", status: "Delivered", cargo: "Office Supplies" },
  ],
  d3: [
    { date: "Mar 14, 2026", route: "Pampanga to Makati", status: "Delivered", cargo: "Office Furniture" },
    { date: "Mar 5, 2026", route: "Bulacan to Pasig", status: "Delivered", cargo: "Construction Materials" },
    { date: "Feb 28, 2026", route: "Meycauayan to BGC", status: "Delivered", cargo: "Electronics" },
    { date: "Feb 18, 2026", route: "Pampanga to Quezon City", status: "Delivered", cargo: "Textiles" },
    { date: "Feb 8, 2026", route: "San Fernando to Makati", status: "Delivered", cargo: "Furniture" },
  ],
  d4: [
    { date: "Mar 17, 2026", route: "Batangas to Davao", status: "In Transit", cargo: "Canned Goods" },
    { date: "Mar 8, 2026", route: "Manila to Iloilo", status: "Delivered", cargo: "Electronics" },
    { date: "Feb 25, 2026", route: "Cavite to Cebu", status: "Delivered", cargo: "Auto Parts" },
    { date: "Feb 15, 2026", route: "Manila to Bacolod", status: "Delivered", cargo: "FMCG" },
    { date: "Feb 5, 2026", route: "Batangas to CDO", status: "Delivered", cargo: "Construction" },
  ],
  d5: [
    { date: "Mar 16, 2026", route: "Manila to Cebu", status: "In Transit", cargo: "Frozen Seafood" },
    { date: "Feb 25-Mar 1", route: "Manila to GenSan", status: "Delivered", cargo: "Electronics" },
    { date: "Feb 15-22", route: "Taguig to Zamboanga", status: "Delivered", cargo: "Construction" },
    { date: "Feb 5, 2026", route: "Subic to CDO", status: "Delivered", cargo: "Auto Parts" },
    { date: "Jan 28, 2026", route: "Manila to Davao", status: "Delivered", cargo: "Canned Goods" },
  ],
  d6: [
    { date: "Mar 10-13", route: "Laguna to Iloilo", status: "Delivered", cargo: "Frozen Meat" },
    { date: "Mar 2, 2026", route: "Manila to Cebu", status: "Delivered", cargo: "Frozen Seafood" },
    { date: "Feb 20, 2026", route: "Bulacan to Batangas", status: "Delivered", cargo: "Perishables" },
    { date: "Feb 10, 2026", route: "QC to Laguna", status: "Delivered", cargo: "Dairy Products" },
    { date: "Jan 30, 2026", route: "Manila to Pampanga", status: "Delivered", cargo: "Reefer Cargo" },
  ],
};

/** Render star rating with filled/half/empty stars */
function StarRating({ rating, size = 14, showValue = true }: { rating: number; size?: number; showValue?: boolean }) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.3 && rating - full < 0.8;
  const stars = [];
  for (let i = 0; i < 5; i++) {
    if (i < full) {
      stars.push(<Star key={i} size={size} fill="#F59E0B" color="#F59E0B" />);
    } else if (i === full && hasHalf) {
      stars.push(
        <span key={i} style={{ position: "relative", display: "inline-block", width: size, height: size }}>
          <Star size={size} fill="none" color="#E5E7EB" style={{ position: "absolute", top: 0, left: 0 }} />
          <span style={{ position: "absolute", top: 0, left: 0, width: "50%", overflow: "hidden" }}>
            <Star size={size} fill="#F59E0B" color="#F59E0B" />
          </span>
        </span>
      );
    } else {
      stars.push(<Star key={i} size={size} fill="none" color="#E5E7EB" />);
    }
  }
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 2 }}>
      {stars}
      {showValue && <span style={{ marginLeft: 4, fontSize: size - 2, fontWeight: 600, color: "#374151" }}>{rating.toFixed(1)}</span>}
    </span>
  );
}

export default function DriversPage() {
  const [search, setSearch] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [newDriver, setNewDriver] = useState({
    name: "", phone: "", licenseNo: "", licenseExpiry: "",
    vehicleAssigned: "", age: "", address: "", emergencyContact: "",
  });

  const filtered = drivers.filter((d) =>
    search === "" ||
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.licenseNo.toLowerCase().includes(search.toLowerCase()) ||
    (d.vehicleAssigned || "").toLowerCase().includes(search.toLowerCase())
  );

  // Trip count per driver
  const tripCountMap = useMemo(() => {
    const map: Record<string, number> = {};
    trips.forEach((t) => {
      if (!map[t.driver]) map[t.driver] = 0;
      map[t.driver] += 1;
    });
    return map;
  }, []);

  // Get vehicle details for a plate number
  const getVehicleByPlate = (plate: string | null) => {
    if (!plate) return null;
    return vehicles.find((v) => v.plateNo === plate) || null;
  };

  // Check for expiring licenses (within 90 days)
  const criticalLicenses = drivers.filter((d) => {
    const status = getLicenseStatus(d.licenseExpiry);
    return status.daysLeft <= 30 && status.daysLeft >= 0;
  });
  const warningLicenses = drivers.filter((d) => {
    const status = getLicenseStatus(d.licenseExpiry);
    return status.daysLeft > 30 && status.daysLeft <= 90;
  });

  const handleAddDriver = () => {
    if (!newDriver.name || !newDriver.phone || !newDriver.licenseNo) {
      alert("Please fill in name, phone, and license number.");
      return;
    }
    setShowAddForm(false);
    setNewDriver({ name: "", phone: "", licenseNo: "", licenseExpiry: "", vehicleAssigned: "", age: "", address: "", emergencyContact: "" });
  };

  // ── Driver Profile Detail View ──────────────────────────────────────────
  if (selectedDriver) {
    const driver = selectedDriver;
    const licenseStatus = getLicenseStatus(driver.licenseExpiry);
    const assignedVehicle = getVehicleByPlate(driver.vehicleAssigned);
    const compliance = driverCompliance[driver.id] || { drugTest: "N/A", medicalClearance: "N/A", nbiClearance: "N/A", licenseType: "Professional" };
    const performance = driverPerformance[driver.id] || { tripsCompleted: 0, onTimePercent: 0, rating: 0 };
    const tripHistory = driverTripHistory[driver.id] || [];
    const ss = statusStyle[driver.status];

    return (
      <DashboardLayout>
        {/* Back Button */}
        <button onClick={() => setSelectedDriver(null)} style={{
          display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8,
          border: "1px solid #E5E7EB", background: "#FFFFFF", color: "#6B7280",
          fontSize: 13, fontWeight: 600, cursor: "pointer", marginBottom: 20,
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Drivers
        </button>

        {/* Driver Header */}
        <div style={{
          background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 12,
          padding: 24, marginBottom: 24, display: "flex", alignItems: "center", gap: 24,
        }}>
          {/* Avatar */}
          <div style={{
            width: 80, height: 80, borderRadius: "50%", background: "#EFF6FF",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 28, fontWeight: 800, color: "#2563EB", flexShrink: 0,
            border: "3px solid #DBEAFE",
          }}>
            {driver.name.split(" ").map(n => n[0]).join("")}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: "#111827", margin: 0 }}>{driver.name}</h1>
              <span style={{
                padding: "3px 12px", borderRadius: 20, fontSize: 11, fontWeight: 600,
                background: ss.bg, color: ss.color,
              }}>
                {ss.label}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "#6B7280" }}>
                <User size={13} /> {driver.age} years old
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "#6B7280" }}>
                <Phone size={13} /> {driver.phone}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "#6B7280" }}>
                <MapPin size={13} /> {driver.address}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "#6B7280" }}>
                <Heart size={13} /> Emergency: {driver.emergencyContact}
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          {/* Personal Info */}
          <div style={profilePanel}>
            <h3 style={profileSectionTitle}><User size={16} /> Personal Information</h3>
            <div style={{ display: "grid", gap: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <ProfileDetail label="Full Name" value={driver.name} />
                <ProfileDetail label="Age" value={`${driver.age} years old`} />
              </div>
              <ProfileDetail label="Mobile Number" value={driver.phone} />
              <ProfileDetail label="Home Address" value={driver.address} />
              <ProfileDetail label="Emergency Contact" value={driver.emergencyContact} />
            </div>
          </div>

          {/* License Details */}
          <div style={profilePanel}>
            <h3 style={profileSectionTitle}><CreditCard size={16} /> License Details</h3>
            <div style={{ display: "grid", gap: 14 }}>
              <ProfileDetail label="License Number" value={driver.licenseNo} mono />
              <ProfileDetail label="License Type" value={compliance.licenseType} />
              <div>
                <div style={detailLabel}>EXPIRY DATE</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{driver.licenseExpiry}</span>
                  <span style={{
                    padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 700,
                    background: licenseStatus.bg, color: licenseStatus.color,
                  }}>
                    {licenseStatus.daysLeft < 0 ? "EXPIRED" : `${licenseStatus.daysLeft} days left`}
                  </span>
                </div>
              </div>
              {/* Countdown bar */}
              <div>
                <div style={detailLabel}>LICENSE VALIDITY</div>
                <div style={{ height: 8, background: "#F3F4F6", borderRadius: 4 }}>
                  <div style={{
                    height: "100%", borderRadius: 4,
                    width: `${Math.min(100, Math.max(0, (licenseStatus.daysLeft / 1095) * 100))}%`,
                    background: licenseStatus.color,
                    transition: "width 0.3s ease",
                  }} />
                </div>
              </div>
            </div>
          </div>

          {/* Assigned Vehicle */}
          <div style={profilePanel}>
            <h3 style={profileSectionTitle}><Truck size={16} /> Assigned Vehicle</h3>
            {assignedVehicle ? (
              <div>
                <div style={{
                  display: "flex", alignItems: "center", gap: 16, padding: 16,
                  background: "#EFF6FF", borderRadius: 10, border: "1px solid #BFDBFE", marginBottom: 14,
                }}>
                  <VehicleIcon type={assignedVehicle.type} size={56} color="#2563EB" />
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: "#111827" }}>{assignedVehicle.plateNo}</div>
                    <div style={{ fontSize: 13, color: "#6B7280", marginTop: 2 }}>
                      {assignedVehicle.make} - {assignedVehicle.type}
                    </div>
                    <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>
                      {assignedVehicle.capacity.kg.toLocaleString()} kg / {assignedVehicle.capacity.cbm} CBM
                    </div>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <ProfileDetail label="Body Type" value={assignedVehicle.bodyType} />
                  <ProfileDetail label="Year Model" value={String(assignedVehicle.yearModel)} />
                  <ProfileDetail label="Fuel Type" value={assignedVehicle.fuelType} />
                  <ProfileDetail label="Reefer" value={assignedVehicle.reefer ? "Yes" : "No"} />
                </div>
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: 32, color: "#9CA3AF" }}>
                <Truck size={32} color="#D1D5DB" />
                <div style={{ marginTop: 8, fontSize: 13, fontWeight: 600 }}>No vehicle assigned</div>
              </div>
            )}
          </div>

          {/* Performance Stats */}
          <div style={profilePanel}>
            <h3 style={profileSectionTitle}><Activity size={16} /> Performance Stats</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              <div style={{ textAlign: "center", padding: 14, background: "#F9FAFB", borderRadius: 8 }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: "#2563EB" }}>{performance.tripsCompleted}</div>
                <div style={{ fontSize: 11, color: "#6B7280" }}>Trips Done</div>
              </div>
              <div style={{ textAlign: "center", padding: 14, background: "#F9FAFB", borderRadius: 8 }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: "#16A34A" }}>{performance.onTimePercent}%</div>
                <div style={{ fontSize: 11, color: "#6B7280" }}>On-Time</div>
              </div>
              <div style={{ textAlign: "center", padding: 14, background: "#F9FAFB", borderRadius: 8 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                  <span style={{ fontSize: 24, fontWeight: 800, color: "#F59E0B" }}>{performance.rating}</span>
                  <Star size={16} color="#F59E0B" fill="#F59E0B" />
                </div>
                <div style={{ fontSize: 11, color: "#6B7280" }}>Rating</div>
              </div>
            </div>
            {/* Rating stars visual */}
            <div style={{ display: "flex", justifyContent: "center", marginTop: 12, padding: "8px 0" }}>
              <StarRating rating={performance.rating} size={20} showValue={false} />
            </div>
          </div>

          {/* Trip History */}
          <div style={{ ...profilePanel, gridColumn: "1 / -1" }}>
            <h3 style={profileSectionTitle}><Navigation size={16} /> Trip History (Last 5)</h3>
            <div style={{ overflow: "hidden", borderRadius: 8, border: "1px solid #E5E7EB" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: "#F9FAFB" }}>
                    <th style={thStyle}>Date</th>
                    <th style={thStyle}>Route</th>
                    <th style={thStyle}>Cargo</th>
                    <th style={thStyle}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {tripHistory.map((trip, idx) => (
                    <tr key={idx} style={{ borderBottom: idx < tripHistory.length - 1 ? "1px solid #F3F4F6" : "none" }}>
                      <td style={tdStyle}>
                        <span style={{ fontSize: 12, color: "#6B7280", fontWeight: 500 }}>{trip.date}</span>
                      </td>
                      <td style={tdStyle}>
                        <span style={{ fontWeight: 600, color: "#111827" }}>{trip.route}</span>
                      </td>
                      <td style={tdStyle}>
                        <span style={{ color: "#6B7280" }}>{trip.cargo}</span>
                      </td>
                      <td style={tdStyle}>
                        <span style={{
                          padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600,
                          background: trip.status === "Delivered" ? "#DCFCE7" : "#DBEAFE",
                          color: trip.status === "Delivered" ? "#16A34A" : "#2563EB",
                        }}>
                          {trip.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Compliance */}
          <div style={{ ...profilePanel, gridColumn: "1 / -1" }}>
            <h3 style={profileSectionTitle}><Shield size={16} /> Compliance &amp; Certifications</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
              <ComplianceCard
                label="Drug Test"
                date={compliance.drugTest}
                icon={<FileText size={16} />}
              />
              <ComplianceCard
                label="Medical Clearance"
                date={compliance.medicalClearance}
                icon={<Heart size={16} />}
              />
              <ComplianceCard
                label="NBI Clearance"
                date={compliance.nbiClearance}
                icon={<Shield size={16} />}
              />
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // ── Main Drivers List View ──────────────────────────────────────────────
  return (
    <DashboardLayout>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111827", margin: 0 }}>Drivers</h1>
            <p style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}>
              {drivers.length} drivers &middot; {drivers.filter((d) => d.status === "active").length} active &middot; {drivers.filter((d) => d.status === "on_trip").length} on trip
            </p>
          </div>
          <button onClick={() => setShowAddForm(!showAddForm)} style={{
            display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 8,
            border: "none", background: showAddForm ? "#DC2626" : "#2563EB", color: "#FFFFFF",
            fontSize: 13, fontWeight: 600, cursor: "pointer",
          }}>
            {showAddForm ? <><X size={14} /> Cancel</> : <><Plus size={16} /> Add Driver</>}
          </button>
        </div>
      </div>

      {/* License Expiry Alerts */}
      {criticalLicenses.length > 0 && (
        <div style={{ background: "#FEE2E2", border: "1px solid #FECACA", borderRadius: 10, padding: 14, marginBottom: 12, display: "flex", alignItems: "center", gap: 10 }}>
          <AlertTriangle size={18} color="#DC2626" />
          <div style={{ fontSize: 13, color: "#991B1B" }}>
            <strong>{criticalLicenses.length} license{criticalLicenses.length > 1 ? "s" : ""} expiring within 30 days:</strong>{" "}
            {criticalLicenses.map((d) => {
              const status = getLicenseStatus(d.licenseExpiry);
              return `${d.name} (${status.label})`;
            }).join(", ")}
          </div>
        </div>
      )}
      {warningLicenses.length > 0 && (
        <div style={{ background: "#FEF3C7", border: "1px solid #FDE68A", borderRadius: 10, padding: 14, marginBottom: 12, display: "flex", alignItems: "center", gap: 10 }}>
          <AlertTriangle size={18} color="#D97706" />
          <div style={{ fontSize: 13, color: "#92400E" }}>
            <strong>{warningLicenses.length} license{warningLicenses.length > 1 ? "s" : ""} expiring within 90 days:</strong>{" "}
            {warningLicenses.map((d) => {
              const status = getLicenseStatus(d.licenseExpiry);
              return `${d.name} (${status.label})`;
            }).join(", ")}
          </div>
        </div>
      )}

      {/* Add Driver Form */}
      {showAddForm && (
        <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 12, padding: 24, marginBottom: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: "0 0 16px 0" }}>Add New Driver</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div>
              <label style={labelStyle}>Full Name *</label>
              <input value={newDriver.name} onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })} placeholder="Juan Dela Cruz" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Phone Number *</label>
              <input value={newDriver.phone} onChange={(e) => setNewDriver({ ...newDriver, phone: e.target.value })} placeholder="+63 917 000 0000" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>License No. *</label>
              <input value={newDriver.licenseNo} onChange={(e) => setNewDriver({ ...newDriver, licenseNo: e.target.value })} placeholder="N04-24-000000" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>License Expiry</label>
              <input type="date" value={newDriver.licenseExpiry} onChange={(e) => setNewDriver({ ...newDriver, licenseExpiry: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Assign Vehicle</label>
              <select value={newDriver.vehicleAssigned} onChange={(e) => setNewDriver({ ...newDriver, vehicleAssigned: e.target.value })} style={{ ...inputStyle, background: "#FFFFFF", cursor: "pointer" }}>
                <option value="">None</option>
                {vehicles.filter((v) => !v.driver).map((v) => (
                  <option key={v.id} value={v.plateNo}>{v.plateNo} - {v.type}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Age</label>
              <input type="number" value={newDriver.age} onChange={(e) => setNewDriver({ ...newDriver, age: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Address</label>
              <input value={newDriver.address} onChange={(e) => setNewDriver({ ...newDriver, address: e.target.value })} placeholder="City, Province" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Emergency Contact</label>
              <input value={newDriver.emergencyContact} onChange={(e) => setNewDriver({ ...newDriver, emergencyContact: e.target.value })} placeholder="+63 917 000 0000" style={inputStyle} />
            </div>
          </div>
          <button onClick={handleAddDriver} style={{
            padding: "10px 24px", borderRadius: 8, border: "none",
            background: "#2563EB", color: "#FFFFFF", fontSize: 13, fontWeight: 600, cursor: "pointer",
          }}>
            Save Driver
          </button>
        </div>
      )}

      {/* Search */}
      <div style={{ marginBottom: 16, position: "relative", maxWidth: 300 }}>
        <Search size={14} color="#9CA3AF" style={{ position: "absolute", left: 10, top: 10 }} />
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, license, vehicle..."
          style={{ padding: "8px 12px 8px 32px", borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 13, width: "100%", outline: "none", boxSizing: "border-box" }} />
      </div>

      {/* Drivers Table */}
      <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#F9FAFB", borderBottom: "1px solid #E5E7EB" }}>
              {["Driver", "Phone", "License Expiry", "Vehicle Assigned", "Trips", "Status", ""].map((h) => (
                <th key={h} style={th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((driver) => {
              const ss = statusStyle[driver.status];
              const isExpanded = expandedId === driver.id;
              const licenseStatus = getLicenseStatus(driver.licenseExpiry);
              const assignedVehicle = getVehicleByPlate(driver.vehicleAssigned);
              const driverTripCount = tripCountMap[driver.name] || 0;

              return (
                <>
                  <tr key={driver.id} style={{ borderBottom: "1px solid #F3F4F6", cursor: "pointer" }} onClick={() => setExpandedId(isExpanded ? null : driver.id)}>
                    <td style={td}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#2563EB" }}>
                          {driver.name.charAt(0)}
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelectedDriver(driver); }}
                          style={{
                            fontWeight: 600, color: "#2563EB", background: "none", border: "none",
                            cursor: "pointer", fontSize: 13, padding: 0, textDecoration: "underline",
                            textDecorationColor: "transparent", transition: "text-decoration-color 0.15s",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.textDecorationColor = "#2563EB")}
                          onMouseLeave={(e) => (e.currentTarget.style.textDecorationColor = "transparent")}
                        >
                          {driver.name}
                        </button>
                      </div>
                    </td>
                    <td style={td}>
                      <a href={`tel:${driver.phone}`} style={{ display: "flex", alignItems: "center", gap: 4, color: "#2563EB", textDecoration: "none", fontSize: 12 }}>
                        <Phone size={11} /> {driver.phone}
                      </a>
                    </td>
                    <td style={td}>
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        {licenseStatus.daysLeft <= 90 && (
                          <AlertTriangle size={12} color={licenseStatus.color} />
                        )}
                        <span style={{
                          padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 600,
                          background: licenseStatus.bg, color: licenseStatus.color,
                        }}>
                          {licenseStatus.label}
                        </span>
                        <span style={{ fontSize: 11, color: "#9CA3AF", marginLeft: 4 }}>
                          {driver.licenseExpiry}
                        </span>
                      </div>
                    </td>
                    <td style={td}>
                      {assignedVehicle ? (
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <VehicleIcon type={assignedVehicle.type} size={28} color="#2563EB" />
                          <div>
                            <div style={{ fontWeight: 600, color: "#111827", fontSize: 12 }}>{assignedVehicle.plateNo}</div>
                            <div style={{ fontSize: 10, color: "#9CA3AF" }}>{assignedVehicle.type}</div>
                          </div>
                        </div>
                      ) : driver.vehicleAssigned ? (
                        <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13 }}>
                          <Truck size={12} color="#2563EB" />
                          <span style={{ fontWeight: 600, color: "#111827" }}>{driver.vehicleAssigned}</span>
                        </div>
                      ) : (
                        <span style={{ color: "#9CA3AF", fontSize: 12 }}>Unassigned</span>
                      )}
                    </td>
                    <td style={td}>
                      <div style={{
                        display: "inline-flex", alignItems: "center", gap: 4,
                        padding: "3px 10px", borderRadius: 6, fontSize: 12, fontWeight: 700,
                        background: driverTripCount > 2 ? "#DCFCE7" : driverTripCount > 0 ? "#EFF6FF" : "#F3F4F6",
                        color: driverTripCount > 2 ? "#16A34A" : driverTripCount > 0 ? "#2563EB" : "#9CA3AF",
                      }}>
                        <Navigation size={10} />
                        {driverTripCount} trip{driverTripCount !== 1 ? "s" : ""}
                      </div>
                    </td>
                    <td style={td}>
                      <span style={{
                        padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600,
                        background: ss.bg, color: ss.color,
                      }}>
                        {ss.label}
                      </span>
                    </td>
                    <td style={td}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelectedDriver(driver); }}
                          style={{
                            padding: "4px 10px", borderRadius: 6, border: "1px solid #E5E7EB",
                            background: "#FFFFFF", color: "#2563EB", fontSize: 11, fontWeight: 600,
                            cursor: "pointer",
                          }}
                        >
                          Profile
                        </button>
                        {isExpanded ? <ChevronUp size={14} color="#9CA3AF" /> : <ChevronDown size={14} color="#9CA3AF" />}
                      </div>
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr key={`${driver.id}-detail`} style={{ borderBottom: "1px solid #F3F4F6" }}>
                      <td colSpan={7} style={{ padding: 0 }}>
                        <div style={{ background: "#F9FAFB", padding: "16px 24px" }}>
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 16 }}>
                            <div>
                              <div style={{ fontSize: 10, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 0.5 }}>Age</div>
                              <div style={{ fontSize: 13, color: "#111827", fontWeight: 500 }}>{driver.age} years old</div>
                            </div>
                            <div>
                              <div style={{ fontSize: 10, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 0.5 }}>Address</div>
                              <div style={{ fontSize: 13, color: "#111827", fontWeight: 500 }}>{driver.address}</div>
                            </div>
                            <div>
                              <div style={{ fontSize: 10, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 0.5 }}>Emergency Contact</div>
                              <div style={{ fontSize: 13, color: "#111827", fontWeight: 500 }}>{driver.emergencyContact}</div>
                            </div>
                            <div>
                              <div style={{ fontSize: 10, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 0.5 }}>License No.</div>
                              <div style={{ fontSize: 13, fontFamily: "monospace", color: "#374151", fontWeight: 500 }}>{driver.licenseNo}</div>
                            </div>
                          </div>

                          {/* License & Vehicle Detail */}
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                            {/* License Status Card */}
                            <div style={{
                              padding: 12, borderRadius: 8,
                              background: licenseStatus.bg, border: `1px solid ${licenseStatus.color}20`,
                              display: "flex", alignItems: "center", gap: 10,
                            }}>
                              <Shield size={20} color={licenseStatus.color} />
                              <div>
                                <div style={{ fontSize: 12, fontWeight: 700, color: licenseStatus.color }}>
                                  {licenseStatus.daysLeft < 0 ? "License Expired" :
                                    licenseStatus.daysLeft <= 30 ? "License Expiring Soon" :
                                      licenseStatus.daysLeft <= 90 ? "License Expiring" : "License Valid"}
                                </div>
                                <div style={{ fontSize: 11, color: "#6B7280" }}>
                                  <Calendar size={10} style={{ marginRight: 3, verticalAlign: "middle" }} />
                                  Expires: {driver.licenseExpiry}
                                  {licenseStatus.daysLeft > 0 && <> ({licenseStatus.daysLeft} days remaining)</>}
                                </div>
                              </div>
                            </div>

                            {/* Vehicle Card */}
                            {assignedVehicle && (
                              <div style={{
                                padding: 12, borderRadius: 8, background: "#EFF6FF", border: "1px solid #BFDBFE",
                                display: "flex", alignItems: "center", gap: 10,
                              }}>
                                <VehicleIcon type={assignedVehicle.type} size={40} color="#2563EB" />
                                <div>
                                  <div style={{ fontSize: 12, fontWeight: 700, color: "#111827" }}>
                                    {assignedVehicle.plateNo} - {assignedVehicle.type}
                                  </div>
                                  <div style={{ fontSize: 11, color: "#6B7280" }}>
                                    {assignedVehicle.make} &middot; {assignedVehicle.capacity.kg.toLocaleString()} kg / {assignedVehicle.capacity.cbm} CBM
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Recent trips for this driver */}
                          {driverTripCount > 0 && (
                            <div style={{ marginTop: 16 }}>
                              <div style={{ fontSize: 11, fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>
                                Recent Trips ({driverTripCount})
                              </div>
                              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                {trips.filter((t) => t.driver === driver.name).slice(0, 4).map((t) => (
                                  <div key={t.id} style={{
                                    padding: "6px 12px", borderRadius: 6, fontSize: 11, fontWeight: 500,
                                    background: "#FFFFFF", border: "1px solid #E5E7EB",
                                    display: "flex", alignItems: "center", gap: 6,
                                  }}>
                                    <span style={{ color: "#9CA3AF", fontFamily: "monospace" }}>{t.id}</span>
                                    <span style={{ color: "#374151" }}>{t.origin.split("(")[0].trim()} → {t.destination.split("(")[0].trim()}</span>
                                    <span style={{
                                      padding: "1px 6px", borderRadius: 10, fontSize: 9, fontWeight: 600,
                                      background: t.status === "delivered" ? "#DCFCE7" : "#DBEAFE",
                                      color: t.status === "delivered" ? "#16A34A" : "#2563EB",
                                      textTransform: "capitalize",
                                    }}>
                                      {t.status.replace("_", " ")}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* View Full Profile button */}
                          <div style={{ marginTop: 16, textAlign: "right" }}>
                            <button
                              onClick={(e) => { e.stopPropagation(); setSelectedDriver(driver); }}
                              style={{
                                padding: "6px 16px", borderRadius: 6, border: "none",
                                background: "#2563EB", color: "#FFFFFF", fontSize: 12, fontWeight: 600,
                                cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6,
                              }}
                            >
                              <User size={12} /> View Full Profile
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: 40, color: "#9CA3AF" }}>No drivers match your search.</div>
      )}
    </DashboardLayout>
  );
}

// ── Helper Components ───────────────────────────────────────────────────────

function ProfileDetail({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <div style={detailLabel}>{label.toUpperCase()}</div>
      <div style={{ fontSize: 14, color: "#111827", fontWeight: 500, fontFamily: mono ? "monospace" : "inherit" }}>{value}</div>
    </div>
  );
}

function ComplianceCard({ label, date, icon }: { label: string; date: string; icon: React.ReactNode }) {
  const now = new Date("2026-03-20");
  const expDate = new Date(date);
  const daysLeft = Math.ceil((expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const isExpired = daysLeft < 0;
  const isExpiring = daysLeft >= 0 && daysLeft <= 90;

  return (
    <div style={{
      padding: 16, borderRadius: 10,
      background: isExpired ? "#FEF2F2" : isExpiring ? "#FFFBEB" : "#F0FDF4",
      border: `1px solid ${isExpired ? "#FECACA" : isExpiring ? "#FDE68A" : "#BBF7D0"}`,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <div style={{ color: isExpired ? "#DC2626" : isExpiring ? "#D97706" : "#16A34A" }}>
          {icon}
        </div>
        <span style={{
          padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 700,
          background: isExpired ? "#FEE2E2" : isExpiring ? "#FEF3C7" : "#DCFCE7",
          color: isExpired ? "#DC2626" : isExpiring ? "#D97706" : "#16A34A",
        }}>
          {isExpired ? "EXPIRED" : isExpiring ? "EXPIRING" : "VALID"}
        </span>
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{label}</div>
      <div style={{ fontSize: 12, color: "#6B7280", marginTop: 4 }}>
        <Calendar size={10} style={{ marginRight: 4, verticalAlign: "middle" }} />
        {date === "N/A" ? "No record" : date}
        {date !== "N/A" && !isExpired && <span style={{ marginLeft: 4, fontWeight: 600 }}>({daysLeft}d left)</span>}
      </div>
    </div>
  );
}

// ── Styles ──────────────────────────────────────────────────────────────────

const th: React.CSSProperties = {
  textAlign: "left", padding: "12px 14px", fontSize: 11, fontWeight: 600, color: "#6B7280",
  textTransform: "uppercase", letterSpacing: 0.5,
};
const td: React.CSSProperties = { padding: "12px 14px" };
const labelStyle: React.CSSProperties = { display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 };
const inputStyle: React.CSSProperties = {
  width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid #E5E7EB",
  fontSize: 13, outline: "none", boxSizing: "border-box",
};

const profilePanel: React.CSSProperties = {
  background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 12, padding: 24,
};

const profileSectionTitle: React.CSSProperties = {
  fontSize: 15, fontWeight: 700, color: "#111827", margin: "0 0 16px 0",
  display: "flex", alignItems: "center", gap: 8,
};

const detailLabel: React.CSSProperties = {
  fontSize: 10, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4,
};

const thStyle: React.CSSProperties = {
  textAlign: "left", padding: "10px 14px", fontSize: 11, fontWeight: 600, color: "#6B7280",
  textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid #E5E7EB",
};

const tdStyle: React.CSSProperties = {
  padding: "10px 14px",
};
