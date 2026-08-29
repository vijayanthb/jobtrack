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

export interface Application {
  id: number;
  company: string;
  role: string;
  stage: Stage;
  applied_date: string; // YYYY-MM-DD
  next_step_date: string | null;
  link: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface NewApplication {
  company: string;
  role: string;
  stage: Stage;
  applied_date: string;
  next_step_date?: string | null;
  link?: string | null;
  notes?: string | null;
}
