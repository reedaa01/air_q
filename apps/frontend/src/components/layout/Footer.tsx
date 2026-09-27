import { BrandWordmark } from "@/components/ui/BrandWordmark";
import Link from "next/link";
export function Footer() {
  return (
    <footer className="site-footer">
      <span>
        <BrandWordmark symbol />
        <span className="footer-divider">/</span>Un souffle de clarté.
      </span>
      <span>
        Source : Open-Meteo / CAMS<Link href="/about">Comprendre les données ↗</Link>
      </span>
    </footer>
  );
}
