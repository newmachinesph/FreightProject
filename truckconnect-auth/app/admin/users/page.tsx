import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { user } from "@/lib/db/schema";
import { sql } from "drizzle-orm";
import UserSearch from "@/components/admin/UserSearch";

async function getUsers() {
  return db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      banned: user.banned,
      banReason: user.banReason,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
    })
    .from(user)
    .orderBy(sql`${user.createdAt} desc`);
}


export default async function UsersPage() {
  const [users, session] = await Promise.all([
    getUsers(),
    auth.api.getSession({ headers: await headers() }),
  ]);
  const currentUserId = session?.user?.id ?? "";

  return (
    <div style={{ padding: "28px 32px", maxWidth: 1200 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--text-1)" }}>Users</h1>
          <p style={{ fontSize: 14, color: "var(--text-3)", marginTop: 4 }}>
            {users.length} user{users.length !== 1 ? "s" : ""} registered
          </p>
        </div>
        <a href="/admin/users/invite" className="btn-primary">
          + Invite User
        </a>
      </div>

      <UserSearch users={users} currentUserId={currentUserId} />
    </div>
  );
}
