from config import CITIES
from etl.extract import fetch_air_quality
from etl.transform import transform_air_quality
from etl.load import load_air_quality
import sys
from datetime import datetime


def validate_date_range(start_date: str, end_date: str) -> None:
    try:
        start = datetime.strptime(start_date, "%Y-%m-%d")
        end = datetime.strptime(end_date, "%Y-%m-%d")
    except ValueError:
        raise ValueError(
            "Les dates doivent être au format YYYY-MM-DD."
        )

    if start > end:
        raise ValueError(
            "La date de début doit être antérieure ou égale à la date de fin."
        )


def run_backfill(start_date: str, end_date: str) -> None:
    """
    Exécute un backfill historique pour toutes les villes configurées.
    """
    validate_date_range(start_date, end_date)
    for city in CITIES:
        print(f"\nBackfill de la ville : {city['name']}")

        data = fetch_air_quality(
            latitude=city["latitude"],
            longitude=city["longitude"],
            start_date=start_date,
            end_date=end_date,
        )

        df = transform_air_quality(
            data,
            city_name=city["name"],
        )

        load_air_quality(df)


if __name__ == "__main__":

    if len(sys.argv) != 3:
        raise SystemExit(
            "Usage: python etl/backfill.py YYYY-MM-DD YYYY-MM-DD"
        )

    run_backfill(
        start_date=sys.argv[1],
        end_date=sys.argv[2],
    )