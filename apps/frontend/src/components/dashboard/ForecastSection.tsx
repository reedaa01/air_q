"use client";
import { CalendarDays, CloudSun, Wind } from "lucide-react";
import type { City } from "@/types/city";
import { useAirQualitySeries } from "@/hooks/useAirQuality";
import { AQIBadge } from "@/components/ui/AQIBadge";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";
import { ErrorState } from "@/components/feedback/ErrorState";
import { formatLocalTimestamp } from "@/lib/air-quality";

export function ForecastSection({ city }: { city: City }) {
  const query = useAirQualitySeries(city.slug, "24h", "forecast");
  const days = new Map<string, number[]>();
  for (const row of query.data?.data ?? []) {
    if (row.european_aqi === null) continue;
    const day = row.measured_at.slice(0, 10);
    days.set(day, [...(days.get(day) ?? []), row.european_aqi]);
  }
  return (
    <section className="panel forecast-panel" id="previsions" aria-labelledby="forecast-title">
      <div className="section-heading">
        <div>
          <span className="eyebrow">UN REGARD VERS DEMAIN</span>
          <h2 id="forecast-title">L’air à venir.</h2>
          <p>Les prévisions disponibles pour {city.name}, sur les prochaines 96 heures.</p>
        </div>
        <span className="section-icon">
          <CloudSun size={24} strokeWidth={1.5} />
        </span>
      </div>
      {query.isPending ? (
        <LoadingSkeleton />
      ) : query.isError ? (
        <ErrorState
          message="Les prévisions ne sont pas accessibles pour le moment."
          onRetry={() => {
            void query.refetch();
          }}
        />
      ) : !days.size ? (
        <div className="forecast-empty">
          <span className="forecast-empty-icon">
            <Wind size={34} strokeWidth={1.2} />
          </span>
          <div>
            <h3>Aucune prévision disponible.</h3>
            <p>
              Aucune prévision future disponible pour cette ville. Elles apparaîtront ici dès leur
              prochaine collecte.
            </p>
          </div>
          <span className="quiet-pill">En attente de données</span>
        </div>
      ) : (
        <>
          <div className="forecast-grid">
            {Array.from(days).map(([day, values]) => {
              const [year, month, date] = day.split("-").map(Number);
              const label = new Intl.DateTimeFormat("fr-FR", {
                weekday: "short",
                day: "numeric",
                month: "short",
                timeZone: "UTC",
              }).format(new Date(Date.UTC(year, month - 1, date)));
              return (
                <article className="forecast-day" key={day}>
                  <span className="forecast-day-label">
                    <CalendarDays size={15} />
                    {label}
                  </span>
                  <div className="forecast-value">
                    <strong>{Math.max(...values)}</strong>
                    <span>Pic AQI prévu</span>
                  </div>
                  <AQIBadge value={Math.max(...values)} />
                  <p>
                    Min. {Math.min(...values)} · {values.length} valeurs horaires
                  </p>
                </article>
              );
            })}
          </div>
          <p className="forecast-note">
            Pics et minima calculés sur les heures disponibles, pas sur des journées nécessairement
            complètes. {city.timezone}.
            {query.data && (
              <>
                {" "}
                Fenêtre : {formatLocalTimestamp(query.data.start)} —{" "}
                {formatLocalTimestamp(query.data.end)}.
              </>
            )}
          </p>
        </>
      )}
    </section>
  );
}
