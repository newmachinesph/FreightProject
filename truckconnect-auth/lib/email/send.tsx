import { render } from "@react-email/render";
import { sendMail } from "./mailer";
import InvitationEmail from "@/emails/InvitationEmail";
import WelcomeEmail from "@/emails/WelcomeEmail";
import PasswordResetEmail from "@/emails/PasswordResetEmail";
import OtpEmail from "@/emails/OtpEmail";
import FarewellEmail from "@/emails/FarewellEmail";

const APP_URL = process.env.BETTER_AUTH_URL ?? "http://localhost:3001";

export async function sendInvitationEmail({
  to,
  inviteeName,
  inviterName,
  organizationName,
  role,
  invitationId,
}: {
  to: string;
  inviteeName?: string;
  inviterName: string;
  organizationName: string;
  role: string;
  invitationId: string;
}) {
  const inviteUrl = `${APP_URL}/invite/${invitationId}`;
  const html = await render(
    <InvitationEmail
      inviteeName={inviteeName}
      inviterName={inviterName}
      organizationName={organizationName}
      role={role}
      inviteUrl={inviteUrl}
    />
  );

  return sendMail({
    to,
    subject: `You're invited to join ${organizationName} on TruckConnect`,
    html,
  });
}

export async function sendWelcomeEmail({
  to,
  name,
}: {
  to: string;
  name: string;
}) {
  const dashboardUrl = `${APP_URL}/dashboard`;
  const html = await render(
    <WelcomeEmail name={name} email={to} dashboardUrl={dashboardUrl} />
  );

  return sendMail({
    to,
    subject: "Welcome to TruckConnect Philippines 🇵🇭",
    html,
  });
}

export async function sendOtpEmail({
  to,
  name,
  code,
  purpose = "verify",
}: {
  to: string;
  name?: string;
  code: string;
  purpose?: "verify" | "sign-in";
}) {
  const html = await render(
    <OtpEmail name={name} code={code} purpose={purpose} />
  );

  return sendMail({
    to,
    subject: `${code} is your TruckConnect verification code`,
    html,
  });
}

export async function sendPasswordResetEmail({
  to,
  name,
  resetUrl,
}: {
  to: string;
  name: string;
  resetUrl: string;
}) {
  const html = await render(
    <PasswordResetEmail name={name} resetUrl={resetUrl} />
  );

  return sendMail({
    to,
    subject: "Reset your TruckConnect password",
    html,
  });
}

export async function sendFarewellEmail({
  to,
  name,
}: {
  to: string;
  name: string;
}) {
  const html = await render(
    <FarewellEmail name={name} />
  );

  return sendMail({
    to,
    subject: "Your TruckConnect account has been deleted",
    html,
  });
}
