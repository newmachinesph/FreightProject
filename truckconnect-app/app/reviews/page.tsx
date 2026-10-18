"use client";

import { useState, useMemo } from "react";
import { Star, Filter, ChevronDown, Truck, Warehouse, Building2, User, ThumbsUp, Camera, CheckCircle, TrendingUp, PenLine, X, MessageSquare, BarChart3 } from "lucide-react";
import Navbar from "@/components/Navbar";

/* ── StarRating component ────────────────────────────────────── */
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

/* ── Mock reviews ────────────────────────────────────────────── */
type ReviewType = "carrier" | "warehouse";

interface SubRatings {
  dim1: number;
  dim2: number;
  dim3: number;
  dim4: number;
}

interface Review {
  id: number;
  type: ReviewType;
  reviewerName: string;
  reviewerCompany: string;
  rating: number;
  text: string;
  date: string;
  subjectName: string;
  details: string;
  verified: boolean;
  hasPhoto: boolean;
  upvotes: number;
  subRatings: SubRatings;
  response?: { author: string; text: string; date: string };
}

const CARRIER_DIMS = ["On-Time Delivery", "Communication", "Cargo Care", "Pricing Fairness"];
const WAREHOUSE_DIMS = ["Storage Quality", "Temperature Control", "Staff Helpfulness", "Processing Speed"];

