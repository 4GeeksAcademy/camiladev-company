import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";

import {
  ApiError, changePassword, getCurrentUser, login, logout, register,
  requestPasswordReset, resetPassword, updateMyProfile,
} from "../auth-api";
import { getToken, setToken } from "../auth-storage";
import { apiResult, installBrowser, removeBrowser } from "./auth-test-helpers";

const identity = { id: "user-id", email: "user@example.com", role: "user", profile: null };
const credentials = { email: identity.email, password: "valid-password" };
const passwordChange = { current_password: "valid-password", new_password: "new-password" };

let browser: ReturnType<typeof installBrowser>;
let fetchMock: jest.SpiedFunction<typeof fetch>;

beforeEach(() => {
  browser = installBrowser();
  fetchMock = jest.spyOn(globalThis, "fetch").mockResolvedValue(apiResult(200, {}));
});
afterEach(removeBrowser);

describe("login", () => {
  it("stores and returns the issued token", async () => {
    fetchMock.mockResolvedValue(apiResult(200, { access_token: "signed-token" }));
    await expect(login(credentials)).resolves.toBe("signed-token");
    expect(getToken()).toBe("signed-token");
    expect(browser.dispatchEvent).toHaveBeenCalledTimes(1);
  });

  it.each([{}, { access_token: "" }, null])("does not create a session for missing token %p", async (payload) => {
    fetchMock.mockResolvedValue(apiResult(200, payload));
    await expect(login(credentials)).rejects.toBeInstanceOf(ApiError);
    expect(getToken()).toBeNull();
    expect(browser.dispatchEvent).not.toHaveBeenCalled();
  });

  it("rejects invalid credentials without storing or exposing backend details", async () => {
    fetchMock.mockResolvedValue(apiResult(401, { detail: "private database details" }));
    await expect(login(credentials)).rejects.toMatchObject({ status: 401 });
    expect(getToken()).toBeNull();
    expect(browser.location.assign).not.toHaveBeenCalled();
  });

  it("does not create a session after network failure", async () => {
    fetchMock.mockRejectedValue(new Error("private network details"));
    await expect(login(credentials)).rejects.toThrow("No se pudo iniciar sesión. Comprueba tu conexión");
    expect(getToken()).toBeNull();
  });
});

describe("registration", () => {
  it("completes registration without logging in implicitly", async () => {
    await expect(register(credentials)).resolves.toBeUndefined();
    expect(getToken()).toBeNull();
  });

  it("rejects a duplicate email without changing an existing session", async () => {
    setToken("existing-token");
    fetchMock.mockResolvedValue(apiResult(400, { detail: "Email already registered" }));
    await expect(register(credentials)).rejects.toMatchObject({ status: 400 });
    expect(getToken()).toBe("existing-token");
  });

  it("maps validation errors to safe field messages", async () => {
    fetchMock.mockResolvedValue(apiResult(422, {
      detail: [
        { loc: ["body", "email"], msg: "private validation context" },
        { loc: ["body", "password"], msg: null },
        { loc: [], msg: "form error" }, null, "invalid-issue",
      ],
    }));
    await expect(register(credentials)).rejects.toMatchObject({
      status: 422,
      message: "Revisa este campo. | Valor inválido | Revisa este campo.",
      fieldErrors: { email: "Revisa este campo.", password: "Valor inválido", form: "Revisa este campo." },
    });
  });
});

describe("current user", () => {
  it("returns the authenticated identity and uses the existing credential", async () => {
    setToken("signed-token");
    fetchMock.mockResolvedValue(apiResult(200, identity));
    await expect(getCurrentUser()).resolves.toEqual(identity);
    expect(fetchMock.mock.calls[0][1]?.headers).toEqual({ Authorization: "Bearer signed-token" });
  });

  it("does not invent credentials when the token is missing", async () => {
    fetchMock.mockResolvedValue(apiResult(401, {}));
    await expect(getCurrentUser()).rejects.toMatchObject({ status: 401 });
    expect(fetchMock.mock.calls[0][1]?.headers).toEqual({});
    expect(browser.location.assign).toHaveBeenCalledWith("/login");
  });

  it("expires a rejected session and redirects to login", async () => {
    setToken("expired-token");
    fetchMock.mockResolvedValue(apiResult(401, {}));
    await expect(getCurrentUser()).rejects.toMatchObject({ status: 401, message: "Tu sesión expiró. Inicia sesión de nuevo." });
    expect(getToken()).toBeNull();
    expect(browser.location.assign).toHaveBeenCalledTimes(1);
    expect(browser.location.assign).toHaveBeenCalledWith("/login");
  });

  it("avoids redirect loops when already on login", async () => {
    browser.location.pathname = "/login";
    setToken("expired-token");
    fetchMock.mockResolvedValue(apiResult(401, {}));
    await expect(getCurrentUser()).rejects.toMatchObject({ status: 401 });
    expect(getToken()).toBeNull();
    expect(browser.location.assign).not.toHaveBeenCalled();
  });

  it("does not expire a session for denied permissions", async () => {
    setToken("signed-token");
    fetchMock.mockResolvedValue(apiResult(403, { detail: "private permission details" }));
    await expect(getCurrentUser()).rejects.toMatchObject({ status: 403, message: "No tienes permiso para realizar esta acción." });
    expect(getToken()).toBe("signed-token");
    expect(browser.location.assign).not.toHaveBeenCalled();
  });

  it("handles an expired session without a browser", async () => {
    removeBrowser();
    fetchMock.mockResolvedValue(apiResult(401, {}));
    await expect(getCurrentUser()).rejects.toMatchObject({ status: 401 });
  });
});

