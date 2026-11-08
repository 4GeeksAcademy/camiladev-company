"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { requiredFields, validateContact, type ContactErrors, type ContactField, type ContactValues } from "@/lib/contact-validation";

const inputs = [
  { id: "name", label: "Nombre", placeholder: "Nombre y apellido del responsable" },
  { id: "role", label: "Cargo", placeholder: "Ejemplo: Gerencia de RRHH, People Lead, Dirección General" },
  { id: "company", label: "Empresa", placeholder: "Nombre de tu empresa" },
  { id: "email", label: "Email", placeholder: "nombre@empresa.com" },
] as const;

const services = [
  ["talent-acquisition", "Selección de talento especializado"],
  ["executive-search", "Búsqueda ejecutiva"],
  ["rpo", "Externalización del proceso de reclutamiento (RPO)"],
  ["support-staffing", "Selección masiva de talento operativo"],
  ["hr-consulting", "Diseño de estrategia de selección de talento"],
];

const sizes = ["1-20", "21-100", "101-500", "501-1000", "1000+"];
const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-300";
const inputClass = "w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300";

export default function ContactForm() {
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<"idle" | "error" | "sending" | "success">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current !== null) clearTimeout(timer.current);
  }, []);

  function attributes(field: ContactField) {
    return {
      className: `${inputClass}${errors[field] ? " border-rose-400 bg-rose-500/5" : ""}`,
      "aria-invalid": Boolean(errors[field]),
      "aria-describedby": `error-${field}`,
    };
  }

  function errorMessage(field: ContactField) {
    return <p id={`error-${field}`} className={`mt-1.5 text-xs text-rose-300${errors[field] ? "" : " hidden"}`} role="alert">{errors[field]}</p>;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const values = Object.fromEntries(requiredFields.map((field) => [field, String(data.get(field) ?? "")])) as ContactValues;
    const nextErrors = validateContact(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      setStatus("error");
      return;
    }
    setStatus("sending");
    timer.current = setTimeout(() => {
      form.reset();
      setStatus("success");
      timer.current = null;
    }, 900);
  }

  return (
    <form id="contact-form" className="rounded-3xl border border-slate-700 bg-slate-950/70 p-6" noValidate aria-describedby="form-feedback" onSubmit={handleSubmit}>
      <p id="form-feedback" role="status" aria-live="polite" className={`mb-4 rounded-lg border px-3 py-2 text-sm ${status === "error" ? "border-rose-400 bg-rose-500/10 text-rose-200" : status === "success" ? "border-emerald-400 bg-emerald-500/10 text-emerald-200" : "hidden"}`}>
        {status === "error" ? "Revisa los campos marcados antes de enviar tu solicitud." : status === "success" ? "Gracias. Recibimos la solicitud de tu empresa y un consultor de RRHH de Nexova te contactará en menos de 24 horas laborables." : ""}
      </p>
      <div className="space-y-4">
        {inputs.map(({ id, label, placeholder }) => (
          <div key={id}>
            <label htmlFor={id} className={labelClass}>{label}</label>
            <input id={id} name={id} type={id === "email" ? "email" : "text"} placeholder={placeholder} required={id !== "role"} {...(id === "role" ? { className: inputClass } : attributes(id))} />
            {id !== "role" && errorMessage(id)}
          </div>
        ))}
        <div>
          <label htmlFor="service" className={labelClass}>Tipo de servicio</label>
          <select id="service" name="service" defaultValue="" required {...attributes("service")}>
            <option value="">Selecciona un servicio</option>
            {services.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
          {errorMessage("service")}
        </div>
        <div>
          <label htmlFor="company-size" className={labelClass}>Tamaño de empresa</label>
          <select id="company-size" name="company-size" defaultValue="" required {...attributes("company-size")}>
            <option value="">Selecciona un rango</option>
            {sizes.map((size) => <option key={size} value={size}>{size} empleados</option>)}
          </select>
          {errorMessage("company-size")}
        </div>
        <div>
          <label htmlFor="message" className={labelClass}>Mensaje</label>
          <textarea id="message" name="message" rows={4} placeholder="Cuéntanos los retos de RRHH de tu empresa, vacantes críticas y objetivos de contratación" required {...attributes("message")} />
          {errorMessage("message")}
        </div>
        <button id="submit-btn" type="submit" disabled={status === "sending"} aria-busy={status === "sending"} className="w-full rounded-full bg-cyan-300 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-200">
          {status === "sending" ? "Enviando..." : "Solicitar consulta empresarial"}
        </button>
      </div>
    </form>
  );
}