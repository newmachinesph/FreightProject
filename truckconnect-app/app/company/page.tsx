"use client";

import { useState, useMemo } from "react";
import {
  Building2, Star, CheckCircle, MapPin, Truck, Package,
  Warehouse as WarehouseIcon, Search, SlidersHorizontal,
  BarChart3, ChevronRight, Layers,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { companies, type Company } from "@/lib/mock-data";

const typeBadgeStyles: Record<string, { color: string; bg: string; icon: typeof Truck }> = {
  carrier: { color: "#059669", bg: "#ECFDF5", icon: Truck },
  shipper: { color: "#D97706", bg: "#FFFBEB", icon: Package },
  warehouse: { color: "#7C3AED", bg: "#F5F3FF", icon: WarehouseIcon },
};

type FilterType = "all" | "carrier" | "shipper" | "warehouse" | "multi";
type SortType = "rating" | "transactions" | "name";

function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
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
      <span style={{ marginLeft: 4, fontSize: size - 2, fontWeight: 600, color: "#374151" }}>{rating.toFixed(1)}</span>
    </span>
  );
}

const filterOptions: { key: FilterType; label: string; icon: typeof Building2 }[] = [
  { key: "all", label: "All Companies", icon: Building2 },
  { key: "carrier", label: "Carriers", icon: Truck },
  { key: "shipper", label: "Shippers", icon: Package },
  { key: "warehouse", label: "Warehouses", icon: WarehouseIcon },
  { key: "multi", label: "Multi-Service", icon: Layers },
];

export default function CompanyDirectoryPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [sort, setSort] = useState<SortType>("rating");

  const filtered = useMemo(() => {
    let result = [...companies];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((c) =>
        c.name.toLowerCase().includes(q) ||
        c.headquarters.city.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
      );
    }

    // Filter
    if (filter === "carrier") result = result.filter((c) => c.types.includes("carrier"));
    else if (filter === "shipper") result = result.filter((c) => c.types.includes("shipper"));
    else if (filter === "warehouse") result = result.filter((c) => c.types.includes("warehouse"));
    else if (filter === "multi") result = result.filter((c) => c.types.length > 1);

    // Sort
    if (sort === "rating") result.sort((a, b) => b.rating - a.rating);
    else if (sort === "transactions") result.sort((a, b) => b.totalTransactions - a.totalTransactions);
    else if (sort === "name") result.sort((a, b) => a.name.localeCompare(b.name));

    return result;
  }, [search, filter, sort]);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      <Navbar active="Companies" />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 24px 64px" }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "#0f172a", margin: "0 0 6px" }}>Company Directory</h1>
          <p style={{ fontSize: 14, color: "#6B7280", margin: 0 }}>
            Browse verified shippers, carriers, and warehouse operators in the Philippine freight marketplace.
          </p>
        </div>

        {/* Search & Filters */}
        <div style={{
          backgroundColor: "#ffffff", borderRadius: 12, border: "1px solid #e2e8f0",
          padding: 16, marginBottom: 20, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap",
        }}>
          {/* Search */}
          <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
            <Search size={16} color="#9CA3AF" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
            <input
              type="text"
              placeholder="Search companies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%", padding: "8px 12px 8px 36px", borderRadius: 8,
                border: "1px solid #E5E7EB", fontSize: 13, outline: "none",
                backgroundColor: "#f8fafc",
              }}
            />
          </div>

          {/* Filter Tabs */}
          <div style={{ display: "flex", gap: 4 }}>
            {filterOptions.map((f) => {
              const Icon = f.icon;
              return (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  style={{
                    display: "flex", alignItems: "center", gap: 4,
                    padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                    cursor: "pointer", border: "1px solid",
                    color: filter === f.key ? "#2563EB" : "#6B7280",
                    backgroundColor: filter === f.key ? "#EFF6FF" : "#ffffff",
                    borderColor: filter === f.key ? "#2563EB" : "#E5E7EB",
                  }}
                >
                  <Icon size={13} /> {f.label}
                </button>
              );
            })}
          </div>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortType)}
            style={{
              padding: "8px 12px", borderRadius: 8, border: "1px solid #E5E7EB",
              fontSize: 12, color: "#374151", backgroundColor: "#ffffff", cursor: "pointer",
            }}
          >
            <option value="rating">Sort by Rating</option>
            <option value="transactions">Sort by Transactions</option>
            <option value="name">Sort by Name</option>
          </select>
        </div>

        {/* Results count */}
        <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 12 }}>
          Showing {filtered.length} {filtered.length === 1 ? "company" : "companies"}
        </div>

        {/* Company Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
          {filtered.map((company) => {
            const initials = company.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
            return (
              <a
                key={company.id}
                href={`/company/${company.slug}`}
                style={{
                  backgroundColor: "#ffffff", borderRadius: 12, border: "1px solid #e2e8f0",
                  padding: 20, textDecoration: "none", color: "inherit",
                  transition: "border-color 0.15s, box-shadow 0.15s",
                  display: "flex", flexDirection: "column",
                }}
                onMouseOver={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "#2563EB";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 12px rgba(37,99,235,0.08)";
                }}
                onMouseOut={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "#e2e8f0";
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                  {/* Logo */}
                  <div style={{
                    width: 52, height: 52, borderRadius: 14,
                    background: "linear-gradient(135deg, #1e293b, #334155)",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    <span style={{ fontSize: 18, fontWeight: 800, color: "#94a3b8" }}>{initials}</span>
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                      <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {company.name}
                      </h3>
                      {company.verified && (
                        <CheckCircle size={14} color="#2563EB" style={{ flexShrink: 0 }} />
                      )}
                    </div>

                    {/* Type badges */}
                    <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>
                      {company.types.map((type) => {
                        const s = typeBadgeStyles[type];
                        const Icon = s.icon;
                        return (
                          <span key={type} style={{
                            display: "inline-flex", alignItems: "center", gap: 3,
                            padding: "2px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600,
                            color: s.color, backgroundColor: s.bg,
                          }}>
                            <Icon size={10} /> {type.charAt(0).toUpperCase() + type.slice(1)}
                          </span>
                        );
                      })}
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12, color: "#6B7280", marginBottom: 6 }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
                        <MapPin size={12} /> {company.headquarters.city}
                      </span>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
                        <BarChart3 size={12} /> {company.totalTransactions.toLocaleString()} txns
                      </span>
                    </div>

                    <StarRating rating={company.rating} size={13} />
                  </div>

                  <ChevronRight size={18} color="#CBD5E1" style={{ flexShrink: 0, marginTop: 14 }} />
                </div>
              </a>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div style={{
            backgroundColor: "#ffffff", borderRadius: 12, border: "1px solid #e2e8f0",
            padding: 48, textAlign: "center",
          }}>
            <Building2 size={40} color="#D1D5DB" />
            <h3 style={{ fontSize: 16, fontWeight: 600, color: "#374151", marginTop: 12 }}>No companies found</h3>
            <p style={{ fontSize: 13, color: "#6B7280" }}>Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
