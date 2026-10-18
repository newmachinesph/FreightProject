import {
  pgTable,
  text,
  boolean,
  timestamp,
  jsonb,
  integer,
  index,
} from "drizzle-orm/pg-core";

// ─── Core Better Auth tables ─────────────────────────────────────────────────

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  role: text("role").default("user"),
  banned: boolean("banned").default(false),
  banReason: text("ban_reason"),
  banExpires: timestamp("ban_expires"),
  phoneNumber: text("phone_number").unique(),
  phoneNumberVerified: boolean("phone_number_verified").default(false),
  trustedMetadata:   jsonb("trusted_metadata"),
  untrustedMetadata: jsonb("untrusted_metadata"),
}, (t) => [
  index("idx_user_email").on(t.email),
  index("idx_user_role").on(t.role),
]);

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  activeOrganizationId: text("active_organization_id"),
}, (t) => [
  index("idx_session_user_id").on(t.userId),
  index("idx_session_expires").on(t.expiresAt),
  index("idx_session_token").on(t.token),
  index("idx_session_active_org").on(t.activeOrganizationId),
]);

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  idToken: text("id_token"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
}, (t) => [
  index("idx_account_user_id").on(t.userId),
]);

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
}, (t) => [
  index("idx_verification_identifier").on(t.identifier),
]);

// ─── Organization plugin tables ───────────────────────────────────────────────

export const organization = pgTable("organization", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").unique(),
  orgType: text("org_type"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").notNull(),
}, (t) => [
  index("idx_org_type").on(t.orgType),
]);

export const member = pgTable("member", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  role: text("role").notNull(),
  createdAt: timestamp("created_at").notNull(),
}, (t) => [
  index("idx_member_user_id").on(t.userId),
  index("idx_member_org_id").on(t.organizationId),
  index("idx_member_user_org").on(t.userId, t.organizationId),
  index("idx_member_org_role").on(t.organizationId, t.role),
]);

// ─── Invite Codes — shareable join links ─────────────────────────────────────

export const inviteCode = pgTable("invite_code", {
  id: text("id").primaryKey(),
  orgId: text("org_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  createdById: text("created_by_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  code: text("code").notNull().unique(),             // e.g. "MANILA-2026"
  role: text("role").notNull().default("member"),     // role assigned on join
  maxUses: integer("max_uses"),                       // null = unlimited
  usedCount: integer("used_count").notNull().default(0),
  expiresAt: timestamp("expires_at"),                 // null = never expires
  revokedAt: timestamp("revoked_at"),                 // soft-delete
  createdAt: timestamp("created_at").notNull(),
}, (t) => [
  index("idx_invite_code_org").on(t.orgId),
  index("idx_invite_code_code").on(t.code),
  index("idx_invite_code_org_revoked").on(t.orgId, t.revokedAt),
]);

// ─── Audit Log — immutable event trail ────────────────────────────────────────

export const auditLog = pgTable("audit_log", {
  id:         text("id").primaryKey(),
  actorId:    text("actor_id"),
  actorEmail: text("actor_email"),
  orgId:      text("org_id"),
  action:     text("action").notNull(),
  targetId:   text("target_id"),
  targetType: text("target_type"),
  metadata:   jsonb("metadata"),
  ipAddress:  text("ip_address"),
  userAgent:  text("user_agent"),
  createdAt:  timestamp("created_at").notNull(),
}, (t) => [
  index("idx_audit_org_id").on(t.orgId),
  index("idx_audit_action").on(t.action),
  index("idx_audit_created").on(t.createdAt),
  index("idx_audit_actor").on(t.actorId),
  index("idx_audit_org_created").on(t.orgId, t.createdAt),
  index("idx_audit_actor_created").on(t.actorId, t.createdAt),
]);

// ─── API Keys — org-scoped, admin-managed ─────────────────────────────────────

export const apiKey = pgTable("api_key", {
  id: text("id").primaryKey(),
  orgId: text("org_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  createdById: text("created_by_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  keyHash: text("key_hash").notNull().unique(),
  prefix: text("prefix").notNull(),
  expiresAt: timestamp("expires_at"),
  lastUsedAt: timestamp("last_used_at"),
  revokedAt: timestamp("revoked_at"),
  createdAt: timestamp("created_at").notNull(),
}, (t) => [
  index("idx_apikey_org_id").on(t.orgId),
  index("idx_apikey_hash").on(t.keyHash),
  index("idx_apikey_org_active").on(t.orgId, t.revokedAt),
]);

export const invitation = pgTable("invitation", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  inviterId: text("inviter_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  email: text("email").notNull(),
  role: text("role"),
  status: text("status").notNull().default("pending"),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull(),
}, (t) => [
  index("idx_invitation_org_id").on(t.organizationId),
  index("idx_invitation_email").on(t.email),
  index("idx_invitation_status").on(t.status),
  index("idx_invitation_email_status").on(t.email, t.status),
  index("idx_invitation_org_status").on(t.organizationId, t.status),
]);

// ─── Personal Access Tokens — user-scoped ───────────────────────────────────

export const personalToken = pgTable("personal_token", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  tokenHash: text("token_hash").notNull().unique(),
  prefix: text("prefix").notNull(),
  expiresAt: timestamp("expires_at"),
  lastUsedAt: timestamp("last_used_at"),
  revokedAt: timestamp("revoked_at"),
  createdAt: timestamp("created_at").notNull(),
}, (t) => [
  index("idx_personal_token_user").on(t.userId),
  index("idx_personal_token_hash").on(t.tokenHash),
]);

// ─── JWK storage (Better Auth JWT plugin) ─────────────────────────────────────

export const jwks = pgTable("jwks", {
  id: text("id").primaryKey(),
  publicKey: text("public_key").notNull(),
  privateKey: text("private_key").notNull(),
  createdAt: timestamp("created_at").notNull(),
});

// ─── Webhook endpoints ─────────────────────────────────────────────────────────

export const webhookEndpoint = pgTable("webhook_endpoint", {
  id: text("id").primaryKey(),
  url: text("url").notNull(),
  secret: text("secret").notNull(),          // HMAC-SHA256 signing secret
  events: jsonb("events").notNull(),          // ["user.created", "session.created", ...]
  active: boolean("active").notNull().default(true),
  description: text("description"),
  createdAt: timestamp("created_at").notNull(),
});

export const webhookEvent = pgTable("webhook_event", {
  id: text("id").primaryKey(),
  endpointId: text("endpoint_id").notNull()
    .references(() => webhookEndpoint.id, { onDelete: "cascade" }),
  eventType: text("event_type").notNull(),
  payload: jsonb("payload"),
  status: text("status").notNull().default("pending"), // "pending" | "delivered" | "failed"
  statusCode: integer("status_code"),
  deliveredAt: timestamp("delivered_at"),
  createdAt: timestamp("created_at").notNull(),
}, (t) => [
  index("idx_webhook_event_endpoint").on(t.endpointId),
  index("idx_webhook_event_type").on(t.eventType),
  index("idx_webhook_event_endpoint_status").on(t.endpointId, t.status),
  index("idx_webhook_event_type_created").on(t.eventType, t.createdAt),
]);
