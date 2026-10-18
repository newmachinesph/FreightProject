import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, organization, phoneNumber, bearer } from "better-auth/plugins";
import { jwt } from "better-auth/plugins/jwt";
import { createAccessControl } from "better-auth/plugins/access";
import { db } from "./db";
import { eq, and } from "drizzle-orm";
import * as schema from "./db/schema";
import {
  sendInvitationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendOtpEmail,
} from "./email/send";
import { sendOTPSms, normalizePHNumber } from "./sms/semaphore";
import { storeOtp } from "./sms/dev-store";
import { writeAudit } from "./audit";
import { dispatchWebhookEvent } from "./webhooks";
import { rateLimiters } from "./redis";
import { COOKIE_PREFIX } from "./auth/constants";

/**
 * Notify org owner when a member joins (invite accepted / code redeemed).
 * Fire-and-forget — dispatches a webhook event + audit log entry.
 */
async function notifyInviteAccepted(
  ownerUserId: string,
  details: { memberName: string; orgName: string; role: string }
): Promise<void> {
  dispatchWebhookEvent("member.joined", {
    userId: ownerUserId,
    memberName: details.memberName,
    orgName: details.orgName,
    role: details.role,
  });
  writeAudit(null, {
    actorId: null,
    actorEmail: null,
    action: "member.joined",
    targetId: ownerUserId,
    targetType: "user",
    metadata: {
      detail: `${details.memberName} joined ${details.orgName} as ${details.role}`,
    },
  });
}


// Validate required environment variables at startup
const REQUIRED_ENV = ["DATABASE_URL", "BETTER_AUTH_SECRET"];
const OPTIONAL_ENV = ["UPSTASH_REDIS_REST_URL"]; // warn but don't crash
for (const env of REQUIRED_ENV) {
  if (!process.env[env]) throw new Error(`[truckconnect-auth] Missing required env: ${env}`);
}
for (const env of OPTIONAL_ENV) {
  if (!process.env[env]) console.warn(`[truckconnect-auth] Missing optional env: ${env} — feature degraded`);
}

// ── Password policy ──────────────────────────────────────────────────────────

const MIN_PASSWORD_LENGTH = 10;

