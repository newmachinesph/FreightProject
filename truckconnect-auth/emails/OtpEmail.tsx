import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface Props {
  name?: string;
  code: string;
  expiresInMinutes?: number;
  purpose?: "verify" | "sign-in";
}

export default function OtpEmail({
  name,
  code,
  expiresInMinutes = 10,
  purpose = "verify",
}: Props) {
  const greeting = name ? `Hi ${name},` : "Hi there,";
  const purposeText =
    purpose === "sign-in"
      ? "sign in to your TruckConnect account"
      : "verify your TruckConnect account";

  return (
    <Html>
      <Head />
      <Preview>Your TruckConnect verification code: {code}</Preview>
      <Body style={body}>
        <Container style={container}>

          {/* Header */}
          <Section style={header}>
            <table width="100%" cellPadding={0} cellSpacing={0}>
              <tr>
                <td>
                  <div style={logo}>
                    <span style={{ color: "#fff", fontSize: 18, fontWeight: 700 }}>→</span>
                  </div>
                </td>
                <td style={{ textAlign: "right" }}>
                  <Text style={logoText}>TruckConnect Philippines</Text>
                </td>
              </tr>
            </table>
          </Section>

          {/* Body */}
          <Section style={content}>
            <Heading style={h1}>Your verification code</Heading>
            <Text style={paragraph}>{greeting}</Text>
            <Text style={paragraph}>
              Use the code below to {purposeText}:
            </Text>

            {/* OTP code block */}
            <Section style={{ textAlign: "center", margin: "28px 0" }}>
              <div style={otpBlock}>
                {code.split("").map((digit, i) => (
                  <span key={i} style={otpDigit}>{digit}</span>
                ))}
              </div>
            </Section>

            <Section style={noticeBox}>
              <Text style={noticeText}>
                ⏱ This code expires in <strong>{String(expiresInMinutes)} minutes</strong>.
                Never share this code with anyone.
              </Text>
            </Section>

            <Hr style={hr} />

            <Text style={footer}>
              If you didn&apos;t request this code, you can safely ignore this email.
              Someone may have entered your email address by mistake.
            </Text>
            <Text style={footer}>
              © {new Date().getFullYear()} TruckConnect Philippines · Freight Marketplace
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const body: React.CSSProperties = {
  backgroundColor: "#F0F4FC",
  fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  margin: 0,
  padding: "40px 0",
};

const container: React.CSSProperties = {
  maxWidth: 560,
  margin: "0 auto",
  borderRadius: 12,
  overflow: "hidden",
  boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
};

const header: React.CSSProperties = {
  backgroundColor: "#1B2D5E",
  padding: "20px 32px",
};

const logo: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 36,
  height: 36,
  backgroundColor: "#2563EB",
  borderRadius: 8,
};

const logoText: React.CSSProperties = {
  color: "rgba(255,255,255,0.7)",
  fontSize: 13,
  fontWeight: 600,
  margin: 0,
};

const content: React.CSSProperties = {
  backgroundColor: "#FFFFFF",
  padding: "32px 36px 28px",
};

const h1: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 700,
  color: "#0F172A",
  margin: "0 0 20px",
};

const paragraph: React.CSSProperties = {
  fontSize: 15,
  lineHeight: 1.6,
  color: "#334155",
  margin: "0 0 16px",
};

const otpBlock: React.CSSProperties = {
  display: "inline-flex",
  gap: 8,
  padding: "16px 24px",
  background: "#F8FAFC",
  borderRadius: 12,
  border: "1px solid #E2E8F0",
};

const otpDigit: React.CSSProperties = {
  display: "inline-block",
  width: 40,
  height: 52,
  lineHeight: "52px",
  textAlign: "center",
  fontSize: 28,
  fontWeight: 800,
  color: "#1B2D5E",
  background: "#fff",
  borderRadius: 8,
  border: "1.5px solid #CBD5E1",
  letterSpacing: 0,
};

const noticeBox: React.CSSProperties = {
  backgroundColor: "#FFF7ED",
  border: "1px solid #FED7AA",
  borderRadius: 8,
  padding: "12px 16px",
  margin: "0 0 20px",
};

const noticeText: React.CSSProperties = {
  fontSize: 13,
  color: "#92400E",
  margin: 0,
  lineHeight: 1.5,
};

const hr: React.CSSProperties = {
  borderColor: "#E2E8F0",
  margin: "24px 0 20px",
};

const footer: React.CSSProperties = {
  fontSize: 12,
  color: "#94A3B8",
  lineHeight: 1.6,
  margin: "0 0 6px",
};
