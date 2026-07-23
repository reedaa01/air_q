import requests

url = "https://air-quality-api.open-meteo.com/v1/air-quality"

params = {
    "latitude": 34.0132,
    "longitude": -6.8326,
    "hourly": (
        "pm10,"
        "pm2_5,"
        "carbon_monoxide,"
        "nitrogen_dioxide,"
        "sulphur_dioxide,"
        "ozone,"
        "european_aqi"
    ),
    "timezone": "Africa/Casablanca",
}

response = requests.get(url, params=params, timeout=30)
response.raise_for_status()

data = response.json()

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