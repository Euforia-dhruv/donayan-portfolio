export function getYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?(?:.*&)?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

export function getInstagramCode(url: string): string | null {
  const m = url.match(/(?:instagram\.com\/(?:p|reel|tv)\/)([a-zA-Z0-9_-]+)/);
  return m ? m[1] : null;
}

export function getYouTubeEmbedUrl(url: string, autoplay = false, loop = false): string | null {
  const id = getYouTubeId(url);
  if (!id) return null;
  let params = "rel=0&modestbranding=1&playsinline=1";
  if (autoplay) params += "&autoplay=1&mute=1";
  if (loop) params += `&loop=1&playlist=${id}`;
  return `https://www.youtube.com/embed/${id}?${params}`;
}

export function getYouTubeAutoplayUrl(url: string): string | null {
  return getYouTubeEmbedUrl(url, true, true);
}

export function getYouTubeThumbnail(url: string, quality: "hq" | "maxres" = "hq"): string | null {
  const id = getYouTubeId(url);
  if (!id) return null;
  const file = quality === "maxres" ? "maxresdefault" : "hqdefault";
  return `https://i.ytimg.com/vi/${id}/${file}.jpg`;
}

export const getYouTubeMaxResThumbnail = (url: string): string | null =>
  getYouTubeThumbnail(url, "maxres");

export function getDurationLabel(url: string): string {
  if (url.includes("shorts")) return "Short";
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "Film";
  if (url.includes("instagram.com/reel")) return "Reel";
  if (url.includes("instagram.com/p")) return "Campaign";
  return "";
}

export function getVideoType(url: string): "youtube" | "youtube-shorts" | "instagram" {
  if (url.includes("youtube.com/shorts") || url.includes("youtu.be/shorts")) return "youtube-shorts";
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
  return "instagram";
}

export function isEmbeddable(url: string): boolean {
  return url.includes("youtube.com") || url.includes("youtu.be");
}

export function getVimeoId(url: string): string | null {
  const m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return m ? m[1] : null;
}

export function getVimeoEmbedUrl(url: string): string | null {
  const id = getVimeoId(url);
  if (!id) return null;
  return `https://player.vimeo.com/video/${id}?autoplay=1&loop=1&title=0&byline=0&portrait=0`;
}

export function getInstagramEmbedUrl(url: string): string | null {
  const code = getInstagramCode(url);
  if (!code) return null;
  return `https://www.instagram.com/p/${code}/embed/`;
}

export function getPlatformLabel(url: string): string {
  if (url.includes("youtube.com/shorts")) return "YouTube Shorts";
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "YouTube";
  if (url.includes("instagram.com/reel")) return "Instagram Reel";
  if (url.includes("instagram.com/p")) return "Instagram";
  return "";
}
