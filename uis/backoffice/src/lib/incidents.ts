export const INCIDENT_CATEGORIES = [
  "technical_failure",
  "process_error",
  "client_complaint",
  "candidate_issue",
  "staff_issue",
  "sla_breach",
  "data_quality",
  "other",
] as const;

export const INCIDENT_STATUSES = ["open", "in_progress", "resolved", "discarded"] as const;
export const INCIDENT_ORIGINS = ["customer", "branch", "internal"] as const;
export const INCIDENT_BRANCHES = ["central", "valencia_operations", "miami_office", "remote"] as const;

export type IncidentCategory = (typeof INCIDENT_CATEGORIES)[number];
export type IncidentStatus = (typeof INCIDENT_STATUSES)[number];
export type IncidentOrigin = (typeof INCIDENT_ORIGINS)[number];
export type IncidentBranch = (typeof INCIDENT_BRANCHES)[number];

export interface IncidentInput {
  title: string;
  description: string;
  category: IncidentCategory;
  origin: IncidentOrigin;
  branch: IncidentBranch;
}

export interface Incident extends IncidentInput {
  id: number;
  status: IncidentStatus;
  created_at: string;
  updated_at: string;
}

export interface IncidentSummary {
  total: number;
  by_status: Record<IncidentStatus, number>;
  by_category: Record<IncidentCategory, number>;
  by_origin: Record<IncidentOrigin, number>;
  by_branch: Record<IncidentBranch, number>;
}

export type IncidentFilters = Partial<Pick<Incident, "status" | "origin" | "branch">>;

export class IncidentApiError extends Error {
  constructor(message: string, public readonly fields: Partial<Record<keyof IncidentInput, string>> = {}) {
    super(message);
    this.name = "IncidentApiError";
  }
}

const fallbackMessage = "No se pudo completar la operación. Inténtalo de nuevo.";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`/api/incidents${path}`, {
      ...init,
      cache: "no-store",
      headers: { "Content-Type": "application/json", ...init?.headers },
    });
  } catch {
    throw new IncidentApiError("No se pudo conectar con el servicio de incidencias. Comprueba tu conexión e inténtalo de nuevo.");
  }

  let body: unknown;
  try {
    body = await response.json();
  } catch {
    body = undefined;
  }

  if (!response.ok) {
    const record = typeof body === "object" && body !== null ? body as Record<string, unknown> : {};
    const message = typeof record.detail === "string" && record.detail.trim() ? record.detail : fallbackMessage;
    const fields = typeof record.fields === "object" && record.fields !== null
      ? record.fields as Partial<Record<keyof IncidentInput, string>>
      : {};
    throw new IncidentApiError(message, fields);
  }

  return body as T;
}

export function listIncidents(filters: IncidentFilters = {}): Promise<Incident[]> {
  const query = new URLSearchParams();
  for (const key of ["status", "origin", "branch"] as const) {
    const value = filters[key];
    if (value) query.set(key, value);
  }
  return request(`${query.size ? `?${query.toString()}` : ""}`);
}

export function createIncident(input: IncidentInput): Promise<Incident> {
  return request("", { method: "POST", body: JSON.stringify(input) });
}

export function updateIncidentStatus(id: number, status: IncidentStatus): Promise<Incident> {
  return request(`/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
}

export function getIncidentSummary(): Promise<IncidentSummary> {
  return request("/summary");
}

export const incidentLabels = {
  category: {
    technical_failure: "Fallo técnico", process_error: "Error de proceso", client_complaint: "Queja de cliente",
    candidate_issue: "Problema de candidato", staff_issue: "Incidencia de personal", sla_breach: "Incumplimiento de SLA",
    data_quality: "Calidad de datos", other: "Otro",
  } satisfies Record<IncidentCategory, string>,
  status: { open: "Abierta", in_progress: "En curso", resolved: "Resuelta", discarded: "Descartada" } satisfies Record<IncidentStatus, string>,
  origin: { customer: "Cliente", branch: "Sede", internal: "Interno" } satisfies Record<IncidentOrigin, string>,
  branch: {
    central: "Central — Sede Valencia", valencia_operations: "Valencia — Operaciones",
    miami_office: "Miami Office", remote: "Remoto (empleado sin sede fija)",
  } satisfies Record<IncidentBranch, string>,
};

export function validNextStatuses(status: IncidentStatus): IncidentStatus[] {
  if (status === "open") return ["in_progress", "discarded"];
  if (status === "in_progress") return ["resolved", "discarded"];
  return [];
}