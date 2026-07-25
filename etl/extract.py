import requests
from config import (DEFAULT_TIMEZONE,OPEN_METEO_URL,REQUEST_TIMEOUT)

def fetch_air_quality(latitude, longitude):
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
        return data

    except requests.RequestException as error:
        print("Erreur lors de l'appel à Open-Meteo :", error)
        return None

if __name__ == "__main__":
    data = fetch_air_quality(
        34.0132,
        -6.8326,
    )

    print(data)