import { Pool, types } from "pg";
import "dotenv/config";

// OID 1082 = date. By default pg parses this into a JS Date (in local time,
// which silently shifts the calendar day). We store dates as plain
// YYYY-MM-DD strings throughout the app, so keep them as strings here too.
types.setTypeParser(1082, (val) => val);

const connectionString =
  process.env.DATABASE_URL ??
  `postgresql://${process.env.PGUSER ?? "postgres"}:${process.env.PGPASSWORD ?? "postgres"}@${
    process.env.PGHOST ?? "localhost"
  }:${process.env.PGPORT ?? "5432"}/${process.env.PGDATABASE ?? "jobtrack"}`;

export const pool = new Pool({ connectionString });

export async function closePool(): Promise<void> {
  await pool.end();
}
