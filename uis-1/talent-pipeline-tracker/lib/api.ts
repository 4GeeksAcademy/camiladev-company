import type { Candidate, CandidateInput, Note, NotesResponse, RecordsResponse, Stage, Status } from "@/types/candidates";

export class ApiError extends Error {}

export function errorMessage(error: unknown): string {
  return error instanceof ApiError
    ? error.message
    : "No se pudo conectar con el servicio. Comprueba tu conexión e inténtalo de nuevo.";
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");
  if (!base) throw new ApiError("El servicio no está configurado. Contacta con el equipo técnico.");
  const response = await fetch(`${base}${path}`, {
    ...options,
    cache: "no-store",
    signal: options.signal ? AbortSignal.any([options.signal, AbortSignal.timeout(15000)]) : AbortSignal.timeout(15000),
    headers: { "Content-Type": "application/json", ...options.headers },
  });
  if (!response.ok) {
    const messages: Record<number, string> = {
      401: "No tienes autorización para realizar esta operación.",
      403: "No tienes permiso para realizar esta operación.",
      404: "La candidatura o nota ya no está disponible.",
      409: "Ya existe una candidatura con estos datos.",
      422: "Revisa los campos del formulario. El servicio no pudo validarlos.",
      429: "Hay demasiadas peticiones. Inténtalo de nuevo en unos instantes.",
    };
    throw new ApiError(messages[response.status] ?? "El servicio no pudo completar la operación. Inténtalo de nuevo.");
  }
  if (response.status === 204) return undefined as T;
  return await response.json() as T;
}

const recordPath = (id: string) => `/records/${encodeURIComponent(id)}`;

export const api = {
  async list(signal?: AbortSignal): Promise<Candidate[]> {
    const records: Candidate[] = [];
    let page = 1;
    while (true) {
      const response = await request<RecordsResponse>(`/records?page=${page}`, { signal });
      records.push(...response.data);
      if (records.length >= response.total) return records;
      if (response.data.length === 0) throw new ApiError("El listado está incompleto. Vuelve a intentarlo.");
      page += 1;
    }
  },
  async get(id: string, signal?: AbortSignal): Promise<Candidate> {
    return await request<Candidate>(recordPath(id), { signal });
  },
  async create(input: CandidateInput): Promise<Candidate> {
    return await request<Candidate>("/records", { method: "POST", body: JSON.stringify(input) });
  },
  async update(id: string, input: CandidateInput): Promise<Candidate> {
    return await request<Candidate>(recordPath(id), { method: "PUT", body: JSON.stringify(input) });
  },
  async patch(id: string, input: { status?: Status; stage?: Stage }): Promise<Candidate> {
    return await request<Candidate>(recordPath(id), { method: "PATCH", body: JSON.stringify(input) });
  },
  async notes(id: string, signal?: AbortSignal): Promise<Note[]> {
    const response = await request<NotesResponse>(`${recordPath(id)}/notes`, { signal });
    return response.data;
  },
  async addNote(id: string, content: string): Promise<void> {
    await request<unknown>(`${recordPath(id)}/notes`, { method: "POST", body: JSON.stringify({ content }) });
  },
  async deleteNote(id: string, noteId: string): Promise<void> {
    await request<void>(`${recordPath(id)}/notes/${encodeURIComponent(noteId)}`, { method: "DELETE" });
  },
};