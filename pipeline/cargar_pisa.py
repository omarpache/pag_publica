"""
Carga los resultados de PISA (ya calculados en R) a dataset_valores en Supabase.
REEMPLAZA los datos anteriores de PISA: borra, inserta y recalcula todo en una sola
transacción. Si algo falla, no se cambia nada y el sitio conserva los datos que tenía.

Uso (desde la raíz del proyecto):
    python pipeline/cargar_pisa.py

Requiere:
    - .env con DATABASE_URL
    - CSV en data/raw/resultados_cruces_ocde.csv
"""

import json
import os

import pandas as pd
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

load_dotenv()

DATABASE_URL = os.environ["DATABASE_URL"]
CSV_PATH = "data/raw/resultados_cruces_ocde.csv"
NOMBRE_DATASET = "PISA"

# Columnas del CSV que son variables de corte.
# Si agregas o quitas variables de corte en R, actualiza esta lista.
COLUMNAS_CORTE = [
    "escs_q", "immig", "xescs_q", "aiusesch_q", "private",
    "boy", "d_hisced", "difflang", "repeat", "iscedl",
    "general", "schlocation", "no_ai_use",
]

MAPA_EJE = {
    "Ciencias": "ciencias",
    "Lectura": "lectura",
    "Matemáticas": "matematicas",
    "General": "general",
}


def construir_dimensiones(fila):
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
        dataset_id = conn.execute(
            text("select id from datasets where nombre = :n"), {"n": NOMBRE_DATASET}
        ).scalar()
        if dataset_id is None:
            raise ValueError(f"No existe un dataset llamado '{NOMBRE_DATASET}' en la tabla datasets.")

        paises = conn.execute(text("select id, codigo_iso3 from paises")).fetchall()
        mapa_paises = {row.codigo_iso3: row.id for row in paises}

    print("Transformando filas...")
    registros = []
    paises_faltantes = set()
    for _, fila in df.iterrows():
        pais_id = mapa_paises.get(fila["cnt"])
        if pais_id is None:
            paises_faltantes.add(fila["cnt"])
            continue
        registros.append({
            "dataset_id": dataset_id,
            "pais_id": pais_id,
            "anio": int(fila["anio"]),
            "dimensiones": json.dumps(construir_dimensiones(fila)),
            "valor": fila["Media"],
            "se": fila["SE"] if pd.notna(fila["SE"]) else None,
            "n": int(fila["N"]) if pd.notna(fila["N"]) else None,
            "es_premium": bool(fila["n_cortes"] > 0),
        })

    if paises_faltantes:
        print(f"  AVISO: países del CSV que no existen en 'paises' (se omitieron): {sorted(paises_faltantes)}")

    resultado = pd.DataFrame(registros)

    # Todo en una sola transacción: o se reemplaza todo, o no cambia nada.
    with engine.begin() as conn:
        print("Borrando los datos anteriores de PISA...")
        conn.execute(text("delete from dataset_valores where dataset_id = :d"), {"d": dataset_id})

        print(f"Insertando {len(resultado)} filas...")
        resultado.to_sql("dataset_valores", conn, if_exists="append", index=False,
                         method="multi", chunksize=1000)

        print("Calculando cortes_activos...")
        conn.execute(text("""
            update dataset_valores
            set cortes_activos = coalesce(
              (select string_agg(k, ',' order by k)
               from jsonb_object_keys(dimensiones) as k where k <> 'eje'), '')
            where dataset_id = :d
        """), {"d": dataset_id})

        print("Aplicando la regla de premium (gratis: sin cortes, género y escuela)...")
        conn.execute(text("""
            update dataset_valores
            set es_premium = exists (
              select 1 from jsonb_object_keys(dimensiones) as k
              where k not in ('eje', 'boy', 'private'))
            where dataset_id = :d
        """), {"d": dataset_id})

    with engine.connect() as conn:
        filas = conn.execute(text(
            "select anio, count(*) from dataset_valores where dataset_id = :d group by anio order by anio"
        ), {"d": dataset_id}).fetchall()
    print("Filas por año en la base de datos:")
    for anio, n in filas:
        print(f"  {anio}: {n}")
    print("Listo.")


if __name__ == "__main__":
    main()
