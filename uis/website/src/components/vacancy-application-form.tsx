"use client";
import { useValidatedForm } from "@/hooks/use-validated-form";
import { readVacancyValues, vacancyFields, validateVacancyField } from "@/lib/vacancy-validation";
export default function VacancyApplicationForm() {
    const { formProps, fieldProps, errorProps, feedbackProps } = useValidatedForm({
        fields: vacancyFields,
        read: readVacancyValues,
        validate: validateVacancyField,
        related: { "candidate-phone-prefix": ["candidate-phone"] },
        sanitize: (input) => {
            if (input.name === "salary-expectation")
                input.value = input.value.replace(/\D/g, "");
        },
        errorMessage: "Debes completar los campos obligatorios marcados en rojo antes de enviar tu postulación.",
        successMessage: () => "Información completada correctamente. Tu postulación está lista para continuar en el proceso.",
        successFieldState: true,
    });
    return (<form id="apply-popup-form" className="mt-6 space-y-5" aria-describedby="apply-modal-description apply-popup-feedback" {...formProps}>
  <p id="apply-popup-feedback" role="status" aria-live="polite" {...feedbackProps("mb-2 hidden rounded-lg border px-3 py-2 text-sm")}/>
  <div className="grid gap-4 sm:grid-cols-2">
    <div>
      <label htmlFor="candidate-name" className="mb-2 block text-sm font-semibold text-slate-100">Nombre completo</label>
      <input id="candidate-name" name="candidate-name" type="text" required aria-describedby="apply-error-candidate-name" placeholder="Nombre y apellido" {...fieldProps("candidate-name", "w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-100 placeholder:text-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300")}/>
      <p id="apply-error-candidate-name" role="alert" {...errorProps("candidate-name", "mt-2 hidden text-xs text-rose-300")}/>
    </div>
    <div>
      <label htmlFor="candidate-email" className="mb-2 block text-sm font-semibold text-slate-100">Email profesional</label>
      <input id="candidate-email" name="candidate-email" type="email" required aria-describedby="apply-error-candidate-email" placeholder="nombre@correo.com" {...fieldProps("candidate-email", "w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-100 placeholder:text-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300")}/>
      <p id="apply-error-candidate-email" role="alert" {...errorProps("candidate-email", "mt-2 hidden text-xs text-rose-300")}/>
    </div>
    <div>
      <label htmlFor="candidate-phone" className="mb-2 block text-sm font-semibold text-slate-100">Numero de telefono</label>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-[minmax(0,0.95fr)_minmax(0,1.45fr)]">
        <select id="candidate-phone-prefix" name="candidate-phone-prefix" required aria-describedby="apply-error-candidate-phone-prefix" {...fieldProps("candidate-phone-prefix", "w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300")} defaultValue="">
          <option value="">Prefijo internacional</option>
          <optgroup label="Europa">
            <option value={+34}>🇪🇸 Espana (+34)</option>
            <option value={+351}>🇵🇹 Portugal (+351)</option>
            <option value={+33}>🇫🇷 Francia (+33)</option>
            <option value={+49}>🇩🇪 Alemania (+49)</option>
            <option value={+39}>🇮🇹 Italia (+39)</option>
            <option value={+31}>🇳🇱 Paises Bajos (+31)</option>
            <option value={+32}>🇧🇪 Belgica (+32)</option>
            <option value={+41}>🇨🇭 Suiza (+41)</option>
            <option value={+43}>🇦🇹 Austria (+43)</option>
            <option value={+46}>🇸🇪 Suecia (+46)</option>
            <option value={+45}>🇩🇰 Dinamarca (+45)</option>
            <option value={+47}>🇳🇴 Noruega (+47)</option>
            <option value={+48}>🇵🇱 Polonia (+48)</option>
            <option value={+353}>🇮🇪 Irlanda (+353)</option>
            <option value={+380}>🇺🇦 Ucrania (+380)</option>
          </optgroup>
          <optgroup label="Norteamerica y Caribe">
            <option value={+1}>🇺🇸 Estados Unidos (+1)</option>
            <option value={+1}>🇨🇦 Canada (+1)</option>
            <option value={+52}>🇲🇽 Mexico (+52)</option>
            <option value={+53}>🇨🇺 Cuba (+53)</option>
            <option value="+1-809">🇩🇴 Republica Dominicana (+1-809)</option>
            <option value="+1-876">🇯🇲 Jamaica (+1-876)</option>
            <option value="+1-242">🇧🇸 Bahamas (+1-242)</option>
          </optgroup>
          <optgroup label="Centroamerica">
            <option value={+502}>🇬🇹 Guatemala (+502)</option>
            <option value={+503}>🇸🇻 El Salvador (+503)</option>
            <option value={+504}>🇭🇳 Honduras (+504)</option>
            <option value={+505}>🇳🇮 Nicaragua (+505)</option>
            <option value={+506}>🇨🇷 Costa Rica (+506)</option>
            <option value={+507}>🇵🇦 Panama (+507)</option>
            <option value={+501}>🇧🇿 Belice (+501)</option>
          </optgroup>
          <optgroup label="Latinoamerica">
            <option value={+54}>🇦🇷 Argentina (+54)</option>
            <option value={+55}>🇧🇷 Brasil (+55)</option>
            <option value={+56}>🇨🇱 Chile (+56)</option>
            <option value={+57}>🇨🇴 Colombia (+57)</option>
            <option value={+51}>🇵🇪 Peru (+51)</option>
            <option value={+58}>🇻🇪 Venezuela (+58)</option>
            <option value={+593}>🇪🇨 Ecuador (+593)</option>
            <option value={+598}>🇺🇾 Uruguay (+598)</option>
            <option value={+595}>🇵🇾 Paraguay (+595)</option>
            <option value={+591}>🇧🇴 Bolivia (+591)</option>
          </optgroup>
          <optgroup label="Reino Unido y Asia">
            <option value={+44}>🇬🇧 Reino Unido (+44)</option>
            <option value={+91}>🇮🇳 India (+91)</option>
            <option value={+81}>🇯🇵 Japon (+81)</option>
            <option value={+82}>🇰🇷 Corea del Sur (+82)</option>
            <option value={+86}>🇨🇳 China (+86)</option>
            <option value={+65}>🇸🇬 Singapur (+65)</option>
            <option value={+971}>🇦🇪 Emiratos Arabes Unidos (+971)</option>
            <option value={+60}>🇲🇾 Malasia (+60)</option>
            <option value={+62}>🇮🇩 Indonesia (+62)</option>
            <option value={+63}>🇵🇭 Filipinas (+63)</option>
          </optgroup>
          <optgroup label="Oceania y Africa">
            <option value={+61}>🇦🇺 Australia (+61)</option>
            <option value={+64}>🇳🇿 Nueva Zelanda (+64)</option>
            <option value={+27}>🇿🇦 Sudafrica (+27)</option>
            <option value={+20}>🇪🇬 Egipto (+20)</option>
            <option value={+234}>🇳🇬 Nigeria (+234)</option>
            <option value={+254}>🇰🇪 Kenia (+254)</option>
            <option value={+212}>🇲🇦 Marruecos (+212)</option>
          </optgroup>
        </select>
        <input id="candidate-phone" name="candidate-phone" type="tel" required aria-describedby="apply-error-candidate-phone" placeholder="Numero local (sin prefijo)" {...fieldProps("candidate-phone", "w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-100 placeholder:text-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300")}/>
      </div>
      <p id="apply-error-candidate-phone-prefix" role="alert" {...errorProps("candidate-phone-prefix", "mt-2 hidden text-xs text-rose-300")}/>
      <p id="apply-error-candidate-phone" role="alert" {...errorProps("candidate-phone", "mt-2 hidden text-xs text-rose-300")}/>
    </div>
    <div>
      <label htmlFor="candidate-cv" className="mb-2 block text-sm font-semibold text-slate-100">Adjuntar CV</label>
      <input id="candidate-cv" name="candidate-cv" type="file" required accept=".pdf,.doc,.docx" aria-describedby="apply-error-candidate-cv" {...fieldProps("candidate-cv", "w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-slate-200 file:mr-3 file:rounded-md file:border-0 file:bg-cyan-300 file:px-3 file:py-2 file:font-semibold file:text-slate-950 hover:file:bg-cyan-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300")}/>
      <p id="apply-error-candidate-cv" role="alert" {...errorProps("candidate-cv", "mt-2 hidden text-xs text-rose-300")}/>
    </div>
    <div>
      <label htmlFor="english-level" className="mb-2 block text-sm font-semibold text-slate-100">Nivel de inglés</label>
      <select id="english-level" name="english-level" required aria-describedby="apply-error-english-level" {...fieldProps("english-level", "w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300")} defaultValue="">
        <option value="">Selecciona nivel</option>
        <option value="a1">A1</option>
        <option value="a2">A2</option>
        <option value="b1">B1</option>
        <option value="b2">B2</option>
        <option value="c1">C1</option>
        <option value="c2">C2</option>
        <option value="nativo">Nativo</option>
      </select>
      <p id="apply-error-english-level" role="alert" {...errorProps("english-level", "mt-2 hidden text-xs text-rose-300")}/>
    </div>
    <div>
      <label htmlFor="experience-years" className="mb-2 block text-sm font-semibold text-slate-100">Años de experiencia</label>
      <select id="experience-years" name="experience-years" required aria-describedby="apply-error-experience-years" {...fieldProps("experience-years", "w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300")} defaultValue="">
        <option value="">Selecciona años de experiencia</option>
        <option value="0-1">0 a 1</option>
        <option value="2-3">2 a 3</option>
        <option value="4-5">4 a 5</option>
        <option value="6-10">6 a 10</option>
        <option value="10+">Más de 10</option>
      </select>
      <p id="apply-error-experience-years" role="alert" {...errorProps("experience-years", "mt-2 hidden text-xs text-rose-300")}/>
    </div>
    <div>
      <label htmlFor="seniority-level" className="mb-2 block text-sm font-semibold text-slate-100">Seniority Level</label>
      <select id="seniority-level" name="seniority-level" required aria-describedby="apply-error-seniority-level" {...fieldProps("seniority-level", "w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300")} defaultValue="">
        <option value="">Selecciona seniority</option>
        <option value="junior">Junior</option>
        <option value="semi-senior">Semi-Senior</option>
        <option value="senior">Senior</option>
        <option value="lead">Lead</option>
        <option value="executive">Executive</option>
      </select>
      <p id="apply-error-seniority-level" role="alert" {...errorProps("seniority-level", "mt-2 hidden text-xs text-rose-300")}/>
    </div>
    <div>
      <label htmlFor="availability" className="mb-2 block text-sm font-semibold text-slate-100">Disponibilidad</label>
      <select id="availability" name="availability" required aria-describedby="apply-error-availability" {...fieldProps("availability", "w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300")} defaultValue="">
        <option value="">Selecciona disponibilidad</option>
        <option value="immediata">Inmediata</option>
        <option value="1_mes">2 semanas</option>
        <option value="2_meses">1 mes</option>
        <option value="no_disponible">No disponible</option>
      </select>
      <p id="apply-error-availability" role="alert" {...errorProps("availability", "mt-2 hidden text-xs text-rose-300")}/>
    </div>
    <div>
      <label htmlFor="salary-expectation" className="mb-2 block text-sm font-semibold text-slate-100">Expectativa salarial en USD</label>
      <input id="salary-expectation" name="salary-expectation" type="text" inputMode="numeric" pattern="[0-9]+" required aria-describedby="apply-error-salary-expectation" placeholder="Ejemplo: 45000" {...fieldProps("salary-expectation", "w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-100 placeholder:text-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300")}/>
      <p id="apply-error-salary-expectation" role="alert" {...errorProps("salary-expectation", "mt-2 hidden text-xs text-rose-300")}/>
    </div>
  </div>
  <div>
    <label htmlFor="candidate-skills" className="mb-2 block text-sm font-semibold text-slate-100">Habilidades/Tecnologías</label>
    <input id="candidate-skills" name="candidate-skills" type="text" required aria-describedby="apply-error-candidate-skills" placeholder="Ejemplo: Excel, SQL, React, Atención al cliente" {...fieldProps("candidate-skills", "w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-100 placeholder:text-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300")}/>
    <p id="apply-error-candidate-skills" role="alert" {...errorProps("candidate-skills", "mt-2 hidden text-xs text-rose-300")}/>
  </div>
  <div className="flex flex-wrap gap-3 pt-2">
    <button type="submit" className="rounded-full bg-cyan-300 px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-200 hover:shadow-lg hover:shadow-cyan-500/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300">Enviar postulación</button>
    <button type="button" popoverTarget="apply-modal" popoverTargetAction="hide" className="rounded-full border border-slate-600 px-5 py-2.5 text-sm font-bold text-slate-100 transition hover:border-cyan-300 hover:text-cyan-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300">Cancelar</button>
  </div>
    </form>);
}
