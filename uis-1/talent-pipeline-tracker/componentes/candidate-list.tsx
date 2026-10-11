"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useDeferredValue, useState } from "react";
import { api } from "@/lib/api";
import { useResource } from "@/hooks/useResource";
import { stages, statuses } from "@/types/candidates";
import { Failure, Loading } from "./feedback";

const loadCandidates = async (_key: string, signal: AbortSignal) => await api.list(signal);

export function CandidateList() {
  const { state, reload } = useResource(loadCandidates, "all");
  const params = useSearchParams();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const query = useDeferredValue(search.trim().toLocaleLowerCase("es"));
  const status = params.get("status") ?? "";
  const stage = params.get("stage") ?? "";
  const validStatus = Object.hasOwn(statuses, status) ? status : "";
  const validStage = Object.hasOwn(stages, stage) ? stage : "";

  function filter(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value); else next.delete(key);
    router.replace(next.size ? `/?${next}` : "/", { scroll: false });
  }

  const rows = state.status === "success" ? state.data.filter((candidate) =>
    (!validStatus || candidate.status === validStatus) &&
    (!validStage || candidate.stage === validStage) &&
    (!query || `${candidate.full_name} ${candidate.email}`.toLocaleLowerCase("es").includes(query)),
  ) : [];

  return <>
    <div className="page-heading">
      <div><p className="eyebrow">People · Valencia</p><h1>Candidaturas</h1><p className="muted">Asistente de Dirección</p></div>
      <Link className="button" href="/candidates/new">Nueva candidatura</Link>
    </div>
    {state.status === "success" && <div className="metrics" aria-label="Resumen de candidaturas">
      <div><span>Total de candidaturas</span><strong>{state.data.length}</strong></div>
      <div><span>En proceso</span><strong>{state.data.filter((row) => row.status === "in_progress").length}</strong></div>
      <div><span>Seleccionadas</span><strong>{state.data.filter((row) => row.status === "selected").length}</strong></div>
    </div>}
    <section className="filters" aria-label="Filtros de candidaturas">
      <label className="search-field">Buscar por nombre o email<input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar candidatura" autoComplete="off" /></label>
      <label>Estado<select value={validStatus} onChange={(event) => filter("status", event.target.value)}><option value="">Todos los estados</option>{Object.entries(statuses).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
      <label>Etapa<select value={validStage} onChange={(event) => filter("stage", event.target.value)}><option value="">Todas las etapas</option>{Object.entries(stages).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
      {(search || validStage || validStatus) && <button className="button secondary" onClick={() => { setSearch(""); router.replace("/", { scroll: false }); }}>Limpiar</button>}
    </section>
    {state.status === "loading" && <Loading />}
    {state.status === "error" && <Failure message={state.message} retry={reload} />}
    {state.status === "success" && <section aria-label="Listado de candidaturas">
      <div className="list-caption"><p role="status">{rows.length} {rows.length === 1 ? "candidatura" : "candidaturas"}</p><button className="text-button" onClick={reload}>Actualizar listado</button></div>
      {rows.length === 0 ? <div className="empty"><h2>{state.data.length ? "Sin coincidencias" : "Todavía no hay candidaturas"}</h2><p>{state.data.length ? "No hay candidaturas con estos filtros." : "Las nuevas candidaturas aparecerán aquí."}</p></div> : <div className="table-wrap"><table><caption className="sr-only">Candidaturas recibidas por Nexova</caption><thead><tr><th>Nombre completo</th><th>Puesto</th><th>Estado actual</th><th>Etapa actual</th><th><span className="sr-only">Detalle</span></th></tr></thead><tbody>{rows.map((candidate) => <tr key={candidate.id}>
        <td><Link className="candidate-name" href={`/candidates/${encodeURIComponent(candidate.id)}`}>{candidate.full_name}</Link></td>
        <td>{candidate.position}</td><td><span className={`badge ${candidate.status}`}>{statuses[candidate.status] ?? "Estado no disponible"}</span></td><td>{stages[candidate.stage] ?? "Etapa no disponible"}</td>
        <td><Link className="text-button" href={`/candidates/${encodeURIComponent(candidate.id)}`} aria-label={`Ver candidatura de ${candidate.full_name}`}>Ver detalle</Link></td>
      </tr>)}</tbody></table></div>}
    </section>}
  </>;
}