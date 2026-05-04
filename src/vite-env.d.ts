/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Absolute API origin (e.g. `https://api.example.com`) or leave empty to use same-origin `/api` (Vite proxy in dev). */
  readonly VITE_API_URL?: string;
  /** Optional Cloudflare Stream iframe base (no trailing slash). Default: `https://iframe.cloudflarestream.com`. */
  readonly VITE_CF_STREAM_IFRAME_BASE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
