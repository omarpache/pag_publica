import Explorador, { ParamsExplorador } from "@/components/Explorador";
import { NSE } from "@/lib/datasets";

export const revalidate = 3600;

export default async function NsePage({
  searchParams,
}: {
  searchParams: Promise<ParamsExplorador>;
}) {
  return (
    <Explorador config={NSE} searchParams={await searchParams}>
      {/* Fuente y metodología de este dataset */}
      <section className="mt-14 pt-8 border-t border-gray-200 text-sm text-gray-600 space-y-8">
        <div className="space-y-3">
          <h2 className="font-semibold text-gray-800">Fuente</h2>
          <p>
            Los niveles socioeconómicos se calculan a partir de los microdatos de la Encuesta
            Nacional de Ingresos y Gastos de los Hogares (ENIGH) del Instituto Nacional de
            Estadística y Geografía (INEGI). Cobertura actual: las ediciones 2016, 2018, 2020,
            2022 y 2024, para el total nacional.
          </p>
          <p>
            Fuente: INEGI, Encuesta Nacional de Ingresos y Gastos de los Hogares (ENIGH). La
            clasificación en niveles se basa en el esquema de puntajes de la Asociación Mexicana
            de Agencias de Inteligencia de Mercado y Opinión (AMAI). Este sitio no está afiliado,
            patrocinado ni respaldado por el INEGI ni por la AMAI; los cálculos y la presentación
            son responsabilidad exclusiva de este sitio. Más información:{" "}
            <a
              href="https://www.inegi.org.mx/programas/enigh/nc/2024/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              www.inegi.org.mx
            </a>
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="font-semibold text-gray-800">Metodología</h2>
          <p>
            A cada hogar se le asigna un puntaje con base en seis características: escolaridad
            del jefe o jefa del hogar, número de baños completos, número de automóviles,
            conexión a internet, número de personas ocupadas y número de dormitorios. Según el
            puntaje y los puntos de corte de cada edición, el hogar se clasifica en uno de siete
            niveles: E, D, D+, C-, C, C+ y A/B.
          </p>
          <p>
            Cada dato muestra el porcentaje de hogares que pertenece al nivel seleccionado,
            calculado con el factor de expansión de la encuesta, dentro del grupo definido por
            los cortes elegidos (por ejemplo, hogares con jefatura femenina en Jalisco). Se
            omiten los grupos con menos de 30 hogares en la muestra.
          </p>
          <p>
            Importante: los porcentajes pueden diferir de los publicados por la AMAI, porque
            aquí se utiliza toda la población de la ENIGH, sin aplicar filtros adicionales.
          </p>
          <p>
            Los cortes disponibles incluyen características del jefe del hogar (sexo, escolaridad
            y edad en rangos de cinco años), de la ubicación (entidad federativa y tamaño de
            localidad) y de la vivienda y el hogar (baños completos, dormitorios, autos,
            ocupados, tamaño y clase de hogar, menores y adultos mayores, tenencia de la vivienda
            y computadoras), y pueden combinarse dos cortes a la vez. El total nacional y los
            cortes por sexo del jefe del hogar y tamaño de localidad son de acceso libre; las
            demás desagregaciones estarán reservadas a suscriptores.
          </p>
          <p>
            Los datos se actualizan de forma manual cuando se incorporan nuevas ediciones de la
            encuesta. Las cifras son estimaciones basadas en una muestra, por lo que tienen un
            margen de error; en grupos pequeños, las diferencias entre años o entre grupos
            pueden no ser significativas. Los puntajes y puntos de corte pueden diferir entre
            ediciones, por lo que las comparaciones en el tiempo deben interpretarse con cautela.
          </p>
        </div>
      </section>
    </Explorador>
  );
}
