"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { PrivateRoute } from "@/components/auth/PrivateRoute";
import {
  getIncidentSummary, INCIDENT_BRANCHES, INCIDENT_ORIGINS, INCIDENT_STATUSES, incidentLabels,
  IncidentApiError, listIncidents, updateIncidentStatus, validNextStatuses,
} from "@/lib/incidents";
import type { Incident, IncidentBranch, IncidentOrigin, IncidentStatus, IncidentSummary } from "@/lib/incidents";

const EMPTY_SUMMARY: IncidentSummary = {
  total: 0,
  by_status: { open: 0, in_progress: 0, resolved: 0, discarded: 0 },
  by_category: { technical_failure: 0, process_error: 0, client_complaint: 0, candidate_issue: 0, staff_issue: 0, sla_breach: 0, data_quality: 0, other: 0 },
  by_origin: { customer: 0, branch: 0, internal: 0 },
  by_branch: { central: 0, valencia_operations: 0, miami_office: 0, remote: 0 },
};

function MetricGroup({ title, values, labels }: { title: string; values: Record<string, number>; labels: Record<string, string> }) {
  return <section className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
    <h3 className="mb-3 text-sm font-bold text-slate-200">{title}</h3>
    <dl className="grid gap-2">
      {Object.entries(values).map(([key, value]) => <div key={key} className="flex items-center justify-between gap-3 text-xs">
        <dt className="text-slate-400">{labels[key] ?? key}</dt><dd className="m-0 font-bold tabular-nums text-cyan-200">{value}</dd>
      </div>)}
    </dl>
  </section>;
}

