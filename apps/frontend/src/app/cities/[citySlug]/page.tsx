import { AQICard } from "@/components/air-quality/AQICard";
import { PollutantCard } from "@/components/air-quality/PollutantCard";
import { ChartCard } from "@/components/charts/ChartCard";

type CityDetailsPageProps = {
  params: Promise<{
    citySlug: string;
  }>;
};

export default async function CityDetailsPage({ params }: CityDetailsPageProps) {
  const { citySlug } = await params;
  const cityName = citySlug.replaceAll("-", " ");

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">City Details</p>
        <h1 className="mt-2 text-3xl font-semibold capitalize">{cityName}</h1>
        <p className="mt-2 text-muted">
          Placeholder page for city-level air quality metrics, pollutant trends, and station
          summaries.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <AQICard />
        <PollutantCard />
        <PollutantCard />
      </div>
      <ChartCard />
      {/* TODO: Connect this route to city metadata, station data, pollutant history, and forecast APIs. */}
    </section>
  );
}
