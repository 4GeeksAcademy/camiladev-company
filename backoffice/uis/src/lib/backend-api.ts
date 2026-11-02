export function getBackendApiBaseUrl(): string {
  return (
    process.env.SUPPLIERS_API_BASE_URL ??
    process.env.NEXT_PUBLIC_SUPPLIERS_API_BASE_URL ??
    "http://127.0.0.1:8000"
  );
}

export function getAuthApiBaseUrl(): string {
  return (
    process.env.AUTH_API_BASE_URL ??
    process.env.NEXT_PUBLIC_AUTH_API_BASE_URL ??
    "http://127.0.0.1:8000"
  );
}

// El proxy nunca inventa credenciales: solo reenvía el Bearer que manda el cliente.
export function forwardAuthorizationHeader(request: Request): HeadersInit {
  const authorization = request.headers.get("authorization");
  return authorization ? { Authorization: authorization } : {};
}

export async function fetchUpstream(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  try {
    return await fetch(input, init);
  } catch {
    return Response.json(
      { detail: "El servicio no está disponible. Inténtalo de nuevo más tarde." },
      { status: 502 },
    );
  }
}

export async function readRequestBody(request: Request): Promise<string | null> {
  try {
    return await request.text();
  } catch {
    return null;
  }
}

export function invalidRequestBodyResponse(): Response {
  return Response.json(
    { detail: "No se pudo leer la solicitud. Comprueba los datos e inténtalo de nuevo." },
    { status: 400 },
  );
}

function publicErrorMessage(status: number): string {
  if (status === 400 || status === 422) {
    return "No se pudo validar la solicitud. Comprueba los datos e inténtalo de nuevo.";
  }

  if (status === 401) {
    return "No se pudieron validar las credenciales o la sesión. Comprueba tus datos e inténtalo de nuevo.";
  }

  if (status === 403) {
    return "No tienes permiso para realizar esta acción.";
  }

  if (status === 404) {
    return "No se encontró el recurso solicitado.";
  }

  if (status === 409) {
    return "La solicitud entra en conflicto con los datos actuales.";
  }

  if (status === 429) {
    return "Hay demasiadas solicitudes. Espera un momento e inténtalo de nuevo.";
  }

  return "No se pudo completar la solicitud. Inténtalo de nuevo más tarde.";
}

export async function passthroughResponse(response: Response): Promise<Response> {
  let body: string;

  try {
    body = await response.text();
  } catch {
    return Response.json(
      { detail: "No se pudo leer la respuesta del servicio. Inténtalo de nuevo." },
      { status: 502 },
    );
  }

  if (!response.ok) {
    return Response.json(
      { detail: publicErrorMessage(response.status) },
      { status: response.status },
    );
  }

  const contentType = response.headers.get("content-type") ?? "application/json";

  return new Response(body, {
    status: response.status,
    headers: {
      "content-type": contentType,
    },
  });
}