const mockReviews: Review[] = [
  {
    id: 1, type: "carrier", reviewerName: "Carlos Mendoza", reviewerCompany: "SunFresh Foods Inc.",
    rating: 5, text: "JMD Trucking delivered our Manila-Cebu FMCG shipment on time. Driver was professional and careful with the cargo. Temperature-controlled reefer van kept everything fresh during the 20-hour transit.",
    date: "2026-03-15", subjectName: "JMD Trucking Services", details: "Manila to Cebu | FMCG | Reefer Van",
    verified: true, hasPhoto: false, upvotes: 24, subRatings: { dim1: 5, dim2: 5, dim3: 5, dim4: 4 },
    response: { author: "JMD Trucking Services", text: "Thank you for trusting us with your cold chain shipment, Carlos! We take pride in maintaining proper temperatures throughout transit. Looking forward to serving SunFresh Foods again.", date: "2026-03-16" },
  },
  {
    id: 2, type: "carrier", reviewerName: "Maria Santos", reviewerCompany: "PhilPack Manufacturing",
    rating: 4, text: "Good overall service from LBC Express Freight. The wing van arrived on schedule at our Laguna warehouse. Minor delay at the Batangas port but driver communicated updates proactively.",
    date: "2026-03-12", subjectName: "LBC Express Freight", details: "Laguna to Batangas | Manufacturing Parts | Wing Van",
    verified: true, hasPhoto: false, upvotes: 11, subRatings: { dim1: 4, dim2: 5, dim3: 4, dim4: 4 },
  },
  {
    id: 3, type: "carrier", reviewerName: "Ricardo Tan", reviewerCompany: "Metro Steel Corp.",
    rating: 5, text: "Excellent flatbed service for our steel beams from Pampanga to Taguig construction site. Driver navigated Manila traffic well and coordinated with our foreman for offloading.",
    date: "2026-03-10", subjectName: "Torres Heavy Haulers", details: "Pampanga to Taguig | Steel Beams | Flatbed",
    verified: true, hasPhoto: true, upvotes: 18, subRatings: { dim1: 5, dim2: 5, dim3: 5, dim4: 5 },
  },
  {
    id: 4, type: "carrier", reviewerName: "Angela Reyes", reviewerCompany: "AgriFresh Exports",
    rating: 3, text: "Delivery was completed but truck arrived 4 hours late due to breakdown in Pangasinan. Customer service was responsive though and they arranged a replacement vehicle quickly.",
    date: "2026-03-08", subjectName: "NorthBound Logistics", details: "Pangasinan to Manila | Agricultural Products | Closed Van",
    verified: true, hasPhoto: false, upvotes: 7, subRatings: { dim1: 2, dim2: 4, dim3: 3, dim4: 3 },
    response: { author: "NorthBound Logistics", text: "We apologize for the delay, Angela. The breakdown was unexpected and we have since upgraded our fleet maintenance schedule. We appreciate your patience and understanding.", date: "2026-03-09" },
  },
  {
    id: 5, type: "carrier", reviewerName: "James Lim", reviewerCompany: "TechHub Philippines",
    rating: 5, text: "Very reliable for our electronics shipments. Closed van was clean and well-maintained. Driver handled our fragile server equipment with extra care. Will definitely book again.",
    date: "2026-03-05", subjectName: "SecureCargo Express", details: "Makati to Clark Freeport | Electronics | Closed Van",
    verified: true, hasPhoto: true, upvotes: 32, subRatings: { dim1: 5, dim2: 4, dim3: 5, dim4: 5 },
  },
  {
    id: 6, type: "carrier", reviewerName: "Patricia Cruz", reviewerCompany: "Isla Beverages Inc.",
    rating: 4, text: "Regular partner for our Visayas distribution. This Manila-Iloilo route was handled smoothly. Reefer maintained correct temperature for our juice products throughout the voyage.",
    date: "2026-03-03", subjectName: "Island Link Carriers", details: "Manila to Iloilo | Beverages | Reefer Van",
    verified: true, hasPhoto: false, upvotes: 9, subRatings: { dim1: 4, dim2: 4, dim3: 5, dim4: 3 },
  },
  {
    id: 7, type: "carrier", reviewerName: "Dennis Uy", reviewerCompany: "Mindanao Coco Products",
    rating: 5, text: "Outstanding service on our Davao-Manila container shipment. Documentation was complete, tracking updates were timely, and delivery arrived a day ahead of schedule.",
    date: "2026-02-28", subjectName: "SouthStar Transport", details: "Davao to Manila | Coconut Products | Container Van",
    verified: true, hasPhoto: false, upvotes: 15, subRatings: { dim1: 5, dim2: 5, dim3: 5, dim4: 4 },
  },
  {
    id: 8, type: "carrier", reviewerName: "Christine Aquino", reviewerCompany: "Luzon Cement Corp.",
    rating: 4, text: "Tanker service for our bulk cement was professional. Driver followed all safety protocols. Only minor issue was paperwork delay at the Bulacan checkpoint.",
    date: "2026-02-25", subjectName: "BulkHaul Philippines", details: "Bulacan to Quezon City | Bulk Cement | Tanker",
    verified: false, hasPhoto: false, upvotes: 6, subRatings: { dim1: 4, dim2: 3, dim3: 5, dim4: 4 },
  },
  {
    id: 9, type: "carrier", reviewerName: "Roberto Villanueva", reviewerCompany: "FreshMart Supermarket",
    rating: 2, text: "Disappointing experience. Reefer unit malfunctioned during transit causing temperature fluctuation. Lost 15% of our frozen goods. Filed a claim but still waiting for resolution.",
    date: "2026-02-22", subjectName: "FastFreeze Logistics", details: "Cavite to Makati | Frozen Goods | Reefer Van",
    verified: true, hasPhoto: true, upvotes: 28, subRatings: { dim1: 3, dim2: 2, dim3: 1, dim4: 3 },
    response: { author: "FastFreeze Logistics", text: "Roberto, we sincerely apologize for the equipment failure. Your claim is being processed and our team will contact you within 48 hours with a resolution. We have replaced the faulty reefer unit.", date: "2026-02-23" },
  },
  {
    id: 10, type: "carrier", reviewerName: "Sophia Garcia", reviewerCompany: "PH Fashion Group",
    rating: 5, text: "Perfect for our garment shipments. Clean van, careful handling, and on-time delivery to our Cebu boutiques. The driver even helped with organized unloading. Highly recommended!",
    date: "2026-02-18", subjectName: "MetroLink Express", details: "Manila to Cebu | Garments | Wing Van",
    verified: true, hasPhoto: false, upvotes: 14, subRatings: { dim1: 5, dim2: 4, dim3: 5, dim4: 5 },
  },
  {
    id: 11, type: "carrier", reviewerName: "Eduardo Bautista", reviewerCompany: "ConstructPH Builders",
    rating: 4, text: "Heavy equipment transport from Subic to our Batangas project site went well. Flatbed was properly secured and escort vehicle was provided. Professional operation.",
    date: "2026-02-15", subjectName: "HeavyLift Transport Co.", details: "Subic to Batangas | Construction Equipment | Flatbed",
    verified: true, hasPhoto: true, upvotes: 10, subRatings: { dim1: 4, dim2: 4, dim3: 5, dim4: 3 },
  },
  {
    id: 12, type: "carrier", reviewerName: "Megan Flores", reviewerCompany: "VitaPharm Distributors",
    rating: 5, text: "Critical pharma shipment handled with utmost care. Temperature logs were provided upon delivery. Compliance documentation was complete. Best cold chain carrier we have worked with.",
    date: "2026-02-12", subjectName: "PharmaFreight Solutions", details: "Muntinlupa to General Santos | Pharmaceuticals | Reefer Van",
    verified: true, hasPhoto: false, upvotes: 21, subRatings: { dim1: 5, dim2: 5, dim3: 5, dim4: 4 },
  },
  {
    id: 13, type: "warehouse", reviewerName: "Antonio Dela Cruz", reviewerCompany: "Pacific Trading Co.",
    rating: 5, text: "Excellent cold storage facility in Paranaque. Their inventory management system is top-notch and we get real-time stock visibility. Staff is well-trained and responsive.",
    date: "2026-03-14", subjectName: "ColdChain Warehouse Paranaque", details: "Cold Storage | 2,500 sqm | Paranaque",
    verified: true, hasPhoto: false, upvotes: 19, subRatings: { dim1: 5, dim2: 5, dim3: 5, dim4: 4 },
    response: { author: "ColdChain Warehouse Paranaque", text: "Thank you, Antonio! We recently upgraded our WMS to provide even better real-time visibility. We value our partnership with Pacific Trading Co.", date: "2026-03-15" },
  },
  {
    id: 14, type: "warehouse", reviewerName: "Lisa Tan", reviewerCompany: "GlobalSource Imports",
    rating: 4, text: "Convenient location near Manila port. Cross-docking services are efficient. Loading bays are well-organized. Only wish they had extended operating hours on weekends.",
    date: "2026-03-11", subjectName: "PortSide Logistics Hub", details: "General Warehouse | 5,000 sqm | Port Area Manila",
    verified: true, hasPhoto: false, upvotes: 8, subRatings: { dim1: 4, dim2: 3, dim3: 4, dim4: 5 },
  },
  {
    id: 15, type: "warehouse", reviewerName: "Mark Ong", reviewerCompany: "E-Commerce Express PH",
    rating: 5, text: "Best fulfillment center for our e-commerce operations. Pick-and-pack accuracy is 99.8%. Integration with our Shopify store is seamless. Scaling our business would be impossible without them.",
    date: "2026-03-07", subjectName: "FulfillPH Warehouse", details: "E-Commerce Fulfillment | 3,200 sqm | Caloocan",
    verified: true, hasPhoto: true, upvotes: 35, subRatings: { dim1: 5, dim2: 4, dim3: 5, dim4: 5 },
  },
  {
    id: 16, type: "warehouse", reviewerName: "Grace Lim", reviewerCompany: "Sunshine Agri Trading",
    rating: 3, text: "Adequate facility for our rice and grain storage. Pest control could be improved though. We noticed some issues with humidity control in the older section of the warehouse.",
    date: "2026-03-01", subjectName: "AgriStore Central Luzon", details: "Agricultural Storage | 8,000 sqm | Tarlac",
    verified: false, hasPhoto: false, upvotes: 5, subRatings: { dim1: 3, dim2: 2, dim3: 4, dim4: 3 },
  },
  {
    id: 17, type: "warehouse", reviewerName: "Victor Chua", reviewerCompany: "AutoParts Philippines",
    rating: 4, text: "Clean and well-organized facility in Laguna Technopark. Racking system is modern and space-efficient. Good security with 24/7 CCTV monitoring. Fork-lifts are well-maintained.",
    date: "2026-02-26", subjectName: "TechPark Warehouse Laguna", details: "Industrial Storage | 4,500 sqm | Laguna",
    verified: true, hasPhoto: false, upvotes: 12, subRatings: { dim1: 5, dim2: 3, dim3: 4, dim4: 4 },
  },
  {
    id: 18, type: "warehouse", reviewerName: "Nina Ramos", reviewerCompany: "Island Fresh Seafood",
    rating: 5, text: "Their blast freezing capability saved our tuna export shipment. Facility is HACCP-certified and FDA-compliant. Temperature monitoring is precise. Worth every peso of the premium rate.",
    date: "2026-02-20", subjectName: "FreezeMax Cold Storage", details: "Blast Freezing & Cold Storage | 1,800 sqm | General Santos",
    verified: true, hasPhoto: true, upvotes: 26, subRatings: { dim1: 5, dim2: 5, dim3: 5, dim4: 4 },
  },
  {
    id: 19, type: "warehouse", reviewerName: "David Santos", reviewerCompany: "PH Retail Solutions",
    rating: 4, text: "Great distribution center for our Visayas operations. Strategic location in Mandaue allows quick delivery to Cebu, Bohol, and Leyte. Staff is friendly and efficient.",
    date: "2026-02-16", subjectName: "VisayanHub Distribution Center", details: "Distribution Center | 6,000 sqm | Mandaue, Cebu",
    verified: true, hasPhoto: false, upvotes: 10, subRatings: { dim1: 4, dim2: 3, dim3: 5, dim4: 4 },
  },
  {
    id: 20, type: "warehouse", reviewerName: "Rachel Sy", reviewerCompany: "Luxe Cosmetics PH",
    rating: 2, text: "Facility looks good but operations need improvement. Two of our shipments were misplaced for days. Inventory count was off by 3%. Not suitable for high-value cosmetics.",
    date: "2026-02-10", subjectName: "MegaStore Warehouse Cavite", details: "General Warehouse | 7,500 sqm | Cavite",
    verified: true, hasPhoto: false, upvotes: 22, subRatings: { dim1: 2, dim2: 3, dim3: 3, dim4: 2 },
    response: { author: "MegaStore Warehouse Cavite", text: "Rachel, we deeply regret the issues you experienced. We have since implemented new barcode scanning at every touchpoint and hired an additional inventory control manager. We would welcome the chance to earn back your trust.", date: "2026-02-12" },
  },
];

