import os
import pandas as pd
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.engine import Engine, URL
from sqlalchemy.dialects.postgresql import insert

load_dotenv()

def create_database_engine() -> Engine:
    """
    Crée et retourne le moteur de connexion PostgreSQL.
    """
    postgres_user = os.getenv("POSTGRES_USER")
    postgres_password = os.getenv("POSTGRES_PASSWORD")
    postgres_db = os.getenv("POSTGRES_DB")
    postgres_host = os.getenv("POSTGRES_HOST", "localhost")
    postgres_port = os.getenv("POSTGRES_PORT", "5432")


    if not postgres_user:
        raise ValueError("La variable POSTGRES_USER est manquante.")
    if not postgres_password:
        raise ValueError("La variable POSTGRES_PASSWORD est manquante.")
    if not postgres_db:
        raise ValueError("La variable POSTGRES_DB est manquante.")

    database_url = URL.create(
        drivername="postgresql+psycopg2",
        username=postgres_user,
        password=postgres_password,
        host=postgres_host,
        port=int(postgres_port),
        database=postgres_db,
    )
    return create_engine(database_url)


def insert_ignore_duplicates(table, connection, keys, data_iter):
    rows = [dict(zip(keys, row)) for row in data_iter]

    statement = insert(table.table).values(rows)

    statement = statement.on_conflict_do_nothing(
        index_elements=["measured_at", "latitude", "longitude"]
    )

    result = connection.execute(statement)

    return result.rowcount


def load_air_quality(df: pd.DataFrame) -> None:
    """
    Charge les données transformées de qualité de l'air.
    """
    if df.empty:
        raise ValueError("Le DataFrame a charger est vide.")

    engine = create_database_engine()

    inserted_rows = df.to_sql(
        name="air_quality_measurements",
        con=engine,
        if_exists="append",
        index=False,
        method=insert_ignore_duplicates,
    )

    print("Données chargées avec succès dans PostgreSQL.")
    print(f"Nombre de lignes réellement insérées : {inserted_rows}")

if __name__ == "__main__":
    from etl.extract import fetch_air_quality
    from etl.transform import transform_air_quality
    from config import CITIES

    for city in CITIES:
        print(f"\nTraitement de la ville : {city['name']}")

        data = fetch_air_quality(
            latitude=city["latitude"],
            longitude=city["longitude"],
        )

        df = transform_air_quality(
            data,
            city_name=city["name"],
        )

        load_air_quality(df)