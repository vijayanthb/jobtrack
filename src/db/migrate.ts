import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { pool, closePool } from "./pool.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function migrate(): Promise<void> {
  const sql = readFileSync(path.join(__dirname, "schema.sql"), "utf-8");
  await pool.query(sql);
  console.log("Migration complete: applications table is ready.");
}

migrate()
  .catch((err) => {
    console.error("Migration failed:", err);
    process.exitCode = 1;
  })
  .finally(() => closePool());
