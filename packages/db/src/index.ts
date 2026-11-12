import { drizzle } from "drizzle-orm/bun-sql";
import * as schema from "./schema.js";
import * as authSchema from "./auth-schema.js";

// Bun's native SQL driver (per apps/api/CLAUDE.md: use Bun.sql, not pg/postgres.js).
// The client runs in the consuming app's process, which auto-loads its own .env.
export const db = drizzle(process.env.DATABASE_URL!, {
  schema: { ...schema, ...authSchema },
});

// Re-export app tables + Better Auth tables so consumers import from one place.
export * from "./schema.js";
export * from "./auth-schema.js";
