import os
import pandas as pd
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.engine import Engine, URL
from sqlalchemy.dialects.postgresql import insert
import logging

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

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


def get_latest_measurement_time(engine: Engine, city_name: str):
    """
    Retourne la date/heure de la mesure la plus récente
    enregistrée pour une ville.

    Retourne None si la ville n'a encore aucune donnée.
    """
    query = text("""
        SELECT MAX(measured_at)
        FROM air_quality_measurements
        WHERE city_name = :city_name
            and is_forecast = FALSE
        """)

    with engine.connect() as connection:
        result = connection.execute(
            query,
            {"city_name": city_name}
        )
        return result.scalar()

def insert_or_update(table, connection, keys, data_iter):
    rows = [dict(zip(keys, row)) for row in data_iter]

    statement = insert(table.table).values(rows)

    statement = statement.on_conflict_do_update(
        index_elements=["measured_at", "latitude", "longitude"],

        #on remplace l'encienne par la nouvelle 
        set_={
            "pm10": statement.excluded.pm10,
            "pm2_5": statement.excluded.pm2_5,
            "carbon_monoxide": statement.excluded.carbon_monoxide,
            "nitrogen_dioxide": statement.excluded.nitrogen_dioxide,
            "sulphur_dioxide": statement.excluded.sulphur_dioxide,
            "ozone": statement.excluded.ozone,
            "european_aqi": statement.excluded.european_aqi,
            "city_name": statement.excluded.city_name,
            "timezone": statement.excluded.timezone,
            "is_forecast": statement.excluded.is_forecast,
        },

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
        method=insert_or_update,
    )

    logger.info("Données chargées avec succès dans PostgreSQL.")
    logger.info(f"Nombre de lignes traitées par l'UPSERT : %s ",inserted_rows)

if __name__ == "__main__":
    from etl.extract import fetch_air_quality
    from etl.transform import transform_air_quality
    from config import CITIES

   

    for city in CITIES:
        logger.info(f"\nTraitement de la ville : {city['name']}")

        data = fetch_air_quality(
            latitude=city["latitude"],
            longitude=city["longitude"],
        )

        df = transform_air_quality(
            data,
            city_name=city["name"],
        )

        load_air_quality(df)