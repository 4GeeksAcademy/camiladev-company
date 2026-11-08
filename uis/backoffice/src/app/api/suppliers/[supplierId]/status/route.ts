import {
  fetchUpstream,
  getBackendApiBaseUrl,
  invalidRequestBodyResponse,
  passthroughResponse,
  readRequestBody,
} from "@/lib/backend-api";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ supplierId: string }> },
) {
  const { supplierId } = await context.params;
  const payload = await readRequestBody(request);
  if (payload === null) {
    return invalidRequestBodyResponse();
  }

  const response = await fetchUpstream(`${getBackendApiBaseUrl()}/suppliers/${supplierId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: payload,
  });

  return passthroughResponse(response);
}
