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
  name: string;
}

export default function FarewellEmail({ name }: Props) {
  return (
    <Html>
      <Head />
      <Preview>Your TruckConnect account has been deleted</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={headerTitle}>Account Deleted</Heading>
            <Text style={headerSub}>
              Your TruckConnect account has been removed
            </Text>
          </Section>

          <Section style={content}>
            <Text style={paragraph}>Hi {name},</Text>
            <Text style={paragraph}>
              Your TruckConnect account and all associated data have been
              permanently deleted as you requested. This includes your profile,
              sessions, organization memberships, and activity history.
            </Text>
            <Text style={paragraph}>
              If you owned any organizations, your membership has been removed.
              Please note that organizations you owned may still exist if other
              members remain — ownership should be transferred beforehand.
            </Text>

            <Hr style={hr} />

            <Text style={paragraph}>
              We are sorry to see you go. If you ever want to return, you are
              welcome to create a new account at any time.
            </Text>
            <Text style={paragraph}>
              If you did not request this deletion, please contact us immediately
              at <strong>support@truckconnect.ph</strong>.
            </Text>

            <Hr style={hr} />

            <Text style={footer}>
              This is an automated message. You will not receive further emails
              from TruckConnect.
            </Text>
            <Text style={footer}>
              &copy; {new Date().getFullYear()} TruckConnect Philippines
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const body: React.CSSProperties = {
  backgroundColor: "#F0F4FC",
  fontFamily:
    "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
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
  background: "linear-gradient(135deg, #7F1D1D 0%, #991B1B 100%)",
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

const hr: React.CSSProperties = {
  borderColor: "#E2E8F0",
  margin: "24px 0",
};

const footer: React.CSSProperties = {
  fontSize: 12,
  color: "#94A3B8",
  lineHeight: 1.6,
  margin: "0 0 6px",
};
