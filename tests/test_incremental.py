from datetime import datetime, timedelta
import pandas as pd

from etl.incremental import get_incremental_start, format_open_meteo_hour, get_incremental_end

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