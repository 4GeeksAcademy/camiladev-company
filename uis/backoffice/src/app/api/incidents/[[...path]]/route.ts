import { getBackendApiBaseUrl, fetchUpstream, readRequestBody } from "@/lib/backend-api";

type Context = { params: Promise<{ path?: string[] }> };
const FIELD_MESSAGES: Record<string, string> = {
  title: "Escribe un título para la incidencia.",
  description: "Añade una descripción de la incidencia.",
  category: "Selecciona una categoría válida.",
  origin: "Selecciona un origen válido.",
  branch: "Selecciona una sede válida.",
  status: "No se pudo aplicar ese cambio de estado.",
};

function publicMessage(status: number): string {
  if (status === 400 || status === 422) return "Revisa los datos y los campos indicados e inténtalo de nuevo.";
  if (status === 401) return "Tu sesión no permite realizar esta acción.";
  if (status === 403) return "No tienes permiso para realizar esta acción.";
  if (status === 404) return "No se encontró la incidencia solicitada.";
  if (status === 429) return "Hay demasiadas solicitudes. Espera un momento e inténtalo de nuevo.";
  return "No se pudo completar la solicitud. Inténtalo de nuevo más tarde.";
}

async function forward(request: Request, context: Context) {
  const { path = [] } = await context.params;
  const endpoint = path.join("/");
  const allowed = request.method === "GET"
    ? endpoint === "" || endpoint === "summary" || /^[1-9]\d*\/?status$/.test(endpoint)
    : request.method === "POST" ? endpoint === ""
      : request.method === "PATCH" && /^[1-9]\d*\/status$/.test(endpoint);
  if (!allowed) return Response.json({ detail: "Ruta de incidencias no disponible." }, { status: 404 });

  const baseUrl = (process.env.INCIDENTS_API_BASE_URL ?? getBackendApiBaseUrl()).replace(/\/+$/, "");
  const target = new URL(`${baseUrl}/api/incidents${endpoint ? `/${endpoint}` : ""}`);
  new URL(request.url).searchParams.forEach((value, key) => target.searchParams.set(key, value));

  let body: string | null = null;
  if (request.method === "POST" || request.method === "PATCH") {
    body = await readRequestBody(request);
    if (body === null) return Response.json({ detail: "No se pudo leer el formulario. Comprueba los datos e inténtalo de nuevo." }, { status: 400 });
  }

  const upstream = await fetchUpstream(target, {
    method: request.method,
    cache: "no-store",
    ...(body !== null ? { body, headers: { "Content-Type": "application/json" } } : {}),
    signal: AbortSignal.timeout(15_000),
  });

  let text: string;
  try { text = await upstream.text(); } catch {
    return Response.json({ detail: "No se pudo leer la respuesta del servicio. Inténtalo de nuevo." }, { status: 502 });
  }
  if (!upstream.ok) {
    let upstreamBody: unknown;
    try { upstreamBody = JSON.parse(text); } catch { upstreamBody = undefined; }
    const details = typeof upstreamBody === "object" && upstreamBody !== null
      ? (upstreamBody as { detail?: unknown }).detail : undefined;
    const fieldIssues: Partial<Record<string, string>> = {};
    if (Array.isArray(details)) {
      for (const issue of details) {
        if (typeof issue !== "object" || issue === null) continue;
        const loc = (issue as { loc?: unknown }).loc;
        if (Array.isArray(loc)) {
          const field = loc.find((part) => typeof part === "string" && part in FIELD_MESSAGES);
          if (typeof field === "string") fieldIssues[field] = FIELD_MESSAGES[field];
        }
      }
    }
    if (endpoint.endsWith("/status") && upstream.status === 400) fieldIssues.status = FIELD_MESSAGES.status;
    return Response.json({ detail: publicMessage(upstream.status), ...(Object.keys(fieldIssues).length ? { fields: fieldIssues } : {}) }, { status: upstream.status });
  }

  return new Response(text, {
    status: upstream.status,
    headers: { "Content-Type": upstream.headers.get("content-type") ?? "application/json", "Cache-Control": "no-store" },
  });
}

export const GET = forward;
export const POST = forward;
export const PATCH = forward;