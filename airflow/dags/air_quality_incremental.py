from datetime import timedelta

import pendulum
from airflow.sdk import dag, task

from config import CITIES
from etl.incremental import process_city_incremental
from etl.load import create_database_engine

@dag(
    dag_id="air_quality_incremental",
    schedule="@hourly",
    start_date=pendulum.datetime(
        2026, 9, 1, tz="Africa/Casablanca"
    ),
    catchup=False,
    max_active_runs=1,
    tags=["air-quality", "incremental"],
)

def air_quality_incremental():
    @task(
        retries=3,
        retry_delay=timedelta(minutes=2),
        execution_timeout=timedelta(minutes=10),
        max_active_tis_per_dag=2,
    )
    def process_city(city: dict):
        engine = create_database_engine()

        process_city_incremental(
            city=city,
            engine=engine,
        )

    process_city.expand(city=CITIES)

air_quality_incremental()