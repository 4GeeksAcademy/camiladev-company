"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, type FormEvent } from "react";

import { resetPassword } from "@/lib/auth-api";
import { clearToken } from "@/lib/auth-storage";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [newPassword, setNewPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (newPassword !== confirmation) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setIsSubmitting(true);

    try {
      await resetPassword(token, newPassword);
      clearToken();
      router.replace("/login?passwordReset=success");
    } catch {
      setError("No se pudo actualizar la contraseña. Solicita un enlace nuevo e inténtalo otra vez.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-slate-100">
      <section className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
        <h1 className="text-2xl font-bold text-white">Crear nueva contraseña</h1>
        <p className="mt-2 text-sm text-slate-400">
          Elige una contraseña nueva para tu cuenta.
        </p>

        {!token ? (
          <div className="mt-6 grid gap-4">
            <p role="alert" className="text-sm text-rose-200">
              Falta el enlace de restablecimiento o no es válido. Solicita uno nuevo.
            </p>
            <Link href="/forgot-password" className="text-sm text-cyan-300 hover:underline">
              Volver a solicitar el enlace
            </Link>
          </div>
        ) : (
          <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
            <label className="grid gap-1 text-sm">
              <span className="text-slate-300">Nueva contraseña</span>
              <input
                type="password"
                name="new-password"
                autoComplete="new-password"
                required
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-cyan-500"
              />
            </label>

            <label className="grid gap-1 text-sm">
              <span className="text-slate-300">Confirmar contraseña</span>
              <input
                type="password"
                name="confirm-password"
                autoComplete="new-password"
                required
                value={confirmation}
                onChange={(event) => setConfirmation(event.target.value)}
                className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-cyan-500"
              />
            </label>

            {error && (
              <div role="alert" className="grid gap-2 text-sm text-rose-200">
                <p>{error}</p>
                <Link href="/forgot-password" className="text-cyan-300 hover:underline">
                  Solicitar un enlace nuevo
                </Link>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-cyan-500 px-4 py-2 font-semibold text-slate-950 hover:bg-cyan-400 disabled:opacity-60"
            >
              {isSubmitting ? "Actualizando..." : "Actualizar contraseña"}
            </button>
          </form>
        )}
      </section>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-slate-950" />}>
      <ResetPasswordForm />
    </Suspense>
  );
}