"use client";

import { useCallback, useEffect, useState } from "react";

import {
  createSupplier,
  deleteSupplier,
  getSuppliers,
  patchSupplierRate,
  patchSupplierStatus,
} from "@/lib/suppliers-api";
import type {
  Supplier,
  SupplierCreateInput,
  SupplierFilters,
  SupplierStatus,
} from "@/types/suppliers";

export function useSuppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [filters, setFilters] = useState<SupplierFilters>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const loadSuppliers = useCallback(async (nextFilters: SupplierFilters) => {
    setIsLoading(true);
    setError("");

    try {
      const data = await getSuppliers(nextFilters);
      setSuppliers(data);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "No se pudo cargar el directorio de proveedores",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadSuppliers({});
  }, [loadSuppliers]);

  const upsertSupplier = (updatedSupplier: Supplier) => {
    setSuppliers((currentSuppliers) =>
      currentSuppliers.map((supplier) =>
        supplier.id === updatedSupplier.id ? updatedSupplier : supplier,
      ),
    );
  };

  const onFilterChange = (nextFilters: SupplierFilters) => {
    setFilters(nextFilters);
    void loadSuppliers(nextFilters);
  };

  const onCreateSupplier = async (payload: SupplierCreateInput) => {
    const createdSupplier = await createSupplier(payload);

    const currentCountry = filters.country;
    const currentCategory = filters.category;

    const countryMatches = !currentCountry || createdSupplier.country === currentCountry;
    const categoryMatches =
      !currentCategory || createdSupplier.categories.includes(currentCategory);

    if (countryMatches && categoryMatches) {
      setSuppliers((currentSuppliers) => [createdSupplier, ...currentSuppliers]);
    }

    return createdSupplier;
  };

  const onPatchRate = async (supplierId: number, monthlyRate: number) => {
    const updatedSupplier = await patchSupplierRate(supplierId, monthlyRate);
    upsertSupplier(updatedSupplier);
    return updatedSupplier;
  };

  const onPatchStatus = async (supplierId: number, status: SupplierStatus) => {
    const updatedSupplier = await patchSupplierStatus(supplierId, status);
    upsertSupplier(updatedSupplier);
    return updatedSupplier;
  };

  const onDeleteSupplier = async (supplierId: number) => {
    await deleteSupplier(supplierId);
    setSuppliers((currentSuppliers) =>
      currentSuppliers.filter((supplier) => supplier.id !== supplierId),
    );
  };

  return {
    suppliers,
    filters,
    isLoading,
    error,
    setError,
    loadSuppliers,
    onFilterChange,
    onCreateSupplier,
    onPatchRate,
    onPatchStatus,
    onDeleteSupplier,
  };
}
