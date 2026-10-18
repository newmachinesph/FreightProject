"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { CSSProperties } from "react";

const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL ?? "http://localhost:3001";

const COLORS = {
  navy: "#1B2D5E",
  blue: "#2563EB",
  white: "#ffffff",
  gray50: "#f8fafc",
  gray100: "#f1f5f9",
  gray200: "#e2e8f0",
  gray400: "#94a3b8",
  gray500: "#64748b",
  gray600: "#475569",
  gray700: "#334155",
  gray800: "#1e293b",
};

const container: CSSProperties = { maxWidth: 860, margin: "0 auto", padding: "0 24px" };

const TOC = [
  { id: "acceptance", label: "1. Acceptance of Terms" },
  { id: "platform", label: "2. Platform Description" },
  { id: "accounts", label: "3. User Accounts" },
  { id: "shipper", label: "4. Shipper Terms" },
  { id: "carrier", label: "5. Carrier Terms" },
  { id: "warehouse", label: "6. Warehouse Terms" },
  { id: "marketplace", label: "7. Marketplace Rules" },
  { id: "payment", label: "8. Payment Terms" },
  { id: "liability", label: "9. Liability Limitations" },
  { id: "disputes", label: "10. Dispute Resolution" },
  { id: "privacy", label: "11. Data Privacy" },
  { id: "ip", label: "12. Intellectual Property" },
  { id: "termination", label: "13. Termination" },
  { id: "governing-law", label: "14. Governing Law" },
  { id: "contact", label: "15. Contact" },
];

const headingStyle: CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: 22,
  fontWeight: 700,
  color: COLORS.navy,
  margin: "48px 0 16px",
  paddingTop: 16,
};

const paragraphStyle: CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: 15,
  lineHeight: 1.85,
  color: COLORS.gray700,
  margin: "0 0 16px",
};

