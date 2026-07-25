OPEN_METEO_URL = "https://air-quality-api.open-meteo.com/v1/air-quality"
DEFAULT_TIMEZONE = "Africa/Casablanca"
REQUEST_TIMEOUT = 10
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
    },
]

if __name__ == "__main__":
    data = fetch_air_quality(
        34.0132,
        -6.8326,
    )

    print(data)