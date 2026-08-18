import logging
import requests
from config import DEFAULT_TIMEZONE,OPEN_METEO_URL,REQUEST_TIMEOUT

logger = logging.getLogger(__name__)

def fetch_air_quality(latitude :float, longitude:float,) -> dict:
    """
    Récupère les données horaires de qualité de l'air depuis Open-Meteo.

    Args:
        latitude: Latitude du point géographique.
        longitude: Longitude du point géographique.

    Returns:
    Les données JSON sous forme de dictionnaire.

    Raises:
    ValueError: Si les coordonnées sont invalides.
    requests.RequestException: Si l'appel à Open-Meteo échoue.
    """

    if not -90 <= latitude <= 90:
        raise ValueError("La latitude doit être comprise entre -90 et 90 degrés.")

    if not -180 <= longitude <= 180:
        raise ValueError("La longitude doit être comprise entre -180 et 180 degrés.")
    
    params = {
        "latitude": latitude,
        "longitude": longitude,
        "hourly": (
            "pm10,"
            "pm2_5,"
            "carbon_monoxide,"
            "nitrogen_dioxide,"
            "sulphur_dioxide,"
            "ozone,"
            "european_aqi"
        ),
        "timezone": DEFAULT_TIMEZONE,
    }
    try:
        response = requests.get(OPEN_METEO_URL, params=params, timeout=REQUEST_TIMEOUT)
        response.raise_for_status()

        data = response.json()

        logger.info(
        "Données récupérées avec succès pour latitude=%s, longitude=%s",
        latitude,
        longitude,)
        return data

    except requests.RequestException :
        logger.exception("Erreur lors de l'appel à Open-Meteo :")
        raise

if __name__ == "__main__":
    from config import CITIES
    logging.basicConfig(level=logging.INFO)

    for city in CITIES:
        data = fetch_air_quality(
            city["latitude"],
            city["longitude"],
        )
        print(f"Ville : {city['name']}")
        print(data["hourly"].keys())