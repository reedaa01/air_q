"""API contract tests without a production database."""
from collections.abc import Iterator
from datetime import datetime, timedelta
from unittest.mock import MagicMock
from zoneinfo import ZoneInfo

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.exc import OperationalError

from app import repository
from app.database import get_connection
from app.main import create_app
from app.schemas import City, Measurement

CITY = City(city_name="Fes", slug="fes", latitude=34, longitude=-5, timezone="Africa/Casablanca")
EMPTY_CITY = City(city_name="Rabat", slug="rabat", latitude=34.01, longitude=-6.83, timezone="Africa/Casablanca")
READING = Measurement(
    id=7, city_name="Fes", measured_at=datetime(2026, 9, 6),
    timezone="Africa/Casablanca", latitude=34, longitude=-5,
    european_aqi=None, pm2_5=0, pm10=None, nitrogen_dioxide=4.1,
    ozone=10, sulphur_dioxide=None, carbon_monoxide=None, is_forecast=False,
)


@pytest.fixture
def series(monkeypatch: pytest.MonkeyPatch) -> MagicMock:
    mock = MagicMock(return_value=[])
    monkeypatch.setattr(repository, "measurement_series", mock)
    return mock


@pytest.fixture
def client(monkeypatch: pytest.MonkeyPatch, series: MagicMock) -> Iterator[TestClient]:
    monkeypatch.setattr(repository, "list_cities", lambda connection: [CITY, EMPTY_CITY])
    monkeypatch.setattr(repository, "latest_measurements",
                        lambda connection, city_name=None: [READING] if city_name in (None, "Fes") else [])
    app = create_app()
    app.dependency_overrides[get_connection] = lambda: MagicMock()
    # Test just the routes; health tests separately exercise the real app lifespan.
    test_client = TestClient(app)
    yield test_client
    test_client.close()


def test_latest_preserves_nulls_zero_and_local_time(client: TestClient):
    response = client.get("/api/v1/air-quality/latest")
    assert response.status_code == 200
    cities = response.json()["data"]
    assert len(cities) == 2
    row = cities[0]["latest"]
    assert row["european_aqi"] is None
    assert row["pm2_5"] == 0
    assert row["measured_at"] == "2026-09-06T00:00:00"
    assert row["timezone"] == "Africa/Casablanca"
    assert cities[1]["latest"] is None


def test_city_search_handles_accents(client: TestClient):
    assert client.get("/api/v1/cities?q=Fès").json()["data"] == [CITY.model_dump()]


def test_known_city_without_history(client: TestClient):
    assert client.get("/api/v1/cities/rabat/latest").json() == {"data": None}
    assert client.get("/api/v1/cities/rabat/history").json()["data"] == []


@pytest.mark.parametrize("suffix", ["", "/latest", "/history", "/forecast"])
def test_unknown_city(client: TestClient, suffix: str):
    assert client.get("/api/v1/cities/missing" + suffix).status_code == 404


def test_history_anchors_to_available_data(client: TestClient, series: MagicMock):
    series.return_value = [READING]
    response = client.get("/api/v1/cities/fes/history?hours=24")
    assert response.status_code == 200
    data = response.json()
    assert data["start"] == "2026-09-05T01:00:00"
    assert data["end"] == "2026-09-06T01:00:00"
    assert data["data"][-1]["measured_at"] == "2026-09-06T00:00:00"
    assert series.call_args.kwargs["forecast"] is False


@pytest.mark.parametrize("query", [
    "hours=0", "hours=745", "limit=0", "limit=5001", "offset=-1",
    "start=2026-09-01T00:00:00",
    "start=2026-09-02T00:00:00&end=2026-09-01T00:00:00",
    "start=2026-07-01T00:00:00&end=2026-09-01T00:00:00",
    "start=2026-09-01T00:00:00Z&end=2026-09-02T00:00:00Z",
])
def test_invalid_history_range(client: TestClient, series: MagicMock, query: str):
    assert client.get("/api/v1/cities/fes/history?" + query).status_code == 422
    series.assert_not_called()


def test_history_pagination(client: TestClient, series: MagicMock):
    series.return_value = [READING, READING.model_copy(update={"id": 8})]
    response = client.get("/api/v1/cities/fes/history?limit=1&offset=2")
    assert response.status_code == 200
    data = response.json()
    assert len(data["data"]) == 1
    assert data["has_more"] is True
    assert data["offset"] == 2
    assert series.call_args.kwargs["offset"] == 2


def test_forecast_uses_future_window(client: TestClient, series: MagicMock):
    before = datetime.now(ZoneInfo(CITY.timezone)).replace(tzinfo=None)
    response = client.get("/api/v1/cities/fes/forecast?hours=48")
    assert response.status_code == 200
    payload = response.json()
    assert payload["data"] == []
    start = datetime.fromisoformat(payload["start"])
    end = datetime.fromisoformat(payload["end"])
    assert before <= start
    assert end - start == timedelta(hours=48)
    assert series.call_args.kwargs["forecast"] is True


def test_unavailable_database_is_sanitized(client: TestClient, monkeypatch: pytest.MonkeyPatch, caplog):
    def unavailable(connection):
        raise OperationalError("SELECT", None, Exception("private_password@private_host"))
    monkeypatch.setattr(repository, "list_cities", unavailable)
    response = client.get("/api/v1/air-quality/latest")
    assert response.status_code == 503
    assert response.json() == {"detail": "Database unavailable"}
    assert "private_password" not in response.text + caplog.text


def test_write_method_is_not_available(client: TestClient):
    assert client.post("/api/v1/cities").status_code == 405
