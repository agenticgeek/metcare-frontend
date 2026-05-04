import { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '@/lib/api';
import { getAcademyCopy } from '@/academy-platform/academyCopy';
import { useLang } from '@/useLang';
import { StudentAuthNav } from './StudentAuthNav';
import '@/academy-platform/academy.css';

export default function ForgotPasswordPage() {
  const { lang } = useLang();
  const t = getAcademyCopy(lang);
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) {
      return;
    }
    setPending(true);
    try {
      await forgotPassword(email.trim());
    } catch {
      /* API always 200 for anti-enumeration; network errors ignored for same UX */
    } finally {
      setPending(false);
      setDone(true);
    }
  }

  return (
    <div className="academy-page academy-auth-page">
      <StudentAuthNav active="none" />
      <main className="academy-auth-main">
        <section className="academy-auth-card" aria-labelledby="forgot-title">
          <div className="academy-auth-card-glow" aria-hidden="true" />
          <div className="academy-auth-heading">
            <span>{t.auth.loginKicker}</span>
            <h1 id="forgot-title">{t.portal.forgotPasswordTitle}</h1>
            <p>{t.portal.forgotPasswordLead}</p>
          </div>

          {done ? (
            <div className="academy-auth-form">
              <p role="status">{t.portal.forgotSuccess}</p>
              <Link className="academy-btn academy-btn-primary academy-auth-submit" to="/sign-in">
                {t.portal.forgotBackSignIn}
              </Link>
            </div>
          ) : (
            <form className="academy-auth-form" onSubmit={onSubmit}>
              <label>
                <span>{t.auth.email}</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  disabled={pending}
                />
              </label>
              <button className="academy-btn academy-btn-primary academy-auth-submit" type="submit" disabled={pending}>
                {pending ? t.portal.submitting : t.portal.forgotSubmit}
              </button>
            </form>
          )}

          <p className="academy-auth-switch">
            <Link to="/sign-in">{t.portal.forgotBackSignIn}</Link>
          </p>
        </section>
      </main>
    </div>
  );
}
