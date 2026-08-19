from datetime import timedelta

def get_incremental_start(latest_measurement):
    """
    Calcule l'heure à partir de laquelle reprendre l'ingestion.

    Retourne None si aucune mesure n'existe encore pour la ville.
    """

    if latest_measurement is None:
        return None
    return latest_measurement + timedelta(hours=1)