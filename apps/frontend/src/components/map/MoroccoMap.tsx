"use client";
import dynamic from "next/dynamic";
import { MapPin } from "lucide-react";
import { aqiLevels } from "@/lib/air-quality";
import type { City } from "@/types/city";
const InteractiveMap = dynamic(() => import("./InteractiveMap"), {
  ssr: false,
  loading: () => (
    <div className="map-loading">
      <MapPin size={25} />
      <span>La carte prend place…</span>
    </div>
  ),
});
export function MoroccoMap({
  city,
  onSelect,
  cities,
}: {
  city: City;
  onSelect: (city: City) => void;
  cities: City[];
}) {
  return (
    <section id="carte" className="map-panel" aria-label="Carte interactive des villes du Maroc">
      <div className="map-panel-heading">
        <div>
          <span className="eyebrow">EXPLORER LE TERRITOIRE</span>
          <h2>
            Le Maroc, à vue d’air<span className="heading-dot">.</span>
          </h2>
        </div>
        <span className="map-count">
          <span className="status-dot" />
          {cities.length} villes
        </span>
      </div>
      <div className="map-container">
        <InteractiveMap city={city} cities={cities} onSelect={onSelect} />
        <span className="map-caption">Un territoire. Mille respirations.</span>
      </div>
      <div className="map-legend">
        <span>INDICE AQI</span>
        {aqiLevels.map((level) => (
          <span key={level.label}>
            <i style={{ background: level.color }} />
            {level.label}
          </span>
        ))}
        <a href="/about#indice">L’échelle complète ↗</a>
      </div>
    </section>
  );
}
