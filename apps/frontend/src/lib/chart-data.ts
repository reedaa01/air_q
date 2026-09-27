import type { SeriesResponse } from "@/types/city";
export type ChartPoint = {
  time: number;
  european_aqi: number | null;
  pm2_5: number | null;
  pm10: number | null;
};
// Numeric coordinates represent local wall-clock labels, not UTC measurement instants.
// This keeps the chart independent of the viewer's browser timezone.
export function wallTime(value: string): number {
  const [year, month, day, hour, minute, second = 0] = value.split(/[-T:.]/).map(Number);
  return Date.UTC(year, month - 1, day, hour, minute, second);
}
export function chartPoints(series: SeriesResponse): ChartPoint[] {
  const rows = new Map(series.data.map((row) => [wallTime(row.measured_at), row]));
  const points: ChartPoint[] = [];
  const hour = 3_600_000;
  for (
    let time = Math.ceil(wallTime(series.start) / hour) * hour;
    time < wallTime(series.end);
    time += hour
  ) {
    const row = rows.get(time);
    points.push({
      time,
      european_aqi: row?.european_aqi ?? null,
      pm2_5: row?.pm2_5 ?? null,
      pm10: row?.pm10 ?? null,
    });
  }
  return points;
}
export function formatChartTime(value: number, withDate = false): string {
  const date = new Date(value);
  const time = `${String(date.getUTCHours()).padStart(2, "0")}:00`;
  return withDate
    ? `${String(date.getUTCDate()).padStart(2, "0")}/${String(date.getUTCMonth() + 1).padStart(2, "0")} ${time}`
    : time;
}
