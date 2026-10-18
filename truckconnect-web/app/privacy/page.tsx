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
  { id: "data-collect", label: "1. Data We Collect" },
  { id: "data-use", label: "2. How We Use Data" },
  { id: "data-sharing", label: "3. Data Sharing" },
  { id: "data-retention", label: "4. Data Retention" },
  { id: "your-rights", label: "5. Your Rights" },
  { id: "cookies", label: "6. Cookies" },
  { id: "security", label: "7. Security Measures" },
  { id: "children", label: "8. Children's Privacy" },
  { id: "international", label: "9. International Transfers" },
  { id: "changes", label: "10. Changes to Policy" },
  { id: "contact-dpo", label: "11. Contact DPO" },
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

const listStyle: CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: 15,
  lineHeight: 1.85,
  color: COLORS.gray700,
  margin: "0 0 16px",
  paddingLeft: 24,
};

export default function PrivacyPage() {
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
            Privacy Policy
          </h1>
          <p style={{ fontSize: 16, color: COLORS.gray400, margin: 0 }}>
            Last updated: March 1, 2026
          </p>
        </div>
      </section>

      {/* Body */}
      <section style={{ padding: "64px 0 80px", backgroundColor: COLORS.white }}>
        <div style={container}>
          {/* NPC Notice */}
          <div
            style={{
              backgroundColor: "#eff6ff",
              border: "1px solid #bfdbfe",
              borderRadius: 8,
              padding: "20px 24px",
              marginBottom: 32,
            }}
          >
            <p
              style={{
                ...paragraphStyle,
                margin: 0,
                fontSize: 14,
                color: COLORS.blue,
                fontWeight: 600,
              }}
            >
              NPC Registration: TruckConnect Philippines, Inc. is registered with the National
              Privacy Commission (NPC) as a personal information controller in accordance with
              Republic Act No. 10173, the Data Privacy Act of 2012.
            </p>
          </div>

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
            TruckConnect Philippines, Inc. (&quot;TruckConnect,&quot; &quot;we,&quot; &quot;us,&quot;
            or &quot;our&quot;) is committed to protecting the privacy and personal data of all
            users of our platform. This Privacy Policy describes how we collect, use, store, share,
            and protect your personal information in compliance with Republic Act No. 10173, the
            Data Privacy Act of 2012 (&quot;DPA&quot;), and its Implementing Rules and Regulations
            (&quot;IRR&quot;).
          </p>

          {/* Section 1 */}
          <h2 id="data-collect" style={headingStyle}>
            1. Data We Collect
          </h2>
          <p style={paragraphStyle}>
            We collect the following categories of personal information when you register for and use
            our Platform:
          </p>
          <ul style={listStyle}>
            <li style={{ marginBottom: 8 }}>
              <strong>Identity Data:</strong> Full name, date of birth, government-issued
              identification numbers (TIN, SSS, driver&apos;s license number), company name, and
              registration details.
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>Contact Data:</strong> Email address, phone number, physical address, and
              emergency contact information.
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>Financial Data:</strong> Bank account details, billing address, payment card
              information (processed by our third-party payment provider), and transaction history.
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>Vehicle &amp; Fleet Data:</strong> Vehicle registration numbers, plate numbers,
              vehicle specifications, insurance details, and LTFRB franchise information (for
              carriers).
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>Location Data:</strong> Real-time GPS location during active shipments, pickup
              and delivery coordinates, and warehouse locations.
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>Usage Data:</strong> Log data, IP addresses, browser type, device information,
              pages visited, features used, and timestamps.
            </li>
            <li>
              <strong>Communication Data:</strong> Messages exchanged through the Platform, support
              tickets, and feedback submissions.
            </li>
          </ul>

          {/* Section 2 */}
          <h2 id="data-use" style={headingStyle}>
            2. How We Use Data
          </h2>
          <p style={paragraphStyle}>
            We process your personal data based on the following lawful criteria under the DPA and
            for the following purposes:
          </p>
          <ul style={listStyle}>
            <li style={{ marginBottom: 8 }}>
              <strong>Contract Performance:</strong> To provide and maintain our Platform services,
              process bookings, facilitate transactions between shippers, carriers, and warehouse
              operators, and manage your account.
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>Legitimate Interest:</strong> To improve our Platform, develop new features,
              conduct analytics, prevent fraud, and ensure platform security and integrity.
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>Legal Compliance:</strong> To comply with applicable Philippine laws and
              regulations, including tax reporting obligations, transportation regulations, and
              responses to lawful government requests.
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>Consent:</strong> To send marketing communications, promotional offers, and
              newsletters (you may withdraw consent at any time).
            </li>
            <li>
              <strong>Safety &amp; Security:</strong> To verify identities, detect and prevent
              fraudulent activities, and ensure the safety of all Platform users.
            </li>
          </ul>

          {/* Section 3 */}
          <h2 id="data-sharing" style={headingStyle}>
            3. Data Sharing
          </h2>
          <p style={paragraphStyle}>
            We may share your personal data with the following categories of recipients, only to the
            extent necessary to provide our services:
          </p>
          <ul style={listStyle}>
            <li style={{ marginBottom: 8 }}>
              <strong>Other Platform Users:</strong> Shippers, carriers, and warehouse operators
              involved in your transactions may receive relevant information necessary to complete
              bookings and deliveries.
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>Service Providers:</strong> Third-party providers who assist with payment
              processing, cloud hosting, analytics, customer support, and communication services,
              bound by data processing agreements.
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>Government Authorities:</strong> Philippine regulatory bodies, law enforcement,
              or other government agencies when required by law or valid legal process.
            </li>
            <li>
              <strong>Business Transfers:</strong> In connection with any merger, acquisition, or
              sale of assets, your data may be transferred to the acquiring entity, subject to the
              same privacy protections.
            </li>
          </ul>
          <p style={paragraphStyle}>
            We do not sell your personal data to third parties for their own marketing purposes.
          </p>

          {/* Section 4 */}
          <h2 id="data-retention" style={headingStyle}>
            4. Data Retention
          </h2>
          <p style={paragraphStyle}>
            We retain your personal data only for as long as necessary to fulfill the purposes for
            which it was collected, comply with legal obligations, resolve disputes, and enforce our
            agreements. Specific retention periods include:
          </p>
          <ul style={listStyle}>
            <li style={{ marginBottom: 8 }}>
              <strong>Account Data:</strong> Retained for the duration of your account and up to five
              (5) years after account closure for legal compliance purposes.
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>Transaction Records:</strong> Retained for ten (10) years as required by
              Philippine tax and commercial laws (BIR regulations).
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>Location Data:</strong> Active shipment location data is retained for ninety
              (90) days after delivery completion.
            </li>
            <li>
              <strong>Usage Logs:</strong> Retained for twelve (12) months for security and
              analytics purposes.
            </li>
          </ul>

          {/* Section 5 */}
          <h2 id="your-rights" style={headingStyle}>
            5. Your Rights
          </h2>
          <p style={paragraphStyle}>
            Under the Data Privacy Act of 2012 (RA 10173), you have the following rights as a data
            subject:
          </p>
          <ul style={listStyle}>
            <li style={{ marginBottom: 8 }}>
              <strong>Right to Be Informed:</strong> You have the right to be informed of the
              collection and processing of your personal data, including the purpose and extent of
              processing.
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>Right to Access:</strong> You may request access to your personal data held by
              TruckConnect, including information on how it has been used or shared.
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>Right to Object:</strong> You may object to the processing of your personal
              data, including processing for direct marketing purposes.
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>Right to Erasure or Blocking:</strong> You may request the removal or blocking
              of your personal data when it is incomplete, outdated, false, unlawfully obtained, or
              no longer necessary for the stated purpose.
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>Right to Rectification:</strong> You may request correction of inaccurate or
              incomplete personal data.
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>Right to Data Portability:</strong> You may request a copy of your personal
              data in a structured, commonly used, and machine-readable format.
            </li>
            <li>
              <strong>Right to File a Complaint:</strong> You may file a complaint with the National
              Privacy Commission (NPC) if you believe your data privacy rights have been violated.
            </li>
          </ul>
          <p style={paragraphStyle}>
            To exercise any of these rights, please contact our Data Protection Officer using the
            contact information in Section 11.
          </p>

          {/* Section 6 */}
          <h2 id="cookies" style={headingStyle}>
            6. Cookies
          </h2>
          <p style={paragraphStyle}>
            Our Platform uses cookies and similar tracking technologies to enhance your experience,
            analyze usage patterns, and deliver personalized content. The types of cookies we use
            include:
          </p>
          <ul style={listStyle}>
            <li style={{ marginBottom: 8 }}>
              <strong>Essential Cookies:</strong> Required for the Platform to function properly,
              including authentication, session management, and security features. These cannot be
              disabled.
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>Analytics Cookies:</strong> Help us understand how users interact with the
              Platform, which pages are visited most often, and how features are used.
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>Functional Cookies:</strong> Remember your preferences, language settings, and
              customization choices to provide a more personalized experience.
            </li>
            <li>
              <strong>Marketing Cookies:</strong> Used to deliver relevant advertisements and
              measure the effectiveness of our marketing campaigns. These are only set with your
              consent.
            </li>
          </ul>
          <p style={paragraphStyle}>
            You can manage your cookie preferences through your browser settings or our cookie
            consent banner. Disabling certain cookies may affect Platform functionality.
          </p>

          {/* Section 7 */}
          <h2 id="security" style={headingStyle}>
            7. Security Measures
          </h2>
          <p style={paragraphStyle}>
            We implement appropriate technical and organizational measures to protect your personal
            data against unauthorized access, alteration, disclosure, or destruction, in compliance
            with NPC Circular No. 2016-01 (Security of Personal Data in Government Agencies) and
            industry best practices:
          </p>
          <ul style={listStyle}>
            <li style={{ marginBottom: 8 }}>AES-256 encryption for data at rest</li>
            <li style={{ marginBottom: 8 }}>TLS 1.3 encryption for data in transit</li>
            <li style={{ marginBottom: 8 }}>
              Multi-factor authentication (MFA) for all user accounts
            </li>
            <li style={{ marginBottom: 8 }}>
              Regular security audits and vulnerability assessments
            </li>
            <li style={{ marginBottom: 8 }}>
              Role-based access controls with principle of least privilege
            </li>
            <li style={{ marginBottom: 8 }}>
              Automated intrusion detection and prevention systems
            </li>
            <li>
              Data breach incident response plan with NPC notification within seventy-two (72) hours
              as required by NPC Circular No. 2016-03
            </li>
          </ul>

          {/* Section 8 */}
          <h2 id="children" style={headingStyle}>
            8. Children&apos;s Privacy
          </h2>
          <p style={paragraphStyle}>
            The TruckConnect Platform is not intended for use by individuals under the age of
            eighteen (18). We do not knowingly collect personal information from children. If we
            become aware that we have collected personal data from a child without verified parental
            consent, we will take steps to delete such information from our systems promptly.
          </p>
          <p style={paragraphStyle}>
            If you are a parent or guardian and believe that your child has provided personal
            information to us, please contact our Data Protection Officer immediately.
          </p>

          {/* Section 9 */}
          <h2 id="international" style={headingStyle}>
            9. International Transfers
          </h2>
          <p style={paragraphStyle}>
            Your personal data is primarily stored and processed within the Philippines. In cases
            where data must be transferred outside the Philippines (for example, to cloud
            infrastructure providers with servers in other jurisdictions), we ensure that adequate
            safeguards are in place, including:
          </p>
          <ul style={listStyle}>
            <li style={{ marginBottom: 8 }}>
              Standard contractual clauses approved by the NPC
            </li>
            <li style={{ marginBottom: 8 }}>
              Verification that the receiving country provides an adequate level of data protection
            </li>
            <li>
              Binding corporate rules or equivalent agreements that ensure compliance with the DPA
            </li>
          </ul>

          {/* Section 10 */}
          <h2 id="changes" style={headingStyle}>
            10. Changes to Policy
          </h2>
          <p style={paragraphStyle}>
            We may update this Privacy Policy from time to time to reflect changes in our practices,
            technology, legal requirements, or other factors. When we make material changes, we will
            notify you via email and/or a prominent notice on the Platform at least thirty (30) days
            before the changes take effect.
          </p>
          <p style={paragraphStyle}>
            The &quot;Last updated&quot; date at the top of this Privacy Policy indicates when the
            latest revisions were made. Your continued use of the Platform after the effective date
            of any changes constitutes your acceptance of the updated Privacy Policy.
          </p>

          {/* Section 11 */}
          <h2 id="contact-dpo" style={headingStyle}>
            11. Contact DPO
          </h2>
          <p style={paragraphStyle}>
            If you have any questions, concerns, or requests regarding this Privacy Policy or the
            processing of your personal data, please contact our Data Protection Officer:
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
              Data Protection Officer
            </p>
            <p style={{ ...paragraphStyle, margin: "0 0 4px" }}>
              TruckConnect Philippines, Inc.
            </p>
            <p style={{ ...paragraphStyle, margin: "0 0 4px" }}>
              Email: dpo@truckconnect.ph
            </p>
            <p style={{ ...paragraphStyle, margin: "0 0 4px" }}>
              Phone: +63 (2) 8888-TRUCK (87825)
            </p>
            <p style={{ ...paragraphStyle, margin: "0 0 16px" }}>
              Address: 12F Pacific Star Building, Makati Avenue corner Gil Puyat Avenue, Makati City
              1226, Metro Manila, Philippines
            </p>
            <p style={{ ...paragraphStyle, margin: 0, fontSize: 13, color: COLORS.gray500 }}>
              You may also file a complaint directly with the National Privacy Commission (NPC) at{" "}
              <a href="https://www.privacy.gov.ph" style={{ color: COLORS.blue }}>
                www.privacy.gov.ph
              </a>{" "}
              or at their office at 5th Floor, Delegation Building, Philippine International
              Convention Center (PICC) Complex, Pasay City.
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
