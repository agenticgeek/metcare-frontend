/** Format seconds as M:SS or MM:SS for module duration display. */
export function formatDurationSeconds(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

/** Dashboard / meta line: hide zero duration as an em dash. */
export function formatModuleMetaDuration(seconds: number): string {
  if (seconds <= 0) return '—';
  return formatDurationSeconds(seconds);
}
