import { getBackendApiBaseUrl, passthroughResponse } from "@/lib/backend-api";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ supplierId: string }> },
) {
  const { supplierId } = await context.params;
  const payload = await request.text();

  const response = await fetch(`${getBackendApiBaseUrl()}/suppliers/${supplierId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: payload,
  });

  return passthroughResponse(response);
}
