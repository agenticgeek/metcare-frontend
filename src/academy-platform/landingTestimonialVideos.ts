/**
 * Experience wall: YouTube embeds (modal opens with autoplay).
 * Free videos: Cloudflare Stream HLS manifests + poster images (Supabase public storage).
 */
export type LandingVideoOpenPayload =
  | { kind: 'file'; file: string; title?: string }
  | { kind: 'youtube'; id: string; title?: string }
  | { kind: 'hls'; manifestUrl: string; title?: string };

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

/** HLS master playlists (Cloudflare Stream) aligned with `freeVideos.modules` order. */
export const LANDING_FREE_HLS_ITEMS = [
  {
    manifestUrl:
      'https://customer-33e06r8tfld09gay.cloudflarestream.com/34fcad983192e654414261d9828e5bff/manifest/video.m3u8',
    posterUrl:
      'https://eiuuvcpixqmrwgwvnzax.supabase.co/storage/v1/object/public/public_images_landing/1.jpg',
  },
  {
    manifestUrl:
      'https://customer-33e06r8tfld09gay.cloudflarestream.com/6345d7119e6050ccb6a6e6de7ece5ff1/manifest/video.m3u8',
    posterUrl:
      'https://eiuuvcpixqmrwgwvnzax.supabase.co/storage/v1/object/public/public_images_landing/2.jpg',
  },
  {
    manifestUrl:
      'https://customer-33e06r8tfld09gay.cloudflarestream.com/109858fd4e22b9011bca0d8b14189054/manifest/video.m3u8',
    posterUrl:
      'https://eiuuvcpixqmrwgwvnzax.supabase.co/storage/v1/object/public/public_images_landing/3.jpg',
  },
] as const;

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
