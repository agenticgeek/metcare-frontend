import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listModules } from '@/lib/api';
import type { ModuleSummary } from '@/lib/api';
import { formatModuleMetaDuration } from '@/lib/formatDuration';
import { getModuleThumbnailUrl } from '@/lib/moduleThumbnail';
import { AcademyNav } from '../AcademyNav';
import { getAcademyCopy } from '../academyCopy';
import { useAcademyNavSession } from '../useAcademyNavSession';
import { useLang } from '../../useLang';
import '../academy.css';

const revealEase = [0.22, 1, 0.36, 1] as const;
const revealViewport = { once: true, amount: 0.22 } as const;

function cardReveal(delay = 0) {
  return {
    initial: { opacity: 0, y: 26 },
    whileInView: { opacity: 1, y: 0 },
    viewport: revealViewport,
    transition: { duration: 0.6, delay, ease: revealEase },
  };
}

function IconAccount() {
  return (
    <svg className="academy-formations-step-icon" viewBox="0 0 40 40" aria-hidden="true">
      <rect x="6" y="6" width="28" height="28" rx="8" fill="rgba(106, 136, 164, 0.12)" />
      <circle cx="20" cy="16" r="5" fill="var(--cherry)" opacity="0.85" />
      <path
        d="M12 29c1.2-3.2 3.8-5 8-5s6.8 1.8 8 5"
        fill="none"
        stroke="var(--cherry)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconVideo() {
  return (
    <svg className="academy-formations-step-icon" viewBox="0 0 40 40" aria-hidden="true">
      <rect x="6" y="6" width="28" height="28" rx="8" fill="rgba(106, 136, 164, 0.12)" />
      <rect x="11" y="14" width="18" height="12" rx="2" fill="none" stroke="var(--cherry)" strokeWidth="1.4" />
      <path d="M26 17l4-2v10l-4-2" fill="var(--cherry)" opacity="0.85" />
    </svg>
  );
}

function IconCert() {
  return (
    <svg className="academy-formations-step-icon" viewBox="0 0 40 40" aria-hidden="true">
      <rect x="6" y="6" width="28" height="28" rx="8" fill="rgba(106, 136, 164, 0.12)" />
      <path
        d="M13 18l5 5 9-9"
        fill="none"
        stroke="var(--cherry)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="12" y="26" width="16" height="3" rx="1" fill="var(--silver)" opacity="0.5" />
    </svg>
  );
}

function BooksIcon() {
  return (
    <svg className="academy-formations-books" viewBox="0 0 72 56" aria-hidden="true">
      <rect x="8" y="18" width="18" height="32" rx="3" fill="#6a88a4" opacity="0.9" />
      <rect x="27" y="12" width="18" height="38" rx="3" fill="var(--cherry)" opacity="0.85" />
      <rect x="46" y="20" width="18" height="30" rx="3" fill="#decdc1" />
      <line x1="14" y1="24" x2="20" y2="24" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" />
      <line x1="33" y1="18" x2="39" y2="18" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" />
    </svg>
  );
}

const stepIcons = [IconAccount, IconVideo, IconCert];

function sortModules(a: ModuleSummary, b: ModuleSummary) {
  return a.order_index !== b.order_index ? a.order_index - b.order_index : a.id.localeCompare(b.id);
}

function PlayGlyph() {
  return (
    <svg className="academy-dashboard-play-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <polygon points="8,5 19,12 8,19" fill="currentColor" />
    </svg>
  );
}

export default function AcademyFormationsPage() {
  const { lang } = useLang();
  const t = getAcademyCopy(lang);
  const p = t.formationsPage;
  const { authed } = useAcademyNavSession();
  const [starterModules, setStarterModules] = useState<ModuleSummary[] | undefined>(undefined);

  useEffect(() => {
    if (!authed) {
      setStarterModules(undefined);
      return;
    }
    let cancelled = false;
    void listModules()
      .then((res) => {
        if (cancelled) return;
        const sorted = [...res.data].sort(sortModules);
        setStarterModules(sorted.slice(0, 3));
      })
      .catch(() => {
        if (!cancelled) setStarterModules([]);
      });
    return () => {
      cancelled = true;
    };
  }, [authed]);

  return (
    <div className="academy-page academy-formations-page" id="top">
      <AcademyNav t={t} />

      <main className="academy-formations-main">
        <header className="academy-formations-hero">
          <motion.h1 {...cardReveal(0)}>{p.title}</motion.h1>
          <motion.p className="academy-formations-lead" {...cardReveal(0.06)}>
            {p.lead1}
          </motion.p>
          <motion.p className="academy-formations-lead academy-formations-lead-secondary" {...cardReveal(0.1)}>
            {p.lead2}
          </motion.p>
        </header>

        <div className="academy-formations-divider" aria-hidden="true" />

        <div className="academy-formations-card-wrap">
          {authed ? (
            <motion.section
              className="academy-formations-card academy-formations-card--starter-modules"
              {...cardReveal(0.08)}
            >
              {starterModules === undefined ? (
                <ul className="academy-formations-starter-skel" aria-busy="true" aria-label={t.portal.loading}>
                  {[0, 1, 2].map((i) => (
                    <li key={i}>
                      <div className="academy-dashboard-skeleton-video" />
                    </li>
                  ))}
                </ul>
              ) : (starterModules?.length ?? 0) === 0 ? (
                <p className="academy-formations-starter-empty">{t.portal.dashboardEmpty}</p>
              ) : (
                <ul
                  className="academy-dashboard-grid academy-dashboard-grid--video academy-dashboard-grid--fixed-3"
                  aria-label={t.portal.dashboardTopVideos}
                >
                  {(starterModules ?? []).map((m) => {
                    const thumb = getModuleThumbnailUrl(m);
                    return (
                      <li key={m.id}>
                        <Link
                          className="academy-dashboard-video-tile academy-formations-starter-tile"
                          to={`/dashboard/module/${encodeURIComponent(m.id)}`}
                          aria-label={`${t.portal.moduleWatch}: ${m.title}`}
                        >
                          <div className="academy-dashboard-video-thumb">
                            {thumb ? (
                              <img
                                className="academy-dashboard-video-poster academy-dashboard-video-poster--loaded"
                                src={thumb}
                                alt=""
                                loading="lazy"
                                decoding="async"
                              />
                            ) : null}
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
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </motion.section>
          ) : (
            <motion.section className="academy-formations-card" {...cardReveal(0.08)}>
              <BooksIcon />
              <h2>{p.cardTitle}</h2>
              <p>{p.cardBody}</p>
              <Link className="academy-btn academy-btn-primary" to="/sign-in">
                {p.cardCta}
              </Link>
            </motion.section>
          )}
        </div>

        <motion.section className="academy-formations-how" {...cardReveal(0)}>
          <h2 className="academy-formations-how-title">{p.howTitle}</h2>
          <div className="academy-formations-steps">
            {p.howSteps.map((step, i) => {
              const Icon = stepIcons[i] ?? IconAccount;
              return (
                <motion.div
                  key={step.title}
                  className="academy-formations-step"
                  {...cardReveal(0.08 + i * 0.06)}
                >
                  <div className="academy-formations-step-icon-wrap">
                    <Icon />
                  </div>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </motion.div>
              );
            })}
          </div>
          {!authed ? (
            <div className="academy-formations-how-ctas">
              <Link className="academy-btn academy-btn-primary" to="/sign-in">
                {p.howCtaPrimary}
              </Link>
              <Link className="academy-formations-learn-more" to="/academy#training">
                {p.howLearnMore}
              </Link>
            </div>
          ) : null}
        </motion.section>

        <motion.section className="academy-formations-lead-magnet" {...cardReveal(0.06)}>
          <h2>{p.leadMagnetTitle}</h2>
          <p>{p.leadMagnetBody}</p>
          {!authed ? (
            <Link className="academy-btn academy-btn-primary" to="/academy#free">
              {p.leadMagnetCta}
            </Link>
          ) : null}
        </motion.section>
      </main>

      <footer className="academy-footer academy-formations-footer">
        <p>{t.ui.footerCopyright}</p>
      </footer>
    </div>
  );
}
