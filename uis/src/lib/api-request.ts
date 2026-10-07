export async function fetchApi(
  input: RequestInfo | URL,
  init: RequestInit,
  networkErrorMessage: string,
): Promise<Response> {
  try {
    return await fetch(input, init);
  } catch {
    throw new Error(networkErrorMessage);
  }
}

export async function readResponseText(response: Response): Promise<string> {
  try {
    return await response.text();
  } catch {
    throw new Error("No se pudo leer la respuesta. Inténtalo de nuevo.");
  }
}

export function publicHttpErrorMessage(status: number): string {
  if (status === 400 || status === 422) {
    return "No se pudieron validar los datos. Comprueba el formulario e inténtalo de nuevo.";
  }

  if (status === 401) {
    return "No se pudieron validar las credenciales o la sesión. Comprueba tus datos e inténtalo de nuevo.";
  }

  if (status === 403) {
    return "No tienes permiso para realizar esta acción.";
  }

  if (status === 404) {
    return "No se encontró el recurso solicitado. Actualiza la página e inténtalo de nuevo.";
  }

  if (status === 409) {
    return "La solicitud entra en conflicto con los datos actuales. Revísalos e inténtalo de nuevo.";
  }

  if (status === 429) {
    return "Hay demasiadas solicitudes. Espera un momento e inténtalo de nuevo.";
  }

  return "No se pudo completar la solicitud. Inténtalo de nuevo más tarde.";
}