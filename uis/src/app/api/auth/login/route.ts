import { getAuthApiBaseUrl, passthroughResponse } from "@/lib/backend-api";

export async function POST(request: Request) {
  const { email, password } = (await request.json()) as {
    email?: string;
    password?: string;
  };

  if (!email || !password) {
    return Response.json(
      { detail: "Email y contraseña son obligatorios" },
      { status: 400 },
    );
  }

  // El backend expone /auth/login como OAuth2 password flow (form-urlencoded).
  const form = new URLSearchParams({ username: email, password });

  const response = await fetch(`${getAuthApiBaseUrl()}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form.toString(),
    cache: "no-store",
  });

  return passthroughResponse(response);
}
