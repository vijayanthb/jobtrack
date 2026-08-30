import type { Application, Stage, StatsResponse } from "./types";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch {
      // ignore
    }
    throw new Error(message);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export function fetchApplications(filters: { stage?: string; company?: string }): Promise<Application[]> {
  const params = new URLSearchParams();
  if (filters.stage) params.set("stage", filters.stage);
  if (filters.company) params.set("company", filters.company);
  const qs = params.toString();
  return request<Application[]>(`/applications${qs ? `?${qs}` : ""}`);
}

export function createApplication(input: {
  company: string;
  role: string;
  stage: Stage;
  applied_date: string;
  next_step_date?: string | null;
  link?: string | null;
  notes?: string | null;
}): Promise<Application> {
  return request<Application>("/applications", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateApplicationStage(
  id: number,
  stage: Stage,
  next_step_date?: string | null
): Promise<Application> {
  return request<Application>(`/applications/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ stage, next_step_date }),
  });
}

export function deleteApplication(id: number): Promise<void> {
  return request<void>(`/applications/${id}`, { method: "DELETE" });
}

export function fetchStats(): Promise<StatsResponse> {
  return request<StatsResponse>("/stats");
}
