import type { ModuleSummary } from '@/lib/api';

function trimString(v: unknown): string | undefined {
  if (typeof v !== 'string') return undefined;
  const s = v.trim();
  return s.length ? s : undefined;
}

/** Cloudflare Stream default JPEG thumbnail (public delivery URL). */
export function cloudflareStreamThumbnailUrl(uid: string): string {
  const enc = encodeURIComponent(uid);
  return `https://videodelivery.net/${enc}/thumbnails/thumbnail.jpg?height=720&fit=crop`;
}

/**
 * Resolve a poster image for dashboard tiles. Checks optional typed fields and common API aliases.
 * Backend can send `thumbnail_url`, `poster_url`, or a Stream video uid (`stream_uid`, etc.).
 */
export function getModuleThumbnailUrl(module: ModuleSummary): string | undefined {
  const row = module as ModuleSummary & Record<string, unknown>;

  const direct =
    trimString(module.thumbnail_url) ??
    trimString(module.poster_url) ??
    trimString(row.thumbnailUrl) ??
    trimString(row.posterUrl) ??
    trimString(row.thumbnail) ??
    trimString(row.poster);

  if (direct) return direct;

  const uid =
    trimString(module.stream_uid) ??
    trimString(row.stream_uid) ??
    trimString(row.streamUid) ??
    trimString(row.cloudflare_video_uid) ??
    trimString(row.cloudflareVideoUid) ??
    trimString(row.cloudflare_stream_uid) ??
    trimString(row.cloudflareStreamUid) ??
    trimString(row.video_uid) ??
    trimString(row.videoUid);

  if (uid) return cloudflareStreamThumbnailUrl(uid);

  return undefined;
}
