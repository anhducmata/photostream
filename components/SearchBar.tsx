"use client";

import { SearchIcon, XIcon } from "./icons";

type SearchBarProps = {
  query: string;
  onQueryChange: (query: string) => void;
};

export function SearchBar({ query, onQueryChange }: SearchBarProps) {
  return (
    <label className="group flex w-full items-center gap-3 rounded-full bg-white/90 px-5 py-3 text-slate-700 shadow-sm ring-1 ring-slate-200/80 backdrop-blur transition focus-within:ring-2 focus-within:ring-blue-500">
      <SearchIcon className="h-5 w-5 text-slate-400" />
      <input
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="Search dog, baby, food on table, beach sunset..."
        className="w-full bg-transparent text-base outline-none placeholder:text-slate-400"
      />
      {query ? (
        <button
          type="button"
          onClick={() => onQueryChange("")}
          className="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          aria-label="Clear search"
        >
          <XIcon className="h-5 w-5" />
        </button>
      ) : null}
    </label>
  );
}
