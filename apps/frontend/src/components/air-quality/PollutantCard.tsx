import type { CSSProperties } from "react";
import { pollutants } from "@/lib/air-quality";
import type { City } from "@/types/city";
export function PollutantCard({ city }: { city: City }) {
  return (
    <section className="pollutant-panel" aria-label={`Polluants à ${city.name}`}>
      <div className="section-heading">
        <div>
          <span className="eyebrow">AU-DELÀ DE L’INDICE</span>
          <h2>Ce qui compose votre air.</h2>
        </div>
        <span className="section-caption">Concentrations · µg/m³</span>
      </div>
      <div className="pollutant-grid">
        {pollutants.map((pollutant, index) => (
          <article
            className="pollutant-item"
            style={{ "--card-index": index } as CSSProperties}
            key={pollutant.key}
          >
            <div className="pollutant-top">
              <span className="pollutant-symbol">{pollutant.symbol}</span>
              <span className={`pollutant-dot pollutant-dot-${index}`} aria-hidden="true" />
            </div>
            <div className="pollutant-value">
              <strong>
                {city.latest?.[pollutant.key]?.toLocaleString("fr-FR", {
                  maximumFractionDigits: 1,
                }) ?? "—"}
              </strong>
              <span>µg/m³</span>
            </div>
            <span className="pollutant-name">{pollutant.label}</span>
          </article>
        ))}
      </div>
    </section>
  );
}
