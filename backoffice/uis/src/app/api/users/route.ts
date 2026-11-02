import {
  fetchUpstream,
  getAuthApiBaseUrl,
  invalidRequestBodyResponse,
  passthroughResponse,
  readRequestBody,
} from "@/lib/backend-api";

export async function POST(request: Request) {
  const payload = await readRequestBody(request);
  if (payload === null) {
    return invalidRequestBodyResponse();
  }

  const response = await fetchUpstream(`${getAuthApiBaseUrl()}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
    cache: "no-store",
  });

  return passthroughResponse(response);
}
