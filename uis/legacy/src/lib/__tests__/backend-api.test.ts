import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";

import {
  fetchUpstream, forwardAuthorizationHeader, getAuthApiBaseUrl, getBackendApiBaseUrl,
  invalidRequestBodyResponse, passthroughResponse, readRequestBody,
} from "../backend-api";
import { apiResult } from "./auth-test-helpers";

const environmentKeys = [
  "AUTH_API_BASE_URL", "NEXT_PUBLIC_AUTH_API_BASE_URL",
  "SUPPLIERS_API_BASE_URL", "NEXT_PUBLIC_SUPPLIERS_API_BASE_URL",
] as const;
let savedEnvironment: (string | undefined)[];

beforeEach(() => {
  savedEnvironment = environmentKeys.map((key) => process.env[key]);
  environmentKeys.forEach((key) => { delete process.env[key]; });
});
afterEach(() => {
  environmentKeys.forEach((key, index) => {
    const value = savedEnvironment[index];
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  });
});

describe("backend configuration", () => {
  it.each([
    [getAuthApiBaseUrl, "AUTH_API_BASE_URL", "NEXT_PUBLIC_AUTH_API_BASE_URL"],
    [getBackendApiBaseUrl, "SUPPLIERS_API_BASE_URL", "NEXT_PUBLIC_SUPPLIERS_API_BASE_URL"],
  ] as const)("selects private, public, then local configuration", (getUrl, privateKey, publicKey) => {
    expect(getUrl()).toBe("http://127.0.0.1:8000");
    process.env[publicKey] = "https://public.example";
    expect(getUrl()).toBe("https://public.example");
    process.env[privateKey] = "https://private.example";
    expect(getUrl()).toBe("https://private.example");
  });

  it("does not accidentally use suppliers configuration for authentication", () => {
    process.env.SUPPLIERS_API_BASE_URL = "https://suppliers.example";
    expect(getAuthApiBaseUrl()).toBe("http://127.0.0.1:8000");
  });
});

it.each([null, "", "Bearer existing-token"])("forwards only an existing credential %p", (credential) => {
  const request = { headers: { get: jest.fn(() => credential) } } as unknown as Request;
  expect(forwardAuthorizationHeader(request)).toEqual(credential ? { Authorization: credential } : {});
});

it("does not fabricate authentication after an upstream network failure", async () => {
  const unavailable = { status: 502 } as Response;
  const json = jest.spyOn(Response, "json").mockReturnValue(unavailable);
  jest.spyOn(globalThis, "fetch").mockRejectedValue(new Error("private network details"));
  await expect(fetchUpstream("/auth/me")).resolves.toBe(unavailable);
  expect(json).toHaveBeenCalledWith({ detail: "El servicio no está disponible. Inténtalo de nuevo más tarde." }, { status: 502 });
});

it("returns the upstream result when available", async () => {
  const result = apiResult(200, {});
  jest.spyOn(globalThis, "fetch").mockResolvedValue(result);
  await expect(fetchUpstream("/auth/me")).resolves.toBe(result);
});

it.each(["input", ""])("lets the caller handle readable request data %p", async (input) => {
  const request = { text: jest.fn<() => Promise<string>>().mockResolvedValue(input) } as unknown as Request;
  await expect(readRequestBody(request)).resolves.toBe(input);
});

it("marks unreadable input as invalid rather than accepting it", async () => {
  const request = { text: jest.fn<() => Promise<string>>().mockRejectedValue(new Error("private details")) } as unknown as Request;
  await expect(readRequestBody(request)).resolves.toBeNull();
});

it("selects a safe failure for invalid input", () => {
  const invalid = { status: 400 } as Response;
  const json = jest.spyOn(Response, "json").mockReturnValue(invalid);
  expect(invalidRequestBodyResponse()).toBe(invalid);
  expect(json).toHaveBeenCalledWith({ detail: "No se pudo leer la solicitud. Comprueba los datos e inténtalo de nuevo." }, { status: 400 });
});

it.each([
  [400, "validar la solicitud"], [422, "validar la solicitud"],
  [401, "credenciales o la sesión"], [403, "permiso"], [404, "recurso"],
  [409, "conflicto"], [429, "demasiadas solicitudes"], [500, "más tarde"],
])("hides internal upstream details for status %s", async (status, publicMessage) => {
  const safeResult = { status } as Response;
  const json = jest.spyOn(Response, "json").mockReturnValue(safeResult);
  await expect(passthroughResponse(apiResult(status as number, { detail: "private database credentials" }))).resolves.toBe(safeResult);
  expect(json).toHaveBeenCalledWith({ detail: expect.stringContaining(publicMessage as string) }, { status });
});

it("does not claim success when upstream data cannot be read", async () => {
  const result = apiResult(200, {});
  jest.spyOn(result, "text").mockRejectedValue(new Error("private stream details"));
  const unavailable = { status: 502 } as Response;
  const json = jest.spyOn(Response, "json").mockReturnValue(unavailable);
  await expect(passthroughResponse(result)).resolves.toBe(unavailable);
  expect(json).toHaveBeenCalledWith({ detail: "No se pudo leer la respuesta del servicio. Inténtalo de nuevo." }, { status: 502 });
});