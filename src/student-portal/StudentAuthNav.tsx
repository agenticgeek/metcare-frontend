import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAcademyNavSession } from '@/academy-platform/useAcademyNavSession';
import { firstNameFromFull } from '@/lib/studentDisplay';
import { ACADEMY_BRAND_LOGO_SRC } from '@/academy-platform/brandAssets';
import { getAcademyCopy } from '../academy-platform/academyCopy';
import { useLang } from '../useLang';
import '../academy-platform/academy.css';

export function StudentAuthNav({
  active,
  rightSlot,
}: {
  active: 'sign-in' | 'none';
  rightSlot?: ReactNode;
}) {
  const { lang, setLang } = useLang();
  const t = getAcademyCopy(lang);
  const { pathname } = useLocation();
  const { authed, displayName, sessionPending } = useAcademyNavSession();
  const academyLang = lang === 'fr' ? 'fr' : 'en';

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

  return (
    <nav className="academy-auth-screen-nav">
      <div className="academy-auth-screen-nav-inner">
        <Link className="academy-brand academy-brand--image" to="/academy" aria-label={t.nav.brandAria}>
          <img className="academy-brand-logo" src={ACADEMY_BRAND_LOGO_SRC} alt="" decoding="async" />
        </Link>
        <div className="academy-auth-screen-nav-right">
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
          <div className="academy-auth-screen-links" aria-busy={sessionPending}>
            <Link to="/academy/formations">{t.nav.training}</Link>
            {sessionPending ? (
              <span
                className="academy-nav-session-pending academy-nav-session-pending--auth-screen"
                aria-hidden="true"
              />
            ) : authed ? (
              <Link
                className={[
                  'academy-nav-profile',
                  'academy-auth-nav-profile',
                  pathname.startsWith('/dashboard') ? 'is-active' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                to="/dashboard"
                aria-label={`${t.portal.studentArea} — ${profileLabel}`}
              >
                <span className="academy-nav-profile-avatar" aria-hidden="true">
                  {profileInitial}
                </span>
                <span className="academy-nav-profile-name">{profileLabel}</span>
              </Link>
            ) : (
              <Link
                className={active === 'sign-in' || pathname === '/sign-in' ? 'is-active' : undefined}
                to="/sign-in"
              >
                {t.nav.logIn}
              </Link>
            )}
            {rightSlot}
          </div>
        </div>
      </div>
    </nav>
  );
}
