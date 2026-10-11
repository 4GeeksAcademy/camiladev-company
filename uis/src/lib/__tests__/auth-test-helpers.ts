import { jest } from "@jest/globals";

export function installBrowser(pathname = "/account/profile") {
  const tokens = new Map<string, string>();
  const browser = {
    localStorage: {
      getItem: jest.fn((key: string) => tokens.get(key) ?? null),
      setItem: jest.fn((key: string, value: string) => { tokens.set(key, value); }),
      removeItem: jest.fn((key: string) => { tokens.delete(key); }),
    },
    dispatchEvent: jest.fn<(event: Event) => boolean>(() => true),
    location: { pathname, assign: jest.fn<(url: string) => void>() },
  };
  Object.defineProperty(globalThis, "window", { value: browser, configurable: true });
  return browser;
}

export function removeBrowser() {
  Reflect.deleteProperty(globalThis, "window");
}

export function apiResult(status: number, payload: unknown): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    text: jest.fn<() => Promise<string>>().mockResolvedValue(JSON.stringify(payload)),
  } as unknown as Response;
}