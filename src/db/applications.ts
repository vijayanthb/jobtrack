import { pool } from "./pool.js";
import type { Application, NewApplication, Stage } from "../types.js";

export async function insertApplication(app: NewApplication): Promise<Application> {
  const { rows } = await pool.query<Application>(
    `INSERT INTO applications (company, role, stage, applied_date, next_step_date, link, notes)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [
      app.company,
      app.role,
      app.stage,
      app.applied_date,
      app.next_step_date ?? null,
      app.link ?? null,
      app.notes ?? null,
    ]
  );
  return rows[0];
}

export async function listApplications(filters: {
  stage?: Stage;
  company?: string;
}): Promise<Application[]> {
  const conditions: string[] = [];
  const values: unknown[] = [];

  if (filters.stage) {
    values.push(filters.stage);
    conditions.push(`stage = $${values.length}`);
  }
  if (filters.company) {
    values.push(`%${filters.company}%`);
    conditions.push(`company ILIKE $${values.length}`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const { rows } = await pool.query<Application>(
    `SELECT * FROM applications ${where} ORDER BY applied_date DESC, id DESC`,
    values
  );
  return rows;
}

export async function updateStage(
  id: number,
  stage: Stage,
  nextStepDate?: string | null
): Promise<Application | null> {
  const { rows } = await pool.query<Application>(
    `UPDATE applications
     SET stage = $2, next_step_date = COALESCE($3, next_step_date)
     WHERE id = $1
     RETURNING *`,
    [id, stage, nextStepDate ?? null]
  );
  return rows[0] ?? null;
}

export async function deleteApplication(id: number): Promise<boolean> {
  const { rowCount } = await pool.query(`DELETE FROM applications WHERE id = $1`, [id]);
  return (rowCount ?? 0) > 0;
}

export async function getStageCounts(): Promise<{ stage: Stage; count: number }[]> {
  const { rows } = await pool.query<{ stage: Stage; count: string }>(
    `SELECT stage, COUNT(*) AS count FROM applications GROUP BY stage`
  );
  return rows.map((r) => ({ stage: r.stage, count: Number(r.count) }));
}

export async function getTotalCount(): Promise<number> {
  const { rows } = await pool.query<{ count: string }>(`SELECT COUNT(*) AS count FROM applications`);
  return Number(rows[0].count);
}
