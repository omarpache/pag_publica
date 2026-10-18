"use client";

import { supabase } from "@/lib/supabase";

type Props = {
  datos: Record<string, number | null>[];
  paises: { iso3: string; nombre: string }[];
  eje: string;
};

export default function BotonDescargar({ datos, paises, eje }: Props) {
  async function descargar() {
    // Construir el CSV: una columna "anio" + una columna por país
    const encabezado = ["anio", ...paises.map((p) => p.iso3)].join(",");
    const filas = datos.map((fila) =>
      ["anio", ...paises.map((p) => p.iso3)]
        .map((clave) => fila[clave] ?? "")
        .join(",")
    );
    const csv = [encabezado, ...filas].join("\n");

    // Disparar la descarga en el navegador
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `pisa_${eje}_${paises.map((p) => p.iso3).join("-")}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    // Registrar la descarga (no bloquea al usuario si falla)
    try {
      await supabase.from("descargas").insert({
        dataset_nombre: "PISA",
        detalle: {
          eje,
          anios: datos.map((d) => d.anio),
          paises: paises.map((p) => p.iso3),
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
      className="text-sm border border-gray-300 rounded px-3 py-2 hover:border-gray-400"
    >
      ⬇ Descargar CSV
    </button>
  );
}
