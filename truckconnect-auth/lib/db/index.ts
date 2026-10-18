import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { sql } from "drizzle-orm";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

let sqlClient: ReturnType<typeof neon>;

try {
  sqlClient = neon(process.env.DATABASE_URL);
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  throw new Error(`Failed to initialize database connection: ${message}`);
}

export const db = drizzle(sqlClient, { schema });

/**
 * Run multiple SQL statements as a single Neon HTTP transaction.
 * Uses BEGIN/COMMIT/ROLLBACK over the same connection.
 */
export async function runTransaction(
  fn: (tx: typeof db) => Promise<void>
): Promise<void> {
  // Neon HTTP driver: each execute is a separate HTTP request,
  // but BEGIN/COMMIT/ROLLBACK are still honored within a session.
  await db.execute(sql`BEGIN`);
  try {
    await fn(db);
    await db.execute(sql`COMMIT`);
  } catch (err) {
    await db.execute(sql`ROLLBACK`).catch(() => {});
    throw err;
  }
}

/**
 * Health check — runs a lightweight `SELECT 1` to verify connectivity.
 * Returns { ok: true, latencyMs } on success, { ok: false, error } on failure.
 */
export async function checkDbHealth(): Promise<
  { ok: true; latencyMs: number } | { ok: false; error: string }
> {
  const start = Date.now();
  try {
    await db.execute(sql`SELECT 1`);
    return { ok: true, latencyMs: Date.now() - start };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { ok: false, error: message };
  }
}
