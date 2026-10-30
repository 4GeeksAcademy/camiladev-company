"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { api, errorMessage } from "@/lib/api";
import { useResource } from "@/hooks/useResource";
import { Failure, Loading, Notice } from "./feedback";

export function CandidateNotes({ id }: { id: string }) {
  const { state, setState, reload } = useResource(api.notes, id);
  const [content, setContent] = useState("");
  const [pending, setPending] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ message: string; error?: boolean } | null>(null);
  const [confirm, setConfirm] = useState<string | null>(null);

  async function add(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    if (!content.trim()) {
      setFeedback({ message: "Escribe el contenido de la nota.", error: true });
      return;
    }
    setPending("add");
    setFeedback(null);
    try {
      await api.addNote(id, content.trim());
      setContent("");
      setFeedback({ message: "Nota añadida correctamente." });
      reload();
    } catch (error) {
      setFeedback({ message: errorMessage(error), error: true });
    } finally {
      setPending(null);
    }
  }

  async function remove(noteId: string) {
    if (pending) return;
    setPending(noteId);
    setFeedback(null);
    try {
      await api.deleteNote(id, noteId);
      setState((current) => current.status === "success"
        ? { status: "success", data: current.data.filter((note) => note.id !== noteId) }
        : current);
      setConfirm(null);
      setFeedback({ message: "Nota eliminada correctamente." });
    } catch (error) {
      setFeedback({ message: errorMessage(error), error: true });
    } finally {
      setPending(null);
    }
  }

  return <section className="notes-section" aria-labelledby="notes-heading">
    <div className="section-heading"><h2 id="notes-heading">Notas internas</h2>{state.status === "success" && <span className="muted">{state.data.length}</span>}</div>
    {feedback && <Notice {...feedback} />}
    {state.status === "loading" && <Loading>Cargando notas…</Loading>}
    {state.status === "error" && <Failure message={state.message} retry={reload} />}
    {state.status === "success" && (state.data.length === 0 ? <p className="muted empty-notes">Sin notas internas.</p> : <ul className="notes-list">{state.data.map((note) => <li key={note.id}>
      <div className="section-heading"><time dateTime={note.created_at}>{formatDate(note.created_at)}</time>
        {confirm !== note.id && <button type="button" className="text-button danger" disabled={!!pending} onClick={() => setConfirm(note.id)}>Eliminar nota</button>}
      </div>
      <p className="note-content">{note.content}</p>
      {confirm === note.id && <div className="delete-confirm"><p>¿Eliminar esta nota definitivamente?</p><div className="actions"><button className="button destructive" disabled={!!pending} onClick={async () => await remove(note.id)}>{pending === note.id ? "Eliminando…" : "Eliminar"}</button><button className="button secondary" disabled={!!pending} onClick={() => setConfirm(null)}>Cancelar</button></div></div>}
    </li>)}</ul>)}
    <form onSubmit={add} className="note-form" aria-busy={pending === "add"}>
      <label htmlFor="new-note">Nueva nota<textarea id="new-note" value={content} onChange={(event) => setContent(event.target.value)} rows={4} required disabled={!!pending} maxLength={10000} /></label>
      <button className="button" disabled={!!pending || !content.trim()}>{pending === "add" ? "Añadiendo…" : "Añadir nota"}</button>
    </form>
  </section>;
}

export function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Fecha no disponible" : new Intl.DateTimeFormat("es-ES", { dateStyle: "medium", timeStyle: "short" }).format(date);
}