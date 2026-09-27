import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowUpRight, Clock3, MapPin, Wind } from "lucide-react";
import { AQIBadge } from "@/components/ui/AQIBadge";
import { aqiLevels, formatLocalTimestamp, getAqiLevel } from "@/lib/air-quality";
import type { City } from "@/types/city";

export function AQICard({ city }: { city: City }) {
  const aqi = city.latest?.european_aqi ?? null;
  const level = getAqiLevel(aqi);
  return (
    <article
      className="aqi-card"
      style={{ "--aqi-color": level.color } as CSSProperties}
      aria-label={`Dernier indice européen de ${city.name}`}
    >
      <div className="aqi-city-info">
        <span className="location-label">
          <MapPin size={14} />
          MAROC
          <span lang="ar" dir="rtl">
            {city.arabic}
          </span>
        </span>
        <h2>
          {city.name}
          <span>.</span>
        </h2>
        <p className="aqi-description">
          Un instantané de l’air
          <br />
          qui vous entoure.
        </p>
        <div className="measurement-time">
          <Clock3 size={15} />
          <div>
            <span>Dernière mesure disponible</span>
            <strong>{formatLocalTimestamp(city.latest?.measured_at)}</strong>
            <small>{city.latest?.timezone ?? city.timezone}</small>
          </div>
        </div>
        <Link href="/about#indice" className="text-link">
          Comprendre cet indice <ArrowUpRight size={15} />
        </Link>
      </div>
      <div className="aqi-visual">
        <div className="aqi-orb" aria-hidden="true">
          <div />
          <div />
          <Wind size={38} strokeWidth={1} />
        </div>
        <div className="aqi-center" key={city.slug}>
          <span className="aqi-overline">INDICE EUROPÉEN AQI</span>
          <strong className="aqi-number">{aqi ?? "—"}</strong>
          <AQIBadge value={aqi} />
        </div>
      </div>
      <div className="aqi-card-bottom">
        <span>Chaque nuance raconte l’air.</span>
        <div className="aqi-scale-wrap">
          <div className="aqi-scale" aria-hidden="true">
            {aqiLevels.map((item) => (
              <i key={item.label} style={{ background: item.color }} />
            ))}
            {aqi !== null && (
              <b style={{ left: `${Math.min((Math.max(aqi, 0) / 120) * 100, 98)}%` }} />
            )}
          </div>
          <div className="aqi-scale-labels">
            <span>Bon</span>
            <span>Extrêmement mauvais</span>
          </div>
        </div>
      </div>
    </article>
  );
}