const PASSWORD_RULES = [
  { test: (p: string) => p.length >= MIN_PASSWORD_LENGTH, msg: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` },
  { test: (p: string) => /[A-Z]/.test(p), msg: "Password must contain at least one uppercase letter" },
  { test: (p: string) => /[a-z]/.test(p), msg: "Password must contain at least one lowercase letter" },
  { test: (p: string) => /\d/.test(p), msg: "Password must contain at least one number" },
];

const COMMON_PASSWORDS = new Set([
  "password123", "qwerty12345", "123456789a", "letmein123",
  "admin12345", "welcome123", "iloveyou12", "monkey1234",
  "dragon1234", "master1234", "abc1234567", "1234567890",
]);

function validatePassword(password: string): string | null {
  for (const rule of PASSWORD_RULES) {
    if (!rule.test(password)) return rule.msg;
  }
  if (COMMON_PASSWORDS.has(password.toLowerCase())) {
    return "This password is too common. Please choose a stronger one.";
  }
  return null;
}

// ── HaveIBeenPwned breach check (k-anonymity — no API key needed) ────────────

async function isPasswordBreached(password: string): Promise<boolean> {
  try {
    const { createHash } = await import("crypto");
    const sha1 = createHash("sha1").update(password).digest("hex").toUpperCase();
    const prefix = sha1.slice(0, 5);
    const suffix = sha1.slice(5);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
      signal: controller.signal,
      headers: { "Add-Padding": "true" },
    });
    clearTimeout(timer);

    if (!res.ok) return false; // Don't block sign-up if HIBP is down

    const text = await res.text();
    return text.split("\n").some(line => {
      const [hash, count] = line.trim().split(":");
      return hash === suffix && parseInt(count, 10) > 0;
    });
  } catch {
    return false; // Fail open — don't block sign-up on network errors
  }
}

// ── Admin plugin access control ──────────────────────────────────────────────

const adminPluginAc = createAccessControl({
  user: [
    "create", "list", "set-role", "ban",
    "impersonate", "delete", "set-password", "get", "update",
  ],
  session: ["list", "revoke", "delete"],
});
const fullAdminRole = adminPluginAc.newRole({
  user: [
    "create", "list", "set-role", "ban",
    "impersonate", "delete", "set-password", "get", "update",
  ],
  session: ["list", "revoke", "delete"],
});
const regularUserRole = adminPluginAc.newRole({ user: [], session: [] });

import {
  ac,
  superAdminRole,
  complianceOfficerRole,
  disputeManagerRole,
  supportAgentRole,
  aiSupervisorRole,
  dataQualityRole,
  enterpriseAdminRole,
  bookerRole,
  viewerRole,
  shipperAdminRole,
  forwarderAdminRole,
  agentRole,
  carrierOwnerRole,
  dispatcherRole,
  driverRole,
  warehouseAdminRole,
  warehouseManagerRole,
  warehouseStaffRole,
  warehouseViewerRole,
} from "./auth/access-control";

// Validate auth secret at startup
const AUTH_SECRET = process.env.BETTER_AUTH_SECRET;
if (!AUTH_SECRET || AUTH_SECRET.length < 32) {
  if (process.env.NODE_ENV === "production") {
    throw new Error("BETTER_AUTH_SECRET must be at least 32 characters in production. Generate with: openssl rand -hex 32");
  }
}

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3001",
  secret: AUTH_SECRET,

  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
      organization: schema.organization,
      member: schema.member,
      invitation: schema.invitation,
      jwks: schema.jwks,
    },
  }),

  user: {
    additionalFields: {
      trustedMetadata: {
        type:     "string",
        required:  false,
        returned:  true,
        input:     false,
      },
      untrustedMetadata: {
        type:     "string",
        required:  false,
        returned:  true,
        input:     true,
      },
    },
  },

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Phone SMS is the primary verification channel
    minPasswordLength: MIN_PASSWORD_LENGTH,
    sendResetPassword: async ({ user, url }) => {
      await sendPasswordResetEmail({
        to: user.email,
        name: user.name,
        resetUrl: url,
      });
    },
  },

  advanced: {
    cookiePrefix: COOKIE_PREFIX,
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 4,      // refresh if older than 4 hours
    cookieCache: {
      enabled: true,
      maxAge: 30, // 30 second cache — faster ban/revoke propagation
    },
  },

  // ── Database hooks for audit + webhooks ─────────────────────────────────────
  databaseHooks: {
    user: {
      create: {
        after: async (newUser) => {
          // Send welcome email (truly fire-and-forget — never blocks sign-up)
          const u = newUser as { email?: string; name?: string };
          if (u.email) {
            setTimeout(() => {
              sendWelcomeEmail({ to: u.email!, name: u.name ?? "there" }).catch((err) => {
                console.error("[auth] Failed to send welcome email:", err);
              });
            }, 0);
          }
        },
      },
    },
    session: {
      create: {
        after: async (session) => {
          dispatchWebhookEvent("session.created", {
            sessionId: session.id,
            userId: session.userId,
          });
        },
      },
    },
    member: {
      create: {
        after: async (newMember: Record<string, unknown>) => {
          // Fire-and-forget: notify org owner when a member joins (invite accepted / code redeemed)
          try {
            const mUserId = newMember.userId as string | undefined;
            const mOrgId = newMember.organizationId as string | undefined;
            const mRole = (newMember.role as string) ?? "member";
            if (!mUserId || !mOrgId) return;

            // Look up the new member's name
            const [joiner] = await db
              .select({ name: schema.user.name })
              .from(schema.user)
              .where(eq(schema.user.id, mUserId))
              .limit(1);

            // Look up the org owner + org name
            const [ownerRow] = await db
              .select({ userId: schema.member.userId, orgName: schema.organization.name })
              .from(schema.member)
              .innerJoin(schema.organization, eq(schema.member.organizationId, schema.organization.id))
              .where(and(eq(schema.member.organizationId, mOrgId), eq(schema.member.role, "owner")))
              .limit(1);

            if (ownerRow && ownerRow.userId !== mUserId) {
              notifyInviteAccepted(ownerRow.userId, {
                memberName: joiner?.name ?? "A user",
                orgName: ownerRow.orgName,
                role: mRole,
              }).catch(() => {});
            }
          } catch { /* ignore — don't break member creation */ }
        },
      },
    },
    account: {
      create: {
        before: async (account) => {
          // Password is already hashed by Better Auth at this point.
          // Client-side zxcvbn + minPasswordLength enforce strength.
          return { data: account };
        },
      },
    },
  },

  plugins: [
    /**
     * Bearer plugin — session tokens as Authorization: Bearer {token}.
     * For mobile apps and server-to-server forwarding.
     */
    bearer(),

    /**
     * JWT plugin — signs sessions as JWTs for local verification.
     * Endpoints:
     *   GET  /api/auth/token  → returns JWT for current session
     *   GET  /api/auth/jwks   → public keys for verification
     *
     * SDK can verify JWTs locally (no HTTP round-trip) using JWKS.
     */
    jwt({
      jwt: {
        issuer: process.env.BETTER_AUTH_URL ?? "http://localhost:3001",
        audience: "truckconnect",
        expirationTime: "15m",
        definePayload: async ({ user, session }) => ({
          sub: user.id,
          email: user.email,
          name: user.name,
          role: (user as Record<string, unknown>).role ?? "user",
          activeOrgId: session.activeOrganizationId ?? null,
        }),
      },
      jwks: {
        keyPairConfig: { alg: "ES256" },
      },
    }),

    /**
     * Phone OTP — Semaphore SMS (PH) or email fallback.
     */
    phoneNumber({
      sendOTP: async ({ phoneNumber: phone, code }) => {
        // Phone-level rate limit: max 3 OTPs per phone per 5 minutes (Redis-backed)
        const phoneKey = phone.replace(/\D/g, "");
        try {
          const { success } = await rateLimiters.otpPhone.limit(phoneKey);
          if (!success) {
            throw new Error("Too many OTP requests for this phone number. Try again in a few minutes.");
          }
        } catch (e) {
          if (e instanceof Error && e.message.includes("Too many OTP")) throw e;
        }

        // Dev mode: use static code 123456, store to file, log to console
        if (process.env.DEV_STATIC_OTP) {
          const devCode = "123456";
          storeOtp(normalizePHNumber(phone), devCode);
          console.log(`\n[truckconnect-auth DEV] OTP for ${phone} → ${devCode} (static dev code)\n`);
          return;
        }

        // Production: send via SMS (Semaphore) or email fallback
        const channel = process.env.VERIFICATION_CHANNEL ?? "sms";
        if (channel === "sms" && process.env.SEMAPHORE_API_KEY) {
          await sendOTPSms({ to: phone, code });
        } else {
          const users = await db
            .select({ email: schema.user.email, name: schema.user.name })
            .from(schema.user)
            .where(eq(schema.user.phoneNumber, phone))
            .limit(1);
          if (users.length > 0) {
            await sendOtpEmail({ to: users[0].email, name: users[0].name, code });
          } else {
            console.warn("[truckconnect-auth] Email OTP: no user found for phone:", phone);
          }
        }
      },
      otpLength: 6,
      expiresIn: 60 * 10,
    }),

    /**
     * Admin plugin — platform-level roles + user management.
     */
    admin({
      defaultRole: "user",
      ac: adminPluginAc,
      adminRoles: ["admin", "super_admin"],
      roles: {
        user: regularUserRole,
        admin: fullAdminRole,
        super_admin: fullAdminRole,
      },
    }),

    /**
     * Organization plugin — multi-tenancy with 18 freight-specific roles.
     */
    organization({
      ac,
      roles: {
        owner: superAdminRole,
        member: viewerRole,
        super_admin: superAdminRole,
        compliance_officer: complianceOfficerRole,
        dispute_manager: disputeManagerRole,
        support_agent: supportAgentRole,
        ai_supervisor: aiSupervisorRole,
        data_quality: dataQualityRole,
        enterprise_admin: enterpriseAdminRole,
        booker: bookerRole,
        viewer: viewerRole,
        shipper_admin: shipperAdminRole,
        forwarder_admin: forwarderAdminRole,
        agent: agentRole,
        carrier_owner: carrierOwnerRole,
        dispatcher: dispatcherRole,
        driver: driverRole,
        warehouse_admin: warehouseAdminRole,
        warehouse_manager: warehouseManagerRole,
        warehouse_staff: warehouseStaffRole,
        warehouse_viewer: warehouseViewerRole,
      },
      allowUserToCreateOrganization: async () => true,

      organizationHooks: {
        beforeCreateOrganization: async ({ organization: orgData }: { organization: Record<string, unknown>; user: Record<string, unknown> }) => {
          const VALID_TYPES = new Set([
            "tc_platform", "enterprise_shipper", "msme_shipper",
            "carrier_fleet", "freight_forwarder", "warehouse_operator",
          ]);
          if (orgData.metadata) {
            try {
              const parsed = typeof orgData.metadata === "string"
                ? JSON.parse(orgData.metadata as string)
                : orgData.metadata;
              const meta = parsed as { type?: string | string[] };

              // Support single type or array of types
              const types = Array.isArray(meta.type) ? meta.type : meta.type ? [meta.type] : [];
              if (types.length === 0) {
                throw new Error("Organization type is required");
              }
              for (const t of types) {
                if (!VALID_TYPES.has(t)) {
                  throw new Error(
                    `Invalid organization type "${t}". Must be one of: ${[...VALID_TYPES].join(", ")}`
                  );
                }
              }

              // Set org_type as a first-class column (primary type)
              orgData.orgType = types[0];
            } catch (e) {
              if (e instanceof Error && e.message.includes("type")) throw e;
              throw new Error("Organization metadata must include a valid type");
            }
          } else {
            throw new Error("Organization metadata with type is required");
          }
          return { data: orgData };
        },
      },
      invitationExpiresIn: 60 * 60 * 48,
      sendInvitationEmail: async (data) => {
        // Look up invitee name + id if they're an existing user
        let inviteeName: string | undefined;
        let inviteeId: string | undefined;
        try {
          const [existing] = await db
            .select({ id: schema.user.id, name: schema.user.name })
            .from(schema.user)
            .where(eq(schema.user.email, data.email))
            .limit(1);
          inviteeName = existing?.name;
          inviteeId = existing?.id;
        } catch { /* ignore */ }

        try {
          await sendInvitationEmail({
            to: data.email,
            inviteeName,
            inviterName: data.inviter.user.name,
            organizationName: data.organization.name,
            role: data.role ?? "member",
            invitationId: data.id,
          });
        } catch (err) {
          console.error("[auth] Failed to send invitation email:", err);
        }

      },
    }),
  ],
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
