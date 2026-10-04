import {
  forwardAuthorizationHeader,
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

  const response = await fetchUpstream(`${getAuthApiBaseUrl()}/auth/change-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...forwardAuthorizationHeader(request),
    },
    body: payload,
    cache: "no-store",
  });

  return passthroughResponse(response);
}