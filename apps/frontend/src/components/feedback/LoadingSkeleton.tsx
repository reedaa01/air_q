export function LoadingSkeleton() {
  return (
    <div className="animate-pulse rounded-lg border border-border bg-surface p-5 shadow-soft">
      <div className="h-4 w-1/3 rounded bg-border" />
      <div className="mt-4 h-8 w-2/3 rounded bg-border" />
      <div className="mt-4 h-4 w-full rounded bg-border" />
      <div className="mt-2 h-4 w-5/6 rounded bg-border" />
      {/* TODO: Reuse this skeleton across loading states for map, city list, cards, and charts. */}
    </div>
  );
}
