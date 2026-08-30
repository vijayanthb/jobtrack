import express from "express";
import cors from "cors";
import "dotenv/config";
import {
  deleteApplication,
  getStageCounts,
  getTotalCount,
  insertApplication,
  listApplications,
  updateStage,
} from "../db/applications.js";
import { isValidStage } from "../validate.js";
import type { Stage } from "../types.js";

const app = express();
const PORT = Number(process.env.PORT ?? 4000);

app.use(cors());
app.use(express.json());

// GET /api/applications?stage=&company=
app.get("/api/applications", async (req, res) => {
  try {
    const stage = typeof req.query.stage === "string" ? req.query.stage : undefined;
    const company = typeof req.query.company === "string" ? req.query.company : undefined;

    if (stage && !isValidStage(stage)) {
      res.status(400).json({ error: `Invalid stage "${stage}"` });
      return;
    }

    const apps = await listApplications({ stage: stage as Stage | undefined, company });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
  }
});

// POST /api/applications
app.post("/api/applications", async (req, res) => {
  try {
    const { company, role, stage, applied_date, next_step_date, link, notes } = req.body ?? {};

    if (!company || typeof company !== "string") {
      res.status(400).json({ error: "company is required" });
      return;
    }
    if (!role || typeof role !== "string") {
      res.status(400).json({ error: "role is required" });
      return;
    }
    const finalStage = stage ?? "applied";
    if (!isValidStage(finalStage)) {
      res.status(400).json({ error: `Invalid stage "${finalStage}"` });
      return;
    }
    const finalDate = applied_date || new Date().toISOString().slice(0, 10);

    const app_ = await insertApplication({
      company,
      role,
      stage: finalStage,
      applied_date: finalDate,
      next_step_date: next_step_date ?? null,
      link: link ?? null,
      notes: notes ?? null,
    });
    res.status(201).json(app_);
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
  }
});

// PATCH /api/applications/:id
app.patch("/api/applications/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }
    const { stage, next_step_date } = req.body ?? {};
    if (!stage || !isValidStage(stage)) {
      res.status(400).json({ error: `Invalid stage "${stage}"` });
      return;
    }

    const updated = await updateStage(id, stage, next_step_date ?? null);
    if (!updated) {
      res.status(404).json({ error: `No application with id ${id}` });
      return;
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
  }
});

// DELETE /api/applications/:id
app.delete("/api/applications/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }
    const deleted = await deleteApplication(id);
    if (!deleted) {
      res.status(404).json({ error: `No application with id ${id}` });
      return;
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
  }
});

// GET /api/stats
app.get("/api/stats", async (_req, res) => {
  try {
    const [counts, total] = await Promise.all([getStageCounts(), getTotalCount()]);
    res.json({ counts, total });
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
  }
});

app.listen(PORT, () => {
  console.log(`jobtrack API listening on http://localhost:${PORT}`);
});
