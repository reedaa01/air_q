# Frontend API contract

The dashboard reads `/api/v1/air-quality/latest` and the selected city's
`history?hours=24|168` or `forecast?hours=96`. React Query refreshes these
read-only requests every minute and cancels requests for obsolete selections.

Next.js forwards GET requests to `BACKEND_URL` on the server. The browser never
receives database credentials. Requests are uncached at the HTTP layer.
The API contract and startup commands are documented in `apps/backend/README.md`.

There is no demo fallback. Empty tables, null values, unavailable services, and
missing forecast periods have explicit UI states. All displayed measurement
timestamps are local to the returned city timezone, not the browser timezone.
