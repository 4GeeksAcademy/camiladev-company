import { afterEach, describe, expect, it } from "@jest/globals";

import { AUTH_CHANGE_EVENT, clearToken, getToken, hasToken, setToken } from "../auth-storage";
import { installBrowser, removeBrowser } from "./auth-test-helpers";

afterEach(removeBrowser);

describe("auth storage", () => {
  it("stores the token and announces a session change", () => {
    const browser = installBrowser();
    setToken("signed-token");
    expect(getToken()).toBe("signed-token");
    expect(hasToken()).toBe(true);
    expect(browser.dispatchEvent).toHaveBeenCalledTimes(1);
    expect(browser.dispatchEvent.mock.calls[0][0].type).toBe(AUTH_CHANGE_EVENT);
  });

  it.each([null, "", "   "])("treats %p as no session", (token) => {
    const browser = installBrowser();
    browser.localStorage.getItem.mockReturnValue(token);
    expect(getToken()).toBeNull();
    expect(hasToken()).toBe(false);
  });

  it("removes the token and announces logout", () => {
    const browser = installBrowser();
    setToken("signed-token");
    browser.dispatchEvent.mockClear();
    clearToken();
    expect(getToken()).toBeNull();
    expect(hasToken()).toBe(false);
    expect(browser.dispatchEvent.mock.calls[0][0].type).toBe(AUTH_CHANGE_EVENT);
  });

  it("can clear an already missing token", () => {
    const browser = installBrowser();
    clearToken();
    expect(hasToken()).toBe(false);
    expect(browser.dispatchEvent).toHaveBeenCalledTimes(1);
  });

  it("is safe without a browser during server rendering", () => {
    removeBrowser();
    expect(getToken()).toBeNull();
    expect(hasToken()).toBe(false);
    expect(() => setToken("token")).not.toThrow();
    expect(() => clearToken()).not.toThrow();
  });

  it("does not claim a session exists when storage cannot be read", () => {
    const browser = installBrowser();
    browser.localStorage.getItem.mockImplementation(() => { throw new Error("storage denied"); });
    expect(getToken).toThrow("storage denied");
    expect(hasToken).toThrow("storage denied");
  });

  it.each(["setItem", "removeItem"] as const)("does not announce success when %s fails", (operation) => {
    const browser = installBrowser();
    browser.localStorage[operation].mockImplementation(() => { throw new Error("storage denied"); });
    expect(() => operation === "setItem" ? setToken("token") : clearToken()).toThrow("storage denied");
    expect(browser.dispatchEvent).not.toHaveBeenCalled();
  });
});