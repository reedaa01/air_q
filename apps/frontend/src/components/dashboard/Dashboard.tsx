"use client";
import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Info, MapPin, Wind } from "lucide-react";
import { AQICard } from "@/components/air-quality/AQICard";
import { PollutantCard } from "@/components/air-quality/PollutantCard";
import { ChartCard } from "@/components/charts/ChartCard";
import { CityList } from "@/components/cities/CityList";
import { MoroccoMap } from "@/components/map/MoroccoMap";
import { ErrorState } from "@/components/feedback/ErrorState";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";
import { CitySelector } from "./CitySelector";
import { ForecastSection } from "./ForecastSection";
import { useAirQuality } from "@/hooks/useAirQuality";
import type { City } from "@/types/city";
import { rememberCity, usePreferredCity } from "@/hooks/usePreferredCity";
import { ShareCity } from "@/components/cities/ShareCity";

export function Dashboard({
  initialSlug,
  detail = false,
}: {
  initialSlug?: string;
  detail?: boolean;
}) {
  const selectedSlug = usePreferredCity();
  const router = useRouter();
  const query = useAirQuality();
  const cities = query.data ?? [];
  const requestedSlug = detail ? initialSlug : selectedSlug;
  const requestedCity = cities.find((item) => item.slug === requestedSlug);
  const city = detail
    ? requestedCity
    : (requestedCity ?? cities.find((item) => item.slug === "casablanca") ?? cities[0]);
  const citySlug = city?.slug;
  useEffect(() => {
    if (detail && citySlug) rememberCity(citySlug);
  }, [detail, citySlug]);
  function selectCity(nextCity: City) {
    rememberCity(nextCity.slug);
    if (detail) router.push(`/cities/${nextCity.slug}`, { scroll: false });
  }
  return (
    <div className="dashboard-content">
      <section className="page-intro">
        {detail && (
          <Link href="/" className="back-link">
            <ArrowLeft size={14} />
            Vue d’ensemble
          </Link>
        )}
        <span className="intro-tag">
          <Wind size={14} />
          LA QUALITÉ DE L’AIR AU MAROC
        </span>
        <h1>
          {detail ? (
            <>
              L’air de <span>{city?.name ?? "votre ville"}.</span>
            </>
          ) : (
            <>
              L’air, <span>en clair.</span>
            </>
          )}
        </h1>
        <p>
          Comprenez l’air de votre ville.
          <br /> Explorez les indices, les tendances et les prévisions.
        </p>
        <span className="intro-source">
          <span />
          Données Open-Meteo / CAMS · Dates de mesure affichées
        </span>
        {!detail && (
          <div className="intro-actions">
            <a className="button-primary" href="#observatoire">
              Explorer les villes <ArrowUpRight size={16} />
            </a>
            <Link className="button-secondary" href="/about">
              Comprendre les indices <ArrowUpRight size={16} />
            </Link>
          </div>
        )}
      </section>
      <div id="observatoire" className="observatory-content">
        {query.isPending ? (
          <LoadingSkeleton />
        ) : query.isError ? (
          <ErrorState
            message="Les mesures sont momentanément inaccessibles. Vous pouvez réessayer dans un instant."
            onRetry={() => {
              void query.refetch();
            }}
          />
        ) : !cities.length ? (
          <div className="data-state">
            <MapPin size={30} />
            <h2>Votre horizon est prêt.</h2>
            <p>Les premières villes apparaîtront dès que leurs mesures seront disponibles.</p>
          </div>
        ) : !city ? (
          <ErrorState
            title="Ville introuvable"
            message="Cette ville n’est pas présente dans les données collectées. Choisissez une ville depuis la vue d’ensemble."
          />
        ) : (
          <>
            <CitySelector cities={cities} selected={city.slug} onSelect={selectCity} />
            <ShareCity key={`share-${city.slug}`} slug={city.slug} name={city.name} />
            <div aria-live="polite">
              <AQICard city={city} />
            </div>
            <div className="data-notice">
              <Info size={14} />
              <p>
                Les indicateurs correspondent à la dernière mesure collectée, qui peut être
                antérieure à aujourd’hui.
              </p>
              <Link href="/about">
                À propos des données <ArrowUpRight size={13} />
              </Link>
            </div>
            <PollutantCard city={city} />
            <ChartCard key={`chart-${city.slug}`} city={city} />
            <ForecastSection city={city} />
            <div className="explore-grid">
              <MoroccoMap city={city} cities={cities} onSelect={selectCity} />
              <CityList cities={cities} selected={city.slug} onSelect={selectCity} />
            </div>
          </>
        )}
      </div>
      <section className="discovery-banner">
        <span className="discovery-icon">
          <Wind size={32} strokeWidth={1.3} />
        </span>
        <div>
          <span className="eyebrow">COMPRENDRE, SIMPLEMENT</span>
          <h2>Quelques clés pour mieux comprendre.</h2>
          <p>Les indices, les polluants et ce que les données nous apprennent.</p>
        </div>
        <Link href="/about">
          Découvrir le guide <ArrowUpRight size={17} />
        </Link>
      </section>
    </div>
  );
}
