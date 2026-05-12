"use client";

import { DownloadIcon, TrashIcon, XIcon } from "./icons";
import { formatBytes, MediaItem } from "@/lib/media";

type MediaLightboxProps = {
  item?: MediaItem;
  onClose: () => void;
};

export function MediaLightbox({ item, onClose }: MediaLightboxProps) {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 grid bg-slate-950/92 text-white backdrop-blur-sm lg:grid-cols-[1fr_360px]" role="dialog" aria-modal="true">
      <button onClick={onClose} className="absolute left-4 top-4 z-10 rounded-full bg-white/10 p-3 transition hover:bg-white/20" aria-label="Close lightbox">
        <XIcon className="h-6 w-6" />
      </button>

      <main className="flex min-h-0 items-center justify-center p-5 lg:p-10">
        {item.mediaType === "video" ? (
          <video src={item.fileUrl} poster={item.thumbnailUrl} controls autoPlay className="max-h-full max-w-full rounded-3xl object-contain shadow-2xl" />
        ) : (
          <img src={item.fileUrl} alt={item.caption} className="max-h-full max-w-full rounded-3xl object-contain shadow-2xl" />
        )}
      </main>

      <aside className="gallery-scrollbar overflow-y-auto border-t border-white/10 bg-white p-6 text-slate-900 lg:border-l lg:border-t-0">
        <div className="mb-6 flex justify-end gap-2">
          <button className="rounded-full bg-slate-100 p-3 transition hover:bg-slate-200" aria-label="Download">
            <DownloadIcon className="h-5 w-5" />
          </button>
          <button className="rounded-full bg-rose-50 p-3 text-rose-600 transition hover:bg-rose-100" aria-label="Delete">
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>

        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">AI caption</p>
        <h2 className="text-2xl font-semibold leading-tight">{item.caption}</h2>

        <div className="mt-6">
          <p className="mb-3 text-sm font-semibold text-slate-700">Detected objects</p>
          <div className="flex flex-wrap gap-2">
            {item.labels.map((label) => (
              <span key={label} className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">{label}</span>
            ))}
          </div>
        </div>

        <dl className="mt-8 grid grid-cols-2 gap-4 text-sm">
          <Metadata label="Type" value={item.mediaType} />
          <Metadata label="Size" value={formatBytes(item.sizeBytes)} />
          <Metadata label="Dimensions" value={`${item.width} × ${item.height}`} />
          <Metadata label="Duration" value={item.duration ? `${item.duration.toFixed(1)}s` : "—"} />
          <Metadata label="Created" value={new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(item.createdAt))} />
          <Metadata label="Status" value={item.processingStatus} />
        </dl>
      </aside>
    </div>
  );
}

function Metadata({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <dt className="text-xs uppercase tracking-wide text-slate-400">{label}</dt>
      <dd className="mt-1 font-medium capitalize text-slate-800">{value}</dd>
    </div>
  );
}
