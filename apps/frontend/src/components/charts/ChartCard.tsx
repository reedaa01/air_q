export function ChartCard() {
  return (
    <section className="rounded-lg border border-border bg-surface p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Pollutant Trends</h2>
        <span className="text-sm text-muted">Recharts placeholder</span>
      </div>
      <div className="mt-5 flex h-64 items-center justify-center rounded-md border border-dashed border-border bg-background">
        <p className="text-sm text-muted">Chart area pending data model</p>
      </div>
      {/* TODO: Add Recharts visualization once time-series contracts and pollutant metrics are defined. */}
    </section>
  );
}
