import {
  forwardAuthorizationHeader,
  fetchUpstream,
  getAuthApiBaseUrl,
  passthroughResponse,
} from "@/lib/backend-api";

export async function GET(request: Request) {
  const response = await fetchUpstream(`${getAuthApiBaseUrl()}/auth/me`, {
    method: "GET",
    headers: forwardAuthorizationHeader(request),
    cache: "no-store",
  });

  return passthroughResponse(response);
}