function IncidentsContent() {
  const [items, setItems] = useState<Incident[]>([]);
  const [filters, setFilters] = useState<{ status: IncidentStatus | ""; origin: IncidentOrigin | ""; branch: IncidentBranch | "" }>({ status: "", origin: "", branch: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [summary, setSummary] = useState<IncidentSummary | null>(null);
  const [summaryError, setSummaryError] = useState("");
  const [updating, setUpdating] = useState<number | null>(null);
  const [notice, setNotice] = useState("");
  const [noticeIsError, setNoticeIsError] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    setLoadError("");
    try {
      const result = await listIncidents({
        ...(filters.status ? { status: filters.status } : {}),
        ...(filters.origin ? { origin: filters.origin } : {}),
        ...(filters.branch ? { branch: filters.branch } : {}),
      });
      setItems(result);
    } catch (error) {
      setLoadError(error instanceof IncidentApiError ? error.message : "No se pudieron cargar las incidencias. Inténtalo de nuevo.");
    } finally { setIsLoading(false); }
  }, [filters]);

  const loadSummary = useCallback(async () => {
    setSummaryError("");
    try { setSummary(await getIncidentSummary()); }
    catch { setSummary(null); setSummaryError("No se pudieron cargar las métricas."); }
  }, []);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => { void loadSummary(); }, [loadSummary]);

  async function changeStatus(item: Incident, nextStatus: IncidentStatus) {
    setUpdating(item.id);
    setNotice("");
    setItems((current) => current.map((currentItem) => currentItem.id === item.id ? { ...currentItem, status: nextStatus } : currentItem));
    try {
      const updated = await updateIncidentStatus(item.id, nextStatus);
      setItems((current) => current.map((currentItem) => currentItem.id === item.id ? updated : currentItem));
      setNotice(`Estado actualizado: ${incidentLabels.status[nextStatus]}.`);
      setNoticeIsError(false);
      void loadSummary();
    } catch (error) {
      setItems((current) => current.map((currentItem) => currentItem.id === item.id ? { ...currentItem, status: item.status } : currentItem));
      setNotice(`${error instanceof IncidentApiError ? error.message : "No se pudo actualizar el estado."} El estado anterior se ha restaurado.`);
      setNoticeIsError(true);
    } finally { setUpdating(null); }
  }

  const hasFilters = Boolean(filters.status || filters.origin || filters.branch);
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <section className="mx-auto grid w-full max-w-7xl gap-6">
        <header className="border-b border-slate-800 pb-5">
          <p className="eyebrow">Operaciones · Nexova</p>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div><h1>Panel de incidencias</h1><p className="muted mt-2">Registro, seguimiento y métricas centralizadas.</p></div>
            <Link className="button" href="/incidents/new">+ Registrar incidencia</Link>
          </div>
        </header>

        <section aria-label="Resumen de incidencias" className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div><h2>Resumen</h2><p className="muted mt-1 text-xs">Conteos de todas las incidencias registradas.</p></div>
            <button type="button" className="text-button text-sm" onClick={() => void loadSummary()}>Actualizar métricas</button>
          </div>
          {summaryError ? <div className="notice error mb-0" role="status">{summaryError} <button className="text-button" onClick={() => void loadSummary()}>Reintentar</button></div>
            : !summary ? <div className="loading" role="status"><span className="spinner" />Cargando métricas…</div>
              : <><div className="mb-4 flex items-center gap-3 rounded-xl border border-cyan-300/20 bg-cyan-300/5 px-4 py-3"><span className="text-sm text-slate-300">Total de incidencias</span><strong className="text-2xl text-cyan-200">{summary.total}</strong></div>
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  <MetricGroup title="Por estado" values={summary.by_status} labels={incidentLabels.status} />
                  <MetricGroup title="Por categoría" values={summary.by_category} labels={incidentLabels.category} />
                  <MetricGroup title="Por origen" values={summary.by_origin} labels={incidentLabels.origin} />
                  <MetricGroup title="Por sede" values={summary.by_branch} labels={incidentLabels.branch} />
                </div></>}
        </section>

        <section aria-label="Listado de incidencias">
          <div className="page-heading"><div><h2>Incidencias</h2><p className="muted mt-1">Filtra y actualiza el estado permitido de cada registro.</p></div></div>
          <div className="filters mb-5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
            <label>Estado<select value={filters.status} onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value as IncidentStatus | "" }))}><option value="">Todos los estados</option>{INCIDENT_STATUSES.map((value) => <option key={value} value={value}>{incidentLabels.status[value]}</option>)}</select></label>
            <label>Origen<select value={filters.origin} onChange={(event) => setFilters((current) => ({ ...current, origin: event.target.value as IncidentOrigin | "" }))}><option value="">Todos los orígenes</option>{INCIDENT_ORIGINS.map((value) => <option key={value} value={value}>{incidentLabels.origin[value]}</option>)}</select></label>
            <label>Sede<select value={filters.branch} onChange={(event) => setFilters((current) => ({ ...current, branch: event.target.value as IncidentBranch | "" }))}><option value="">Todas las sedes</option>{INCIDENT_BRANCHES.map((value) => <option key={value} value={value}>{incidentLabels.branch[value]}</option>)}</select></label>
            {hasFilters && <button type="button" className="button secondary" onClick={() => setFilters({ status: "", origin: "", branch: "" })}>Limpiar filtros</button>}
          </div>
          {notice && <p role={noticeIsError ? "alert" : "status"} className={`notice ${noticeIsError ? "error" : "success"}`}>{notice}</p>}
          {loadError ? <div className="notice error" role="alert">{loadError}<br /><button className="button secondary" type="button" onClick={() => void load()}>Reintentar</button></div>
            : isLoading ? <div className="loading" role="status"><span className="spinner" />Cargando incidencias…</div>
              : items.length === 0 ? <div className="empty"><h3 className="font-bold text-white">{hasFilters ? "No hay resultados para estos filtros" : "Todavía no hay incidencias"}</h3><p>{hasFilters ? "Prueba a cambiar o limpiar los filtros para ver otros registros." : "Registra una incidencia para comenzar el seguimiento."}</p>{!hasFilters && <Link className="button mt-5" href="/incidents/new">Registrar incidencia</Link>}</div>
                : <div className="table-wrap"><table><thead><tr><th>Incidencia</th><th>Categoría</th><th>Origen</th><th>Sede</th><th>Creada</th><th>Estado</th></tr></thead><tbody>
                  {items.map((item) => <tr key={item.id}>
                    <td><strong className="block text-white">{item.title}</strong><span className="mt-1 block max-w-md text-xs text-slate-400">{item.description}</span><span className="mt-1 block text-xs text-slate-500">#{item.id}</span></td>
                    <td>{incidentLabels.category[item.category]}</td><td>{incidentLabels.origin[item.origin]}</td><td>{incidentLabels.branch[item.branch]}</td>
                    <td>{new Date(item.created_at).toLocaleString("es-ES", { dateStyle: "medium", timeStyle: "short" })}</td>
                    <td><div className="grid min-w-40 gap-2"><span className={`badge ${item.status}`}>{incidentLabels.status[item.status]}</span>
                      {validNextStatuses(item.status).length > 0 && <select aria-label={`Actualizar estado de ${item.title}`} value={item.status} disabled={updating === item.id} onChange={(event) => void changeStatus(item, event.target.value as IncidentStatus)}>
                        <option value={item.status}>{incidentLabels.status[item.status]}</option>{validNextStatuses(item.status).map((next) => <option key={next} value={next}>{incidentLabels.status[next]}</option>)}
                      </select>}
                      {updating === item.id && <span className="text-xs text-slate-400">Actualizando…</span>}
                    </div></td>
                  </tr>)}
                </tbody></table></div>}
        </section>
      </section>
    </main>
  );
}

export default function IncidentsPage() {
  return <PrivateRoute><IncidentsContent /></PrivateRoute>;
}
