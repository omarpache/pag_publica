import Explorador, { ParamsExplorador } from "@/components/Explorador";
import { PISA } from "@/lib/datasets";

export const revalidate = 3600;

export default async function PisaPage({
  searchParams,
}: {
  searchParams: Promise<ParamsExplorador>;
}) {
  return (
    <Explorador config={PISA} searchParams={await searchParams}>
          {/* Fuente y metodología de este dataset */}
          <section className="mt-14 pt-8 border-t border-gray-200 text-sm text-gray-600 space-y-8">
            <div className="space-y-3">
              <h2 className="font-semibold text-gray-800">Fuente</h2>
              <p>
                Los resultados provienen de PISA (Programme for International Student Assessment),
                la evaluación internacional de estudiantes que aplica la Organización para la
                Cooperación y el Desarrollo Económicos (OCDE). Cobertura actual: las rondas 2015,
                2018, 2022 y 2025, para los 38 países de la OCDE incluidos en el análisis.
              </p>
              <p>
                Los datos de la prueba PISA utilizados en este sitio provienen de la OCDE. Los
                cálculos y agregaciones fueron elaborados de forma independiente a partir de los
                microdatos públicos de PISA, utilizando los estándares metodológicos de la OCDE y
                las funciones de acceso libre disponibles en R (paquete intsvy).
              </p>
              <p>
                Fuente: OCDE, Programme for International Student Assessment (PISA). Este sitio no
                está afiliado, patrocinado ni respaldado por la OCDE; los análisis, agregaciones y
                la presentación de los datos son responsabilidad exclusiva de este sitio y no
                reflejan necesariamente las posiciones oficiales de la OCDE. Más información:{" "}
                <a
                  href="https://www.oecd.org/pisa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  www.oecd.org/pisa
                </a>
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-semibold text-gray-800">Metodología</h2>
              <p>
                Se publican puntajes promedio por país y por ronda, en tres dominios (lectura,
                matemáticas y ciencias) y un puntaje general que los resume. En el análisis, cada
                estimación incluye su error estándar y el tamaño de la muestra.
              </p>
              <p>
                Los promedios se calculan a partir de los microdatos públicos de PISA, con las
                funciones de acceso libre del paquete intsvy de R y siguiendo los procedimientos
                metodológicos de la OCDE. Los resultados ya calculados se cargan a la base de datos
                del sitio; la página solo los consulta y los muestra, sin recalcularlos.
              </p>
              <p>
                Además del promedio nacional, los datos se desagregan por características de los
                estudiantes y de las escuelas (por ejemplo género, tipo de escuela, nivel
                socioeconómico, estatus migratorio, educación de los padres, idioma hablado en casa,
                repetición de grado y ubicación de la escuela), y pueden combinarse dos cortes a la
                vez. El promedio sin cortes y los cortes por género y por tipo de escuela son de
                acceso libre; las demás desagregaciones estarán reservadas a suscriptores.
              </p>
              <p>
                Los datos se actualizan de forma manual cuando se incorporan nuevas rondas o
                correcciones. Los puntajes son estimaciones basadas en muestras, por lo que tienen
                un margen de error: diferencias pequeñas entre países o entre rondas pueden no ser
                significativas.
              </p>
            </div>
          </section>
    </Explorador>
  );
}
