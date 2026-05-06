/**
 * Student portal → MET Academy API (Express).
 * httpOnly `student_session` cookie — always use credentials: 'include'.
 *
 * Deploy (Vercel): requests must hit same-origin `/api/...` (see `vercel.json` rewrite).
 * If `VITE_API_URL` points at another host (e.g. Railway), the browser still calls Railway
 * directly and session cookies usually fail → 401 on `/api/modules`. `getApiBase()` therefore
 * ignores a cross-origin `VITE_API_URL` in the browser so `/api` proxies work even when that
 * env var is still set at build time.
 *
 * Local dev: empty `VITE_API_URL` + Vite `server.proxy['/api']` (see vite.config.ts).
 *
 * Railway / backend alignment:
 * - `FRONTEND_URL` must match this SPA’s origin exactly (scheme + host + port).
 * - `JWT_STUDENT_SECRET` must match the value used when minting sessions (typo ⇒ invalid_token).
 * - With `AUTH_DEBUG=1`, 401/403 responses may include `X-Auth-Reason` (`missing_token`, `invalid_token`,
 *   `wrong_role`). We attach it to `ApiRequestError.authReason`. For cross-origin API calls, the backend
 *   must also expose that header via `Access-Control-Expose-Headers` if you need it in JS (same-origin
 *   `/api` proxy does not require that).
 *
 * @see Backend README / docs/FRONTEND_INTEGRATION.md on the API repo.
 */

export type AuthTokenStatus = 'valid' | 'invalid' | 'used' | 'expired';

export type TokenCheckType = 'activation' | 'reset';

export type StudentProfile = {
  id: string;
  full_name: string;
  email: string;
};

export type ModuleSummary = {
  id: string;
  order_index: number;
  title: string;
  description: string | null;
  duration_seconds: number;
  /** Absolute URL to a poster image (optional; backend may omit). */
  thumbnail_url?: string | null;
  poster_url?: string | null;
  /** Cloudflare Stream video UID — used to build a default thumbnail URL when no image URL is set. */
  stream_uid?: string | null;
};

export type ApiSuccess<T> = {
  success: true;
  data: T;
  message?: string;
};

export type ApiErrorBody = {
  success: false;
  message: string;
};

export class ApiRequestError extends Error {
  readonly status: number;
  readonly body: ApiErrorBody | Record<string, unknown>;
  /** Set when backend sends `X-Auth-Reason` (e.g. `AUTH_DEBUG=1` on Railway). */
  readonly authReason?: string;

  constructor(
    message: string,
    status: number,
    body: ApiErrorBody | Record<string, unknown>,
    authReason?: string,
  ) {
    super(message);
    this.name = 'ApiRequestError';
    this.status = status;
    this.body = body;
    this.authReason = authReason;
  }
}

function readAuthDebugReason(res: Response): string | undefined {
  if (res.status !== 401 && res.status !== 403) return undefined;
  const v = res.headers.get('X-Auth-Reason')?.trim();
  return v || undefined;
}

export function isAuthError(err: unknown): err is ApiRequestError {
  return err instanceof ApiRequestError && (err.status === 401 || err.status === 403);
}

