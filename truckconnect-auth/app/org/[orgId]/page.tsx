import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { member, user, organization } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import OrgMembersClient from "@/components/org/OrgMembersClient";
import { ORG_ADMIN_ROLES } from "@/lib/auth/constants";

export default async function OrgMembersPage({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const { orgId } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");

  const u = session.user as typeof session.user & { role?: string };

  // Fetch all members with user details
  const members = await db
    .select({
      memberId: member.id,
      userId: member.userId,
      role: member.role,
      joinedAt: member.createdAt,
      name: user.name,
      email: user.email,
      image: user.image,
      banned: user.banned,
    })
    .from(member)
    .innerJoin(user, eq(member.userId, user.id))
    .where(eq(member.organizationId, orgId))
    .orderBy(member.createdAt);

  // Caller's role in this org
  const callerMember = members.find(m => m.userId === session.user.id);
  const callerRole = u.role === "super_admin" ? "super_admin" : (callerMember?.role ?? "member");

  const isAdmin = ORG_ADMIN_ROLES.has(callerRole);

  return (
    <OrgMembersClient
      orgId={orgId}
      members={members}
      callerUserId={session.user.id}
      callerRole={callerRole}
      isAdmin={isAdmin}
    />
  );
}
