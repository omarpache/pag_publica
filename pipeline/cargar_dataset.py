"""
Carga un dataset (ya calculado en R) a dataset_valores en Supabase.
REEMPLAZA los datos anteriores de ESE dataset: borra, inserta y recalcula todo en una
sola transacción. Si algo falla, no cambia nada.

Uso (desde la raíz del proyecto):
    python pipeline/cargar_dataset.py PISA
    python pipeline/cargar_dataset.py NSE

Requiere:
    - .env con DATABASE_URL
    - El CSV del dataset en data/raw/
    - Una fila en la tabla datasets con el mismo nombre (PISA, NSE)

Para agregar un dataset nuevo: agrega una entrada en DATASETS.
"""

import json
import os
import sys

import pandas as pd
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

load_dotenv()

DATASETS = {
    "PISA": {
        "csv": "data/raw/resultados_cruces_ocde.csv",
        "col_pais": "cnt",       # código ISO3
        "col_anio": "anio",
        "col_eje": "Dominio",    # columna que define el "eje" (selector principal)
        "mapa_eje": {"Ciencias": "ciencias", "Lectura": "lectura",
                     "Matemáticas": "matematicas", "General": "general"},
        "col_valor": "Media",
        "col_se": "SE",
        "col_n": "N",
        "cortes": ["escs_q", "immig", "xescs_q", "aiusesch_q", "private", "boy",
                   "d_hisced", "difflang", "repeat", "iscedl", "general",
                   "schlocation", "no_ai_use"],
        # cortes de acceso gratuito (todo lo demás es premium)
        "libres": ["boy", "private"],
    },
    "NSE": {
        "csv": "data/raw/nse_cruces.csv",
        "col_pais": "pais",
        "col_anio": "anio",
        "col_eje": "nivel_nse",
        "mapa_eje": {},
        "col_valor": "valor",
        "col_se": None,
        "col_n": "n",
        "cortes": ["sexo_jefe", "escolaridad_jefe", "entidad", "tam_localidad",
                   "banos_completos", "dormitorios", "autos", "edad_jefe_5",
                   "hogar_con_65mas", "ocupados", "tamano_hogar", "clase_hogar",
                   "hogar_con_menores", "tenencia_vivienda", "computadoras"],
        "libres": ["sexo_jefe", "tam_localidad"],
    },
    "DECILES": {
        "csv": "data/raw/deciles_cruces.csv",
        "col_pais": "pais",
        "col_anio": "anio",
        "col_eje": "nivel",      # Total, I, II, ..., X
        "mapa_eje": {},
        "col_valor": "valor",    # ingreso corriente promedio trimestral por hogar
        "col_se": None,
        "col_n": "n",
        "cortes": ["sexo_jefe", "edad_jefe_10", "escolaridad_jefe", "entidad",
                   "tam_localidad", "estrato_socioeconomico", "clase_hogar",
                   "tamano_hogar", "ocupados", "perceptores", "hogar_con_menores",
                   "hogar_con_65mas", "recibe_remesas", "recibe_programas",
                   "recibe_jubilacion"],
        "libres": ["sexo_jefe", "tam_localidad"],
    },
}


def main():
    if len(sys.argv) != 2 or sys.argv[1] not in DATASETS:
        print("Uso: python pipeline/cargar_dataset.py <" + "|".join(DATASETS) + ">")
        sys.exit(1)

    nombre = sys.argv[1]
    cfg = DATASETS[nombre]
    engine = create_engine(os.environ["DATABASE_URL"])

    print(f"Leyendo {cfg['csv']}...")
    df = pd.read_csv(cfg["csv"], low_memory=False, dtype=str, keep_default_na=False)
    print(f"  {len(df)} filas leídas")

    faltan = [c for c in [cfg["col_pais"], cfg["col_anio"], cfg["col_eje"], cfg["col_valor"]] + cfg["cortes"]
              if c not in df.columns]
    if faltan:
        raise ValueError(f"Faltan columnas en el CSV: {faltan}")

    with engine.begin() as conn:
        dataset_id = conn.execute(
            text("select id from datasets where nombre = :n"), {"n": nombre}
        ).scalar()
        if dataset_id is None:
            raise ValueError(f"No existe un dataset llamado '{nombre}' en la tabla datasets.")
        mapa_paises = {r.codigo_iso3: r.id for r in
                       conn.execute(text("select id, codigo_iso3 from paises")).fetchall()}

    print("Transformando filas...")
    df["pais_id"] = df[cfg["col_pais"]].map(mapa_paises)
    faltantes = sorted(df.loc[df["pais_id"].isna(), cfg["col_pais"]].unique())
    if faltantes:
        print(f"  AVISO: países que no existen en 'paises' (se omitieron): {faltantes}")
    df = df[df["pais_id"].notna()].copy()

    ejes = df[cfg["col_eje"]].map(lambda v: cfg["mapa_eje"].get(v, v))
    cortes = df[cfg["cortes"]].to_dict("records")
    dims = []
    for eje, fila in zip(ejes, cortes):
        d = {"eje": eje}
        d.update({k: v for k, v in fila.items() if v != ""})
        dims.append(json.dumps(d, ensure_ascii=False))

    resultado = pd.DataFrame({
        "dataset_id": dataset_id,
        "pais_id": df["pais_id"].astype(int).values,
        "anio": df[cfg["col_anio"]].astype(float).astype(int).values,
        "dimensiones": dims,
        "valor": pd.to_numeric(df[cfg["col_valor"]], errors="coerce").values,
        "se": pd.to_numeric(df[cfg["col_se"]], errors="coerce").values if cfg["col_se"] else None,
        "n": pd.to_numeric(df[cfg["col_n"]], errors="coerce").round().astype("Int64").values
             if cfg["col_n"] else None,
    })

    with engine.begin() as conn:
        print(f"Borrando los datos anteriores de {nombre}...")
        conn.execute(text("delete from dataset_valores where dataset_id = :d"), {"d": dataset_id})

        print(f"Insertando {len(resultado)} filas...")
        resultado.to_sql("dataset_valores", conn, if_exists="append", index=False,
                         method="multi", chunksize=1000)

        print("Calculando cortes_activos y es_general...")
        conn.execute(text("""
            update dataset_valores
            set cortes_activos = coalesce(
                  (select string_agg(k, ',' order by k)
                   from jsonb_object_keys(dimensiones) as k where k <> 'eje'), ''),
                es_general = not exists (
                  select 1 from jsonb_object_keys(dimensiones) as k where k <> 'eje')
            where dataset_id = :d
        """), {"d": dataset_id})

        print(f"Aplicando la regla de premium (gratis: sin cortes y {cfg['libres']})...")
        conn.execute(text("""
            update dataset_valores
            set es_premium = exists (
              select 1 from jsonb_object_keys(dimensiones) as k
              where k <> all(:libres))
            where dataset_id = :d
        """), {"d": dataset_id, "libres": ["eje"] + cfg["libres"]})

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
