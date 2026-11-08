"use client";
import { useValidatedForm } from "@/hooks/use-validated-form";
import { applicationFields, AVAILABILITY_MAP, isFieldRequired, readApplicationValues, validateApplicationField } from "@/lib/application-validation";
export default function ApplicationForm() {
    const { formProps, fieldProps, errorProps, feedbackProps, resetForm } = useValidatedForm({
        fields: applicationFields,
        read: readApplicationValues,
        validate: validateApplicationField,
        required: (field, values) => isFieldRequired(field, values ?? { applicationType: "", nativeLanguage: "" }),
        related: {
            applicationType: ["professionalEmail", "country", "currentCompany", "companySize", "linkedinUrl", "experienceYears", "nativeLanguage", "englishLevel", "workMode", "salaryCurrency", "salaryRange", "availability", "cvFile"],
            nativeLanguage: ["englishLevel"],
        },
        errorMessage: "Revisa los campos marcados y corrige los errores antes de enviar.",
        successMessage: (values) => values.applicationType === "empresa-talento"
            ? "Solicitud enviada con éxito. Un consultor de Nexova contactará a tu empresa en menos de 24 horas laborables."
            : "Solicitud enviada con éxito. El equipo de Nexova revisará tu CV y te contactará sobre vacantes afines.",
    });
    return (<div>
  <div id="form-feedback" role="status" aria-live="polite" {...feedbackProps("mb-6 hidden rounded-xl border px-4 py-3 text-sm")}/><form id="application-form" aria-describedby="form-feedback" className="space-y-10" {...formProps}>
    <fieldset className="space-y-5">
      <legend className="text-xl font-bold text-white [font-family:'Sora',ui-sans-serif,system-ui,sans-serif]">Tipo de solicitud</legend>
      <div>
        <label htmlFor="applicationType" className="mb-2 block text-sm font-semibold text-slate-100">Selecciona una opción *</label>
        <select id="applicationType" name="applicationType" data-validate="applicationType" aria-describedby="error-applicationType" {...fieldProps("applicationType", "w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300")} defaultValue="">
          <option value="">Selecciona el tipo de solicitud</option>
          <option value="vacante">Soy candidato y quiero postular a vacantes</option>
          <option value="empresa-talento">Soy empresa y busco talento humano</option>
        </select>
        <p id="error-applicationType" role="alert" {...errorProps("applicationType", "mt-2 hidden text-sm text-rose-300")}/>
      </div>
    </fieldset>
    <fieldset className="space-y-5">
      <legend className="text-xl font-bold text-white [font-family:'Sora',ui-sans-serif,system-ui,sans-serif]">Datos de contacto</legend>
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="fullName" className="mb-2 block text-sm font-semibold text-slate-100">Nombre completo *</label>
          <input id="fullName" name="fullName" type="text" autoComplete="name" data-validate="fullName" aria-describedby="error-fullName" {...fieldProps("fullName", "w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-100 placeholder:text-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300")}/>
          <p id="error-fullName" role="alert" {...errorProps("fullName", "mt-2 hidden text-sm text-rose-300")}/>
        </div>
        <div>
          <label htmlFor="professionalEmail" className="mb-2 block text-sm font-semibold text-slate-100">Email de contacto *</label>
          <input id="professionalEmail" name="professionalEmail" type="email" autoComplete="email" data-validate="professionalEmail" aria-describedby="error-professionalEmail" placeholder="nombre@correo.com" {...fieldProps("professionalEmail", "w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-100 placeholder:text-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300")}/>
          <p id="error-professionalEmail" role="alert" {...errorProps("professionalEmail", "mt-2 hidden text-sm text-rose-300")}/>
        </div>
        <div>
          <label htmlFor="phone" className="mb-2 block text-sm font-semibold text-slate-100">Teléfono *</label>
          <input id="phone" name="phone" type="tel" autoComplete="tel" data-validate="phone" aria-describedby="error-phone" placeholder="+34 600 123 456" {...fieldProps("phone", "w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-100 placeholder:text-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300")}/>
          <p id="error-phone" role="alert" {...errorProps("phone", "mt-2 hidden text-sm text-rose-300")}/>
        </div>
        <div>
          <label htmlFor="country" className="mb-2 block text-sm font-semibold text-slate-100">País *</label>
          <select id="country" name="country" autoComplete="country-name" data-validate="country" aria-describedby="error-country" {...fieldProps("country", "w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300")} defaultValue="">
            <option value="">Selecciona un país</option>
            <option value="espana">España</option>
            <option value="estados-unidos">Estados Unidos</option>
          </select>
          <p id="error-country" role="alert" {...errorProps("country", "mt-2 hidden text-sm text-rose-300")}/>
        </div>
        <div>
          <label htmlFor="city" className="mb-2 block text-sm font-semibold text-slate-100">Ciudad *</label>
          <input id="city" name="city" type="text" autoComplete="address-level2" data-validate="city" aria-describedby="error-city" {...fieldProps("city", "w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-100 placeholder:text-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300")}/>
          <p id="error-city" role="alert" {...errorProps("city", "mt-2 hidden text-sm text-rose-300")}/>
        </div>
        <div>
          <label htmlFor="currentCompany" className="mb-2 block text-sm font-semibold text-slate-100">Empresa (solo si buscas talento)</label>
          <input id="currentCompany" name="currentCompany" type="text" data-validate="currentCompany" aria-describedby="error-currentCompany" placeholder="Nombre de la empresa" {...fieldProps("currentCompany", "w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-100 placeholder:text-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300")}/>
          <p id="error-currentCompany" role="alert" {...errorProps("currentCompany", "mt-2 hidden text-sm text-rose-300")}/>
        </div>
        <div>
          <label htmlFor="currentRole" className="mb-2 block text-sm font-semibold text-slate-100">Perfil o posición *</label>
          <input id="currentRole" name="currentRole" type="text" data-validate="currentRole" aria-describedby="error-currentRole" placeholder="Ejemplo: Desarrollador Frontend o Analista de Datos" {...fieldProps("currentRole", "w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-100 placeholder:text-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300")}/>
          <p id="error-currentRole" role="alert" {...errorProps("currentRole", "mt-2 hidden text-sm text-rose-300")}/>
        </div>
        <div>
          <label htmlFor="professionalArea" className="mb-2 block text-sm font-semibold text-slate-100">Área profesional *</label>
          <select id="professionalArea" name="professionalArea" data-validate="professionalArea" aria-describedby="error-professionalArea" {...fieldProps("professionalArea", "w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300")} defaultValue="">
            <option value="">Selecciona un área</option>
            <option value="tecnologia">Tecnología</option>
            <option value="datos-ia">Datos e IA</option>
            <option value="producto">Producto</option>
            <option value="diseno">Diseño</option>
            <option value="marketing">Marketing</option>
            <option value="ventas">Ventas</option>
            <option value="operaciones">Operaciones</option>
            <option value="soporte">Soporte al cliente</option>
            <option value="atencion-cliente">Atención al cliente</option>
            <option value="caja">Caja</option>
            <option value="reposicion">Reposición</option>
            <option value="ventas-tienda">Ventas en tienda</option>
            <option value="almacen">Almacén</option>
            <option value="inventario">Inventario</option>
            <option value="logistica">Logística y distribución</option>
            <option value="produccion">Producción</option>
            <option value="mantenimiento">Mantenimiento</option>
            <option value="limpieza">Limpieza</option>
            <option value="hosteleria">Hostelería y restauración</option>
            <option value="conduccion-reparto">Conducción y reparto</option>
            <option value="merchandising">Merchandising y promotoría</option>
            <option value="administracion">Administración</option>
            <option value="finanzas">Finanzas</option>
            <option value="rrhh">Recursos humanos</option>
            <option value="otro">Otro</option>
          </select>
          <p id="error-professionalArea" role="alert" {...errorProps("professionalArea", "mt-2 hidden text-sm text-rose-300")}/>
        </div>
        <div>
          <label htmlFor="companySize" className="mb-2 block text-sm font-semibold text-slate-100">Tamaño de empresa (solo empresas)</label>
          <select id="companySize" name="companySize" data-validate="companySize" aria-describedby="error-companySize" {...fieldProps("companySize", "w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300")} defaultValue="">
            <option value="">Selecciona tamaño</option>
            <option value="1-10">1 a 10 personas</option>
            <option value="11-50">11 a 50 personas</option>
            <option value="51-200">51 a 200 personas</option>
            <option value="201-500">201 a 500 personas</option>
            <option value="500+">Más de 500 personas</option>
          </select>
          <p id="error-companySize" role="alert" {...errorProps("companySize", "mt-2 hidden text-sm text-rose-300")}/>
        </div>
      </div>
    </fieldset>
    <fieldset className="space-y-5">
      <legend className="text-xl font-bold text-white [font-family:'Sora',ui-sans-serif,system-ui,sans-serif]">Datos del candidato (solo si postulas a vacantes)</legend>
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="linkedinUrl" className="mb-2 block text-sm font-semibold text-slate-100">LinkedIn (opcional)</label>
          <input id="linkedinUrl" name="linkedinUrl" type="url" autoComplete="url" data-validate="linkedinUrl" aria-describedby="error-linkedinUrl" placeholder="https://www.linkedin.com/in/tu-perfil" {...fieldProps("linkedinUrl", "w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-100 placeholder:text-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300")}/>
          <p id="error-linkedinUrl" role="alert" {...errorProps("linkedinUrl", "mt-2 hidden text-sm text-rose-300")}/>
        </div>
        <div>
          <label htmlFor="experienceYears" className="mb-2 block text-sm font-semibold text-slate-100">Años de experiencia *</label>
          <input id="experienceYears" name="experienceYears" type="number" min={0} max={45} data-validate="experienceYears" aria-describedby="error-experienceYears" placeholder="3" {...fieldProps("experienceYears", "w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-100 placeholder:text-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300")}/>
          <p id="error-experienceYears" role="alert" {...errorProps("experienceYears", "mt-2 hidden text-sm text-rose-300")}/>
        </div>
        <div>
          <label htmlFor="nativeLanguage" className="mb-2 block text-sm font-semibold text-slate-100">Idioma nativo *</label>
          <select id="nativeLanguage" name="nativeLanguage" data-validate="nativeLanguage" aria-describedby="error-nativeLanguage" {...fieldProps("nativeLanguage", "w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300")} defaultValue="">
            <option value="">Selecciona una opción</option>
            <option value="ingles">Inglés</option>
            <option value="otro">Otro</option>
          </select>
          <p id="error-nativeLanguage" role="alert" {...errorProps("nativeLanguage", "mt-2 hidden text-sm text-rose-300")}/>
        </div>
        <div>
          <label htmlFor="englishLevel" className="mb-2 block text-sm font-semibold text-slate-100">Nivel de inglés</label>
          <select id="englishLevel" name="englishLevel" data-validate="englishLevel" aria-describedby="error-englishLevel" {...fieldProps("englishLevel", "w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300")} defaultValue="">
            <option value="">Selecciona nivel</option>
            <option value="a2">A2 - Básico</option>
            <option value="b1">B1 - Intermedio</option>
            <option value="b2">B2 - Intermedio alto</option>
            <option value="c1">C1 - Avanzado</option>
            <option value="c2">C2 - Bilingüe/profesional</option>
          </select>
          <p className="mt-2 text-xs text-slate-400">Obligatorio cuando el idioma nativo es otro.</p>
          <p id="error-englishLevel" role="alert" {...errorProps("englishLevel", "mt-2 hidden text-sm text-rose-300")}/>
        </div>
        <div>
          <label htmlFor="salaryRange" className="mb-2 block text-sm font-semibold text-slate-100">Rango salarial esperado (bruto anual) *</label>
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label htmlFor="salaryCurrency" className="sr-only">Moneda salarial</label>
              <select id="salaryCurrency" name="salaryCurrency" data-validate="salaryCurrency" aria-describedby="error-salaryCurrency" {...fieldProps("salaryCurrency", "w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300")} defaultValue="">
                <option value="">Moneda</option>
                <option value="eur">EUR (€)</option>
                <option value="usd">USD ($)</option>
              </select>
              <p id="error-salaryCurrency" role="alert" {...errorProps("salaryCurrency", "mt-2 hidden text-sm text-rose-300")}/>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="salaryRange" className="sr-only">Monto salarial</label>
              <input id="salaryRange" name="salaryRange" type="number" min={12000} max={500000} data-validate="salaryRange" aria-describedby="error-salaryRange" placeholder="45000" {...fieldProps("salaryRange", "w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-100 placeholder:text-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300")}/>
            </div>
          </div>
          <p id="error-salaryRange" role="alert" {...errorProps("salaryRange", "mt-2 hidden text-sm text-rose-300")}/>
        </div>
        <div>
          <label htmlFor="availability" className="mb-2 block text-sm font-semibold text-slate-100">Disponibilidad de incorporación *</label>
          <select id="availability" name="availability" data-validate="availability" aria-describedby="error-availability" {...fieldProps("availability", "w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300")} defaultValue="">{[<option key="placeholder" value="" disabled>Selecciona tu disponibilidad</option>, ...Object.entries(AVAILABILITY_MAP).map(([value, label]) => <option key={value} value={value}>{label}</option>)]}</select>
          <p id="error-availability" role="alert" {...errorProps("availability", "mt-2 hidden text-sm text-rose-300")}/>
        </div>
        <div>
          <p className="mb-2 block text-sm font-semibold text-slate-100">Modalidad preferida *</p>
          <fieldset aria-describedby="error-workMode" className={fieldProps("workMode", "rounded-lg border border-slate-700 bg-slate-950 p-3").className} aria-invalid={fieldProps("workMode", "")["aria-invalid"]}>
            <legend className="sr-only">Modalidad preferida</legend>
            <div className="flex flex-col gap-2 sm:flex-row sm:gap-6">
              <label className="inline-flex items-center gap-2"><input type="radio" name="workMode" defaultValue="remoto" data-validate="workMode" {...fieldProps("workMode", "h-4 w-4 border-slate-500 bg-slate-900 text-cyan-300 focus:ring-cyan-300")}/>Remoto</label>
              <label className="inline-flex items-center gap-2"><input type="radio" name="workMode" defaultValue="hibrido" data-validate="workMode" {...fieldProps("workMode", "h-4 w-4 border-slate-500 bg-slate-900 text-cyan-300 focus:ring-cyan-300")}/>Híbrido</label>
              <label className="inline-flex items-center gap-2"><input type="radio" name="workMode" defaultValue="presencial" data-validate="workMode" {...fieldProps("workMode", "h-4 w-4 border-slate-500 bg-slate-900 text-cyan-300 focus:ring-cyan-300")}/>Presencial</label>
            </div>
          </fieldset>
          <p id="error-workMode" role="alert" {...errorProps("workMode", "mt-2 hidden text-sm text-rose-300")}/>
        </div>
      </div>
    </fieldset>
    <fieldset className="space-y-5">
      <legend className="text-xl font-bold text-white [font-family:'Sora',ui-sans-serif,system-ui,sans-serif]">Detalle de la solicitud</legend>
      <div className="grid gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <label htmlFor="message" className="mb-2 block text-sm font-semibold text-slate-100">Mensaje *</label>
          <textarea id="message" name="message" rows={5} data-validate="message" aria-describedby="message-hint error-message" placeholder="Si eres candidato, resume tu perfil. Si eres empresa, describe vacantes, seniority y cantidad de posiciones." defaultValue={""} {...fieldProps("message", "w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300")}/>
          <p id="message-hint" className="mt-2 text-xs text-slate-400">Mínimo 20 caracteres.</p>
          <p id="error-message" role="alert" {...errorProps("message", "mt-2 hidden text-sm text-rose-300")}/>
        </div>
        <div>
          <label htmlFor="cvFile" className="mb-2 block text-sm font-semibold text-slate-100">Subida de CV (solo candidatos)</label>
          <input id="cvFile" name="cvFile" type="file" accept=".pdf,.doc,.docx" data-validate="cvFile" aria-describedby="cv-hint error-cvFile" {...fieldProps("cvFile", "w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-200 file:mr-4 file:rounded-md file:border-0 file:bg-cyan-300 file:px-3 file:py-2 file:font-semibold file:text-slate-950 hover:file:bg-cyan-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300")}/>
          <p id="cv-hint" className="mt-2 text-xs text-slate-400">Requerido si seleccionas "Soy candidato". Formatos: PDF, DOC o DOCX. Máx. 5MB.</p>
          <p id="error-cvFile" role="alert" {...errorProps("cvFile", "mt-2 hidden text-sm text-rose-300")}/>
        </div>
      </div>
    </fieldset>
    <fieldset className="space-y-4">
      <legend className="text-xl font-bold text-white [font-family:'Sora',ui-sans-serif,system-ui,sans-serif]">Consentimientos obligatorios</legend>
      <div className="space-y-3 rounded-lg border border-slate-700 bg-slate-950 p-4">
        <label className="flex items-start gap-3 text-sm text-slate-200">
          <input id="privacyConsent" name="privacyConsent" type="checkbox" data-validate="privacyConsent" aria-describedby="error-privacyConsent" {...fieldProps("privacyConsent", "mt-0.5 h-4 w-4 rounded border-slate-500 bg-slate-900 text-cyan-300 focus:ring-cyan-300")}/>
          Acepto la política de privacidad.
        </label>
        <p id="error-privacyConsent" role="alert" {...errorProps("privacyConsent", "hidden text-sm text-rose-300")}/>
        <label className="flex items-start gap-3 text-sm text-slate-200">
          <input id="contactConsent" name="contactConsent" type="checkbox" data-validate="contactConsent" aria-describedby="error-contactConsent" {...fieldProps("contactConsent", "mt-0.5 h-4 w-4 rounded border-slate-500 bg-slate-900 text-cyan-300 focus:ring-cyan-300")}/>
          Acepto ser contactado por Nexova Solutions para seguimiento de esta solicitud.
        </label>
        <p id="error-contactConsent" role="alert" {...errorProps("contactConsent", "hidden text-sm text-rose-300")}/>
        <label className="flex items-start gap-3 text-sm text-slate-200">
          <input id="accuracyConsent" name="accuracyConsent" type="checkbox" data-validate="accuracyConsent" aria-describedby="error-accuracyConsent" {...fieldProps("accuracyConsent", "mt-0.5 h-4 w-4 rounded border-slate-500 bg-slate-900 text-cyan-300 focus:ring-cyan-300")}/>
          Confirmo que la información proporcionada es correcta y actualizada.
        </label>
        <p id="error-accuracyConsent" role="alert" {...errorProps("accuracyConsent", "hidden text-sm text-rose-300")}/>
      </div>
    </fieldset>
    <div className="flex flex-col gap-3 border-t border-slate-800 pt-6 sm:flex-row">
      <button type="submit" className="inline-flex items-center justify-center rounded-full bg-cyan-300 px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300">Enviar solicitud</button>
      <button id="reset-button" type="button" className="inline-flex items-center justify-center rounded-full border border-slate-600 px-6 py-3 text-sm font-bold text-slate-100 transition hover:border-slate-400 hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300" onClick={resetForm}>Limpiar formulario</button>
    </div>
  </form>
    </div>);
}
