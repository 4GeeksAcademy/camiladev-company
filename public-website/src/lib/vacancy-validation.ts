export const vacancyFields = [
  "candidate-name", "candidate-email", "candidate-phone-prefix", "candidate-phone",
  "candidate-cv", "english-level", "experience-years", "seniority-level",
  "availability", "salary-expectation", "candidate-skills",
] as const;

export type VacancyField = (typeof vacancyFields)[number];
export type VacancyValues = Record<Exclude<VacancyField, "candidate-cv">, string> & { "candidate-cv": File | null };

export function readVacancyValues(form: HTMLFormElement): VacancyValues {
  const data = new FormData(form);
  return Object.fromEntries(vacancyFields.map((field) => {
    const value = data.get(field);
    return [field, field === "candidate-cv" ? value instanceof File && value.name ? value : null : typeof value === "string" ? value : ""];
  })) as VacancyValues;
}

export function validateVacancyField(field: VacancyField, values: VacancyValues): string {
  switch (field) {
    case "candidate-name":
      if (!values[field].trim()) return "Este campo es obligatorio.";
      return values[field].trim().length < 5 ? "Incluye nombre y apellido para validar tu perfil correctamente." : "";
    case "candidate-email":
      if (!values[field].trim()) return "Este campo es obligatorio.";
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values[field].trim()) ? "" : "Verifica el formato del correo profesional (ejemplo: nombre@empresa.com).";
    case "candidate-phone-prefix": return !values[field] ? "Selecciona un prefijo internacional." : "";
    case "candidate-phone": {
      const phone = values[field];
      if (!phone.trim()) return "Este campo es obligatorio.";
      if (!/^[\d\s()\-]+$/.test(phone.trim())) return "Ingresa un numero valido: solo numeros, espacios, parentesis y guiones.";
      const prefix = values["candidate-phone-prefix"];
      if (!prefix) return "";
      const localDigits = phone.replace(/\D/g, "");
      if (localDigits.length < 6) return "El numero local debe tener al menos 6 digitos.";
      return /^\d{9,15}$/.test(prefix.replace(/\D/g, "") + localDigits) ? "" : "El telefono completo debe tener entre 9 y 15 digitos incluyendo el prefijo internacional.";
    }
    case "candidate-cv": {
      const file = values[field];
      if (!file) return "Este campo es obligatorio.";
      const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
      if (!["pdf", "doc", "docx"].includes(extension)) return "El archivo debe estar en formato PDF, DOC o DOCX.";
      return file.size > 5 * 1024 * 1024 ? "El CV supera el tamaño máximo permitido (5 MB)." : "";
    }
    case "salary-expectation":
      if (!values[field].trim()) return "Este campo es obligatorio.";
      return /^\d+$/.test(values[field].trim()) ? "" : "Ingresa solo numeros en USD (sin simbolos ni letras).";
    case "candidate-skills": return !values[field].trim() ? "Este campo es obligatorio." : "";
    default: return !values[field] ? "Este campo es obligatorio." : "";
  }
}