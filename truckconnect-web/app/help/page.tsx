"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Search,
  ChevronDown,
  Rocket,
  Truck,
  Package,
  Warehouse,
  CreditCard,
  Shield,
  Mail,
  Phone,
  ArrowRight,
} from "lucide-react";
import type { CSSProperties } from "react";

const COLORS = {
  navy: "#1B2D5E",
  navyDark: "#142248",
  blue: "#2563EB",
  white: "#ffffff",
  gray50: "#f8fafc",
  gray100: "#f1f5f9",
  gray200: "#e2e8f0",
  gray300: "#cbd5e1",
  gray400: "#94a3b8",
  gray500: "#64748b",
  gray600: "#475569",
  gray700: "#334155",
  green: "#059669",
};

const container: CSSProperties = { maxWidth: 1200, margin: "0 auto", padding: "0 24px" };

interface FAQ {
  q: string;
  a: string;
}

interface Category {
  title: string;
  icon: React.ReactNode;
  color: string;
  faqs: FAQ[];
}

const CATEGORIES: Category[] = [
  {
    title: "Getting Started",
    icon: <Rocket size={24} />,
    color: "#2563EB",
    faqs: [
      {
        q: "How do I create a TruckConnect account?",
        a: "Visit truckconnect.ph and click \"Get Started Free.\" Choose your role -- Shipper, Carrier, or Warehouse Operator -- fill in your business details, verify your email, and you are ready to go. The entire process takes under 5 minutes.",
      },
      {
        q: "Is TruckConnect free to use?",
        a: "Signing up and browsing the marketplace is completely free. Shippers pay a small platform fee only when a load is successfully booked and delivered. Carriers can list their trucks and receive booking requests at no upfront cost. We also offer Pro and Enterprise plans with advanced features like analytics dashboards, API access, and dedicated account managers.",
      },
      {
        q: "What regions does TruckConnect cover?",
        a: "We currently operate across Luzon, Visayas, and Mindanao. Our carrier network covers major routes including Metro Manila, Central Luzon, CALABARZON, Cebu, Iloilo, Davao, and Cagayan de Oro. We are continuously expanding to more areas, including interisland freight routes.",
      },
    ],
  },
  {
    title: "For Shippers",
    icon: <Package size={24} />,
    color: "#059669",
    faqs: [
      {
        q: "How do I post a load?",
        a: "From your Shipper Dashboard, click \"Post a Load,\" enter the pickup and delivery addresses, cargo type, weight, and preferred dates. You will receive quotes from verified carriers within minutes. You can also set a budget and let carriers bid on your shipment.",
      },
      {
        q: "Can I track my shipment in real time?",
        a: "Yes. Once a carrier accepts your load, you will see live GPS tracking on your dashboard. You will also receive automated status updates via SMS and email at key milestones: pickup, in-transit, and delivery confirmation.",
      },
      {
        q: "What types of cargo can I ship?",
        a: "TruckConnect supports a wide range of cargo including dry goods, refrigerated items, construction materials, agricultural products, and general merchandise. Hazardous materials require special carrier certification -- our platform will automatically match you with certified carriers.",
      },
      {
        q: "How is pricing determined?",
        a: "Pricing is transparent and market-driven. When you post a load, our algorithm suggests a fair price range based on distance, cargo type, truck size, and current market rates. Carriers can then quote within or outside this range. You always see the full breakdown before confirming a booking.",
      },
    ],
  },
  {
    title: "For Carriers",
    icon: <Truck size={24} />,
    color: "#7C3AED",
    faqs: [
      {
        q: "How do I register my trucks?",
        a: "After creating a Carrier account, go to \"My Fleet\" and add each vehicle with its plate number, type (4-wheeler, 6-wheeler, 10-wheeler, trailer, etc.), capacity, and photos. Our team verifies vehicle registrations within 24 hours.",
      },
      {
        q: "How do I find loads to haul?",
        a: "The Load Board shows all available shipments matching your truck type and preferred routes. You can filter by origin, destination, cargo type, and payout. Enable push notifications to get alerted the moment a matching load is posted.",
      },
      {
        q: "When do I get paid?",
        a: "Carriers are paid within 3 business days after delivery confirmation. Payments are sent directly to your registered bank account or GCash/Maya wallet. For Pro carriers, we offer instant payouts for a small processing fee.",
      },
      {
        q: "What documents do I need?",
        a: "You will need a valid business permit (or DTI registration for sole proprietors), vehicle OR/CR copies, driver licenses, and proof of cargo insurance. All documents are uploaded securely through the platform and verified by our compliance team.",
      },
    ],
  },
  {
    title: "For Warehouses",
    icon: <Warehouse size={24} />,
    color: "#D97706",
    faqs: [
      {
        q: "How do I list my warehouse?",
        a: "From the Warehouse Portal, click \"List a Facility\" and provide your location, total area, available space, amenities (cold storage, loading docks, forklift access, etc.), and pricing per square meter per month. Add photos and your listing goes live after a quick review.",
      },
      {
        q: "Can I manage bookings through TruckConnect?",
        a: "Absolutely. The Warehouse Dashboard lets you manage all reservations, track occupancy in real time, communicate with tenants, and generate invoices. You can set availability calendars and minimum booking durations.",
      },
      {
        q: "What fees does TruckConnect charge warehouses?",
        a: "We charge a 5% platform commission on completed warehouse bookings. There are no listing fees or monthly subscriptions. Enterprise warehouse operators with multiple facilities can negotiate custom rates with our sales team.",
      },
    ],
  },
  {
    title: "Payments & Billing",
    icon: <CreditCard size={24} />,
    color: "#DC2626",
    faqs: [
      {
        q: "What payment methods are accepted?",
        a: "Shippers can pay via bank transfer, credit/debit card, GCash, or Maya. Carriers and warehouse operators receive payouts to their bank accounts or e-wallets. All transactions are processed through PCI-DSS compliant payment partners.",
      },
      {
        q: "How do refunds work?",
        a: "If a shipment is canceled before carrier pickup, you receive a full refund. Cancellations after pickup are subject to a cancellation fee based on the distance already covered. Disputes are handled by our support team within 48 hours. Refunds are credited back to your original payment method.",
      },
      {
        q: "Where can I find my invoices?",
        a: "All invoices and receipts are available in the \"Billing\" section of your dashboard. You can download PDF invoices, view transaction history, and export reports for your accounting team. We also support BIR-compliant official receipts.",
      },
    ],
  },
  {
    title: "Account & Security",
    icon: <Shield size={24} />,
    color: "#0891B2",
    faqs: [
      {
        q: "How do I reset my password?",
        a: "Click \"Forgot Password\" on the login page and enter your registered email. You will receive a password reset link valid for 24 hours. For security, we recommend using a strong password with at least 12 characters, including numbers and special characters.",
      },
      {
        q: "Is my data secure on TruckConnect?",
        a: "Yes. We use industry-standard AES-256 encryption for data at rest and TLS 1.3 for data in transit. Our infrastructure is hosted on enterprise-grade cloud servers with SOC 2 compliance. We never share your business data with third parties without your explicit consent.",
      },
      {
        q: "Can I have multiple users on one company account?",
        a: "Yes. Business accounts support unlimited team members with role-based access control. Admins can invite dispatchers, finance staff, and managers with specific permissions. Each user has their own login credentials and activity log.",
      },
    ],
  },
];

