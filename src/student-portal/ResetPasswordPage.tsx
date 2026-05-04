import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { persistStudentProfileFromAuth } from '@/lib/studentDisplay';
import { checkAuthToken, resetPassword } from '@/lib/api';
import type { AcademyCopy } from '@/academy-platform/academyCopy';
import type { AuthTokenStatus } from '@/lib/api';
import { getAcademyCopy } from '@/academy-platform/academyCopy';
import { useLang } from '@/useLang';
import { PasswordRevealButton } from './PasswordRevealButton';
import { StudentAuthNav } from './StudentAuthNav';
import '@/academy-platform/academy.css';

function messageForTokenStatus(copy: AcademyCopy, status: AuthTokenStatus): string {
  switch (status) {
    case 'expired':
      return copy.portal.tokenExpired;
    case 'used':
      return copy.portal.tokenUsed;
    default:
      return copy.portal.tokenInvalid;
  }
}

export default function ResetPasswordPage() {
  const { lang } = useLang();
  const t = getAcademyCopy(lang);
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get('token')?.trim() ?? '';

  const [checkState, setCheckState] = useState<'loading' | 'ready' | 'bad'>('loading');
  const [badMessage, setBadMessage] = useState('');

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const copy = getAcademyCopy(lang);
    if (!token) {
      setCheckState('bad');
      setBadMessage(copy.portal.tokenMissing);
      return;
    }
    let cancelled = false;
    checkAuthToken(token, 'reset')
      .then((res) => {
        if (cancelled) return;
        if (res.data.status === 'valid') setCheckState('ready');
        else {
          setBadMessage(messageForTokenStatus(copy, res.data.status));
          setCheckState('bad');
        }
      })
      .catch(() => {
        if (!cancelled) {
          setBadMessage(copy.portal.tokenInvalid);
          setCheckState('bad');
        }
      });
    return () => {
      cancelled = true;
    };
  }, [token, lang]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError(t.portal.passwordTooShort);
      return;
    }
    if (password !== confirm) {
      setError(t.portal.passwordsMismatch);
      return;
    }
    setPending(true);
    try {
      const res = await resetPassword(token, password, confirm);
      persistStudentProfileFromAuth(res.data);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : t.portal.signInGeneric);
    } finally {
      setPending(false);
    }
  }

  if (checkState === 'loading') {
    return (
      <div className="academy-page academy-auth-page">
        <StudentAuthNav active="none" />
        <main className="academy-auth-main" style={{ paddingTop: 120, textAlign: 'center' }}>
          <p>{t.portal.loading}</p>
        </main>
      </div>
    );
  }

  if (checkState === 'bad') {
    return (
      <div className="academy-page academy-auth-page">
        <StudentAuthNav active="none" />
        <main className="academy-auth-main">
          <section className="academy-auth-card">
            <div className="academy-auth-heading">
              <h1>{t.portal.resetPasswordTitle}</h1>
              <p role="alert">{badMessage}</p>
            </div>
            <p className="academy-auth-switch">
              <Link to="/sign-in">{t.portal.forgotBackSignIn}</Link>
            </p>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="academy-page academy-auth-page">
      <StudentAuthNav active="none" />
      <main className="academy-auth-main">
        <section className="academy-auth-card academy-auth-card-large" aria-labelledby="reset-title">
          <div className="academy-auth-card-glow" aria-hidden="true" />
          <div className="academy-auth-heading">
            <span>{t.auth.loginKicker}</span>
            <h1 id="reset-title">{t.portal.resetPasswordTitle}</h1>
            <p>{t.auth.loginLead}</p>
          </div>

          <form className="academy-auth-form" onSubmit={onSubmit}>
            {error ? (
              <p className="academy-auth-inline-error" role="alert">
                {error}
              </p>
            ) : null}
            <label>
              <span>{t.portal.newPassword}</span>
              <div className="academy-auth-password-row">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
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
            <label>
              <span>{t.portal.confirmPassword}</span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                autoComplete="new-password"
                disabled={pending}
              />
            </label>
            <button className="academy-btn academy-btn-primary academy-auth-submit" type="submit" disabled={pending}>
              {pending ? t.portal.submitting : t.portal.resetPasswordSubmit}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
