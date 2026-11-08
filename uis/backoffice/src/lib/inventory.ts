import { fetchApi, publicHttpErrorMessage, readResponseText } from "@/lib/api-request";
import { clearToken, getToken } from "@/lib/auth-storage";

export type Office = "Valencia" | "Miami";
export type AssetCategory =
  | "hardware"
  | "peripherals"
  | "office_supplies"
  | "training_materials";

export interface AssetCreate {
  name: string;
  sku: string;
  category: AssetCategory;
  office: Office;
}

export interface Asset extends AssetCreate {
  id: number;
  current_stock: number;
}

export interface AssetEntryCreate {
  asset_id: number;
  quantity: number;
  supplier: string;
  office: Office;
}

export type AssetExitCreate = {
  asset_id: number;
  quantity: number;
  office: Office;
} & (
  | { exit_type: "allocation"; assigned_to: string }
  | { exit_type: "consumption"; assigned_to: null }
);

interface OrderAudit {
  id: number;
  created_at: string;
  user_uuid: string;
}

export type AssetEntry = AssetEntryCreate & OrderAudit;
export type AssetExit = AssetExitCreate & OrderAudit;
export type InventoryOrder =
  | (AssetEntry & { order_type: "inbound"; asset: Asset })
  | (AssetExit & { order_type: "outbound"; asset: Asset });

export class InventoryApiError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = "InventoryApiError";
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function extractMessage(value: unknown): string | undefined {
  if (typeof value === "string") {
    return value.trim() || undefined;
  }

  if (Array.isArray(value)) {
    const messages = value.map((issue) => {
      const message = extractMessage(issue);
      if (!message || !isRecord(issue) || !Array.isArray(issue.loc)) {
        return message;
      }
      const location = issue.loc
        .filter((part) => typeof part === "string" || typeof part === "number")
        .filter((part) => part !== "body")
        .join(".");
      return location ? `${location}: ${message}` : message;
    }).filter((message): message is string => Boolean(message));
    return messages.length ? messages.join("; ") : undefined;
  }

  if (isRecord(value)) {
    return extractMessage(value.detail)
      ?? extractMessage(value.message)
      ?? extractMessage(value.msg)
      ?? extractMessage(value.error);
  }

  return undefined;
}

export function getInventoryErrorMessage(body: unknown, status: number): string {
  return extractMessage(body) ?? publicHttpErrorMessage(status);
}

async function inventoryRequest<Result>(
  path: string,
  method: "GET" | "POST" = "GET",
  payload?: AssetCreate | AssetEntryCreate | AssetExitCreate,
): Promise<Result> {
  const token = getToken();
  if (!token) {
    throw new InventoryApiError("Debes iniciar sesion para consultar el inventario.", 401);
  }

  const response = await fetchApi(`/api/inventory${path}`, {
    method,
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${token}`,
      ...(payload ? { "Content-Type": "application/json" } : {}),
    },
    ...(payload ? { body: JSON.stringify(payload) } : {}),
  }, "No se pudo conectar con inventario. Comprueba tu conexion e intentalo de nuevo.");

  if (response.status === 401) {
    clearToken();
  }

  const text = await readResponseText(response);
  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    body = response.headers.get("content-type")?.includes("text/plain") ? text : undefined;
  }

  if (!response.ok) {
    throw new InventoryApiError(getInventoryErrorMessage(body, response.status), response.status);
  }

  if (body === undefined || body === null || typeof body !== "object") {
    throw new Error("Inventario devolvio una respuesta inesperada. Intentalo de nuevo.");
  }

  return body as Result;
}

function officeQuery(office?: Office): string {
  const query = new URLSearchParams();
  if (office) query.set("office", office);
  return query.size ? `?${query.toString()}` : "";
}

export function getInventoryProducts(office?: Office): Promise<Asset[]> {
  return inventoryRequest(`/products${officeQuery(office)}`);
}

export function getInventoryProduct(id: number): Promise<Asset> {
  return inventoryRequest(`/products/${id}`);
}

export function createInventoryProduct(payload: AssetCreate): Promise<Asset> {
  return inventoryRequest("/products", "POST", payload);
}

export function createInventoryEntry(payload: AssetEntryCreate): Promise<AssetEntry> {
  return inventoryRequest("/orders/inbound", "POST", payload);
}

export function createInventoryExit(payload: AssetExitCreate): Promise<AssetExit> {
  return inventoryRequest("/orders/outbound", "POST", payload);
}

export function getInventoryOrders(office?: Office): Promise<InventoryOrder[]> {
  return inventoryRequest(`/orders${officeQuery(office)}`);
}