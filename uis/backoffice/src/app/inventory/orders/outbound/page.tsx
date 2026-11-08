"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState, type FormEvent } from "react";

import { PrivateRoute } from "@/components/auth/PrivateRoute";
import {
  createInventoryExit,
  getInventoryProduct,
  getInventoryProducts,
  InventoryApiError,
} from "@/lib/inventory";
import type { Asset, AssetExitCreate } from "@/lib/inventory";

function OutboundOrderContent() {
  const searchParams = useSearchParams();
  const initialAssetId = searchParams.get("asset_id") ?? "";
  const [assets, setAssets] = useState<Asset[]>([]);
  const [assetId, setAssetId] = useState(initialAssetId);
  const [currentStock, setCurrentStock] = useState<number | null>(null);
  const [isStockLoading, setIsStockLoading] = useState(Boolean(initialAssetId));
  const [assetLoadError, setAssetLoadError] = useState("");
  const [stockError, setStockError] = useState("");
  const [quantity, setQuantity] = useState("");
  const [exitType, setExitType] = useState<"allocation" | "consumption">("allocation");
  const [assignedTo, setAssignedTo] = useState("");
  const [quantityError, setQuantityError] = useState("");
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoadingAssets, setIsLoadingAssets] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assetLoadAttempt, setAssetLoadAttempt] = useState(0);

  useEffect(() => {
    let active = true;

    getInventoryProducts()
      .then((loadedAssets) => {
        if (active) setAssets(loadedAssets);
      })
      .catch((error: unknown) => {
        if (active) {
          setAssetLoadError(
            error instanceof Error
              ? error.message
              : "No se pudo cargar la lista de activos. Inténtalo de nuevo.",
          );
        }
      })
      .finally(() => {
        if (active) setIsLoadingAssets(false);
      });

    return () => {
      active = false;
    };
  }, [assetLoadAttempt]);

  useEffect(() => {
    if (!assetId) return;

    let active = true;

    getInventoryProduct(Number(assetId))
      .then((asset) => {
        if (active) {
          setCurrentStock(asset.current_stock);
          setStockError("");
        }
      })
      .catch((error: unknown) => {
        if (active) {
          setCurrentStock(null);
          setStockError(
            error instanceof Error
              ? error.message
              : "No se pudo consultar el stock actual. Inténtalo de nuevo.",
          );
        }
      })
      .finally(() => {
        if (active) setIsStockLoading(false);
      });

    return () => {
      active = false;
    };
  }, [assetId]);

  const selectedAsset = assets.find((asset) => asset.id === Number(assetId));
  const parsedQuantity = Number(quantity);
  const hasQuantity = quantity.trim() !== "";
  const quantityIsValid = Number.isSafeInteger(parsedQuantity) && parsedQuantity > 0;
  const exceedsStock =
    hasQuantity && currentStock !== null && quantityIsValid && parsedQuantity > currentStock;

  const handleAssetChange = (nextAssetId: string) => {
    setAssetId(nextAssetId);
    setCurrentStock(null);
    setIsStockLoading(Boolean(nextAssetId));
    setStockError("");
    setQuantity("");
    setQuantityError("");
    setFormError("");
    setSuccess("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setQuantityError("");
    setFormError("");
    setSuccess("");

    if (!selectedAsset) {
      setFormError("Selecciona un activo para registrar la salida.");
      return;
    }
    if (currentStock === null) {
      setFormError("Espera a que se consulte el stock actual antes de registrar la salida.");
      return;
    }
    if (!quantityIsValid) {
      setQuantityError("La cantidad debe ser un número entero mayor que cero.");
      return;
    }
    if (exceedsStock) {
      setQuantityError(`La cantidad supera el stock disponible (${currentStock} unidades).`);
      return;
    }
    if (exitType === "allocation" && !assignedTo.trim()) {
      setFormError("Indica a quién se asignará el activo.");
      return;
    }

    const payload: AssetExitCreate = exitType === "allocation"
      ? {
          asset_id: selectedAsset.id,
          quantity: parsedQuantity,
          exit_type: "allocation",
          assigned_to: assignedTo.trim(),
          office: selectedAsset.office,
        }
      : {
          asset_id: selectedAsset.id,
          quantity: parsedQuantity,
          exit_type: "consumption",
          assigned_to: null,
          office: selectedAsset.office,
        };

    setIsSubmitting(true);
    try {
      await createInventoryExit(payload);
      setSuccess(`Salida registrada para ${selectedAsset.name} (${selectedAsset.sku}).`);
      setAssetId("");
      setCurrentStock(null);
      setQuantity("");
      setAssignedTo("");
      setExitType("allocation");
    } catch (error) {
      if (error instanceof InventoryApiError && error.status === 400) {
        setQuantityError(error.message);
      } else {
        setFormError(
          error instanceof Error
            ? error.message
            : "No se pudo registrar la salida. Inténtalo de nuevo.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const retryAssetLoad = () => {
    setAssetLoadError("");
    setIsLoadingAssets(true);
    setAssetLoadAttempt((attempt) => attempt + 1);
  };

  return (
    <PrivateRoute>
      <main className="min-h-screen bg-slate-950 text-slate-100">
        <section className="mx-auto grid w-full max-w-7xl gap-5 px-4 py-8 sm:px-6 lg:px-8">
          <header className="border-b border-slate-800 pb-5">
            <p className="eyebrow">Inventario · Salida de activos</p>
            <h1>Registrar consumo o asignación</h1>
            <p className="muted mt-2">
              Consulta el stock actual antes de registrar una salida.
            </p>
          </header>

          <Link className="back-link" href="/inventory/products">
            Volver al stock de activos
          </Link>

          {assetLoadError && (
            <div className="notice error" role="alert">
              <p>{assetLoadError}</p>
              <button
                className="button secondary"
                type="button"
                disabled={isLoadingAssets}
                onClick={retryAssetLoad}
              >
                Reintentar carga de activos
              </button>
            </div>
          )}

          {formError && <p className="notice error" role="alert">{formError}</p>}
          {success && <p className="notice success" role="status">{success}</p>}

          <form className="candidate-form" onSubmit={handleSubmit} noValidate>
            <div className="form-grid">
              <label htmlFor="asset_id">
                Activo
                <select
                  id="asset_id"
                  name="asset_id"
                  value={assetId}
                  onChange={(event) => handleAssetChange(event.target.value)}
                  required
                  disabled={isLoadingAssets || Boolean(assetLoadError) || isSubmitting}
                >
                  <option value="">
                    {isLoadingAssets ? "Cargando activos..." : "Selecciona un activo"}
                  </option>
                  {assets.map((asset) => (
                    <option key={asset.id} value={asset.id}>
                      {asset.name} · {asset.sku} · {asset.office}
                    </option>
                  ))}
                </select>
              </label>

              <div aria-live="polite" className="flex min-h-20 flex-col justify-center gap-2 border-y border-slate-800 py-3">
                <span className="text-sm font-semibold text-slate-200">Stock disponible actual</span>
                {isStockLoading ? (
                  <span className="muted" role="status">Consultando stock...</span>
                ) : stockError ? (
                  <span className="text-sm text-rose-200" role="alert">{stockError}</span>
                ) : currentStock !== null ? (
                  <span className={`text-xl font-bold tabular-nums ${currentStock > 0 ? "text-emerald-200" : "text-rose-200"}`}>
                    {currentStock} unidades
                  </span>
                ) : (
                  <span className="muted">Selecciona un activo para consultar su stock.</span>
                )}
              </div>

              <label htmlFor="quantity">
                Cantidad de salida
                <input
                  id="quantity"
                  name="quantity"
                  type="number"
                  inputMode="numeric"
                  min="1"
                  step="1"
                  value={quantity}
                  onChange={(event) => {
                    setQuantity(event.target.value);
                    setQuantityError("");
                  }}
                  required
                  disabled={!selectedAsset || currentStock === null || isStockLoading || isSubmitting}
                  aria-invalid={Boolean(quantityError || exceedsStock)}
                  aria-describedby={quantityError || exceedsStock ? "quantity-error" : "quantity-help"}
                  placeholder="Ej.: 2"
                />
                {quantityError || exceedsStock ? (
                  <span id="quantity-error" className="text-sm font-normal text-rose-200" role="alert">
                    {quantityError || `La cantidad supera el stock disponible (${currentStock} unidades).`}
                  </span>
                ) : (
                  <span id="quantity-help" className="text-xs font-normal text-slate-400">
                    Disponible: {currentStock === null ? "—" : currentStock} unidades.
                  </span>
                )}
              </label>

              <label htmlFor="exit_type">
                Tipo de salida
                <select
                  id="exit_type"
                  name="exit_type"
                  value={exitType}
                  onChange={(event) => {
                    const nextType = event.target.value as "allocation" | "consumption";
                    setExitType(nextType);
                    setAssignedTo("");
                    setFormError("");
                  }}
                  disabled={isSubmitting}
                >
                  <option value="allocation">Asignación</option>
                  <option value="consumption">Consumo</option>
                </select>
              </label>

              {exitType === "allocation" && (
                <label htmlFor="assigned_to">
                  Asignar a
                  <input
                    id="assigned_to"
                    name="assigned_to"
                    type="text"
                    value={assignedTo}
                    onChange={(event) => setAssignedTo(event.target.value)}
                    required
                    maxLength={200}
                    disabled={isSubmitting}
                    placeholder="Nombre o ID del empleado"
                  />
                </label>
              )}

              <label htmlFor="office">
                Oficina
                <input
                  id="office"
                  value={selectedAsset?.office ?? "Se asigna según el activo seleccionado"}
                  readOnly
                />
              </label>
            </div>

            <div className="actions">
              <button
                className="button"
                type="submit"
                disabled={
                  isLoadingAssets
                  || Boolean(assetLoadError)
                  || !selectedAsset
                  || currentStock === null
                  || isStockLoading
                  || isSubmitting
                  || !quantityIsValid
                  || exceedsStock
                  || (exitType === "allocation" && !assignedTo.trim())
                }
              >
                {isSubmitting ? "Registrando salida..." : "Registrar salida"}
              </button>
              {exceedsStock && currentStock !== null && (
                <span className="text-sm text-amber-200" role="status">
                  Reduce la cantidad a {currentStock} unidades o menos.
                </span>
              )}
              {assets.length === 0 && !isLoadingAssets && !assetLoadError && (
                <span className="muted" role="status">
                  No hay activos disponibles para registrar una salida.
                </span>
              )}
            </div>
          </form>
        </section>
      </main>
    </PrivateRoute>
  );
}

function OutboundOrderFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 text-sm text-slate-300">
      Cargando formulario de salida...
    </div>
  );
}

export default function OutboundOrderPage() {
  return (
    <Suspense fallback={<OutboundOrderFallback />}>
      <OutboundOrderContent />
    </Suspense>
  );
}