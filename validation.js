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
        linkedinUrl: document.getElementById("linkedinUrl"),
        applicationType: document.getElementById("applicationType"),
        currentCompany: document.getElementById("currentCompany"),
        currentRole: document.getElementById("currentRole"),
        experienceYears: document.getElementById("experienceYears"),
        professionalArea: document.getElementById("professionalArea"),
        englishLevel: document.getElementById("englishLevel"),
        workMode: form.querySelectorAll("input[name='workMode']"),
        message: document.getElementById("message"),
        cvFile: document.getElementById("cvFile"),
        salaryRange: document.getElementById("salaryRange"),
        availability: document.getElementById("availability"),
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
            if (!value.trim()) return "El email profesional es obligatorio.";
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
            if (!emailRegex.test(value)) return "Introduce un email corporativo valido.";
            const domain = value.split("@")[1]?.toLowerCase();
            if (corporateEmailProviders.includes(domain)) {
                return "Introduce un email corporativo valido, no personal.";
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
        linkedinUrl: (value) => {
            if (!value.trim()) return "La URL de LinkedIn es obligatoria.";
            if (!value.startsWith("https://")) return "La URL de LinkedIn debe comenzar con https://.";
            const linkedinRegex = /^https:\/\/(www\.)?linkedin\.com\/.+/i;
            if (!linkedinRegex.test(value)) return "Introduce una URL valida de LinkedIn (linkedin.com).";
            return "";
        },
        applicationType: (value) => (!value ? "Selecciona el tipo de solicitud para continuar." : ""),
        currentCompany: (value) => (!value.trim() ? "La empresa actual es obligatoria." : ""),
        currentRole: (value) => (!value.trim() ? "El cargo actual es obligatorio." : ""),
        experienceYears: (value) => {
            if (value === "") return "Indica tus anos de experiencia.";
            const number = Number(value);
            if (Number.isNaN(number) || number < 0 || number > 45) return "Los anos de experiencia deben estar entre 0 y 45.";
            return "";
        },
        professionalArea: (value) => (!value ? "Selecciona un area profesional." : ""),
        englishLevel: (value) => (!value ? "Selecciona tu nivel de ingles." : ""),
        workMode: () => {
            const checked = Array.from(fields.workMode).some((radio) => radio.checked);
            return checked ? "" : "Selecciona la modalidad preferida: remoto, hibrido o presencial.";
        },
        message: (value) => {
            if (!value.trim()) return "Describe tu perfil o necesidad del proyecto.";
            if (value.trim().length < 30) return "Amplia el mensaje con al menos 30 caracteres.";
            return "";
        },
        cvFile: () => {
            const selectedType = fields.applicationType.value;
            const file = fields.cvFile.files[0];
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
        salaryRange: (value) => {
            if (value === "") return "Indica tu rango salarial esperado.";
            const number = Number(value);
            if (Number.isNaN(number) || number < 12000 || number > 500000) {
                return "El rango salarial debe estar entre 12.000 y 500.000 EUR anuales.";
            }
            return "";
        },
        availability: (value) => (!value ? "Selecciona tu disponibilidad de incorporacion." : ""),
        companySize: (value) => (!value ? "Selecciona el tamano de empresa." : ""),
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

    fields.applicationType.addEventListener("change", () => {
        validateField("applicationType");
        validateField("cvFile");
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const isValid = validateAll();
        if (!isValid) {
            showFeedback("Revisa los campos marcados y corrige los errores antes de enviar.", "error");
            return;
        }

        showFeedback("Solicitud enviada con exito. El equipo de Nexova Solutions te contactara en un plazo maximo de 24 horas laborables.", "success");
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

document.addEventListener("DOMContentLoaded", () => {
    setupMobileMenu();
    setupApplicationForm();
});
