# Frontend checks

From `apps/frontend`:

```sh
npm install
npx playwright install chromium webkit
npm run test:e2e
```

The suite starts a separate Next.js server on port 3100 with its own `.next-e2e`
output directory. It intercepts API and map tile requests with deterministic
fixtures; it does not need or modify PostgreSQL or the backend.

Coverage:

- City selection, reload persistence, stale preferences and unavailable storage.
- Map marker changes, zoom, leaving the page and returning.
- Search with keyboard and accents, chart modes and accessible value tables.
- Clipboard success and manual copy fallback.
- City titles, social metadata and the generated PNG preview.
- Error and recovery states, unknown cities.
- Overflow checks from 320 to 1440 pixels, keyboard focus and automated
  WCAG A/AA checks on the dashboard, project page and data guide.

Projects: Chromium desktop, Chromium mobile, and WebKit with an iPhone viewport.
Mobile emulation does not replace a check on a physical phone. Automated
accessibility checks do not establish full WCAG conformance.

Screenshots and failure traces are written to the ignored `test-results/` folder.
Run a single project with `npm run test:e2e -- --project=safari-mobile`.
If using an installed Chrome, set `PLAYWRIGHT_CHROMIUM_CHANNEL=chrome`.
