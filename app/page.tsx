const DATASETS = [
  {
    coord: "PISA",
    nombre: "Prueba PISA",
    fuente: "OCDE",
    descripcion: "Puntajes de lectura, matemáticas y ciencias por país, 2015–2025.",
    estado: "Disponible",
    href: "/pisa",
    color: "#2F6F62",
  },
  {
    coord: "ECI",
    nombre: "Índice de Complejidad Económica",
    fuente: "Harvard Growth Lab",
    descripcion: "Complejidad exportadora por país y variante del índice.",
    estado: "Próximamente",
    href: "#",
    color: "#A4442F",
  },
  {
    coord: "NSE",
    nombre: "Niveles socioeconómicos AMAI",
    fuente: "AMAI · ENIGH (INEGI)",
    descripcion: "Niveles socioeconómicos de los hogares, calculados con los datos de la ENIGH.",
    estado: "Próximamente",
    href: "#",
    color: "#B8862E",
  },
];

export default function Home() {
  return (
    <div style={{ backgroundColor: "#EDE9DD", color: "#1B2233", minHeight: "100vh" }}>
      {/* Encabezado */}
      <header className="border-b border-[#1B2233]/15">
        <div className="max-w-3xl mx-auto px-6 py-5 flex flex-wrap items-center justify-between gap-y-2">
          <span className="font-serif text-lg tracking-tight">Datos Abiertos Intl.</span>
          <nav className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
            <a href="/pisa" className="hover:underline">Datos</a>
            <a href="/fuentes" className="hover:underline">Fuentes</a>
            <a href="/metodologia" className="hover:underline">Metodología</a>
            <a href="/contacto" className="hover:underline">Contacto</a>
          </nav>
        </div>
      </header>

      {/* Portada */}
      <section
        className="border-b border-[#1B2233]/15"
        style={{
          // Textura de mapa con una capa del color de fondo encima (deja ~12% visible)
          backgroundImage:
            "radial-gradient(circle at 15% 20%, rgba(184,134,46,0.10), transparent 40%), linear-gradient(rgba(237,233,221,0.88), rgba(237,233,221,0.88)), url('/textura-mapa.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="max-w-3xl mx-auto px-6 py-20">
          <p className="text-sm tracking-wide text-[#1B2233]/60 mb-4">
            Consulta pública de estadísticas internacionales
          </p>
          <h1 className="font-serif text-4xl md:text-5xl leading-tight mb-6 max-w-xl">
            Los datos oficiales del mundo, en un solo lugar.
          </h1>
          <p className="text-lg text-[#1B2233]/75 max-w-md mb-8">
            Resultados de PISA y más — comparados entre países y a través del tiempo,
            directo de la fuente.
          </p>
          <a
            href="/pisa"
            className="inline-block bg-[#1B2233] text-[#EDE9DD] px-6 py-3 rounded-sm hover:bg-[#2A3449] transition"
          >
            Explorar PISA
          </a>
        </div>
      </section>

      {/* Catálogo de datasets */}
      <section id="datasets" className="max-w-3xl mx-auto px-6 py-16">
        <h2 className="font-serif text-2xl mb-8">Datasets</h2>
        <div>
          {DATASETS.map((d) => (
            <a
              key={d.coord}
              href={d.href}
              className="flex items-baseline gap-6 py-6 border-t border-[#1B2233]/15 last:border-b hover:bg-[#1B2233]/[0.03] transition px-2 -mx-2"
            >
              <span className="font-serif text-sm w-16 shrink-0" style={{ color: d.color }}>
                {d.coord}
              </span>
              <div className="flex-1">
                <div className="flex flex-wrap items-baseline gap-x-3">
                  <h3 className="font-medium">{d.nombre}</h3>
                  <span className="text-xs text-[#1B2233]/50">{d.fuente}</span>
                </div>
                <p className="text-sm text-[#1B2233]/65 mt-1">{d.descripcion}</p>
              </div>
              <span
                className="text-xs shrink-0"
                style={{
                  color: d.estado === "Disponible" ? "#2F6F62" : "#1B2233",
                  opacity: d.estado === "Disponible" ? 1 : 0.5,
                }}
              >
                {d.estado}
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* Pie */}
      <footer className="border-t border-[#1B2233]/15">
        <div className="max-w-3xl mx-auto px-6 py-10 text-sm text-[#1B2233]/60 space-y-2">
          <p>
            Los datos de PISA provienen de la OCDE. Los cálculos y agregaciones fueron
            elaborados de forma independiente a partir de los microdatos públicos, con los
            estándares metodológicos de la OCDE. Este sitio no está afiliado ni respaldado
            por la OCDE.
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
            ·{" "}
            <a href="mailto:contacto@solutions-bd.com" className="underline hover:text-[#1B2233]">
              contacto@solutions-bd.com
            </a>
          </p>
          <p>© {new Date().getFullYear()} Datos Abiertos Intl.</p>
        </div>
      </footer>
    </div>
  );
}
