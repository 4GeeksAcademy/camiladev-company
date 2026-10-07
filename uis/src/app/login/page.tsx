"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useEffect, useState, type FormEvent } from "react";

import { login } from "@/lib/auth-api";
import { hasToken } from "@/lib/auth-storage";

const HOME_ROUTE = "/suppliers";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const passwordReset = searchParams.get("passwordReset") === "success";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (hasToken()) {
      router.replace(HOME_ROUTE);
    }
  }, [router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login({ email, password });
      router.replace(HOME_ROUTE);
    } catch {
      setError("No se pudo iniciar sesión. Comprueba tus datos e inténtalo de nuevo o recupera tu contraseña.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-slate-100">
      <section className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
        <h1 className="text-2xl font-bold text-white">Iniciar sesión</h1>
        <p className="mt-1 text-sm text-slate-400">
          Accede con tu email y contraseña para continuar.
        </p>

        <form className="mt-6 grid gap-4" onSubmit={handleSubmit} noValidate>
          <label className="grid gap-1 text-sm">
            <span className="text-slate-300">Email</span>
            <input
              type="email"
              name="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-cyan-500"
            />
          </label>

          <label className="grid gap-1 text-sm">
            <span className="text-slate-300">Contraseña</span>
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-cyan-500"
            />
          </label>

          <Link
            href="/forgot-password"
            className="-mt-2 justify-self-end text-sm text-cyan-300 hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </Link>

          {passwordReset && (
            <p role="status" className="rounded-md border border-emerald-900 bg-emerald-950/60 px-3 py-2 text-sm text-emerald-200">
              Tu contraseña se actualizó. Ya puedes iniciar sesión.
            </p>
          )}

          {error && (
            <p
              role="alert"
              className="rounded-md border border-rose-900 bg-rose-950/60 px-3 py-2 text-sm text-rose-200"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-cyan-500 px-4 py-2 font-semibold text-slate-950 hover:bg-cyan-400 disabled:opacity-60"
          >
            {isSubmitting ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="mt-4 text-sm text-slate-400">
          ¿No tienes cuenta?{" "}
          <Link href="/register" className="text-cyan-300 hover:underline">
            Regístrate
          </Link>
        </p>
      </section>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-slate-950" />}>
      <LoginContent />
    </Suspense>
  );
}
