import nodemailer from "nodemailer";

// DEV_SMTP=true → route all mail through Mailpit (localhost:1025, no auth needed)
// Mailpit UI: http://localhost:8025
const devSmtp = process.env.DEV_SMTP === "true";

export const transporter = devSmtp
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST ?? "localhost",
      port: Number(process.env.SMTP_PORT ?? 1025),
      secure: false,
      connectionTimeout: 3000, // Don't hang if Mailpit isn't running
      greetingTimeout: 3000,
    })
  : nodemailer.createTransport({
      host: process.env.MAIL_SERVER,
      port: Number(process.env.MAIL_PORT ?? 587),
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
      tls: { rejectUnauthorized: false },
    });

export const FROM = `"${process.env.MAIL_FROM_NAME ?? "TruckConnect"}" <${process.env.MAIL_FROM ?? "info@sbv.one"}>`;

export async function sendMail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}) {
  return transporter.sendMail({ from: FROM, to, subject, html, text });
}
