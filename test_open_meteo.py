import requests

OPEN_METEO_URL = "https://air-quality-api.open-meteo.com/v1/air-quality"
DEFAULT_LATITUDE = 34.0132
DEFAULT_LONGITUDE = -6.8326
DEFAULT_TIMEZONE = "Africa/Casablanca"

def fetch_air_quality():
    params = {
        "latitude": DEFAULT_LATITUDE,
        "longitude": DEFAULT_LONGITUDE,
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

    response = requests.get(OPEN_METEO_URL, params=params, timeout=30)
    response.raise_for_status()

    data = response.json()
    return data

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