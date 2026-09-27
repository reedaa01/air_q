"""Synchronous database connections; no schema management or ETL imports."""

from collections.abc import Iterator
from typing import Annotated, cast

from fastapi import Depends, Request
from sqlalchemy import create_engine
from sqlalchemy.engine import Connection, Engine, URL

from app.config import Settings


def create_database_engine(settings: Settings) -> Engine:
    url = URL.create(
        drivername="postgresql+psycopg2",
        username=settings.postgres_user,
        password=settings.postgres_password.get_secret_value(),
        host=settings.postgres_host,
        port=settings.postgres_port,
        database=settings.postgres_db,
    )
    # Engine construction is lazy: PostgreSQL is contacted only on connection.
    return create_engine(
        url,
        pool_pre_ping=True,
        pool_timeout=settings.postgres_connect_timeout,
        connect_args={
            "connect_timeout": settings.postgres_connect_timeout,
            "options": "-c default_transaction_read_only=on -c statement_timeout=5000",
        },
    )


def get_engine(request: Request) -> Engine:
    return cast(Engine, request.app.state.engine)


def get_connection(engine: Annotated[Engine, Depends(get_engine)]) -> Iterator[Connection]:
    with engine.connect() as connection:
        yield connection
