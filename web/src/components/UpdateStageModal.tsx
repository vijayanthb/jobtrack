import { useState } from "react";
import { STAGES, STAGE_LABEL, type Application, type Stage } from "../types";

interface Props {
  application: Application;
  onSubmit: (stage: Stage) => Promise<void>;
  onClose: () => void;
}

export function UpdateStageModal({ application, onSubmit, onClose }: Props) {
  const [stage, setStage] = useState<Stage>(application.stage);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(stage);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10,
      }}
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 12,
          padding: "1.5rem",
          width: 340,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <p style={{ fontWeight: 500, fontSize: 16, margin: 0 }}>
          {application.company} — {application.role}
        </p>

        <label style={{ fontSize: 13, color: "var(--text-secondary)" }}>
          New stage
          <select value={stage} onChange={(e) => setStage(e.target.value as Stage)} style={{ width: "100%", marginTop: 4 }} autoFocus>
            {STAGES.map((s) => (
              <option key={s} value={s}>
                {STAGE_LABEL[s]}
              </option>
            ))}
          </select>
        </label>

        {error && <p style={{ color: "var(--danger-text)", fontSize: 13, margin: 0 }}>{error}</p>}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 }}>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="primary" disabled={submitting}>
            {submitting ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
