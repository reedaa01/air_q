from datetime import timedelta
import pandas as pd

from etl.load import create_database_engine, get_latest_measurement_time, load_air_quality
from etl.extract import fetch_air_quality
from etl.transform import transform_air_quality
from config import CITIES, DEFAULT_TIMEZONE

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

def get_incremental_end(timezone: str):
    """
    Calcule l'heure de fin de la fenêtre incrémentale.
    """
    current_time = pd.Timestamp.now(tz=timezone).floor("h").tz_localize(None)
    return current_time + timedelta(days=4)



if __name__ == "__main__":
    engine = create_database_engine()

    for city in CITIES:
        print(f"\nTraitement incrémental : {city['name']}")

        latest = get_latest_measurement_time(
            engine,
            city["name"],
        )

        start = get_incremental_start(latest)
        end = get_incremental_end(DEFAULT_TIMEZONE)

        start_hour = format_open_meteo_hour(start)
        end_hour = format_open_meteo_hour(end)

        print("Dernière mesure :", latest)
        print("start_hour :", start_hour)
        print("end_hour :", end_hour)

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