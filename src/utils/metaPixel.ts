type MetaPixelPrimitive = string | number | boolean;
type MetaPixelPayload = Record<string, MetaPixelPrimitive | undefined>;

type FbqCommand = 'track' | 'trackCustom';

type QueuedMetaPixelEvent = {
  command: FbqCommand;
  eventName: string;
  params?: MetaPixelPayload;
  queuedAt: number;
};

type MetaPixelDebugEntry = {
  command: FbqCommand;
  eventName: string;
  params?: MetaPixelPayload;
  status: 'queued' | 'sent' | 'failed';
  timestamp: string;
  error?: string;
};

type StandardEventParams = {
  PageView: undefined;
  ViewContent: { content_name?: string };
  Lead: { content_name?: string };
  AddPaymentInfo: undefined;
  InitiateCheckout: { value?: number; currency?: string; num_items?: number };
  Purchase: { value?: number; currency?: string; num_items?: number };
};

type CustomEventParams = {
  AssessmentStarted: { name: string };
  AssessmentStep: { step: number; total: number };
  CTAClick: { cta: string };
  BookingIntent: { cta: string };
  DemoContinue: { cta: 'Demo payment' };
};

declare global {
  interface Window {
    fbq?: ((command: string, eventName: string, params?: MetaPixelPayload) => void) & {
      loaded?: boolean;
      version?: string;
      queue?: unknown[];
      callMethod?: (...args: unknown[]) => void;
      push?: (...args: unknown[]) => void;
    };
    _fbq?: Window['fbq'];
    /** Set `true` in index.html (and load the fbq snippet) to send events */
    __META_PIXEL_ENABLED__?: boolean;
    __META_PIXEL_ID__?: string;
    __metaPixelQueue__?: QueuedMetaPixelEvent[];
    __metaPixelDebugHistory__?: MetaPixelDebugEntry[];
    __metaPixelFlushTimer__?: number;
  }

  interface ImportMetaEnv {
    readonly VITE_META_PIXEL_ID?: string;
    /** Build-time override: `"true"` forces pixel on, `"false"` forces off */
    readonly VITE_META_PIXEL_ENABLED?: string;
  }
}

const DEFAULT_META_PIXEL_ID = '1614045979861744';
const MAX_DEBUG_HISTORY = 50;

/** When false, no `fbq` calls and no queue/flush (snippet in index.html should stay gated the same way). */
export function isMetaPixelEnabled(): boolean {
  const env = import.meta.env.VITE_META_PIXEL_ENABLED;
  if (env === 'true') return true;
  if (env === 'false') return false;
  const win = getBrowserWindow();
  return win?.__META_PIXEL_ENABLED__ === true;
}
const FLUSH_INTERVAL_MS = 500;
const FLUSH_TIMEOUT_MS = 10000;

function getBrowserWindow(): Window | undefined {
  return typeof window === 'undefined' ? undefined : window;
}

function cleanPayload(payload?: MetaPixelPayload): MetaPixelPayload | undefined {
  if (!payload) return undefined;

  const cleaned = Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined),
  ) as MetaPixelPayload;

  return Object.keys(cleaned).length > 0 ? cleaned : undefined;
}

function getDebugHistory(win: Window): MetaPixelDebugEntry[] {
  if (!win.__metaPixelDebugHistory__) {
    win.__metaPixelDebugHistory__ = [];
  }

  return win.__metaPixelDebugHistory__;
}

function getQueue(win: Window): QueuedMetaPixelEvent[] {
  if (!win.__metaPixelQueue__) {
    win.__metaPixelQueue__ = [];
  }

  return win.__metaPixelQueue__;
}

function recordDebug(entry: MetaPixelDebugEntry) {
  const win = getBrowserWindow();
  if (!win) return;

  const history = getDebugHistory(win);
  history.push(entry);

  if (history.length > MAX_DEBUG_HISTORY) {
    history.splice(0, history.length - MAX_DEBUG_HISTORY);
  }
}

function logInDevelopment(message: string, details?: unknown) {
  if (!import.meta.env.DEV) return;

  if (details === undefined) {
    console.info(message);
    return;
  }

  console.info(message, details);
}

function isFbqAvailable(win: Window): boolean {
  return typeof win.fbq === 'function';
}

function invokeFbq(command: FbqCommand, eventName: string, params?: MetaPixelPayload): boolean {
  if (!isMetaPixelEnabled()) {
    return false;
  }

  const win = getBrowserWindow();
  if (!win || !isFbqAvailable(win)) {
    return false;
  }

  const payload = cleanPayload(params);

  try {
    if (payload) {
      win.fbq!(command, eventName, payload);
    } else {
      win.fbq!(command, eventName);
    }

    recordDebug({
      command,
      eventName,
      params: payload,
      status: 'sent',
      timestamp: new Date().toISOString(),
    });

    logInDevelopment(`[Meta Pixel] ${command} ${eventName}`, payload);
    return true;
  } catch (error) {
    recordDebug({
      command,
      eventName,
      params: payload,
      status: 'failed',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : String(error),
    });

    logInDevelopment(`[Meta Pixel] failed ${eventName}`, error);
    return false;
  }
}

function stopFlushWatcher(win: Window) {
  if (!win.__metaPixelFlushTimer__) return;

  window.clearInterval(win.__metaPixelFlushTimer__);
  delete win.__metaPixelFlushTimer__;
}

