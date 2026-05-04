import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { ApiRequestError, listModules } from '@/lib/api';
import { clearStoredStudentProfile } from '@/lib/studentDisplay';
import { StudentAuthNav } from '@/student-portal/StudentAuthNav';
import '@/academy-platform/academy.css';

export default function ProtectedRoute() {
  const [state, setState] = useState<'loading' | 'ok' | 'guest'>('loading');

  useEffect(() => {
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
