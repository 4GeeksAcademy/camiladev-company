import type {
  Metadata
} from "next";


import Link from "next/link";

import { Manrope, Sora } from "next/font/google";

import "./tailwind.css";

const manrope = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
});

const sora = Sora({
  variable: "--font-heading",
  subsets: ["latin"],
});


export const metadata: Metadata = {

  title:
    "Nexova Backoffice",

  description:
    (
      "Panel interno "
      + "de Nexova"
    ),

};


export default function RootLayout({

  children,

}: Readonly<{

  children:
    React.ReactNode;

}>) {

  return (

    <html lang="es" className={`${manrope.variable} ${sora.variable} h-full antialiased`}>

      <body>

        <nav className="navbar">

          <div className="navContent">

            <Link
              href="/"
              className="logo"
            >
              NEXOVA
            </Link>


            <div className="navLinks">

              <Link href="/">
                Inicio
              </Link>

              <Link href="/incidents">
                Incidencias
              </Link>

            </div>

          </div>

        </nav>


        {children}

      </body>

    </html>

  );

}