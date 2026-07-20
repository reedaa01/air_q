export function formatPlaceholderValue(value?: number, unit?: string) {
  // TODO: Replace with locale-aware pollutant and AQI formatting utilities.
  if (value === undefined) {
    return "--";
  }

  return unit ? `${value} ${unit}` : `${value}`;
}
