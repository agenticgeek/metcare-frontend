import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getModulePlaybackToken, isAuthError, listModules } from '@/lib/api';
import type { ModuleSummary } from '@/lib/api';
import { formatDurationSeconds } from '@/lib/formatDuration';
import { streamPlaybackIframeSrc } from '@/lib/streamEmbed';
import { getAcademyCopy } from '@/academy-platform/academyCopy';
import { useLang } from '@/useLang';
import { clearStoredStudentProfile } from '@/lib/studentDisplay';
import { StudentAuthNav } from './StudentAuthNav';
import '@/academy-platform/academy.css';

function formatDurationLabel(seconds: number): string {
  if (seconds <= 0) return '—';
  return formatDurationSeconds(seconds);
}

export default function ModulePlayerPage() {
  const { id } = useParams<{ id: string }>();
  const { lang } = useLang();
  const t = getAcademyCopy(lang);
  const navigate = useNavigate();

  const [modules, setModules] = useState<ModuleSummary[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const currentId = useMemo(() => {
    if (!id) return '';
    try {
      return decodeURIComponent(id);
    } catch {
      return id;
    }
  }, [id]);

  const sorted = useMemo(
    () =>
      [...modules].sort((a, b) =>
        a.order_index !== b.order_index ? a.order_index - b.order_index : a.id.localeCompare(b.id),
      ),
    [modules],
  );

  const current = useMemo(() => sorted.find((m) => m.id === currentId), [sorted, currentId]);
  const idx = useMemo(() => sorted.findIndex((m) => m.id === currentId), [sorted, currentId]);
  const prevModule = idx > 0 ? sorted[idx - 1] : null;
  const nextModule = idx >= 0 && idx < sorted.length - 1 ? sorted[idx + 1] : null;

  useEffect(() => {
    const copy = getAcademyCopy(lang);
    if (!currentId) {
      setLoading(false);
      setError(copy.portal.tokenMissing);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    setToken(null);

    (async () => {
      try {
        const list = await listModules();
        if (cancelled) return;
        setModules(list.data);
        const exists = list.data.some((m) => m.id === currentId);
        if (!exists) {
          setError(copy.portal.moduleOpenError);
          return;
        }
        const tok = await getModulePlaybackToken(currentId);
        if (cancelled) return;
        setToken(tok.data.token);
      } catch (err) {
        if (cancelled) return;
        if (isAuthError(err)) {
          clearStoredStudentProfile();
          navigate('/sign-in', { replace: true });
          return;
        }
        setError(copy.portal.moduleOpenError);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [currentId, lang, navigate]);

  const iframeSrc = token ? streamPlaybackIframeSrc(token) : '';

  return (
    <div className="academy-page academy-auth-page">
      <StudentAuthNav active="none" />
      <main className="academy-auth-main academy-module-main">
        {loading && !error ? (
          <div className="academy-module-inner academy-module-skeleton" aria-busy="true">
            <div className="academy-module-layout">
              <aside className="academy-module-sidebar academy-module-sidebar--skeleton" aria-hidden="true">
                <div className="academy-module-skel-sidebar-row" />
                <div className="academy-module-skel-sidebar-row" />
                <div className="academy-module-skel-sidebar-row academy-module-skel-sidebar-row--short" />
              </aside>
              <div className="academy-module-content">
                <div className="academy-module-video-wrap academy-module-video-wrap--skeleton" />
                <div className="academy-module-meta-skeleton" aria-hidden="true">
                  <div className="academy-module-skel-line academy-module-skel-line--title" />
                  <div className="academy-module-skel-line" />
                  <div className="academy-module-skel-line academy-module-skel-line--short" />
                </div>
                <div className="academy-module-nav-skeleton" aria-hidden="true">
                  <div className="academy-module-skel-pill" />
                  <div className="academy-module-skel-pill academy-module-skel-pill--primary" />
                </div>
              </div>
            </div>
          </div>
        ) : null}
        {error ? (
          <p role="alert">
            {error}{' '}
            <Link to="/dashboard">{t.portal.backToSite}</Link>
          </p>
        ) : null}
        {!loading && !error && current ? (
          <div className="academy-module-inner">
            <div className="academy-module-layout">
              <aside className="academy-module-sidebar" aria-label={t.portal.moduleSidebarTitle}>
                <ol className="academy-module-sidebar-list">
                  {sorted.map((m) => (
                    <li key={m.id}>
                      <Link
                        className={m.id === currentId ? 'is-current' : undefined}
                        to={`/dashboard/module/${encodeURIComponent(m.id)}`}
                      >
                        <span className="academy-module-sidebar-idx">{m.order_index}</span> {m.title}
                      </Link>
                    </li>
                  ))}
                </ol>
              </aside>
              <div className="academy-module-content">
                <div className="academy-module-video-wrap">
                  {iframeSrc ? (
                    <iframe
                      title={current.title}
                      src={iframeSrc}
                      allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                      allowFullScreen
                      className="academy-module-iframe"
                    />
                  ) : null}
                </div>
                <div className="academy-module-meta">
                  <h1 className="academy-module-title">{current.title}</h1>
                  {current.description ? <p className="academy-module-desc">{current.description}</p> : null}
                  <p className="academy-module-duration">
                    {t.portal.durationLabel}: {formatDurationLabel(current.duration_seconds)}
                  </p>
                </div>
                <div className="academy-module-nav-btns">
                  <Link
                    className="academy-btn academy-btn-ghost academy-module-nav-prev"
                    to={
                      prevModule
                        ? `/dashboard/module/${encodeURIComponent(prevModule.id)}`
                        : '/dashboard'
                    }
                  >
                    {prevModule ? t.portal.modulePrev : t.portal.moduleBackToModules}
                  </Link>
                  {nextModule ? (
                    <Link
                      className="academy-btn academy-btn-primary"
                      to={`/dashboard/module/${encodeURIComponent(nextModule.id)}`}
                    >
                      {t.portal.moduleNext}
                    </Link>
                  ) : (
                    <span className="academy-btn academy-btn-primary is-disabled">{t.portal.moduleNext}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