function flushQueuedEvents(): boolean {
  if (!isMetaPixelEnabled()) {
    return false;
  }

  const win = getBrowserWindow();
  if (!win || !isFbqAvailable(win)) {
    return false;
  }

  const queue = getQueue(win);
  if (queue.length === 0) {
    stopFlushWatcher(win);
    return true;
  }

  const pending = queue.splice(0, queue.length);

  for (const item of pending) {
    const sent = invokeFbq(item.command, item.eventName, item.params);
    if (!sent) {
      queue.unshift(item);
      return false;
    }
  }

  stopFlushWatcher(win);
  return true;
}

function ensureFlushWatcher() {
  const win = getBrowserWindow();
  if (!win || win.__metaPixelFlushTimer__) {
    return;
  }

  const startedAt = Date.now();

  win.__metaPixelFlushTimer__ = window.setInterval(() => {
    const flushed = flushQueuedEvents();
    const timedOut = Date.now() - startedAt > FLUSH_TIMEOUT_MS;

    if (flushed || timedOut) {
      stopFlushWatcher(win);
    }
  }, FLUSH_INTERVAL_MS);
}

function queueEvent(command: FbqCommand, eventName: string, params?: MetaPixelPayload) {
  if (!isMetaPixelEnabled()) {
    return;
  }

  const win = getBrowserWindow();
  if (!win) return;

  const payload = cleanPayload(params);
  const queue = getQueue(win);

  queue.push({
    command,
    eventName,
    params: payload,
    queuedAt: Date.now(),
  });

  recordDebug({
    command,
    eventName,
    params: payload,
    status: 'queued',
    timestamp: new Date().toISOString(),
  });

  logInDevelopment(`[Meta Pixel] queued ${eventName}`, payload);
  ensureFlushWatcher();
}

function dispatchEvent(command: FbqCommand, eventName: string, params?: MetaPixelPayload) {
  if (!isMetaPixelEnabled()) {
    logInDevelopment(`[Meta Pixel] inactive — skipped ${command} ${eventName}`, params);
    return;
  }

  const sent = invokeFbq(command, eventName, params);
  if (!sent) {
    queueEvent(command, eventName, params);
  }
}

function trackStandardEvent<T extends keyof StandardEventParams>(
  eventName: T,
  params?: StandardEventParams[T],
) {
  dispatchEvent('track', eventName, params);
}

function trackCustomEvent<T extends keyof CustomEventParams>(
  eventName: T,
  params: CustomEventParams[T],
) {
  dispatchEvent('trackCustom', eventName, params);
}

function toTitleCase(value: string): string {
  return value
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function resolveMetaPixelId(override?: string): string {
  const win = getBrowserWindow();

  return (
    override?.trim() ||
    win?.__META_PIXEL_ID__?.trim() ||
    import.meta.env.VITE_META_PIXEL_ID?.trim() ||
    DEFAULT_META_PIXEL_ID
  );
}

export function getMetaPixelContentName(pathname: string): string {
  const routeNameMap: Record<string, string> = {
    '/': 'MET Academy',
    '/academy': 'MET Academy',
    '/diamond-incision': 'MET Academy',
    '/diamond-metcare': 'MET Academy',
    '/sign-in': 'MET Academy Sign In',
    '/pricing': 'Pricing',
    '/checkout': 'Checkout',
    '/onboarding': 'Onboarding',
  };

  if (routeNameMap[pathname]) {
    return routeNameMap[pathname];
  }

  const trimmed = pathname.replace(/^\/+|\/+$/g, '');
  if (!trimmed) {
    return 'Landing';
  }

  return toTitleCase(trimmed.split('/').join(' '));
}

export function getMetaPixelDebugHistory(): MetaPixelDebugEntry[] {
  const win = getBrowserWindow();
  return win?.__metaPixelDebugHistory__ ?? [];
}

export function trackPageView() {
  trackStandardEvent('PageView');
}

export function trackViewContent(params?: StandardEventParams['ViewContent']) {
  trackStandardEvent('ViewContent', params);
}

export function trackLead(params?: StandardEventParams['Lead']) {
  trackStandardEvent('Lead', params);
}

export function trackAddPaymentInfo() {
  trackStandardEvent('AddPaymentInfo');
}

export function trackInitiateCheckout(params?: StandardEventParams['InitiateCheckout']) {
  trackStandardEvent('InitiateCheckout', params);
}

export function trackPurchase(params?: StandardEventParams['Purchase']) {
  trackStandardEvent('Purchase', params);
}

export function trackAssessmentStarted(params: CustomEventParams['AssessmentStarted']) {
  trackCustomEvent('AssessmentStarted', params);
}

export function trackAssessmentStep(params: CustomEventParams['AssessmentStep']) {
  trackCustomEvent('AssessmentStep', params);
}

export function trackCTAClick(params: CustomEventParams['CTAClick']) {
  trackCustomEvent('CTAClick', params);
}

export function trackBookingIntent(params: CustomEventParams['BookingIntent']) {
  trackCustomEvent('BookingIntent', params);
}

export function trackDemoContinue() {
  trackCustomEvent('DemoContinue', { cta: 'Demo payment' });
}
