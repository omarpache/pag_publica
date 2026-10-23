// Configuración de cada base de datos del sitio.
// Para agregar una base nueva: agrega un objeto aquí, crea su carpeta en app/
// (app/<slug>/page.tsx) y agrégala en el catálogo de app/page.tsx.

export type Corte = {
  valor: string; // nombre de la columna de corte en el CSV
  etiqueta: string; // como se muestra en el sitio
  libre?: boolean; // true = acceso gratuito; si no, es premium
};

export type ConfigDataset = {
  slug: string; // ruta: /pisa, /nse
  nombreDb: string; // nombre EXACTO en la tabla datasets
  nombre: string; // nombre para mostrar
  etiquetaEje: string; // nombre del selector principal (Eje, Nivel...)
  ejes: { valor: string; etiqueta: string }[];
  ejeDefault: string;
  // true = el eje se elige con botones (varios a la vez), por defecto todos
  ejeMultiple?: boolean;
  textoTodosEjes?: string; // texto del título cuando están todos los ejes
  prefijoEjeTitulo?: string; // ej. "NSE " para "NSE C+, C"
  cortes: Corte[];
  paises: [string, string][]; // [ISO3, nombre]
  paisesDefault: string[];
  aniosDefault: number[];
  plantillaTitulo: string; // {eje} se reemplaza por la etiqueta del eje
  etiquetaY: string;
  descripcionSinCortes: string;
  prefijoArchivo: string; // nombre del CSV descargado
  // Orden en que se muestran los valores de cada corte (si no está, alfabético)
  ordenValores?: Record<string, string[]>;
};