function normalizeConfiguredApiOrigin(raw: string): string {
  const noTrailing = raw.replace(/\/$/, '');
  if (/^https?:\/\//i.test(noTrailing)) return noTrailing;
  if (
    /^(localhost|127\.0\.0\.1)(:\d+)?$/i.test(noTrailing) ||
    noTrailing.startsWith('localhost:') ||
    noTrailing.startsWith('127.0.0.1:')
  ) {
    return `http://${noTrailing}`;
  }
  return `https://${noTrailing}`;
}

/**
 * API origin without trailing slash, or '' for same-origin (`/api` — Vite proxy in dev, Vercel rewrite in prod).
 * Bare hosts get `https://` so fetch does not treat them as relative paths on the current site.
 * In the browser, if the configured origin differs from `window.location.origin`, returns ''
 * so cookies attach to the app host (cross-origin API URLs break httpOnly sessions).
 */
export function getApiBase(): string {
  const raw = import.meta.env.VITE_API_URL?.trim();
  if (!raw) return '';

  const base = normalizeConfiguredApiOrigin(raw);

  if (typeof window !== 'undefined') {
    try {
      if (new URL(base).origin !== window.location.origin) {
        return '';
      }
    } catch {
      return base.replace(/\/$/, '');
    }
  }

  return base.replace(/\/$/, '');
}

async function parseJson(res: Response): Promise<Record<string, unknown>> {
  try {
    return (await res.json()) as Record<string, unknown>;
  } catch {
    return {};
  }
}

/**
 * Low-level JSON request. Throws ApiRequestError on non-2xx.
 * @param path - Absolute URL or path starting with `/api/...`
 */
export async function api<T = unknown>(
  path: string,
  options: RequestInit & { locale?: 'fr' | 'en' } = {},
): Promise<ApiSuccess<T>> {
  const { locale, headers: extraHeaders, ...rest } = options;
  const base = getApiBase();
  const url = path.startsWith('http') ? path : `${base}${path.startsWith('/') ? path : `/${path}`}`;

  const method = (rest.method ?? 'GET').toString().toUpperCase();
  const headers: HeadersInit = {
    ...(extraHeaders as Record<string, string>),
  };
  if (method !== 'GET' && method !== 'HEAD' && rest.body != null) {
    (headers as Record<string, string>)['Content-Type'] = 'application/json';
  }
  if (locale) {
    (headers as Record<string, string>)['Accept-Language'] = locale;
  }

  const res = await fetch(url, {
    ...rest,
    headers,
    credentials: 'include',
  });

  const body = await parseJson(res);
  const authReason = readAuthDebugReason(res);

  if (res.status === 401 || res.status === 403) {
    // Global force-logout for any auth/forbidden errors (deactivated/deleted users)
    if (typeof window !== 'undefined') {
      import('@/lib/studentDisplay').then((m) => m.clearStoredStudentProfile());
      // Only redirect if not already on an auth page to avoid infinite loops
      const p = window.location.pathname;
      if (p !== '/sign-in' && p !== '/activate' && p !== '/reset-password') {
        window.location.href = '/sign-in';
      }
    }
  }

  if (!res.ok) {
    const msg =
      typeof body.message === 'string' ? body.message : res.statusText || 'Request failed';
    if (import.meta.env.DEV && authReason) {
      console.warn(`[api] ${method} ${url} → ${res.status} (X-Auth-Reason: ${authReason})`);
    }
    throw new ApiRequestError(msg, res.status, body as ApiErrorBody, authReason);
  }

  if (body.success !== true) {
    const msg = typeof body.message === 'string' ? body.message : 'Unexpected response';
    if (import.meta.env.DEV && authReason) {
      console.warn(`[api] ${method} ${url} → ${res.status} (X-Auth-Reason: ${authReason})`);
    }
    throw new ApiRequestError(msg, res.status, body as ApiErrorBody, authReason);
  }

  return body as ApiSuccess<T>;
}

export const login = (email: string, password: string, locale?: 'fr' | 'en') =>
  api<StudentProfile>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    locale,
  });

export const logout = () => api<Record<string, never>>('/api/auth/logout', { method: 'POST' });

export const activate = (token: string, password: string, confirm_password: string) =>
  api<StudentProfile>('/api/auth/activate', {
    method: 'POST',
    body: JSON.stringify({ token, password, confirm_password }),
  });

export const forgotPassword = (email: string) =>
  api<unknown>('/api/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });

export const resetPassword = (token: string, password: string, confirm_password: string) =>
  api<StudentProfile>('/api/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ token, password, confirm_password }),
  });

export const checkAuthToken = (token: string, type: TokenCheckType = 'activation') => {
  const q = new URLSearchParams({ token, type });
  return api<{ status: AuthTokenStatus }>(`/api/auth/token-check?${q.toString()}`, {
    method: 'GET',
  });
};

export const listModules = () =>
  api<ModuleSummary[]>('/api/modules', {
    method: 'GET',
    cache: 'no-store',
    headers: {
      'Cache-Control': 'no-store',
      Pragma: 'no-cache',
    },
  });

export const getModulePlaybackToken = (moduleId: string) =>
  api<{ token: string }>(`/api/modules/${encodeURIComponent(moduleId)}/token`, { method: 'GET' });
