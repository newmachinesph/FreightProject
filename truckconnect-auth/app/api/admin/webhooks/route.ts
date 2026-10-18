import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { webhookEndpoint } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { randomBytes } from "crypto";
import { writeAudit } from "@/lib/audit";

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;
  const role = (session.user as Record<string, unknown>).role as string;
  if (role !== "admin" && role !== "super_admin") return null;
  return session;
}

/**
 * GET /api/admin/webhooks — list all webhook endpoints
 */
export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ code: "FORBIDDEN", message: "Admin access required" }, { status: 403 });
  }

  const endpoints = await db
    .select({
      id: webhookEndpoint.id,
      url: webhookEndpoint.url,
      events: webhookEndpoint.events,
      active: webhookEndpoint.active,
      description: webhookEndpoint.description,
      createdAt: webhookEndpoint.createdAt,
    })
    .from(webhookEndpoint)
    .orderBy(desc(webhookEndpoint.createdAt));

  return NextResponse.json({ endpoints });
}

/**
 * POST /api/admin/webhooks — register a new webhook endpoint
 */
export async function POST(request: NextRequest) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ code: "FORBIDDEN", message: "Admin access required" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  if (!body?.url || !body?.events || !Array.isArray(body.events)) {
    return NextResponse.json(
      { code: "BAD_REQUEST", message: "url (string) and events (string[]) are required" },
      { status: 400 }
    );
  }

  // Validate URL
  try {
    new URL(body.url);
  } catch {
    return NextResponse.json({ code: "BAD_REQUEST", message: "Invalid URL" }, { status: 400 });
  }

  const VALID_EVENTS = [
    "user.created", "user.updated", "user.banned", "user.unbanned",
    "session.created", "session.revoked",
    "organization.created", "organization.updated",
    "member.invited", "member.joined", "member.removed",
    "api_key.created", "api_key.revoked",
  ];

  for (const event of body.events) {
    if (!VALID_EVENTS.includes(event)) {
      return NextResponse.json(
        { code: "BAD_REQUEST", message: `Invalid event type: ${event}` },
        { status: 400 }
      );
    }
  }

  const id = randomBytes(12).toString("hex");
  const secret = randomBytes(32).toString("hex");

  await db.insert(webhookEndpoint).values({
    id,
    url: body.url,
    secret,
    events: body.events,
    active: true,
    description: body.description ?? null,
    createdAt: new Date(),
  });

  writeAudit(request, {
    actorId: session.user.id,
    actorEmail: session.user.email,
    action: "webhook.created",
    targetId: id,
    targetType: "webhook_endpoint",
    metadata: { url: body.url, events: body.events },
  });

  return NextResponse.json({
    endpoint: {
      id,
      url: body.url,
      events: body.events,
      active: true,
      description: body.description ?? null,
      secret, // Returned once on creation — cannot be retrieved later
    },
  }, { status: 201 });
}

/**
 * DELETE /api/admin/webhooks — delete a webhook endpoint
 */
export async function DELETE(request: NextRequest) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ code: "FORBIDDEN", message: "Admin access required" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ code: "BAD_REQUEST", message: "id query param required" }, { status: 400 });
  }

  const [existing] = await db
    .select({ id: webhookEndpoint.id })
    .from(webhookEndpoint)
    .where(eq(webhookEndpoint.id, id))
    .limit(1);

  if (!existing) {
    return NextResponse.json({ code: "NOT_FOUND", message: "Endpoint not found" }, { status: 404 });
  }

  await db.delete(webhookEndpoint).where(eq(webhookEndpoint.id, id));

  writeAudit(request, {
    actorId: session.user.id,
    actorEmail: session.user.email,
    action: "webhook.deleted",
    targetId: id,
    targetType: "webhook_endpoint",
  });

  return NextResponse.json({ ok: true });
}
