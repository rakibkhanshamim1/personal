export type VideoPlatform = "youtube" | "vimeo" | "direct";

export type ParsedVideo = {
  platform: VideoPlatform;
  /** Platform id (YouTube/Vimeo) or the original URL for direct files. */
  videoId: string;
  embedUrl: string;
  watchUrl: string;
  /** Null for direct files — those have no derivable poster frame. */
  thumbnailUrl: string | null;
};

const YOUTUBE_PATTERNS = [
  /youtube\.com\/watch\?(?:.*&)?v=([\w-]{6,})/i,
  /youtu\.be\/([\w-]{6,})/i,
  /youtube\.com\/embed\/([\w-]{6,})/i,
  /youtube\.com\/shorts\/([\w-]{6,})/i,
  /youtube\.com\/live\/([\w-]{6,})/i,
];

const VIMEO_PATTERNS = [
  /vimeo\.com\/(?:video\/)?(\d{6,})/i,
  /player\.vimeo\.com\/video\/(\d{6,})/i,
];

/**
 * Detects the platform from any supported URL shape and derives the embed,
 * watch and thumbnail URLs. Callers get a consistent object regardless of
 * whether the admin pasted a share link, a short link or an embed link.
 */
export function parseVideoUrl(url: string): ParsedVideo | null {
  const trimmed = url.trim();
  if (!trimmed) return null;

  for (const pattern of YOUTUBE_PATTERNS) {
    const match = trimmed.match(pattern);
    if (match?.[1]) {
      const videoId = match[1];
      return {
        platform: "youtube",
        videoId,
        embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}`,
        watchUrl: `https://www.youtube.com/watch?v=${videoId}`,
        thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      };
    }
  }

  for (const pattern of VIMEO_PATTERNS) {
    const match = trimmed.match(pattern);
    if (match?.[1]) {
      const videoId = match[1];
      return {
        platform: "vimeo",
        videoId,
        embedUrl: `https://player.vimeo.com/video/${videoId}`,
        watchUrl: `https://vimeo.com/${videoId}`,
        thumbnailUrl: null,
      };
    }
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return {
      platform: "direct",
      videoId: trimmed,
      embedUrl: trimmed,
      watchUrl: trimmed,
      thumbnailUrl: null,
    };
  }

  return null;
}

export const PLATFORM_LABELS: Record<VideoPlatform, string> = {
  youtube: "YouTube",
  vimeo: "Vimeo",
  direct: "Video",
};
