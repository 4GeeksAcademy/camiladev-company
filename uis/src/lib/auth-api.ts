import { clearToken, getToken, LOGIN_ROUTE, setToken } from "@/lib/auth-storage";
import type {
  AuthUser,
  ChangePasswordInput,
  LoginInput,
  LoginResponse,
  ProfileUpdateInput,
  RegisterInput,
} from "@/types/auth";

const API_PREFIX = "/api/auth";

export class ApiError extends Error {
  readonly status: number;
  readonly fieldErrors: Record<string, string>;

  constructor(
    message: string,
    status: number,
    fieldErrors: Record<string, string> = {},
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

interface ValidationIssue {
  loc?: unknown;
  msg?: unknown;
}

function extractFieldErrors(detail: unknown): Record<string, string> {
  if (!Array.isArray(detail)) {
    return {};
  }

  const fieldErrors: Record<string, string> = {};

  for (const issue of detail as ValidationIssue[]) {
    if (!issue || typeof issue !== "object") {
      continue;
    }

    const location = Array.isArray(issue.loc) ? issue.loc : [];
    const field = location.length > 0 ? String(location[location.length - 1]) : "form";
    const message = typeof issue.msg === "string" ? issue.msg : "Valor inválido";

    fieldErrors[field] = message;
  }

  return fieldErrors;
}

function extractMessage(detail: unknown, fallback: string): string {
  if (typeof detail === "string" && detail.trim()) {
    return detail;
  }

  if (Array.isArray(detail)) {
    const messages = Object.values(extractFieldErrors(detail));

    if (messages.length > 0) {
      return messages.join(" | ");
    }
  }

  return fallback;
}

async function parseResponse<T>(response: Response): Promise<T> {
  const text = await response.text();
  let parsed: unknown = null;

  if (text) {
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = null;
    }
  }

  if (response.ok) {
    return parsed as T;
  }

  const detail =
    parsed && typeof parsed === "object" && "detail" in parsed
      ? (parsed as { detail: unknown }).detail
      : null;

  throw new ApiError(
    extractMessage(detail, text || "No se pudo completar la solicitud"),
    response.status,
    extractFieldErrors(detail),
  );
}

function authHeaders(): HeadersInit {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Una llamada protegida que devuelve 401 implica sesión inválida: limpiar y volver al login.
async function authorizedFetch(input: string, init: RequestInit = {}): Promise<Response> {
  const response = await fetch(input, {
    ...init,
    cache: "no-store",
    headers: {
      ...(init.headers ?? {}),
      ...authHeaders(),
    },
  });

  if (response.status === 401) {
    clearToken();

    if (typeof window !== "undefined" && window.location.pathname !== LOGIN_ROUTE) {
      window.location.assign(LOGIN_ROUTE);
    }

    throw new ApiError("Tu sesión expiró. Inicia sesión de nuevo.", 401);
  }

  return response;
}

export async function login(credentials: LoginInput): Promise<string> {
  const response = await fetch(`${API_PREFIX}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  const data = await parseResponse<LoginResponse>(response);
  setToken(data.access_token);

  return data.access_token;
}

export async function register(payload: RegisterInput): Promise<void> {
  const response = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  await parseResponse<unknown>(response);
}

export async function getCurrentUser(): Promise<AuthUser> {
  const response = await authorizedFetch(`${API_PREFIX}/me`, { method: "GET" });
  return parseResponse<AuthUser>(response);
}

export async function requestPasswordReset(email: string): Promise<void> {
  const response = await fetch(`${API_PREFIX}/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
    cache: "no-store",
  });

  await parseResponse<unknown>(response);
}

export async function resetPassword(token: string, newPassword: string): Promise<void> {
  const response = await fetch(`${API_PREFIX}/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, new_password: newPassword }),
    cache: "no-store",
  });

  await parseResponse<unknown>(response);
}

export async function changePassword(payload: ChangePasswordInput): Promise<void> {
  const response = await authorizedFetch(`${API_PREFIX}/change-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  await parseResponse<unknown>(response);
}

export async function updateMyProfile(
  changes: ProfileUpdateInput,
): Promise<AuthUser["profile"]> {
  const response = await authorizedFetch("/api/profiles/me", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(changes),
  });

  return parseResponse<AuthUser["profile"]>(response);
}

export function logout(): void {
  clearToken();

  if (typeof window !== "undefined") {
    window.location.assign(LOGIN_ROUTE);
  }
}
