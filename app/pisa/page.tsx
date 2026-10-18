import { supabase } from "@/lib/supabase";
import FiltrosPisa from "./filtros";
import GraficaPisa from "./grafica";
import BotonDescargar from "./descargar";

export const revalidate = 3600;

const NOMBRES_PAISES: Record<string, string> = {
  AUS: "Australia", AUT: "Austria", BEL: "Bélgica", CAN: "Canadá", CHE: "Suiza",
  CHL: "Chile", COL: "Colombia", CRI: "Costa Rica", CZE: "Rep. Checa", DEU: "Alemania",
  DNK: "Dinamarca", ESP: "España", EST: "Estonia", FIN: "Finlandia", FRA: "Francia",
  GBR: "Reino Unido", GRC: "Grecia", HUN: "Hungría", IRL: "Irlanda", ISL: "Islandia",
  ISR: "Israel", ITA: "Italia", JPN: "Japón", KOR: "Corea del Sur", LTU: "Lituania",
  LUX: "Luxemburgo", LVA: "Letonia", MEX: "México", NLD: "Países Bajos", NOR: "Noruega",
  NZL: "Nueva Zelanda", POL: "Polonia", PRT: "Portugal", SVK: "Eslovaquia", SVN: "Eslovenia",
  SWE: "Suecia", TUR: "Turquía", USA: "Estados Unidos",
};

const ETIQUETAS_EJE: Record<string, string> = {
  general: "General", lectura: "Lectura", matematicas: "Matemáticas", ciencias: "Ciencias",
};

const CORTES_LIBRES = new Set(["boy", "private"]);

type Fila = {
  anio: number;
  valor: number;
  dimensiones: Record<string, string>;
  paises: { codigo_iso3: string } | null;
};

async function obtenerDatos(
  comboKey: string, anios: number[], paisesIso3: string[], eje: string
) {
  const { data, error } = await supabase
    .from("dataset_valores")
    .select("anio, valor, dimensiones, paises!inner(codigo_iso3)")
    .eq("cortes_activos", comboKey)
    .eq("dimensiones->>eje", eje)
    .in("anio", anios)
    .in("paises.codigo_iso3", paisesIso3);

  if (error) { console.error(error); return []; }
  return data as unknown as Fila[];
}

export default async function PisaPage({
  searchParams,
}: {
  searchParams: Promise<{
    anios?: string; paises?: string; eje?: string;
    corte1?: string; valores1?: string; corte2?: string; valores2?: string;
  }>;
}) {
  const params = await searchParams;
  const anios = params.anios ? params.anios.split(",").map(Number) : [2025];
  const paisesIso3 = params.paises ? params.paises.split(",") : ["MEX"];
  const eje = params.eje ?? "general";
  const corte1 = params.corte1 ?? "sin_cortes";
  const valores1 = params.valores1 ? params.valores1.split(",").filter(Boolean) : [];
  const corte2 = params.corte2 || "";
  const valores2 = params.valores2 ? params.valores2.split(",").filter(Boolean) : [];

  const sinPaises = paisesIso3.length === 0;
  const hayCorte = corte1 !== "sin_cortes";
  const corteEsPremium = hayCorte && (!CORTES_LIBRES.has(corte1) || (corte2 !== "" && !CORTES_LIBRES.has(corte2)));

  const comboKey = hayCorte ? (corte2 ? [corte1, corte2].sort().join(",") : corte1) : "";

  let series: { key: string; nombre: string }[] = [];
  let datosGrafica: Record<string, number | null>[] = [];

  if (!sinPaises && !corteEsPremium) {
    const filas = await obtenerDatos(comboKey, anios, paisesIso3, eje);

    // Filtrar por los valores seleccionados con los botones
    const filasFiltradas = filas.filter((f) => {
      const v1ok = !hayCorte || valores1.length === 0 || valores1.includes(f.dimensiones[corte1]);
      const v2ok = !corte2 || valores2.length === 0 || valores2.includes(f.dimensiones[corte2]);
      return v1ok && v2ok;
    });

    // Construir las series: país + valor(es) de corte
    const clavesSet = new Set<string>();
    for (const f of filasFiltradas) {
      const iso3 = f.paises?.codigo_iso3 ?? "?";
      const nombrePais = NOMBRES_PAISES[iso3] ?? iso3;
      let etiqueta = nombrePais;
      let clave = iso3;
      if (hayCorte) {
        const v1 = f.dimensiones[corte1];
        etiqueta += ` — ${v1}`;
        clave += `|${v1}`;
        if (corte2) {
          const v2 = f.dimensiones[corte2];
          etiqueta += ` / ${v2}`;
          clave += `|${v2}`;
        }
      }
      clavesSet.add(`${clave}::${etiqueta}`);
    }
    series = [...clavesSet].map((s) => {
      const [key, nombre] = s.split("::");
      return { key, nombre };
    });

    datosGrafica = [...anios].sort((a, b) => a - b).map((anio) => {
      const fila: Record<string, number | null> = { anio };
      for (const s of series) {
        const partes = s.key.split("|");
        const iso3 = partes[0];
        const encontrada = filasFiltradas.find((f) => {
          if (f.anio !== anio || f.paises?.codigo_iso3 !== iso3) return false;
          if (hayCorte && f.dimensiones[corte1] !== partes[1]) return false;
          if (corte2 && f.dimensiones[corte2] !== partes[2]) return false;
          return true;
        });
        fila[s.key] = encontrada ? encontrada.valor : null;
      }
      return fila;
    });
  }

  // Adaptar al formato que ya reciben GraficaPisa y BotonDescargar ({iso3, nombre})
  const seriesAdaptadas = series.map((s) => ({ iso3: s.key, nombre: s.nombre }));

  return (
    <main className="max-w-4xl mx-auto py-12 px-6">
      <h1 className="text-2xl font-semibold mb-2">PISA — {ETIQUETAS_EJE[eje] ?? eje}</h1>
      <p className="text-gray-500 mb-6">
        {hayCorte
          ? `Desagregado por ${corte1}${corte2 ? ` × ${corte2}` : ""}`
          : "Evolución del puntaje por país a través de los años seleccionados."}
      </p>

      <FiltrosPisa />

      {sinPaises ? (
        <p className="text-gray-400">Selecciona al menos un país.</p>
      ) : corteEsPremium ? (
        <div className="border border-amber-200 bg-amber-50 rounded-lg p-8 text-center">
          <p className="text-2xl mb-2">🔒</p>
          <p className="font-medium text-amber-900">Este corte requiere suscripción</p>
          <p className="text-sm text-amber-700 mt-1">
            Las desagregaciones detalladas son parte del contenido premium.
          </p>
        </div>
      ) : series.length === 0 ? (
        <p className="text-gray-400">No hay datos para esta combinación.</p>
      ) : (
        <>
          <GraficaPisa datos={datosGrafica} paises={seriesAdaptadas} />
          <div className="mt-4">
            <BotonDescargar datos={datosGrafica} paises={seriesAdaptadas} eje={eje} />
          </div>
        </>
      )}
    </main>
  );
}
