from datetime import timedelta
import pandas as pd

from etl.load import create_database_engine, get_latest_measurement_time, load_air_quality
from etl.extract import fetch_air_quality
from etl.transform import transform_air_quality
from config import CITIES, DEFAULT_TIMEZONE

import logging

logger = logging.getLogger(__name__)


def get_incremental_start(latest_measurement):
    """
    Calcule l'heure à partir de laquelle reprendre l'ingestion.

    Retourne None si aucune mesure n'existe encore pour la ville.
    """

    if latest_measurement is None:
        return None
    return latest_measurement + timedelta(hours=1)

def format_open_meteo_hour(dt):
    """
    Convertit un datetime Python au format attendu par Open-Meteo.

    Exemple :
    2026-08-20 00:00:00
    devient
    2026-08-20T00:00
    """
    if dt is None:
        return None

    return dt.strftime("%Y-%m-%dT%H:%M")

def get_initial_start(timezone: str, lookback_days: int = 7):
    """
    Calcule le point de départ pour une ville
    qui n'a encore aucune donnée en base.
    """
    current_time = (
        pd.Timestamp.now(tz=timezone)
        .floor("h")
        .tz_localize(None)
    )

    return current_time - timedelta(days=lookback_days)

def get_incremental_end(timezone: str):
    """
    Calcule l'heure de fin de la fenêtre incrémentale.
    """
    current_time = pd.Timestamp.now(tz=timezone).floor("h").tz_localize(None)
    return current_time + timedelta(days=4)

def process_city_incremental(city: dict, engine):
    """
    Exécute l'ingestion incrémentale pour une seule ville.
    """
    logger.info(
        "Traitement incrémental : %s",
        city["name"],
    )

    latest = get_latest_measurement_time(
        engine,
        city["name"],
    )

    if latest is None:
        logger.info(
            "Aucune donnée existante pour %s : initialisation sur les 7 derniers jours.",
            city["name"],
        )
        start = get_initial_start(DEFAULT_TIMEZONE)
    else:
        start = get_incremental_start(latest)

    end = get_incremental_end(DEFAULT_TIMEZONE)

    start_hour = format_open_meteo_hour(start)
    end_hour = format_open_meteo_hour(end)

    logger.info("Dernière mesure : %s", latest)
    logger.info("start_hour : %s", start_hour)
    logger.info("end_hour : %s", end_hour)

    data = fetch_air_quality(
        latitude=city["latitude"],
        longitude=city["longitude"],
        start_hour=start_hour,
        end_hour=end_hour,
    )

    df = transform_air_quality(
        data,
        city_name=city["name"],
    )

    load_air_quality(df)


def run_incremental_pipeline():
    engine = create_database_engine()

    for city in CITIES:
        process_city_incremental(
            city=city,
            engine=engine,
        )
        

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    run_incremental_pipeline()