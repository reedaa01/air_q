import { ImageResponse } from "next/og";

export const alt = "Aeris — L’air, en clair. La qualité de l’air au Maroc.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        padding: "64px 80px",
        background: "#f5f5f7",
        color: "#1d1d1f",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 40 }}>
        <svg
          width="58"
          height="58"
          viewBox="0 0 48 48"
          fill="none"
          stroke="#28665c"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M8 39 22.2 9.8a2 2 0 0 1 3.6 0L40 39" />
          <path d="M7 30c10-9 24 7 34-2" />
        </svg>
        Aeris
      </div>
      <div style={{ display: "flex", fontSize: 92, letterSpacing: -5, marginTop: 90 }}>
        L’air, <span style={{ color: "#28665c", marginLeft: 20 }}>en clair.</span>
      </div>
      <div style={{ display: "flex", fontSize: 30, color: "#646469", marginTop: 22 }}>
        La qualité de l’air au Maroc, ville par ville.
      </div>
      <div style={{ display: "flex", fontSize: 20, color: "#28665c", marginTop: "auto" }}>
        INDICES · POLLUANTS · PRÉVISIONS
      </div>
    </div>,
    size,
  );
}
