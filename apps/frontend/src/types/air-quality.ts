export type AirQualityCategory = "good" | "fair" | "moderate" | "poor" | "very-poor" | "extreme";
export type PollutantCode = "pm25" | "pm10" | "no2" | "o3" | "so2" | "co";
export type AirQualityReading = {
  id: number;
  city_name: string;
  /** Local wall time without an offset, interpreted in timezone. */
  measured_at: string;
  timezone: string;
  latitude: number;
  longitude: number;
  european_aqi: number | null;
  pm2_5: number | null;
  pm10: number | null;
  nitrogen_dioxide: number | null;
  ozone: number | null;
  sulphur_dioxide: number | null;
  carbon_monoxide: number | null;
  is_forecast: boolean;
};
