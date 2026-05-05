import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getCurrentStudent } from '@/lib/api';
import { clearStoredStudentProfile, persistStudentProfileFromAuth } from '@/lib/studentDisplay';
import { StudentAuthNav } from '@/student-portal/StudentAuthNav';
import '@/academy-platform/academy.css';

export default function ProtectedRoute() {
  const [state, setState] = useState<'loading' | 'ok' | 'guest'>('loading');

  useEffect(() => {
    let cancelled = false;
    getCurrentStudent()
      .then((res) => {
        persistStudentProfileFromAuth(res.data);
        if (!cancelled) setState('ok');
      })
      .catch(() => {
        if (cancelled) return;
        clearStoredStudentProfile();
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
