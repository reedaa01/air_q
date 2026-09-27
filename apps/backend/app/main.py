"""Application entry point: uvicorn app.main:app."""

import logging
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from sqlalchemy.exc import SQLAlchemyError

from app.config import get_settings
from app.database import create_database_engine
from app.routers.health import router as health_router
from app.routers.air_quality import router as air_quality_router

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    settings = get_settings()
    logging.basicConfig(
        level=settings.log_level,
        format="%(asctime)s %(levelname)s %(name)s %(message)s",
    )
    engine = create_database_engine(settings)
    app.state.engine = engine
    logger.info("Backend started")
    try:
        yield
    finally:
        engine.dispose()
        logger.info("Backend stopped")


def create_app() -> FastAPI:
    app = FastAPI(title="Morocco Air Quality API", version="0.1.0", lifespan=lifespan)
    app.include_router(health_router)
    app.include_router(air_quality_router)

    @app.exception_handler(SQLAlchemyError)
    async def database_unavailable(request: Request, exc: SQLAlchemyError) -> JSONResponse:
        logger.warning("Database request failed", extra={"path": request.url.path})
        return JSONResponse(status_code=503, content={"detail": "Database unavailable"})

    return app


app = create_app()
