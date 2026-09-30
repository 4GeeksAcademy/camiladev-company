"use client";

import Link from "next/link";

import { logout } from "@/lib/auth-api";

export function SessionBar({ email }: { email?: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-3">
      <div className="flex items-center gap-4 text-sm">
        <Link href="/suppliers" className="text-slate-300 hover:text-cyan-300">
          Proveedores
        </Link>
        <Link href="/account/profile" className="text-slate-300 hover:text-cyan-300">
          Mi perfil
        </Link>
      </div>

      <div className="flex items-center gap-3 text-sm">
        {email && <span className="text-slate-400">{email}</span>}
        <button
          type="button"
          onClick={logout}
          className="rounded-md border border-slate-700 px-3 py-1.5 text-slate-200 hover:border-rose-700 hover:text-rose-200"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
