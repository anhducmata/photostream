"use client";

import { MediaItem, MediaGroup } from "@/lib/media";
import { DateGroupHeader } from "./DateGroupHeader";
import { MediaCard } from "./MediaCard";

type MediaGridProps = {
  groups: MediaGroup[];
  selectedIds: Set<string>;
  onOpen: (item: MediaItem) => void;
  onToggleSelect: (id: string) => void;
};

export function MediaGrid({ groups, selectedIds, onOpen, onToggleSelect }: MediaGridProps) {
  if (groups.length === 0) {
    return (
      <div className="flex min-h-[48vh] flex-col items-center justify-center rounded-[2rem] border border-dashed border-slate-300 bg-white/65 p-10 text-center">
        <div className="mb-4 rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">No matching media</div>
        <h2 className="text-2xl font-semibold text-slate-900">Try a more visual search</h2>
        <p className="mt-2 max-w-md text-slate-500">Search by object, scene, activity, caption meaning, or a combination like “person holding coffee”.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-24">
      {groups.map((group) => (
        <section key={group.label} aria-labelledby={`group-${group.label}`}>
          <DateGroupHeader label={group.label} count={group.items.length} />
          <div className="columns-2 gap-4 sm:columns-3 lg:columns-4 xl:columns-5 2xl:columns-6">
            {group.items.map((item) => (
              <MediaCard
                key={item.id}
                item={item}
                selected={selectedIds.has(item.id)}
                onOpen={onOpen}
                onToggleSelect={onToggleSelect}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
