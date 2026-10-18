/**
 * Seed script — creates super admin via Better Auth sign-up API.
 * Usage: npx tsx scripts/seed.ts
 * Requires: auth server running on port 3001
 *
 * Environment variables:
 *   AUTH_URL          — auth server URL (default: http://localhost:3001)
 *   SEED_ADMIN_EMAIL  — admin email (default: admin@truckconnect.ph)
 *   SEED_ADMIN_PASS   — admin password (required, must meet password policy)
 *   DATABASE_URL      — Neon database connection string (required)
 */

const AUTH_URL = process.env.AUTH_URL ?? "http://localhost:3001";
const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL ?? "admin@truckconnect.ph";
const ADMIN_PASS = process.env.SEED_ADMIN_PASS;
const DB_URL = process.env.DATABASE_URL;

async function main() {
  if (!ADMIN_PASS) {
    console.error("Error: SEED_ADMIN_PASS environment variable is required.");
    console.error("Usage: SEED_ADMIN_PASS='YourStr0ngPass!' npx tsx scripts/seed.ts");
    process.exit(1);
  }
  if (!DB_URL) {
    console.error("Error: DATABASE_URL environment variable is required.");
    process.exit(1);
  }

  console.log(`Signing up ${ADMIN_EMAIL} ...`);

  const res = await fetch(`${AUTH_URL}/api/auth/sign-up/email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Origin": AUTH_URL,
    },
    body: JSON.stringify({
      name: "Super Admin",
      email: ADMIN_EMAIL,
      password: ADMIN_PASS,
    }),
  });

  const text = await res.text();
  console.log(`Status: ${res.status}`);
  console.log(`Body: ${text}`);

  if (res.ok) {
    const { neon } = require("@neondatabase/serverless");
    const sql = neon(DB_URL);
    await sql`UPDATE "user" SET role = 'super_admin' WHERE email = ${ADMIN_EMAIL}`;
    console.log("\nPromoted to super_admin");
    console.log(`\nCredentials: ${ADMIN_EMAIL} / (your SEED_ADMIN_PASS value)`);
  } else {
    console.error("\nSign-up failed");
  }
}

main().catch(console.error);
