import type { AirQualityReading } from "@/types/air-quality";
import type { CityMetadata, SeriesResponse } from "@/types/city";
import { withCityLabels } from "@/lib/air-quality";

export type ApiClientConfig = { baseUrl?: string };
export class ApiError extends Error {
  constructor(public readonly status: number) {
    super(
      status === 404
        ? "Cette ville n’existe pas dans les données collectées."
        : "Impossible de charger les données. Vérifiez que le backend et PostgreSQL sont démarrés.",
    );
    this.name = "ApiError";
  }
}
export function createApiClient({ baseUrl = "/api/v1" }: ApiClientConfig = {}) {
  async function request<T>(path: string, signal?: AbortSignal): Promise<T> {
    const response = await fetch(baseUrl + path, {
      signal,
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    if (!response.ok) throw new ApiError(response.status);
    return response.json() as Promise<T>;
  }
  return {
    async latest(signal?: AbortSignal) {
      const response = await request<{
        data: (CityMetadata & { latest: AirQualityReading | null })[];
      }>("/air-quality/latest", signal);
      return response.data.map(withCityLabels);
    },
    history(slug: string, hours: number, signal?: AbortSignal) {
      return request<SeriesResponse>(
        `/cities/${encodeURIComponent(slug)}/history?hours=${hours}`,
        signal,
      );
    },
    forecast(slug: string, signal?: AbortSignal) {
      return request<SeriesResponse>(
        `/cities/${encodeURIComponent(slug)}/forecast?hours=96`,
        signal,
      );
    },
  };
}
export const api = createApiClient();
