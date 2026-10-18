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
  email: string;
  dashboardUrl: string;
}

const STEPS = [
  {
    num: "1",
    title: "Complete your profile",
    desc: "Add your company details and upload verification documents.",
  },
  {
    num: "2",
    title: "Post your first load",
    desc: "Get instant carrier matches and transparent pricing — no broker markup.",
  },
  {
    num: "3",
    title: "Track in real time",
    desc: "GPS tracking, ePOD, and GCash payout — all in one place.",
  },
];

export default function WelcomeEmail({ name, email, dashboardUrl }: Props) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to TruckConnect, {name}! Your freight marketplace account is ready.</Preview>
      <Body style={body}>
        <Container style={container}>

          {/* Header */}
          <Section style={header}>
            <Heading style={headerTitle}>Welcome to TruckConnect 🇵🇭</Heading>
            <Text style={headerSub}>
              The AI-native freight marketplace for the Philippines
            </Text>
          </Section>

          {/* Body */}
          <Section style={content}>
            <Text style={paragraph}>Hi {name},</Text>
            <Text style={paragraph}>
              Your TruckConnect account is ready. You can now post loads, compare
              carrier rates, and track shipments across Luzon, Visayas, and
              Mindanao — all from one dashboard.
            </Text>

            <Section style={{ textAlign: "center", margin: "28px 0" }}>
              <Button href={dashboardUrl} style={button}>
                Go to Dashboard
              </Button>
            </Section>

            <Hr style={hr} />

            {/* Steps */}
            <Text style={{ ...paragraph, fontWeight: 700, color: "#0F172A", marginBottom: 16 }}>
              Get started in 3 steps
            </Text>

            {STEPS.map(step => (
              <table key={step.num} width="100%" cellPadding={0} cellSpacing={0} style={{ marginBottom: 14 }}>
                <tr>
                  <td style={{ verticalAlign: "top", width: 36 }}>
                    <div style={stepNum}>{step.num}</div>
                  </td>
                  <td style={{ verticalAlign: "top", paddingLeft: 12 }}>
                    <Text style={stepTitle}>{step.title}</Text>
                    <Text style={stepDesc}>{step.desc}</Text>
                  </td>
                </tr>
              </table>
            ))}

            <Hr style={hr} />

            <Text style={footer}>
              Signed up with: <strong>{email}</strong>
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
  background: "linear-gradient(135deg, #1B2D5E 0%, #142248 100%)",
  padding: "36px 36px 28px",
  textAlign: "center",
};

const headerTitle: React.CSSProperties = {
  fontSize: 26,
  fontWeight: 800,
  color: "#FFFFFF",
  margin: "0 0 8px",
  lineHeight: 1.2,
};

const headerSub: React.CSSProperties = {
  fontSize: 14,
  color: "rgba(255,255,255,0.6)",
  margin: 0,
};

const content: React.CSSProperties = {
  backgroundColor: "#FFFFFF",
  padding: "32px 36px 28px",
};

const paragraph: React.CSSProperties = {
  fontSize: 15,
  lineHeight: 1.6,
  color: "#334155",
  margin: "0 0 16px",
};

const button: React.CSSProperties = {
  backgroundColor: "#2563EB",
  color: "#FFFFFF",
  borderRadius: 8,
  fontSize: 15,
  fontWeight: 700,
  padding: "13px 32px",
  textDecoration: "none",
  display: "inline-block",
};

const hr: React.CSSProperties = {
  borderColor: "#E2E8F0",
  margin: "24px 0",
};

const stepNum: React.CSSProperties = {
  width: 28,
  height: 28,
  borderRadius: "50%",
  backgroundColor: "#1B2D5E",
  color: "#fff",
  fontSize: 13,
  fontWeight: 700,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  lineHeight: "28px",
};

const stepTitle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 700,
  color: "#0F172A",
  margin: "0 0 2px",
};

const stepDesc: React.CSSProperties = {
  fontSize: 13,
  color: "#64748B",
  margin: 0,
  lineHeight: 1.5,
};

const footer: React.CSSProperties = {
  fontSize: 12,
  color: "#94A3B8",
  lineHeight: 1.6,
  margin: "0 0 6px",
};
