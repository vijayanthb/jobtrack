import chalk from "chalk";
import { insertApplication } from "../db/applications.js";
import { STAGES } from "../types.js";
import { isValidStage } from "../validate.js";

interface AddOptions {
  company: string;
  role: string;
  stage?: string;
  date?: string;
  next?: string;
  link?: string;
  notes?: string;
}

export async function addCommand(opts: AddOptions): Promise<void> {
  const stage = opts.stage ?? "applied";
  if (!isValidStage(stage)) {
    console.error(chalk.red(`Invalid stage "${stage}". Must be one of: ${STAGES.join(", ")}`));
    process.exitCode = 1;
    return;
  }

  const applied_date = opts.date ?? new Date().toISOString().slice(0, 10);

  const app = await insertApplication({
    company: opts.company,
    role: opts.role,
    stage,
    applied_date,
    next_step_date: opts.next ?? null,
    link: opts.link ?? null,
    notes: opts.notes ?? null,
  });

  console.log(chalk.green(`Added #${app.id}: ${app.company} — ${app.role} [${app.stage}]`));
}
