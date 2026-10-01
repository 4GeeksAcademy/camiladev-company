"use client";

import { useState, type FormEvent } from "react";

import { PrivateRoute } from "@/components/auth/PrivateRoute";
import { SessionBar } from "@/components/auth/SessionBar";
import { changePassword } from "@/lib/auth-api";

function ChangePasswordContent() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccessMessage("");

    if (newPassword !== confirmation) {
      setError("La nueva contraseña y su confirmación no coinciden.");
      return;
    }

    setIsSubmitting(true);

    try {
      await changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmation("");
      setSuccessMessage("Tu contraseña se actualizó correctamente.");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "No se pudo actualizar la contraseña.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="mx-auto grid w-full max-w-3xl gap-4 px-4 py-8 sm:px-6">
        <SessionBar />
        <header className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <p className="text-xs uppercase tracking-[0.14em] text-cyan-300">Mi cuenta</p>
          <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
            Cambiar contraseña
          </h1>
        </header>

        {error && <p role="alert" className="rounded-md border border-rose-900 bg-rose-950/60 px-3 py-2 text-sm text-rose-200">{error}</p>}
        {successMessage && <p role="status" className="rounded-md border border-emerald-900 bg-emerald-950/60 px-3 py-2 text-sm text-emerald-200">{successMessage}</p>}

        <form onSubmit={handleSubmit} className="grid gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <label className="grid gap-1 text-sm">
            <span className="text-slate-300">Contraseña actual</span>
            <input
              type="password"
              name="current-password"
              autoComplete="current-password"
              required
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-cyan-500"
            />
          </label>
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
            <span className="text-slate-300">Confirmar nueva contraseña</span>
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
          <button
            type="submit"
            disabled={isSubmitting}
            className="justify-self-start rounded-md bg-cyan-500 px-4 py-2 font-semibold text-slate-950 hover:bg-cyan-400 disabled:opacity-60"
          >
            {isSubmitting ? "Actualizando..." : "Guardar contraseña"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default function ChangePasswordPage() {
  return (
    <PrivateRoute>
      <ChangePasswordContent />
    </PrivateRoute>
  );
}