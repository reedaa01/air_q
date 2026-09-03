from datetime import datetime, timedelta
import pandas as pd
from unittest.mock import MagicMock

from etl.incremental import get_incremental_start, format_open_meteo_hour, get_incremental_end, get_initial_start
import etl.incremental as incremental

#test ajout 1 heure
def test_get_incremental_start_adds_one_hour():
    latest = datetime(2026, 9, 2, 14, 0)

    result = get_incremental_start(latest)

    assert result == datetime(2026, 9, 2, 15, 0)

#retourne None de get_incremental_start
def test_get_incremental_start_returns_none_when_no_latest():
    result = get_incremental_start(None)

    assert result is None

#test du format de open meteo
def test_format_open_meteo():
    dt = datetime(2026, 9, 2, 15, 0)

    result = format_open_meteo_hour(dt)

    assert result == "2026-09-02T15:00"

#test du format de open meteo retourn None
def test_format_open_meteo_hour_returns_none():
    result = format_open_meteo_hour(None)

    assert result is None


#test que get_incremenal_end retourn +4jrs
def test_get_incremental_end_returns_four_days_ahead():
    result = get_incremental_end("Africa/Casablanca")

    now = datetime.now()
    expected_date = now + timedelta(days=4)

    assert result.date() == expected_date.date()
    assert result.minute == 0
    assert result.second == 0

#test avec une date fixe
def test_get_incremental_end_with_fixed_time(monkeypatch):
    fixed_now = pd.Timestamp(
        "2026-09-02 14:37:00",
        tz="Africa/Casablanca",
    )

    monkeypatch.setattr(
        pd.Timestamp,
        "now",
        classmethod(lambda cls, tz=None: fixed_now),
    )

    result = get_incremental_end("Africa/Casablanca")

    assert result == pd.Timestamp("2026-09-06 14:00:00")


#test_run_incremental_pipeline
def test_run_incremental_pipeline(monkeypatch):
    fake_engine = MagicMock()
    fake_data = {"hourly": {"time": ["2026-09-02T18:00"]}}
    fake_df = MagicMock()

    monkeypatch.setattr(
        incremental,
        "create_database_engine",
        lambda: fake_engine,
    )

    monkeypatch.setattr(
        incremental,
        "CITIES",
        [
            {
                "name": "Rabat",
                "latitude": 34.0132,
                "longitude": -6.8326,
            }
        ],
    )

    monkeypatch.setattr(
        incremental,
        "get_latest_measurement_time",
        lambda engine, city_name: datetime(2026, 9, 2, 17, 0),
    )

    monkeypatch.setattr(
        incremental,
        "get_incremental_end",
        lambda timezone: datetime(2026, 9, 6, 18, 0),
    )

    mock_fetch = MagicMock(return_value=fake_data)
    mock_transform = MagicMock(return_value=fake_df)
    mock_load = MagicMock()

    monkeypatch.setattr(
        incremental,
        "fetch_air_quality",
        mock_fetch,
    )

    monkeypatch.setattr(
        incremental,
        "transform_air_quality",
        mock_transform,
    )

    monkeypatch.setattr(
        incremental,
        "load_air_quality",
        mock_load,
    )

    incremental.run_incremental_pipeline()

    mock_fetch.assert_called_once_with(
        latitude=34.0132,
        longitude=-6.8326,
        start_hour="2026-09-02T18:00",
        end_hour="2026-09-06T18:00",
    )

    mock_transform.assert_called_once_with(
        fake_data,
        city_name="Rabat",
    )

    mock_load.assert_called_once_with(fake_df)


#test_get_initial_start_with_fixed_time
def test_get_initial_start_with_fixed_time(monkeypatch):
    fixed_now = pd.Timestamp(
        "2026-09-03 14:37:00",
        tz="Africa/Casablanca",
    )

    monkeypatch.setattr(
        pd.Timestamp,
        "now",
        classmethod(lambda cls, tz=None: fixed_now),
    )

    result = get_initial_start(
        "Africa/Casablanca",
        lookback_days=7,
    )

    assert result == pd.Timestamp("2026-08-27 14:00:00")

#test_run_incremental_pipeline_with_no_existing_data
def test_run_incremental_pipeline_with_no_existing_data(monkeypatch):
    fake_engine = MagicMock()
    fake_data = {"hourly": {"time": ["2026-08-27T14:00"]}}
    fake_df = MagicMock()

    monkeypatch.setattr(
        incremental,
        "create_database_engine",
        lambda: fake_engine,
    )

    monkeypatch.setattr(
        incremental,
        "CITIES",
        [
            {
                "name": "Rabat",
                "latitude": 34.0132,
                "longitude": -6.8326,
            }
        ],
    )

    monkeypatch.setattr(
        incremental,
        "get_latest_measurement_time",
        lambda engine, city_name: None,
    )

    monkeypatch.setattr(
        incremental,
        "get_initial_start",
        lambda timezone, lookback_days=7: datetime(2026, 8, 27, 14, 0),
    )

    monkeypatch.setattr(
        incremental,
        "get_incremental_end",
        lambda timezone: datetime(2026, 9, 7, 14, 0),
    )

    mock_fetch = MagicMock(return_value=fake_data)
    mock_transform = MagicMock(return_value=fake_df)
    mock_load = MagicMock()

    monkeypatch.setattr(incremental, "fetch_air_quality", mock_fetch)
    monkeypatch.setattr(incremental, "transform_air_quality", mock_transform)
    monkeypatch.setattr(incremental, "load_air_quality", mock_load)

    incremental.run_incremental_pipeline()

    mock_fetch.assert_called_once_with(
        latitude=34.0132,
        longitude=-6.8326,
        start_hour="2026-08-27T14:00",
        end_hour="2026-09-07T14:00",
    )

    mock_transform.assert_called_once_with(
        fake_data,
        city_name="Rabat",
    )

    mock_load.assert_called_once_with(fake_df)
