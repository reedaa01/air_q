export function AQICard() {
  return (
    <article className="rounded-lg border border-border bg-surface p-5 shadow-soft">
      <p className="text-sm font-medium text-muted">Current AQI</p>
      <div className="mt-3 flex items-end gap-3">
        <span className="text-5xl font-semibold">--</span>
        <span className="pb-2 text-sm text-muted">Awaiting data</span>
      </div>
      <p className="mt-4 text-sm text-muted">
        Placeholder for latest air quality index summary.
      </p>
      {/* TODO: Connect to normalized AQI readings from the data API and display category color. */}
    </article>
  );
}
