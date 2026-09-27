import { Dashboard } from "@/components/dashboard/Dashboard";
import type { Metadata } from "next";
import { cityDisplayName } from "@/lib/air-quality";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ citySlug: string }>;
}): Promise<Metadata> {
  const { citySlug } = await params;
  const name = cityDisplayName(citySlug);
  const title = `Qualité de l’air à ${name}`;
  const description = `Consultez l’indice européen, les polluants et les prévisions de qualité de l’air à ${name} sur Aeris.`;
  return {
    title,
    description,
    alternates: { canonical: `/cities/${encodeURIComponent(citySlug)}` },
    openGraph: {
      title: `${title} · Aeris`,
      description,
      siteName: "Aeris",
      locale: "fr_MA",
      type: "website",
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: "Aeris — La qualité de l’air au Maroc",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} · Aeris`,
      description,
      images: ["/opengraph-image"],
    },
  };
}
export default async function CityDetailsPage({
  params,
}: {
  params: Promise<{ citySlug: string }>;
}) {
  const { citySlug } = await params;
  return <Dashboard key={citySlug} initialSlug={citySlug} detail />;
}
