/**
 * Utility functions for video URL parsing and thumbnail generation
 */

export interface VideoInfo {
  videoId: string;
  platform: "youtube" | "vimeo" | "other";
  embedUrl: string;
  thumbnailUrl: string;
}

/**
 * Extract video ID from YouTube URL
 */
function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/.*[?&]v=([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Extract video ID from Vimeo URL
 */
function extractVimeoId(url: string): string | null {
  const patterns = [
    /vimeo\.com\/(\d+)/,
    /vimeo\.com\/.*\/(\d+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Parse video URL and return platform info
 */
export function parseVideoUrl(url: string): VideoInfo | null {
  if (!url) return null;

  // Try YouTube
  const youtubeId = extractYouTubeId(url);
  if (youtubeId) {
    return {
      videoId: youtubeId,
      platform: "youtube",
      embedUrl: `https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1`,
      thumbnailUrl: `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`,
    };
  }

  // Try Vimeo
  const vimeoId = extractVimeoId(url);
  if (vimeoId) {
    return {
      videoId: vimeoId,
      platform: "vimeo",
      embedUrl: `https://player.vimeo.com/video/${vimeoId}`,
      thumbnailUrl: `https://vumbnail.com/${vimeoId}.jpg`, // Vimeo thumbnail service
    };
  }

  return null;
}

/**
 * Get thumbnail URL for a video
 */
export function getVideoThumbnail(url: string): string | null {
  const info = parseVideoUrl(url);
  return info?.thumbnailUrl || null;
}

/**
 * Get embed URL for a video
 */
export function getVideoEmbedUrl(url: string): string | null {
  const info = parseVideoUrl(url);
  return info?.embedUrl || null;
}

/**
 * Check if URL is a valid video URL
 */
export function isValidVideoUrl(url: string): boolean {
  return parseVideoUrl(url) !== null;
}
