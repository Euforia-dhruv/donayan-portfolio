export function getMediaUrl(path: string | undefined | null): string {
  if (!path) return "";
  // If already a full URL, return as-is
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  // For public assets in /public directory
  if (path.startsWith("/")) return path;
  return "/" + path;
}
