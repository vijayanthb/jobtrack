import Table from "cli-table3";
import chalk from "chalk";
import { listApplications } from "../db/applications.js";
import { STAGES, type Stage } from "../types.js";
import { isValidStage } from "../validate.js";

interface ListOptions {
  stage?: string;
  company?: string;
}

const STAGE_COLORS: Record<Stage, (s: string) => string> = {
  applied: chalk.gray,
  phone_screen: chalk.cyan,
  technical: chalk.blue,
  onsite: chalk.magenta,
  offer: chalk.green,
  rejected: chalk.red,
  withdrawn: chalk.yellow,
};

export async function listCommand(opts: ListOptions): Promise<void> {
  if (opts.stage && !isValidStage(opts.stage)) {
    console.error(chalk.red(`Invalid stage "${opts.stage}". Must be one of: ${STAGES.join(", ")}`));
    process.exitCode = 1;
    return;
  }

  const apps = await listApplications({
    stage: opts.stage as Stage | undefined,
    company: opts.company,
  });

  if (apps.length === 0) {
    console.log(chalk.gray("No applications found."));
    return;
  }

  const table = new Table({
    head: ["ID", "Company", "Role", "Stage", "Applied", "Next Step"],
  });

  for (const app of apps) {
    const colorize = STAGE_COLORS[app.stage] ?? ((s: string) => s);
    table.push([
      app.id,
      app.company,
      app.role,
      colorize(app.stage),
      app.applied_date,
      app.next_step_date ?? "-",
    ]);
  }

  console.log(table.toString());
}
