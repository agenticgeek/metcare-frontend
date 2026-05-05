import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ApiRequestError, getModulePlaybackToken, listModules, logout } from '@/lib/api';
import type { ModuleSummary } from '@/lib/api';
import { formatModuleMetaDuration } from '@/lib/formatDuration';
import { getModuleThumbnailUrl } from '@/lib/moduleThumbnail';
import { streamPlaybackIframeSrc } from '@/lib/streamEmbed';
import { clearStoredStudentProfile, firstNameFromFull, getStoredDisplayName } from '@/lib/studentDisplay';
import { getAcademyCopy } from '@/academy-platform/academyCopy';
import { useLang } from '@/useLang';
import { StudentAuthNav } from './StudentAuthNav';
import '@/academy-platform/academy.css';

function PlayGlyph() {
  return (
    <svg className="academy-dashboard-play-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <polygon points="8,5 19,12 8,19" fill="currentColor" />
    </svg>
  );
}

/** Shimmer in the thumb until the poster finishes loading (cached images handled via `complete`). */
function DashboardTilePoster({ src }: { src: string }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setLoaded(false);
    setFailed(false);
  }, [src]);

  useEffect(() => {
    const el = imgRef.current;
    if (el?.complete && el.naturalHeight > 0) {
      setLoaded(true);
    }
  }, [src]);

  if (failed) return null;

  return (
    <>
      <span
        className={
          loaded
            ? 'academy-dashboard-video-thumb-skeleton academy-dashboard-video-thumb-skeleton--done'
            : 'academy-dashboard-video-thumb-skeleton'
        }
        aria-hidden="true"
      />
      <img
        ref={imgRef}
        className={loaded ? 'academy-dashboard-video-poster academy-dashboard-video-poster--loaded' : 'academy-dashboard-video-poster'}
        src={src}
        alt=""
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
      />
    </>
  );
}

const MODULES_PAGE_SIZE = 6;

function DashboardModuleTile({
  module: m,
  onOpen,
  watchLabel,
}: {
  module: ModuleSummary;
  onOpen: (m: ModuleSummary) => void;
  watchLabel: string;
}) {
  const thumb = getModuleThumbnailUrl(m);
  return (
    <li>
      <button
        type="button"
        className="academy-dashboard-video-tile"
        onClick={() => onOpen(m)}
        aria-label={`${watchLabel}: ${m.title}`}
      >
        <div className="academy-dashboard-video-thumb">
          {thumb ? <DashboardTilePoster src={thumb} /> : null}
          <span className="academy-dashboard-video-meta">
            #{m.order_index} · {formatModuleMetaDuration(m.duration_seconds)}
          </span>
          <span className="academy-dashboard-video-play">
            <span className="academy-dashboard-video-play-inner">
              <PlayGlyph />
            </span>
          </span>
        </div>
        <div className="academy-dashboard-video-caption">
          <h3>{m.title}</h3>
        </div>
      </button>
    </li>
  );
}

