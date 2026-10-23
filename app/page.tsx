// Para llenar una base nueva: cambia coord, nombre y descripcion.
// Cuando esté lista: estado = "Disponible" y href = "/ruta-de-su-pagina".
const DATASETS = [
  {
    coord: "PISA",
    nombre: "Prueba PISA",
    descripcion: "Puntajes de lectura, matemáticas y ciencias por país, 2015–2025.",
    estado: "Disponible",
    href: "/pisa",
    color: "#2F6F62",
  },
  {
    coord: "ECI",
    nombre: "Índice de Complejidad Económica",
    descripcion: "Complejidad exportadora por país y variante del índice.",
    estado: "Próximamente",
    href: "#",
    color: "#A4442F",
  },
  {
    coord: "NSE",
    nombre: "Niveles socioeconómicos AMAI",
    descripcion: "Distribución de los hogares de México por nivel socioeconómico, 2016–2024.",
    estado: "Disponible",
    href: "/nse",
    color: "#B8862E",
  },
  {
    coord: "ENIGH",
    nombre: "Ingreso por deciles de hogares",
    descripcion: "Ingreso corriente promedio de los hogares de México por decil, 2016–2024.",
    estado: "Disponible",
    href: "/deciles",
    color: "#2B4C5C",
  },
  {
    coord: "BD05",
    nombre: "Consectetur adipiscing elit",
    descripcion: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.",
    estado: "Próximamente",
    href: "#",
    color: "#5B3A6E",
  },
  {
    coord: "BD06",
    nombre: "Sed do eiusmod tempor",
    descripcion: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.",
    estado: "Próximamente",
    href: "#",
    color: "#4A6B1F",
  },
  {
    coord: "BD07",
    nombre: "Incididunt ut labore et dolore",
    descripcion: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.",
    estado: "Próximamente",
    href: "#",
    color: "#8E3B5E",
  },
  {
    coord: "BD08",
    nombre: "Magna aliqua ut enim",
    descripcion: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.",
    estado: "Próximamente",
    href: "#",
    color: "#2F6F62",
  },
  {
    coord: "BD09",
    nombre: "Quis nostrud exercitation",
    descripcion: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.",
    estado: "Próximamente",
    href: "#",
    color: "#A4442F",
  },
  {
    coord: "BD10",
    nombre: "Ullamco laboris nisi",
    descripcion: "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet consectetur.",
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
            <a href="/contacto" className="hover:underline">Contacto</a>
          </nav>
        </div>
      </header>

      {/* Portada */}
      <section
        className="border-b border-[#1B2233]/15"
        style={{
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
            Estadísticas de distintas fuentes oficiales, consultables por país o región
            y a través del tiempo, directo de la fuente.
          </p>
          <a
            href="#datasets"
            className="inline-block bg-[#1B2233] text-[#EDE9DD] px-6 py-3 rounded-sm hover:bg-[#2A3449] transition"
          >
            Ver los datasets
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
                <h3 className="font-medium">{d.nombre}</h3>
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
