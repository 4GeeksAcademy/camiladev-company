import { getBackendApiBaseUrl, passthroughResponse } from "@/lib/backend-api";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const backendUrl = new URL(`${getBackendApiBaseUrl()}/suppliers`);

  const country = searchParams.get("country");
  const category = searchParams.get("category");

  if (country) {
    backendUrl.searchParams.set("country", country);
  }

  if (category) {
    backendUrl.searchParams.set("category", category);
  }

  const response = await fetch(backendUrl.toString(), {
    method: "GET",
    cache: "no-store",
  });

  return passthroughResponse(response);
}

export async function POST(request: Request) {
  const payload = await request.text();

  const response = await fetch(`${getBackendApiBaseUrl()}/suppliers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: payload,
  });

  return passthroughResponse(response);
}
