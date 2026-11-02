import { fetchUpstream, getBackendApiBaseUrl, passthroughResponse } from "@/lib/backend-api";

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ supplierId: string }> },
) {
  const { supplierId } = await context.params;

  const response = await fetchUpstream(`${getBackendApiBaseUrl()}/suppliers/${supplierId}`, {
    method: "DELETE",
  });

  return passthroughResponse(response);
}
