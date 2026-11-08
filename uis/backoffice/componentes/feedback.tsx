import type { ReactNode } from "react";

export function Loading({ children = "Cargando candidaturas…" }: { children?: ReactNode }) {
  return <div className="loading" role="status"><span className="spinner" aria-hidden="true" />{children}</div>;
}

export function Failure({ message, retry }: { message: string; retry: () => void }) {
  return <div className="notice error" role="alert"><p>{message}</p><button type="button" className="button secondary" onClick={retry}>Reintentar</button></div>;
}

export function Notice({ message, error = false }: { message: string; error?: boolean }) {
  return <p className={`notice ${error ? "error" : "success"}`} role={error ? "alert" : "status"}>{message}</p>;
}