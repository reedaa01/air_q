import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Database, Github, Server } from "lucide-react";
import { BrandWordmark } from "@/components/ui/BrandWordmark";

export const metadata: Metadata = {
  title: "À propos de nous",
  description:
    "Découvrez Aeris, un projet consacré à la qualité de l’air au Maroc, et ses créateurs : Iliass Gzouli, Data Engineer, et Rida Rguila, DevOps Engineer.",
};

export default function TeamPage() {
  return (
    <div className="about-page team-page">
      <Link href="/" className="back-link">
        <ArrowLeft size={15} />
        Revenir à l’observatoire
      </Link>
      <span className="eyebrow">À PROPOS DE NOUS</span>
      <h1>
        Deux regards, un projet.
        <br />
        <em>Mieux comprendre l’air au Maroc.</em>
      </h1>
      <p className="about-lead">
        <BrandWordmark /> est né d’une envie commune : rendre les données sur la qualité de l’air au
        Maroc plus accessibles et mettre nos compétences en pratique sur un projet concret.
      </p>

      <section className="panel team-project" aria-labelledby="project-title">
        <span className="eyebrow">LE PROJET</span>
        <h2 id="project-title">Des données à une lecture plus claire de l’air</h2>
        <p>
          Aeris réunit les données de qualité de l’air de plusieurs villes marocaines dans une même
          interface. Une carte, des indicateurs de pollution, des historiques et des prévisions
          permettent d’explorer les villes et de suivre l’évolution de la qualité de l’air.
        </p>
        <p>
          Le projet couvre toute la chaîne : collecte des données Open-Meteo, transformation et
          stockage dans PostgreSQL, accès par une API et visualisation dans une application web. Il
          associe le Data Engineering, pour préparer les données, et le DevOps, pour automatiser
          l’exécution et faciliter le déploiement des services.
        </p>
      </section>

      <div className="team-grid">
        <section className="panel team-profile" aria-labelledby="iliass-name">
          <Database size={28} aria-hidden="true" />
          <span className="eyebrow">DATA ENGINEER</span>
          <h2 id="iliass-name">Iliass Gzouli</h2>
          <a
            className="profile-link"
            href="https://github.com/IliassGzouli"
            target="_blank"
            rel="noreferrer"
          >
            <Github size={17} aria-hidden="true" /> GitHub d’Iliass
            <ArrowUpRight size={15} aria-hidden="true" />
            <span className="sr-only"> (nouvel onglet)</span>
          </a>
          <h3>Pourquoi ce projet ?</h3>
          <p>
            Mon objectif est de donner du sens aux données environnementales et de les rendre utiles
            pour explorer la qualité de l’air au Maroc. Ce projet me permet de mettre en pratique le
            Data Engineering sur une chaîne complète, de la collecte à la mise à disposition des
            données.
          </p>
          <h3>Mon travail dans le projet</h3>
          <ul>
            <li>Collecter les données de qualité de l’air depuis Open-Meteo.</li>
            <li>Développer le pipeline ETL : extraction, transformation et chargement.</li>
            <li>Nettoyer et structurer les données, en distinguant historiques et prévisions.</li>
            <li>Organiser le stockage dans PostgreSQL et la mise à jour des mesures.</li>
            <li>Préparer les données nécessaires aux indicateurs et aux visualisations.</li>
          </ul>
        </section>

        <section className="panel team-profile" aria-labelledby="rida-name">
          <Server size={28} aria-hidden="true" />
          <span className="eyebrow">DEVOPS ENGINEER</span>
          <h2 id="rida-name">Rida Rguila</h2>
          <a
            className="profile-link"
            href="https://github.com/reedaa01"
            target="_blank"
            rel="noreferrer"
          >
            <Github size={17} aria-hidden="true" /> GitHub de Rida
            <ArrowUpRight size={15} aria-hidden="true" />
            <span className="sr-only"> (nouvel onglet)</span>
          </a>
          <h3>Pourquoi ce projet ?</h3>
          <p>
            Mon objectif est de rendre une application de données simple à lancer, à maintenir et à
            déployer. Ce projet me permet de relier les pratiques DevOps à un usage concret, tout en
            construisant avec Iliass une plateforme consacrée à la qualité de l’air au Maroc.
          </p>
          <h3>Mon travail dans le projet</h3>
          <ul>
            <li>Conteneuriser les services avec Docker et les orchestrer avec Docker Compose.</li>
            <li>Configurer les environnements et les connexions entre les services.</li>
            <li>
              Automatiser les contrôles, la construction et la publication des images en CI/CD.
            </li>
            <li>Mettre en place Airflow pour planifier les traitements de données.</li>
            <li>Intégrer les contrôles de santé et les vérifications de sécurité des images.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
