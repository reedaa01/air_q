"use client";
import { useEffect, useState } from "react";
import { MapContainer, Marker, TileLayer, Tooltip, useMap } from "react-leaflet";
import { divIcon } from "leaflet";
import { LocateFixed, Minus, Plus } from "lucide-react";
import { getAqiLevel } from "@/lib/air-quality";
import type { City } from "@/types/city";
import "leaflet/dist/leaflet.css";
function MapControls({ city, cities }: { city: City; cities: City[] }) {
  const map = useMap();
  useEffect(() => {
    if (!map.getBounds().pad(-0.12).contains([city.latitude, city.longitude])) {
      map.panTo([city.latitude, city.longitude], {
        animate: !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      });
    }
  }, [city, map]);
  return (
    <div className="map-controls">
      <button aria-label="Zoomer sur la carte" onClick={() => map.zoomIn()}>
        <Plus size={17} />
      </button>
      <button aria-label="Dézoomer sur la carte" onClick={() => map.zoomOut()}>
        <Minus size={17} />
      </button>
      <button
        aria-label="Recentrer la carte sur les villes"
        onClick={() =>
          map.fitBounds(
            cities.map((item) => [item.latitude, item.longitude] as [number, number]),
            { padding: [40, 40], maxZoom: 7 },
          )
        }
      >
        <LocateFixed size={17} />
      </button>
    </div>
  );
}
export default function InteractiveMap({
  city,
  onSelect,
  cities,
}: {
  city: City;
  onSelect: (city: City) => void;
  cities: City[];
}) {
  const [tileError, setTileError] = useState(false);
  return (
    <>
      <MapContainer
        bounds={cities.map((item) => [item.latitude, item.longitude] as [number, number])}
        boundsOptions={{ padding: [40, 40], maxZoom: 7 }}
        minZoom={4}
        maxZoom={11}
        zoomControl={false}
        // Leaflet can complete a zoom transition after Next.js removes the map.
        zoomAnimation={false}
        scrollWheelZoom={false}
        className="leaflet-map"
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          eventHandlers={{
            tileerror: () => setTileError(true),
            tileload: () => setTileError(false),
          }}
        />
        {cities.map((item) => {
          const level = getAqiLevel(item.latest?.european_aqi);
          return (
            <Marker
              key={item.slug}
              position={[item.latitude, item.longitude]}
              title={`Sélectionner ${item.name}, AQI ${item.latest?.european_aqi ?? "—"}`}
              icon={divIcon({
                className: `aqi-marker ${city.slug === item.slug ? "is-selected" : ""}`,
                html: `<span style="--marker-color:${level.color}">${item.latest?.european_aqi ?? "—"}</span>`,
                iconSize: [34, 34],
                iconAnchor: [17, 17],
              })}
              eventHandlers={{ click: () => onSelect(item) }}
            >
              <Tooltip
                key={city.slug === item.slug ? "selected" : "hover"}
                direction="right"
                offset={[18, 0]}
                permanent={city.slug === item.slug}
                className="city-map-tooltip"
              >
                {item.name}
              </Tooltip>
            </Marker>
          );
        })}
        <MapControls city={city} cities={cities} />
      </MapContainer>
      {tileError && (
        <div className="map-error">
          Fond de carte indisponible. Les villes restent sélectionnables.
        </div>
      )}
    </>
  );
}
