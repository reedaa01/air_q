import pandas as pd

# est une "set"
REQUIRED_COLUMNS = {
    "time",
    "pm10",
    "pm2_5",
    "carbon_monoxide",
    "nitrogen_dioxide",
    "sulphur_dioxide",
    "ozone",
    "european_aqi",
}

def transform_air_quality(data:dict) -> pd.DataFrame:
    """
    Transforme la réponse JSON Open-Meteo en DataFrame pandas.
    """

    if not data:
        raise ValueError("Les données recues sont vides.")
    if "hourly" not in data:
        raise KeyError ("La clé 'hourly' est absente des données Open-Meteo.")

    hourly_data = data["hourly"]

    if not hourly_data:
        raise ValueError("Les données horaires sont vides.")
    
    #creation du dataframe
    df = pd.DataFrame(hourly_data)
    
    missing_columns = REQUIRED_COLUMNS - set(df.columns)

    if missing_columns:
        raise ValueError(f"Les colonnes suivantes sont manquantes dans les données Open-Meteo : {sorted(missing_columns)}")

    df["time"] = pd.to_datetime(df["time"])
    df = df.rename(columns={"time": "measured_at"})
    df["latitude"] = data["latitude"]
    df["longitude"] = data["longitude"]
    df["timezone"] = data["timezone"]

    return df
    
if __name__ == "__main__":
    from etl.extract import fetch_air_quality
    
    data = fetch_air_quality(
        latitude=34.0132,  # Latitude Rabat
        longitude=-6.8326,  # Longitude Rabat        
    )

    df = transform_air_quality(data)


    print(df.head())
    print(df.shape)
    print(df.dtypes)

