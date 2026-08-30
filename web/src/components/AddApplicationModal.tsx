import { useState } from "react";
import { STAGES, STAGE_LABEL, type Stage } from "../types";

interface Props {
  onSubmit: (input: {
    company: string;
    role: string;
    stage: Stage;
    applied_date: string;
    link?: string;
    notes?: string;
  }) => Promise<void>;
  onClose: () => void;
}

export function AddApplicationModal({ onSubmit, onClose }: Props) {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [stage, setStage] = useState<Stage>("applied");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [link, setLink] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim()) {
      setError("Company is required");
      return;
    }
    if (!role.trim()) {
      setError("Role is required");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await onSubmit({ company: company.trim(), role: role.trim(), stage, applied_date: date, link, notes });
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
          width: 380,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <p style={{ fontWeight: 500, fontSize: 16, margin: 0 }}>Add application</p>

        <label style={{ fontSize: 13, color: "var(--text-secondary)" }}>
          Company
          <input value={company} onChange={(e) => setCompany(e.target.value)} style={{ width: "100%", marginTop: 4 }} autoFocus />
        </label>

        <label style={{ fontSize: 13, color: "var(--text-secondary)" }}>
          Role
          <input value={role} onChange={(e) => setRole(e.target.value)} style={{ width: "100%", marginTop: 4 }} />
        </label>

        <label style={{ fontSize: 13, color: "var(--text-secondary)" }}>
          Stage
          <select value={stage} onChange={(e) => setStage(e.target.value as Stage)} style={{ width: "100%", marginTop: 4 }}>
            {STAGES.map((s) => (
              <option key={s} value={s}>
                {STAGE_LABEL[s]}
              </option>
            ))}
          </select>
        </label>

        <label style={{ fontSize: 13, color: "var(--text-secondary)" }}>
          Applied date
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={{ width: "100%", marginTop: 4 }} />
        </label>

        <label style={{ fontSize: 13, color: "var(--text-secondary)" }}>
          Link (optional)
          <input value={link} onChange={(e) => setLink(e.target.value)} style={{ width: "100%", marginTop: 4 }} placeholder="https://..." />
        </label>

        <label style={{ fontSize: 13, color: "var(--text-secondary)" }}>
          Notes (optional)
          <input value={notes} onChange={(e) => setNotes(e.target.value)} style={{ width: "100%", marginTop: 4 }} />
        </label>

        {error && <p style={{ color: "var(--danger-text)", fontSize: 13, margin: 0 }}>{error}</p>}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 }}>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="primary" disabled={submitting}>
            {submitting ? "Adding..." : "Add"}
          </button>
        </div>
      </form>
    </div>
  );
}
