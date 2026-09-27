import Link from "next/link";
import { ArrowLeft, Wind } from "lucide-react";
export default function NotFound() {
  return (
    <section className="not-found">
      <Wind size={56} strokeWidth={1} />
      <span className="eyebrow">404 · HORS DU PÉRIMÈTRE</span>
      <h1>Un petit courant d’air…</h1>
      <p>Cette page n’existe pas. Retrouvez les villes de notre observatoire.</p>
      <Link className="text-link" href="/">
        <ArrowLeft size={16} />
        Revenir à l’accueil
      </Link>
    </section>
  );
}
