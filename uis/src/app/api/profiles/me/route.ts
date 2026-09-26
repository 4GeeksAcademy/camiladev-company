import {
  forwardAuthorizationHeader,
  getAuthApiBaseUrl,
  passthroughResponse,
} from "@/lib/backend-api";

export async function GET(request: Request) {
  const response = await fetch(`${getAuthApiBaseUrl()}/profiles/me`, {
    method: "GET",
    headers: forwardAuthorizationHeader(request),
    cache: "no-store",
  });

  return passthroughResponse(response);
}

export async function PUT(request: Request) {
  const payload = await request.text();

  const response = await fetch(`${getAuthApiBaseUrl()}/profiles/me`, {
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
