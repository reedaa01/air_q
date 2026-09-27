import type { City, CityMetadata } from "@/types/city";
import type { AirQualityReading } from "@/types/air-quality";

// Display translations only; all measurement and geographic data comes from the API.
const cityLabels: Record<string, { name: string; arabic: string }> = {
  casablanca: { name: "Casablanca", arabic: "الدار البيضاء" },
  rabat: { name: "Rabat", arabic: "الرباط" },
  marrakech: { name: "Marrakech", arabic: "مراكش" },
  tangier: { name: "Tanger", arabic: "طنجة" },
  fes: { name: "Fès", arabic: "فاس" },
  agadir: { name: "Agadir", arabic: "أكادير" },
  meknes: { name: "Meknès", arabic: "مكناس" },
  oujda: { name: "Oujda", arabic: "وجدة" },
  tetouan: { name: "Tétouan", arabic: "تطوان" },
};
export function cityDisplayName(slug: string) {
  return (
    cityLabels[slug]?.name ??
    slug.replace(/-/g, " ").replace(/^./, (letter) => letter.toUpperCase())
  );
}
export function withCityLabels(city: CityMetadata & { latest: AirQualityReading | null }): City {
  return {
    ...city,
    name: cityLabels[city.slug]?.name ?? city.city_name,
    arabic: cityLabels[city.slug]?.arabic ?? "",
  };
}
export const aqiLevels = [
  { label: "Bon", maximum: 20, color: "#398768", className: "good" },
  { label: "Correct", maximum: 40, color: "#8da553", className: "fair" },
  { label: "Modéré", maximum: 60, color: "#c5a043", className: "moderate" },
  { label: "Mauvais", maximum: 80, color: "#d48a50", className: "poor" },
  { label: "Très mauvais", maximum: 100, color: "#c65a62", className: "very-poor" },
  { label: "Extrêmement mauvais", maximum: Infinity, color: "#865577", className: "extreme" },
];
export function getAqiLevel(aqi: number | null | undefined) {
  if (aqi == null)
    return { label: "Non disponible", maximum: 0, color: "#a0a89c", className: "unknown" };
  return aqiLevels.find((level) => aqi <= level.maximum) ?? aqiLevels[5];
}
export const pollutants = [
  { key: "pm2_5", symbol: "PM₂.₅", label: "Particules fines" },
  { key: "pm10", symbol: "PM₁₀", label: "Particules en suspension" },
  { key: "nitrogen_dioxide", symbol: "NO₂", label: "Dioxyde d’azote" },
  { key: "ozone", symbol: "O₃", label: "Ozone" },
  { key: "sulphur_dioxide", symbol: "SO₂", label: "Dioxyde de soufre" },
  { key: "carbon_monoxide", symbol: "CO", label: "Monoxyde de carbone" },
] as const;
export function formatLocalTimestamp(value: string | null | undefined) {
  if (!value) return "Aucune mesure disponible";
  const [date, time] = value.split("T");
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year} à ${time.slice(0, 5)}`;
}
