import { AQICard } from "@/components/air-quality/AQICard";
import { PollutantCard } from "@/components/air-quality/PollutantCard";
import { ChartCard } from "@/components/charts/ChartCard";
import { CityList } from "@/components/cities/CityList";
import { MoroccoMap } from "@/components/map/MoroccoMap";
import { SearchBar } from "@/components/search/SearchBar";

export default function HomePage() {
  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
        <div className="space-y-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Morocco Air Quality
            </p>
            <h1 className="mt-2 max-w-3xl text-3xl font-semibold sm:text-4xl">
              National air quality visibility for Moroccan cities.
            </h1>
          </div>
          <SearchBar />
          <MoroccoMap />
        </div>
        <div className="space-y-4">
          <AQICard />
          <PollutantCard />
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <CityList />
        <ChartCard />
      </div>
      {/* TODO: Connect home dashboard sections to real API-backed data once contracts exist. */}
    </section>
  );
}
