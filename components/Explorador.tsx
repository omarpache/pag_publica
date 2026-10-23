import type { ReactNode } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { ConfigDataset } from "@/lib/datasets";
import FiltrosDataset from "./FiltrosDataset";
import GraficaLineas from "./GraficaLineas";

export type ParamsExplorador = {
  anios?: string; paises?: string; eje?: string;
  corte1?: string; valores1?: string; corte2?: string; valores2?: string;
};

type Fila = {
  anio: number;
  valor: number;
  dimensiones: Record<string, string>;
  paises: { codigo_iso3: string } | null;
};

// Trae todas las páginas (Supabase devuelve máximo 1000 filas por consulta)
async function obtenerDatos(
  cfg: ConfigDataset, comboKey: string, anios: number[], paisesIso3: string[], ejes: string[]
) {
  const todas: Fila[] = [];
  const paso = 1000;
  for (let desde = 0; ; desde += paso) {
    const { data, error } = await supabase
      .from("dataset_valores")
      .select("anio, valor, dimensiones, paises!inner(codigo_iso3), datasets!inner(nombre)")
      .eq("datasets.nombre", cfg.nombreDb)
      .eq("cortes_activos", comboKey)
      .in("dimensiones->>eje", ejes)
      .in("anio", anios)
      .in("paises.codigo_iso3", paisesIso3)
      .order("id")
      .range(desde, desde + paso - 1);

    if (error) { console.error(error); break; }
    todas.push(...(data as unknown as Fila[]));
    if (!data || data.length < paso) break;
  }
  return todas;
}

