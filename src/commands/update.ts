import chalk from "chalk";
import { updateStage } from "../db/applications.js";
import { STAGES } from "../types.js";
import { isValidStage } from "../validate.js";

interface UpdateOptions {
  stage: string;
  next?: string;
}

export async function updateCommand(id: string, opts: UpdateOptions): Promise<void> {
  const stage = opts.stage;
  if (!isValidStage(stage)) {
    console.error(chalk.red(`Invalid stage "${stage}". Must be one of: ${STAGES.join(", ")}`));
    process.exitCode = 1;
    return;
  }

  const updated = await updateStage(Number(id), stage, opts.next);
  if (!updated) {
    console.error(chalk.red(`No application found with id ${id}`));
    process.exitCode = 1;
    return;
  }

  console.log(chalk.green(`#${updated.id} ${updated.company} — ${updated.role} moved to [${updated.stage}]`));
}
