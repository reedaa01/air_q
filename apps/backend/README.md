# Backend API — Air Quality Morocco

Python 3.12, FastAPI, SQLAlchemy 2, PostgreSQL. The API only reads the existing
`air_quality_measurements` table. No migrations, table creation, ETL imports, or
Open-Meteo requests are performed.

## Local startup

From `apps/backend`:

```bash
python3.12 -m venv .venv
source .venv/bin/activate
python -m pip install ".[test]"
python -m uvicorn app.main:app --env-file ../../.env --host 127.0.0.1 --port 8000
```

This reuses the repository's PostgreSQL environment variables. For a standalone
installation, copy `.env.example` to `.env`, supply credentials, and omit
`--env-file ../../.env`. PostgreSQL must be running on the configured host/port.
No credentials belong in the frontend environment.

The frontend uses a GET-only, same-origin proxy at `/api/v1/*` and forwards to
`BACKEND_URL` (default `http://127.0.0.1:8000`). Start it with `npm run dev`
from `apps/frontend`. No CORS configuration is needed for this arrangement.

## Contract

- `GET /health/live`: process liveness.
- `GET /health/ready`: lightweight `SELECT 1`.
- `GET /api/v1/cities?q=`: cities found in the database.
- `GET /api/v1/cities/{slug}`: metadata; unknown city is 404.
- `GET /api/v1/air-quality/latest`: metadata and latest historical row per city.
- `GET /api/v1/cities/{slug}/latest`: latest historical row or `data: null`.
- `GET /api/v1/cities/{slug}/history?hours=24`: up to 31 days; supports
  `start` and `end` together, `limit` (1–5000), and `offset`.
- `GET /api/v1/cities/{slug}/forecast?hours=96`: 1–96 hours into the future.

History defaults to the requested number of hours ending immediately after the
latest stored historical hour, so old datasets remain explorable. Responses
include the exact requested `start` (inclusive), `end` (exclusive), and
`has_more`. Results are ascending by measurement time. If several coordinates
exist for the same city/hour, the row with the largest ID is used consistently.

`measured_at`, `start` and `end` are **local timestamps without UTC offsets**,
interpreted in the returned `timezone`. Offset-bearing query timestamps are
rejected. Null pollutant/AQI values are preserved. Historical queries require
`is_forecast = false` and a past timestamp; forecasts require
`is_forecast = true` and a future timestamp. Expired forecasts never become
history just because time passes. `created_at` is not used as freshness metadata.

Connections request PostgreSQL read-only transactions with a five-second
statement timeout. The API cannot mutate data through its routes.
Database failures return a sanitized 503 without connection details.
Use a SELECT-only database account when deploying; account provisioning is
separate from this API and is never performed at startup.

## Tests

```bash
python -m pytest -q
```

Unit tests do not require PostgreSQL. They cover null and zero values, local
timestamps, historical windows, pagination, missing cities, empty forecasts,
and sanitized database failures. Health tests also cover startup and shutdown.
