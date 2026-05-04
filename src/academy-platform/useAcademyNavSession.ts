import { useCallback, useEffect, useState } from 'react';
import { ApiRequestError, listModules } from '@/lib/api';
import {
  STUDENT_PROFILE_STORAGE_KEY,
  clearStoredStudentProfile,
  getStoredDisplayName,
} from '@/lib/studentDisplay';

/**
 * Detects student session for marketing nav: same httpOnly cookie as the dashboard.
 * Refreshes on window focus / visibility so returning from sign-in updates the bar.
 * Profile copy lives in localStorage and is only cleared on logout or 401 (not on network blips).
 */
export function useAcademyNavSession() {
  const [initialSessionResolved, setInitialSessionResolved] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [displayName, setDisplayName] = useState(() => getStoredDisplayName());

  const refresh = useCallback(() => {
    void listModules()
      .then(() => {
        setAuthed(true);
        setDisplayName(getStoredDisplayName());
      })
      .catch((err: unknown) => {
        if (err instanceof ApiRequestError && err.status === 401) {
          clearStoredStudentProfile();
          setAuthed(false);
          setDisplayName('');
          return;
        }
        setDisplayName(getStoredDisplayName());
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
