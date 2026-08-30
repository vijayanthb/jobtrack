import { STAGE_LABEL, type Stage, type StatsResponse } from "../types";

// The forward-moving pipeline, in order. Rejected/withdrawn are exits from
// this flow, not steps in it, so they render separately below.
const PIPELINE: Stage[] = ["applied", "phone_screen", "technical", "onsite", "offer"];

const STAGE_COLOR: Record<Stage, string> = {
  applied: "var(--stage-applied)",
  phone_screen: "var(--stage-inprogress)",
  technical: "var(--stage-inprogress)",
  onsite: "var(--stage-onsite)",
  offer: "var(--stage-offer)",
  rejected: "var(--stage-rejected)",
  withdrawn: "var(--stage-withdrawn)",
};

export function FunnelRail({ stats }: { stats: StatsResponse | null }) {
  if (!stats) return null;

  const countMap = new Map(stats.counts.map((c) => [c.stage, c.count]));
  const rejected = countMap.get("rejected") ?? 0;
  const withdrawn = countMap.get("withdrawn") ?? 0;
  const maxCount = Math.max(1, ...PIPELINE.map((s) => countMap.get(s) ?? 0));

  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        padding: "1.25rem 1.5rem",
        marginBottom: "1.5rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 16 }}>
        <p style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-muted)", margin: 0 }}>
          Pipeline
        </p>
        <p className="mono" style={{ fontSize: 12, color: "var(--text-secondary)", margin: 0 }}>
          {stats.total} total
        </p>
      </div>

      <div style={{ display: "flex", alignItems: "flex-end", gap: 6 }}>
        {PIPELINE.map((stage) => {
          const count = countMap.get(stage) ?? 0;
          const heightPct = Math.max(8, (count / maxCount) * 100);
          return (
            <div key={stage} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <p className="mono" style={{ fontSize: 15, fontWeight: 500, margin: 0, color: "var(--text-primary)" }}>
                {count}
              </p>
              <div
                style={{
                  width: "100%",
                  height: 40,
                  display: "flex",
                  alignItems: "flex-end",
                  background: "var(--surface-raised)",
                  borderRadius: 4,
                  overflow: "hidden",
                }}
              >
                <div style={{ width: "100%", height: `${heightPct}%`, background: STAGE_COLOR[stage] }} />
              </div>
              <p style={{ fontSize: 11, color: "var(--text-secondary)", margin: 0, textAlign: "center" }}>
                {STAGE_LABEL[stage]}
              </p>
            </div>
          );
        })}
      </div>

      {(rejected > 0 || withdrawn > 0) && (
        <div
          style={{
            display: "flex",
            gap: 16,
            marginTop: 16,
            paddingTop: 14,
            borderTop: "1px solid var(--border-soft)",
          }}
        >
          <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0 }}>Exited:</p>
          {rejected > 0 && (
            <p style={{ fontSize: 12, margin: 0, color: "var(--text-secondary)" }}>
              <span className="stage-dot" style={{ background: "var(--stage-rejected)" }} />
              <span className="mono">{rejected}</span> rejected
            </p>
          )}
          {withdrawn > 0 && (
            <p style={{ fontSize: 12, margin: 0, color: "var(--text-secondary)" }}>
              <span className="stage-dot" style={{ background: "var(--stage-withdrawn)" }} />
              <span className="mono">{withdrawn}</span> withdrawn
            </p>
          )}
        </div>
      )}
    </div>
  );
}
