import pandas as pd


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

MEASUREMENT_COLUMNS = [
    "pm10",
    "pm2_5",
    "carbon_monoxide",
    "nitrogen_dioxide",
    "sulphur_dioxide",
    "ozone",
    "european_aqi",
]


def transform_air_quality(data: dict) -> pd.DataFrame:
    """
    Transforme la réponse JSON Open-Meteo en DataFrame pandas.

    Les lignes ne contenant aucune mesure de qualité de l'air
    sont supprimées.
    """

    if not data:
        raise ValueError("Les données reçues sont vides.")

    if "hourly" not in data:
        raise KeyError(
            "La clé 'hourly' est absente des données Open-Meteo."
        )

    hourly_data = data["hourly"]

    if not hourly_data:
        raise ValueError("Les données horaires sont vides.")

    # Création du DataFrame
    df = pd.DataFrame(hourly_data)

    missing_columns = REQUIRED_COLUMNS - set(df.columns)

    if missing_columns:
        raise ValueError(
            "Les colonnes suivantes sont manquantes dans les données "
            f"Open-Meteo : {sorted(missing_columns)}"
        )

    # Conversion et renommage de la colonne temporelle
    df["time"] = pd.to_datetime(df["time"])
    df = df.rename(columns={"time": "measured_at"})

    # Suppression des lignes où toutes les mesures sont nulles
    df = df.dropna(
        subset=MEASUREMENT_COLUMNS,
        how="all",
    ).copy()

    # Ajout des métadonnées
    df["latitude"] = data["latitude"]
    df["longitude"] = data["longitude"]
    df["timezone"] = data["timezone"]

    print("Nombre total de lignes :", len(df))

    print(
    "Lignes complètement vides :",
    df[MEASUREMENT_COLUMNS].isna().all(axis=1).sum(),
)

    return df


if __name__ == "__main__":
    from etl.extract import fetch_air_quality

    data = fetch_air_quality(
        latitude=34.0132,
        longitude=-6.8326,
    )

    df = transform_air_quality(data)

    print(df.head())
    print(df.shape)
    print(df.dtypes)