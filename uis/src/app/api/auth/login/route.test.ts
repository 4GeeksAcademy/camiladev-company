import { beforeEach, expect, it, jest } from "@jest/globals";

import { POST } from "./route";
import { fetchUpstream, getAuthApiBaseUrl, invalidRequestBodyResponse, passthroughResponse } from "@/lib/backend-api";

jest.mock("@/lib/backend-api");

const invalid = { status: 400 } as Response;
const upstream = { status: 200 } as Response;
const accepted = { status: 200 } as Response;

beforeEach(() => {
  jest.mocked(getAuthApiBaseUrl).mockReturnValue("https://auth.example");
  jest.mocked(invalidRequestBodyResponse).mockReturnValue(invalid);
  jest.mocked(fetchUpstream).mockResolvedValue(upstream);
  jest.mocked(passthroughResponse).mockResolvedValue(accepted);
  jest.spyOn(Response, "json").mockReturnValue(invalid);
});

function requestWith(payload: unknown): Request {
  return { json: jest.fn<() => Promise<unknown>>().mockResolvedValue(payload) } as unknown as Request;
}

it("accepts valid credentials and delegates authentication to the auth backend", async () => {
  await expect(POST(requestWith({ email: "user@example.com", password: "secret" }))).resolves.toBe(accepted);
  expect(fetchUpstream).toHaveBeenCalledWith("https://auth.example/auth/login", expect.any(Object));
  expect(passthroughResponse).toHaveBeenCalledWith(upstream);
});

it.each([
  {}, { email: "", password: "secret" }, { email: "user@example.com", password: "" },
  { email: 42, password: "secret" }, { email: "user@example.com", password: null },
])("rejects missing or invalid credentials %p before contacting the backend", async (payload) => {
  await expect(POST(requestWith(payload))).resolves.toBe(invalid);
  expect(fetchUpstream).not.toHaveBeenCalled();
  expect(Response.json).toHaveBeenCalledWith({ detail: "Email y contraseña son obligatorios" }, { status: 400 });
});

it.each([null, "invalid", 42])("rejects non-object input %p", async (payload) => {
  await expect(POST(requestWith(payload))).resolves.toBe(invalid);
  expect(invalidRequestBodyResponse).toHaveBeenCalled();
  expect(fetchUpstream).not.toHaveBeenCalled();
});

it("rejects unreadable input without contacting the backend", async () => {
  const request = { json: jest.fn<() => Promise<unknown>>().mockRejectedValue(new Error("private parse error")) } as unknown as Request;
  await expect(POST(request)).resolves.toBe(invalid);
  expect(fetchUpstream).not.toHaveBeenCalled();
});

it("does not report successful authentication when the backend rejects credentials", async () => {
  const rejected = { status: 401 } as Response;
  jest.mocked(fetchUpstream).mockResolvedValue(rejected);
  jest.mocked(passthroughResponse).mockResolvedValue(rejected);
  await expect(POST(requestWith({ email: "user@example.com", password: "wrong" }))).resolves.toBe(rejected);
});