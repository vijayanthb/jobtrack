# jobtrack

A small command-line tool for tracking job applications and interview stages,
backed by Postgres. Built to actually use during my own job search, not just
as a demo.

## Why

Spreadsheets get messy fast once you're tracking 10+ active applications
across different stages. `jobtrack` gives a fast CLI workflow for logging
applications, moving them through stages, and seeing funnel stats at a
glance — without leaving the terminal.

## Features

- `add` — log a new application (company, role, stage, dates, link, notes)
- `list` — view applications, filterable by stage or company
- `update` — move an application to a new stage
- `remove` — delete an application
- `stats` — see counts and percentages across the funnel (applied →
  phone_screen → technical → onsite → offer / rejected / withdrawn)

## Tech stack

- TypeScript / Node.js (ES modules)
- PostgreSQL (via `pg`)
- `commander` for the CLI interface
- `cli-table3` + `chalk` for terminal output
- Docker Compose for local Postgres

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Start Postgres locally
docker compose up -d

# 3. Configure environment
cp .env.example .env
# edit .env if you changed any Postgres defaults

# 4. Build and run migrations
npm run build
npm run migrate

# 5. You're ready
node dist/cli.js --help
```

Optionally link it as a global command:

```bash
npm link
jobtrack --help
```

## Usage

```bash
# Add an application
jobtrack add -c "Acme Corp" -r "Senior Backend Engineer" -s applied

# List everything currently active
jobtrack list

# Filter by stage
jobtrack list -s onsite

# Filter by company
jobtrack list -c acme

# Move an application forward
jobtrack update 3 -s phone_screen -n 2026-09-05

# See funnel stats
jobtrack stats

# Remove an application
jobtrack remove 3
```

## Schema

Single `applications` table: `id`, `company`, `role`, `stage`, `applied_date`,
`next_step_date`, `link`, `notes`, `created_at`, `updated_at` (auto-updated via
a Postgres trigger). See `src/db/schema.sql`.

## Project structure

```
src/
  cli.ts              entrypoint, wires commander to commands
  types.ts            shared types and the Stage enum
  commands/           one file per CLI command
  db/
    pool.ts           pg connection pool
    schema.sql         table definition + trigger
    migrate.ts         migration runner
    applications.ts    data access layer
```

## Possible next steps

- `jobtrack reminders` — surface applications with an upcoming `next_step_date`
- CSV export
- Interactive TUI mode
- Swap `pg` for an interface that also supports SQLite, for zero-setup trials

## License

MIT
