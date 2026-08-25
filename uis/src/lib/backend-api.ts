export function getBackendApiBaseUrl(): string {
  return (
    process.env.SUPPLIERS_API_BASE_URL ??
    process.env.NEXT_PUBLIC_SUPPLIERS_API_BASE_URL ??
    "http://127.0.0.1:8000"
  );
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
