import requests

OPEN_METEO_URL = "https://air-quality-api.open-meteo.com/v1/air-quality"
CITIES = [
    {
    "name": "Rabat",
    "latitude": 34.0132,
    "longitude": -6.8326,
    },
    {
    "name": "Casablanca",
    "latitude": 33.5731,
    "longitude": -7.5898,
    }   
]
DEFAULT_TIMEZONE = "Africa/Casablanca"
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
        response = requests.get(OPEN_METEO_URL, params=params, timeout=30)
        response.raise_for_status()

        data = response.json()
        return data

    except requests.RequestException as error:
        print("Erreur lors de l'appel à Open-Meteo :", error)
        return None


def display_first_measurement(city, data):

    print("Ville :", city)
    print("Latitude :", data["latitude"])
    print("Longitude :", data["longitude"])
    print("Timezone :", data["timezone"])

    print("\nPremière mesure disponible :")
    print("Date :", data["hourly"]["time"][0])
    print("PM10 :", data["hourly"]["pm10"][0])
    print("PM2.5 :", data["hourly"]["pm2_5"][0])
    print("NO2 :", data["hourly"]["nitrogen_dioxide"][0])
    print("Ozone :", data["hourly"]["ozone"][0])
    print("AQI européen :", data["hourly"]["european_aqi"][0])


def main():
    for city in CITIES:

        data = fetch_air_quality(city["latitude"], city["longitude"] )

    if data is None:
        return

    display_first_measurement(
        city["name"],
        data,
    )


if __name__ == "__main__":
    main()