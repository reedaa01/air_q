type ErrorStateProps = {
  title?: string;
  message?: string;
};

export function ErrorState({
  title = "Unable to load data",
  message = "A placeholder error state for future API failures.",
}: ErrorStateProps) {
  return (
    <div className="rounded-lg border border-border bg-surface p-5 shadow-soft">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-muted">{message}</p>
      {/* TODO: Add retry actions, error codes, and support links once API behavior is defined. */}
    </div>
  );
}
