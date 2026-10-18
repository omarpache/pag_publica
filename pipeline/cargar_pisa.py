"""
Carga los resultados de PISA (ya calculados en R) a la tabla dataset_valores en Supabase.

Uso:
    python pipeline/cargar_pisa.py

Requiere:
    - Archivo .env en la raíz del proyecto con DATABASE_URL
    - CSV en data/raw/resultados_cruces_ocde.csv
"""

import os
import pandas as pd
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.environ["DATABASE_URL"]
CSV_PATH = "data/raw/resultados_cruces_ocde.csv"
NOMBRE_DATASET = "PISA"

# Columnas del CSV que representan variables de corte.
# Si en R agregas o quitas variables de corte, actualiza esta lista.
COLUMNAS_CORTE = [
    "escs_q", "immig", "xescs_q", "aiusesch_q", "private",
    "boy", "d_hisced", "difflang", "repeat", "iscedl",
    "general", "schlocation", "no_ai_use",
]

# Traduce el nombre de "Dominio" del CSV al nombre de eje que quieres guardar.
MAPA_EJE = {
    "Ciencias": "ciencias",
    "Lectura": "lectura",
    "Matemáticas": "matematicas",
    "General": "general",
}


def construir_dimensiones(fila):
    """Arma el JSON de dimensiones con el eje y los cortes activos de esta fila."""
    dims = {"eje": MAPA_EJE.get(fila["Dominio"], fila["Dominio"])}
    for col in COLUMNAS_CORTE:
        valor = fila[col]
        if pd.notna(valor) and valor != "":
            dims[col] = valor
    return dims


def main():
    engine = create_engine(DATABASE_URL)

    print("Leyendo CSV...")
    df = pd.read_csv(CSV_PATH, low_memory=False)
    print(f"  {len(df)} filas leídas")

    with engine.begin() as conn:
        # Obtener el id del dataset "PISA" (ya lo creaste como prueba en el Hito 3)
        dataset_id = conn.execute(
            text("select id from datasets where nombre = :n"),
            {"n": NOMBRE_DATASET},
        ).scalar()
        if dataset_id is None:
            raise ValueError(
                f"No existe un dataset llamado '{NOMBRE_DATASET}' en la tabla datasets."
            )

        # Mapa código ISO3 -> id de país
        paises = conn.execute(text("select id, codigo_iso3 from paises")).fetchall()
        mapa_paises = {row.codigo_iso3: row.id for row in paises}

    print("Transformando filas...")
    registros = []
    paises_faltantes = set()
    for _, fila in df.iterrows():
        iso3 = fila["cnt"]
        pais_id = mapa_paises.get(iso3)
        if pais_id is None:
            paises_faltantes.add(iso3)
            continue

        registros.append({
            "dataset_id": dataset_id,
            "pais_id": pais_id,
            "anio": int(fila["anio"]),
            "dimensiones": construir_dimensiones(fila),
            "valor": fila["Media"],
            "se": fila["SE"] if pd.notna(fila["SE"]) else None,
            "n": int(fila["N"]) if pd.notna(fila["N"]) else None,
            "es_premium": bool(fila["n_cortes"] > 0),
        })

    if paises_faltantes:
        print(f"  Aviso: {len(paises_faltantes)} códigos de país no encontrados en 'paises': {paises_faltantes}")

    print(f"Insertando {len(registros)} filas en dataset_valores...")
    resultado = pd.DataFrame(registros)

    # dimensiones necesita ir como JSON string para que Postgres lo acepte como jsonb
    import json
    resultado["dimensiones"] = resultado["dimensiones"].apply(json.dumps)

    with engine.begin() as conn:
        resultado.to_sql("dataset_valores", conn, if_exists="append", index=False,
                          method="multi", chunksize=1000)

    print("Listo.")


if __name__ == "__main__":
    main()
