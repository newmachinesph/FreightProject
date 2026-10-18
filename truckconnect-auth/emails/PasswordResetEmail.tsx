import {
  Body,
  Button,
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
  name: string;
  resetUrl: string;
  expiresInMinutes?: number;
}

export default function PasswordResetEmail({
  name,
  resetUrl,
  expiresInMinutes = 60,
}: Props) {
  return (
    <Html>
      <Head />
      <Preview>Reset your TruckConnect password — link expires in {String(expiresInMinutes)} minutes</Preview>
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
            {/* Lock icon */}
            <Section style={{ textAlign: "center", margin: "0 0 24px" }}>
              <div style={lockIcon}>🔑</div>
            </Section>

            <Heading style={h1}>Reset your password</Heading>

            <Text style={paragraph}>Hi {name},</Text>
            <Text style={paragraph}>
              We received a request to reset the password for your TruckConnect
              account. Click the button below to choose a new password.
            </Text>

            <Section style={{ textAlign: "center", margin: "28px 0" }}>
              <Button href={resetUrl} style={button}>
                Reset Password
              </Button>
            </Section>

            {/* Expiry notice */}
            <Section style={noticeBox}>
              <Text style={noticeText}>
                ⏱ This link expires in <strong>{String(expiresInMinutes)} minutes</strong>.
                If it expires, you can request a new one from the sign-in page.
              </Text>
            </Section>

            <Text style={smallText}>
              Or copy and paste this URL into your browser:
            </Text>
            <Text style={linkText}>{resetUrl}</Text>

            <Hr style={hr} />

            <Text style={footer}>
              If you didn&apos;t request a password reset, you can safely ignore this
              email. Your password won&apos;t be changed until you click the link
              above and create a new one.
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

const lockIcon: React.CSSProperties = {
  fontSize: 36,
};

const h1: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 700,
  color: "#0F172A",
  margin: "0 0 20px",
  lineHeight: 1.3,
};

const paragraph: React.CSSProperties = {
  fontSize: 15,
  lineHeight: 1.6,
  color: "#334155",
  margin: "0 0 16px",
};

const button: React.CSSProperties = {
  backgroundColor: "#1B2D5E",
  color: "#FFFFFF",
  borderRadius: 8,
  fontSize: 15,
  fontWeight: 700,
  padding: "13px 32px",
  textDecoration: "none",
  display: "inline-block",
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

const smallText: React.CSSProperties = {
  fontSize: 12,
  color: "#94A3B8",
  margin: "0 0 4px",
};

const linkText: React.CSSProperties = {
  fontSize: 12,
  color: "#2563EB",
  wordBreak: "break-all",
  margin: "0 0 20px",
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
