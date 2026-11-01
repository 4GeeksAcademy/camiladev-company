export const requiredFields = ["name", "company", "email", "service", "company-size", "message"] as const;

export type ContactField = (typeof requiredFields)[number];
export type ContactValues = Record<ContactField, string>;
export type ContactErrors = Partial<Record<ContactField, string>>;

export function validateContact(values: ContactValues): ContactErrors {
  const errors: ContactErrors = {};
  for (const field of requiredFields) {
    if (!values[field].trim()) errors[field] = "Este campo es obligatorio.";
  }
  const email = values.email.trim();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    errors.email = "Introduce un email válido.";
  }
  const message = values.message.trim();
  if (message && message.length < 20) {
    errors.message = "Por favor, agrega un poco más de contexto (mínimo 20 caracteres).";
  }
  return errors;
}