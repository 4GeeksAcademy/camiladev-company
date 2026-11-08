import type { ReactNode } from "react";

export default function CandidatesLayout({ children }: { children: ReactNode }) {
  return (
    <main id="main-content" className="mx-auto min-h-[calc(100vh-136px)] max-w-7xl px-4 pt-8 pb-12 sm:px-6 lg:px-8 lg:pt-10 lg:pb-16">
      {children}
    </main>
  );
}