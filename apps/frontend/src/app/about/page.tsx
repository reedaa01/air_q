import { BrandWordmark } from "@/components/ui/BrandWordmark";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Database, MapPin, Wind } from "lucide-react";
import { aqiLevels, pollutants } from "@/lib/air-quality";
export const metadata = { title: "Comprendre l’air" };
export default function AboutPage() {
  return (
    <div className="about-page">
      <Link href="/" className="back-link">
        <ArrowLeft size={15} />
        Revenir à l’observatoire
      </Link>
      <div className="eyebrow">LES CLÉS POUR COMPRENDRE</div>
      <h1>
        L’air est invisible.
        <br />
        <em>Ses indicateurs, un peu moins.</em>
      </h1>
      <p className="about-lead">
        <BrandWordmark /> rend la qualité de l’air plus lisible, une ville à la fois.
      </p>
      <div className="about-cards">
        <article className="panel">
          <Wind size={25} />
          <h2>Un regard plus clair</h2>
          <p>
            Une carte, des indicateurs et des courbes pour explorer les différences entre les villes
            et observer l’évolution des polluants.
          </p>
        </article>
        <article className="panel">
          <MapPin size={25} />
          <h2>À l’échelle du Maroc</h2>
          <p>
            Les villes présentes dans les données collectées sont réunies dans une même interface.
            La carte utilise les coordonnées enregistrées pour chaque ville.
          </p>
        </article>
        <article className="panel">
          <Database size={25} />
          <h2>Vos données, leur contexte</h2>
          <p>
            Les valeurs proviennent des données Open-Meteo / CAMS collectées par le projet. Chaque
            mesure porte sa date et son fuseau horaire. Les historiques et les prévisions sont
            affichés séparément ; une valeur absente reste vide. Il s’agit de données de modèles
            atmosphériques, pas de relevés de stations physiques.
          </p>
        </article>
      </div>
      <section className="panel about-scale" id="indice">
        <span className="eyebrow">UNE ÉCHELLE COMMUNE</span>
        <h2>L’indice européen de qualité de l’air</h2>
        <p>
          Plus l’indice est élevé, plus la qualité de l’air se dégrade. La plateforme utilise les
          catégories de l’indice européen, distinctes de l’indice américain.
        </p>
        <div className="scale-grid">
          {aqiLevels.map((level, index) => (
            <div key={level.label}>
              <span style={{ background: level.color }} />
              <strong>
                {index === 0
                  ? "0–20"
                  : index === 5
                    ? "> 100"
                    : `${index * 20 + 1}–${level.maximum}`}
              </strong>
              <p>{level.label}</p>
            </div>
          ))}
        </div>
        <a
          className="text-link"
          href="https://open-meteo.com/en/docs/air-quality-api"
          target="_blank"
          rel="noreferrer"
        >
          Consulter la documentation Open-Meteo <ArrowUpRight size={15} />
        </a>
      </section>
      <section className="panel about-pollutants">
        <span className="eyebrow">CE QUE L’ON REGARDE</span>
        <h2>Six polluants, une unité commune</h2>
        <p>Les concentrations présentées sont exprimées en microgrammes par mètre cube (µg/m³).</p>
        <div>
          {pollutants.map((pollutant) => (
            <article key={pollutant.key}>
              <strong>{pollutant.symbol}</strong>
              <span>{pollutant.label}</span>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
