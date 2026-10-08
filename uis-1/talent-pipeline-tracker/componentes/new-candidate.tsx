"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { CandidateForm } from "./candidate-form";

export function NewCandidate() {
  const router = useRouter();
  return <>
    <Link className="back-link" href="/">Volver a candidaturas</Link>
    <div className="page-heading"><div><p className="eyebrow">People · Nexova</p><h1>Nueva candidatura</h1></div></div>
    <CandidateForm onCancel={() => router.push("/")} onSaved={(candidate) => router.push(`/candidates/${encodeURIComponent(candidate.id)}?created=1`)} />
  </>;
}