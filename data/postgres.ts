// data/postgres.ts
import dotenv from "dotenv";
import { Pool, QueryResult, QueryResultRow } from "pg";

dotenv.config({ path: ".env" });

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in .env");
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  idleTimeoutMillis: 30000, // close idle clients after 30s
  connectionTimeoutMillis: 10000, // 10s connection timeout
});

pool.on("error", (err) => {
  console.error("⚠️ Unexpected PG client error, reconnecting...", err);
});

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: (string | number | boolean | null | Date)[]
): Promise<QueryResult<T>> {
  const start = Date.now();
  const res = await pool.query<T>(text, params);
  const duration = Date.now() - start;
  console.log("🧠 Executed query", { text: text.slice(0, 60), duration, rows: res.rowCount });
  return res;
}

// ✅ Helper: clear table safely
export async function clearTable(tableName: string) {
  await query(`TRUNCATE TABLE ${tableName} RESTART IDENTITY;`);
  console.log(`🗑️ Cleared table: ${tableName}`);
}
