const TOKEN_STORAGE_KEY = "camiladev.auth.token";

export const AUTH_CHANGE_EVENT = "camiladev:auth-change";
export const LOGIN_ROUTE = "/login";

function notifyAuthChange(): void {
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

// El token vive en localStorage, por lo que solo es legible en el navegador.
export function getToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  const token = window.localStorage.getItem(TOKEN_STORAGE_KEY);
  return token && token.trim() ? token : null;
}

export function setToken(token: string): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
  notifyAuthChange();
}

export function clearToken(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(TOKEN_STORAGE_KEY);
  notifyAuthChange();
}

export function hasToken(): boolean {
  return getToken() !== null;
}
