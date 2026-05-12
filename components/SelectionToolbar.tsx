"use client";

import { DownloadIcon, TrashIcon, XIcon } from "./icons";

type SelectionToolbarProps = {
  selectedCount: number;
  onClear: () => void;
};

export function SelectionToolbar({ selectedCount, onClear }: SelectionToolbarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed inset-x-0 top-4 z-40 mx-auto flex w-[min(92vw,520px)] items-center justify-between rounded-full bg-slate-950 px-3 py-2 text-white shadow-2xl shadow-slate-900/20">
      <button onClick={onClear} className="rounded-full p-2 transition hover:bg-white/10" aria-label="Clear selection">
        <XIcon className="h-5 w-5" />
      </button>
      <span className="text-sm font-medium">{selectedCount} selected</span>
      <div className="flex items-center gap-1">
        <button className="rounded-full p-2 transition hover:bg-white/10" aria-label="Download selected">
          <DownloadIcon className="h-5 w-5" />
        </button>
        <button className="rounded-full p-2 text-rose-200 transition hover:bg-white/10" aria-label="Delete selected">
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
