import { Pool } from "pg";

const globalForPg = globalThis as typeof globalThis & { kinterestPool?: Pool };

export const pool = globalForPg.kinterestPool ?? new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 5,
  idleTimeoutMillis: 10_000,
  connectionTimeoutMillis: 5_000
});

if (process.env.NODE_ENV !== "production") {
  globalForPg.kinterestPool = pool;
}
