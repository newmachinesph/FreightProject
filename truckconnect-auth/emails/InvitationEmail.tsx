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
  inviteeName?: string;
  inviterName: string;
  organizationName: string;
  role: string;
  inviteUrl: string;
  expiresInHours?: number;
}

const ROLE_LABELS: Record<string, string> = {
  super_admin:        "Super Admin",
  compliance_officer: "Compliance Officer",
  dispute_manager:    "Dispute Manager",
  support_agent:      "Support Agent",
  ai_supervisor:      "AI Dispatch Supervisor",
  data_quality:       "Data Quality Manager",
  enterprise_admin:   "Admin",
  booker:             "Booker",
  viewer:             "Viewer",
  shipper_admin:      "Shipper",
  forwarder_admin:    "Forwarder Admin",
  agent:              "Agent",
  carrier_owner:      "Fleet Owner",
  dispatcher:         "Dispatcher",
  driver:             "Driver",
};

export default function InvitationEmail({
  inviteeName,
  inviterName,
  organizationName,
  role,
  inviteUrl,
  expiresInHours = 48,
}: Props) {
  const roleLabel = ROLE_LABELS[role] ?? role;
  const greeting = inviteeName ? `Hi ${inviteeName},` : "Hi there,";

  return (
    <Html>
      <Head />
      <Preview>
        {inviterName} invited you to join {organizationName} on TruckConnect as {roleLabel}
      </Preview>
      <Body style={body}>
        <Container style={container}>

          {/* Header */}
          <Section style={header}>
            <table width="100%" cellPadding={0} cellSpacing={0}>
              <tr>
                <td>
                  <div style={logo}>
                    <span style={logoIcon}>→</span>
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
            <Heading style={h1}>You&apos;re invited to join {organizationName}</Heading>

            <Text style={paragraph}>{greeting}</Text>
            <Text style={paragraph}>
              <strong>{inviterName}</strong> has invited you to join{" "}
              <strong>{organizationName}</strong> on the TruckConnect freight
              marketplace as <strong>{roleLabel}</strong>.
            </Text>

            {/* Role pill */}
            <Section style={{ textAlign: "center", margin: "24px 0" }}>
              <span style={rolePill}>{roleLabel}</span>
            </Section>

            <Text style={paragraph}>
              {inviteeName
                ? `Click the button below to accept the invitation. This invite expires in ${expiresInHours} hours.`
                : `Click the button below to create your account and accept the invitation. This invite expires in ${expiresInHours} hours.`
              }
            </Text>

            <Section style={{ textAlign: "center", margin: "28px 0" }}>
              <Button href={inviteUrl} style={button}>
                Accept Invitation
              </Button>
            </Section>

            <Text style={smallText}>
              Or copy and paste this link into your browser:
            </Text>
            <Text style={linkText}>{inviteUrl}</Text>

            <Hr style={hr} />

            <Text style={footer}>
              If you weren&apos;t expecting this invitation, you can safely ignore
              this email. This invitation was sent by <strong>{inviterName}</strong>.
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

const logoIcon: React.CSSProperties = {
  color: "#fff",
  fontSize: 18,
  fontWeight: 700,
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
  lineHeight: 1.3,
};

const paragraph: React.CSSProperties = {
  fontSize: 15,
  lineHeight: 1.6,
  color: "#334155",
  margin: "0 0 16px",
};

const rolePill: React.CSSProperties = {
  display: "inline-block",
  backgroundColor: "#EFF6FF",
  color: "#1D4ED8",
  borderRadius: 100,
  padding: "6px 18px",
  fontSize: 13,
  fontWeight: 700,
  border: "1px solid #BFDBFE",
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
