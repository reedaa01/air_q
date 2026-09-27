import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Providers } from "./providers";
import "./globals.css";
import "./design.css";
import { siteUrl } from "@/lib/site-metadata";
export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: await siteUrl(),
    title: { default: "Aeris — L’air, en clair", template: "%s · Aeris" },
    description:
      "Un regard clair sur la qualité de l’air au Maroc. Explorez les villes, les polluants et leurs évolutions avec Aeris.",
    openGraph: {
      siteName: "Aeris",
      locale: "fr_MA",
      type: "website",
      title: "Aeris — L’air, en clair",
      description: "Explorez la qualité de l’air au Maroc, ville par ville.",
    },
    twitter: {
      card: "summary_large_image",
      title: "Aeris — L’air, en clair",
      description: "Explorez la qualité de l’air au Maroc, ville par ville.",
    },
  };
}
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>
        <Providers>
          <a className="skip-link" href="#contenu">
            Aller au contenu
          </a>
          <div className="app-shell">
            <Navbar />
            <div className="main-shell">
              <main id="contenu" tabIndex={-1}>
                {children}
              </main>
              <Footer />
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
