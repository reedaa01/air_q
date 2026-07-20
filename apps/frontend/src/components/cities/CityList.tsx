import Link from "next/link";

const placeholderCities = ["Casablanca", "Rabat", "Marrakesh", "Tangier"];

export function CityList() {
  return (
    <section className="rounded-lg border border-border bg-surface p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Cities</h2>
        <span className="text-sm text-muted">Placeholder</span>
      </div>
      <ul className="mt-4 divide-y divide-border">
        {placeholderCities.map((city) => (
          <li key={city}>
            <Link
              href={`/cities/${city.toLowerCase()}`}
              className="flex items-center justify-between py-3 text-sm transition hover:text-primary"
            >
              <span>{city}</span>
              <span className="text-muted">AQI --</span>
            </Link>
          </li>
        ))}
      </ul>
      {/* TODO: Replace placeholder city names with ranked city summaries from the API client. */}
    </section>
  );
}
