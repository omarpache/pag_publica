"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const PAISES: [string, string][] = [
  ["AUS", "Australia"], ["AUT", "Austria"], ["BEL", "Bélgica"], ["CAN", "Canadá"],
  ["CHE", "Suiza"], ["CHL", "Chile"], ["COL", "Colombia"], ["CRI", "Costa Rica"],
  ["CZE", "Rep. Checa"], ["DEU", "Alemania"], ["DNK", "Dinamarca"], ["ESP", "España"],
  ["EST", "Estonia"], ["FIN", "Finlandia"], ["FRA", "Francia"], ["GBR", "Reino Unido"],
  ["GRC", "Grecia"], ["HUN", "Hungría"], ["IRL", "Irlanda"], ["ISL", "Islandia"],
  ["ISR", "Israel"], ["ITA", "Italia"], ["JPN", "Japón"], ["KOR", "Corea del Sur"],
  ["LTU", "Lituania"], ["LUX", "Luxemburgo"], ["LVA", "Letonia"], ["MEX", "México"],
  ["NLD", "Países Bajos"], ["NOR", "Noruega"], ["NZL", "Nueva Zelanda"], ["POL", "Polonia"],
  ["PRT", "Portugal"], ["SVK", "Eslovaquia"], ["SVN", "Eslovenia"], ["SWE", "Suecia"],
  ["TUR", "Turquía"], ["USA", "Estados Unidos"],
];

const EJES = [
  { valor: "general", etiqueta: "General" },
  { valor: "lectura", etiqueta: "Lectura" },
  { valor: "matematicas", etiqueta: "Matemáticas" },
  { valor: "ciencias", etiqueta: "Ciencias" },
];

const CORTES = [
  { valor: "sin_cortes", etiqueta: "Sin cortes" },
  { valor: "boy", etiqueta: "Género", libre: true },
  { valor: "private", etiqueta: "Escuela pública/privada", libre: true },
  { valor: "escs_q", etiqueta: "Nivel socioeconómico" },
  { valor: "immig", etiqueta: "Estatus migratorio" },
  { valor: "xescs_q", etiqueta: "Nivel socioeconómico ajustado" },
  { valor: "aiusesch_q", etiqueta: "Uso de IA en la escuela" },
  { valor: "d_hisced", etiqueta: "Educación de los padres" },
  { valor: "difflang", etiqueta: "Idioma distinto en casa" },
  { valor: "repeat", etiqueta: "Repetición de grado" },
  { valor: "iscedl", etiqueta: "Nivel educativo (ISCED)" },
  { valor: "schlocation", etiqueta: "Ubicación de la escuela" },
  { valor: "no_ai_use", etiqueta: "No uso de IA" },
];

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

async function traerValores(comboKey: string, eje: string, campo: string): Promise<string[]> {
  const { data, error } = await supabase
    .from("dataset_valores")
    .select("dimensiones")
    .eq("cortes_activos", comboKey)
    .eq("dimensiones->>eje", eje)
    .limit(2000);

  if (error || !data) return [];
  const valores = new Set<string>();
  for (const fila of data as { dimensiones: Record<string, string> }[]) {
    const v = fila.dimensiones[campo];
    if (v) valores.add(v);
  }
  return [...valores].sort();
}

async function traerAnios(): Promise<number[]> {
  const { data, error } = await supabase.from("anios_disponibles").select("anio");
  if (error || !data) return [];
  const anios = new Set<number>();
  for (const fila of data as { anio: number }[]) anios.add(fila.anio);
  return [...anios].sort((a, b) => a - b);
}