function FAQItem({ faq }: { faq: FAQ }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        borderBottom: `1px solid ${COLORS.gray200}`,
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "18px 0",
          border: "none",
          backgroundColor: "transparent",
          cursor: "pointer",
          textAlign: "left",
          gap: 16,
        }}
      >
        <span style={{ fontSize: 15, fontWeight: 600, color: COLORS.navy, lineHeight: 1.4 }}>
          {faq.q}
        </span>
        <ChevronDown
          size={18}
          color={COLORS.gray400}
          style={{
            minWidth: 18,
            transition: "transform 0.2s",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>
      <div
        style={{
          maxHeight: open ? 400 : 0,
          overflow: "hidden",
          transition: "max-height 0.3s ease",
        }}
      >
        <p
          style={{
            fontSize: 14,
            color: COLORS.gray600,
            lineHeight: 1.7,
            margin: 0,
            padding: "0 0 18px",
          }}
        >
          {faq.a}
        </p>
      </div>
    </div>
  );
}

function CategorySection({ category }: { category: Category }) {
  return (
    <div
      style={{
        padding: "32px",
        borderRadius: 16,
        border: `1px solid ${COLORS.gray200}`,
        backgroundColor: COLORS.white,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            backgroundColor: `${category.color}14`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: category.color,
          }}
        >
          {category.icon}
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: COLORS.navy, margin: 0 }}>
          {category.title}
        </h2>
      </div>
      <div>
        {category.faqs.map((faq, i) => (
          <FAQItem key={i} faq={faq} />
        ))}
      </div>
    </div>
  );
}

