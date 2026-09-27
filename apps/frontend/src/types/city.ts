import type { AirQualityReading } from "./air-quality";
export type CityMetadata = {
  city_name: string;
  slug: string;
  latitude: number;
  longitude: number;
  timezone: string;
};
export type City = CityMetadata & {
  name: string;
  arabic: string;
  latest: AirQualityReading | null;
};
export type SeriesResponse = {
  city: CityMetadata;
  data: AirQualityReading[];
  start: string;
  end: string;
  limit: number;
  offset: number;
  has_more: boolean;
};
