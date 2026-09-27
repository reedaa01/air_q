"""Public contracts. measured_at/start/end are local wall times in city.timezone."""
from datetime import datetime
from typing import Generic, TypeVar

from pydantic import BaseModel

T = TypeVar("T")


class DataResponse(BaseModel, Generic[T]):
    data: T


class City(BaseModel):
    city_name: str
    slug: str
    latitude: float
    longitude: float
    timezone: str


class Measurement(BaseModel):
    id: int
    city_name: str
    measured_at: datetime
    timezone: str
    latitude: float
    longitude: float
    pm10: float | None
    pm2_5: float | None
    carbon_monoxide: float | None
    nitrogen_dioxide: float | None
    sulphur_dioxide: float | None
    ozone: float | None
    european_aqi: int | None
    is_forecast: bool


class CitySummary(City):
    latest: Measurement | None


class SeriesResponse(BaseModel):
    city: City
    data: list[Measurement]
    start: datetime
    end: datetime
    limit: int
    offset: int
    has_more: bool
