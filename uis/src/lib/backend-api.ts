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

export async function passthroughResponse(response: Response): Promise<Response> {
  const body = await response.text();
  const contentType = response.headers.get("content-type") ?? "application/json";

  return new Response(body, {
    status: response.status,
    headers: {
      "content-type": contentType,
    },
  });
}
