export function getYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

export function getYouTubeEmbedUrl(url: string, autoplay = false): string | null {
  const id = getYouTubeId(url);
  if (!id) return null;
  return `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1${autoplay ? "&autoplay=1" : ""}`;
}

export function getYouTubeThumbnail(url: string): string | null {
  const id = getYouTubeId(url);
  if (!id) return null;
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

export function getDurationLabel(url: string): string {
  if (url.includes("shorts")) return "0:15–1:00";
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "0:30–2:00";
  return "";
}

export function getVideoType(url: string): "youtube" | "youtube-shorts" {
  if (url.includes("youtube.com/shorts") || url.includes("youtu.be/shorts")) return "youtube-shorts";
  return "youtube";
}

export function isEmbeddable(url: string): boolean {
  return url.includes("youtube.com") || url.includes("youtu.be");
}

export function getPlatformLabel(url: string): string {
  if (url.includes("youtube.com/shorts")) return "YouTube Shorts";
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "YouTube";
  return "";
}