export default function FiltrosPisa() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [aniosDisponibles, setAniosDisponibles] = useState<number[]>([]);
  const [aniosSel, setAniosSel] = useState<number[]>(
    searchParams.get("anios")?.split(",").map(Number) ?? [2025]
  );
  const [paisesSel, setPaisesSel] = useState<string[]>(
    searchParams.get("paises")?.split(",") ?? ["MEX"]
  );
  const [eje, setEje] = useState(searchParams.get("eje") ?? "general");
  const [corte1, setCorte1] = useState(searchParams.get("corte1") ?? "sin_cortes");
  const [corte2, setCorte2] = useState(searchParams.get("corte2") ?? "");

  const [valoresDisponibles1, setValoresDisponibles1] = useState<string[]>([]);
  const [valoresSel1, setValoresSel1] = useState<string[]>(
    searchParams.get("valores1")?.split(",") ?? []
  );
  const [valoresDisponibles2, setValoresDisponibles2] = useState<string[]>([]);
  const [valoresSel2, setValoresSel2] = useState<string[]>(
    searchParams.get("valores2")?.split(",") ?? []
  );

  // Trae los años que realmente existen en la base de datos (en vez de una lista fija)
  useEffect(() => {
    traerAnios().then(setAniosDisponibles);
  }, []);

  useEffect(() => {
    if (corte1 === "sin_cortes") {
      setValoresDisponibles1([]);
      setValoresSel1([]);
      return;
    }
    traerValores(corte1, eje, corte1).then((vals) => {
      setValoresDisponibles1(vals);
      setValoresSel1(vals);
    });
  }, [corte1, eje]);

  useEffect(() => {
    if (!corte2 || corte1 === "sin_cortes") {
      setValoresDisponibles2([]);
      setValoresSel2([]);
      return;
    }
    const comboKey = [corte1, corte2].sort().join(",");
    traerValores(comboKey, eje, corte2).then((vals) => {
      setValoresDisponibles2(vals);
      setValoresSel2(vals);
    });
  }, [corte2, corte1, eje]);

  function toggleAnio(a: number) {
    setAniosSel((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));
  }
  function togglePais(iso3: string) {
    setPaisesSel((prev) => (prev.includes(iso3) ? prev.filter((x) => x !== iso3) : [...prev, iso3]));
  }
  function toggleValor1(v: string) {
    setValoresSel1((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]));
  }
  function toggleValor2(v: string) {
    setValoresSel2((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]));
  }

  function cambiarCorte1(nuevo: string) {
    setCorte1(nuevo);
    setCorte2("");
    if (nuevo === "sin_cortes") {
      setValoresSel1([]);
    }
  }

  function aplicar() {
    const params = new URLSearchParams();
    params.set("anios", [...aniosSel].sort((a, b) => a - b).join(","));
    params.set("paises", paisesSel.join(","));
    params.set("eje", eje);
    params.set("corte1", corte1);
    params.set("valores1", valoresSel1.join(","));
    params.set("corte2", corte2);
    params.set("valores2", valoresSel2.join(","));
    router.push(`/pisa?${params.toString()}`);
  }

  const opcionesCorte2 = CORTES.filter((c) => c.valor !== "sin_cortes" && c.valor !== corte1);

  return (
    <div className="mb-8 space-y-4">
      <div>
        <p className="text-sm text-gray-500 mb-2">Años</p>
        <div className="flex flex-wrap gap-2">
          {aniosDisponibles.map((a) => (
            <BotonToggle key={a} activo={aniosSel.includes(a)} onClick={() => toggleAnio(a)}>{a}</BotonToggle>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm text-gray-500 mb-2">Países</p>
        <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
          {PAISES.map(([iso3, nombre]) => (
            <BotonToggle key={iso3} activo={paisesSel.includes(iso3)} onClick={() => togglePais(iso3)}>{nombre}</BotonToggle>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-4">
        <div>
          <p className="text-sm text-gray-500 mb-2">Eje</p>
          <select value={eje} onChange={(e) => setEje(e.target.value)} className="border border-gray-300 rounded px-3 py-2">
            {EJES.map((e) => <option key={e.valor} value={e.valor}>{e.etiqueta}</option>)}
          </select>
        </div>

        <div>
          <p className="text-sm text-gray-500 mb-2">Corte 1</p>
          <select value={corte1} onChange={(e) => cambiarCorte1(e.target.value)} className="border border-gray-300 rounded px-3 py-2">
            {CORTES.map((c) => (
              <option key={c.valor} value={c.valor}>{c.etiqueta}{!c.libre && c.valor !== "sin_cortes" ? " 🔒" : ""}</option>
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
          <p className="text-sm text-gray-500 mb-2">
            Valores de {CORTES.find((c) => c.valor === corte1)?.etiqueta}
          </p>
          <div className="flex flex-wrap gap-2">
            {valoresDisponibles1.map((v) => (
              <BotonToggle key={v} activo={valoresSel1.includes(v)} onClick={() => toggleValor1(v)}>{v}</BotonToggle>
            ))}
          </div>
        </div>
      )}

      {corte2 && valoresDisponibles2.length > 0 && (
        <div>
          <p className="text-sm text-gray-500 mb-2">
            Valores de {CORTES.find((c) => c.valor === corte2)?.etiqueta}
          </p>
          <div className="flex flex-wrap gap-2">
            {valoresDisponibles2.map((v) => (
              <BotonToggle key={v} activo={valoresSel2.includes(v)} onClick={() => toggleValor2(v)}>{v}</BotonToggle>
            ))}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={aplicar}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Actualizar
      </button>
    </div>
  );
}
