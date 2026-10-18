"use client";
import { useState } from "react";
import { Building2, Shield, Clock, DoorOpen, Ruler, Thermometer, Save, CheckCircle, MapPin, Phone, Mail, Award, Image } from "lucide-react";
import { facilityProfile, warehouseTypes } from "@/lib/mock-data";

// Operating hours logic
function getOperatingStatus(hours: string): { isOpen: boolean; label: string; color: string; bg: string } {
  if (hours === "24/7") return { isOpen: true, label: "OPEN NOW", color: "#059669", bg: "#D1FAE5" };
  // For non-24/7 would parse hours; for now default open during business hours
  return { isOpen: true, label: "OPEN NOW", color: "#059669", bg: "#D1FAE5" };
}

// Certification data
const certifications = [
  { name: "PEZA Accreditation", issuer: "Philippine Economic Zone Authority", issued: "2024-01-15", expires: "2027-01-15", active: true },
  { name: "FDA Cold Storage License", issuer: "Food & Drug Administration", issued: "2024-06-01", expires: "2026-06-01", active: true, license: "FDA-LTO-2024-CS-001" },
  { name: "BAI Veterinary License", issuer: "Bureau of Animal Industry", issued: "2025-01-10", expires: "2027-01-10", active: true },
  { name: "Fire Safety Certificate", issuer: "Bureau of Fire Protection", issued: "2025-06-15", expires: "2026-06-15", active: true },
  { name: "Business Permit", issuer: "Clark Development Corp", issued: "2026-01-01", expires: "2026-12-31", active: true },
];

