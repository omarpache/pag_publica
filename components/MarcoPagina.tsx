import Link from "next/link";
import type { ReactNode } from "react";

export default function MarcoPagina({
  titulo,
  children,
}: {
  titulo: string;
  children: ReactNode;
}) {
  return (
    <div style={{ backgroundColor: "#EDE9DD", color: "#1B2233", minHeight: "100vh" }}>
      <header className="border-b border-[#1B2233]/15">
        <div className="max-w-3xl mx-auto px-6 py-5 flex flex-wrap items-center justify-between gap-y-2">
          <Link href="/" className="font-serif text-lg tracking-tight">
            Datos Abiertos Intl.
          </Link>
          <nav className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
            <Link href="/contacto" className="hover:underline">Contacto</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-14">
        <h1 className="font-serif text-3xl md:text-4xl mb-8">{titulo}</h1>
        <div className="space-y-5 leading-relaxed text-[#1B2233]/85">{children}</div>
      </main>

      <footer className="border-t border-[#1B2233]/15">
        <div className="max-w-3xl mx-auto px-6 py-8 text-sm text-[#1B2233]/60 space-y-2">
          <p>
            Los datos publicados en este sitio provienen de organismos y fuentes oficiales.
            La fuente y la metodología de cada conjunto de datos se indican en su propia
            página. Los cálculos y la presentación son independientes; este sitio no está
            afiliado ni respaldado por las instituciones citadas.
          </p>
          <p>
            <a
              href="https://www.solutions-bd.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-[#1B2233]"
            >
              Solutions for Business Data
            </a>{" "}
            · <a href="mailto:contacto@solutions-bd.com" className="underline hover:text-[#1B2233]">contacto@solutions-bd.com</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
