"""V1 read API for city metadata, stored history and future forecasts."""
from datetime import datetime, timedelta
from typing import Annotated
from zoneinfo import ZoneInfo

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.engine import Connection

from app import repository
from app.database import get_connection
from app.schemas import City, CitySummary, DataResponse, Measurement, SeriesResponse

router = APIRouter(prefix="/api/v1", tags=["air quality"])
Database = Annotated[Connection, Depends(get_connection)]


def resolve_city(connection: Connection, slug: str) -> City:
    city = next((city for city in repository.list_cities(connection) if city.slug == slug), None)
    if city is None:
        raise HTTPException(status_code=404, detail="City not found")
    return city


@router.get("/cities", response_model=DataResponse[list[City]])
def cities(connection: Database, q: str = Query(default="", max_length=100)):
    items = repository.list_cities(connection)
    if q:
        query = repository.city_slug(q)
        items = [city for city in items if query in city.slug]
    return DataResponse(data=items)


@router.get("/cities/{city_slug}", response_model=DataResponse[City])
def city_detail(city_slug: str, connection: Database):
    return DataResponse(data=resolve_city(connection, city_slug))


@router.get("/air-quality/latest", response_model=DataResponse[list[CitySummary]])
def latest_all(connection: Database):
    items = repository.list_cities(connection)
    latest = {row.city_name: row for row in repository.latest_measurements(connection)}
    return DataResponse(data=[
        CitySummary(**city.model_dump(), latest=latest.get(city.city_name)) for city in items
    ])


@router.get("/cities/{city_slug}/latest", response_model=DataResponse[Measurement | None])
def latest_city(city_slug: str, connection: Database):
    city = resolve_city(connection, city_slug)
    items = repository.latest_measurements(connection, city.city_name)
    return DataResponse(data=items[0] if items else None)


@router.get("/cities/{city_slug}/history", response_model=SeriesResponse)
def history(
    city_slug: str, connection: Database,
    hours: int = Query(default=24, ge=1, le=744),
    start: datetime | None = None,
    end: datetime | None = None,
    limit: int = Query(default=1000, ge=1, le=5000),
    offset: int = Query(default=0, ge=0, le=100000),
) -> SeriesResponse:
    city = resolve_city(connection, city_slug)
    if (start is None) != (end is None):
        raise HTTPException(status_code=422, detail="Provide both start and end")
    if start is None and end is None:
        latest = repository.latest_measurements(connection, city.city_name)
        if latest:
            # Anchor to available data, including the latest hour, even if ingestion is stale.
            end = latest[0].measured_at + timedelta(hours=1)
        else:
            end = datetime.now(ZoneInfo(city.timezone)).replace(tzinfo=None)
        start = end - timedelta(hours=hours)
    assert start is not None and end is not None
    if start.tzinfo is not None or end.tzinfo is not None:
        raise HTTPException(status_code=422, detail="Use local timestamps without an offset, in the city timezone")
    if not timedelta(0) < end - start <= timedelta(days=31):
        raise HTTPException(status_code=422, detail="The range must be positive and at most 31 days")
    rows = repository.measurement_series(
        connection, city.city_name, start, end, forecast=False, limit=limit, offset=offset
    )
    return SeriesResponse(
        city=city, data=rows[:limit], start=start, end=end,
        limit=limit, offset=offset, has_more=len(rows) > limit,
    )


@router.get("/cities/{city_slug}/forecast", response_model=SeriesResponse)
def forecast(
    city_slug: str, connection: Database, hours: int = Query(default=96, ge=1, le=96),
) -> SeriesResponse:
    city = resolve_city(connection, city_slug)
    start = datetime.now(ZoneInfo(city.timezone)).replace(tzinfo=None)
    end = start + timedelta(hours=hours)
    rows = repository.measurement_series(
        connection, city.city_name, start, end, forecast=True, limit=1000
    )
    return SeriesResponse(
        city=city, data=rows[:1000], start=start, end=end,
        limit=1000, offset=0, has_more=len(rows) > 1000,
    )
