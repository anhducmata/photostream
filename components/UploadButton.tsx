"use client";

import { UploadIcon } from "./icons";

type UploadButtonProps = {
  onFilesSelected?: (files: FileList) => void;
};

export function UploadButton({ onFilesSelected }: UploadButtonProps) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md">
      <UploadIcon className="h-5 w-5" />
      Upload
      <input
        type="file"
        accept="image/*,video/*"
        multiple
        className="sr-only"
        onChange={(event) => {
          if (event.target.files?.length) onFilesSelected?.(event.target.files);
        }}
      />
    </label>
  );
}
