import type {
  Supplier,
  SupplierCreateInput,
  SupplierFilters,
  SupplierStatus,
} from "@/types/suppliers";

interface ApiErrorShape {
  detail?: string;
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
  const text = await response.text();
  let parsed: T | ApiErrorShape | null = null;

  if (text) {
    try {
      parsed = JSON.parse(text) as T | ApiErrorShape;
    } catch {
      parsed = null;
    }
  }

  if (!response.ok) {
    const detail =
      parsed && typeof parsed === "object" && "detail" in parsed
        ? parsed.detail
        : parsed && typeof parsed === "object" && "message" in parsed
          ? parsed.message
          : text || "Unexpected API error";

    throw new Error(String(detail ?? "Unexpected API error"));
  }

  if (parsed === null) {
    throw new Error("La API devolvio una respuesta invalida");
  }

  return parsed as T;
}

export async function getSuppliers(filters?: SupplierFilters): Promise<Supplier[]> {
  const response = await fetch(`${API_PREFIX}${buildQuery(filters)}`, {
    method: "GET",
    cache: "no-store",
  });

  return parseResponse<Supplier[]>(response);
}

export async function createSupplier(payload: SupplierCreateInput): Promise<Supplier> {
  const response = await fetch(API_PREFIX, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseResponse<Supplier>(response);
}

export async function patchSupplierStatus(
  supplierId: number,
  status: SupplierStatus,
): Promise<Supplier> {
  const response = await fetch(`${API_PREFIX}/${supplierId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  return parseResponse<Supplier>(response);
}

export async function patchSupplierRate(
  supplierId: number,
  monthlyRate: number,
): Promise<Supplier> {
  const response = await fetch(`${API_PREFIX}/${supplierId}/rate`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ monthly_rate: monthlyRate }),
  });

  return parseResponse<Supplier>(response);
}

export async function deleteSupplier(supplierId: number): Promise<{ message: string }> {
  const response = await fetch(`${API_PREFIX}/${supplierId}`, {
    method: "DELETE",
  });

  return parseResponse<{ message: string }>(response);
}
