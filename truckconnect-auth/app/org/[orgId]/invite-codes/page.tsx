import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { inviteCode } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import OrgInviteCodesClient from "@/components/org/OrgInviteCodesClient";

export default async function OrgInviteCodesPage({ params }: { params: Promise<{ orgId: string }> }) {
  const { orgId } = await params;

  const codes = await db
    .select()
    .from(inviteCode)
    .where(eq(inviteCode.orgId, orgId))
    .orderBy(inviteCode.createdAt);

  return <OrgInviteCodesClient orgId={orgId} initialCodes={codes} />;
}
