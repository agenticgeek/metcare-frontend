import { useCallback, useEffect, useState } from 'react';
import { getCurrentStudent, isAuthError } from '@/lib/api';
import {
  STUDENT_PROFILE_STORAGE_KEY,
  clearStoredStudentProfile,
  getStoredDisplayName,
  persistStudentProfileFromAuth,
} from '@/lib/studentDisplay';

/**
 * Detects student session for marketing nav: same httpOnly cookie as the dashboard.
 * Refreshes on window focus / visibility so returning from sign-in updates the bar.
 * Profile copy is only display cache; the API remains the source of truth.
 */
export function useAcademyNavSession() {
  const [initialSessionResolved, setInitialSessionResolved] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [displayName, setDisplayName] = useState(() => getStoredDisplayName());

  const refresh = useCallback(() => {
    void getCurrentStudent()
      .then((res) => {
        persistStudentProfileFromAuth(res.data);
        setAuthed(true);
        setDisplayName(getStoredDisplayName());
      })
      .catch((err: unknown) => {
        if (isAuthError(err)) {
          clearStoredStudentProfile();
        }
        setAuthed(false);
        setDisplayName('');
      })
      .finally(() => {
        setInitialSessionResolved(true);
      });
  }, []);

  useEffect(() => {
    refresh();

    const onFocus = () => refresh();
    const onVis = () => {
      if (document.visibilityState === 'visible') refresh();
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key === STUDENT_PROFILE_STORAGE_KEY || e.key === null) {
        setDisplayName(getStoredDisplayName());
        void refresh();
      }
    };

    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('storage', onStorage);
    };
  }, [refresh]);

  /** True until the first session probe finishes — avoid flashing “Log in” before cookie/session is known. */
  const sessionPending = !initialSessionResolved;

  return { authed, displayName, sessionPending };
}