/* ── Keyword extraction ──────────────────────────────────────── */
const KEYWORD_PHRASES = [
  "on time", "on-time", "professional", "cold chain", "temperature", "damaged",
  "careful", "reliable", "clean", "well-maintained", "responsive", "delay",
  "breakdown", "malfunctioned", "fresh", "safety", "tracking", "compliance",
  "accurate", "efficient", "friendly", "organized", "seamless", "real-time",
];

function extractKeywords(reviews: Review[]) {
  const counts: Record<string, number> = {};
  reviews.forEach((r) => {
    const lower = r.text.toLowerCase();
    KEYWORD_PHRASES.forEach((kw) => {
      if (lower.includes(kw)) {
        const display = kw.replace("-", " ");
        counts[display] = (counts[display] || 0) + 1;
      }
    });
  });
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);
}

/* ── Rating trend data (last 6 months) ───────────────────────── */
const ratingTrend = [
  { month: "Oct 2025", avg: 3.8 },
  { month: "Nov 2025", avg: 4.0 },
  { month: "Dec 2025", avg: 3.9 },
  { month: "Jan 2026", avg: 4.2 },
  { month: "Feb 2026", avg: 4.1 },
  { month: "Mar 2026", avg: 4.4 },
];

/* ── Computed stats ──────────────────────────────────────────── */
const totalReviews = mockReviews.length;
const avgRating = mockReviews.reduce((s, r) => s + r.rating, 0) / totalReviews;
const breakdown = [5, 4, 3, 2, 1].map((star) => {
  const count = mockReviews.filter((r) => r.rating === star).length;
  return { star, count, pct: Math.round((count / totalReviews) * 100) };
});

