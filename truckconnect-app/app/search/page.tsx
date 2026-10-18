"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState, useEffect, useCallback, useMemo } from "react";
import {
  Search,
  Truck,
  Package,
  Warehouse as WarehouseIcon,
  MapPin,
  Star,
  CheckCircle,
  ArrowRight,
  ChevronRight,
  ChevronDown,
  SlidersHorizontal,
  Clock,
  Bookmark,
  X,
  Thermometer,
  Shield,
  Filter,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { loads, carriers, warehouses } from "@/lib/mock-data";
import type { MarketplaceLoad, Carrier, Warehouse } from "@/lib/mock-data";

// ── Types ──

type CategoryFilter = "all" | "loads" | "carriers" | "warehouses";
type SortOption = "relevance" | "rating" | "priceLow" | "priceHigh";

interface SavedSearch {
  id: string;
  name: string;
  query: string;
  category: CategoryFilter;
  timestamp: number;
}

// ── Popular Searches ──
const popularSearches = [
  "Manila to Cebu",
  "Reefer Van",
  "Cold Storage Cebu",
  "Davao freight",
  "FTL Manila",
  "Bonded warehouse",
  "Inter-Island",
  "Flatbed trailer",
];

// ── Search Results Component ──

function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = (searchParams.get("q") ?? "").trim().toLowerCase();
  const urlCategory = (searchParams.get("cat") as CategoryFilter) ?? "all";

  // State
  const [category, setCategory] = useState<CategoryFilter>(urlCategory);
  const [sortBy, setSortBy] = useState<SortOption>("relevance");
  const [showFilters, setShowFilters] = useState(true);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedVehicleType, setSelectedVehicleType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveSearchName, setSaveSearchName] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [localQuery, setLocalQuery] = useState(searchParams.get("q") ?? "");

  // Load recent/saved searches from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("tc-recent-searches");
      if (stored) setRecentSearches(JSON.parse(stored));
      const savedStored = localStorage.getItem("tc-saved-searches");
      if (savedStored) setSavedSearches(JSON.parse(savedStored));
    } catch { /* ignore */ }
  }, []);

  // Save recent search
  useEffect(() => {
    if (query) {
      setRecentSearches((prev) => {
        const updated = [query, ...prev.filter((s) => s !== query)].slice(0, 5);
        try { localStorage.setItem("tc-recent-searches", JSON.stringify(updated)); } catch { /* ignore */ }
        return updated;
      });
    }
  }, [query]);

  // Search execution
  const executeSearch = useCallback((q: string) => {
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (category !== "all") params.set("cat", category);
    router.push(`/search?${params.toString()}`);
    setShowSuggestions(false);
  }, [category, router]);

  // Matching functions
  const matchedLoads = useMemo(() => {
    if (!query) return [];
    let results = loads.filter(
      (l) =>
        l.origin.city.toLowerCase().includes(query) ||
        l.destination.city.toLowerCase().includes(query) ||
        l.commodity.toLowerCase().includes(query) ||
        l.vehicleType.toLowerCase().includes(query) ||
        l.cargoType.toLowerCase().includes(query)
    );
    if (selectedStatus !== "all") results = results.filter((l) => l.status === selectedStatus);
    if (selectedVehicleType !== "all") results = results.filter((l) => l.vehicleType.toLowerCase().includes(selectedVehicleType.toLowerCase()));
    if (selectedLocation !== "all") results = results.filter((l) =>
      l.origin.city.toLowerCase().includes(selectedLocation.toLowerCase()) ||
      l.destination.city.toLowerCase().includes(selectedLocation.toLowerCase())
    );
    // Sort
    if (sortBy === "priceLow") results.sort((a, b) => a.offeredRate - b.offeredRate);
    if (sortBy === "priceHigh") results.sort((a, b) => b.offeredRate - a.offeredRate);
    return results;
  }, [query, selectedStatus, selectedVehicleType, selectedLocation, sortBy]);

  const matchedCarriers = useMemo(() => {
    if (!query) return [];
    let results = carriers.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.lanes.some((lane) => lane.toLowerCase().includes(query)) ||
        c.specializations.some((s) => s.toLowerCase().includes(query)) ||
        c.location.city.toLowerCase().includes(query)
    );
    if (verifiedOnly) results = results.filter((c) => c.verified);
    if (minRating > 0) results = results.filter((c) => c.rating >= minRating);
    if (selectedLocation !== "all") results = results.filter((c) => c.location.city.toLowerCase().includes(selectedLocation.toLowerCase()));
    // Sort
    if (sortBy === "rating") results.sort((a, b) => b.rating - a.rating);
    if (sortBy === "priceLow") results.sort((a, b) => a.baseRate - b.baseRate);
    if (sortBy === "priceHigh") results.sort((a, b) => b.baseRate - a.baseRate);
    return results;
  }, [query, verifiedOnly, minRating, selectedLocation, sortBy]);

  const matchedWarehouses = useMemo(() => {
    if (!query) return [];
    let results = warehouses.filter(
      (w) =>
        w.name.toLowerCase().includes(query) ||
        w.location.city.toLowerCase().includes(query) ||
        w.types.some((t) => t.toLowerCase().includes(query))
    );
    if (verifiedOnly) results = results.filter(() => true); // warehouses don't have verified in mock-data
    if (minRating > 0) results = results.filter((w) => w.rating >= minRating);
    if (selectedLocation !== "all") results = results.filter((w) => w.location.city.toLowerCase().includes(selectedLocation.toLowerCase()));
    // Sort
    if (sortBy === "rating") results.sort((a, b) => b.rating - a.rating);
    if (sortBy === "priceLow") results.sort((a, b) => a.rate - b.rate);
    if (sortBy === "priceHigh") results.sort((a, b) => b.rate - a.rate);
    return results;
  }, [query, verifiedOnly, minRating, selectedLocation, sortBy]);

  const filteredLoads = category === "all" || category === "loads" ? matchedLoads : [];
  const filteredCarriers = category === "all" || category === "carriers" ? matchedCarriers : [];
  const filteredWarehouses = category === "all" || category === "warehouses" ? matchedWarehouses : [];

  const totalResults = filteredLoads.length + filteredCarriers.length + filteredWarehouses.length;

  const statusColors: Record<string, { bg: string; text: string }> = {
    open: { bg: "#dcfce7", text: "#166534" },
    bidding: { bg: "#dbeafe", text: "#1e40af" },
    awarded: { bg: "#fef3c7", text: "#92400e" },
    in_transit: { bg: "#e0e7ff", text: "#3730a3" },
    delivered: { bg: "#f3e8ff", text: "#6b21a8" },
  };

  const typeColors: Record<string, { bg: string; text: string }> = {
    dry: { bg: "#fef3c7", text: "#92400e" },
    cold: { bg: "#dbeafe", text: "#1e40af" },
    bonded: { bg: "#e0e7ff", text: "#3730a3" },
    cross_dock: { bg: "#dcfce7", text: "#166534" },
    pharmaceutical: { bg: "#fce7f3", text: "#9d174d" },
  };

  // Locations from data
  const allLocations = useMemo(() => {
    const locs = new Set<string>();
    loads.forEach((l) => { locs.add(l.origin.city); locs.add(l.destination.city); });
    carriers.forEach((c) => locs.add(c.location.city));
    warehouses.forEach((w) => locs.add(w.location.city));
    return Array.from(locs).sort();
  }, []);

  const vehicleTypes = useMemo(() => {
    const types = new Set<string>();
    loads.forEach((l) => types.add(l.vehicleType));
    return Array.from(types).sort();
  }, []);

  // Save search
  const handleSaveSearch = () => {
    if (!saveSearchName.trim() || !query) return;
    const newSaved: SavedSearch = {
      id: Date.now().toString(),
      name: saveSearchName.trim(),
      query,
      category,
      timestamp: Date.now(),
    };
    const updated = [...savedSearches, newSaved];
    setSavedSearches(updated);
    try { localStorage.setItem("tc-saved-searches", JSON.stringify(updated)); } catch { /* ignore */ }
    setShowSaveDialog(false);
    setSaveSearchName("");
  };

  const removeSavedSearch = (id: string) => {
    const updated = savedSearches.filter((s) => s.id !== id);
    setSavedSearches(updated);
    try { localStorage.setItem("tc-saved-searches", JSON.stringify(updated)); } catch { /* ignore */ }
  };

  // Suggestions
  const suggestions = useMemo(() => {
    if (!localQuery.trim()) return popularSearches;
    return popularSearches.filter((s) => s.toLowerCase().includes(localQuery.toLowerCase()));
  }, [localQuery]);

  // Star rating component
  const StarRating = ({ rating }: { rating: number }) => (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 12 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} size={11} color="#f59e0b" fill={s <= Math.round(rating) ? "#f59e0b" : "none"} />
      ))}
      <span style={{ fontWeight: 600, color: "#374151", marginLeft: 2 }}>{rating}</span>
    </span>
  );

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f1f5f9" }}>
      <Navbar />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 24px 64px" }}>
        {/* Search bar */}
        <div style={{ marginBottom: 24, position: "relative" }}>
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ flex: 1, position: "relative" }}>
              <Search size={16} color="#94a3b8" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
              <input
                value={localQuery}
                onChange={(e) => { setLocalQuery(e.target.value); setShowSuggestions(true); }}
                onKeyDown={(e) => { if (e.key === "Enter") executeSearch(localQuery); }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder="Search loads, carriers, warehouses..."
                style={{
                  width: "100%", padding: "12px 16px 12px 40px",
                  border: "1px solid #e2e8f0", borderRadius: 10,
                  fontSize: 14, color: "#0f172a", backgroundColor: "#ffffff",
                  outline: "none", boxSizing: "border-box",
                }}
              />

              {/* Autocomplete / suggestions dropdown */}
              {showSuggestions && (localQuery.length === 0 || suggestions.length > 0) && (
                <div style={{
                  position: "absolute", top: "100%", left: 0, right: 0, zIndex: 50,
                  backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 10,
                  marginTop: 4, boxShadow: "0 4px 12px rgba(0,0,0,0.08)", overflow: "hidden",
                }}>
                  {/* Recent searches */}
                  {recentSearches.length > 0 && localQuery.length === 0 && (
                    <div style={{ padding: "8px 0" }}>
                      <div style={{ padding: "4px 14px", fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5 }}>
                        Recent Searches
                      </div>
                      {recentSearches.map((s) => (
                        <button
                          key={s}
                          onMouseDown={(e) => { e.preventDefault(); setLocalQuery(s); executeSearch(s); }}
                          style={{
                            display: "flex", alignItems: "center", gap: 8, width: "100%",
                            padding: "8px 14px", border: "none", backgroundColor: "transparent",
                            cursor: "pointer", fontSize: 13, color: "#374151", textAlign: "left",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f8fafc")}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                        >
                          <Clock size={12} color="#94a3b8" /> {s}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Suggestions / Popular */}
                  <div style={{ padding: "8px 0", borderTop: recentSearches.length > 0 && localQuery.length === 0 ? "1px solid #f1f5f9" : "none" }}>
                    <div style={{ padding: "4px 14px", fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5 }}>
                      {localQuery ? "Suggestions" : "Popular Searches"}
                    </div>
                    {suggestions.slice(0, 5).map((s) => (
                      <button
                        key={s}
                        onMouseDown={(e) => { e.preventDefault(); setLocalQuery(s); executeSearch(s); }}
                        style={{
                          display: "flex", alignItems: "center", gap: 8, width: "100%",
                          padding: "8px 14px", border: "none", backgroundColor: "transparent",
                          cursor: "pointer", fontSize: 13, color: "#374151", textAlign: "left",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f8fafc")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                      >
                        <Search size={12} color="#94a3b8" /> {s}
                      </button>
                    ))}
                  </div>

                  {/* Saved searches */}
                  {savedSearches.length > 0 && localQuery.length === 0 && (
                    <div style={{ padding: "8px 0", borderTop: "1px solid #f1f5f9" }}>
                      <div style={{ padding: "4px 14px", fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5 }}>
                        Saved Searches
                      </div>
                      {savedSearches.map((s) => (
                        <div key={s.id} style={{ display: "flex", alignItems: "center", padding: "0 14px" }}>
                          <button
                            onMouseDown={(e) => { e.preventDefault(); setLocalQuery(s.query); executeSearch(s.query); }}
                            style={{
                              display: "flex", alignItems: "center", gap: 8, flex: 1,
                              padding: "8px 0", border: "none", backgroundColor: "transparent",
                              cursor: "pointer", fontSize: 13, color: "#374151", textAlign: "left",
                            }}
                          >
                            <Bookmark size={12} color="#2563eb" fill="#2563eb" /> {s.name}
                            <span style={{ fontSize: 11, color: "#94a3b8" }}>({s.query})</span>
                          </button>
                          <button
                            onMouseDown={(e) => { e.preventDefault(); removeSavedSearch(s.id); }}
                            style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}
                          >
                            <X size={12} color="#94a3b8" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            <button
              onClick={() => executeSearch(localQuery)}
              style={{
                padding: "12px 24px", border: "none", borderRadius: 10,
                fontSize: 14, fontWeight: 600, color: "#ffffff", backgroundColor: "#2563eb",
                cursor: "pointer",
              }}
            >
              Search
            </button>
          </div>
        </div>

        {/* Header + actions */}
        {query && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", margin: "0 0 4px" }}>
                {totalResults} result{totalResults !== 1 ? "s" : ""} for &ldquo;{searchParams.get("q")}&rdquo;
              </h1>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {/* Save this search */}
              <button
                onClick={() => setShowSaveDialog(!showSaveDialog)}
                style={{
                  display: "flex", alignItems: "center", gap: 5,
                  padding: "7px 14px", border: "1px solid #e2e8f0", borderRadius: 8,
                  cursor: "pointer", fontSize: 12, fontWeight: 500, color: "#374151",
                  backgroundColor: "#ffffff",
                }}
              >
                <Bookmark size={13} /> Save Search
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                style={{
                  display: "flex", alignItems: "center", gap: 5,
                  padding: "7px 14px", border: "1px solid #e2e8f0", borderRadius: 8,
                  cursor: "pointer", fontSize: 12, fontWeight: 500, color: "#374151",
                  backgroundColor: showFilters ? "#EFF6FF" : "#ffffff",
                }}
              >
                <SlidersHorizontal size={13} /> Filters
              </button>
            </div>
          </div>
        )}

        {/* Save search dialog */}
        {showSaveDialog && query && (
          <div style={{
            backgroundColor: "#ffffff", borderRadius: 10, border: "1px solid #e2e8f0",
            padding: 16, marginBottom: 16, display: "flex", alignItems: "center", gap: 10,
          }}>
            <Bookmark size={16} color="#2563eb" />
            <input
              value={saveSearchName}
              onChange={(e) => setSaveSearchName(e.target.value)}
              placeholder="Name this search..."
              onKeyDown={(e) => e.key === "Enter" && handleSaveSearch()}
              autoFocus
              style={{
                flex: 1, padding: "6px 10px", border: "1px solid #e2e8f0", borderRadius: 6,
                fontSize: 13, color: "#374151", outline: "none",
              }}
            />
            <button
              onClick={handleSaveSearch}
              style={{
                padding: "6px 16px", border: "none", borderRadius: 6,
                fontSize: 12, fontWeight: 600, color: "#ffffff", backgroundColor: "#2563eb",
                cursor: "pointer",
              }}
            >
              Save
            </button>
            <button
              onClick={() => setShowSaveDialog(false)}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}
            >
              <X size={16} color="#94a3b8" />
            </button>
          </div>
        )}

        {/* Category badges */}
        {query && (
          <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
            <button
              onClick={() => setCategory("all")}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "6px 14px", borderRadius: 9999,
                backgroundColor: category === "all" ? "#0f172a" : "#ffffff",
                border: `1px solid ${category === "all" ? "#0f172a" : "#e2e8f0"}`,
                fontSize: 13, fontWeight: 500,
                color: category === "all" ? "#ffffff" : "#64748b",
                cursor: "pointer",
              }}
            >
              All ({matchedLoads.length + matchedCarriers.length + matchedWarehouses.length})
            </button>
            {matchedLoads.length > 0 && (
              <button
                onClick={() => setCategory("loads")}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "6px 14px", borderRadius: 9999,
                  backgroundColor: category === "loads" ? "#eff6ff" : "#ffffff",
                  border: `1px solid ${category === "loads" ? "#2563eb" : "#e2e8f0"}`,
                  fontSize: 13, fontWeight: 500,
                  color: category === "loads" ? "#1e40af" : "#64748b",
                  cursor: "pointer",
                }}
              >
                <Package size={13} /> Loads ({matchedLoads.length})
              </button>
            )}
            {matchedCarriers.length > 0 && (
              <button
                onClick={() => setCategory("carriers")}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "6px 14px", borderRadius: 9999,
                  backgroundColor: category === "carriers" ? "#f0fdf4" : "#ffffff",
                  border: `1px solid ${category === "carriers" ? "#16a34a" : "#e2e8f0"}`,
                  fontSize: 13, fontWeight: 500,
                  color: category === "carriers" ? "#166534" : "#64748b",
                  cursor: "pointer",
                }}
              >
                <Truck size={13} /> Carriers ({matchedCarriers.length})
              </button>
            )}
            {matchedWarehouses.length > 0 && (
              <button
                onClick={() => setCategory("warehouses")}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "6px 14px", borderRadius: 9999,
                  backgroundColor: category === "warehouses" ? "#faf5ff" : "#ffffff",
                  border: `1px solid ${category === "warehouses" ? "#7c3aed" : "#e2e8f0"}`,
                  fontSize: 13, fontWeight: 500,
                  color: category === "warehouses" ? "#6b21a8" : "#64748b",
                  cursor: "pointer",
                }}
              >
                <WarehouseIcon size={13} /> Warehouses ({matchedWarehouses.length})
              </button>
            )}
          </div>
        )}

        {/* Main content area */}
        <div style={{ display: "flex", gap: 20 }}>
          {/* Filters sidebar */}
          {query && showFilters && (
            <aside style={{
              width: 240, flexShrink: 0,
              backgroundColor: "#ffffff", borderRadius: 12, border: "1px solid #e2e8f0",
              padding: 20, alignSelf: "flex-start", position: "sticky", top: 20,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
                <Filter size={14} color="#374151" />
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", margin: 0 }}>Filters</h3>
              </div>

              {/* Sort */}
              <div style={{ marginBottom: 18 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 6, display: "block" }}>Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  style={{
                    width: "100%", padding: "7px 10px", border: "1px solid #e2e8f0", borderRadius: 6,
                    fontSize: 12, color: "#374151", backgroundColor: "#ffffff", cursor: "pointer",
                  }}
                >
                  <option value="relevance">Best Match</option>
                  <option value="rating">Highest Rating</option>
                  <option value="priceLow">Lowest Price</option>
                  <option value="priceHigh">Highest Price</option>
                </select>
              </div>

              {/* Location */}
              <div style={{ marginBottom: 18 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 6, display: "block" }}>Location</label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  style={{
                    width: "100%", padding: "7px 10px", border: "1px solid #e2e8f0", borderRadius: 6,
                    fontSize: 12, color: "#374151", backgroundColor: "#ffffff", cursor: "pointer",
                  }}
                >
                  <option value="all">All Locations</option>
                  {allLocations.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              {/* Vehicle Type (for loads) */}
              {(category === "all" || category === "loads") && (
                <div style={{ marginBottom: 18 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 6, display: "block" }}>Vehicle Type</label>
                  <select
                    value={selectedVehicleType}
                    onChange={(e) => setSelectedVehicleType(e.target.value)}
                    style={{
                      width: "100%", padding: "7px 10px", border: "1px solid #e2e8f0", borderRadius: 6,
                      fontSize: 12, color: "#374151", backgroundColor: "#ffffff", cursor: "pointer",
                    }}
                  >
                    <option value="all">All Vehicles</option>
                    {vehicleTypes.map((vt) => (
                      <option key={vt} value={vt}>{vt}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Min Rating */}
              <div style={{ marginBottom: 18 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 6, display: "block" }}>
                  Min Rating: {minRating > 0 ? `${minRating}+` : "Any"}
                </label>
                <div style={{ display: "flex", gap: 4 }}>
                  {[0, 3, 3.5, 4, 4.5].map((r) => (
                    <button
                      key={r}
                      onClick={() => setMinRating(r)}
                      style={{
                        padding: "4px 8px", border: `1px solid ${minRating === r ? "#2563eb" : "#e2e8f0"}`,
                        borderRadius: 4, cursor: "pointer", fontSize: 11, fontWeight: 500,
                        color: minRating === r ? "#2563eb" : "#64748b",
                        backgroundColor: minRating === r ? "#EFF6FF" : "#ffffff",
                      }}
                    >
                      {r === 0 ? "Any" : `${r}+`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status (for loads) */}
              {(category === "all" || category === "loads") && (
                <div style={{ marginBottom: 18 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 6, display: "block" }}>Load Status</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    style={{
                      width: "100%", padding: "7px 10px", border: "1px solid #e2e8f0", borderRadius: 6,
                      fontSize: 12, color: "#374151", backgroundColor: "#ffffff", cursor: "pointer",
                    }}
                  >
                    <option value="all">All Statuses</option>
                    <option value="open">Open</option>
                    <option value="bidding">Bidding</option>
                    <option value="awarded">Awarded</option>
                    <option value="in_transit">In Transit</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </div>
              )}

              {/* Verified toggle */}
              <div style={{ marginBottom: 10 }}>
                <label style={{
                  display: "flex", alignItems: "center", gap: 8, cursor: "pointer",
                  fontSize: 12, fontWeight: 500, color: "#374151",
                }}>
                  <input
                    type="checkbox"
                    checked={verifiedOnly}
                    onChange={(e) => setVerifiedOnly(e.target.checked)}
                    style={{ width: 16, height: 16, cursor: "pointer" }}
                  />
                  <Shield size={12} color="#2563eb" /> Verified Only
                </label>
              </div>

              {/* Clear filters */}
              <button
                onClick={() => {
                  setVerifiedOnly(false);
                  setMinRating(0);
                  setSelectedLocation("all");
                  setSelectedVehicleType("all");
                  setSelectedStatus("all");
                  setSortBy("relevance");
                }}
                style={{
                  width: "100%", padding: "8px", border: "1px solid #e2e8f0", borderRadius: 6,
                  cursor: "pointer", fontSize: 12, fontWeight: 500, color: "#6B7280",
                  backgroundColor: "#f8fafc", marginTop: 8,
                }}
              >
                Clear All Filters
              </button>
            </aside>
          )}

          {/* Results area */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* No query state */}
            {!query && (
              <div style={{
                textAlign: "center", padding: "60px 24px",
                backgroundColor: "#ffffff", borderRadius: 12, border: "1px solid #e2e8f0",
              }}>
                <div style={{
                  width: 64, height: 64, borderRadius: "50%", backgroundColor: "#f1f5f9",
                  display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px",
                }}>
                  <Search size={28} color="#94a3b8" />
                </div>
                <h2 style={{ fontSize: 20, fontWeight: 600, color: "#0f172a", marginBottom: 8 }}>
                  Search the marketplace
                </h2>
                <p style={{ fontSize: 14, color: "#64748b", maxWidth: 400, margin: "0 auto 24px" }}>
                  Find loads, carriers, and warehouses. Try searching for a city, commodity, or company name.
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8 }}>
                  {popularSearches.slice(0, 6).map((s) => (
                    <button
                      key={s}
                      onClick={() => { setLocalQuery(s); executeSearch(s); }}
                      style={{
                        padding: "6px 14px", border: "1px solid #e2e8f0", borderRadius: 9999,
                        cursor: "pointer", fontSize: 12, fontWeight: 500, color: "#374151",
                        backgroundColor: "#ffffff",
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* No results */}
            {query && totalResults === 0 && (
              <div style={{
                textAlign: "center", padding: "60px 24px",
                backgroundColor: "#ffffff", borderRadius: 12, border: "1px solid #e2e8f0",
              }}>
                <div style={{
                  width: 64, height: 64, borderRadius: "50%", backgroundColor: "#f1f5f9",
                  display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px",
                }}>
                  <Search size={28} color="#94a3b8" />
                </div>
                <h2 style={{ fontSize: 20, fontWeight: 600, color: "#0f172a", marginBottom: 8 }}>
                  No results found
                </h2>
                <p style={{ fontSize: 14, color: "#64748b", maxWidth: 420, margin: "0 auto 20px" }}>
                  We couldn&apos;t find anything matching &ldquo;{searchParams.get("q")}&rdquo;.
                  Try different keywords or browse popular searches below.
                </p>
                <div style={{ marginBottom: 24 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 10 }}>Try these instead:</p>
                  <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8 }}>
                    {popularSearches.slice(0, 6).map((s) => (
                      <button
                        key={s}
                        onClick={() => { setLocalQuery(s); executeSearch(s); }}
                        style={{
                          padding: "6px 14px", border: "1px solid #e2e8f0", borderRadius: 9999,
                          cursor: "pointer", fontSize: 12, fontWeight: 500, color: "#2563eb",
                          backgroundColor: "#EFF6FF",
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
                  <a href="/" style={{
                    display: "flex", alignItems: "center", gap: 5,
                    padding: "8px 20px", borderRadius: 8, border: "1px solid #e2e8f0",
                    fontSize: 13, fontWeight: 500, color: "#374151", textDecoration: "none",
                    backgroundColor: "#ffffff",
                  }}>
                    <Package size={14} /> Browse Loads
                  </a>
                  <a href="/carriers" style={{
                    display: "flex", alignItems: "center", gap: 5,
                    padding: "8px 20px", borderRadius: 8, border: "1px solid #e2e8f0",
                    fontSize: 13, fontWeight: 500, color: "#374151", textDecoration: "none",
                    backgroundColor: "#ffffff",
                  }}>
                    <Truck size={14} /> Browse Carriers
                  </a>
                  <a href="/warehouses" style={{
                    display: "flex", alignItems: "center", gap: 5,
                    padding: "8px 20px", borderRadius: 8, border: "1px solid #e2e8f0",
                    fontSize: 13, fontWeight: 500, color: "#374151", textDecoration: "none",
                    backgroundColor: "#ffffff",
                  }}>
                    <WarehouseIcon size={14} /> Browse Warehouses
                  </a>
                </div>
              </div>
            )}

            {/* ── Loads Results ── */}
            {filteredLoads.length > 0 && (
              <section id="loads" style={{ marginBottom: 32 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Package size={16} color="#2563eb" />
                    </div>
                    <h2 style={{ fontSize: 17, fontWeight: 700, color: "#0f172a", margin: 0 }}>Loads</h2>
                    <span style={{ fontSize: 11, fontWeight: 600, color: "#2563eb", backgroundColor: "#eff6ff", padding: "2px 8px", borderRadius: 9999 }}>
                      {filteredLoads.length}
                    </span>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {filteredLoads.slice(0, 8).map((load) => {
                    const sc = statusColors[load.status] ?? statusColors.open;
                    return (
                      <div key={load.id} style={{
                        backgroundColor: "#ffffff", borderRadius: 10, border: "1px solid #e2e8f0",
                        padding: "14px 18px", display: "flex", alignItems: "center", gap: 14,
                        transition: "box-shadow 0.15s, border-color 0.15s",
                        cursor: "pointer",
                      }}>
                        <div style={{
                          width: 40, height: 40, borderRadius: 8, backgroundColor: "#eff6ff",
                          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                        }}>
                          <Truck size={18} color="#2563eb" />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3, flexWrap: "wrap" }}>
                            <span style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>{load.origin.city}</span>
                            <ArrowRight size={13} color="#94a3b8" />
                            <span style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>{load.destination.city}</span>
                            <span style={{
                              fontSize: 10, fontWeight: 700, color: sc.text, backgroundColor: sc.bg,
                              padding: "2px 8px", borderRadius: 9999, textTransform: "capitalize",
                            }}>
                              {load.status.replace("_", " ")}
                            </span>
                            {load.interIsland && (
                              <span style={{ fontSize: 10, fontWeight: 600, color: "#1e40af", backgroundColor: "#dbeafe", padding: "2px 6px", borderRadius: 4 }}>
                                Inter-Island
                              </span>
                            )}
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#64748b", flexWrap: "wrap" }}>
                            <span>{load.commodity}</span>
                            <span>&middot;</span>
                            <span>{load.vehicleType}</span>
                            <span>&middot;</span>
                            <span>{(load.weightKg / 1000).toFixed(1)}T</span>
                            {load.bids > 0 && (
                              <>
                                <span>&middot;</span>
                                <span style={{ color: "#2563eb", fontWeight: 600 }}>{load.bids} bid{load.bids > 1 ? "s" : ""}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>
                            &#8369;{load.offeredRate.toLocaleString()}
                          </div>
                          <div style={{ fontSize: 11, color: "#94a3b8" }}>{load.rateType}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* ── Carriers Results ── */}
            {filteredCarriers.length > 0 && (
              <section id="carriers" style={{ marginBottom: 32 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Truck size={16} color="#16a34a" />
                    </div>
                    <h2 style={{ fontSize: 17, fontWeight: 700, color: "#0f172a", margin: 0 }}>Carriers</h2>
                    <span style={{ fontSize: 11, fontWeight: 600, color: "#16a34a", backgroundColor: "#f0fdf4", padding: "2px 8px", borderRadius: 9999 }}>
                      {filteredCarriers.length}
                    </span>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {filteredCarriers.slice(0, 8).map((carrier) => (
                    <a
                      key={carrier.id}
                      href={`/carriers/${carrier.orgSlug}`}
                      style={{
                        backgroundColor: "#ffffff", borderRadius: 10, border: "1px solid #e2e8f0",
                        padding: "14px 18px", display: "flex", alignItems: "center", gap: 14,
                        textDecoration: "none", transition: "box-shadow 0.15s",
                      }}
                    >
                      <div style={{
                        width: 40, height: 40, borderRadius: 8, backgroundColor: "#f0fdf4",
                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                      }}>
                        <Truck size={18} color="#16a34a" />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3, flexWrap: "wrap" }}>
                          <span style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>{carrier.name}</span>
                          {carrier.verified && <CheckCircle size={13} color="#16a34a" fill="#dcfce7" />}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#64748b", flexWrap: "wrap" }}>
                          <StarRating rating={carrier.rating} />
                          <span>&middot;</span>
                          <span>{carrier.vehicleCount} vehicles</span>
                          <span>&middot;</span>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 2 }}>
                            <MapPin size={11} /> {carrier.location.city}
                          </span>
                        </div>
                        <div style={{ display: "flex", gap: 4, marginTop: 5, flexWrap: "wrap" }}>
                          {carrier.specializations.slice(0, 3).map((s) => (
                            <span key={s} style={{ padding: "1px 7px", borderRadius: 4, fontSize: 10, fontWeight: 600, backgroundColor: "#F1F5F9", color: "#64748b" }}>{s}</span>
                          ))}
                          {carrier.lanes.slice(0, 2).map((l) => (
                            <span key={l} style={{ padding: "1px 7px", borderRadius: 4, fontSize: 10, fontWeight: 500, backgroundColor: "#ECFDF5", color: "#059669" }}>{l}</span>
                          ))}
                        </div>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>
                          &#8369;{carrier.baseRate}/km
                        </div>
                        <div style={{ fontSize: 11, color: "#94a3b8" }}>{carrier.onTimeRate}% on-time</div>
                      </div>
                      <ChevronRight size={16} color="#94a3b8" />
                    </a>
                  ))}
                </div>
              </section>
            )}

            {/* ── Warehouses Results ── */}
            {filteredWarehouses.length > 0 && (
              <section id="warehouses" style={{ marginBottom: 32 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: "#faf5ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <WarehouseIcon size={16} color="#7c3aed" />
                    </div>
                    <h2 style={{ fontSize: 17, fontWeight: 700, color: "#0f172a", margin: 0 }}>Warehouses</h2>
                    <span style={{ fontSize: 11, fontWeight: 600, color: "#7c3aed", backgroundColor: "#faf5ff", padding: "2px 8px", borderRadius: 9999 }}>
                      {filteredWarehouses.length}
                    </span>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {filteredWarehouses.slice(0, 8).map((wh) => (
                    <a
                      key={wh.id}
                      href={`/warehouses/${wh.orgSlug}`}
                      style={{
                        backgroundColor: "#ffffff", borderRadius: 10, border: "1px solid #e2e8f0",
                        padding: "14px 18px", display: "flex", alignItems: "center", gap: 14,
                        textDecoration: "none", transition: "box-shadow 0.15s",
                      }}
                    >
                      <div style={{
                        width: 40, height: 40, borderRadius: 8, backgroundColor: "#faf5ff",
                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                      }}>
                        <WarehouseIcon size={18} color="#7c3aed" />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3, flexWrap: "wrap" }}>
                          <span style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>{wh.name}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#64748b", flexWrap: "wrap" }}>
                          <StarRating rating={wh.rating} />
                          <span>&middot;</span>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 2 }}>
                            <MapPin size={11} /> {wh.location.city}
                          </span>
                          <span>&middot;</span>
                          <span style={{ color: "#059669", fontWeight: 600 }}>
                            {wh.availableArea.toLocaleString()} sqm available
                          </span>
                        </div>
                        <div style={{ display: "flex", gap: 4, marginTop: 5, flexWrap: "wrap" }}>
                          {wh.types.map((t) => {
                            const tc = typeColors[t] ?? typeColors.dry;
                            return (
                              <span key={t} style={{
                                fontSize: 10, fontWeight: 700, color: tc.text, backgroundColor: tc.bg,
                                padding: "2px 8px", borderRadius: 9999, textTransform: "capitalize",
                              }}>
                                {t.replace("_", " ")}
                              </span>
                            );
                          })}
                          {wh.features.slice(0, 2).map((f) => (
                            <span key={f} style={{ padding: "1px 7px", borderRadius: 4, fontSize: 10, fontWeight: 500, backgroundColor: "#F1F5F9", color: "#64748b" }}>{f}</span>
                          ))}
                        </div>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>
                          &#8369;{wh.rate}
                        </div>
                        <div style={{ fontSize: 11, color: "#94a3b8" }}>per sqm/mo</div>
                      </div>
                      <ChevronRight size={16} color="#94a3b8" />
                    </a>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: "100vh", backgroundColor: "#f1f5f9" }}>
          <Navbar />
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 80, color: "#64748b", fontSize: 15,
          }}>
            Loading search results...
          </div>
        </div>
      }
    >
      <SearchResults />
    </Suspense>
  );
}
