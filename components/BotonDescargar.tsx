"use client";

import { supabase } from "@/lib/supabase";

type Props = {
  datos: Record<string, number | null>[];
  series: { iso3: string; nombre: string }[];
  eje: string;
  datasetNombre: string; // nombre en la tabla descargas, ej. "PISA"
  prefijoArchivo: string; // ej. "pisa"
};

export default function BotonDescargar({ datos, series, eje, datasetNombre, prefijoArchivo }: Props) {
  const sinDatos = datos.length === 0 || series.length === 0;

  async function descargar() {
    const esc = (t: string) => `"${t.replace(/"/g, '""')}"`;
    const encabezado = ["Año", ...series.map((p) => esc(p.nombre))].join(",");
    const filas = datos.map((fila) =>
      [fila.anio, ...series.map((p) => fila[p.iso3] ?? "")].join(",")
    );
    // El ﻿ hace que Excel lea bien los acentos
    const csv = "﻿" + [encabezado, ...filas].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${prefijoArchivo}_${eje.replace(/[^a-zA-Z0-9]+/g, "_")}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    // Registrar la descarga (no bloquea al usuario si falla)
    try {
      await supabase.from("descargas").insert({
        dataset_nombre: datasetNombre,
        detalle: {
          eje,
          anios: datos.map((d) => d.anio),
          series: series.map((p) => p.iso3),
        },
      });
    } catch (err) {
      console.error("No se pudo registrar la descarga:", err);
    }
  }

  return (
    <button
      type="button"
      onClick={descargar}
      disabled={sinDatos}
      className="border border-gray-300 rounded px-4 py-2 hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed"
    >
      ⬇ Descargar CSV
    </button>
  );
}
