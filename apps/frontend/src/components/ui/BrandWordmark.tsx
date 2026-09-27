export function BrandWordmark({ hero = false, symbol = false }: { hero?: boolean; symbol?: boolean }) {
  return (
    <span className={`brand-wordmark${hero ? " brand-wordmark-hero" : ""}`} dir="ltr">
      {(symbol || hero) && (
        <svg className="brand-symbol" viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <path d="M8 39 22.2 9.8a2 2 0 0 1 3.6 0L40 39" />
          <path d="M7 30c10-9 24 7 34-2" />
        </svg>
      )}
      <span className="brand-latin">Aeris</span>
    </span>
  );
}
