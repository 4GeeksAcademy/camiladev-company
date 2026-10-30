import { Suspense } from "react";
import { CandidateList } from "@/componentes/candidate-list";
import { Loading } from "@/componentes/feedback";

export default function Home() {
  return <Suspense fallback={<Loading />}><CandidateList /></Suspense>;
}
