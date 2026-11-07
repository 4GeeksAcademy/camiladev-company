import {
  fetchUpstream,
  forwardAuthorizationHeader,
  getAuthApiBaseUrl,
  getBackendApiBaseUrl,
  invalidRequestBodyResponse,
  passthroughResponse,
  readRequestBody,
} from "@/lib/backend-api";
import { getInventoryErrorMessage } from "@/lib/inventory";

type InventoryContext = { params: Promise<{ path: string[] }> };

async function forwardInventory(request: Request, context: InventoryContext) {
  const { path } = await context.params;
  const endpoint = path.join("/");
  const allowed = request.method === "GET"
    ? endpoint === "products" || endpoint === "orders" || /^products\/[1-9]\d*$/.test(endpoint)
    : ["products", "orders/inbound", "orders/outbound"].includes(endpoint);

  if (!allowed) {
    return Response.json({ detail: "Ruta de inventario no disponible." }, { status: 404 });
  }

  if (!/^Bearer\s+\S+$/i.test(request.headers.get("authorization") ?? "")) {
    return Response.json({ detail: "Debes iniciar sesion para acceder al inventario." }, { status: 401 });
  }

  const authorization = forwardAuthorizationHeader(request);
  const session = await fetchUpstream(`${getAuthApiBaseUrl()}/auth/me`, {
    headers: authorization,
    cache: "no-store",
  });
  if (!session.ok) {
    return passthroughResponse(session);
  }
  await session.body?.cancel();

  const baseUrl = process.env.NEXT_PUBLIC_INVENTORY_API_URL ?? getBackendApiBaseUrl();
  const backendUrl = new URL(`${baseUrl.replace(/\/+$/, "")}/inventory/${endpoint}`);
  const office = new URL(request.url).searchParams.get("office");
  if (office) backendUrl.searchParams.set("office", office);

  let payload: string | null = null;
  if (request.method === "POST") {
    payload = await readRequestBody(request);
    if (payload === null) return invalidRequestBodyResponse();
  }

  const response = await fetchUpstream(backendUrl, {
    method: request.method,
    headers: {
      ...authorization,
      ...(payload !== null ? { "Content-Type": "application/json" } : {}),
    },
    ...(payload !== null ? { body: payload } : {}),
    cache: "no-store",
  });

  if (response.ok) return passthroughResponse(response);

  let body: unknown;
  try {
    const text = await response.text();
    try {
      body = JSON.parse(text);
    } catch {
      body = response.headers.get("content-type")?.includes("text/plain") ? text : undefined;
    }
  } catch {
    return Response.json({ detail: "No se pudo leer la respuesta de inventario." }, { status: 502 });
  }

  return Response.json(
    { detail: getInventoryErrorMessage(body, response.status) },
    { status: response.status, headers: { "Cache-Control": "no-store" } },
  );
}

export function GET(request: Request, context: InventoryContext) {
  return forwardInventory(request, context);
}

export function POST(request: Request, context: InventoryContext) {
  return forwardInventory(request, context);
}