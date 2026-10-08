"use client";

import Link from "next/link";
import { useState } from "react";
import { api, errorMessage } from "@/lib/api";
import { useResource } from "@/hooks/useResource";
import { stages, statuses } from "@/types/candidates";
import type { Stage, Status } from "@/types/candidates";
import { CandidateForm } from "./candidate-form";
import { CandidateNotes, formatDate } from "./candidate-notes";
import { Failure, Loading, Notice } from "./feedback";

function SafeLink({ url, children }: { url: string | null; children: string }) {
  if (!url) return <>No disponible</>;
  let valid = false;
  try {
    valid = ["http:", "https:"].includes(new URL(url).protocol);
  } catch {
    valid = false;
  }
  if (!valid) return <>Enlace no válido</>;
  return <a href={url} target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer" className="text-button">{children}</a>;
}

export function CandidateDetail({ id, created = false }: { id: string; created?: boolean }) {
  const { state, setState, reload } = useResource(api.get, id);
  const [editing, setEditing] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [pending, setPending] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; error?: boolean } | null>(created ? { message: "Candidatura registrada correctamente." } : null);

  async function patch(input: { status?: Status; stage?: Stage }) {
    if (pending) return;
    setPending(true);
    setFeedback(null);
    try {
      const saved = await api.patch(id, input);
      setState({ status: "success", data: saved });
      setFeedback({ message: "Candidatura actualizada correctamente." });
    } catch (error) {
      setFeedback({ message: errorMessage(error), error: true });
    } finally {
      setPending(false);
    }
  }

  if (state.status === "loading") return <><Link className="back-link" href="/">Volver a candidaturas</Link><Loading>Cargando candidatura…</Loading></>;
  if (state.status === "error") return <><Link className="back-link" href="/">Volver a candidaturas</Link><Failure message={state.message} retry={reload} /></>;
  const candidate = state.data;

  return <>
    <Link href="/" className="back-link">Volver a candidaturas</Link>
    <div className="page-heading"><div><p className="eyebrow">Candidatura · Nexova</p><h1>{candidate.full_name}</h1><p className="muted">{candidate.position}</p></div>
      {!editing && <button className="button secondary" disabled={pending} onClick={() => setEditing(true)}>Editar candidatura</button>}
    </div>
    {feedback && <Notice {...feedback} />}
    {editing ? <section className="detail-section"><h2>Editar datos</h2><CandidateForm candidate={candidate} onCancel={() => setEditing(false)} onSaved={(saved) => { setState({ status: "success", data: saved }); setEditing(false); setFeedback({ message: "Datos guardados correctamente." }); }} /></section> : <>
      <section className="pipeline-section" aria-labelledby="pipeline-heading" aria-busy={pending}>
        <h2 id="pipeline-heading">Proceso de selección</h2><div className="pipeline-controls">
          <label>Estado actual<select disabled={pending} value={candidate.status} onChange={async (event) => await patch({ status: event.target.value as Status })}>{!Object.hasOwn(statuses, candidate.status) && <option value={candidate.status}>Estado no disponible</option>}{Object.entries(statuses).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
          <label>Etapa actual<select disabled={pending} value={candidate.stage} onChange={async (event) => await patch({ stage: event.target.value as Stage })}>{!Object.hasOwn(stages, candidate.stage) && <option value={candidate.stage}>Etapa no disponible</option>}{Object.entries(stages).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
          {pending && <p role="status">Actualizando…</p>}
        </div>
      </section>
      <section className="detail-section" aria-labelledby="candidate-heading">
        <div className="section-heading"><h2 id="candidate-heading">Datos de la candidatura</h2><label className="privacy-toggle"><input type="checkbox" checked={revealed} onChange={(event) => setRevealed(event.target.checked)} />Mostrar datos de contacto</label></div>
        <dl className="details-grid">
          <div><dt>Nombre completo</dt><dd>{candidate.full_name}</dd></div><div><dt>Puesto</dt><dd>{candidate.position}</dd></div>
          <div><dt>Email</dt><dd>{revealed ? candidate.email : "Oculto"}</dd></div><div><dt>Teléfono</dt><dd>{revealed ? candidate.phone : "Oculto"}</dd></div>
          <div><dt>LinkedIn</dt><dd>{revealed ? <SafeLink url={candidate.linkedin_url}>Abrir LinkedIn</SafeLink> : "Oculto"}</dd></div><div><dt>Enlace al CV</dt><dd>{revealed ? <SafeLink url={candidate.cv_url}>Abrir CV</SafeLink> : "Oculto"}</dd></div>
          <div><dt>Años de experiencia</dt><dd>{candidate.experience_years}</dd></div><div><dt>Fecha de candidatura</dt><dd>{formatDate(candidate.applied_at)}</dd></div>
          <div><dt>Estado</dt><dd>{statuses[candidate.status] ?? "Estado no disponible"}</dd></div><div><dt>Etapa</dt><dd>{stages[candidate.stage] ?? "Etapa no disponible"}</dd></div>
          <div><dt>Última actualización</dt><dd>{formatDate(candidate.updated_at)}</dd></div>
        </dl>
      </section>
    </>}
    <CandidateNotes id={id} />
  </>;
}