export default function DashboardPage() {
  const { lang } = useLang();
  const t = getAcademyCopy(lang);
  const navigate = useNavigate();
  const [modules, setModules] = useState<ModuleSummary[] | undefined>(undefined);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [modalModule, setModalModule] = useState<ModuleSummary | null>(null);
  const [modalToken, setModalToken] = useState<string | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  /** After user clicks play in the modal, mount iframe with autoplay (thumbnail stays until then). */
  const [modalPlaybackStarted, setModalPlaybackStarted] = useState(false);

  const modalReqRef = useRef(0);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const [modulesPage, setModulesPage] = useState(0);

  const displayName = getStoredDisplayName();
  const welcome = t.portal.dashboardWelcome.replace('{{name}}', firstNameFromFull(displayName));

  const sortedModules = useMemo(() => {
    if (!modules?.length) return [];
    return [...modules].sort((a, b) =>
      a.order_index !== b.order_index ? a.order_index - b.order_index : a.id.localeCompare(b.id),
    );
  }, [modules]);

  const modulesTotalPages =
    sortedModules.length === 0 ? 0 : Math.ceil(sortedModules.length / MODULES_PAGE_SIZE);
  const clampedModulesPage =
    modulesTotalPages === 0 ? 0 : Math.min(modulesPage, modulesTotalPages - 1);
  const pagedModules = useMemo(
    () =>
      sortedModules.slice(
        clampedModulesPage * MODULES_PAGE_SIZE,
        (clampedModulesPage + 1) * MODULES_PAGE_SIZE,
      ),
    [sortedModules, clampedModulesPage],
  );

  useEffect(() => {
    setModulesPage(0);
  }, [modules]);

  useEffect(() => {
    if (modulesTotalPages === 0) return;
    setModulesPage((p) => Math.min(p, modulesTotalPages - 1));
  }, [modulesTotalPages]);

  useEffect(() => {
    let cancelled = false;
    const copy = getAcademyCopy(lang);
    void (async () => {
      try {
        const res = await listModules();
        if (!cancelled) {
          setModules(res.data);
          setLoadError(null);
        }
      } catch (err) {
        if (!cancelled) {
          if (err instanceof ApiRequestError && err.status === 401) {
            clearStoredStudentProfile();
            navigate('/sign-in', { replace: true });
            return;
          }
          setModules([]);
          setLoadError(copy.portal.dashboardLoadError);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [lang]);

  function closeModal() {
    modalReqRef.current += 1;
    setModalModule(null);
    setModalToken(null);
    setModalError(null);
    setModalLoading(false);
    setModalPlaybackStarted(false);
  }

  function openModal(m: ModuleSummary) {
    const req = ++modalReqRef.current;
    setModalModule(m);
    setModalToken(null);
    setModalError(null);
    setModalPlaybackStarted(false);
    setModalLoading(true);
    void getModulePlaybackToken(m.id)
      .then((res) => {
        if (modalReqRef.current !== req) return;
        setModalToken(res.data.token);
      })
      .catch(() => {
        if (modalReqRef.current !== req) return;
        setModalError(t.portal.moduleOpenError);
      })
      .finally(() => {
        if (modalReqRef.current !== req) return;
        setModalLoading(false);
      });
  }

  useEffect(() => {
    if (!modalModule) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [modalModule]);

  useEffect(() => {
    if (modalModule) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [modalModule]);

  useEffect(() => {
    if (modalModule) {
      queueMicrotask(() => closeBtnRef.current?.focus());
    }
  }, [modalModule]);

  async function handleLogout() {
    try {
      await logout();
    } catch {
      /* still clear local session */
    }
    clearStoredStudentProfile();
    navigate('/sign-in', { replace: true });
  }

  const modalPosterSrc = modalModule ? getModuleThumbnailUrl(modalModule) : undefined;
  const modalIframeSrc = modalToken
    ? streamPlaybackIframeSrc(modalToken, { autoplay: modalPlaybackStarted })
    : '';

  const paginationPageLabel = t.portal.dashboardPaginationPage
    .replace('{{current}}', String(clampedModulesPage + 1))
    .replace('{{total}}', String(modulesTotalPages));

  return (
    <div className="academy-page academy-auth-page">
      <StudentAuthNav
        active="none"
        rightSlot={
          <button type="button" className="academy-btn academy-btn-ghost" onClick={handleLogout}>
            {t.portal.dashboardLogout}
          </button>
        }
      />
      <main className="academy-auth-main academy-dashboard-main">
        <section className="academy-dashboard-section" aria-labelledby="dashboard-welcome">
          <header className="academy-dashboard-hero">
            <p className="academy-dashboard-kicker">{t.portal.studentArea}</p>
            <h1 id="dashboard-welcome" className="academy-dashboard-title">
              {welcome}
            </h1>
          </header>

          <div className="academy-dashboard-modules-head">
            <h2 className="academy-dashboard-modules-title" id="modules-heading">
              {t.portal.dashboardModules}
            </h2>
            {modules && modules.length > 0 ? (
              <span className="academy-dashboard-count" aria-hidden="true">
                {modules.length}
              </span>
            ) : null}
          </div>

          {modules === undefined && !loadError ? (
            <ul
              className="academy-dashboard-grid academy-dashboard-grid--video academy-dashboard-grid--fixed-3 academy-dashboard-grid--skeleton"
              aria-busy="true"
              aria-live="polite"
              aria-label={t.portal.loading}
            >
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <li key={i}>
                  <div className="academy-dashboard-skeleton-video" />
                </li>
              ))}
            </ul>
          ) : null}

          {loadError ? (
            <p className="academy-dashboard-state academy-dashboard-state--error" role="alert">
              {loadError}
            </p>
          ) : null}

          {!loadError && modules && modules.length === 0 ? (
            <p className="academy-dashboard-state">{t.portal.dashboardEmpty}</p>
          ) : null}

          {sortedModules.length > 0 ? (
            <>
              <ul
                className="academy-dashboard-grid academy-dashboard-grid--video academy-dashboard-grid--fixed-3"
                aria-labelledby="modules-heading"
              >
                {pagedModules.map((m) => (
                  <DashboardModuleTile
                    key={m.id}
                    module={m}
                    onOpen={openModal}
                    watchLabel={t.portal.moduleWatch}
                  />
                ))}
              </ul>
              {modulesTotalPages > 1 ? (
                <nav className="academy-dashboard-pagination" aria-label={t.portal.dashboardPaginationAria}>
                  <button
                    type="button"
                    className="academy-btn academy-btn-ghost"
                    disabled={clampedModulesPage <= 0}
                    onClick={() => setModulesPage(Math.max(0, clampedModulesPage - 1))}
                  >
                    {t.portal.dashboardPaginationPrev}
                  </button>
                  <p className="academy-dashboard-pagination-status">{paginationPageLabel}</p>
                  <button
                    type="button"
                    className="academy-btn academy-btn-ghost"
                    disabled={clampedModulesPage >= modulesTotalPages - 1}
                    onClick={() =>
                      setModulesPage(Math.min(modulesTotalPages - 1, clampedModulesPage + 1))
                    }
                  >
                    {t.portal.dashboardPaginationNext}
                  </button>
                </nav>
              ) : null}
            </>
          ) : null}
        </section>
      </main>

      {modalModule ? (
        <div className="academy-dashboard-modal-root" role="dialog" aria-modal="true" aria-labelledby="dashboard-modal-title">
          <div className="academy-dashboard-modal-backdrop" aria-hidden="true" onClick={closeModal} />
          <div className="academy-dashboard-modal-panel">
            <div className="academy-dashboard-modal-head">
              <h2 id="dashboard-modal-title" className="academy-dashboard-modal-title">
                {modalModule.title}
              </h2>
              <button
                ref={closeBtnRef}
                type="button"
                className="academy-dashboard-modal-close"
                onClick={closeModal}
                aria-label={t.portal.dashboardModalClose}
              >
                ×
              </button>
            </div>
            <div className="academy-dashboard-modal-video">
              {modalError ? (
                <p className="academy-dashboard-modal-error" role="alert">
                  {modalError}
                </p>
              ) : null}

              {!modalError && !modalPlaybackStarted ? (
                <>
                  {modalPosterSrc ? (
                    <img
                      className="academy-dashboard-modal-poster"
                      src={modalPosterSrc}
                      alt=""
                      onError={(e) => {
                        e.currentTarget.remove();
                      }}
                    />
                  ) : null}
                  {!modalPosterSrc && modalLoading ? (
                    <div className="academy-dashboard-modal-loading" aria-busy="true" aria-live="polite" />
                  ) : null}
                  {!modalPosterSrc && !modalLoading && modalIframeSrc ? (
                    <div className="academy-dashboard-modal-poster-fallback" aria-hidden="true" />
                  ) : null}
                  {!modalLoading && modalIframeSrc ? (
                    <button
                      type="button"
                      className="academy-dashboard-modal-play-overlay"
                      onClick={() => setModalPlaybackStarted(true)}
                      aria-label={t.portal.moduleWatch}
                    >
                      <span className="academy-dashboard-modal-play-disc">
                        <span className="academy-dashboard-video-play-inner">
                          <PlayGlyph />
                        </span>
                      </span>
                    </button>
                  ) : null}
                </>
              ) : null}

              {!modalError && modalPlaybackStarted && modalIframeSrc ? (
                <iframe
                  title={modalModule.title}
                  src={modalIframeSrc}
                  allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                  allowFullScreen
                />
              ) : null}
            </div>
            <div className="academy-dashboard-modal-foot">
              <Link
                to={`/dashboard/module/${encodeURIComponent(modalModule.id)}`}
                className="academy-dashboard-modal-full-link"
                onClick={closeModal}
              >
                {t.portal.dashboardOpenFullPlayer}
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
