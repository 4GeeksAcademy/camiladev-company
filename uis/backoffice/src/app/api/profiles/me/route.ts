import {
  forwardAuthorizationHeader,
  fetchUpstream,
  getAuthApiBaseUrl,
  invalidRequestBodyResponse,
  passthroughResponse,
  readRequestBody,
} from "@/lib/backend-api";

export async function GET(request: Request) {
  const response = await fetchUpstream(`${getAuthApiBaseUrl()}/profiles/me`, {
    method: "GET",
    headers: forwardAuthorizationHeader(request),
    cache: "no-store",
  });

  return passthroughResponse(response);
}

export async function PUT(request: Request) {
  const payload = await readRequestBody(request);
  if (payload === null) {
    return invalidRequestBodyResponse();
  }

  const response = await fetchUpstream(`${getAuthApiBaseUrl()}/profiles/me`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...forwardAuthorizationHeader(request),
    },
    body: payload,
    cache: "no-store",
  });

  return passthroughResponse(response);
}
