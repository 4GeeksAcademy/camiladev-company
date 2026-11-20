"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { PrivateRoute } from "@/components/auth/PrivateRoute";
import {
  createIncident, INCIDENT_BRANCHES, INCIDENT_CATEGORIES, INCIDENT_ORIGINS, incidentLabels,
  IncidentApiError,
} from "@/lib/incidents";
import type { IncidentInput } from "@/lib/incidents";

const INITIAL_FORM: IncidentInput = {
  title: "", description: "", category: "technical_failure", origin: "internal", branch: "central",
};

function NewIncidentContent() {
  const [form, setForm] = useState<IncidentInput>(INITIAL_FORM);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof IncidentInput, string>>>({});
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function update<K extends keyof IncidentInput>(field: K, value: IncidentInput[K]) {
    setForm((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
    setFormError("");
    setSuccess("");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldErrors({});
    setFormError("");
    setSuccess("");
    setIsSubmitting(true);
    try {
      await createIncident({ ...form, title: form.title.trim(), description: form.description.trim() });
      setForm(INITIAL_FORM);
      setSuccess("Incidencia registrada correctamente. Su estado inicial es Abierta.");
    } catch (error) {
      if (error instanceof IncidentApiError && Object.keys(error.fields).length) {
        setFieldErrors(error.fields);
        setFormError(error.message);
      } else {
        setFormError(error instanceof IncidentApiError ? error.message : "No se pudo registrar la incidencia. Inténtalo de nuevo.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  const branchHighlighted = form.origin === "branch";
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <section className="mx-auto w-full max-w-4xl">
        <Link className="back-link" href="/incidents">← Volver al panel de incidencias</Link>
        <header className="mb-7 border-b border-slate-800 pb-5">
          <p className="eyebrow">Operaciones · Registro</p>
          <h1>Registrar incidencia</h1>
          <p className="muted mt-2">Describe el problema y selecciona su categoría, origen y sede asociada.</p>
        </header>
        {success && <p role="status" className="notice success">{success}</p>}
        {formError && <p role="alert" className="notice error">{formError}</p>}
        <form onSubmit={submit} noValidate className="candidate-form">
          <div className="form-grid">
            <label className="col-span-full">
              <span>Título <span className="text-rose-300">*</span></span>
              <input required maxLength={200} value={form.title} onChange={(event) => update("title", event.target.value)} aria-invalid={Boolean(fieldErrors.title)} aria-describedby={fieldErrors.title ? "title-error" : undefined} />
              {fieldErrors.title && <span id="title-error" className="text-xs text-rose-300">{fieldErrors.title}</span>}
            </label>
            <label className="col-span-full">
              <span>Descripción <span className="text-rose-300">*</span></span>
              <textarea required value={form.description} onChange={(event) => update("description", event.target.value)} aria-invalid={Boolean(fieldErrors.description)} aria-describedby={fieldErrors.description ? "description-error" : undefined} />
              {fieldErrors.description && <span id="description-error" className="text-xs text-rose-300">{fieldErrors.description}</span>}
            </label>
            <label>
              <span>Categoría <span className="text-rose-300">*</span></span>
              <select value={form.category} onChange={(event) => update("category", event.target.value as IncidentInput["category"])} aria-invalid={Boolean(fieldErrors.category)}>
                {INCIDENT_CATEGORIES.map((value) => <option key={value} value={value}>{incidentLabels.category[value]}</option>)}
              </select>
              {fieldErrors.category && <span className="text-xs text-rose-300">{fieldErrors.category}</span>}
            </label>
            <label>
              <span>Origen <span className="text-rose-300">*</span></span>
              <select value={form.origin} onChange={(event) => update("origin", event.target.value as IncidentInput["origin"])} aria-invalid={Boolean(fieldErrors.origin)}>
                {INCIDENT_ORIGINS.map((value) => <option key={value} value={value}>{incidentLabels.origin[value]}</option>)}
              </select>
              {fieldErrors.origin && <span className="text-xs text-rose-300">{fieldErrors.origin}</span>}
            </label>
            <label className={branchHighlighted ? "rounded-xl border border-cyan-300/60 bg-cyan-300/10 p-4 shadow-[0_0_24px_rgba(103,232,249,0.12)]" : ""}>
              <span>Sede asociada <span className="text-rose-300">*</span></span>
              <select required value={form.branch} onChange={(event) => update("branch", event.target.value as IncidentInput["branch"])} aria-invalid={Boolean(fieldErrors.branch)}>
                {INCIDENT_BRANCHES.map((value) => <option key={value} value={value}>{incidentLabels.branch[value]}</option>)}
              </select>
              {branchHighlighted && <span className="text-xs text-cyan-200">Indica la sede desde la que se reporta.</span>}
              {fieldErrors.branch && <span className="text-xs text-rose-300">{fieldErrors.branch}</span>}
            </label>
            <div className="flex flex-col justify-center gap-1 text-sm">
              <span className="font-semibold text-slate-200">Estado inicial</span>
              <span className="badge w-fit">{incidentLabels.status.open}</span>
              <span className="text-xs text-slate-400">Se asigna automáticamente al registrar.</span>
            </div>
          </div>
          <div className="actions">
            <button className="button" type="submit" disabled={isSubmitting}>
              {isSubmitting && <span className="spinner" aria-hidden="true" />}
              {isSubmitting ? "Registrando incidencia…" : "Registrar incidencia"}
            </button>
            <Link className="button secondary" href="/incidents">Cancelar</Link>
          </div>
        </form>
      </section>
    </main>
  );
}

export default function NewIncidentPage() {
  return <PrivateRoute><NewIncidentContent /></PrivateRoute>;
}
