import type { CSSProperties } from "react";
import { getAqiLevel } from "@/lib/air-quality";
export function AQIBadge({ value }: { value: number | null | undefined }) {
  const level = getAqiLevel(value);
  return (
    <span className="aqi-badge" style={{ "--aqi-color": level.color } as CSSProperties}>
      <i aria-hidden="true" />
      {level.label}
    </span>
  );
}
