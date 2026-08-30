import React, { useCallback, useEffect, useState } from "react";
import { Box, Text, useApp, useInput } from "ink";
import { ApplicationsTable } from "./ApplicationsTable.js";
import { AddForm } from "./AddForm.js";
import { UpdateStageForm } from "./UpdateStageForm.js";
import { StatsView } from "./StatsView.js";
import {
  deleteApplication,
  getStageCounts,
  getTotalCount,
  insertApplication,
  listApplications,
  updateStage,
} from "../db/applications.js";
import type { Application, NewApplication, Stage } from "../types.js";

type View = "list" | "add" | "update" | "stats" | "confirmDelete";

export function App() {
  const { exit } = useApp();
  const [view, setView] = useState<View>("list");
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [statsCounts, setStatsCounts] = useState<{ stage: string; count: number }[]>([]);
  const [statsTotal, setStatsTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const apps = await listApplications({});
      setApplications(apps);
      setSelectedIndex((prev) => Math.min(prev, Math.max(apps.length - 1, 0)));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useInput((input, key) => {
    if (view !== "list") return;

    if (input === "q") {
      exit();
      return;
    }
    if (key.upArrow) {
      setSelectedIndex((i) => Math.max(0, i - 1));
      return;
    }
    if (key.downArrow) {
      setSelectedIndex((i) => Math.min(applications.length - 1, i + 1));
      return;
    }
    if (input === "a") {
      setView("add");
      return;
    }
    if (input === "u" && applications[selectedIndex]) {
      setView("update");
      return;
    }
    if (input === "d" && applications[selectedIndex]) {
      setView("confirmDelete");
      return;
    }
    if (input === "s") {
      getStageCounts().then(setStatsCounts);
      getTotalCount().then(setStatsTotal);
      setView("stats");
      return;
    }
    if (input === "r") {
      setLoading(true);
      refresh();
      return;
    }
  });

  useInput((input, key) => {
    if (view === "stats" && (input === "q" || key.escape)) {
      setView("list");
    }
    if (view === "confirmDelete") {
      if (input === "y") {
        const app = applications[selectedIndex];
        deleteApplication(app.id).then(() => {
          setView("list");
          refresh();
        });
      } else if (input === "n" || key.escape) {
        setView("list");
      }
    }
  });

  const handleAdd = async (app: NewApplication) => {
    await insertApplication(app);
    setView("list");
    await refresh();
  };

  const handleUpdate = async (stage: Stage) => {
    const app = applications[selectedIndex];
    await updateStage(app.id, stage);
    setView("list");
    await refresh();
  };

  if (loading) {
    return (
      <Box padding={1}>
        <Text color="gray">Loading…</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box flexDirection="column" padding={1}>
        <Text color="red">Error: {error}</Text>
        <Text color="gray">Check that Postgres is running and .env is configured (docker compose up -d).</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" padding={1}>
      <Text bold color="cyanBright">
        jobtrack
      </Text>

      {view === "list" && (
        <>
          <ApplicationsTable applications={applications} selectedIndex={selectedIndex} />
          <Box marginTop={1}>
            <Text color="gray">
              ↑/↓ select · a add · u update stage · d delete · s stats · r refresh · q quit
            </Text>
          </Box>
        </>
      )}

      {view === "add" && <AddForm onSubmit={handleAdd} onCancel={() => setView("list")} />}

      {view === "update" && applications[selectedIndex] && (
        <UpdateStageForm
          application={applications[selectedIndex]}
          onSubmit={handleUpdate}
          onCancel={() => setView("list")}
        />
      )}

      {view === "confirmDelete" && applications[selectedIndex] && (
        <Box flexDirection="column">
          <Text color="red">
            Delete #{applications[selectedIndex].id} {applications[selectedIndex].company} —{" "}
            {applications[selectedIndex].role}? (y/n)
          </Text>
        </Box>
      )}

      {view === "stats" && (
        <>
          <StatsView counts={statsCounts} total={statsTotal} />
          <Box marginTop={1}>
            <Text color="gray">q or Esc to go back</Text>
          </Box>
        </>
      )}
    </Box>
  );
}
