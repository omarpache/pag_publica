"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ConfigDataset, ordenarValores } from "@/lib/datasets";
import BotonDescargar from "./BotonDescargar";

type Props = {
  config: ConfigDataset;
  datosDescarga: Record<string, number | null>[];
  seriesDescarga: { iso3: string; nombre: string }[];
  ejeAplicado: string;
};

function BotonToggle({ activo, onClick, children }: { activo: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-sm border transition ${
        activo ? "bg-black text-white border-black" : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
      }`}
    >
      {children}
    </button>
  );
}

// Trae todas las páginas (Supabase devuelve máximo 1000 filas por consulta)
async function traerValores(
  cfg: ConfigDataset, comboKey: string, eje: string, campo: string
): Promise<string[]> {
  const valores = new Set<string>();
  const paso = 1000;
  for (let desde = 0; ; desde += paso) {
    const { data, error } = await supabase
      .from("dataset_valores")
      .select("dimensiones, datasets!inner(nombre)")
      .eq("datasets.nombre", cfg.nombreDb)
      .eq("cortes_activos", comboKey)
      .eq("dimensiones->>eje", eje)
      .order("id")
      .range(desde, desde + paso - 1);

    if (error || !data) break;
    for (const fila of data as unknown as { dimensiones: Record<string, string> }[]) {
      const v = fila.dimensiones[campo];
      if (v) valores.add(v);
    }
    if (data.length < paso) break;
  }
  return ordenarValores(cfg, campo, [...valores]);
}

async function traerAnios(cfg: ConfigDataset): Promise<number[]> {
  const { data, error } = await supabase
    .from("anios_disponibles")
    .select("anio")
    .eq("dataset", cfg.nombreDb);
  if (error || !data) return [];
  const anios = new Set<number>();
  for (const fila of data as { anio: number }[]) anios.add(fila.anio);
  return [...anios].sort((a, b) => a - b);
}

export default function FiltrosDataset({ config, datosDescarga, seriesDescarga, ejeAplicado }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [aniosDisponibles, setAniosDisponibles] = useState<number[]>([]);
  const [aniosSel, setAniosSel] = useState<number[]>(
    searchParams.get("anios")?.split(",").map(Number) ?? config.aniosDefault
  );
  const [paisesSel, setPaisesSel] = useState<string[]>(
    searchParams.get("paises")?.split(",") ?? config.paisesDefault
  );
  const ejesTodos = config.ejes.map((e) => e.valor);
  const [ejesSel, setEjesSel] = useState<string[]>(
    searchParams.get("eje")?.split(",").filter(Boolean) ??
      (config.ejeMultiple ? ejesTodos : [config.ejeDefault])
  );
  // Para cargar los valores de los cortes basta un eje
  const eje = ejesSel[0] ?? config.ejeDefault;
  const [corte1, setCorte1] = useState(searchParams.get("corte1") ?? "sin_cortes");
  const [corte2, setCorte2] = useState(searchParams.get("corte2") ?? "");

  const [valoresDisponibles1, setValoresDisponibles1] = useState<string[]>([]);
  const [valoresSel1, setValoresSel1] = useState<string[]>(
    searchParams.get("valores1")?.split("|").filter(Boolean) ?? []
  );
  const [valoresDisponibles2, setValoresDisponibles2] = useState<string[]>([]);
  const [valoresSel2, setValoresSel2] = useState<string[]>(
    searchParams.get("valores2")?.split("|").filter(Boolean) ?? []
  );

  const etiquetaCorte = (v: string) => config.cortes.find((c) => c.valor === v)?.etiqueta ?? v;

  useEffect(() => {
    traerAnios(config).then(setAniosDisponibles);
  }, [config]);

  useEffect(() => {
    if (corte1 === "sin_cortes") {
      setValoresDisponibles1([]);
      setValoresSel1([]);
      return;
    }
    traerValores(config, corte1, eje, corte1).then((vals) => {
      setValoresDisponibles1(vals);
      setValoresSel1(vals);
    });
  }, [corte1, eje, config]);

  useEffect(() => {
    if (!corte2 || corte1 === "sin_cortes") {
      setValoresDisponibles2([]);
      setValoresSel2([]);
      return;
    }
    const comboKey = [corte1, corte2].sort().join(",");
    traerValores(config, comboKey, eje, corte2).then((vals) => {
      setValoresDisponibles2(vals);
      setValoresSel2(vals);
    });
  }, [corte2, corte1, eje, config]);

  const alternar = (lista: string[], v: string) =>
    lista.includes(v) ? lista.filter((x) => x !== v) : [...lista, v];

  function cambiarCorte1(nuevo: string) {
    setCorte1(nuevo);
    setCorte2("");
    if (nuevo === "sin_cortes") setValoresSel1([]);
  }

  function aplicar() {
    const params = new URLSearchParams();
    params.set("anios", [...aniosSel].sort((a, b) => a - b).join(","));
    params.set("paises", paisesSel.join(","));
    params.set("eje", ejesSel.join(","));
    params.set("corte1", corte1);
    params.set("valores1", valoresSel1.join("|"));
    params.set("corte2", corte2);
    params.set("valores2", valoresSel2.join("|"));
    router.push(`/${config.slug}?${params.toString()}`);
  }

  const opcionesCorte2 = config.cortes.filter((c) => c.valor !== corte1);
  const mostrarPaises = config.paises.length > 1;

  return (
    <div className="mb-8 space-y-4">
      <div>
        <p className="text-sm text-gray-500 mb-2">Años</p>
        <div className="flex flex-wrap gap-2">
          {aniosDisponibles.map((a) => (
            <BotonToggle key={a} activo={aniosSel.includes(a)} onClick={() => setAniosSel((p) => (p.includes(a) ? p.filter((x) => x !== a) : [...p, a]))}>{a}</BotonToggle>
          ))}
        </div>
      </div>

      {mostrarPaises && (
        <div>
          <p className="text-sm text-gray-500 mb-2">Países</p>
          <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
            {config.paises.map(([iso3, nombre]) => (
              <BotonToggle key={iso3} activo={paisesSel.includes(iso3)} onClick={() => setPaisesSel((p) => alternar(p, iso3))}>{nombre}</BotonToggle>
            ))}
          </div>
        </div>
      )}

      {config.ejeMultiple && (
        <div>
          <p className="text-sm text-gray-500 mb-2">{config.etiquetaEje}</p>
          <div className="flex flex-wrap gap-2">
            {config.ejes.map((e) => (
              <BotonToggle key={e.valor} activo={ejesSel.includes(e.valor)} onClick={() => setEjesSel((p) => alternar(p, e.valor))}>{e.etiqueta}</BotonToggle>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-end gap-4">
        {!config.ejeMultiple && (
          <div>
            <p className="text-sm text-gray-500 mb-2">{config.etiquetaEje}</p>
            <select value={eje} onChange={(e) => setEjesSel([e.target.value])} className="border border-gray-300 rounded px-3 py-2">
              {config.ejes.map((e) => <option key={e.valor} value={e.valor}>{e.etiqueta}</option>)}
            </select>
          </div>
        )}

        <div>
          <p className="text-sm text-gray-500 mb-2">Corte 1</p>
          <select value={corte1} onChange={(e) => cambiarCorte1(e.target.value)} className="border border-gray-300 rounded px-3 py-2">
            <option value="sin_cortes">Sin cortes</option>
            {config.cortes.map((c) => (
              <option key={c.valor} value={c.valor}>{c.etiqueta}{!c.libre ? " 🔒" : ""}</option>
            ))}
          </select>
        </div>

        {corte1 !== "sin_cortes" && (
          <div>
            <p className="text-sm text-gray-500 mb-2">Corte 2 (opcional)</p>
            <select value={corte2} onChange={(e) => setCorte2(e.target.value)} className="border border-gray-300 rounded px-3 py-2">
              <option value="">Ninguno</option>
              {opcionesCorte2.map((c) => (
                <option key={c.valor} value={c.valor}>{c.etiqueta}{!c.libre ? " 🔒" : ""}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {corte1 !== "sin_cortes" && valoresDisponibles1.length > 0 && (
        <div>
          <p className="text-sm text-gray-500 mb-2">Valores de {etiquetaCorte(corte1)}</p>
          <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
            {valoresDisponibles1.map((v) => (
              <BotonToggle key={v} activo={valoresSel1.includes(v)} onClick={() => setValoresSel1((p) => alternar(p, v))}>{v}</BotonToggle>
            ))}
          </div>
        </div>
      )}

      {corte2 && valoresDisponibles2.length > 0 && (
        <div>
          <p className="text-sm text-gray-500 mb-2">Valores de {etiquetaCorte(corte2)}</p>
          <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
            {valoresDisponibles2.map((v) => (
              <BotonToggle key={v} activo={valoresSel2.includes(v)} onClick={() => setValoresSel2((p) => alternar(p, v))}>{v}</BotonToggle>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={aplicar}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Actualizar
        </button>
        <BotonDescargar
          datos={datosDescarga}
          series={seriesDescarga}
          eje={ejeAplicado}
          datasetNombre={config.nombreDb}
          prefijoArchivo={config.prefijoArchivo}
        />
      </div>
    </div>
  );
}
