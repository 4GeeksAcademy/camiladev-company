"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState, type FormEvent } from "react";

import { PrivateRoute } from "@/components/auth/PrivateRoute";
import {
  createInventoryEntry,
  getInventoryProducts,
} from "@/lib/inventory";
import type { Asset } from "@/lib/inventory";

function InboundOrderContent() {
  const searchParams = useSearchParams();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [assetId, setAssetId] = useState(() => searchParams.get("asset_id") ?? "");
  const [quantity, setQuantity] = useState("");
  const [supplier, setSupplier] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let active = true;

    getInventoryProducts()
      .then((loadedAssets) => {
        if (active) setAssets(loadedAssets);
      })
      .catch((error: unknown) => {
        if (active) {
          setLoadError(
            error instanceof Error
              ? error.message
              : "No se pudo cargar la lista de activos. Inténtalo de nuevo.",
          );
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const selectedAsset = assets.find((asset) => asset.id === Number(assetId));

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError("");
    setSuccess("");

    const parsedQuantity = Number(quantity);
    if (!selectedAsset) {
      setSubmitError("Selecciona un activo para registrar la entrada.");
      return;
    }
    if (!Number.isSafeInteger(parsedQuantity) || parsedQuantity <= 0) {
      setSubmitError("La cantidad debe ser un número entero mayor que cero.");
      return;
    }

    setIsSubmitting(true);
    try {
      await createInventoryEntry({
        asset_id: selectedAsset.id,
        quantity: parsedQuantity,
        supplier: supplier.trim(),
        office: selectedAsset.office,
      });
      setSuccess(`Entrada registrada para ${selectedAsset.name} (${selectedAsset.sku}).`);
      setAssetId("");
      setQuantity("");
      setSupplier("");
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "No se pudo registrar la entrada. Inténtalo de nuevo.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const retryAssetLoad = () => {
    setLoadError("");
    setIsLoading(true);
    getInventoryProducts()
      .then(setAssets)
      .catch((error: unknown) => {
        setLoadError(
          error instanceof Error
            ? error.message
            : "No se pudo cargar la lista de activos. Inténtalo de nuevo.",
        );
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <PrivateRoute>
      <main className="min-h-screen bg-slate-950 text-slate-100">
        <section className="mx-auto grid w-full max-w-7xl gap-5 px-4 py-8 sm:px-6 lg:px-8">
          <header className="border-b border-slate-800 pb-5">
            <p className="eyebrow">Inventario · Entrada de activos</p>
            <h1>Registrar entrega recibida</h1>
            <p className="muted mt-2">
              Registra los equipos o materiales recibidos y actualiza el stock de la oficina.
            </p>
          </header>

          <Link className="back-link" href="/inventory/products">
            Volver al stock de activos
          </Link>

          {loadError && (
            <div className="notice error" role="alert">
              <p>{loadError}</p>
              <button
                className="button secondary"
                type="button"
                disabled={isLoading}
                onClick={retryAssetLoad}
              >
                Reintentar carga de activos
              </button>
            </div>
          )}

          {success && <p className="notice success" role="status">{success}</p>}

          {submitError && <p className="notice error" role="alert">{submitError}</p>}

          <form className="candidate-form" onSubmit={handleSubmit} noValidate>
            <div className="form-grid">
              <label htmlFor="asset_id">
                Activo
                <select
                  id="asset_id"
                  name="asset_id"
                  value={assetId}
                  onChange={(event) => setAssetId(event.target.value)}
                  required
                  disabled={isLoading || Boolean(loadError) || isSubmitting}
                >
                  <option value="">
                    {isLoading ? "Cargando activos..." : "Selecciona un activo"}
                  </option>
                  {assets.map((asset) => (
                    <option key={asset.id} value={asset.id}>
                      {asset.name} · {asset.sku} · {asset.office}
                    </option>
                  ))}
                </select>
              </label>

              <label htmlFor="receiving-office">
                Oficina receptora
                <input
                  id="receiving-office"
                  value={selectedAsset?.office ?? "Se asigna según el activo seleccionado"}
                  readOnly
                  aria-describedby="office-help"
                />
                <span id="office-help" className="text-xs font-normal text-slate-400">
                  La entrada debe registrarse en la oficina del activo.
                </span>
              </label>

              <label htmlFor="quantity">
                Cantidad recibida
                <input
                  id="quantity"
                  name="quantity"
                  type="number"
                  inputMode="numeric"
                  min="1"
                  step="1"
                  value={quantity}
                  onChange={(event) => setQuantity(event.target.value)}
                  required
                  disabled={isSubmitting}
                  placeholder="Ej.: 12"
                />
              </label>

              <label htmlFor="supplier">
                Proveedor o vendedor
                <input
                  id="supplier"
                  name="supplier"
                  type="text"
                  value={supplier}
                  onChange={(event) => setSupplier(event.target.value)}
                  required
                  maxLength={200}
                  disabled={isSubmitting}
                  placeholder="Nombre del proveedor"
                />
              </label>
            </div>

            <div className="actions">
              <button
                className="button"
                type="submit"
                disabled={isLoading || Boolean(loadError) || assets.length === 0 || isSubmitting}
              >
                {isSubmitting ? "Registrando entrada..." : "Registrar entrada"}
              </button>
              {assets.length === 0 && !isLoading && !loadError && (
                <span className="muted" role="status">
                  No hay activos disponibles para registrar una entrada.
                </span>
              )}
            </div>
          </form>
        </section>
      </main>
    </PrivateRoute>
  );
}

function InboundOrderFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 text-sm text-slate-300">
      Cargando formulario de entrada...
    </div>
  );
}

export default function InboundOrderPage() {
  return (
    <Suspense fallback={<InboundOrderFallback />}>
      <InboundOrderContent />
    </Suspense>
  );
}