import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { apiKey, member } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import OrgApiKeysClient from "@/components/org/OrgApiKeysClient";
import { ORG_ADMIN_ROLES } from "@/lib/auth/constants";

export default async function OrgKeysPage({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const { orgId } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");

  const u = session.user as typeof session.user & { role?: string };
  if (u.role !== "super_admin") {
    const [m] = await db
      .select({ role: member.role })
      .from(member)
      .where(and(eq(member.userId, session.user.id), eq(member.organizationId, orgId)))
      .limit(1);
    if (!m || !ORG_ADMIN_ROLES.has(m.role)) redirect("/dashboard");
  }

  const keys = await db
    .select({
      id: apiKey.id,
      name: apiKey.name,
      prefix: apiKey.prefix,
      expiresAt: apiKey.expiresAt,
      lastUsedAt: apiKey.lastUsedAt,
      revokedAt: apiKey.revokedAt,
      createdAt: apiKey.createdAt,
    })
    .from(apiKey)
    .where(eq(apiKey.orgId, orgId))
    .orderBy(desc(apiKey.createdAt));

  return <OrgApiKeysClient orgId={orgId} keys={keys} />;
}
