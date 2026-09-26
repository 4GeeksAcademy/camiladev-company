"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { ApiError, login, register } from "@/lib/auth-api";
import type { FieldErrors, RegisterInput } from "@/types/auth";

const HOME_ROUTE = "/suppliers";

const EMPTY_FORM: RegisterInput = {
  email: "",
  password: "",
  name: "",
  phone: "",
  address: "",
};

function validate(form: RegisterInput): FieldErrors<RegisterInput> {
  const errors: FieldErrors<RegisterInput> = {};

  if (!form.email.trim()) {
    errors.email = "El email es obligatorio";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = "Introduce un email válido";
  }

  if (!form.password) {
    errors.password = "La contraseña es obligatoria";
  } else if (form.password.length < 8) {
    errors.password = "La contraseña debe tener al menos 8 caracteres";
  }

  return errors;
}

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState<RegisterInput>(EMPTY_FORM);
  const [errors, setErrors] = useState<FieldErrors<RegisterInput>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field: keyof RegisterInput, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = validate(form);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    const credentials = {
      email: form.email.trim(),
      password: form.password,
    };

    try {
      await register({
        ...credentials,
        name: form.name?.trim() || undefined,
        phone: form.phone?.trim() || undefined,
        address: form.address?.trim() || undefined,
      });

      await login(credentials);
      router.replace(HOME_ROUTE);
    } catch (requestError) {
      if (requestError instanceof ApiError) {
        const fieldErrors: FieldErrors<RegisterInput> = {};

        for (const [field, message] of Object.entries(requestError.fieldErrors)) {
          if (field in EMPTY_FORM) {
            fieldErrors[field as keyof RegisterInput] = message;
          }
        }

        if (Object.keys(fieldErrors).length === 0) {
          fieldErrors.form = requestError.message;
        }

        setErrors(fieldErrors);
        return;
      }

      setErrors({
        form:
          requestError instanceof Error
            ? requestError.message
            : "No se pudo crear la cuenta",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const fields: Array<{
    name: keyof RegisterInput;
    label: string;
    type: string;
    autoComplete: string;
    optional?: boolean;
  }> = [
    { name: "email", label: "Email", type: "email", autoComplete: "email" },
    {
      name: "password",
      label: "Contraseña",
      type: "password",
      autoComplete: "new-password",
    },
    { name: "name", label: "Nombre", type: "text", autoComplete: "name", optional: true },
    { name: "phone", label: "Teléfono", type: "tel", autoComplete: "tel", optional: true },
    {
      name: "address",
      label: "Dirección",
      type: "text",
      autoComplete: "street-address",
      optional: true,
    },
  ];

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10 text-slate-100">
      <section className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
        <h1 className="text-2xl font-bold text-white">Crear cuenta</h1>
        <p className="mt-1 text-sm text-slate-400">
          Los datos de perfil son opcionales y podrás editarlos más tarde.
        </p>

        <form className="mt-6 grid gap-4" onSubmit={handleSubmit} noValidate>
          {fields.map((field) => (
            <label key={field.name} className="grid gap-1 text-sm">
              <span className="text-slate-300">
                {field.label}
                {field.optional && (
                  <span className="ml-1 text-xs text-slate-500">(opcional)</span>
                )}
              </span>
              <input
                type={field.type}
                name={field.name}
                autoComplete={field.autoComplete}
                value={form[field.name] ?? ""}
                onChange={(event) => updateField(field.name, event.target.value)}
                aria-invalid={Boolean(errors[field.name])}
                className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-cyan-500"
              />
              {errors[field.name] && (
                <span className="text-xs text-rose-300">{errors[field.name]}</span>
              )}
            </label>
          ))}

          {errors.form && (
            <p
              role="alert"
              className="rounded-md border border-rose-900 bg-rose-950/60 px-3 py-2 text-sm text-rose-200"
            >
              {errors.form}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-cyan-500 px-4 py-2 font-semibold text-slate-950 hover:bg-cyan-400 disabled:opacity-60"
          >
            {isSubmitting ? "Creando cuenta..." : "Registrarme"}
          </button>
        </form>

        <p className="mt-4 text-sm text-slate-400">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-cyan-300 hover:underline">
            Inicia sesión
          </Link>
        </p>
      </section>
    </main>
  );
}
