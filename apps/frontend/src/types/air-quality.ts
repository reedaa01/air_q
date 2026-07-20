export type AirQualityCategory =
  | "good"
  | "moderate"
  | "unhealthy-sensitive"
  | "unhealthy"
  | "very-unhealthy"
  | "hazardous";

export type PollutantCode = "pm25" | "pm10" | "no2" | "o3" | "so2" | "co";

export type AirQualityReading = {
  cityId: string;
  aqi: number;
  category: AirQualityCategory;
  measuredAt: string;
};