const PAISES_OCDE: [string, string][] = [
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

export const PISA: ConfigDataset = {
  slug: "pisa",
  nombreDb: "PISA",
  nombre: "Prueba PISA",
  etiquetaEje: "Eje",
  ejes: [
    { valor: "general", etiqueta: "General" },
    { valor: "lectura", etiqueta: "Lectura" },
    { valor: "matematicas", etiqueta: "Matemáticas" },
    { valor: "ciencias", etiqueta: "Ciencias" },
  ],
  ejeDefault: "general",
  cortes: [
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
  ],
  paises: PAISES_OCDE,
  paisesDefault: ["MEX"],
  aniosDefault: [2025],
  plantillaTitulo: "Puntaje PISA — {eje}",
  etiquetaY: "Puntaje promedio",
  descripcionSinCortes: "Evolución del puntaje por país a través de los años seleccionados.",
  prefijoArchivo: "pisa",
};

export const NSE: ConfigDataset = {
  slug: "nse",
  nombreDb: "NSE",
  nombre: "Niveles socioeconómicos",
  etiquetaEje: "Nivel socioeconómico",
  ejes: ["E", "D", "D+", "C-", "C", "C+", "A/B"].map((n) => ({ valor: n, etiqueta: n })),
  ejeDefault: "C",
  ejeMultiple: true,
  textoTodosEjes: "todos los niveles",
  prefijoEjeTitulo: "NSE ",
  cortes: [
    { valor: "sexo_jefe", etiqueta: "Sexo del jefe del hogar", libre: true },
    { valor: "tam_localidad", etiqueta: "Tamaño de localidad", libre: true },
    { valor: "escolaridad_jefe", etiqueta: "Escolaridad del jefe del hogar" },
    { valor: "entidad", etiqueta: "Entidad federativa" },
    { valor: "edad_jefe_5", etiqueta: "Edad del jefe (rangos de 5 años)" },
    { valor: "hogar_con_65mas", etiqueta: "Integrantes de 65 años y más" },
    { valor: "banos_completos", etiqueta: "Baños completos" },
    { valor: "dormitorios", etiqueta: "Dormitorios" },
    { valor: "autos", etiqueta: "Número de autos" },
    { valor: "ocupados", etiqueta: "Número de ocupados" },
    { valor: "tamano_hogar", etiqueta: "Tamaño del hogar" },
    { valor: "clase_hogar", etiqueta: "Clase de hogar" },
    { valor: "hogar_con_menores", etiqueta: "Menores de 12 años en el hogar" },
    { valor: "tenencia_vivienda", etiqueta: "Tenencia de la vivienda" },
    { valor: "computadoras", etiqueta: "Computadoras en el hogar" },
  ],
  paises: [["MEX", "México"]],
  paisesDefault: ["MEX"],
  aniosDefault: [2024],
  plantillaTitulo: "Porcentaje de hogares ({eje})",
  etiquetaY: "% de hogares",
  descripcionSinCortes: "Porcentaje de hogares de México por nivel socioeconómico, por año de la ENIGH.",
  prefijoArchivo: "nse",
  ordenValores: {
    escolaridad_jefe: [
      "Sin instrucción", "Preescolar", "Primaria incompleta", "Primaria completa",
      "Secundaria incompleta", "Secundaria completa", "Preparatoria incompleta",
      "Preparatoria completa", "Profesional incompleta", "Profesional completa", "Posgrado",
    ],
    edad_jefe_5: [
      "Menos de 20", "20-24", "25-29", "30-34", "35-39", "40-44", "45-49", "50-54",
      "55-59", "60-64", "65-69", "70-74", "75-79", "80 y más",
    ],
    tam_localidad: [
      "100 mil y más habitantes", "15 mil a 99,999 habitantes",
      "2,500 a 14,999 habitantes", "Menos de 2,500 habitantes",
    ],
    banos_completos: ["0", "1", "2", "3 o más"],
    dormitorios: ["0", "1", "2", "3", "4 o más"],
    autos: ["0", "1", "2", "3 o más"],
    ocupados: ["0", "1", "2", "3", "4 o más"],
    tamano_hogar: ["1", "2", "3", "4", "5", "6 o más"],
    clase_hogar: ["Unipersonal", "Nuclear", "Ampliado", "Compuesto", "Corresidente"],
    hogar_con_65mas: ["Sin integrantes de 65+", "Con integrantes de 65+"],
    hogar_con_menores: ["Sin menores de 12 años", "Con menores de 12 años"],
    tenencia_vivienda: [
      "Rentada", "Prestada", "Propia (la están pagando)", "Propia",
      "Intestada o en litigio", "Otra situación",
    ],
    computadoras: ["0", "1", "2 o más"],
  },
};

export const DECILES: ConfigDataset = {
  slug: "deciles",
  nombreDb: "DECILES",
  nombre: "Ingreso por deciles de hogares",
  etiquetaEje: "Decil de ingreso",
  ejes: ["Total", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"].map((n) => ({
    valor: n,
    etiqueta: n,
  })),
  ejeDefault: "Total",
  ejeMultiple: true,
  textoTodosEjes: "total y todos los deciles",
  prefijoEjeTitulo: "",
  cortes: [
    { valor: "sexo_jefe", etiqueta: "Sexo del jefe del hogar", libre: true },
    { valor: "tam_localidad", etiqueta: "Tamaño de localidad", libre: true },
    { valor: "edad_jefe_10", etiqueta: "Edad del jefe (rangos de 10 años)" },
    { valor: "escolaridad_jefe", etiqueta: "Escolaridad del jefe del hogar" },
    { valor: "entidad", etiqueta: "Entidad federativa" },
    { valor: "estrato_socioeconomico", etiqueta: "Estrato socioeconómico (INEGI)" },
    { valor: "clase_hogar", etiqueta: "Clase de hogar" },
    { valor: "tamano_hogar", etiqueta: "Tamaño del hogar" },
    { valor: "ocupados", etiqueta: "Número de ocupados" },
    { valor: "perceptores", etiqueta: "Perceptores de ingreso" },
    { valor: "hogar_con_menores", etiqueta: "Menores de 12 años en el hogar" },
    { valor: "hogar_con_65mas", etiqueta: "Integrantes de 65 años y más" },
    { valor: "recibe_remesas", etiqueta: "Recepción de remesas" },
    { valor: "recibe_programas", etiqueta: "Beneficios gubernamentales" },
    { valor: "recibe_jubilacion", etiqueta: "Jubilaciones o pensiones" },
  ],
  paises: [["MEX", "México"]],
  paisesDefault: ["MEX"],
  aniosDefault: [2024],
  plantillaTitulo: "Ingreso corriente promedio trimestral por hogar ({eje})",
  etiquetaY: "Pesos por hogar (trimestral)",
  descripcionSinCortes:
    "Ingreso corriente promedio trimestral de los hogares de México, por decil de ingreso, según la ENIGH.",
  prefijoArchivo: "deciles",
  ordenValores: {
    escolaridad_jefe: [
      "Sin instrucción", "Preescolar", "Primaria incompleta", "Primaria completa",
      "Secundaria incompleta", "Secundaria completa", "Preparatoria incompleta",
      "Preparatoria completa", "Profesional incompleta", "Profesional completa", "Posgrado",
    ],
    edad_jefe_10: ["Menos de 30", "30-39", "40-49", "50-59", "60-69", "70 y más"],
    tam_localidad: [
      "100 mil y más habitantes", "15 mil a 99,999 habitantes",
      "2,500 a 14,999 habitantes", "Menos de 2,500 habitantes",
    ],
    estrato_socioeconomico: ["Bajo", "Medio bajo", "Medio alto", "Alto"],
    clase_hogar: ["Unipersonal", "Nuclear", "Ampliado", "Compuesto", "Corresidente"],
    tamano_hogar: ["1", "2", "3", "4", "5", "6 o más"],
    ocupados: ["0", "1", "2", "3", "4 o más"],
    perceptores: ["0", "1", "2", "3", "4 o más"],
    hogar_con_menores: ["Sin menores de 12 años", "Con menores de 12 años"],
    hogar_con_65mas: ["Sin integrantes de 65+", "Con integrantes de 65+"],
    recibe_remesas: ["No recibe remesas", "Recibe remesas"],
    recibe_programas: ["No recibe beneficios gubernamentales", "Recibe beneficios gubernamentales"],
    recibe_jubilacion: ["No recibe jubilaciones o pensiones", "Recibe jubilaciones o pensiones"],
  },
};

// Orden estable de valores de un corte
export function ordenarValores(cfg: ConfigDataset, corte: string, valores: string[]): string[] {
  const orden = cfg.ordenValores?.[corte];
  if (!orden) return [...valores].sort((a, b) => a.localeCompare(b, "es"));
  const pos = (v: string) => {
    const i = orden.indexOf(v);
    return i === -1 ? 999 : i;
  };
  return [...valores].sort((a, b) => pos(a) - pos(b) || a.localeCompare(b, "es"));
}
