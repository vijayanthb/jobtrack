export const STAGES = [
  "applied",
  "phone_screen",
  "technical",
  "onsite",
  "offer",
  "rejected",
  "withdrawn",
] as const;

export type Stage = (typeof STAGES)[number];

export const STAGE_LABEL: Record<Stage, string> = {
  applied: "Applied",
  phone_screen: "Phone screen",
  technical: "Technical",
  onsite: "Onsite",
  offer: "Offer",
  rejected: "Rejected",
  withdrawn: "Withdrawn",
};

export interface Application {
  id: number;
  company: string;
  role: string;
  stage: Stage;
  applied_date: string;
  next_step_date: string | null;
  link: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface StatsResponse {
  counts: { stage: Stage; count: number }[];
  total: number;
}
