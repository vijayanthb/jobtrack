#!/usr/bin/env node
import { Command } from "commander";
import { addCommand } from "./commands/add.js";
import { listCommand } from "./commands/list.js";
import { updateCommand } from "./commands/update.js";
import { removeCommand } from "./commands/remove.js";
import { statsCommand } from "./commands/stats.js";
import { closePool } from "./db/pool.js";
import { STAGES } from "./types.js";

const program = new Command();

program
  .name("jobtrack")
  .description("Track job applications and interview stages from the command line.")
  .version("1.0.0");

program
  .command("add")
  .description("Add a new application")
  .requiredOption("-c, --company <name>", "Company name")
  .requiredOption("-r, --role <title>", "Role / job title")
  .option("-s, --stage <stage>", `Stage (${STAGES.join(", ")})`, "applied")
  .option("-d, --date <YYYY-MM-DD>", "Date applied (defaults to today)")
  .option("-n, --next <YYYY-MM-DD>", "Next step date")
  .option("-l, --link <url>", "Job posting / application link")
  .option("--notes <text>", "Free-form notes")
  .action(addCommand);

program
  .command("list")
  .description("List applications")
  .option("-s, --stage <stage>", `Filter by stage (${STAGES.join(", ")})`)
  .option("-c, --company <name>", "Filter by company (partial match)")
  .action(listCommand);

program
  .command("update <id>")
  .description("Update an application's stage")
  .requiredOption("-s, --stage <stage>", `New stage (${STAGES.join(", ")})`)
  .option("-n, --next <YYYY-MM-DD>", "Next step date")
  .action(updateCommand);

program
  .command("remove <id>")
  .description("Delete an application")
  .action(removeCommand);

program
  .command("stats")
  .description("Show funnel stats across all applications")
  .action(statsCommand);

async function main() {
  await program.parseAsync(process.argv);
  await closePool();
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
