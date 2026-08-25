"use client";

import { useMemo, useState } from "react";

import type { Supplier, SupplierStatus } from "@/types/suppliers";

interface SupplierTableProps {
  suppliers: Supplier[];
  isLoading: boolean;
  onPatchRate: (supplierId: number, monthlyRate: number) => Promise<void>;
  onPatchStatus: (supplierId: number, status: SupplierStatus) => Promise<void>;
  onDeleteSupplier: (supplierId: number) => Promise<void>;
}

function statusBadgeClass(status: SupplierStatus): string {
  if (status === "active") {
    return "border-emerald-700/70 bg-emerald-950/60 text-emerald-200";
  }

  return "border-amber-700/70 bg-amber-950/60 text-amber-200";
}

export function SupplierTable({
  suppliers,
  isLoading,
  onPatchRate,
  onPatchStatus,
  onDeleteSupplier,
}: SupplierTableProps) {
  const [error, setError] = useState<string>("");
  const [busyRowId, setBusyRowId] = useState<number | null>(null);

  const [draftRates, setDraftRates] = useState<Record<number, string>>({});
  const [draftStatuses, setDraftStatuses] = useState<Record<number, SupplierStatus>>({});

  const rows = useMemo(
    () =>
      suppliers.map((supplier) => ({
        ...supplier,
        draftRate:
          draftRates[supplier.id] !== undefined
            ? draftRates[supplier.id]
            : String(supplier.monthly_rate),
        draftStatus: draftStatuses[supplier.id] ?? supplier.status,
      })),
    [draftRates, draftStatuses, suppliers],
  );

  const runRowAction = async (supplierId: number, action: () => Promise<void>) => {
    setError("");
    setBusyRowId(supplierId);

    try {
      await action();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "No se pudo ejecutar la acción sobre el proveedor",
      );
    } finally {
      setBusyRowId(null);
    }
  };

  const stringifyValue = (value: unknown): string => {
    if (Array.isArray(value)) {
      return value.join(", ");
    }

    if (value === null || value === undefined || value === "") {
      return "-";
    }

    return String(value);
  };

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white">Listado de proveedores</h2>
        <span className="text-xs text-slate-400">{suppliers.length} registros</span>
      </div>

      {error && (
        <p className="mb-3 rounded-md border border-rose-900 bg-rose-950/60 px-3 py-2 text-xs text-rose-200">
          {error}
        </p>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-y-2 text-left text-sm text-slate-200">
          <thead>
            <tr className="text-xs uppercase tracking-[0.14em] text-slate-400">
              <th className="px-3 py-1">Proveedor</th>
              <th className="px-3 py-1">Registro (clave: valor)</th>
              <th className="px-3 py-1">Editar tarifa (PATCH)</th>
              <th className="px-3 py-1">Estado</th>
              <th className="px-3 py-1">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((supplier) => (
              <tr
                key={supplier.id}
                className="rounded-xl border border-slate-800 bg-slate-950/70 align-top"
              >
                <td className="px-3 py-3">
                  <p className="font-medium text-white">{supplier.name}</p>
                  <p className="mt-1 text-xs text-slate-400">id: {supplier.id}</p>
                </td>

                <td className="px-3 py-3">
                  <div className="grid gap-1 text-xs text-slate-300">
                    <p>
                      <span className="font-semibold text-slate-100">name:</span>{" "}
                      {stringifyValue(supplier.name)}
                    </p>
                    <p>
                      <span className="font-semibold text-slate-100">country:</span>{" "}
                      {stringifyValue(supplier.country)}
                    </p>
                    <p>
                      <span className="font-semibold text-slate-100">categories:</span>{" "}
                      {stringifyValue(supplier.categories)}
                    </p>
                    <p>
                      <span className="font-semibold text-slate-100">monthly_rate:</span>{" "}
                      {stringifyValue(supplier.monthly_rate)}
                    </p>
                    <p>
                      <span className="font-semibold text-slate-100">currency:</span>{" "}
                      {stringifyValue(supplier.currency)}
                    </p>
                    <p>
                      <span className="font-semibold text-slate-100">status:</span>{" "}
                      {stringifyValue(supplier.status)}
                    </p>
                    <p>
                      <span className="font-semibold text-slate-100">contract_renewal_date:</span>{" "}
                      {stringifyValue(supplier.contract_renewal_date)}
                    </p>
                    <p>
                      <span className="font-semibold text-slate-100">contact_email:</span>{" "}
                      {stringifyValue(supplier.contact_email)}
                    </p>
                    <p>
                      <span className="font-semibold text-slate-100">notes:</span>{" "}
                      {stringifyValue(supplier.notes)}
                    </p>
                    <p>
                      <span className="font-semibold text-slate-100">updated_at:</span>{" "}
                      {stringifyValue(supplier.updated_at)}
                    </p>
                  </div>
                </td>

                <td className="px-3 py-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.01"
                      value={supplier.draftRate}
                      onChange={(event) =>
                        setDraftRates((current) => ({
                          ...current,
                          [supplier.id]: event.target.value,
                        }))
                      }
                      className="w-28 rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-sm"
                    />
                    <span className="text-xs text-slate-400">{supplier.currency}</span>
                    <button
                      type="button"
                      disabled={busyRowId === supplier.id}
                      onClick={() =>
                        runRowAction(supplier.id, () =>
                          onPatchRate(supplier.id, Number(supplier.draftRate)),
                        )
                      }
                      className="rounded-md border border-slate-700 px-2 py-1 text-xs hover:border-cyan-300 hover:text-cyan-200 disabled:opacity-50"
                    >
                      Actualizar tarifa
                    </button>
                  </div>
                </td>

                <td className="px-3 py-3">
                  <div className="space-y-2">
                    <span
                      className={`inline-flex rounded-full border px-2 py-1 text-xs font-semibold ${statusBadgeClass(
                        supplier.status,
                      )}`}
                    >
                      {supplier.status === "active" ? "Activo" : "Suspendido"}
                    </span>

                    <select
                      value={supplier.draftStatus}
                      onChange={(event) =>
                        setDraftStatuses((current) => ({
                          ...current,
                          [supplier.id]: event.target.value as SupplierStatus,
                        }))
                      }
                      className="block rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-xs"
                    >
                      <option value="active">active</option>
                      <option value="suspended">suspended</option>
                    </select>
                  </div>
                </td>
                <td className="px-3 py-3">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={busyRowId === supplier.id}
                      onClick={() =>
                        runRowAction(supplier.id, () =>
                          onPatchStatus(supplier.id, supplier.draftStatus),
                        )
                      }
                      className="rounded-md border border-slate-700 px-2 py-1 text-xs hover:border-cyan-300 hover:text-cyan-200 disabled:opacity-50"
                    >
                      Actualizar estado
                    </button>
                    <button
                      type="button"
                      disabled={busyRowId === supplier.id}
                      onClick={() =>
                        runRowAction(supplier.id, () => onDeleteSupplier(supplier.id))
                      }
                      className="rounded-md border border-rose-800 px-2 py-1 text-xs text-rose-200 hover:bg-rose-950/50 disabled:opacity-50"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isLoading && <p className="mt-3 text-xs text-slate-400">Cargando proveedores...</p>}
      {!isLoading && suppliers.length === 0 && (
        <p className="mt-3 text-xs text-slate-400">No hay proveedores para los filtros actuales.</p>
      )}
    </section>
  );
}
