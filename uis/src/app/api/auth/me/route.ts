import {
  forwardAuthorizationHeader,
  getAuthApiBaseUrl,
  passthroughResponse,
} from "@/lib/backend-api";

export async function GET(request: Request) {
  const response = await fetch(`${getAuthApiBaseUrl()}/auth/me`, {
    method: "GET",
    headers: forwardAuthorizationHeader(request),
    cache: "no-store",
  });

  return passthroughResponse(response);
}
