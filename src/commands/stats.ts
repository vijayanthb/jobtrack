import chalk from "chalk";
import Table from "cli-table3";
import { getStageCounts, getTotalCount } from "../db/applications.js";
import { STAGES } from "../types.js";

export async function statsCommand(): Promise<void> {
  const total = await getTotalCount();
  if (total === 0) {
    console.log(chalk.gray("No applications yet."));
    return;
  }

  const counts = await getStageCounts();
  const countMap = new Map(counts.map((c) => [c.stage, c.count]));

  const table = new Table({ head: ["Stage", "Count", "% of Total"] });
  for (const stage of STAGES) {
    const count = countMap.get(stage) ?? 0;
    const pct = ((count / total) * 100).toFixed(1);
    table.push([stage, count, `${pct}%`]);
  }

  console.log(chalk.bold(`Total applications: ${total}\n`));
  console.log(table.toString());

  const activeStages = ["applied", "phone_screen", "technical", "onsite"] as const;
  const active = activeStages.reduce((sum, s) => sum + (countMap.get(s) ?? 0), 0);
  const offers = countMap.get("offer") ?? 0;
  const rejected = countMap.get("rejected") ?? 0;

  console.log(chalk.cyan(`\nActive pipeline: ${active}`));
  console.log(chalk.green(`Offers: ${offers}`));
  console.log(chalk.red(`Rejected: ${rejected}`));
}
