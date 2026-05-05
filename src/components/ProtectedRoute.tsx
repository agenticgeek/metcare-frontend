import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { ApiRequestError, listModules } from '@/lib/api';
import { clearStoredStudentProfile, readStoredStudentProfile } from '@/lib/studentDisplay';
import { StudentAuthNav } from '@/student-portal/StudentAuthNav';
import '@/academy-platform/academy.css';

export default function ProtectedRoute() {
  // If a profile is already in localStorage (user just logged in or returning user),
  // skip the API probe — the cookie is fresh and DashboardPage will do the only
  // listModules() call. This prevents a race where the probe fires before the
  // session cookie is stable immediately after login.
  const [state, setState] = useState<'loading' | 'ok' | 'guest'>(() =>
    readStoredStudentProfile() ? 'ok' : 'loading',
  );

  useEffect(() => {
    // Only probe the API when there is no stored profile (e.g. direct URL access
    // with a potentially live cookie but cleared localStorage).
    if (state !== 'loading') return;
    let cancelled = false;
    listModules()
      .then(() => {
        if (!cancelled) setState('ok');
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        if (err instanceof ApiRequestError && err.status === 401) {
          clearStoredStudentProfile();
        }
        setState('guest');
      });
    return () => {
      cancelled = true;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (state === 'loading') {
    return (
      <div className="academy-page academy-auth-page">
        <StudentAuthNav active="none" />
        <main className="academy-auth-main academy-dashboard-main" aria-busy="true">
          <section className="academy-dashboard-section">
            <ul
              className="academy-dashboard-grid academy-dashboard-grid--skeleton"
              aria-busy="true"
              aria-live="polite"
            >
              {[0, 1, 2].map((i) => (
                <li key={i}>
                  <div className="academy-dashboard-skeleton-video" />
                </li>
              ))}
            </ul>
          </section>
        </main>
      </div>
    );
  }

  if (state === 'guest') {
    return <Navigate to="/sign-in" replace />;
  }

  return <Outlet />;
}
