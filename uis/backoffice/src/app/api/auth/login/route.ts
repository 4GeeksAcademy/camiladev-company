import {
  fetchUpstream,
  getAuthApiBaseUrl,
  invalidRequestBodyResponse,
  passthroughResponse,
} from "@/lib/backend-api";

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return invalidRequestBodyResponse();
  }

  if (!payload || typeof payload !== "object") {
    return invalidRequestBodyResponse();
  }

  const { email, password } = payload as { email?: unknown; password?: unknown };

  if (typeof email !== "string" || !email || typeof password !== "string" || !password) {
    return Response.json(
      { detail: "Email y contraseña son obligatorios" },
      { status: 400 },
    );
  }

  // El backend expone /auth/login como OAuth2 password flow (form-urlencoded).
  const form = new URLSearchParams({ username: email, password });

  const response = await fetchUpstream(`${getAuthApiBaseUrl()}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form.toString(),
    cache: "no-store",
  });

  return passthroughResponse(response);
}
