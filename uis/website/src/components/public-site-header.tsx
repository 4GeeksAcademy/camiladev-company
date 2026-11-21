import Link from "next/link";

type LinkVariant = "default" | "primary" | "outline";

type NavigationLink = {
  href: string;
  label: string;
  desktopVariant?: LinkVariant;
  mobileVariant?: LinkVariant;
};

type PublicSiteHeaderProps = {
  brandHref: string;
  desktopLinks: NavigationLink[];
  mobileLinks: NavigationLink[];
};

const desktopLinkClasses: Record<LinkVariant, string> = {
  default: "transition hover:text-cyan-300",
  primary: "rounded-full bg-cyan-300 px-5 py-2.5 font-bold text-slate-950 transition hover:bg-cyan-200",
  outline: "rounded-full border border-cyan-300 px-4 py-2 text-cyan-300 transition hover:bg-cyan-300 hover:text-slate-950",
};

const mobileLinkClasses: Record<LinkVariant, string> = {
  default: "block rounded-lg px-3 py-2 text-slate-200 hover:bg-slate-800",
  primary: "block rounded-full bg-cyan-300 px-4 py-2 text-center font-bold text-slate-950",
  outline: "block rounded-lg px-3 py-2 text-slate-200 hover:bg-slate-800",
};

export function PublicSiteHeader({
  brandHref,
  desktopLinks,
  mobileLinks,
}: PublicSiteHeaderProps) {
  const renderLink = (href: string, label: string, className: string) =>
    href.startsWith("/") ? (
      <Link href={href} className={className}>
        {label}
      </Link>
    ) : (
      <a href={href} className={className}>
        {label}
      </a>
    );

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-cyan-300 focus:px-4 focus:py-2 focus:text-slate-950"
      >
        Saltar al contenido principal
      </a>
      <header className="sticky top-0 z-40 border-b border-slate-800/70 bg-slate-950/90 backdrop-blur">
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8"
          aria-label="Navegación principal"
        >
          <Link
            href={brandHref}
            className="text-xl font-bold tracking-tight text-white [font-family:'Sora',ui-sans-serif,system-ui,sans-serif]"
          >
            Nexova Solutions
          </Link>
          <ul className="hidden items-center gap-7 text-sm font-semibold lg:flex">
            {desktopLinks.map(({ href, label, desktopVariant = "default" }) => (
              <li key={`${href}-${label}`}>
                {renderLink(href, label, desktopLinkClasses[desktopVariant])}
              </li>
            ))}
          </ul>
          <details className="relative lg:hidden">
            <summary
              className="inline-flex cursor-pointer list-none items-center rounded-lg border border-slate-700 px-3 py-2 text-slate-200 hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
              aria-label="Abrir menú principal"
            >
              <span className="sr-only">Abrir menú principal</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </summary>
            <div className="absolute right-0 top-14 z-50 w-72 rounded-xl border border-slate-800 bg-slate-900 p-3 shadow-2xl shadow-slate-950/70">
              <ul className="space-y-2 text-sm font-semibold">
                {mobileLinks.map(({ href, label, mobileVariant = "default" }) => (
                  <li key={`${href}-${label}`}>
                    {renderLink(href, label, mobileLinkClasses[mobileVariant])}
                  </li>
                ))}
              </ul>
            </div>
          </details>
        </nav>
      </header>
    </>
  );
}
