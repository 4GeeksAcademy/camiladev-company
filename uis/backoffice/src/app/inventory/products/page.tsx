"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { PrivateRoute } from "@/components/auth/PrivateRoute";
import { getInventoryProducts } from "@/lib/inventory";
import type { Asset, Office } from "@/lib/inventory";

const LOW_STOCK_THRESHOLD = 5;

const categoryLabels: Record<Asset["category"], string> = {
  hardware: "Hardware",
  peripherals: "Periféricos",
  office_supplies: "Suministros de oficina",
  training_materials: "Materiales de formación",
};

function stockStatus(stock: number) {
  if (stock <= 0) {
    return {
      label: stock < 0 ? "Revisar stock" : "Agotado",
      className: "border-rose-300/40 bg-rose-300/10 text-rose-200",
      markerClassName: "bg-rose-300",
    };
  }

  if (stock <= LOW_STOCK_THRESHOLD) {
    return {
      label: "Bajo",
      className: "border-amber-300/40 bg-amber-300/10 text-amber-200",
      markerClassName: "bg-amber-300",
    };
  }

  return {
    label: "Disponible",
    className: "border-emerald-300/40 bg-emerald-300/10 text-emerald-200",
    markerClassName: "bg-emerald-300",
  };
}

function ProductsContent() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [office, setOffice] = useState<Office | "">("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAssets = useCallback(async () => {
    setError("");

    try {
      setAssets(await getInventoryProducts(office || undefined));
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "No se pudo cargar el inventario. Inténtalo de nuevo.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [office]);

  useEffect(() => {
    let active = true;

    getInventoryProducts(office || undefined)
      .then((loadedAssets) => {
        if (active) setAssets(loadedAssets);
      })
      .catch((loadError: unknown) => {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "No se pudo cargar el inventario. Inténtalo de nuevo.",
          );
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [office]);

  const lowStockCount = assets.filter(
    (asset) => asset.current_stock > 0 && asset.current_stock <= LOW_STOCK_THRESHOLD,
  ).length;
  const unavailableCount = assets.filter((asset) => asset.current_stock <= 0).length;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="mx-auto grid w-full max-w-7xl gap-5 px-4 py-8 sm:px-6 lg:px-8">
        <header className="border-b border-slate-800 pb-5">
          <p className="eyebrow">Operaciones · Valencia y Miami</p>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1>Stock de activos</h1>
              <p className="muted mt-2">
                Existencias actuales de equipos y materiales por oficina.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link className="button secondary" href="/inventory/orders">
                Ver historial de órdenes
              </Link>
              <button
                type="button"
                className="button secondary"
                disabled={isLoading}
                onClick={() => {
                  setIsLoading(true);
                  void loadAssets();
                }}
              >
                {isLoading ? "Actualizando..." : "Actualizar stock"}
              </button>
            </div>
          </div>
        </header>

        <section aria-label="Resumen de stock" className="metrics">
          <div>
            <span>Activos en vista</span>
            <strong>{isLoading ? "—" : assets.length}</strong>
          </div>
          <div>
            <span>Stock bajo (1–{LOW_STOCK_THRESHOLD})</span>
            <strong className="text-amber-200">{isLoading ? "—" : lowStockCount}</strong>
          </div>
          <div>
            <span>Agotados o por revisar</span>
            <strong className="text-rose-200">{isLoading ? "—" : unavailableCount}</strong>
          </div>
        </section>

        <div className="flex flex-wrap items-end justify-between gap-4 border-y border-slate-800 py-4">
          <label className="w-full max-w-xs">
            Oficina
            <select
              value={office}
              onChange={(event) => {
                setIsLoading(true);
                setOffice(event.target.value as Office | "");
              }}
              disabled={isLoading}
            >
              <option value="">Todas las oficinas</option>
              <option value="Valencia">Valencia</option>
              <option value="Miami">Miami</option>
            </select>
          </label>
          <div aria-label="Leyenda de nivel de stock" className="flex flex-wrap gap-3 text-xs">
            <span className="inline-flex items-center gap-2 text-emerald-200">
              <span aria-hidden="true" className="size-2 rounded-full bg-emerald-300" />
              Disponible: más de {LOW_STOCK_THRESHOLD}
            </span>
            <span className="inline-flex items-center gap-2 text-amber-200">
              <span aria-hidden="true" className="size-2 rounded-full bg-amber-300" />
              Bajo: 1–{LOW_STOCK_THRESHOLD}
            </span>
            <span className="inline-flex items-center gap-2 text-rose-200">
              <span aria-hidden="true" className="size-2 rounded-full bg-rose-300" />
              Agotado: 0
            </span>
          </div>
        </div>

        {error && (
          <div role="alert" className="notice error mb-0">
            <p>{error}</p>
            <button
              type="button"
              className="button secondary"
              disabled={isLoading}
              onClick={() => {
                setIsLoading(true);
                void loadAssets();
              }}
            >
              Reintentar
            </button>
          </div>
        )}

        <section aria-label="Productos y stock" aria-busy={isLoading}>
          {isLoading ? (
            <div className="loading" role="status">
              <span className="spinner" aria-hidden="true" />
              Consultando activos y existencias...
            </div>
          ) : assets.length === 0 ? (
            <div className="empty">
              <h2>No hay activos en esta oficina</h2>
              <p>Prueba otra oficina o vuelve a consultar el inventario.</p>
            </div>
          ) : (
            <>
              <p className="list-caption">
                <span>{assets.length} {assets.length === 1 ? "activo" : "activos"}</span>
                <span>El stock se calcula a partir de entradas y salidas.</span>
              </p>
              <div className="table-wrap">
                <table>
                  <caption className="sr-only">
                    Activos de inventario y stock actual por oficina
                  </caption>
                  <thead>
                    <tr>
                      <th scope="col">ID</th>
                      <th scope="col">Activo</th>
                      <th scope="col">Categoría</th>
                      <th scope="col">Oficina</th>
                      <th scope="col">Stock actual</th>
                      <th scope="col">Registrar orden</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assets.map((asset) => {
                      const status = stockStatus(asset.current_stock);

                      return (
                        <tr key={asset.id}>
                          <td className="tabular-nums">{asset.id}</td>
                          <td>
                            <span className="block font-semibold text-white">{asset.name}</span>
                            <span className="mt-1 block font-mono text-xs text-slate-400">
                              {asset.sku}
                            </span>
                          </td>
                          <td>
                            <span className="badge">{categoryLabels[asset.category]}</span>
                          </td>
                          <td>{asset.office}</td>
                          <td>
                            <span className={`inline-flex w-fit min-w-40 shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 text-xs font-semibold ${status.className}`}>
                              <span aria-hidden="true" className={`size-2 shrink-0 rounded-full ${status.markerClassName}`} />
                              <span className="sr-only">Nivel de stock: </span>
                              <span className="shrink-0 whitespace-nowrap tabular-nums">{asset.current_stock}</span>
                              <span className="shrink-0 whitespace-nowrap">{status.label}</span>
                            </span>
                          </td>
                          <td>
                            <div className="flex flex-wrap gap-2">
                              <Link
                                className="text-button"
                                href={`/inventory/orders/inbound?asset_id=${asset.id}`}
                                aria-label={`Registrar entrada para ${asset.name} (${asset.sku})`}
                              >
                                Registrar entrada
                              </Link>
                              <Link
                                className="text-button"
                                href={`/inventory/orders/outbound?asset_id=${asset.id}`}
                                aria-label={`Registrar salida para ${asset.name} (${asset.sku})`}
                              >
                                Registrar salida
                              </Link>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </section>
      </section>
    </main>
  );
}

export default function InventoryProductsPage() {
  return (
    <PrivateRoute>
      <ProductsContent />
    </PrivateRoute>
  );
}