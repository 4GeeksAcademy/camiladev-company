"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

import { AUTH_CHANGE_EVENT, hasToken, LOGIN_ROUTE } from "@/lib/auth-storage";

type SessionState = "checking" | "authenticated" | "anonymous";

/**
 * Protección de rutas del lado del cliente: localStorage solo existe en el navegador,
 * por eso la comprobación vive aquí y no en el middleware de Next.
 */
export function PrivateRoute({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [sessionState, setSessionState] = useState<SessionState>("checking");

  useEffect(() => {
    const syncSession = () => {
      setSessionState(hasToken() ? "authenticated" : "anonymous");
    };

    syncSession();

    window.addEventListener(AUTH_CHANGE_EVENT, syncSession);
    window.addEventListener("storage", syncSession);

    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, syncSession);
      window.removeEventListener("storage", syncSession);
    };
  }, []);

  useEffect(() => {
    if (sessionState === "anonymous") {
      router.replace(LOGIN_ROUTE);
    }
  }, [router, sessionState]);

  if (sessionState !== "authenticated") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-sm text-slate-300">
        {sessionState === "checking"
          ? "Verificando sesión..."
          : "Redirigiendo al inicio de sesión..."}
      </div>
    );
  }

  return <>{children}</>;
}
