export type MediaType = "image" | "video";
export type ProcessingStatus = "queued" | "processing" | "ready" | "failed";

export type MediaItem = {
  id: string;
  fileUrl: string;
  thumbnailUrl: string;
  previewUrl?: string;
  mediaType: MediaType;
  width: number;
  height: number;
  duration?: number;
  createdAt: string;
  uploadedAt: string;
  caption: string;
  labels: string[];
  sizeBytes: number;
  processingStatus: ProcessingStatus;
};

export type MediaGroup = {
  label: string;
  items: MediaItem[];
};

export const sampleMedia: MediaItem[] = [
  {
    id: "1",
    fileUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=85",
    thumbnailUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=700&q=75",
    previewUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=70",
    mediaType: "image",
    width: 1800,
    height: 1200,
    createdAt: new Date().toISOString(),
    uploadedAt: new Date().toISOString(),
    caption: "A warm beach sunset with people walking near the shoreline.",
    labels: ["beach", "sunset", "person", "ocean"],
    sizeBytes: 4312000,
    processingStatus: "ready"
  },
  {
    id: "2",
    fileUrl: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1800&q=85",
    thumbnailUrl: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=700&q=75",
    previewUrl: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=900&q=70",
    mediaType: "image",
    width: 1800,
    height: 1196,
    createdAt: new Date(Date.now() - 86_400_000).toISOString(),
    uploadedAt: new Date().toISOString(),
    caption: "Two happy dogs sitting together in a park.",
    labels: ["dog", "pet", "grass", "park"],
    sizeBytes: 3821000,
    processingStatus: "ready"
  },
  {
    id: "3",
    fileUrl: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1800&q=85",
    thumbnailUrl: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=700&q=75",
    previewUrl: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=900&q=70",
    mediaType: "image",
    width: 1800,
    height: 1200,
    createdAt: "2026-04-22T12:00:00.000Z",
    uploadedAt: new Date().toISOString(),
    caption: "Colorful food arranged on a wooden table.",
    labels: ["food", "table", "vegetables", "meal"],
    sizeBytes: 2899000,
    processingStatus: "ready"
  },
  {
    id: "4",
    fileUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1800&q=85",
    thumbnailUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=700&q=75",
    previewUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=900&q=70",
    mediaType: "image",
    width: 1800,
    height: 1200,
    createdAt: "2026-04-18T09:00:00.000Z",
    uploadedAt: new Date().toISOString(),
    caption: "A person holding coffee during a team meeting.",
    labels: ["person", "coffee", "meeting", "laptop"],
    sizeBytes: 5140000,
    processingStatus: "ready"
  },
  {
    id: "5",
    fileUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1800&q=85",
    thumbnailUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=700&q=75",
    previewUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=70",
    mediaType: "image",
    width: 1800,
    height: 1200,
    createdAt: "2026-03-25T10:30:00.000Z",
    uploadedAt: new Date().toISOString(),
    caption: "A red car parked on a road at golden hour.",
    labels: ["car", "road", "vehicle", "sunset"],
    sizeBytes: 6213000,
    processingStatus: "ready"
  }
];

export function groupMediaByDate(items: MediaItem[], now = new Date()): MediaGroup[] {
  const sorted = [...items].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  const groups = new Map<string, MediaItem[]>();

  for (const item of sorted) {
    const label = formatDateGroup(new Date(item.createdAt), now);
    groups.set(label, [...(groups.get(label) ?? []), item]);
  }

  return Array.from(groups, ([label, groupedItems]) => ({ label, items: groupedItems }));
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** exponent).toFixed(exponent === 0 ? 0 : 1)} ${units[exponent]}`;
}

function formatDateGroup(date: Date, now: Date): string {
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfDate = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  const dayDelta = Math.round((startOfToday - startOfDate) / 86_400_000);

  if (dayDelta === 0) return "Today";
  if (dayDelta === 1) return "Yesterday";
  return new Intl.DateTimeFormat("en", { month: "long", year: "numeric" }).format(date);
}
