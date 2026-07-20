import { Search } from "lucide-react";

export function SearchBar() {
  return (
    <form className="flex w-full items-center gap-3 rounded-lg border border-border bg-surface px-4 py-3 shadow-soft">
      <Search aria-hidden className="h-5 w-5 text-muted" />
      <input
        aria-label="Search city"
        className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
        placeholder="Search Moroccan cities"
        type="search"
      />
      {/* TODO: Connect search input to city autocomplete, keyboard navigation, and selected city routing. */}
    </form>
  );
}
