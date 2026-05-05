import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { clearStoredStudentProfile, persistStudentProfileFromAuth } from '@/lib/studentDisplay';
import { ApiRequestError, getCurrentStudent, isAuthError, login } from '@/lib/api';
import { getAcademyCopy } from '@/academy-platform/academyCopy';
import { useLang } from '@/useLang';
import type { Lang } from '@/langContext';
import { PasswordRevealButton } from './PasswordRevealButton';
import { StudentAuthNav } from './StudentAuthNav';
import '@/academy-platform/academy.css';

function apiLocale(lang: Lang): 'fr' | 'en' {
  return lang === 'fr' ? 'fr' : 'en';
}

export default function SignInPage() {
  const { lang } = useLang();
  const t = getAcademyCopy(lang);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getCurrentStudent()
      .then((res) => {
        persistStudentProfileFromAuth(res.data);
        if (!cancelled) navigate('/dashboard', { replace: true });
      })
      .catch((err: unknown) => {
        if (isAuthError(err)) clearStoredStudentProfile();
      });
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !password) {
      setError(t.portal.pleaseFillAll);
      return;
    }
    setPending(true);
    try {
      const res = await login(email.trim(), password, apiLocale(lang));
      persistStudentProfileFromAuth(res.data);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const msg = err instanceof ApiRequestError ? err.message : t.portal.signInGeneric;
      setError(msg);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="academy-page academy-auth-page">
      <StudentAuthNav active="sign-in" />
      <main className="academy-auth-main">
        <section className="academy-auth-card" aria-labelledby="sign-in-title">
          <div className="academy-auth-card-glow" aria-hidden="true" />
          <div className="academy-auth-heading">
            <span>{t.auth.loginKicker}</span>
            <h1 id="sign-in-title">{t.auth.loginTitle}</h1>
            <p>{t.auth.loginLead}</p>
          </div>

          <form className="academy-auth-form" onSubmit={onSubmit}>
            {error ? (
              <p className="academy-auth-inline-error" role="alert">
                {error}
              </p>
            ) : null}
            <label>
              <span>{t.auth.email}</span>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                disabled={pending}
              />
            </label>

            <label>
              <span className="academy-auth-label-row">
                {t.auth.password}
                <Link to="/forgot-password">{t.auth.forgotPassword}</Link>
              </span>
              <div className="academy-auth-password-row">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  disabled={pending}
                />
                <PasswordRevealButton
                  visible={showPassword}
                  onToggle={() => setShowPassword((v) => !v)}
                  labelShow={t.portal.showPassword}
                  labelHide={t.portal.hidePassword}
                  disabled={pending}
                />
              </div>
            </label>

            <button className="academy-btn academy-btn-primary academy-auth-submit" type="submit" disabled={pending}>
              {pending ? t.portal.submitting : t.auth.submitLogin}
            </button>
          </form>

          <p className="academy-auth-switch">
            <Link to="/academy">{t.portal.backToSite}</Link>
          </p>
        </section>
      </main>
    </div>
  );
}
