function setupMobileMenu() {
    const menuButton = document.getElementById("menu-button");
    const mobileMenu = document.getElementById("mobile-menu");

    if (!menuButton || !mobileMenu) return;

    const toggleMenu = () => {
        const isExpanded = menuButton.getAttribute("aria-expanded") === "true";
        menuButton.setAttribute("aria-expanded", String(!isExpanded));
        mobileMenu.classList.toggle("hidden");
    };

    menuButton.addEventListener("click", toggleMenu);

    mobileMenu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            menuButton.setAttribute("aria-expanded", "false");
            mobileMenu.classList.add("hidden");
        });
    });
}

function setupApplicationForm() {
    const form = document.getElementById("application-form");
    const feedback = document.getElementById("form-feedback");
    const resetButton = document.getElementById("reset-button");

    if (!form || !feedback) return;

    const corporateEmailProviders = [
        "gmail.com",
        "yahoo.com",
        "hotmail.com",
        "outlook.com",
        "icloud.com",
        "live.com",
        "aol.com"
    ];

    const fields = {
        fullName: document.getElementById("fullName"),
        professionalEmail: document.getElementById("professionalEmail"),
        phone: document.getElementById("phone"),
        country: document.getElementById("country"),
        city: document.getElementById("city"),
        applicationType: document.getElementById("applicationType"),
        currentCompany: document.getElementById("currentCompany"),
        currentRole: document.getElementById("currentRole"),
        professionalArea: document.getElementById("professionalArea"),
        linkedinUrl: document.getElementById("linkedinUrl"),
        experienceYears: document.getElementById("experienceYears"),
        englishLevel: document.getElementById("englishLevel"),
        workMode: form.querySelectorAll("input[name='workMode']"),
        salaryRange: document.getElementById("salaryRange"),
        availability: document.getElementById("availability"),
        message: document.getElementById("message"),
        cvFile: document.getElementById("cvFile"),
        companySize: document.getElementById("companySize"),
        privacyConsent: document.getElementById("privacyConsent"),
        contactConsent: document.getElementById("contactConsent"),
        accuracyConsent: document.getElementById("accuracyConsent")
    };

    const validationRules = {
        fullName: (value) => {
            if (!value.trim()) return "El nombre completo es obligatorio.";
            if (value.trim().length < 5) return "Introduce nombre y apellido para continuar.";
            return "";
        },
        professionalEmail: (value) => {
            if (!value.trim()) return "El email de contacto es obligatorio.";
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
            if (!emailRegex.test(value)) return "Introduce un email valido.";

            const selectedType = fields.applicationType?.value || "";
            const domain = value.split("@")[1]?.toLowerCase();
            if (selectedType === "empresa-talento" && corporateEmailProviders.includes(domain)) {
                return "Para empresas, usa un email corporativo (no personal).";
            }
            return "";
        },
        phone: (value) => {
            if (!value.trim()) return "El telefono es obligatorio.";
            const normalized = value.replace(/[^\d+]/g, "");
            const phoneRegex = /^\+?[0-9]{9,15}$/;
            if (!phoneRegex.test(normalized)) return "Introduce un telefono valido con prefijo internacional opcional.";
            return "";
        },
        country: (value) => (!value.trim() ? "El pais es obligatorio." : ""),
        city: (value) => (!value.trim() ? "La ciudad es obligatoria." : ""),
        applicationType: (value) => (!value ? "Selecciona el tipo de solicitud para continuar." : ""),
        currentCompany: (value) => {
            const selectedType = fields.applicationType?.value || "";
            if (selectedType === "empresa-talento" && !value.trim()) {
                return "Si representas una empresa, indica el nombre de la compania.";
            }
            return "";
        },
        currentRole: (value) => (!value.trim() ? "Indica el perfil o posicion." : ""),
        professionalArea: (value) => (!value ? "Selecciona un area profesional." : ""),
        linkedinUrl: (value) => {
            const selectedType = fields.applicationType?.value || "";
            if (selectedType !== "vacante" || !value.trim()) return "";
            if (!value.startsWith("https://")) return "La URL de LinkedIn debe comenzar con https://.";
            const linkedinRegex = /^https:\/\/(www\.)?linkedin\.com\/.+/i;
            if (!linkedinRegex.test(value)) return "Introduce una URL valida de LinkedIn (linkedin.com).";
            return "";
        },
        experienceYears: (value) => {
            const selectedType = fields.applicationType?.value || "";
            if (selectedType !== "vacante") return "";
            if (value === "") return "Indica tus anos de experiencia.";
            const number = Number(value);
            if (Number.isNaN(number) || number < 0 || number > 45) return "Los anos de experiencia deben estar entre 0 y 45.";
            return "";
        },
        englishLevel: (value) => {
            const selectedType = fields.applicationType?.value || "";
            if (selectedType !== "vacante") return "";
            return !value ? "Selecciona tu nivel de ingles." : "";
        },
        workMode: () => {
            const selectedType = fields.applicationType?.value || "";
            if (selectedType !== "vacante") return "";
            const checked = Array.from(fields.workMode).some((radio) => radio.checked);
            return checked ? "" : "Selecciona la modalidad preferida: remoto, hibrido o presencial.";
        },
        salaryRange: (value) => {
            const selectedType = fields.applicationType?.value || "";
            if (selectedType !== "vacante") return "";
            if (value === "") return "Indica tu rango salarial esperado.";
            const number = Number(value);
            if (Number.isNaN(number) || number < 12000 || number > 500000) {
                return "El rango salarial debe estar entre 12.000 y 500.000 EUR anuales.";
            }
            return "";
        },
        availability: (value) => {
            const selectedType = fields.applicationType?.value || "";
            if (selectedType !== "vacante") return "";
            return !value ? "Selecciona tu disponibilidad de incorporacion." : "";
        },
        message: (value) => {
            if (!value.trim()) return "Describe tu perfil o necesidad del proyecto.";
            if (value.trim().length < 20) return "Amplia el mensaje con al menos 20 caracteres.";
            return "";
        },
        cvFile: () => {
            const selectedType = fields.applicationType?.value || "";
            const file = fields.cvFile?.files?.[0];
            const allowedExtensions = ["pdf", "doc", "docx"];

            if (selectedType === "vacante" && !file) {
                return "Para aplicar a vacante, debes adjuntar tu CV.";
            }

            if (!file) return "";

            const extension = file.name.split(".").pop()?.toLowerCase();
            if (!allowedExtensions.includes(extension || "")) {
                return "El CV debe estar en formato PDF, DOC o DOCX.";
            }

            const maxSize = 5 * 1024 * 1024;
            if (file.size > maxSize) return "El CV supera el tamano maximo permitido de 5MB.";
            return "";
        },
        companySize: (value) => {
            const selectedType = fields.applicationType?.value || "";
            if (selectedType === "empresa-talento" && !value) {
                return "Si representas una empresa, selecciona el tamano.";
            }
            return "";
        },
        privacyConsent: (value, input) => (!input.checked ? "Debes aceptar la politica de privacidad." : ""),
        contactConsent: (value, input) => (!input.checked ? "Debes aceptar ser contactado por Nexova." : ""),
        accuracyConsent: (value, input) => (!input.checked ? "Debes confirmar que la informacion es correcta." : "")
    };

    function getInputStateTarget(fieldName) {
        if (fieldName === "workMode") {
            return form.querySelector("fieldset[aria-describedby='error-workMode']") || fields.workMode[0];
        }
        return fields[fieldName];
    }

    function setFieldState(input, status) {
        if (!input) return;

        const stateClasses = [
            "border-rose-400",
            "border-emerald-400",
            "border-slate-700",
            "bg-rose-500/5",
            "bg-emerald-500/5",
            "ring-1",
            "ring-rose-400/50",
            "ring-emerald-400/40"
        ];
        input.classList.remove(...stateClasses);

        if (status === "error") {
            input.classList.add("border-rose-400", "bg-rose-500/5", "ring-1", "ring-rose-400/50");
            input.setAttribute("aria-invalid", "true");
        } else if (status === "success") {
            input.classList.add("border-emerald-400", "bg-emerald-500/5", "ring-1", "ring-emerald-400/40");
            input.setAttribute("aria-invalid", "false");
        } else {
            input.classList.add("border-slate-700");
            input.removeAttribute("aria-invalid");
        }
    }

    function setErrorMessageState(errorElement, status) {
        if (!errorElement) return;

        const toneClasses = [
            "hidden",
            "text-rose-300",
            "text-emerald-300",
            "border",
            "border-rose-400/40",
            "border-emerald-400/40",
            "bg-rose-500/10",
            "bg-emerald-500/10",
            "rounded-lg",
            "px-3",
            "py-2",
            "font-medium"
        ];
        errorElement.classList.remove(...toneClasses);

        if (status === "error") {
            errorElement.classList.add(
                "text-rose-300",
                "border",
                "border-rose-400/40",
                "bg-rose-500/10",
                "rounded-lg",
                "px-3",
                "py-2",
                "font-medium"
            );
        } else if (status === "success") {
            errorElement.classList.add(
                "text-emerald-300",
                "border",
                "border-emerald-400/40",
                "bg-emerald-500/10",
                "rounded-lg",
                "px-3",
                "py-2",
                "font-medium"
            );
        } else {
            errorElement.classList.add("hidden");
        }
    }

    function showError(fieldName, message) {
        const errorElement = document.getElementById(`error-${fieldName}`);
        const stateTarget = getInputStateTarget(fieldName);

        if (!errorElement) return;

        if (message) {
            errorElement.textContent = message;
            setErrorMessageState(errorElement, "error");
            setFieldState(stateTarget, "error");
        } else {
            errorElement.textContent = "";
            setErrorMessageState(errorElement, "default");
            setFieldState(stateTarget, "success");
        }
    }

    function validateField(fieldName) {
        const field = fields[fieldName];
        const rule = validationRules[fieldName];
        if (!rule || !field) return true;

        const value = fieldName === "workMode"
            ? ""
            : "value" in field
                ? field.value
                : "";

        const error = rule(value, field);
        showError(fieldName, error);
        return !error;
    }

    function validateAll() {
        let firstInvalidField = null;
        let hasErrors = false;

        Object.keys(validationRules).forEach((fieldName) => {
            const isValid = validateField(fieldName);
            if (!isValid && !firstInvalidField) {
                firstInvalidField = getInputStateTarget(fieldName);
            }
            if (!isValid) hasErrors = true;
        });

        if (hasErrors && firstInvalidField?.focus) firstInvalidField.focus();
        return !hasErrors;
    }

    function showFeedback(message, type) {
        feedback.textContent = message;
        feedback.classList.remove(
            "hidden",
            "border-rose-400",
            "bg-rose-500/10",
            "text-rose-200",
            "border-emerald-400",
            "bg-emerald-500/10",
            "text-emerald-200",
            "shadow-lg",
            "shadow-rose-500/10",
            "shadow-emerald-500/10"
        );

        if (type === "error") {
            feedback.classList.add("border-rose-400", "bg-rose-500/10", "text-rose-200", "shadow-lg", "shadow-rose-500/10");
        } else {
            feedback.classList.add("border-emerald-400", "bg-emerald-500/10", "text-emerald-200", "shadow-lg", "shadow-emerald-500/10");
        }
    }

    Object.keys(validationRules).forEach((fieldName) => {
        const field = fields[fieldName];

        if (fieldName === "workMode") {
            fields.workMode.forEach((radio) => {
                radio.addEventListener("change", () => validateField("workMode"));
            });
            return;
        }

        if (fieldName === "cvFile") {
            field.addEventListener("change", () => validateField("cvFile"));
            return;
        }

        if (!field || typeof field.addEventListener !== "function") return;

        field.addEventListener("input", () => validateField(fieldName));
        field.addEventListener("blur", () => validateField(fieldName));
    });

    fields.applicationType?.addEventListener("change", () => {
        validateField("applicationType");
        validateField("professionalEmail");
        validateField("currentCompany");
        validateField("companySize");
        validateField("linkedinUrl");
        validateField("experienceYears");
        validateField("englishLevel");
        validateField("workMode");
        validateField("salaryRange");
        validateField("availability");
        validateField("cvFile");
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const isValid = validateAll();
        if (!isValid) {
            showFeedback("Revisa los campos marcados y corrige los errores antes de enviar.", "error");
            return;
        }

        const selectedType = fields.applicationType?.value || "";
        const successMessage = selectedType === "empresa-talento"
            ? "Solicitud enviada con exito. Un consultor de Nexova contactara a tu empresa en menos de 24 horas laborables."
            : "Solicitud enviada con exito. El equipo de Nexova revisara tu CV y te contactara sobre vacantes afines.";
        showFeedback(successMessage, "success");
        form.reset();

        Object.keys(validationRules).forEach((fieldName) => {
            const stateTarget = getInputStateTarget(fieldName);
            const errorElement = document.getElementById(`error-${fieldName}`);
            if (errorElement) {
                errorElement.textContent = "";
                setErrorMessageState(errorElement, "default");
            }
            setFieldState(stateTarget, "default");
        });
    });

    resetButton?.addEventListener("click", () => {
        form.reset();
        feedback.classList.add("hidden");
        Object.keys(validationRules).forEach((fieldName) => {
            const stateTarget = getInputStateTarget(fieldName);
            const errorElement = document.getElementById(`error-${fieldName}`);
            if (errorElement) {
                errorElement.textContent = "";
                setErrorMessageState(errorElement, "default");
            }
            setFieldState(stateTarget, "default");
        });
    });
}

