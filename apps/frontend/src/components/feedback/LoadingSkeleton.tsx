export function LoadingSkeleton() {
  return (
    <div className="loading-skeleton" role="status">
      <span className="sr-only">Chargement des données collectées…</span>
      <div className="skeleton-line short" />
      <div className="skeleton-line title" />
      <div className="skeleton-body">
        <div className="skeleton-circle" />
        <div>
          <div className="skeleton-line" />
          <div className="skeleton-line short" />
        </div>
      </div>
      <div className="skeleton-line" />
    </div>
  );
}
