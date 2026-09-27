"""Parameterized, read-only queries against PostgreSQL."""
import re
import unicodedata
from datetime import datetime

from sqlalchemy import func, select
from sqlalchemy.engine import Connection

from app.models import measurements as m
from app.schemas import City, Measurement


def city_slug(name: str) -> str:
    ascii_name = unicodedata.normalize("NFKD", name).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]+", "-", ascii_name.lower()).strip("-")


def list_cities(connection: Connection) -> list[City]:
    # Metadata comes from the most recent stored row, including forecast-only cities.
    query = (
        select(m.c.city_name, m.c.latitude, m.c.longitude, m.c.timezone)
        .distinct(m.c.city_name)
        .order_by(m.c.city_name, m.c.measured_at.desc(), m.c.id.desc())
    )
    return [City(**row, slug=city_slug(row["city_name"]))
            for row in connection.execute(query).mappings()]


def latest_measurements(connection: Connection, city_name: str | None = None) -> list[Measurement]:
    query = select(m).where(
        m.c.is_forecast.is_(False),
        m.c.measured_at <= func.timezone(m.c.timezone, func.now()),
    )
    if city_name is not None:
        query = query.where(m.c.city_name == city_name)
    query = query.distinct(m.c.city_name).order_by(
        m.c.city_name, m.c.measured_at.desc(), m.c.id.desc()
    )
    return [Measurement.model_validate(row)
            for row in connection.execute(query).mappings()]


def measurement_series(
    connection: Connection, city_name: str, start: datetime, end: datetime,
    *, forecast: bool, limit: int, offset: int = 0,
) -> list[Measurement]:
    local_now = func.timezone(m.c.timezone, func.now())
    query = (
        select(m)
        .where(
            m.c.city_name == city_name,
            m.c.is_forecast.is_(forecast),
            m.c.measured_at >= start,
            m.c.measured_at < end,
            m.c.measured_at > local_now if forecast else m.c.measured_at <= local_now,
        )
        # Multiple grid coordinates may exist for a city/hour. Pick a stable row.
        .distinct(m.c.measured_at)
        .order_by(m.c.measured_at, m.c.id.desc())
        .offset(offset)
        .limit(limit + 1)
    )
    return [Measurement.model_validate(row)
            for row in connection.execute(query).mappings()]
