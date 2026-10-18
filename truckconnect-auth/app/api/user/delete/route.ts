/**
 * POST /api/user/delete — permanently delete the authenticated user's account
 *
 * Body: { password: string, confirmation: "DELETE MY ACCOUNT" }
 *
 * Deletion order:
 *   1. Verify session & password
 *   2. Delete sessions
 *   3. Delete accounts (auth providers)
 *   4. Delete memberships
 *   5. Delete invitations sent by user
 *   6. Delete the user record
 *   7. Send farewell email
 *   8. Audit log the deletion
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db, runTransaction } from "@/lib/db";
import {
  user as userTable,
  session as sessionTable,
  account as accountTable,
  member as memberTable,
  invitation as invitationTable,
} from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { writeAudit } from "@/lib/audit";
import { sendFarewellEmail } from "@/lib/email/send";
import { rateLimiters } from "@/lib/redis";

async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

export async function POST(req: NextRequest) {
  // 1. Require authenticated session
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Rate limit — 3 attempts per 15 min per user
  try {
    const { success } = await rateLimiters.passwordReset.limit(session.user.id);
    if (!success) {
      return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
    }
  } catch { /* fail open if Redis unavailable */ }

  // 2. Parse and validate body
  let body: { password?: string; confirmation?: string } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  if (!body.password || typeof body.password !== "string") {
    return NextResponse.json(
      { error: "Password is required" },
      { status: 400 }
    );
  }

  if (body.confirmation !== "DELETE MY ACCOUNT") {
    return NextResponse.json(
      {
        error:
          'You must type "DELETE MY ACCOUNT" exactly to confirm account deletion',
      },
      { status: 400 }
    );
  }

  const userId = session.user.id;
  const userEmail = session.user.email;
  const userName = session.user.name;

  // 3. Verify password — use Better Auth's sign-in to validate credentials
  // This ensures we use the same hashing algorithm as Better Auth
  try {
    const verifyRes = await auth.api.signInEmail({
      body: { email: userEmail, password: body.password },
    });
    if (!verifyRes?.user) {
      return NextResponse.json({ error: "Incorrect password" }, { status: 403 });
    }
  } catch {
    return NextResponse.json({ error: "Incorrect password" }, { status: 403 });
  }

  // 4. Perform deletion in a transaction (atomic — all-or-nothing)
  try {
    await runTransaction(async (tx) => {
      await tx.delete(sessionTable).where(eq(sessionTable.userId, userId));
      await tx.delete(accountTable).where(eq(accountTable.userId, userId));
      await tx.delete(memberTable).where(eq(memberTable.userId, userId));
      await tx.delete(invitationTable).where(eq(invitationTable.inviterId, userId));
      await tx.delete(userTable).where(eq(userTable.id, userId));
    });
  } catch (err) {
    console.error("[user/delete] Deletion failed:", err);
    return NextResponse.json(
      { error: "Account deletion failed. Please contact support." },
      { status: 500 }
    );
  }

  // 5. Send farewell email (fire-and-forget)
  sendFarewellEmail({ to: userEmail, name: userName }).catch((err) => {
    console.error("[user/delete] Failed to send farewell email:", err);
  });

  // 6. Audit log
  writeAudit(req, {
    actorId: userId,
    actorEmail: userEmail,
    action: "user.deleted",
    targetId: userId,
    targetType: "user",
    metadata: {
      selfDelete: true,
      email: userEmail,
    },
  });

  return NextResponse.json({
    success: true,
    message: "Your account has been permanently deleted.",
  });
}
