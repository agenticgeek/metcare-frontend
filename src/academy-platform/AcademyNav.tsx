import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { AcademyCopy } from './academyCopy';
import { ACADEMY_BRAND_LOGO_SRC } from './brandAssets';
import { firstNameFromFull } from '@/lib/studentDisplay';
import { useLang } from '../useLang';
import { useAcademyNavSession } from './useAcademyNavSession';

export function AcademyNav({ t }: { t: AcademyCopy }) {
  const [scrolled, setScrolled] = useState(false);
  const { lang, setLang } = useLang();
  const { pathname } = useLocation();
  const { authed, displayName, sessionPending } = useAcademyNavSession();

  const profileLabel = useMemo(() => {
    const raw = displayName.trim();
    if (!raw) return t.portal.studentArea;
    return firstNameFromFull(raw);
  }, [displayName, t.portal.studentArea]);

  const profileInitial = useMemo(() => {
    const raw = displayName.trim();
    if (raw) return firstNameFromFull(raw).charAt(0).toLocaleUpperCase();
    return 'M';
  }, [displayName]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const academyLang = lang === 'fr' ? 'fr' : 'en';
  const formationsActive = pathname === '/academy/formations';

  return (
    <nav className={`academy-nav${scrolled ? ' scrolled' : ''}`}>
      <div className="academy-nav-inner">
        <Link className="academy-brand academy-brand--image" to="/academy" aria-label={t.nav.brandAria}>
          <img className="academy-brand-logo" src={ACADEMY_BRAND_LOGO_SRC} alt="" decoding="async" />
        </Link>
        <div className="academy-nav-right">
          <div className="academy-lang-toggle" role="group" aria-label="Language">
            <button
              type="button"
              className={academyLang === 'fr' ? 'is-active' : undefined}
              onClick={() => setLang('fr')}
            >
              FR
            </button>
            <button
              type="button"
              className={academyLang === 'en' ? 'is-active' : undefined}
              onClick={() => setLang('en')}
            >
              EN
            </button>
          </div>
          <Link
            className={formationsActive ? 'is-active' : undefined}
            to="/academy/formations"
          >
            {t.nav.training}
          </Link>
          <Link to="/academy#free">{t.nav.freeVideos}</Link>
          <Link to="/academy#faq">{t.nav.faq}</Link>
          <div className="academy-auth" aria-busy={sessionPending}>
            {sessionPending ? (
              <span
                className="academy-nav-session-pending academy-nav-session-pending--marketing"
                aria-hidden="true"
              />
            ) : authed ? (
              <Link
                className="academy-nav-profile"
                to="/dashboard"
                aria-label={`${t.portal.studentArea} — ${profileLabel}`}
              >
                <span className="academy-nav-profile-avatar" aria-hidden="true">
                  {profileInitial}
                </span>
                <span className="academy-nav-profile-name">{profileLabel}</span>
              </Link>
            ) : (
              <Link className="academy-btn academy-btn-ghost" to="/sign-in">
                {t.nav.logIn}
              </Link>
            )}
            {!authed ? (
              <Link className="academy-btn academy-btn-primary" to="/academy/formations">
                {t.nav.training}
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </nav>
  );
}