describe("password reset request", () => {
  it.each([identity.email, "unknown@example.com"])("completes the generic request for %s", async (email) => {
    fetchMock.mockResolvedValue(apiResult(200, { message: "generic acknowledgement" }));
    await expect(requestPasswordReset(email)).resolves.toBeUndefined();
    expect(getToken()).toBeNull();
  });

  it("rejects an empty email validation error", async () => {
    fetchMock.mockResolvedValue(apiResult(422, { detail: [] }));
    await expect(requestPasswordReset("")).rejects.toMatchObject({ status: 422, fieldErrors: {} });
  });

  it("reports network failure without leaking provider details", async () => {
    fetchMock.mockRejectedValue(new Error("private provider details"));
    await expect(requestPasswordReset(identity.email)).rejects.toThrow("No se pudo enviar la solicitud.");
  });
});

describe("password reset", () => {
  it("completes the password reset without creating a session", async () => {
    await expect(resetPassword("valid-token", "new-password")).resolves.toBeUndefined();
    expect(getToken()).toBeNull();
  });

  it.each(["", "expired-token", "used-token"])("rejects unusable token %p", async (token) => {
    fetchMock.mockResolvedValue(apiResult(400, {}));
    await expect(resetPassword(token, "new-password")).rejects.toMatchObject({ status: 400 });
    expect(getToken()).toBeNull();
  });

  it("reports an unavailable service", async () => {
    fetchMock.mockResolvedValue(apiResult(503, { detail: "private details" }));
    await expect(resetPassword("valid-token", "new-password")).rejects.toMatchObject({ status: 503 });
  });
});

describe("password change", () => {
  it("changes the password while preserving the session", async () => {
    setToken("signed-token");
    await expect(changePassword(passwordChange)).resolves.toBeUndefined();
    expect(getToken()).toBe("signed-token");
  });

  it("expires an invalid session", async () => {
    setToken("expired-token");
    fetchMock.mockResolvedValue(apiResult(401, {}));
    await expect(changePassword(passwordChange)).rejects.toMatchObject({ status: 401 });
    expect(getToken()).toBeNull();
  });

  it("does not clear the session when the current password is wrong", async () => {
    setToken("signed-token");
    fetchMock.mockResolvedValue(apiResult(400, {}));
    await expect(changePassword({ ...passwordChange, current_password: "wrong" })).rejects.toMatchObject({ status: 400 });
    expect(getToken()).toBe("signed-token");
  });
});

describe("profile update", () => {
  it("returns the updated profile", async () => {
    const profile = { id: "profile-id", user_id: identity.id, name: "Camila", phone: null, address: null };
    fetchMock.mockResolvedValue(apiResult(200, profile));
    await expect(updateMyProfile({ name: "Camila" })).resolves.toEqual(profile);
  });

  it("rejects an unexpected null profile", async () => {
    fetchMock.mockResolvedValue(apiResult(200, null));
    await expect(updateMyProfile({})).rejects.toBeInstanceOf(ApiError);
  });

  it("expires a rejected session", async () => {
    setToken("expired-token");
    fetchMock.mockResolvedValue(apiResult(401, {}));
    await expect(updateMyProfile({})).rejects.toMatchObject({ status: 401 });
    expect(getToken()).toBeNull();
  });
});

describe("logout", () => {
  it("clears the session and redirects to login", () => {
    setToken("signed-token");
    logout();
    expect(getToken()).toBeNull();
    expect(browser.location.assign).toHaveBeenCalledWith("/login");
  });

  it("can run without a browser", () => {
    removeBrowser();
    expect(logout).not.toThrow();
  });

  it("does not redirect as though logout succeeded if storage fails", () => {
    browser.localStorage.removeItem.mockImplementation(() => { throw new Error("storage denied"); });
    expect(logout).toThrow("storage denied");
    expect(browser.location.assign).not.toHaveBeenCalled();
  });
});

describe("safe error handling", () => {
  it("preserves explicit error data and defaults field errors", () => {
    expect(new ApiError("safe", 400)).toMatchObject({ name: "ApiError", message: "safe", status: 400, fieldErrors: {} });
    expect(new ApiError("safe", 422, { email: "invalid" }).fieldErrors).toEqual({ email: "invalid" });
  });

  it.each(["", "not-json"])("does not claim success for unreadable service data %p", async (body) => {
    const result = apiResult(200, {});
    jest.spyOn(result, "text").mockResolvedValue(body);
    fetchMock.mockResolvedValue(result);
    await expect(register(credentials)).rejects.toMatchObject({ message: "El servicio devolvió una respuesta inesperada. Inténtalo de nuevo." });
  });

  it("uses a generic message for an error with no detail", async () => {
    fetchMock.mockResolvedValue(apiResult(500, null));
    await expect(register(credentials)).rejects.toMatchObject({ status: 500, fieldErrors: {} });
  });

  it("ignores malformed validation issues", async () => {
    fetchMock.mockResolvedValue(apiResult(422, { detail: [null, "invalid", { loc: "bad", msg: 42 }] }));
    await expect(register(credentials)).rejects.toMatchObject({ fieldErrors: { form: "Valor inválido" } });
  });
});