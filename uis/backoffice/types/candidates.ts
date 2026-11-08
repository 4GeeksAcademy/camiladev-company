export const statuses = {
  received: "Recibida",
  in_progress: "En proceso",
  selected: "Seleccionada",
  discarded: "Descartada",
} as const;

export const stages = {
  pending: "Pendiente de revisión",
  review: "En revisión",
  personal_interview: "Entrevista personal",
  technical_interview: "Entrevista técnica",
  offer_presented: "Oferta presentada",
} as const;

export type Status = keyof typeof statuses;
export type Stage = keyof typeof stages;

export interface CandidateInput {
  full_name: string;
  email: string;
  phone: string;
  position: string;
  linkedin_url: string | null;
  cv_url: string | null;
  experience_years: number;
}

export interface Candidate extends CandidateInput {
  id: string;
  status: Status;
  stage: Stage;
  notes_count: number;
  applied_at: string;
  updated_at: string;
}

export interface Note {
  id: string;
  record_id: string;
  content: string;
  created_at: string;
}

export interface RecordsResponse {
  total: number;
  page: number;
  limit: number;
  data: Candidate[];
}

export interface NotesResponse {
  data: Note[];
  meta: Record<string, unknown>;
}

export type LoadState<T> =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; data: T };