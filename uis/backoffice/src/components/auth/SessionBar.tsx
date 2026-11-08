"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { logout } from "@/lib/auth-api";
import { AUTH_CHANGE_EVENT, hasToken } from "@/lib/auth-storage";

export function SessionBar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const syncSession = () => setIsAuthenticated(hasToken());

    syncSession();
    window.addEventListener(AUTH_CHANGE_EVENT, syncSession);
    window.addEventListener("storage", syncSession);

    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, syncSession);
      window.removeEventListener("storage", syncSession);
    };
  }, []);

  if (!isAuthenticated) return null;

  return (
    <div className="ml-auto flex flex-wrap items-center justify-end gap-x-4 gap-y-2 text-sm">
      <Link href="/account/profile" className="font-semibold text-slate-300 transition hover:text-cyan-300">
          Mi perfil
      </Link>
      <span className="whitespace-nowrap text-xs text-slate-400">BackOffice · People</span>
      <button
        type="button"
        onClick={logout}
        className="min-h-10 rounded-md border border-slate-700 px-3 py-1.5 text-slate-200 transition hover:border-rose-700 hover:text-rose-200"
      >
        Cerrar sesión
      </button>
    </div>
  );
}
