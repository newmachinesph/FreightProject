import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { member } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { ORG_ADMIN_ROLES } from "@/lib/auth/constants";

export default async function OrgRootPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");

  // Find first org where user is an admin
  const memberships = await db
    .select({ orgId: member.organizationId, role: member.role })
    .from(member)
    .where(eq(member.userId, session.user.id));

  const adminOrg = memberships.find(m => ORG_ADMIN_ROLES.has(m.role));
  if (adminOrg) redirect(`/org/${adminOrg.orgId}`);

  redirect("/dashboard");
}
