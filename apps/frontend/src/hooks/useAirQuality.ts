"use client";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
export function useAirQuality() {
  return useQuery({
    queryKey: ["air-quality", "latest"],
    queryFn: ({ signal }) => api.latest(signal),
    staleTime: 30_000,
    refetchInterval: 60_000,
    retry: 1,
  });
}
export function useAirQualitySeries(
  slug: string,
  period: "24h" | "7j",
  mode: "history" | "forecast",
) {
  return useQuery({
    queryKey: ["air-quality", slug, mode, period],
    queryFn: ({ signal }) =>
      mode === "forecast"
        ? api.forecast(slug, signal)
        : api.history(slug, period === "24h" ? 24 : 168, signal),
    staleTime: 30_000,
    refetchInterval: 60_000,
    retry: 1,
  });
}