export default async function Explorador({
  config,
  searchParams,
  children,
}: {
  config: ConfigDataset;
  searchParams: ParamsExplorador;
  children?: ReactNode; // aquí va la Fuente y Metodología de este dataset
}) {
  const params = searchParams;
  const todosEjes = config.ejes.map((e) => e.valor);
  const anios = params.anios ? params.anios.split(",").map(Number) : config.aniosDefault;
  const paisesIso3 = params.paises ? params.paises.split(",") : config.paisesDefault;
  const ejesPedidos = params.eje ? params.eje.split(",").filter(Boolean) : [];
  const ejes = ejesPedidos.length > 0
    ? ejesPedidos
    : config.ejeMultiple ? todosEjes : [config.ejeDefault];
  const corte1 = params.corte1 ?? "sin_cortes";
  // Los valores van separados por "|" porque algunos contienen comas
  const valores1 = params.valores1 ? params.valores1.split("|").filter(Boolean) : [];
  const corte2 = params.corte2 || "";
  const valores2 = params.valores2 ? params.valores2.split("|").filter(Boolean) : [];

  const nombresPaises = Object.fromEntries(config.paises);
  const libres = new Set(config.cortes.filter((c) => c.libre).map((c) => c.valor));
  const etiquetaCorteDe = (v: string) => config.cortes.find((c) => c.valor === v)?.etiqueta ?? v;

  const sinPaises = paisesIso3.length === 0;
  const sinEjes = ejes.length === 0;
  const hayCorte = corte1 !== "sin_cortes";
  const corteEsPremium = hayCorte && (!libres.has(corte1) || (corte2 !== "" && !libres.has(corte2)));
  const comboKey = hayCorte ? (corte2 ? [corte1, corte2].sort().join(",") : corte1) : "";

  let series: { key: string; nombre: string }[] = [];
  let datosGrafica: Record<string, number | null>[] = [];

  if (!sinPaises && !corteEsPremium) {
    const filas = await obtenerDatos(config, comboKey, anios, paisesIso3, ejes);

    const filasFiltradas = filas.filter((f) => {
      const v1ok = !hayCorte || valores1.length === 0 || valores1.includes(f.dimensiones[corte1]);
      const v2ok = !corte2 || valores2.length === 0 || valores2.includes(f.dimensiones[corte2]);
      return v1ok && v2ok;
    });

    type Combo = { iso3: string; e: string; v1?: string; v2?: string };
    const SEP = "\u001f";
    const combos = new Map<string, Combo>();
    for (const f of filasFiltradas) {
      const c: Combo = {
        iso3: f.paises?.codigo_iso3 ?? "?",
        e: f.dimensiones.eje,
        v1: hayCorte ? f.dimensiones[corte1] : undefined,
        v2: corte2 ? f.dimensiones[corte2] : undefined,
      };
      combos.set([c.iso3, c.e, c.v1, c.v2].join(SEP), c);
    }

    // Orden: país, eje, y luego el orden natural de los valores de cada corte
    const ordenPais = config.paises.map(([iso]) => iso);
    const rango = (lista: string[] | undefined, v?: string): number => {
      const i = v === undefined || !lista ? -1 : lista.indexOf(v);
      return i === -1 ? 999 : i;
    };
    const o1 = config.ordenValores?.[corte1];
    const o2 = config.ordenValores?.[corte2];
    const ordenados = [...combos.values()].sort((a, b) =>
      ordenPais.indexOf(a.iso3) - ordenPais.indexOf(b.iso3) ||
      todosEjes.indexOf(a.e) - todosEjes.indexOf(b.e) ||
      rango(o1, a.v1) - rango(o1, b.v1) ||
      (a.v1 ?? "").localeCompare(b.v1 ?? "", "es") ||
      rango(o2, a.v2) - rango(o2, b.v2) ||
      (a.v2 ?? "").localeCompare(b.v2 ?? "", "es"));

    // Cada serie tiene un id simple (s0, s1...) para que la gráfica no tropiece
    // con puntos, comas o diagonales dentro de los nombres
    const idDe = new Map<string, string>();
    series = ordenados.map((c, i) => {
      const id = `s${i}`;
      idDe.set([c.iso3, c.e, c.v1, c.v2].join(SEP), id);
      const partes = [nombresPaises[c.iso3] ?? c.iso3];
      if (config.ejeMultiple) partes.push(c.e);
      let nombre = partes.join(" — ");
      if (c.v1 !== undefined) nombre += ` — ${c.v1}`;
      if (c.v2 !== undefined) nombre += ` / ${c.v2}`;
      return { key: id, nombre };
    });

    const porClave = new Map<string, number>();
    for (const f of filasFiltradas) {
      const id = idDe.get([
        f.paises?.codigo_iso3 ?? "?", f.dimensiones.eje,
        hayCorte ? f.dimensiones[corte1] : undefined,
        corte2 ? f.dimensiones[corte2] : undefined,
      ].join(SEP));
      if (id) porClave.set(`${f.anio}${SEP}${id}`, f.valor);
    }

    datosGrafica = [...anios].sort((a, b) => a - b).map((anio) => {
      const fila: Record<string, number | null> = { anio };
      for (const s of series) fila[s.key] = porClave.get(`${anio}${SEP}${s.key}`) ?? null;
      return fila;
    });
  }

  const seriesAdaptadas = series.map((s) => ({ iso3: s.key, nombre: s.nombre }));

  const etiquetaDe = (e: string) => config.ejes.find((x) => x.valor === e)?.etiqueta ?? e;
  const textoEje = config.ejeMultiple
    ? ejes.length === todosEjes.length
      ? config.textoTodosEjes ?? "todos"
      : (config.prefijoEjeTitulo ?? "") + todosEjes.filter((e) => ejes.includes(e)).map(etiquetaDe).join(", ")
    : etiquetaDe(ejes[0] ?? config.ejeDefault);
  const etiquetaCortes = hayCorte
    ? `${etiquetaCorteDe(corte1)}${corte2 ? ` y ${etiquetaCorteDe(corte2)}` : ""}`
    : "";
  const tituloGrafica =
    config.plantillaTitulo.replace("{eje}", textoEje) + (hayCorte ? `, por ${etiquetaCortes}` : "");

  return (
    <main className="max-w-4xl mx-auto py-12 px-6">
      <Link href="/" className="inline-block text-sm text-gray-500 hover:text-gray-800 hover:underline mb-6">
        ← Volver al inicio
      </Link>
      <h1 className="text-2xl font-semibold mb-2">{config.nombre}</h1>
      <p className="text-gray-500 mb-6">
        {hayCorte ? `Desagregado por ${etiquetaCortes}.` : config.descripcionSinCortes}
      </p>

      <FiltrosDataset
        config={config}
        datosDescarga={datosGrafica}
        seriesDescarga={seriesAdaptadas}
        ejeAplicado={ejes.join("_")}
      />

      {sinPaises ? (
        <p className="text-gray-400">Selecciona al menos un país.</p>
      ) : sinEjes ? (
        <p className="text-gray-400">Selecciona al menos un nivel.</p>
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
        <GraficaLineas
          datos={datosGrafica}
          paises={seriesAdaptadas}
          titulo={tituloGrafica}
          etiquetaY={config.etiquetaY}
        />
      )}

      {children}
    </main>
  );
}