const mostHelpfulReview = [...mockReviews].sort((a, b) => b.upvotes - a.upvotes)[0];

type FilterTab = "all" | "carrier" | "warehouse";
type SortOption = "recent" | "highest" | "lowest" | "most_helpful";

/* ── SubRating bar component ─────────────────────────────────── */
function SubRatingBar({ label, value }: { label: string; value: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ fontSize: 11, color: "#6B7280", width: 110, textAlign: "right", flexShrink: 0 }}>{label}</span>
      <div style={{ flex: 1, height: 7, background: "#F3F4F6", borderRadius: 4, overflow: "hidden" }}>
        <div style={{ width: `${(value / 5) * 100}%`, height: "100%", background: value >= 4 ? "#10B981" : value >= 3 ? "#F59E0B" : "#EF4444", borderRadius: 4, transition: "width 0.3s" }} />
      </div>
      <span style={{ fontSize: 11, fontWeight: 600, color: "#374151", width: 22 }}>{value.toFixed(1)}</span>
    </div>
  );
}

export default function ReviewsPage() {
  const [tab, setTab] = useState<FilterTab>("all");
  const [sort, setSort] = useState<SortOption>("recent");
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [expandedReview, setExpandedReview] = useState<number | null>(null);

  const filtered = useMemo(() => {
    let list = tab === "all" ? mockReviews : mockReviews.filter((r) => r.type === tab);
    if (sort === "recent") list = [...list].sort((a, b) => b.date.localeCompare(a.date));
    else if (sort === "highest") list = [...list].sort((a, b) => b.rating - a.rating);
    else if (sort === "most_helpful") list = [...list].sort((a, b) => b.upvotes - a.upvotes);
    else list = [...list].sort((a, b) => a.rating - b.rating);
    return list;
  }, [tab, sort]);

  const keywords = useMemo(() => extractKeywords(filtered), [filtered]);
  const trendMax = Math.max(...ratingTrend.map((t) => t.avg));

  return (
    <>
      <Navbar active="Reviews" />
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 20px 64px" }}>
        {/* ── Page title + Write Review CTA ────────── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: "#111827", marginBottom: 4 }}>Platform Reviews</h1>
            <p style={{ fontSize: 14, color: "#6B7280", margin: 0 }}>Verified feedback from shippers and clients across the TruckConnect marketplace</p>
          </div>
          <button
            onClick={() => setShowWriteReview(true)}
            style={{
              padding: "10px 24px", borderRadius: 10, border: "none", cursor: "pointer",
              background: "#2563EB", color: "#fff", fontSize: 14, fontWeight: 700,
              display: "flex", alignItems: "center", gap: 8, boxShadow: "0 2px 8px rgba(37,99,235,0.18)",
            }}
          >
            <PenLine size={16} /> Write a Review
          </button>
        </div>

        {/* ── Write Review Modal ──────────────────── */}
        {showWriteReview && (
          <div style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
          }}
            onClick={() => setShowWriteReview(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "#fff", borderRadius: 16, padding: "32px 36px", width: 480, maxWidth: "90vw",
                boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: "#111827", margin: 0 }}>Write a Review</h2>
                <button onClick={() => setShowWriteReview(false)} style={{ border: "none", background: "transparent", cursor: "pointer", padding: 4 }}>
                  <X size={20} color="#6B7280" />
                </button>
              </div>
              <div style={{ padding: "24px 0", textAlign: "center", color: "#6B7280", fontSize: 14 }}>
                <User size={40} color="#D1D5DB" style={{ marginBottom: 12 }} />
                <p style={{ margin: 0, marginBottom: 4, fontWeight: 600, color: "#374151" }}>Sign in to write a review</p>
                <p style={{ margin: 0, fontSize: 13 }}>You need to be logged in and have a completed shipment to leave a verified review.</p>
                <button
                  style={{
                    marginTop: 20, padding: "10px 32px", borderRadius: 8, border: "none",
                    background: "#2563EB", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer",
                  }}
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Stats header with rating breakdown ──── */}
        <div style={{
          display: "grid", gridTemplateColumns: "220px 1fr", gap: 32,
          background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 14,
          padding: "28px 32px", marginBottom: 20,
        }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", borderRight: "1px solid #F3F4F6", paddingRight: 24 }}>
            <span style={{ fontSize: 48, fontWeight: 800, color: "#111827", lineHeight: 1 }}>{avgRating.toFixed(1)}</span>
            <StarRating rating={avgRating} size={20} showValue={false} />
            <span style={{ fontSize: 13, color: "#6B7280", marginTop: 6 }}>{totalReviews} total reviews</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, justifyContent: "center" }}>
            {breakdown.map((b) => (
              <div key={b.star} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#374151", width: 28, textAlign: "right" }}>{b.star}{"\u2605"}</span>
                <div style={{ flex: 1, height: 10, background: "#F3F4F6", borderRadius: 5, overflow: "hidden" }}>
                  <div style={{ width: `${b.pct}%`, height: "100%", background: "#F59E0B", borderRadius: 5, transition: "width 0.3s" }} />
                </div>
                <span style={{ fontSize: 12, color: "#6B7280", width: 40 }}>{b.pct}% ({b.count})</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Analytics: Keywords + Rating Trend ──── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 28 }}>
          {/* Most Mentioned Keywords */}
          <div style={{
            background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 14, padding: "20px 24px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <BarChart3 size={16} color="#2563EB" />
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#111827", margin: 0 }}>Most Mentioned Keywords</h3>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {keywords.map(([kw, count]) => (
                <span key={kw} style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "5px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                  background: "#F0F9FF", color: "#0369A1", border: "1px solid #BAE6FD",
                }}>
                  &ldquo;{kw}&rdquo;
                  <span style={{
                    background: "#0369A1", color: "#fff", borderRadius: 10,
                    padding: "1px 7px", fontSize: 10, fontWeight: 700, lineHeight: "16px",
                  }}>
                    {count}
                  </span>
                </span>
              ))}
            </div>
          </div>

          {/* Rating Timeline Trend */}
          <div style={{
            background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 14, padding: "20px 24px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <TrendingUp size={16} color="#059669" />
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#111827", margin: 0 }}>Average Rating Trend (6 Months)</h3>
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 100 }}>
              {ratingTrend.map((t) => {
                const height = (t.avg / 5) * 100;
                return (
                  <div key={t.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#059669" }}>{t.avg.toFixed(1)}</span>
                    <div style={{
                      width: "100%", maxWidth: 40, height: `${height}%`, borderRadius: "6px 6px 0 0",
                      background: `linear-gradient(180deg, #10B981 0%, #059669 100%)`, minHeight: 8,
                    }} />
                    <span style={{ fontSize: 9, color: "#6B7280", whiteSpace: "nowrap" }}>{t.month.split(" ")[0]}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Most Helpful Review Highlight ────────── */}
        <div style={{
          background: "linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)", border: "1px solid #FDE68A", borderRadius: 14,
          padding: "20px 24px", marginBottom: 28,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <ThumbsUp size={16} color="#D97706" />
            <span style={{ fontSize: 13, fontWeight: 700, color: "#92400E" }}>Most Helpful Review</span>
            <span style={{ fontSize: 11, color: "#B45309", background: "#FDE68A", padding: "2px 8px", borderRadius: 8, fontWeight: 600 }}>
              {mostHelpfulReview.upvotes} upvotes
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: mostHelpfulReview.type === "carrier" ? "#DBEAFE" : "#EDE9FE",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 700, color: mostHelpfulReview.type === "carrier" ? "#2563EB" : "#7C3AED",
            }}>
              {mostHelpfulReview.reviewerName.charAt(0)}
            </div>
            <div>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{mostHelpfulReview.reviewerName}</span>
              <span style={{ fontSize: 12, color: "#6B7280", marginLeft: 8 }}>{mostHelpfulReview.reviewerCompany}</span>
            </div>
            <StarRating rating={mostHelpfulReview.rating} size={12} />
          </div>
          <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.6, margin: 0 }}>
            &ldquo;{mostHelpfulReview.text}&rdquo;
          </p>
          <div style={{ fontSize: 11, color: "#92400E", marginTop: 8 }}>
            Reviewing: <strong>{mostHelpfulReview.subjectName}</strong> &middot; {mostHelpfulReview.details}
          </div>
        </div>

        {/* ── Filter tabs + sort ────────────────────── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", gap: 8 }}>
            {([["all", "All Reviews"], ["carrier", "Carrier Reviews"], ["warehouse", "Warehouse Reviews"]] as const).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                style={{
                  padding: "7px 18px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer",
                  border: tab === key ? "1.5px solid #2563EB" : "1px solid #E5E7EB",
                  background: tab === key ? "#EFF6FF" : "#fff",
                  color: tab === key ? "#2563EB" : "#6B7280",
                  display: "flex", alignItems: "center", gap: 5,
                }}
              >
                {key === "carrier" && <Truck size={13} />}
                {key === "warehouse" && <Warehouse size={13} />}
                {label}
              </button>
            ))}
          </div>
          <div style={{ position: "relative" }}>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              style={{
                appearance: "none", padding: "7px 32px 7px 12px", borderRadius: 8, fontSize: 13,
                border: "1px solid #E5E7EB", background: "#fff", color: "#374151", cursor: "pointer", fontWeight: 500,
              }}
            >
              <option value="recent">Most Recent</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
              <option value="most_helpful">Most Helpful</option>
            </select>
            <ChevronDown size={14} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#9CA3AF" }} />
          </div>
        </div>

        {/* ── Reviews list ──────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {filtered.map((review) => {
            const dims = review.type === "carrier" ? CARRIER_DIMS : WAREHOUSE_DIMS;
            const subValues = [review.subRatings.dim1, review.subRatings.dim2, review.subRatings.dim3, review.subRatings.dim4];
            const isExpanded = expandedReview === review.id;

            return (
              <div key={review.id} style={{
                background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 12, padding: "22px 26px",
                transition: "box-shadow 0.2s",
              }}>
                {/* Top row: reviewer info + rating */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: "50%",
                      background: review.type === "carrier" ? "#DBEAFE" : "#EDE9FE",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 15, fontWeight: 700, color: review.type === "carrier" ? "#2563EB" : "#7C3AED",
                    }}>
                      {review.reviewerName.charAt(0)}
                    </div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{review.reviewerName}</span>
                        {review.verified && (
                          <span style={{
                            display: "inline-flex", alignItems: "center", gap: 3,
                            padding: "2px 8px", borderRadius: 6, fontSize: 10, fontWeight: 700,
                            background: "#D1FAE5", color: "#065F46",
                          }}>
                            <CheckCircle size={10} /> Verified Shipment
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: 12, color: "#6B7280" }}>{review.reviewerCompany}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2 }}>
                    <StarRating rating={review.rating} size={14} />
                    <span style={{ fontSize: 11, color: "#9CA3AF" }}>{new Date(review.date).toLocaleDateString("en-PH", { year: "numeric", month: "short", day: "numeric" })}</span>
                  </div>
                </div>

                {/* Subject badge + photo/upvote badges */}
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: 4,
                    padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600,
                    background: review.type === "carrier" ? "#EFF6FF" : "#F5F3FF",
                    color: review.type === "carrier" ? "#2563EB" : "#7C3AED",
                  }}>
                    {review.type === "carrier" ? <Truck size={11} /> : <Warehouse size={11} />}
                    {review.subjectName}
                  </span>
                  <span style={{ fontSize: 11, color: "#9CA3AF" }}>{review.details}</span>
                  {review.hasPhoto && (
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: 4,
                      padding: "3px 8px", borderRadius: 6, fontSize: 10, fontWeight: 600,
                      background: "#FEF3C7", color: "#92400E",
                    }}>
                      <Camera size={10} /> Photo attached
                    </span>
                  )}
                </div>

                {/* Review text */}
                <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.65, margin: "0 0 10px 0" }}>{review.text}</p>

                {/* Upvote + expand */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <button style={{
                      display: "flex", alignItems: "center", gap: 4, padding: "4px 10px",
                      borderRadius: 6, border: "1px solid #E5E7EB", background: "#F9FAFB",
                      cursor: "pointer", fontSize: 11, fontWeight: 600, color: "#6B7280",
                    }}>
                      <ThumbsUp size={11} /> Helpful ({review.upvotes})
                    </button>
                  </div>
                  <button
                    onClick={() => setExpandedReview(isExpanded ? null : review.id)}
                    style={{
                      border: "none", background: "transparent", cursor: "pointer",
                      fontSize: 12, fontWeight: 600, color: "#2563EB",
                      display: "flex", alignItems: "center", gap: 4,
                    }}
                  >
                    {isExpanded ? "Hide Details" : "Show Ratings"}
                    <ChevronDown size={12} style={{ transform: isExpanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                  </button>
                </div>

                {/* Expanded: Sub-ratings */}
                {isExpanded && (
                  <div style={{
                    marginTop: 14, paddingTop: 14, borderTop: "1px solid #F3F4F6",
                  }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 10 }}>Rating Breakdown</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, maxWidth: 360 }}>
                      {dims.map((dim, i) => (
                        <SubRatingBar key={dim} label={dim} value={subValues[i]} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Carrier/Warehouse response */}
                {review.response && (
                  <div style={{
                    marginTop: 14, padding: "14px 18px", borderRadius: 10,
                    background: "#F9FAFB", borderLeft: "3px solid #2563EB",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                      <MessageSquare size={12} color="#2563EB" />
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#2563EB" }}>{review.response.author}</span>
                      <span style={{ fontSize: 10, color: "#9CA3AF" }}>
                        {new Date(review.response.date).toLocaleDateString("en-PH", { year: "numeric", month: "short", day: "numeric" })}
                      </span>
                    </div>
                    <p style={{ fontSize: 13, color: "#4B5563", lineHeight: 1.55, margin: 0 }}>{review.response.text}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}
