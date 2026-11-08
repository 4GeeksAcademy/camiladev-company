import { expect, it, jest } from "@jest/globals";

import { fetchApi, publicHttpErrorMessage, readResponseText } from "../api-request";
import { apiResult } from "./auth-test-helpers";

it("returns the network result to the business caller", async () => {
  const result = apiResult(200, {});
  jest.spyOn(globalThis, "fetch").mockResolvedValue(result);
  await expect(fetchApi("/api/auth/me", {}, "safe network message")).resolves.toBe(result);
});

it("replaces internal network errors with the caller's public message", async () => {
  jest.spyOn(globalThis, "fetch").mockRejectedValue(new Error("private connection details"));
  await expect(fetchApi("/api/auth/me", {}, "safe network message")).rejects.toThrow("safe network message");
});

it.each(["result", ""])("returns readable result %p", async (text) => {
  const result = apiResult(200, {});
  jest.spyOn(result, "text").mockResolvedValue(text);
  await expect(readResponseText(result)).resolves.toBe(text);
});

it("does not expose an internal response read failure", async () => {
  const result = apiResult(200, {});
  jest.spyOn(result, "text").mockRejectedValue(new Error("private stream details"));
  await expect(readResponseText(result)).rejects.toThrow("No se pudo leer la respuesta. Inténtalo de nuevo.");
});

it.each([
  [400, "validar los datos"], [422, "validar los datos"],
  [401, "credenciales o la sesión"], [403, "permiso"], [404, "recurso"],
  [409, "conflicto"], [429, "demasiadas solicitudes"],
  [500, "más tarde"], [999, "más tarde"],
])("chooses a safe message for status %s", (status, message) => {
  expect(publicHttpErrorMessage(status as number)).toContain(message as string);
});