export default function TermsPage() {
  return (
    <>
      <Navbar authUrl={AUTH_URL} />

      {/* Hero */}
      <section
        style={{
          background: `linear-gradient(135deg, ${COLORS.navy} 0%, #1e3a8a 100%)`,
          padding: "100px 0 60px",
          textAlign: "center",
        }}
      >
        <div style={container}>
          <h1
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: 40,
              fontWeight: 700,
              color: COLORS.white,
              margin: "0 0 12px",
            }}
          >
            Terms of Service
          </h1>
          <p style={{ fontSize: 16, color: COLORS.gray400, margin: 0 }}>
            Last updated: March 1, 2026
          </p>
        </div>
      </section>

      {/* Body */}
      <section style={{ padding: "64px 0 80px", backgroundColor: COLORS.white }}>
        <div style={container}>
          {/* Table of Contents */}
          <div
            style={{
              backgroundColor: COLORS.gray50,
              border: `1px solid ${COLORS.gray200}`,
              borderRadius: 8,
              padding: "28px 32px",
              marginBottom: 48,
            }}
          >
            <h2
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: 18,
                fontWeight: 700,
                color: COLORS.navy,
                margin: "0 0 16px",
              }}
            >
              Table of Contents
            </h2>
            <ol style={{ margin: 0, paddingLeft: 20, columns: 2, columnGap: 32 }}>
              {TOC.map((item) => (
                <li key={item.id} style={{ marginBottom: 8 }}>
                  <a
                    href={`#${item.id}`}
                    style={{
                      color: COLORS.blue,
                      textDecoration: "none",
                      fontSize: 14,
                      fontFamily: "Georgia, 'Times New Roman', serif",
                    }}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ol>
          </div>

          {/* Preamble */}
          <p style={paragraphStyle}>
            These Terms of Service (&quot;Terms&quot;) constitute a legally binding agreement between
            you (&quot;User,&quot; &quot;you,&quot; or &quot;your&quot;) and TruckConnect
            Philippines, Inc. (&quot;TruckConnect,&quot; &quot;we,&quot; &quot;us,&quot; or
            &quot;our&quot;), governing your access to and use of the TruckConnect platform,
            including all associated websites, mobile applications, APIs, and services
            (collectively, the &quot;Platform&quot;).
          </p>

          {/* Section 1 */}
          <h2 id="acceptance" style={headingStyle}>
            1. Acceptance of Terms
          </h2>
          <p style={paragraphStyle}>
            By accessing or using the Platform, you acknowledge that you have read, understood, and
            agree to be bound by these Terms, as well as our Privacy Policy. If you are using the
            Platform on behalf of an organization, you represent and warrant that you have the
            authority to bind that organization to these Terms.
          </p>
          <p style={paragraphStyle}>
            If you do not agree to these Terms, you must immediately cease all use of the Platform.
            We reserve the right to modify these Terms at any time. Continued use of the Platform
            following any modifications constitutes your acceptance of the revised Terms. We will
            provide notice of material changes via email or an in-platform notification at least
            thirty (30) days before the changes take effect.
          </p>

          {/* Section 2 */}
          <h2 id="platform" style={headingStyle}>
            2. Platform Description
          </h2>
          <p style={paragraphStyle}>
            TruckConnect is a digital freight platform that connects shippers, carriers, and
            warehouse operators within the Philippines. The Platform provides tools for freight
            booking, shipment tracking, warehouse management, load matching through our marketplace,
            and related logistics services.
          </p>
          <p style={paragraphStyle}>
            TruckConnect acts as a technology intermediary and does not itself provide transportation,
            warehousing, or freight brokerage services. All transportation and warehousing services
            are provided by independent third-party carriers and warehouse operators registered on
            the Platform.
          </p>

          {/* Section 3 */}
          <h2 id="accounts" style={headingStyle}>
            3. User Accounts
          </h2>
          <p style={paragraphStyle}>
            To use certain features of the Platform, you must register for an account. You agree to
            provide accurate, current, and complete information during registration and to keep your
            account information updated. You are responsible for maintaining the confidentiality of
            your login credentials and for all activities that occur under your account.
          </p>
          <p style={paragraphStyle}>
            You must immediately notify TruckConnect of any unauthorized use of your account or any
            other security breach. TruckConnect will not be liable for any loss or damage arising
            from your failure to maintain the security of your account credentials. Accounts are
            non-transferable and may not be shared among multiple individuals without our written
            consent.
          </p>

          {/* Section 4 */}
          <h2 id="shipper" style={headingStyle}>
            4. Shipper Terms
          </h2>
          <p style={paragraphStyle}>
            Shippers using the Platform agree to provide accurate and complete information regarding
            shipments, including but not limited to cargo descriptions, weight, dimensions, origin,
            destination, and any special handling requirements. Shippers are responsible for ensuring
            that all cargo complies with applicable Philippine laws and regulations, including but
            not limited to restrictions on hazardous materials.
          </p>
          <p style={paragraphStyle}>
            Shippers shall ensure that cargo is properly packaged and ready for pickup at the
            designated time and location. Failure to do so may result in additional charges or
            cancellation fees as determined by the carrier. Shippers are responsible for obtaining
            any required permits, licenses, or documentation necessary for the transportation of
            their goods.
          </p>

          {/* Section 5 */}
          <h2 id="carrier" style={headingStyle}>
            5. Carrier Terms
          </h2>
          <p style={paragraphStyle}>
            Carriers registered on the Platform must maintain all licenses, permits, and insurance
            required under Philippine law, including those mandated by the Land Transportation
            Franchising and Regulatory Board (LTFRB) and the Department of Transportation (DOTr).
            Carriers must keep their vehicle and driver information accurate and current on the
            Platform.
          </p>
          <p style={paragraphStyle}>
            Carriers agree to fulfill accepted bookings in accordance with the agreed-upon terms,
            including pickup and delivery schedules. Carriers shall handle all cargo with due care
            and in compliance with applicable safety regulations. Carriers are responsible for
            providing real-time tracking updates through the Platform during transit.
          </p>

          {/* Section 6 */}
          <h2 id="warehouse" style={headingStyle}>
            6. Warehouse Terms
          </h2>
          <p style={paragraphStyle}>
            Warehouse operators listing available space on the Platform must provide accurate
            descriptions of their facilities, including storage capacity, available amenities (such
            as cold storage or hazardous material handling), operating hours, and pricing. Warehouse
            operators must maintain all required permits and licenses under Philippine law.
          </p>
          <p style={paragraphStyle}>
            Warehouse operators are responsible for the safekeeping of goods stored in their
            facilities and must maintain adequate insurance coverage. Any damage to or loss of stored
            goods due to the warehouse operator&apos;s negligence shall be the responsibility of the
            warehouse operator.
          </p>

          {/* Section 7 */}
          <h2 id="marketplace" style={headingStyle}>
            7. Marketplace Rules
          </h2>
          <p style={paragraphStyle}>
            The TruckConnect Marketplace enables shippers to post loads and carriers to bid on
            available freight. All marketplace listings must be genuine, accurate, and made in good
            faith. Users may not post fraudulent, misleading, or duplicate listings.
          </p>
          <p style={paragraphStyle}>
            TruckConnect reserves the right to remove any listing that violates these Terms or
            applicable laws. Users engaged in bid manipulation, price fixing, or any other
            anti-competitive behavior will be subject to immediate account suspension and may be
            reported to the Philippine Competition Commission (PCC). Commission fees apply to
            completed marketplace transactions as set forth in our published fee schedule.
          </p>

          {/* Section 8 */}
          <h2 id="payment" style={headingStyle}>
            8. Payment Terms
          </h2>
          <p style={paragraphStyle}>
            All payments processed through the Platform are subject to our published fee schedule.
            TruckConnect may charge service fees, transaction fees, or subscription fees as
            applicable. All fees are denominated in Philippine Pesos (PHP) unless otherwise
            specified.
          </p>
          <p style={paragraphStyle}>
            Payment processing is handled by authorized third-party payment providers. TruckConnect
            does not store full credit card or bank account numbers on its servers. Invoices are
            generated automatically and are subject to applicable Philippine taxes, including
            Value-Added Tax (VAT). Users are responsible for paying all applicable taxes associated
            with their use of the Platform. Payment terms are net fifteen (15) days from the date of
            invoice unless otherwise agreed in writing.
          </p>

          {/* Section 9 */}
          <h2 id="liability" style={headingStyle}>
            9. Liability Limitations
          </h2>
          <p style={paragraphStyle}>
            To the maximum extent permitted by Philippine law, TruckConnect shall not be liable for
            any indirect, incidental, special, consequential, or punitive damages, or any loss of
            profits, revenue, data, or business opportunities arising out of or related to your use
            of the Platform.
          </p>
          <p style={paragraphStyle}>
            TruckConnect&apos;s total aggregate liability for any claims arising from or related to
            these Terms or your use of the Platform shall not exceed the total fees paid by you to
            TruckConnect during the twelve (12) months preceding the claim. The Platform is provided
            &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, whether
            express or implied.
          </p>

          {/* Section 10 */}
          <h2 id="disputes" style={headingStyle}>
            10. Dispute Resolution
          </h2>
          <p style={paragraphStyle}>
            Any dispute arising out of or in connection with these Terms shall first be resolved
            through good-faith negotiation between the parties. If the dispute is not resolved within
            thirty (30) days of written notice, either party may submit the dispute to mediation
            administered by the Philippine Dispute Resolution Center, Inc. (PDRCI).
          </p>
          <p style={paragraphStyle}>
            If mediation fails, the dispute shall be finally resolved by arbitration under the rules
            of the PDRCI, with the seat of arbitration in Makati City, Metro Manila. The arbitration
            shall be conducted in English. The arbitrator&apos;s decision shall be final and binding
            on both parties and may be enforced in any court of competent jurisdiction.
          </p>

          {/* Section 11 */}
          <h2 id="privacy" style={headingStyle}>
            11. Data Privacy
          </h2>
          <p style={paragraphStyle}>
            Your use of the Platform is also governed by our Privacy Policy, which describes how we
            collect, use, store, and protect your personal information in compliance with Republic
            Act No. 10173, also known as the Data Privacy Act of 2012, and its implementing rules
            and regulations.
          </p>
          <p style={paragraphStyle}>
            By using the Platform, you consent to the collection and processing of your personal
            data as described in our Privacy Policy. You may exercise your data subject rights,
            including the right to access, correct, or delete your personal information, by
            contacting our Data Protection Officer at dpo@truckconnect.ph.
          </p>

          {/* Section 12 */}
          <h2 id="ip" style={headingStyle}>
            12. Intellectual Property
          </h2>
          <p style={paragraphStyle}>
            All content, features, functionality, and technology on the Platform, including but not
            limited to text, graphics, logos, icons, images, software, and the compilation thereof,
            are the exclusive property of TruckConnect Philippines, Inc. or its licensors and are
            protected by Philippine intellectual property laws, including Republic Act No. 8293 (the
            Intellectual Property Code of the Philippines).
          </p>
          <p style={paragraphStyle}>
            You are granted a limited, non-exclusive, non-transferable, revocable license to access
            and use the Platform for its intended purpose. You may not reproduce, distribute, modify,
            create derivative works of, publicly display, or otherwise exploit any content from the
            Platform without our prior written consent.
          </p>

          {/* Section 13 */}
          <h2 id="termination" style={headingStyle}>
            13. Termination
          </h2>
          <p style={paragraphStyle}>
            TruckConnect may suspend or terminate your access to the Platform at any time, with or
            without cause, and with or without notice. Grounds for termination include, but are not
            limited to, violation of these Terms, fraudulent activity, failure to pay outstanding
            fees, or conduct that TruckConnect determines is harmful to other users or the Platform.
          </p>
          <p style={paragraphStyle}>
            Upon termination, your right to use the Platform ceases immediately. Sections of these
            Terms that by their nature should survive termination shall remain in effect, including
            but not limited to liability limitations, dispute resolution, intellectual property
            rights, and governing law provisions.
          </p>

          {/* Section 14 */}
          <h2 id="governing-law" style={headingStyle}>
            14. Governing Law
          </h2>
          <p style={paragraphStyle}>
            These Terms shall be governed by and construed in accordance with the laws of the
            Republic of the Philippines, without regard to its conflict of law provisions. Any legal
            action or proceeding not subject to arbitration under Section 10 shall be brought
            exclusively in the courts of Makati City, Metro Manila, Philippines.
          </p>

          {/* Section 15 */}
          <h2 id="contact" style={headingStyle}>
            15. Contact
          </h2>
          <p style={paragraphStyle}>
            If you have any questions or concerns about these Terms, please contact us:
          </p>
          <div
            style={{
              backgroundColor: COLORS.gray50,
              border: `1px solid ${COLORS.gray200}`,
              borderRadius: 8,
              padding: "24px 28px",
              marginTop: 8,
            }}
          >
            <p style={{ ...paragraphStyle, margin: "0 0 6px", fontWeight: 600, color: COLORS.navy }}>
              TruckConnect Philippines, Inc.
            </p>
            <p style={{ ...paragraphStyle, margin: "0 0 4px" }}>
              Legal Department
            </p>
            <p style={{ ...paragraphStyle, margin: "0 0 4px" }}>
              Email: legal@truckconnect.ph
            </p>
            <p style={{ ...paragraphStyle, margin: "0 0 4px" }}>
              Phone: +63 (2) 8888-TRUCK (87825)
            </p>
            <p style={{ ...paragraphStyle, margin: 0 }}>
              Address: 12F Pacific Star Building, Makati Avenue corner Gil Puyat Avenue, Makati City 1226, Metro Manila, Philippines
            </p>
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        @media (max-width: 640px) {
          ol { columns: 1 !important; }
        }
      `}</style>
    </>
  );
}
