"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

import { requestPasswordReset } from "@/lib/auth-api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await requestPasswordReset(email.trim());
      setHasSubmitted(true);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "No se pudo enviar la solicitud. Inténtalo de nuevo.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-slate-100">
      <section className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
        <h1 className="text-2xl font-bold text-white">Recuperar contraseña</h1>
        <p className="mt-2 text-sm text-slate-400">
          Introduce el email asociado a tu cuenta.
        </p>

        {hasSubmitted ? (
          <p role="status" className="mt-6 rounded-md border border-emerald-900 bg-emerald-950/60 px-3 py-3 text-sm text-emerald-200">
            Si este email está registrado, recibirás un correo de confirmación en breve.
          </p>
        ) : (
          <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
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

            {error && <p role="alert" className="text-sm text-rose-300">{error}</p>}

            <button
              type="submit"
              disabled={isSubmitting || hasSubmitted}
              className="rounded-md bg-cyan-500 px-4 py-2 font-semibold text-slate-950 hover:bg-cyan-400 disabled:opacity-60"
            >
              {isSubmitting ? "Enviando..." : "Enviar enlace"}
            </button>
          </form>
        )}

        <p className="mt-5 text-sm text-slate-400">
          <Link href="/login" className="text-cyan-300 hover:underline">
            Volver a iniciar sesión
          </Link>
        </p>
      </section>
    </main>
  );
}