"use client";

import { useState } from "react";

import type { SupplierCreateInput } from "@/types/suppliers";
import {
  VALID_CATEGORIES,
  VALID_COUNTRY,
  VALID_CURRENCIES,
  VALID_STATUS,
} from "@/types/suppliers";

interface SupplierFormProps {
  onSubmit: (payload: SupplierCreateInput) => Promise<void>;
}

interface SupplierFormState {
  name: string;
  country: (typeof VALID_COUNTRY)[number];
  categories: string[];
  monthly_rate: string;
  currency: (typeof VALID_CURRENCIES)[number];
  status: (typeof VALID_STATUS)[number];
  contract_renewal_date: string;
  contact_email: string;
  notes: string;
}

const INITIAL_STATE: SupplierFormState = {
  name: "",
  country: "Spain",
  categories: [VALID_CATEGORIES[0]],
  monthly_rate: "",
  currency: "EUR",
  status: "active",
  contract_renewal_date: "",
  contact_email: "",
  notes: "",
};

export function SupplierForm({ onSubmit }: SupplierFormProps) {
  const [form, setForm] = useState<SupplierFormState>(INITIAL_STATE);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const toggleCategory = (category: string) => {
    setForm((current) => {
      const exists = current.categories.includes(category);

      if (exists) {
        return {
          ...current,
          categories: current.categories.filter((item) => item !== category),
        };
      }

      return {
        ...current,
        categories: [...current.categories, category],
      };
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (form.categories.length === 0) {
      setError("Debes seleccionar al menos una categoría.");
      return;
    }

    setIsSaving(true);

    try {
      await onSubmit({
        name: form.name,
        country: form.country,
        categories: form.categories as SupplierCreateInput["categories"],
        monthly_rate: Number(form.monthly_rate),
        currency: form.currency,
        status: form.status,
        contract_renewal_date: form.contract_renewal_date || null,
        contact_email: form.contact_email || null,
        notes: form.notes || null,
      });

      setForm(INITIAL_STATE);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "No se pudo registrar el proveedor",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
      <h2 className="text-sm font-semibold text-white">Registrar proveedor</h2>

      <form onSubmit={handleSubmit} className="mt-3 grid gap-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-xs text-slate-300">
            Nombre
            <input
              required
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
            />
          </label>

          <label className="flex flex-col gap-1 text-xs text-slate-300">
            País
            <select
              required
              value={form.country}
              onChange={(event) =>
                setForm({
                  ...form,
                  country: event.target.value as SupplierFormState["country"],
                })
              }
              className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
            >
              {VALID_COUNTRY.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1 text-xs text-slate-300">
            Tarifa mensual
            <input
              type="number"
              step="0.01"
              min="0.01"
              required
              value={form.monthly_rate}
              onChange={(event) =>
                setForm({ ...form, monthly_rate: event.target.value })
              }
              className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
            />
          </label>

          <label className="flex flex-col gap-1 text-xs text-slate-300">
            Moneda
            <select
              required
              value={form.currency}
              onChange={(event) =>
                setForm({
                  ...form,
                  currency: event.target.value as SupplierFormState["currency"],
                })
              }
              className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
            >
              {VALID_CURRENCIES.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1 text-xs text-slate-300">
            Estado
            <select
              required
              value={form.status}
              onChange={(event) =>
                setForm({
                  ...form,
                  status: event.target.value as SupplierFormState["status"],
                })
              }
              className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
            >
              {VALID_STATUS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1 text-xs text-slate-300">
            Renovación de contrato
            <input
              type="date"
              value={form.contract_renewal_date}
              onChange={(event) =>
                setForm({ ...form, contract_renewal_date: event.target.value })
              }
              className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
            />
          </label>
        </div>

        <fieldset className="rounded-lg border border-slate-800 p-3">
          <legend className="px-1 text-xs text-slate-300">Categorías</legend>
          <div className="mt-1 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {VALID_CATEGORIES.map((category) => (
              <label
                key={category}
                className="inline-flex items-center gap-2 text-xs text-slate-300"
              >
                <input
                  type="checkbox"
                  checked={form.categories.includes(category)}
                  onChange={() => toggleCategory(category)}
                  className="h-4 w-4 accent-cyan-400"
                />
                {category}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-xs text-slate-300">
            Correo de contacto
            <input
              type="email"
              value={form.contact_email}
              onChange={(event) =>
                setForm({ ...form, contact_email: event.target.value })
              }
              className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
            />
          </label>

          <label className="flex flex-col gap-1 text-xs text-slate-300">
            Notas
            <input
              value={form.notes}
              onChange={(event) => setForm({ ...form, notes: event.target.value })}
              className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
            />
          </label>
        </div>

        {error && (
          <p className="rounded-md border border-rose-900 bg-rose-950/60 px-3 py-2 text-xs text-rose-200">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex w-fit items-center rounded-full bg-cyan-300 px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? "Guardando..." : "Crear proveedor"}
        </button>
      </form>
    </section>
  );
}
