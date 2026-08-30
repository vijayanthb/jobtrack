import { useCallback, useEffect, useState } from "react";
import { FunnelRail } from "./components/FunnelRail";
import { ApplicationsTable } from "./components/ApplicationsTable";
import { AddApplicationModal } from "./components/AddApplicationModal";
import { UpdateStageModal } from "./components/UpdateStageModal";
import {
  createApplication,
  deleteApplication as apiDelete,
  fetchApplications,
  fetchStats,
  updateApplicationStage,
} from "./api";
import { STAGES, STAGE_LABEL, type Application, type Stage, type StatsResponse } from "./types";

export default function App() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [stageFilter, setStageFilter] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [editingApp, setEditingApp] = useState<Application | null>(null);

  const refresh = useCallback(async () => {
    try {
      const [apps, statsData] = await Promise.all([
        fetchApplications({ stage: stageFilter || undefined, company: companyFilter || undefined }),
        fetchStats(),
      ]);
      setApplications(apps);
      setStats(statsData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [stageFilter, companyFilter]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleAdd = async (input: {
    company: string;
    role: string;
    stage: Stage;
    applied_date: string;
    link?: string;
    notes?: string;
  }) => {
    await createApplication(input);
    setShowAdd(false);
    await refresh();
  };

  const handleUpdateStage = async (stage: Stage) => {
    if (!editingApp) return;
    await updateApplicationStage(editingApp.id, stage);
    setEditingApp(null);
    await refresh();
  };

  const handleDelete = async (app: Application) => {
    if (!confirm(`Delete ${app.company} — ${app.role}?`)) return;
    await apiDelete(app.id);
    await refresh();
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "1.75rem" }}>
        <div>
          <p className="mono" style={{ fontWeight: 600, fontSize: 20, margin: 0, color: "var(--text-primary)" }}>
            jobtrack
          </p>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: "4px 0 0" }}>
            Application pipeline
          </p>
        </div>
        <button className="primary" onClick={() => setShowAdd(true)}>
          + Add application
        </button>
      </div>

      <FunnelRail stats={stats} />

      <div style={{ display: "flex", gap: 8, marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Search company"
          value={companyFilter}
          onChange={(e) => setCompanyFilter(e.target.value)}
          style={{ flex: 1 }}
        />
        <select value={stageFilter} onChange={(e) => setStageFilter(e.target.value)} style={{ width: 180 }}>
          <option value="">All stages</option>
          {STAGES.map((s) => (
            <option key={s} value={s}>
              {STAGE_LABEL[s]}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <p style={{ color: "var(--danger-text)", fontSize: 14, marginBottom: 12 }}>
          {error} — is the API running (npm run server) and Postgres up?
        </p>
      )}

      {loading ? (
        <p style={{ color: "var(--text-muted)" }}>Loading...</p>
      ) : (
        <ApplicationsTable applications={applications} onUpdateStage={setEditingApp} onDelete={handleDelete} />
      )}

      {showAdd && <AddApplicationModal onSubmit={handleAdd} onClose={() => setShowAdd(false)} />}
      {editingApp && (
        <UpdateStageModal application={editingApp} onSubmit={handleUpdateStage} onClose={() => setEditingApp(null)} />
      )}
    </div>
  );
}
