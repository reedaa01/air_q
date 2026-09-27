"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { getAqiLevel } from "@/lib/air-quality";
import type { City } from "@/types/city";
export function CityList({
  selected,
  onSelect,
  cities,
}: {
  selected: string;
  onSelect: (city: City) => void;
  cities: City[];
}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <section className="panel cities-panel" id="villes" aria-labelledby="cities-title">
      <div className="section-heading">
        <div>
          <span className="eyebrow">D’UNE VILLE À L’AUTRE</span>
          <h2 id="cities-title">
            Nos villes<span className="heading-dot">.</span>
          </h2>
        </div>
        <span className="count-badge">{String(cities.length).padStart(2, "0")}</span>
      </div>
      <div className="city-table-heading">
        <span>VILLE</span>
        <span>INDICE EUROPÉEN</span>
      </div>
      <div className="city-rows">
        {(expanded ? cities : cities.slice(0, 5)).map((city) => {
          const level = getAqiLevel(city.latest?.european_aqi);
          return (
            <div
              className={`city-row ${city.slug === selected ? "city-row-selected" : ""}`}
              key={city.slug}
            >
              <button
                className="city-select"
                onClick={() => onSelect(city)}
                aria-pressed={city.slug === selected}
              >
                <span className="city-initial">{city.name.slice(0, 1)}</span>
                <span className="city-row-name">{city.name}</span>
                <span className={`aqi-chip ${level.className}`}>
                  {city.latest?.european_aqi ?? "—"}
                  <span>{level.label}</span>
                </span>
              </button>
              <Link
                href={`/cities/${city.slug}`}
                className="city-detail-link"
                aria-label={`Ouvrir la fiche de ${city.name}`}
              >
                <ArrowUpRight size={16} />
              </Link>
            </div>
          );
        })}
      </div>
      {cities.length > 5 && (
        <button
          className="all-cities-button"
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
        >
          {expanded ? "Réduire la liste" : `Voir les ${cities.length} villes`}
          <ChevronDown size={15} className={expanded ? "rotate-180" : ""} />
        </button>
      )}
    </section>
  );
}
