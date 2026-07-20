export function MoroccoMap() {
  return (
    <section className="min-h-[420px] rounded-lg border border-border bg-surface p-4 shadow-soft">
      <div className="flex h-full min-h-[380px] items-center justify-center rounded-md border border-dashed border-border bg-background">
        <div className="max-w-sm text-center">
          <h2 className="text-lg font-semibold">Morocco Map</h2>
          <p className="mt-2 text-sm text-muted">
            Leaflet map placeholder for city markers and station overlays.
          </p>
        </div>
      </div>
      {/* TODO: Add Leaflet map initialization, Morocco viewport bounds, city markers, and station layers. */}
    </section>
  );
}
