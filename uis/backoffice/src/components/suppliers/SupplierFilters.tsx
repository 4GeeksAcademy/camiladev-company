"use client";

import { useState } from "react";

import type { SupplierFilters } from "@/types/suppliers";
import { VALID_CATEGORIES, VALID_COUNTRY } from "@/types/suppliers";

interface SupplierFiltersProps {
  filters: SupplierFilters;
  isLoading: boolean;
  onChange: (nextFilters: SupplierFilters) => void;
}

export function SupplierFilters({
  filters,
  isLoading,
  onChange,
}: SupplierFiltersProps) {
  const [draftCountry, setDraftCountry] = useState<string>(filters.country ?? "");
  const [draftCategory, setDraftCategory] = useState<string>(filters.category ?? "");

  const applyFilters = () => {
    onChange({
      country: draftCountry as SupplierFilters["country"],
      category: draftCategory as SupplierFilters["category"],
    });
  };

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
      <h2 className="text-sm font-semibold text-white">Filtros</h2>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-xs text-slate-300">
          País
          <select
            value={draftCountry}
            onChange={(event) => setDraftCountry(event.target.value)}
            disabled={isLoading}
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
          >
            <option value="">Todos</option>
            {VALID_COUNTRY.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-xs text-slate-300">
          Categoría
          <select
            value={draftCategory}
            onChange={(event) => setDraftCategory(event.target.value)}
            disabled={isLoading}
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
          >
            <option value="">Todas</option>
            {VALID_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-3">
        <button
          type="button"
          onClick={applyFilters}
          disabled={isLoading}
          className="inline-flex items-center rounded-full bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Filtrar
        </button>
      </div>
    </section>
  );
}
