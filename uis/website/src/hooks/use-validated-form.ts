"use client";

import { useRef, useState, type FormEvent, type SyntheticEvent } from "react";

type FormOptions<Field extends string, Values> = {
  fields: readonly Field[];
  read: (form: HTMLFormElement) => Values;
  validate: (field: Field, values: Values) => string;
  related?: Partial<Record<Field, readonly Field[]>>;
  required?: (field: Field, values: Values | null) => boolean;
  sanitize?: (input: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) => void;
  successMessage: (values: Values) => string;
  errorMessage: string;
  successFieldState?: boolean;
};

const stateClasses = new Set(["border-slate-700", "border-rose-400", "border-emerald-400", "bg-rose-500/5", "bg-emerald-500/5", "ring-1", "ring-rose-400/50", "ring-emerald-400/40"]);

export function useValidatedForm<Field extends string, Values>(options: FormOptions<Field, Values>) {
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [values, setValues] = useState<Values | null>(null);
  const [feedback, setFeedback] = useState<{ message: string; success: boolean } | null>(null);

  function handleField(event: SyntheticEvent<HTMLFormElement>) {
    const input = event.target;
    if (!(input instanceof HTMLInputElement || input instanceof HTMLSelectElement || input instanceof HTMLTextAreaElement)) return;
    const field = options.fields.find((name) => name === input.name);
    if (!field || !formRef.current) return;
    options.sanitize?.(input);
    const nextValues = options.read(formRef.current);
    setValues(nextValues);
    const changedFields = [field, ...(options.related?.[field] ?? [])];
    setErrors((current) => {
      const next = { ...current };
      for (const changed of changedFields) next[changed] = options.validate(changed, nextValues);
      return next;
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const nextValues = options.read(form);
    const nextErrors: Partial<Record<Field, string>> = {};
    for (const field of options.fields) nextErrors[field] = options.validate(field, nextValues);
    const firstInvalid = options.fields.find((field) => nextErrors[field]);
    if (firstInvalid) {
      setValues(nextValues);
      setErrors(nextErrors);
      setFeedback({ message: options.errorMessage, success: false });
      form.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }
    setFeedback({ message: options.successMessage(nextValues), success: true });
    form.reset();
    setValues(null);
    setErrors(options.successFieldState ? Object.fromEntries(options.fields.map((field) => [field, ""])) as Partial<Record<Field, string>> : {});
  }

  function resetForm() {
    formRef.current?.reset();
    setValues(null);
    setErrors({});
    setFeedback(null);
  }

  function fieldProps(field: Field, baseClass: string) {
    const checked = errors[field] !== undefined;
    const invalid = Boolean(errors[field]);
    const base = baseClass.split(/\s+/).filter((name) => !stateClasses.has(name)).join(" ");
    return {
      className: `${base} ${checked ? invalid ? "border-rose-400 bg-rose-500/5 ring-1 ring-rose-400/50" : "border-emerald-400 bg-emerald-500/5 ring-1 ring-emerald-400/40" : "border-slate-700"}`,
      "aria-invalid": checked ? invalid : undefined,
      ...(options.required ? { required: options.required(field, values) } : {}),
    };
  }

  function errorProps(field: Field, baseClass: string) {
    const base = baseClass.split(/\s+/).filter((name) => name !== "hidden" && name !== "text-rose-300").join(" ");
    return {
      className: `${base} ${errors[field] ? "text-rose-300 border border-rose-400/40 bg-rose-500/10 rounded-lg px-3 py-2 font-medium" : "hidden"}`,
      children: errors[field] ?? "",
    };
  }

  function feedbackProps(baseClass: string) {
    return {
      className: `${baseClass.split(/\s+/).filter((name) => name !== "hidden").join(" ")} ${feedback ? feedback.success ? "border-emerald-400 bg-emerald-500/10 text-emerald-200 shadow-lg shadow-emerald-500/10" : "border-rose-400 bg-rose-500/10 text-rose-200 shadow-lg shadow-rose-500/10" : "hidden"}`,
      children: feedback?.message ?? "",
    };
  }

  return {
    fieldProps, errorProps, feedbackProps, resetForm,
    formProps: { ref: formRef, noValidate: true, onSubmit: handleSubmit, onInput: handleField, onChange: handleField, onBlur: handleField },
  };
}