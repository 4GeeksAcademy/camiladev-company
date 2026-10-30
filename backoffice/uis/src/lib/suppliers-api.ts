import type {
  Supplier,
  SupplierCreateInput,
  SupplierFilters,
  SupplierStatus,
} from "@/types/suppliers";
import { fetchApi, publicHttpErrorMessage, readResponseText } from "@/lib/api-request";

interface ApiErrorShape {
  detail?: unknown;
  message?: string;
}

const API_PREFIX = "/api/suppliers";

function buildQuery(filters?: SupplierFilters): string {
  const params = new URLSearchParams();

  if (filters?.country) {
    params.set("country", filters.country);
  }

  if (filters?.category) {
    params.set("category", filters.category);
  }

  const query = params.toString();
  return query ? `?${query}` : "";
}

async function parseResponse<T>(response: Response): Promise<T> {
  const text = await readResponseText(response);
  let parsed: T | ApiErrorShape | null = null;

  if (text) {
    try {
      parsed = JSON.parse(text) as T | ApiErrorShape;
    } catch {
      parsed = null;
    }
  }

  if (!response.ok) {
    const formatDetail = (detail: unknown): string => {
      if (typeof detail === "string") {
        return detail;
      }

      if (Array.isArray(detail)) {
        const messages = detail
          .map((issue) => {
            if (!issue || typeof issue !== "object") {
              return null;
            }

            const message = "msg" in issue ? issue.msg : null;
            if (typeof message !== "string") {
              return null;
            }

            const location = "loc" in issue && Array.isArray(issue.loc)
              ? issue.loc.slice(1).join(".")
              : "";

            return location ? `${location}: ${message}` : message;
          })
          .filter((message): message is string => Boolean(message));

        if (messages.length > 0) {
          return messages.join(" | ");
        }
      }

      if (detail && typeof detail === "object") {
        return "Solicitud invalida. Revisa los campos e intenta de nuevo.";
      }

      return publicHttpErrorMessage(response.status);
    };

    const detail =
      parsed && typeof parsed === "object" && "detail" in parsed
        ? formatDetail(parsed.detail)
        : parsed && typeof parsed === "object" && "message" in parsed
          ? parsed.message
              : publicHttpErrorMessage(response.status);

            throw new Error(String(detail ?? publicHttpErrorMessage(response.status)));
  }

  if (parsed === null) {
    throw new Error("El servicio devolvió una respuesta inesperada. Inténtalo de nuevo.");
  }

  return parsed as T;
}

export async function getSuppliers(filters?: SupplierFilters): Promise<Supplier[]> {
  const response = await fetchApi(`${API_PREFIX}${buildQuery(filters)}`, {
    method: "GET",
    cache: "no-store",
  }, "No se pudo cargar el directorio. Comprueba tu conexión e inténtalo de nuevo.");

  return parseResponse<Supplier[]>(response);
}

export async function createSupplier(payload: SupplierCreateInput): Promise<Supplier> {
  const response = await fetchApi(API_PREFIX, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  }, "No se pudo registrar el proveedor. Comprueba tu conexión e inténtalo de nuevo.");

  return parseResponse<Supplier>(response);
}

export async function patchSupplierStatus(
  supplierId: number,
  status: SupplierStatus,
): Promise<Supplier> {
  const response = await fetchApi(`${API_PREFIX}/${supplierId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  }, "No se pudo actualizar el estado. Comprueba tu conexión e inténtalo de nuevo.");

  return parseResponse<Supplier>(response);
}

export async function patchSupplierRate(
  supplierId: number,
  monthlyRate: number,
): Promise<Supplier> {
  const response = await fetchApi(`${API_PREFIX}/${supplierId}/rate`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ monthly_rate: monthlyRate }),
  }, "No se pudo actualizar la tarifa. Comprueba tu conexión e inténtalo de nuevo.");

  return parseResponse<Supplier>(response);
}

export async function deleteSupplier(supplierId: number): Promise<{ message: string }> {
  const response = await fetchApi(`${API_PREFIX}/${supplierId}`, {
    method: "DELETE",
  }, "No se pudo eliminar el proveedor. Comprueba tu conexión e inténtalo de nuevo.");

  return parseResponse<{ message: string }>(response);
}