export default function HelpPage() {
  const [search, setSearch] = useState("");

  const filtered = search.trim()
    ? CATEGORIES.map((cat) => ({
        ...cat,
        faqs: cat.faqs.filter(
          (f) =>
            f.q.toLowerCase().includes(search.toLowerCase()) ||
            f.a.toLowerCase().includes(search.toLowerCase())
        ),
      })).filter((cat) => cat.faqs.length > 0)
    : CATEGORIES;

  return (
    <div style={{ minHeight: "100vh" }}>
      <Navbar />

      {/* Hero */}
      <section
        style={{
          background: `linear-gradient(135deg, ${COLORS.navy} 0%, ${COLORS.navyDark} 100%)`,
          padding: "80px 0 60px",
          textAlign: "center",
        }}
      >
        <div style={container}>
          <h1
            style={{
              fontSize: 44,
              fontWeight: 800,
              color: COLORS.white,
              margin: "0 0 16px",
              lineHeight: 1.15,
            }}
          >
            Help Center
          </h1>
          <p
            style={{
              fontSize: 20,
              color: COLORS.gray300,
              margin: "0 auto 36px",
              maxWidth: 520,
              lineHeight: 1.6,
            }}
          >
            Find answers to common questions about the TruckConnect platform.
          </p>

          {/* Search Bar */}
          <div
            style={{
              maxWidth: 560,
              margin: "0 auto",
              position: "relative",
            }}
          >
            <Search
              size={20}
              color={COLORS.gray400}
              style={{ position: "absolute", left: 18, top: "50%", transform: "translateY(-50%)" }}
            />
            <input
              type="text"
              placeholder="Search for answers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "16px 20px 16px 50px",
                fontSize: 16,
                border: "none",
                borderRadius: 12,
                backgroundColor: COLORS.white,
                color: COLORS.navy,
                outline: "none",
                boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
              }}
            />
          </div>
        </div>
      </section>

      {/* Category Cards Overview */}
      <section style={{ padding: "60px 0 20px" }}>
        <div style={container}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
              gap: 16,
              maxWidth: 900,
              margin: "0 auto",
            }}
          >
            {CATEGORIES.map((cat) => (
              <a
                key={cat.title}
                href={`#${cat.title.toLowerCase().replace(/\s+/g, "-")}`}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 10,
                  padding: "24px 16px",
                  borderRadius: 12,
                  border: `1px solid ${COLORS.gray200}`,
                  backgroundColor: COLORS.white,
                  textDecoration: "none",
                  transition: "box-shadow 0.2s, transform 0.2s",
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    backgroundColor: `${cat.color}14`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: cat.color,
                  }}
                >
                  {cat.icon}
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.navy, textAlign: "center" }}>
                  {cat.title}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Sections */}
      <section style={{ padding: "40px 0 80px" }}>
        <div style={{ ...container, maxWidth: 800 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            {filtered.length > 0 ? (
              filtered.map((cat) => (
                <div key={cat.title} id={cat.title.toLowerCase().replace(/\s+/g, "-")}>
                  <CategorySection category={cat} />
                </div>
              ))
            ) : (
              <div style={{ textAlign: "center", padding: "60px 0" }}>
                <p style={{ fontSize: 18, color: COLORS.gray500, margin: "0 0 8px" }}>
                  No results found for &ldquo;{search}&rdquo;
                </p>
                <p style={{ fontSize: 14, color: COLORS.gray400, margin: 0 }}>
                  Try a different search term or browse the categories below.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Still Need Help CTA */}
      <section style={{ padding: "80px 0", backgroundColor: COLORS.gray50 }}>
        <div style={{ ...container, maxWidth: 600, textAlign: "center" }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, color: COLORS.navy, margin: "0 0 16px" }}>
            Still need help?
          </h2>
          <p style={{ fontSize: 16, color: COLORS.gray500, lineHeight: 1.6, margin: "0 0 36px" }}>
            Our support team is available Monday to Saturday, 8 AM to 8 PM (PHT). We typically respond within 2 hours.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "center" }}>
            <a
              href="mailto:support@truckconnect.ph"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "14px 28px",
                backgroundColor: COLORS.blue,
                color: COLORS.white,
                border: "none",
                borderRadius: 8,
                fontSize: 16,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              <Mail size={18} /> support@truckconnect.ph
            </a>
            <a
              href="tel:+6328123-4567"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "14px 28px",
                backgroundColor: "transparent",
                color: COLORS.blue,
                border: `2px solid ${COLORS.blue}`,
                borderRadius: 8,
                fontSize: 16,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              <Phone size={18} /> +63 2 8123 4567
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