function setupLandingDemoForm() {
    const form = document.getElementById("landing-demo-form");
    const emailInput = document.getElementById("work-email");
    const teamSizeSelect = document.getElementById("team-size");
    const submitButton = document.getElementById("landing-submit");
    const feedback = document.getElementById("landing-form-feedback");
    const emailError = document.getElementById("landing-error-email");
    const sizeError = document.getElementById("landing-error-size");

    if (!form || !emailInput || !teamSizeSelect || !submitButton || !feedback || !emailError || !sizeError) {
        return;
    }

    const blockedDomains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "icloud.com", "live.com"];

    function resetStatus() {
        feedback.classList.add("hidden");
        feedback.textContent = "";
        feedback.classList.remove(
            "border-rose-400",
            "bg-rose-500/10",
            "text-rose-200",
            "border-emerald-400",
            "bg-emerald-500/10",
            "text-emerald-200"
        );
    }

    function showFieldError(el, errorEl, message) {
        if (message) {
            errorEl.textContent = message;
            errorEl.classList.remove("hidden");
            el.classList.add("border-rose-400", "bg-rose-500/5");
            el.setAttribute("aria-invalid", "true");
            return false;
        }

        errorEl.textContent = "";
        errorEl.classList.add("hidden");
        el.classList.remove("border-rose-400", "bg-rose-500/5");
        el.setAttribute("aria-invalid", "false");
        return true;
    }

    function validateEmail() {
        const value = emailInput.value.trim().toLowerCase();
        if (!value) return showFieldError(emailInput, emailError, "El email corporativo es obligatorio.");

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if (!emailRegex.test(value)) return showFieldError(emailInput, emailError, "Introduce un email valido.");

        const domain = value.split("@")[1] || "";
        if (blockedDomains.includes(domain)) {
            return showFieldError(emailInput, emailError, "Usa un email corporativo, no personal.");
        }

        return showFieldError(emailInput, emailError, "");
    }

    function validateTeamSize() {
        const value = teamSizeSelect.value.trim();
        if (!value) return showFieldError(teamSizeSelect, sizeError, "Selecciona el tamano de equipo.");
        return showFieldError(teamSizeSelect, sizeError, "");
    }

    function showFeedback(message, tone) {
        resetStatus();
        feedback.textContent = message;
        feedback.classList.remove("hidden");
        if (tone === "error") {
            feedback.classList.add("border-rose-400", "bg-rose-500/10", "text-rose-200");
        } else {
            feedback.classList.add("border-emerald-400", "bg-emerald-500/10", "text-emerald-200");
        }
    }

    emailInput.addEventListener("input", validateEmail);
    teamSizeSelect.addEventListener("change", validateTeamSize);

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        resetStatus();

        const emailOk = validateEmail();
        const sizeOk = validateTeamSize();

        if (!emailOk || !sizeOk) {
            showFeedback("Corrige los campos marcados antes de enviar la solicitud.", "error");
            return;
        }

        const defaultButtonText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.setAttribute("aria-busy", "true");
        submitButton.textContent = "Enviando solicitud...";

        window.setTimeout(() => {
            showFeedback("Solicitud enviada con exito. El equipo de Nexova te contactara en menos de 24 horas laborables.", "success");
            form.reset();
            emailError.classList.add("hidden");
            sizeError.classList.add("hidden");
            emailInput.classList.remove("border-rose-400", "bg-rose-500/5");
            teamSizeSelect.classList.remove("border-rose-400", "bg-rose-500/5");
            submitButton.disabled = false;
            submitButton.removeAttribute("aria-busy");
            submitButton.textContent = defaultButtonText;
        }, 900);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    setupMobileMenu();
    setupApplicationForm();
    setupLandingDemoForm();
});
