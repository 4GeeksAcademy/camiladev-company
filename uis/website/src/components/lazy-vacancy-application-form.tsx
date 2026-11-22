"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const VacancyApplicationForm = dynamic(
  () => import("./vacancy-application-form"),
  {
    ssr: false,
    loading: () => (
      <p role="status" className="mt-6 text-sm text-slate-300">
        Cargando formulario de postulación…
      </p>
    ),
  },
);

export default function LazyVacancyApplicationForm() {
  const formContainer = useRef<HTMLDivElement>(null);
  const [requested, setRequested] = useState(false);

  useEffect(() => {
    const container = formContainer.current;
    const modal = container?.closest<HTMLElement>("[popover]");
    if (!modal) return;

    const loadFormWhenOpened = () => {
      if (modal.matches(":popover-open")) setRequested(true);
    };

    modal.addEventListener("toggle", loadFormWhenOpened);
    loadFormWhenOpened();
    return () => modal.removeEventListener("toggle", loadFormWhenOpened);
  }, []);

  return <div ref={formContainer}>{requested ? <VacancyApplicationForm /> : null}</div>;
}