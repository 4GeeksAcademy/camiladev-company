"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { PrivateRoute } from "@/components/auth/PrivateRoute";
import { getInventoryOrders } from "@/lib/inventory";
import type { InventoryOrder } from "@/lib/inventory";

function formatCreatedAt(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Fecha no disponible";

  return new Intl.DateTimeFormat("es-ES", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function OrdersContent() {
  const [orders, setOrders] = useState<InventoryOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [loadAttempt, setLoadAttempt] = useState(0);

  useEffect(() => {
    let active = true;

    getInventoryOrders()
      .then((loadedOrders) => {
        if (active) setOrders(loadedOrders);
      })
      .catch((loadError: unknown) => {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "No se pudo cargar el historial de órdenes. Inténtalo de nuevo.",
          );
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [loadAttempt]);

  const inboundCount = orders.filter((order) => order.order_type === "inbound").length;
  const outboundCount = orders.length - inboundCount;

  const retryLoad = () => {
    setError("");
    setIsLoading(true);
    setLoadAttempt((attempt) => attempt + 1);
  };

  return (
    <PrivateRoute>
      <main className="min-h-screen bg-slate-950 text-slate-100">
        <section className="mx-auto grid w-full max-w-7xl gap-5 px-4 py-8 sm:px-6 lg:px-8">
          <header className="border-b border-slate-800 pb-5">
            <p className="eyebrow">Inventario · Registro de movimientos</p>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h1>Historial de órdenes</h1>
                <p className="muted mt-2">
                  Entradas y salidas registradas para equipos y materiales.
                </p>
              </div>
              <Link className="button secondary" href="/inventory/products">
                Volver al stock de activos
              </Link>
            </div>
          </header>

          <section aria-label="Resumen de órdenes" className="metrics">
            <div>
              <span>Órdenes en historial</span>
              <strong>{isLoading ? "—" : orders.length}</strong>
            </div>
            <div>
              <span>Entradas</span>
              <strong className="text-emerald-200">{isLoading ? "—" : inboundCount}</strong>
            </div>
            <div>
              <span>Salidas</span>
              <strong className="text-amber-200">{isLoading ? "—" : outboundCount}</strong>
            </div>
          </section>

          {error && (
            <div className="notice error mb-0" role="alert">
              <p>{error}</p>
              <button
                className="button secondary"
                type="button"
                disabled={isLoading}
                onClick={retryLoad}
              >
                Reintentar
              </button>
            </div>
          )}

          <section aria-label="Historial de órdenes" aria-busy={isLoading}>
            {isLoading ? (
              <div className="loading" role="status">
                <span className="spinner" aria-hidden="true" />
                Cargando historial de órdenes...
              </div>
            ) : orders.length === 0 ? (
              <div className="empty">
                <h2>No hay órdenes registradas</h2>
                <p>Las entradas y salidas aparecerán aquí cuando se registren.</p>
              </div>
            ) : (
              <>
                <p className="list-caption">
                  <span>{orders.length} {orders.length === 1 ? "orden" : "órdenes"}</span>
                  <span>Solo lectura</span>
                </p>
                <div className="table-wrap">
                  <table>
                    <caption className="sr-only">
                      Entradas y salidas de activos, fecha y usuario que creó cada orden
                    </caption>
                    <thead>
                      <tr>
                        <th scope="col">Tipo de orden</th>
                        <th scope="col">Producto</th>
                        <th scope="col">Cantidad</th>
                        <th scope="col">Fecha de creación</th>
                        <th scope="col">Creada por (user_uuid)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => {
                        const isInbound = order.order_type === "inbound";

                        return (
                          <tr key={`${order.order_type}-${order.id}`}>
                            <td>
                              <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${isInbound ? "border-emerald-300/40 bg-emerald-300/10 text-emerald-200" : "border-amber-300/40 bg-amber-300/10 text-amber-200"}`}>
                                <span
                                  aria-hidden="true"
                                  className={`size-2 rounded-full ${isInbound ? "bg-emerald-300" : "bg-amber-300"}`}
                                />
                                {isInbound ? "Entrada" : "Salida"}
                              </span>
                            </td>
                            <td>
                              <span className="block font-semibold text-white">{order.asset.name}</span>
                              <span className="mt-1 block font-mono text-xs text-slate-400">
                                {order.asset.sku}
                              </span>
                            </td>
                            <td className="font-semibold tabular-nums">
                              <span aria-hidden="true" className={isInbound ? "text-emerald-200" : "text-amber-200"}>
                                {isInbound ? "+" : "-"}
                              </span>{" "}
                              {order.quantity}
                            </td>
                            <td>
                              <time dateTime={order.created_at}>
                                {formatCreatedAt(order.created_at)}
                              </time>
                            </td>
                            <td className="font-mono text-xs text-slate-300">
                              <span className="block min-w-48 break-all">{order.user_uuid}</span>
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
    </PrivateRoute>
  );
}

export default function InventoryOrdersPage() {
  return <OrdersContent />;
}