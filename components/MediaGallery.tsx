"use client";

import { useMemo, useState } from "react";
import { groupMediaByDate, MediaItem, sampleMedia } from "@/lib/media";
import { MediaGrid } from "./MediaGrid";
import { MediaLightbox } from "./MediaLightbox";
import { SearchBar } from "./SearchBar";
import { SelectionToolbar } from "./SelectionToolbar";
import { UploadButton } from "./UploadButton";

export function MediaGallery() {
  const [query, setQuery] = useState("");
  const [items] = useState(sampleMedia);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [activeItem, setActiveItem] = useState<MediaItem | undefined>();

  const visibleItems = useMemo(() => filterMedia(items, query), [items, query]);
  const groups = useMemo(() => groupMediaByDate(visibleItems), [visibleItems]);

  function toggleSelected(id: string) {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="min-h-screen px-4 py-6 sm:px-8 lg:px-10">
      <SelectionToolbar selectedCount={selectedIds.size} onClear={() => setSelectedIds(new Set())} />
      <header className="mx-auto mb-8 flex max-w-7xl flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-blue-600">Photostream</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">AI media gallery</h1>
          <p className="mt-3 max-w-2xl text-slate-600">Upload photos and videos, search by meaning, skim previews instantly, and inspect AI labels in a clean Google Photos-style layout.</p>
        </div>
        <UploadButton />
      </header>

      <main className="mx-auto max-w-7xl">
        <div className="sticky top-4 z-30 mb-8">
          <SearchBar query={query} onQueryChange={setQuery} />
        </div>
        <MediaGrid groups={groups} selectedIds={selectedIds} onOpen={setActiveItem} onToggleSelect={toggleSelected} />
      </main>

      <MediaLightbox item={activeItem} onClose={() => setActiveItem(undefined)} />
    </div>
  );
}

function filterMedia(items: MediaItem[], query: string): MediaItem[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return items;
  const terms = normalized.split(/\s+/);

  return items
    .map((item) => {
      const haystack = `${item.caption} ${item.labels.join(" ")}`.toLowerCase();
      const keywordScore = terms.reduce((score, term) => score + (haystack.includes(term) ? 1 : 0), 0);
      const phraseBoost = haystack.includes(normalized) ? 2 : 0;
      return { item, score: keywordScore + phraseBoost };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ item }) => item);
}
