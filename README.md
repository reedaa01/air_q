# Morocco Air Quality Platform

Morocco-focused air-quality platform with:

- A functional Python ETL pipeline (extract, transform, load)
- PostgreSQL storage with upsert behavior
- Docker and Docker Compose for local orchestration
- GitHub Actions CI for test, image build, security scan, and image publish
- A Next.js frontend currently in UI scaffold mode

## Current Status

Implemented now:

- ETL code in `etl/`
- PostgreSQL schema in `sql/create_tables.sql`
- Containerization in `Dockerfile` and `docker-compose.yml`
- CI workflow in `.github/workflows/ci.yml`

Still scaffold / TODO:

- Frontend API integration (`apps/frontend/src/lib/api/client.ts`)
- Frontend data hooks (`apps/frontend/src/hooks/useAirQuality.ts`)
- Backend service implementation in `apps/backend/`

## Repository Structure

```text
apps/
  backend/                    Backend reference folder
  frontend/                   Next.js App Router frontend
config.py                     ETL constants and city list
docker-compose.yml            Local postgres + etl services
Dockerfile                    ETL container image
etl/
  extract.py                  Open-Meteo ingestion
  transform.py                Data cleaning and shaping
  load.py                     PostgreSQL load with upsert
  incremental.py              Incremental ingestion flow
  backfill.py                 Historical backfill flow
sql/
  create_tables.sql           Database schema bootstrap
.github/workflows/ci.yml      CI/CD workflow
requirements.txt              Python dependencies
test_open_meteo.py            ETL API test script
```

## Data Flow

1. Extract hourly AQI/pollutants from Open-Meteo for configured cities.
2. Transform API payload into tabular records and flag forecast rows.
3. Load into PostgreSQL table `air_quality_measurements`.
4. Upsert on unique key `(measured_at, latitude, longitude)`.

## Prerequisites

- Docker Desktop (or Docker Engine + Compose)
- Python 3.12 (for local non-container ETL runs)
- Node.js 20+ (for frontend)

## Environment Setup

Create `.env` in project root from `.env.example`:

```env
POSTGRES_DB=air_quality_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=change_me
```

Optional runtime overrides used by ETL:

- `POSTGRES_HOST` (defaults to `localhost` locally, `postgres` in compose)
- `POSTGRES_PORT` (defaults to `5432`)

## Local Run (Docker Compose)

Starts PostgreSQL and ETL service:

```powershell
docker compose up --build
```

What happens:

- Postgres starts on host port `5433`
- SQL init script is executed from `sql/`
- ETL container runs `python -m etl.load`

Stop services:

```powershell
docker compose down
```

Reset database volume:

```powershell
docker compose down -v
```

## Local Run (Python Direct)

Install dependencies:

```powershell
pip install -r requirements.txt
```

Run default ETL load:

```powershell
python -m etl.load
```

Run incremental ingestion:

```powershell
python -m etl.incremental
```

Run historical backfill:

```powershell
python etl/backfill.py 2026-01-01 2026-01-31
```

Run API test script:

```powershell
python test_open_meteo.py
```

## Frontend (Scaffold)

```powershell
cd apps/frontend
npm install
npm run dev
```

Frontend currently uses placeholder data in several components and pages. API wiring is pending.

## CI/CD Workflow

GitHub Actions workflow in `.github/workflows/ci.yml` runs:

1. Python dependency install + compile check + ETL test
2. Docker image build for ETL
3. Trivy image scan
4. Publish image to GHCR

Published image tags:

- `ghcr.io/<owner>/air-quality-etl:<commit_sha>`
- `ghcr.io/<owner>/air-quality-etl:latest`

## Notes for DevOps and Data Engineering Collaboration

Typical ownership split:

- DevOps: CI/CD, container hardening, scheduling, observability, secrets management
- Data Engineer: source quality, transformation correctness, schema evolution, data checks

Shared decisions:

- ETL schedule and SLA
- Alerting rules for ingestion failures
- Data freshness and incident response process
