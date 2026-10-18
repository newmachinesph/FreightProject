import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { user } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { sendInvitationEmail } from "@/lib/email/send";
import { writeAudit } from "@/lib/audit";

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ code: "UNAUTHORIZED", message: "Not authenticated" }, { status: 401 });
  }

  const role = (session.user as Record<string, unknown>).role as string;
  if (role !== "admin" && role !== "super_admin") {
    return NextResponse.json({ code: "FORBIDDEN", message: "Admin access required" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  if (!body?.email || typeof body.email !== "string") {
    return NextResponse.json({ code: "BAD_REQUEST", message: "Email is required" }, { status: 400 });
  }

  const email = body.email.trim().toLowerCase();
  const targetRole = body.role ?? "user";

  // Check if user already exists
  const [existing] = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.email, email))
    .limit(1);

  if (existing) {
    return NextResponse.json({ code: "CONFLICT", message: "A user with this email already exists" }, { status: 409 });
  }

  // Send invitation email
  try {
    await sendInvitationEmail({
      to: email,
      inviterName: session.user.name,
      organizationName: "TruckConnect Platform",
      role: targetRole,
      invitationId: "platform-invite",
    });
  } catch (err) {
    console.error("[admin/invite] Failed to send email:", err);
    return NextResponse.json({ code: "EMAIL_FAILED", message: "Failed to send invitation email" }, { status: 500 });
  }

  writeAudit(request, {
    actorId: session.user.id,
    actorEmail: session.user.email,
    action: "admin.user_invited",
    targetType: "user",
    metadata: { email, role: targetRole },
  });

  return NextResponse.json({ ok: true, message: `Invitation sent to ${email}` });
}