function getCertDaysLeft(expires: string): number {
  const today = new Date("2026-03-20");
  const exp = new Date(expires);
  return Math.ceil((exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export default function FacilityProfilePage() {
  const fp = facilityProfile;
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    name: fp.name,
    address: fp.address,
    region: fp.region,
    island: fp.island,
    totalArea: fp.totalArea,
    availableSqm: fp.availableCapacity.sqm,
    availablePallets: fp.availableCapacity.pallets,
    type: fp.type,
    operatingHours: fp.operatingHours,
    pezaAccredited: fp.pezaAccredited,
    baiFdaLicense: fp.baiFdaLicense,
    loadingDocks: fp.loadingDocks,
    ceilingHeight: fp.ceilingHeight,
    reeferZones: fp.reeferZones,
    rateCard: fp.rateCard,
    security: fp.security.join(", "),
  });

  const update = (field: string, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 3000);
  };

  const usedArea = form.totalArea - form.availableSqm;
  const usedPct = Math.round((usedArea / form.totalArea) * 100);
  const opStatus = getOperatingStatus(form.operatingHours);

  return (
    <>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={s.pageTitle}>Facility Profile</h1>
          <p style={s.pageSubtitle}>Manage warehouse details, zones, and infrastructure</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {saved && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, background: "#D1FAE5", color: "#065F46", fontSize: 13, fontWeight: 600 }}>
              <CheckCircle size={14} /> Saved
            </span>
          )}
          {editing ? (
            <>
              <button onClick={() => setEditing(false)} style={{ padding: "10px 18px", borderRadius: 8, border: "1px solid #E5E7EB", background: "#fff", color: "#374151", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                Cancel
              </button>
              <button onClick={handleSave} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 18px", borderRadius: 8, border: "none", background: "#059669", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                <Save size={14} /> Save Changes
              </button>
            </>
          ) : (
            <button onClick={() => setEditing(true)} style={{ padding: "10px 18px", borderRadius: 8, border: "none", background: "#7C3AED", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
              Edit Profile
            </button>
          )}
        </div>
      </header>

      {/* Facility Photo Placeholder + Operating Status */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 24 }}>
        {/* Photo Placeholder */}
        <div style={{
          background: "#F9FAFB", border: "2px dashed #DDD6FE", borderRadius: 12,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          minHeight: 200, padding: 24,
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: "50%", background: "#7C3AED14",
            display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12,
          }}>
            <Image size={28} color="#7C3AED" />
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#6B7280", marginBottom: 4 }}>Facility Photo</div>
          <div style={{ fontSize: 12, color: "#9CA3AF", textAlign: "center" }}>
            Upload a photo of your warehouse exterior or main floor
          </div>
          <button style={{
            marginTop: 12, padding: "8px 18px", borderRadius: 8,
            border: "1px solid #DDD6FE", background: "#F5F3FF",
            color: "#7C3AED", fontSize: 12, fontWeight: 600, cursor: "pointer",
          }}>
            Upload Photo
          </button>
        </div>

        {/* Contact Info + Operating Status */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Operating Hours with Open/Closed */}
          <div style={{ ...s.card, margin: 0, flex: "none" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Clock size={16} color="#7C3AED" />
                <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>Operating Hours</span>
              </div>
              <span style={{
                padding: "4px 12px", borderRadius: 12, fontSize: 11, fontWeight: 700,
                background: opStatus.bg, color: opStatus.color,
                animation: "pulse 2s infinite",
              }}>
                {opStatus.label}
              </span>
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#7C3AED", textAlign: "center", padding: "8px 0" }}>
              {form.operatingHours}
            </div>
          </div>

          {/* Contact Information */}
          <div style={{ ...s.card, margin: 0, flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
              <MapPin size={14} color="#7C3AED" /> Contact Information
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                <MapPin size={14} color="#9CA3AF" style={{ marginTop: 2, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#111827" }}>{form.address}</div>
                  <div style={{ fontSize: 11, color: "#6B7280" }}>{form.region} &middot; {form.island}</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Phone size={14} color="#9CA3AF" />
                <span style={{ fontSize: 12, fontWeight: 600, color: "#111827" }}>+63 45 499 1234</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Mail size={14} color="#9CA3AF" />
                <span style={{ fontSize: 12, fontWeight: 600, color: "#7C3AED" }}>ops@clarkcoldstorage.ph</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div style={s.statsGrid}>
        <div style={s.statCard}>
          <div style={{ ...s.statIcon, background: "#7C3AED14", color: "#7C3AED" }}><Building2 size={20} /></div>
          <div><div style={s.statValue}>{form.totalArea.toLocaleString()} sqm</div><div style={s.statLabel}>Total Area</div></div>
        </div>
        <div style={s.statCard}>
          <div style={{ ...s.statIcon, background: "#2563EB14", color: "#2563EB" }}><DoorOpen size={20} /></div>
          <div><div style={s.statValue}>{form.loadingDocks}</div><div style={s.statLabel}>Loading Docks</div></div>
        </div>
        <div style={s.statCard}>
          <div style={{ ...s.statIcon, background: "#05966914", color: "#059669" }}><Ruler size={20} /></div>
          <div><div style={s.statValue}>{form.ceilingHeight}m</div><div style={s.statLabel}>Ceiling Height</div></div>
        </div>
        <div style={s.statCard}>
          <div style={{ ...s.statIcon, background: "#D9770614", color: "#D97706" }}><Building2 size={20} /></div>
          <div><div style={s.statValue}>{usedPct}%</div><div style={s.statLabel}>Space Used</div></div>
        </div>
      </div>

      {/* Certification Badges */}
      <div style={s.card}>
        <h3 style={{ ...s.cardTitle, display: "flex", alignItems: "center", gap: 8 }}>
          <Award size={16} color="#7C3AED" /> Certifications & Licenses
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12, marginTop: 16 }}>
          {certifications.map((cert) => {
            const daysLeft = getCertDaysLeft(cert.expires);
            const isExpiring = daysLeft <= 90;
            const isExpired = daysLeft <= 0;
            return (
              <div key={cert.name} style={{
                padding: "14px 16px", borderRadius: 10,
                border: `1px solid ${isExpired ? "#FECACA" : isExpiring ? "#FDE68A" : "#DDD6FE"}`,
                background: isExpired ? "#FEF2F2" : isExpiring ? "#FFFBEB" : "#F5F3FF",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                    <Shield size={14} color={isExpired ? "#DC2626" : isExpiring ? "#D97706" : "#7C3AED"} />
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{cert.name}</span>
                  </div>
                  <span style={{
                    padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 700,
                    background: isExpired ? "#FEE2E2" : isExpiring ? "#FEF3C7" : "#D1FAE5",
                    color: isExpired ? "#991B1B" : isExpiring ? "#92400E" : "#065F46",
                  }}>
                    {isExpired ? "EXPIRED" : cert.active ? "ACTIVE" : "INACTIVE"}
                  </span>
                </div>
                <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 4 }}>{cert.issuer}</div>
                {cert.license && (
                  <div style={{ fontSize: 11, fontFamily: "monospace", color: "#7C3AED", fontWeight: 600, marginBottom: 4 }}>{cert.license}</div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                  <span style={{ fontSize: 10, color: "#9CA3AF" }}>Issued: {cert.issued}</span>
                  <span style={{
                    fontSize: 10, fontWeight: 600,
                    color: isExpired ? "#DC2626" : isExpiring ? "#D97706" : "#6B7280",
                  }}>
                    Expires: {cert.expires} ({daysLeft > 0 ? `${daysLeft}d left` : "Expired"})
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Warehouse Details */}
      <div style={s.card}>
        <h3 style={s.cardTitle}><Building2 size={16} style={{ verticalAlign: "middle", marginRight: 8 }} />Warehouse Details</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
          <div>
            <label style={s.fieldLabel}>Warehouse Name</label>
            {editing ? (
              <input type="text" value={form.name} onChange={(e) => update("name", e.target.value)} style={s.input} />
            ) : (
              <div style={s.fieldValue}>{form.name}</div>
            )}
          </div>
          <div>
            <label style={s.fieldLabel}>Warehouse Type</label>
            {editing ? (
              <select value={form.type} onChange={(e) => update("type", e.target.value)} style={{ ...s.input, cursor: "pointer" }}>
                {warehouseTypes.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            ) : (
              <div style={s.fieldValue}>{form.type}</div>
            )}
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={s.fieldLabel}>Physical Address</label>
            {editing ? (
              <input type="text" value={form.address} onChange={(e) => update("address", e.target.value)} style={s.input} />
            ) : (
              <div style={s.fieldValue}>{form.address}</div>
            )}
          </div>
          <div>
            <label style={s.fieldLabel}>Region</label>
            {editing ? (
              <input type="text" value={form.region} onChange={(e) => update("region", e.target.value)} style={s.input} />
            ) : (
              <div style={s.fieldValue}>{form.region}</div>
            )}
          </div>
          <div>
            <label style={s.fieldLabel}>Island</label>
            {editing ? (
              <select value={form.island} onChange={(e) => update("island", e.target.value)} style={{ ...s.input, cursor: "pointer" }}>
                <option value="Luzon">Luzon</option>
                <option value="Visayas">Visayas</option>
                <option value="Mindanao">Mindanao</option>
              </select>
            ) : (
              <div style={s.fieldValue}>{form.island}</div>
            )}
          </div>
        </div>
      </div>

      {/* Capacity & Dimensions */}
      <div style={s.card}>
        <h3 style={s.cardTitle}><Ruler size={16} style={{ verticalAlign: "middle", marginRight: 8 }} />Capacity & Dimensions</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginTop: 16 }}>
          <div>
            <label style={s.fieldLabel}>Total Floor Area (sqm)</label>
            {editing ? (
              <input type="number" value={form.totalArea} onChange={(e) => update("totalArea", parseInt(e.target.value) || 0)} style={s.input} />
            ) : (
              <div style={s.fieldValue}>{form.totalArea.toLocaleString()} sqm</div>
            )}
          </div>
          <div>
            <label style={s.fieldLabel}>Available Capacity (sqm)</label>
            {editing ? (
              <input type="number" value={form.availableSqm} onChange={(e) => update("availableSqm", parseInt(e.target.value) || 0)} style={s.input} />
            ) : (
              <div style={s.fieldValue}>{form.availableSqm.toLocaleString()} sqm</div>
            )}
          </div>
          <div>
            <label style={s.fieldLabel}>Available Pallets</label>
            {editing ? (
              <input type="number" value={form.availablePallets} onChange={(e) => update("availablePallets", parseInt(e.target.value) || 0)} style={s.input} />
            ) : (
              <div style={s.fieldValue}>{form.availablePallets.toLocaleString()}</div>
            )}
          </div>
          <div>
            <label style={s.fieldLabel}>Ceiling Height (m)</label>
            {editing ? (
              <input type="number" value={form.ceilingHeight} onChange={(e) => update("ceilingHeight", parseFloat(e.target.value) || 0)} style={s.input} />
            ) : (
              <div style={s.fieldValue}>{form.ceilingHeight}m</div>
            )}
          </div>
          <div>
            <label style={s.fieldLabel}>Loading Docks</label>
            {editing ? (
              <input type="number" value={form.loadingDocks} onChange={(e) => update("loadingDocks", parseInt(e.target.value) || 0)} style={s.input} />
            ) : (
              <div style={s.fieldValue}>{form.loadingDocks}</div>
            )}
          </div>
          <div>
            <label style={s.fieldLabel}>Reefer / Cold Storage Zones</label>
            {editing ? (
              <input type="number" value={form.reeferZones} onChange={(e) => update("reeferZones", parseInt(e.target.value) || 0)} style={s.input} />
            ) : (
              <div style={s.fieldValue}>{form.reeferZones}</div>
            )}
          </div>
        </div>

        {/* Capacity Bar */}
        <div style={{ marginTop: 20, padding: "14px 16px", background: "#F9FAFB", borderRadius: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 13, color: "#6B7280" }}>
              {usedArea.toLocaleString()} / {form.totalArea.toLocaleString()} sqm used
            </span>
            <span style={{ fontSize: 13, fontWeight: 600, color: usedPct > 85 ? "#DC2626" : "#7C3AED" }}>{usedPct}%</span>
          </div>
          <div style={{ width: "100%", height: 10, background: "#E5E7EB", borderRadius: 6, overflow: "hidden" }}>
            <div style={{
              height: "100%", width: usedPct + "%",
              background: usedPct > 85 ? "linear-gradient(90deg, #EF4444, #F87171)" : "linear-gradient(90deg, #7C3AED, #A855F7)",
              borderRadius: 6, transition: "width .4s ease",
            }} />
          </div>
        </div>
      </div>

      {/* Operating & Compliance */}
      <div style={s.card}>
        <h3 style={s.cardTitle}><Shield size={16} style={{ verticalAlign: "middle", marginRight: 8 }} />Operations & Compliance</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
          <div>
            <label style={s.fieldLabel}>Operating Hours</label>
            {editing ? (
              <input type="text" value={form.operatingHours} onChange={(e) => update("operatingHours", e.target.value)} style={s.input} />
            ) : (
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <Clock size={14} color="#6B7280" />
                <span style={s.fieldValue}>{form.operatingHours}</span>
              </div>
            )}
          </div>
          <div>
            <label style={s.fieldLabel}>PEZA Accreditation</label>
            {editing ? (
              <select value={form.pezaAccredited ? "yes" : "no"} onChange={(e) => update("pezaAccredited", e.target.value === "yes")} style={{ ...s.input, cursor: "pointer" }}>
                <option value="yes">Yes - Accredited</option>
                <option value="no">No</option>
              </select>
            ) : (
              <div>
                {form.pezaAccredited ? (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 12px", borderRadius: 6, fontSize: 13, fontWeight: 600, background: "#ECFDF5", color: "#065F46" }}>
                    <Shield size={12} /> PEZA Accredited
                  </span>
                ) : (
                  <span style={{ color: "#9CA3AF" }}>Not accredited</span>
                )}
              </div>
            )}
          </div>
          <div>
            <label style={s.fieldLabel}>BAI / FDA Cold Storage License</label>
            {editing ? (
              <input type="text" value={form.baiFdaLicense} onChange={(e) => update("baiFdaLicense", e.target.value)} style={s.input} />
            ) : (
              <div>
                <span style={{ padding: "4px 12px", borderRadius: 6, fontSize: 13, fontWeight: 600, background: "#F5F3FF", color: "#7C3AED" }}>
                  {form.baiFdaLicense}
                </span>
              </div>
            )}
          </div>
          <div>
            <label style={s.fieldLabel}>Rate Card</label>
            {editing ? (
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 16, fontWeight: 600, color: "#6B7280" }}>{"\u20B1"}</span>
                <input type="number" value={form.rateCard} onChange={(e) => update("rateCard", parseInt(e.target.value) || 0)} style={{ ...s.input, flex: 1 }} />
                <span style={{ fontSize: 12, color: "#9CA3AF" }}>/sqm/month</span>
              </div>
            ) : (
              <div style={s.fieldValue}>{"\u20B1"}{form.rateCard.toLocaleString()} /sqm/month</div>
            )}
          </div>
        </div>
      </div>

      {/* Security Features */}
      <div style={s.card}>
        <h3 style={s.cardTitle}><Shield size={16} style={{ verticalAlign: "middle", marginRight: 8 }} />Security Features</h3>
        {editing ? (
          <div style={{ marginTop: 12 }}>
            <label style={s.fieldLabel}>Security Features (comma-separated)</label>
            <input type="text" value={form.security} onChange={(e) => update("security", e.target.value)} style={s.input} />
          </div>
        ) : (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
            {form.security.split(",").map((sec) => (
              <span key={sec.trim()} style={{ padding: "6px 14px", borderRadius: 6, fontSize: 13, fontWeight: 500, background: "#F5F3FF", color: "#7C3AED", border: "1px solid #DDD6FE" }}>
                {sec.trim()}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Warehouse Zones */}
      <div style={s.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={s.cardTitle}><Thermometer size={16} style={{ verticalAlign: "middle", marginRight: 8 }} />Warehouse Zones</h3>
          <a href="/dashboard/zones" style={{ fontSize: 12, color: "#7C3AED", textDecoration: "none", fontWeight: 600 }}>Manage Zones &rarr;</a>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, marginTop: 14 }}>
          {fp.zones.map((zone, idx) => {
            const usedPcts = [75, 80, 60, 80];
            const pct = usedPcts[idx] || 50;
            const zoneColors = ["#D97706", "#2563EB", "#7C3AED", "#059669"];
            const zoneColor = zoneColors[idx] || "#6B7280";
            const isTemp = zone.temp !== "ambient";
            return (
              <div key={zone.name} style={{ padding: "14px 16px", background: "#F9FAFB", borderRadius: 8, border: "1px solid #E5E7EB" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{zone.name}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: zoneColor }}>{pct}%</span>
                </div>
                <div style={{ width: "100%", height: 6, background: "#E5E7EB", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: pct + "%", background: zoneColor, borderRadius: 4, transition: "width .4s" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                  <span style={{ fontSize: 11, color: "#9CA3AF" }}>{zone.area.toLocaleString()} sqm</span>
                  {isTemp && (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 10, color: "#2563EB" }}>
                      <Thermometer size={9} /> {zone.temp}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Loading Docks */}
      <div style={s.card}>
        <h3 style={s.cardTitle}><DoorOpen size={16} style={{ verticalAlign: "middle", marginRight: 8 }} />Loading Docks</h3>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
          {Array.from({ length: form.loadingDocks }).map((_, i) => {
            const dockStatuses = ["Available", "In Use", "Available", "In Use", "Available", "Available", "Maintenance", "Available"];
            const dStatus = dockStatuses[i] || "Available";
            const dColor = dStatus === "In Use" ? "#059669" : dStatus === "Maintenance" ? "#D97706" : "#6B7280";
            const dBg = dStatus === "In Use" ? "#ECFDF5" : dStatus === "Maintenance" ? "#FFFBEB" : "#F9FAFB";
            return (
              <div key={i} style={{ padding: "12px 16px", borderRadius: 10, border: "1px solid #E5E7EB", background: dBg, minWidth: 100, textAlign: "center" }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>Dock {i + 1}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: dColor, marginTop: 4 }}>{dStatus}</div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

const s: Record<string, React.CSSProperties> = {
  pageTitle: { fontSize: 24, fontWeight: 800, color: "#111827", margin: 0 },
  pageSubtitle: { fontSize: 14, color: "#6B7280", marginTop: 4 },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 },
  statCard: { background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: "18px 20px", display: "flex", alignItems: "center", gap: 14 },
  statIcon: { width: 42, height: 42, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" },
  statValue: { fontSize: 22, fontWeight: 800, color: "#111827" },
  statLabel: { fontSize: 12, color: "#6B7280", marginTop: 2 },
  card: { background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: "20px 24px", marginBottom: 20 },
  cardTitle: { fontSize: 15, fontWeight: 700, color: "#111827", margin: 0 },
  fieldLabel: { display: "block", fontSize: 11, color: "#9CA3AF", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.3, marginBottom: 6 },
  fieldValue: { fontSize: 14, fontWeight: 600, color: "#111827" },
  input: { width: "100%", padding: "10px 14px", border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 13, color: "#111827", outline: "none" },
};
