"use client";
import { useId, useRef, useState } from "react";
import { ArrowUpRight, MapPin, Search, X } from "lucide-react";
import type { City } from "@/types/city";
const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

export function SearchBar({
  cities,
  onSelect,
}: {
  cities: City[];
  onSelect: (city: City) => void;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const input = useRef<HTMLInputElement>(null);
  const listId = useId();
  const results = cities.filter((city) =>
    normalize(`${city.name} ${city.slug} ${city.arabic}`).includes(normalize(query)),
  );

  function select(city: City) {
    onSelect(city);
    setQuery("");
    setActive(-1);
    input.current?.focus();
    setOpen(false);
  }

  function activate(index: number) {
    setActive(index);
    setOpen(true);
    document.getElementById(`${listId}-${index}`)?.scrollIntoView({ block: "nearest" });
  }

  return (
    <div
      className="city-search"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) {
          setOpen(false);
          setActive(-1);
        }
      }}
    >
      <form
        className="search-field"
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          const city = results[active] ?? results[0];
          if (city) select(city);
        }}
      >
        <Search size={17} aria-hidden="true" />
        <input
          ref={input}
          type="text"
          role="combobox"
          autoComplete="off"
          aria-label="Rechercher une ville"
          placeholder="Rechercher une ville…"
          value={query}
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={open && active >= 0 ? `${listId}-${active}` : undefined}
          onFocus={() => setOpen(true)}
          onChange={(event) => {
            setQuery(event.target.value);
            setActive(-1);
            setOpen(true);
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown") {
              event.preventDefault();
              activate(Math.min(active + 1, results.length - 1));
            }
            if (event.key === "ArrowUp") {
              event.preventDefault();
              activate(active <= 0 ? results.length - 1 : active - 1);
            }
            if (event.key === "Escape") {
              event.preventDefault();
              setOpen(false);
              setActive(-1);
            }
          }}
        />
        {query ? (
          <button
            type="button"
            aria-label="Effacer la recherche"
            onClick={() => {
              setQuery("");
              setActive(-1);
              input.current?.focus();
              setOpen(true);
            }}
          >
            <X size={15} aria-hidden="true" />
          </button>
        ) : (
          <span className="search-hint">
            <MapPin size={14} aria-hidden="true" />
          </span>
        )}
      </form>
      <div className="search-results" hidden={!open}>
        <p>EXPLORER UNE VILLE</p>
        <ul id={listId} role="listbox" aria-label="Villes disponibles">
          {results.map((city, index) => (
            <li
              key={city.slug}
              id={`${listId}-${index}`}
              role="option"
              aria-selected={index === active}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => select(city)}
            >
              <MapPin size={15} aria-hidden="true" />
              <span>{city.name}</span>
              <ArrowUpRight size={14} aria-hidden="true" />
            </li>
          ))}
        </ul>
        {!results.length && (
          <div className="search-empty" role="status">
            Aucune ville ne correspond à votre recherche.
          </div>
        )}
      </div>
    </div>
  );
}
