import Explorador, { ParamsExplorador } from "@/components/Explorador";
import { DECILES } from "@/lib/datasets";

export const revalidate = 3600;

export default async function DecilesPage({
  searchParams,
}: {
  searchParams: Promise<ParamsExplorador>;
}) {
  return (
    <Explorador config={DECILES} searchParams={await searchParams}>
      {/* Fuente y metodología de este dataset */}
      <section className="mt-14 pt-8 border-t border-gray-200 text-sm text-gray-600 space-y-8">
        <div className="space-y-3">
          <h2 className="font-semibold text-gray-800">Fuente</h2>
          <p>
            Los ingresos provienen de la Encuesta Nacional de Ingresos y Gastos de los Hogares
            (ENIGH) del Instituto Nacional de Estadística y Geografía (INEGI), tabla
            concentradohogar. Cobertura actual: las ediciones 2016, 2018, 2020, 2022 y 2024,
            para el total nacional.
          </p>
          <p>
            Fuente: INEGI, Encuesta Nacional de Ingresos y Gastos de los Hogares (ENIGH). Los
            cálculos siguen el procedimiento descrito por el INEGI en &ldquo;Descripción del
            cálculo de los principales indicadores con R&rdquo;. Este sitio no está afiliado,
            patrocinado ni respaldado por el INEGI; los cálculos y la presentación son
            responsabilidad exclusiva de este sitio. Más información:{" "}
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
            Se muestra el ingreso corriente promedio trimestral por hogar. Los hogares se
            ordenan de menor a mayor ingreso corriente y se dividen en diez grupos con el mismo
            número de hogares (deciles), utilizando el factor de expansión de la encuesta; los
            hogares que quedan en la frontera entre dos deciles se reparten de forma
            proporcional, como lo hace el INEGI. El decil I es el 10% de hogares con menor
            ingreso y el decil X el 10% con mayor ingreso. &ldquo;Total&rdquo; es el promedio de
            todos los hogares del grupo.
          </p>
          <p>
            Cuando eliges uno o dos cortes, los deciles se calculan de nuevo dentro de cada
            grupo (por ejemplo, entre los hogares con jefatura femenina de Jalisco), no sobre
            la población total. Por eso el decil X de un grupo no es comparable con el decil X
            nacional. Se omiten los grupos con menos de 100 hogares en la muestra.
          </p>
          <p>
            Los cortes provienen de la propia tabla concentradohogar: sexo, edad y escolaridad
            del jefe del hogar, entidad federativa, tamaño de localidad, estrato
            socioeconómico, clase y tamaño del hogar, ocupados, perceptores, presencia de
            menores y de adultos mayores, y recepción de remesas, beneficios gubernamentales y
            jubilaciones. Pueden combinarse dos cortes a la vez. El total nacional y los cortes
            por sexo del jefe del hogar y tamaño de localidad son de acceso libre; las demás
            desagregaciones estarán reservadas a suscriptores.
          </p>
          <p>
            Las cifras están en pesos corrientes de cada año, es decir, sin ajuste por
            inflación. Este sitio compara la distribución del ingreso de cada edición y no
            analiza cambios en el poder adquisitivo entre años; por eso no se deflactan los
            montos. El INEGI señala que la construcción de variables de la ENIGH 2024 es
            distinta a la tradicional, así que las comparaciones en el tiempo deben
            interpretarse con cautela.
            Son estimaciones basadas en una muestra, con margen de error, y los datos se
            actualizan de forma manual cuando se incorporan nuevas ediciones.
          </p>
        </div>
      </section>
    </Explorador>
  );
}
