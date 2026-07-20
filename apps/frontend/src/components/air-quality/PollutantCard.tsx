export function PollutantCard() {
  return (
    <article className="rounded-lg border border-border bg-surface p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted">Pollutant</p>
        <span className="rounded-md border border-border px-2 py-1 text-xs text-muted">--</span>
      </div>
      <p className="mt-3 text-3xl font-semibold">-- ug/m3</p>
      <p className="mt-3 text-sm text-muted">
        Placeholder for PM2.5, PM10, NO2, O3, SO2, or CO measurements.
      </p>
      {/* TODO: Bind pollutant type, units, thresholds, station source, and timestamp from API data. */}
    </article>
  );
}
