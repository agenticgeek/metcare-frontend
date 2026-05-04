/**
 * Student portal → MET Academy API (Express).
 * httpOnly `student_session` cookie — always use credentials: 'include'.
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

  constructor(message: string, status: number, body: ApiErrorBody | Record<string, unknown>) {
    super(message);
    this.name = 'ApiRequestError';
    this.status = status;
    this.body = body;
  }
}

/** API origin without trailing slash, or '' for same-origin (recommended with Vite `/api` proxy in dev). */
export function getApiBase(): string {
  const raw = import.meta.env.VITE_API_URL?.trim();
  if (raw) return raw.replace(/\/$/, '');
  return '';
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

  if (!res.ok) {
    const msg =
      typeof body.message === 'string' ? body.message : res.statusText || 'Request failed';
    throw new ApiRequestError(msg, res.status, body as ApiErrorBody);
  }

  if (body.success !== true) {
    const msg = typeof body.message === 'string' ? body.message : 'Unexpected response';
    throw new ApiRequestError(msg, res.status, body as ApiErrorBody);
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

export const listModules = () => api<ModuleSummary[]>('/api/modules', { method: 'GET' });

export const getModulePlaybackToken = (moduleId: string) =>
  api<{ token: string }>(`/api/modules/${encodeURIComponent(moduleId)}/token`, { method: 'GET' });
