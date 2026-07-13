import mediaMap from "@/data/media-map.json";

const map: Record<string, string> = mediaMap;

export function getMediaUrl(localPath: string): string {
  if (!localPath) return localPath;
  // If already a full URL, return as-is
  if (localPath.startsWith("http://") || localPath.startsWith("https://")) return localPath;
  // Check map
  const normalized = localPath.startsWith("/") ? localPath : "/" + localPath;
  if (map[normalized]) return map[normalized];
  return localPath;
}
