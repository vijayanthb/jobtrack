import { STAGE_LABEL, type Application, type Stage } from "../types";

const STAGE_COLOR: Record<Stage, string> = {
  applied: "var(--stage-applied)",
  phone_screen: "var(--stage-inprogress)",
  technical: "var(--stage-inprogress)",
  onsite: "var(--stage-onsite)",
  offer: "var(--stage-offer)",
  rejected: "var(--stage-rejected)",
  withdrawn: "var(--stage-withdrawn)",
};

interface Props {
  applications: Application[];
  onUpdateStage: (app: Application) => void;
  onDelete: (app: Application) => void;
}

export function ApplicationsTable({ applications, onUpdateStage, onDelete }: Props) {
  if (applications.length === 0) {
    return (
      <div
        style={{
          padding: "2.5rem",
          textAlign: "center",
          color: "var(--text-muted)",
          border: "1px dashed var(--border)",
          borderRadius: "var(--radius)",
          fontSize: 13,
        }}
      >
        Nothing here yet — add an application to start tracking it.
      </div>
    );
  }

  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        overflow: "hidden",
      }}
    >
      <table>
        <thead>
          <tr>
            <th>Company</th>
            <th>Role</th>
            <th>Stage</th>
            <th>Applied</th>
            <th>Next step</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app.id}>
              <td style={{ fontWeight: 500 }}>{app.company}</td>
              <td style={{ color: "var(--text-secondary)" }}>{app.role}</td>
              <td>
                <span style={{ color: "var(--text-secondary)", fontSize: 13 }}>
                  <span className="stage-dot" style={{ background: STAGE_COLOR[app.stage] }} />
                  {STAGE_LABEL[app.stage]}
                </span>
              </td>
              <td className="mono" style={{ color: "var(--text-secondary)" }}>
                {app.applied_date}
              </td>
              <td className="mono" style={{ color: app.next_step_date ? "var(--text-primary)" : "var(--text-muted)" }}>
                {app.next_step_date ?? "—"}
              </td>
              <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                <button className="quiet" onClick={() => onUpdateStage(app)}>
                  Update
                </button>
                <button className="quiet" onClick={() => onDelete(app)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
