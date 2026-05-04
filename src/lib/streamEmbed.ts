/** Cloudflare Stream iframe origin (no trailing slash). */
export const STREAM_EMBED_BASE =
  (import.meta.env.VITE_CF_STREAM_IFRAME_BASE as string | undefined)?.replace(/\/$/, '') ||
  'https://iframe.cloudflarestream.com';

export function streamPlaybackIframeSrc(token: string, options?: { autoplay?: boolean }): string {
  const base = `${STREAM_EMBED_BASE}/${token}`;
  if (!options?.autoplay) return base;
  const q = new URLSearchParams({ autoplay: 'true' });
  return `${base}?${q.toString()}`;
}
