/**
 * Experience wall: YouTube embeds (modal opens with autoplay).
 * Free videos section: optional local previews in `public/videos/` (see `LANDING_TESTIMONIAL_VIDEO_FILES`).
 * Leave the list empty while clips live on Cloudflare Stream / CDN — keeps the repo under GitHub’s 100 MB per-file limit.
 */
export type LandingVideoOpenPayload =
  | { kind: 'file'; file: string; title?: string }
  | { kind: 'youtube'; id: string; title?: string };

export const LANDING_TESTIMONIAL_YOUTUBE_ITEMS = [
  {
    id: 'QWV2c0sX73A',
    title: '1-1 Introduction Formation FB METCARE®',
  },
  {
    id: '-tjsORalj3E',
    title: "1-2 Les clés d'un drainage réussi",
  },
  {
    id: 'Lq8gY1eAwYY',
    title: '1-3 Les Erreurs à éviter',
  },
] as const;

export const LANDING_TESTIMONIAL_VIDEO_FILES: readonly string[] = [];

export function titleFromVideoFilename(filename: string): string {
  return filename
    .replace(/\.(mov|mp4|webm|m4v)$/i, '')
    .trim()
    .normalize('NFC');
}

export function publicVideoUrl(filename: string): string {
  return `/videos/${encodeURIComponent(filename)}`;
}

export function youtubePosterUrl(videoId: string): string {
  return `https://i.ytimg.com/vi/${encodeURIComponent(videoId)}/hqdefault.jpg`;
}

/** `autoplay` should only be true inside the lightbox after a user click. */
export function youtubeEmbedUrl(videoId: string, autoplay: boolean): string {
  const base = `https://www.youtube.com/embed/${encodeURIComponent(videoId)}`;
  const q = new URLSearchParams({ rel: '0', modestbranding: '1' });
  if (autoplay) q.set('autoplay', '1');
  return `${base}?${q.toString()}`;
}
