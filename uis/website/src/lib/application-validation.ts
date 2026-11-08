import { AVAILABILITY_MAP } from "../../../../src/utils/collections";

export { AVAILABILITY_MAP };

export const applicationFields = [
  "fullName", "professionalEmail", "phone", "country", "city", "applicationType",
  "currentCompany", "currentRole", "professionalArea", "linkedinUrl", "experienceYears",
  "nativeLanguage", "englishLevel", "workMode", "salaryRange", "salaryCurrency",
  "availability", "message", "cvFile", "companySize", "privacyConsent", "contactConsent",
  "accuracyConsent",
] as const;

export type ApplicationField = (typeof applicationFields)[number];
type ConsentField = "privacyConsent" | "contactConsent" | "accuracyConsent";
export type ApplicationValues = Record<Exclude<ApplicationField, ConsentField | "cvFile">, string>
  & Record<ConsentField, boolean> & { cvFile: File | null };
export type ApplicationErrors = Partial<Record<ApplicationField, string>>;

const corporateEmailProviders = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "icloud.com", "live.com", "aol.com"];

export function isApplicationField(value: string): value is ApplicationField {
  return applicationFields.some((field) => field === value);
}

export function readApplicationValues(form: HTMLFormElement): ApplicationValues {
  const data = new FormData(form);
  const entries = applicationFields.map((field) => {
    const value = data.get(field);
    if (field === "cvFile") return [field, value instanceof File && value.name ? value : null];
    if (field === "privacyConsent" || field === "contactConsent" || field === "accuracyConsent") {
      return [field, data.has(field)];
    }
    return [field, typeof value === "string" ? value : ""];
  });
  return Object.fromEntries(entries) as ApplicationValues;
}

export function isFieldRequired(field: ApplicationField, values: Pick<ApplicationValues, "applicationType" | "nativeLanguage">): boolean {
  const candidate = values.applicationType === "vacante";
  if (field === "currentCompany" || field === "companySize") return values.applicationType === "empresa-talento";
  if (field === "englishLevel") return candidate && values.nativeLanguage === "otro";
  if (["experienceYears", "nativeLanguage", "salaryCurrency", "salaryRange", "availability", "cvFile", "workMode"].includes(field)) return candidate;
  return field !== "linkedinUrl";
}

export function validateApplicationField(field: ApplicationField, values: ApplicationValues): string {
  const candidate = values.applicationType === "vacante";
  const company = values.applicationType === "empresa-talento";
  switch (field) {
    case "fullName":
      if (!values.fullName.trim()) return "El nombre completo es obligatorio.";
      return values.fullName.trim().length < 5 ? "Introduce nombre y apellido para continuar." : "";
    case "professionalEmail": {
      const email = values.professionalEmail;
      if (!email.trim()) return "El email de contacto es obligatorio.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return "Introduce un email válido.";
      const domain = email.split("@")[1]?.toLowerCase() ?? "";
      return company && corporateEmailProviders.includes(domain) ? "Para empresas, usa un email corporativo (no personal)." : "";
    }
    case "phone":
      if (!values.phone.trim()) return "El teléfono es obligatorio.";
      return /^\+?[0-9]{9,15}$/.test(values.phone.replace(/[^\d+]/g, "")) ? "" : "Introduce un teléfono válido con prefijo internacional opcional.";
    case "country": return !values.country.trim() ? "El país es obligatorio." : "";
    case "city": return !values.city.trim() ? "La ciudad es obligatoria." : "";
    case "applicationType": return !values.applicationType ? "Selecciona el tipo de solicitud para continuar." : "";
    case "currentCompany": return company && !values.currentCompany.trim() ? "Si representas una empresa, indica el nombre de la compañía." : "";
    case "currentRole": return !values.currentRole.trim() ? "Indica el perfil o posicion." : "";
    case "professionalArea": return !values.professionalArea ? "Selecciona un area profesional." : "";
    case "linkedinUrl":
      if (!candidate || !values.linkedinUrl.trim()) return "";
      if (!values.linkedinUrl.startsWith("https://")) return "La URL de LinkedIn debe comenzar con https://.";
      return /^https:\/\/(www\.)?linkedin\.com\/.+/i.test(values.linkedinUrl) ? "" : "Introduce una URL valida de LinkedIn (linkedin.com).";
    case "experienceYears": {
      if (!candidate) return "";
      if (values.experienceYears === "") return "Indica tus años de experiencia.";
      const years = Number(values.experienceYears);
      return Number.isNaN(years) || years < 0 || years > 45 ? "Los años de experiencia deben estar entre 0 y 45." : "";
    }
    case "nativeLanguage": return candidate && !values.nativeLanguage ? "Selecciona tu idioma nativo." : "";
    case "englishLevel": return candidate && values.nativeLanguage === "otro" && !values.englishLevel ? "Selecciona tu nivel de inglés." : "";
    case "workMode": return candidate && !values.workMode ? "Selecciona la modalidad preferida: remoto, híbrido o presencial." : "";
    case "salaryRange": {
      if (!candidate) return "";
      if (values.salaryRange === "") return "Indica tu rango salarial esperado.";
      const salary = Number(values.salaryRange);
      return Number.isNaN(salary) || salary < 12000 || salary > 500000 ? "El rango salarial debe estar entre 12.000 y 500.000 EUR anuales." : "";
    }
    case "salaryCurrency": return candidate && !values.salaryCurrency ? "Selecciona la moneda del rango salarial (EUR o USD)." : "";
    case "availability":
      if (!candidate) return "";
      if (!values.availability) return "Selecciona tu disponibilidad de incorporación.";
      return Object.hasOwn(AVAILABILITY_MAP, values.availability) ? "" : "Selecciona una disponibilidad válida.";
    case "message":
      if (!values.message.trim()) return "Describe tu perfil o necesidad del proyecto.";
      return values.message.trim().length < 20 ? "Amplia el mensaje con al menos 20 caracteres." : "";
    case "cvFile": {
      const file = values.cvFile;
      if (candidate && !file) return "Para aplicar a vacante, debes adjuntar tu CV.";
      if (!file) return "";
      const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
      if (!["pdf", "doc", "docx"].includes(extension)) return "El CV debe estar en formato PDF, DOC o DOCX.";
      return file.size > 5 * 1024 * 1024 ? "El CV supera el tamaño máximo permitido de 5MB." : "";
    }
    case "companySize": return company && !values.companySize ? "Si representas una empresa, selecciona el tamaño." : "";
    case "privacyConsent": return !values.privacyConsent ? "Debes aceptar la política de privacidad." : "";
    case "contactConsent": return !values.contactConsent ? "Debes aceptar ser contactado por Nexova." : "";
    case "accuracyConsent": return !values.accuracyConsent ? "Debes confirmar que la información es correcta." : "";
  }
}

export function validateApplication(values: ApplicationValues): ApplicationErrors {
  const errors: ApplicationErrors = {};
  for (const field of applicationFields) {
    const error = validateApplicationField(field, values);
    if (error) errors[field] = error;
  }
  return errors;
}