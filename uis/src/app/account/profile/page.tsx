"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";

import { PrivateRoute } from "@/components/auth/PrivateRoute";
import { SessionBar } from "@/components/auth/SessionBar";
import { getCurrentUser, updateMyProfile } from "@/lib/auth-api";
import type { AuthUser, ProfileUpdateInput } from "@/types/auth";

const EDITABLE_FIELDS: Array<{
  name: keyof ProfileUpdateInput;
  label: string;
  type: string;
  autoComplete: string;
}> = [
  { name: "name", label: "Nombre", type: "text", autoComplete: "name" },
  { name: "phone", label: "Teléfono", type: "tel", autoComplete: "tel" },
  { name: "address", label: "Dirección", type: "text", autoComplete: "street-address" },
];

function ProfileContent() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [form, setForm] = useState<ProfileUpdateInput>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const loadUser = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setForm({
        name: currentUser.profile?.name ?? "",
        phone: currentUser.profile?.phone ?? "",
        address: currentUser.profile?.address ?? "",
      });
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "No se pudo cargar el perfil",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadUser();
  }, [loadUser]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsSaving(true);

    try {
      const profile = await updateMyProfile({
        name: form.name?.trim() || undefined,
        phone: form.phone?.trim() || undefined,
        address: form.address?.trim() || undefined,
      });

      setUser((current) => (current ? { ...current, profile } : current));
      setSuccessMessage("Perfil actualizado correctamente");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "No se pudo actualizar el perfil",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="mx-auto grid w-full max-w-3xl gap-4 px-4 py-8 sm:px-6">
        <SessionBar email={user?.email} />

        <header className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <p className="text-xs uppercase tracking-[0.14em] text-cyan-300">Mi cuenta</p>
          <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">Perfil</h1>
          <p className="mt-2 text-sm text-slate-300">
            Email: <span className="text-slate-100">{user?.email ?? "—"}</span>
          </p>
          {user?.role && (
            <p className="mt-1 text-sm text-slate-400">Rol: {user.role}</p>
          )}
        </header>

        {error && (
          <p
            role="alert"
            className="rounded-md border border-rose-900 bg-rose-950/60 px-3 py-2 text-sm text-rose-200"
          >
            {error}
          </p>
        )}

        {successMessage && (
          <p className="rounded-md border border-emerald-900 bg-emerald-950/60 px-3 py-2 text-sm text-emerald-200">
            {successMessage}
          </p>
        )}

        {isLoading ? (
          <p className="text-sm text-slate-400">Cargando perfil...</p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="grid gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-5"
          >
            {EDITABLE_FIELDS.map((field) => (
              <label key={field.name} className="grid gap-1 text-sm">
                <span className="text-slate-300">{field.label}</span>
                <input
                  type={field.type}
                  name={field.name}
                  autoComplete={field.autoComplete}
                  value={form[field.name] ?? ""}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      [field.name]: event.target.value,
                    }))
                  }
                  className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-cyan-500"
                />
              </label>
            ))}

            <button
              type="submit"
              disabled={isSaving}
              className="justify-self-start rounded-md bg-cyan-500 px-4 py-2 font-semibold text-slate-950 hover:bg-cyan-400 disabled:opacity-60"
            >
              {isSaving ? "Guardando..." : "Guardar cambios"}
            </button>
          </form>
        )}
      </section>
    </main>
  );
}

export default function ProfilePage() {
  return (
    <PrivateRoute>
      <ProfileContent />
    </PrivateRoute>
  );
}
