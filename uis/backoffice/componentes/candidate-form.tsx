"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { api, errorMessage } from "@/lib/api";
import type { Candidate, CandidateInput } from "@/types/candidates";
import { Notice } from "./feedback";

export function CandidateForm({ candidate, onSaved, onCancel }: {
  candidate?: Candidate;
  onSaved: (candidate: Candidate) => void;
  onCancel: () => void;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const data = new FormData(event.currentTarget);
    const text = (key: string) => String(data.get(key) ?? "").trim();
    const input: CandidateInput = {
      full_name: text("full_name"), email: text("email"), phone: text("phone"),
      position: text("position"), linkedin_url: text("linkedin_url") || null,
      cv_url: text("cv_url") || null, experience_years: Number(text("experience_years")),
    };
    if (!input.full_name || !input.email || !input.phone || !input.position || !text("experience_years")) {
      setError("Completa todos los campos obligatorios.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email) || !Number.isFinite(input.experience_years) || input.experience_years < 0) {
      setError("Introduce un email válido y años de experiencia iguales o mayores que cero.");
      return;
    }
    for (const url of [input.linkedin_url, input.cv_url]) {
      if (url) {
        try {
          if (!["http:", "https:"].includes(new URL(url).protocol)) throw new Error();
        } catch {
          setError("Los enlaces de LinkedIn y CV deben ser direcciones http o https válidas.");
          return;
        }
      }
    }
    setPending(true);
    setError("");
    try {
      const saved = candidate ? await api.update(candidate.id, input) : await api.create(input);
      onSaved(saved);
    } catch (cause) {
      setError(errorMessage(cause));
    } finally {
      setPending(false);
    }
  }

  return <form onSubmit={submit} className="candidate-form" aria-busy={pending}>
    {error && <Notice message={error} error />}
    <fieldset disabled={pending}>
      <legend className="sr-only">Datos de la candidatura</legend>
      <div className="form-grid">
        <label>Nombre completo *<input name="full_name" defaultValue={candidate?.full_name} required autoComplete="off" maxLength={200} /></label>
        <label>Email *<input name="email" type="email" defaultValue={candidate?.email} required autoComplete="off" maxLength={254} /></label>
        <label>Teléfono *<input name="phone" type="tel" defaultValue={candidate?.phone} required autoComplete="off" maxLength={40} /></label>
        <label>Puesto *<input name="position" defaultValue={candidate?.position ?? "Asistente de Dirección"} required maxLength={200} /></label>
        <label>LinkedIn<input name="linkedin_url" type="url" defaultValue={candidate?.linkedin_url ?? ""} placeholder="https://www.linkedin.com/in/…" /></label>
        <label>Enlace al CV<input name="cv_url" type="url" defaultValue={candidate?.cv_url ?? ""} placeholder="https://…" /></label>
        <label>Años de experiencia *<input name="experience_years" type="number" min="0" step="any" defaultValue={candidate?.experience_years ?? ""} required /></label>
      </div>
    </fieldset>
    <div className="actions">
      <button className="button" type="submit" disabled={pending}>{pending ? "Guardando…" : candidate ? "Guardar cambios" : "Registrar candidatura"}</button>
      <button className="button secondary" type="button" onClick={onCancel} disabled={pending}>Cancelar</button>
    </div>
  </form>;
}