import pandas as pd


def load_air_quality(df: pd.DataFrame) -> None:
    """
    Charge les données transformées de qualité de l'air.
    """
    if df.empty:
        raise ValueError("Le DataFrame a charger est vide.")

    print("Données pretes a etre chargées.")
    print(f"Nombre de lignes : {len(df)}")

if __name__ == "__main__":
    from etl.extract import fetch_air_quality
    from etl.transform import transform_air_quality

    data = fetch_air_quality(
        latitude=34.0132,
        longitude=-6.8326,
    )

    df = transform_air_quality(data)

    load_air_quality(df)