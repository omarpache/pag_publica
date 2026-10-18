import type { Metadata } from "next";
import MarcoPagina from "@/components/MarcoPagina";

export const metadata: Metadata = {
  title: "Fuentes",
  description: "Origen de los datos publicados en este sitio y su atribución.",
};

export default function Fuentes() {
  return (
    <MarcoPagina titulo="Fuentes">
      <h2 className="font-serif text-xl mt-2">Prueba PISA — OCDE</h2>
      <p>
        Los resultados publicados provienen de PISA (Programme for International Student
        Assessment), la evaluación internacional de estudiantes que aplica la Organización
        para la Cooperación y el Desarrollo Económicos (OCDE).
      </p>
      <p>
        Cobertura actual: las rondas 2015, 2018, 2022 y 2025, para los 38 países de la OCDE
        incluidos en el análisis, en lectura, matemáticas, ciencias y un puntaje general.
      </p>

      <h2 className="font-serif text-xl mt-10">Atribución</h2>
      <blockquote className="border-l-2 border-[#B8862E] pl-4 text-[#1B2233]/75 space-y-3">
        <p>
          Los datos de la prueba PISA utilizados en este sitio provienen de la Organización
          para la Cooperación y el Desarrollo Económicos (OCDE). Los cálculos y agregaciones
          fueron elaborados de forma independiente a partir de los microdatos públicos de PISA,
          utilizando los estándares metodológicos de la OCDE y las funciones de acceso libre
          disponibles en R (paquete intsvy).
        </p>
        <p>Fuente: OCDE, Programme for International Student Assessment (PISA).</p>
        <p>
          Este sitio no está afiliado, patrocinado ni respaldado por la OCDE. Los análisis,
          agregaciones y la presentación de los datos son responsabilidad exclusiva de este
          sitio y no reflejan necesariamente las posiciones oficiales de la OCDE.
        </p>
      </blockquote>

      <p>
        Más información sobre PISA:{" "}
        <a
          href="https://www.oecd.org/pisa"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          www.oecd.org/pisa
        </a>
      </p>
    </MarcoPagina>
  );
}
