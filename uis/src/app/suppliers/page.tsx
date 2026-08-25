"use client";

import { SupplierFilters } from "@/components/suppliers/SupplierFilters";
import { SupplierForm } from "@/components/suppliers/SupplierForm";
import { SupplierTable } from "@/components/suppliers/SupplierTable";
import { useSuppliers } from "@/hooks/useSuppliers";
import type { SupplierCreateInput, SupplierStatus } from "@/types/suppliers";

export default function SuppliersPage() {
  const {
    suppliers,
    filters,
    isLoading,
    error,
    setError,
    onFilterChange,
    onCreateSupplier,
    onPatchRate,
    onPatchStatus,
    onDeleteSupplier,
  } = useSuppliers();

  const handleCreateSupplier = async (payload: SupplierCreateInput) => {
    setError("");
    await onCreateSupplier(payload);
  };

  const handlePatchRate = async (supplierId: number, monthlyRate: number) => {
    setError("");
    await onPatchRate(supplierId, monthlyRate);
  };

  const handlePatchStatus = async (supplierId: number, status: SupplierStatus) => {
    setError("");
    await onPatchStatus(supplierId, status);
  };

  const handleDeleteSupplier = async (supplierId: number) => {
    setError("");
    await onDeleteSupplier(supplierId);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="mx-auto grid w-full max-w-7xl gap-4 px-4 py-8 sm:px-6 lg:px-8">
        <header className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <p className="text-xs uppercase tracking-[0.14em] text-cyan-300">
            Directorio de proveedores
          </p>
          <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
            Gestión de proveedores
          </h1>
          <p className="mt-2 text-sm text-slate-300">
            Consulta, filtra y administra proveedores consumiendo la API de backend.
          </p>
        </header>

        {error && (
          <p className="rounded-md border border-rose-900 bg-rose-950/60 px-3 py-2 text-sm text-rose-200">
            {error}
          </p>
        )}

        <SupplierTable
          suppliers={suppliers}
          isLoading={isLoading}
          onPatchRate={handlePatchRate}
          onPatchStatus={handlePatchStatus}
          onDeleteSupplier={handleDeleteSupplier}
        />

        <SupplierFilters
          filters={filters}
          isLoading={isLoading}
          onChange={onFilterChange}
        />

        <SupplierForm onSubmit={handleCreateSupplier} />
      </section>
    </main>
  );
}
