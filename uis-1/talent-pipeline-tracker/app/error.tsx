"use client";

import { Failure } from "@/componentes/feedback";

export default function RouteError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <Failure message="No se pudo abrir esta vista. Inténtalo de nuevo." retry={reset} />;
}