import type { Metadata } from "next";
import MarcoPagina from "@/components/MarcoPagina";

export const metadata: Metadata = {
  title: "Metodología",
  description: "Cómo se calculan y presentan los resultados de PISA en este sitio.",
};

export default function Metodologia() {
  return (
    <MarcoPagina titulo="Metodología">
      <h2 className="font-serif text-xl mt-2">Qué se publica</h2>
      <p>
        Puntajes promedio de PISA por país y por ronda, en tres dominios (lectura, matemáticas
        y ciencias) y un puntaje general que los resume. Cada estimación incluye, en el
        análisis, su error estándar y el tamaño de la muestra.
      </p>

      <h2 className="font-serif text-xl mt-10">Cómo se calculan</h2>
      <p>
        Los promedios se calculan a partir de los microdatos públicos de PISA, con las
        funciones de acceso libre del paquete intsvy de R y siguiendo los procedimientos
        metodológicos de la OCDE. Los resultados ya calculados se cargan a la base de datos
        del sitio; la página solo los consulta y los muestra, sin recalcularlos.
      </p>

      <h2 className="font-serif text-xl mt-10">Cortes</h2>
      <p>
        Además del promedio nacional, los datos se desagregan por características de los
        estudiantes y de las escuelas, por ejemplo género, tipo de escuela (pública o privada),
        nivel socioeconómico, estatus migratorio, educación de los padres, idioma hablado en
        casa, repetición de grado y ubicación de la escuela. Pueden combinarse dos cortes a la
        vez.
      </p>
      <p>
        El promedio sin cortes y los cortes por género y por tipo de escuela son de acceso
        libre. Las demás desagregaciones estarán reservadas a suscriptores.
      </p>

      <h2 className="font-serif text-xl mt-10">Actualización</h2>
      <p>
        Los datos se actualizan de forma manual cuando se incorporan nuevas rondas o
        correcciones; no hay actualización automática.
      </p>

      <h2 className="font-serif text-xl mt-10">Cómo interpretar los resultados</h2>
      <p>
        Los puntajes son estimaciones basadas en muestras, por lo que tienen un margen de
        error. Diferencias pequeñas entre países o entre rondas pueden no ser significativas.
      </p>
    </MarcoPagina>
  );
}
