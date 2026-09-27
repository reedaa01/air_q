from collections.abc import Iterator
from unittest.mock import MagicMock

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.engine import Engine
from sqlalchemy.exc import OperationalError

from app import main
from app.config import Settings


@pytest.fixture
def engine() -> MagicMock:
    return MagicMock(spec=Engine)


@pytest.fixture
def client(monkeypatch: pytest.MonkeyPatch, engine: MagicMock) -> Iterator[TestClient]:
    # Explicit values and no dotenv loading keep tests isolated from real credentials.
    settings = Settings(
        _env_file=None,
        postgres_host="database.invalid",
        postgres_port=5432,
        postgres_db="test_database",
        postgres_user="test_user",
        postgres_password="test_password",
        postgres_connect_timeout=1,
        log_level="INFO",
    )
    monkeypatch.setattr(main, "get_settings", lambda: settings)
    monkeypatch.setattr(main, "create_database_engine", lambda settings: engine)
    with TestClient(main.create_app()) as test_client:
        yield test_client
    engine.dispose.assert_called_once_with()


def test_live_does_not_connect_to_database(client: TestClient, engine: MagicMock) -> None:
    engine.connect.side_effect = OperationalError(None, None, Exception("offline"))

    response = client.get("/health/live")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
    engine.connect.assert_not_called()


def test_ready_when_database_is_reachable(client: TestClient, engine: MagicMock) -> None:
    connection = engine.connect.return_value.__enter__.return_value
    connection.execute.return_value.scalar_one.return_value = 1

    response = client.get("/health/ready")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
    engine.connect.assert_called_once_with()
    connection.execute.assert_called_once()
    assert str(connection.execute.call_args.args[0]) == "SELECT 1"
    engine.connect.return_value.__exit__.assert_called_once()


@pytest.mark.parametrize("failure_point", ["connect", "execute"])
def test_ready_when_database_is_unavailable(
    client: TestClient,
    engine: MagicMock,
    caplog: pytest.LogCaptureFixture,
    failure_point: str,
) -> None:
    secret = "postgresql://private_user:private_password@private_host/private_db"
    error = OperationalError("SELECT 1", None, Exception(secret))
    if failure_point == "connect":
        engine.connect.side_effect = error
    else:
        connection = engine.connect.return_value.__enter__.return_value
        connection.execute.side_effect = error

    response = client.get("/health/ready")

    assert response.status_code == 503
    assert response.json() == {"status": "unavailable"}
    assert "Database readiness check failed" in caplog.text
    for sensitive_value in (secret, "private_user", "private_password", "OperationalError"):
        assert sensitive_value not in response.text
        assert sensitive_value not in caplog.text
    if failure_point == "execute":
        engine.connect.return_value.__exit__.assert_called_once()

    # A failed readiness probe must not affect process liveness.
    assert client.get("/health/live").json() == {"status": "ok"}
