"use client";

import clsx from "clsx";
import { CheckIcon, DotsIcon, PlayIcon, SparkleIcon } from "./icons";
import { MediaItem } from "@/lib/media";

type MediaCardProps = {
  item: MediaItem;
  selected: boolean;
  onOpen: (item: MediaItem) => void;
  onToggleSelect: (id: string) => void;
};

export function MediaCard({ item, selected, onOpen, onToggleSelect }: MediaCardProps) {
  return (
    <article
      className={clsx(
        "group relative mb-4 break-inside-avoid overflow-hidden rounded-3xl bg-slate-200 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-slate-900/10",
        selected && "ring-4 ring-blue-500 ring-offset-2 ring-offset-slate-50"
      )}
    >
      <button className="block w-full text-left" onClick={() => onOpen(item)} aria-label={`Open ${item.caption}`}>
        <div className="relative overflow-hidden bg-slate-200" style={{ aspectRatio: `${item.width} / ${item.height}` }}>
          {item.mediaType === "video" ? (
            <HoverVideoPreview item={item} />
          ) : (
            <HoverImagePreview item={item} />
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-slate-950/10 opacity-0 transition duration-300 group-hover:opacity-100" />
          <div className="pointer-events-none absolute bottom-3 left-3 right-3 translate-y-2 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <p className="line-clamp-2 text-sm font-medium text-white drop-shadow">{item.caption}</p>
          </div>
        </div>
      </button>

      <button
        type="button"
        onClick={() => onToggleSelect(item.id)}
        className={clsx(
          "absolute left-3 top-3 rounded-full p-1.5 text-white shadow transition",
          selected ? "bg-blue-600" : "bg-slate-950/40 opacity-0 backdrop-blur group-hover:opacity-100"
        )}
        aria-label={selected ? "Deselect media" : "Select media"}
      >
        <CheckIcon className="h-6 w-6" />
      </button>

      <div className="absolute right-3 top-3 flex gap-2 opacity-0 transition group-hover:opacity-100">
        <button className="rounded-full bg-slate-950/45 p-2 text-white backdrop-blur transition hover:bg-slate-950/70" aria-label="AI details">
          <SparkleIcon className="h-4 w-4" />
        </button>
        <button className="rounded-full bg-slate-950/45 p-2 text-white backdrop-blur transition hover:bg-slate-950/70" aria-label="More actions">
          <DotsIcon className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}

function HoverImagePreview({ item }: { item: MediaItem }) {
  return (
    <picture>
      {item.previewUrl ? <source srcSet={item.previewUrl} media="(min-width: 768px)" /> : null}
      <img
        src={item.thumbnailUrl}
        alt={item.caption}
        loading="lazy"
        className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-105"
      />
    </picture>
  );
}

function HoverVideoPreview({ item }: { item: MediaItem }) {
  return (
    <>
      <video
        muted
        loop
        playsInline
        preload="metadata"
        poster={item.thumbnailUrl}
        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        onMouseEnter={(event) => void event.currentTarget.play()}
        onMouseLeave={(event) => {
          event.currentTarget.pause();
          event.currentTarget.currentTime = 0;
        }}
      >
        <source src={item.previewUrl ?? item.fileUrl} />
      </video>
      <span className="absolute bottom-3 right-3 rounded-full bg-slate-950/55 p-2 text-white backdrop-blur">
        <PlayIcon className="h-4 w-4" />
      </span>
    </>
  );
}
