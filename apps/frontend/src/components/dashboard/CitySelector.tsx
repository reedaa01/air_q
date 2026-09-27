"use client";
import { SearchBar } from "@/components/search/SearchBar";
import type { City } from "@/types/city";
export function CitySelector({
  cities,
  selected,
  onSelect,
}: {
  cities: City[];
  selected: string;
  onSelect: (city: City) => void;
}) {
  return (
    <section className="city-selector" aria-label="Choisir une ville">
      <div className="selector-heading">
        <div>
          <span className="eyebrow">L’OBSERVATOIRE</span>
          <h2>Votre ville. Votre air.</h2>
        </div>
        <SearchBar cities={cities} onSelect={onSelect} />
      </div>
      <div className="city-pills" role="group" aria-label="Villes disponibles">
        {cities.map((city) => (
          <button
            key={city.slug}
            className={selected === city.slug ? "city-pill selected" : "city-pill"}
            aria-pressed={selected === city.slug}
            onClick={() => onSelect(city)}
          >
            {city.name}
          </button>
        ))}
      </div>
    </section>
  );
}
