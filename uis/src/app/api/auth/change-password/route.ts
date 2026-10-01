import {
  forwardAuthorizationHeader,
  getAuthApiBaseUrl,
  passthroughResponse,
} from "@/lib/backend-api";

export async function POST(request: Request) {
  const payload = await request.text();

  const response = await fetch(`${getAuthApiBaseUrl()}/auth/change-password`, {
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