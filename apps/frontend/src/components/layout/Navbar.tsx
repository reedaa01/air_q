"use client";
import { BrandWordmark } from "@/components/ui/BrandWordmark";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const dashboard = pathname.startsWith("/cities/") ? pathname : "/";
  return (
    <header className="site-header">
      <div
        className="nav-inner"
        onKeyDown={(event) => {
          if (event.key === "Escape" && menuOpen) {
            setMenuOpen(false);
            menuButton.current?.focus();
          }
        }}
      >
        <Link
          href="/"
          className="brand"
          aria-label="Aeris, accueil"
          onClick={() => setMenuOpen(false)}
        >
          <BrandWordmark symbol />
        </Link>
        <button
          ref={menuButton}
          className="nav-toggle"
          aria-expanded={menuOpen}
          aria-controls="main-navigation"
          aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
        <nav
          id="main-navigation"
          className={`main-nav${menuOpen ? " is-open" : ""}`}
          aria-label="Navigation principale"
          onClick={() => setMenuOpen(false)}
        >
          <Link
            href="/"
            className={pathname === "/" ? "active" : ""}
            aria-current={pathname === "/" ? "page" : undefined}
          >
            Vue d’ensemble
          </Link>
          <Link href={dashboard + "#villes"}>Villes</Link>
          <Link href={dashboard + "#carte"}>Carte</Link>
          <Link href={dashboard + "#previsions"}>Prévisions</Link>
          <Link
            href="/a-propos"
            className={pathname === "/a-propos" ? "active" : ""}
            aria-current={pathname === "/a-propos" ? "page" : undefined}
          >
            À propos de nous
          </Link>
          <Link
            href="/about"
            className={`nav-guide-mobile${pathname === "/about" ? " active" : ""}`}
            aria-current={pathname === "/about" ? "page" : undefined}
          >
            Comprendre l’air
          </Link>
        </nav>
        <Link href="/about" className="nav-about">
          Comprendre l’air <ArrowUpRight size={14} />
        </Link>
      </div>
    </header>
  );
}
