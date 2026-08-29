import chalk from "chalk";
import { deleteApplication } from "../db/applications.js";

export async function removeCommand(id: string): Promise<void> {
  const deleted = await deleteApplication(Number(id));
  if (!deleted) {
    console.error(chalk.red(`No application found with id ${id}`));
    process.exitCode = 1;
    return;
  }
  console.log(chalk.green(`Removed application #${id}`));
}
