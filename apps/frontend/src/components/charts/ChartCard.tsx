"use client";
import { useId, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Activity, ChevronDown } from "lucide-react";
import { useAirQualitySeries } from "@/hooks/useAirQuality";
import { chartPoints, formatChartTime } from "@/lib/chart-data";
import { formatLocalTimestamp, getAqiLevel } from "@/lib/air-quality";
import { ErrorState } from "@/components/feedback/ErrorState";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";
import type { City } from "@/types/city";

export function ChartCard({ city }: { city: City }) {
  const [period, setPeriod] = useState<"24h" | "7j">("24h");
  const [tableOpen, setTableOpen] = useState(false);
  const [mode, setMode] = useState<"history" | "forecast">("history");
  const [metric, setMetric] = useState<"european_aqi" | "pm2_5" | "pm10">("european_aqi");
  const gradient = useId().replace(/:/g, "");
  const query = useAirQualitySeries(city.slug, period, mode);
  const data = query.data ? chartPoints(query.data) : [];
  const values = data.flatMap((point) => (point[metric] === null ? [] : [point[metric] as number]));
  const average = values.length
    ? values.reduce((sum, value) => sum + value, 0) / values.length
    : null;
  const unit = metric === "european_aqi" ? "" : " µg/m³";
  const label = metric === "european_aqi" ? "AQI européen" : metric === "pm2_5" ? "PM₂.₅" : "PM₁₀";
  const actualRows = query.data?.data ?? [];
  const chartColor = getAqiLevel(city.latest?.european_aqi).color;
  return (
    <section className="panel chart-panel" aria-labelledby="chart-title">
      <div className="section-heading">
        <div>
          <span className="eyebrow">PRENDRE DU RECUL</span>
          <h2 id="chart-title">La qualité de l’air au fil du temps.</h2>
        </div>
        {mode === "history" && (
          <div className="segmented-control" aria-label="Période du graphique">
            {(["24h", "7j"] as const).map((value) => (
              <button
                key={value}
                onClick={() => setPeriod(value)}
                aria-pressed={period === value}
                className={period === value ? "selected" : ""}
              >
                {value === "24h" ? "24 heures" : "7 jours"}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="chart-mode">
        <div className="segmented-control" aria-label="Type de données">
          <button
            className={mode === "history" ? "selected" : ""}
            aria-pressed={mode === "history"}
            onClick={() => setMode("history")}
          >
            Historique
          </button>
          <button
            className={mode === "forecast" ? "selected" : ""}
            aria-pressed={mode === "forecast"}
            onClick={() => setMode("forecast")}
          >
            Prévisions
          </button>
        </div>
        <span>
          {mode === "history" ? "Jusqu’à la dernière mesure collectée" : "Les 96 prochaines heures"}
        </span>
      </div>
      <div className="chart-meta">
        <span>
          <span className="status-dot" />
          {city.name}
          <span className="chart-average">
            Moyenne :{" "}
            {query.isError
              ? "—"
              : (average?.toLocaleString("fr-FR", { maximumFractionDigits: 1 }) ?? "—")}
            {unit}
          </span>
        </span>
        <label className="metric-select">
          <span className="sr-only">Mesure du graphique</span>
          <select
            value={metric}
            onChange={(event) => setMetric(event.target.value as typeof metric)}
          >
            <option value="european_aqi">Indice européen</option>
            <option value="pm2_5">PM₂.₅ · µg/m³</option>
            <option value="pm10">PM₁₀ · µg/m³</option>
          </select>
          <ChevronDown size={13} />
        </label>
      </div>
      {query.isPending ? (
        <LoadingSkeleton />
      ) : query.isError ? (
        <ErrorState
          message="La série de mesures n’a pas pu être chargée."
          onRetry={() => {
            void query.refetch();
          }}
        />
      ) : !values.length ? (
        <div className="data-state">
          <Activity size={22} />
          <p>
            {mode === "forecast"
              ? "Aucune prévision à venir disponible pour cet indicateur. Les anciennes prévisions ne sont pas présentées comme actuelles."
              : "Aucune valeur disponible pour cet indicateur sur la période sélectionnée."}
          </p>
        </div>
      ) : (
        <div
          className="chart-canvas"
          role="img"
          aria-label={`${mode === "history" ? "Historique" : "Prévisions"} ${label} à ${city.name}. ${values.length} valeurs disponibles, moyenne ${average?.toFixed(1)}${unit}.`}
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 15, right: 5, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id={gradient} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={chartColor} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={chartColor} stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#e9edf2" strokeDasharray="4 5" />
              <XAxis
                dataKey="time"
                type="number"
                domain={["dataMin", "dataMax"]}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#738077", fontSize: 11 }}
                minTickGap={35}
                dy={10}
                tickFormatter={(value: number) =>
                  formatChartTime(value, period === "7j" || mode === "forecast")
                }
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#738077", fontSize: 11 }}
                tickCount={4}
                domain={[0, "auto"]}
              />
              <Tooltip
                contentStyle={{ borderRadius: 16, border: "1px solid #e6ebe5", fontSize: 12 }}
                formatter={(value: number) => [value.toLocaleString("fr-FR") + unit, label]}
                labelFormatter={(value) => formatChartTime(Number(value), true)}
              />
              <Area
                type="monotone"
                dataKey={metric}
                stroke={chartColor}
                strokeWidth={2.5}
                fill={`url(#${gradient})`}
                connectNulls={false}
                activeDot={{ r: 5, fill: chartColor, stroke: "white", strokeWidth: 3 }}
                dot={values.length === 1}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
      <div className="chart-footnote">
        <Activity size={13} />
        <span>
          {!query.isError && actualRows.length > 0
            ? `${formatLocalTimestamp(actualRows[0].measured_at)} — ${formatLocalTimestamp(actualRows[actualRows.length - 1].measured_at)} · `
            : ""}
          {city.timezone} · Heures sans données laissées vides
        </span>
      </div>
      {!query.isError && actualRows.length > 0 && (
        <details
          className="chart-data-table"
          open={tableOpen}
          onToggle={(event) => setTableOpen(event.currentTarget.open)}
        >
          <summary>Consulter les valeurs du graphique</summary>
          <div className="table-scroll" role="region" aria-label="Valeurs horaires" tabIndex={0}>
            <table>
              <caption>
                {label} à {city.name} · {city.timezone}
                {unit ? ` · ${unit.trim()}` : ""}
              </caption>
              <thead>
                <tr>
                  <th scope="col">Date et heure</th>
                  <th scope="col">
                    {label}
                    {unit}
                  </th>
                </tr>
              </thead>
              <tbody>
                {actualRows.map((row, index) => (
                  <tr key={`${row.measured_at}-${index}`}>
                    <th scope="row">{formatLocalTimestamp(row.measured_at)}</th>
                    <td>
                      {row[metric]?.toLocaleString("fr-FR", { maximumFractionDigits: 1 }) ??
                        "Non disponible"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      )}
    </section>
  );
}
