import { getAuthApiBaseUrl, passthroughResponse } from "@/lib/backend-api";

export async function POST(request: Request) {
  const payload = await request.text();

  const response = await fetch(`${getAuthApiBaseUrl()}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
    cache: "no-store",
  });

  return passthroughResponse(response);
}
