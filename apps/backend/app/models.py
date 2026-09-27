"""SQLAlchemy Core mapping of the existing table; never used to create it."""
from sqlalchemy import BigInteger, Boolean, Column, DateTime, Float, Integer, MetaData, String, Table

metadata = MetaData()
measurements = Table(
    "air_quality_measurements", metadata,
    Column("id", BigInteger, primary_key=True),
    Column("city_name", String(100), nullable=False),
    Column("measured_at", DateTime(timezone=False), nullable=False),
    Column("pm10", Float), Column("pm2_5", Float),
    Column("carbon_monoxide", Float), Column("nitrogen_dioxide", Float),
    Column("sulphur_dioxide", Float), Column("ozone", Float),
    Column("european_aqi", Integer),
    Column("latitude", Float, nullable=False),
    Column("longitude", Float, nullable=False),
    Column("timezone", String(100), nullable=False),
    Column("is_forecast", Boolean, nullable=False),
)
