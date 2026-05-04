import { useCallback, useMemo, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AcademyFormationsPage, AcademyLandingPage, MasterclassDetails } from './academy-platform';
import ProtectedRoute from './components/ProtectedRoute';
import MetaPixelRouteTracker from './components/MetaPixelRouteTracker';
import { LangContext } from './langContext';
import type { Lang } from './langContext';
import SignInPage from './student-portal/SignInPage';
import ForgotPasswordPage from './student-portal/ForgotPasswordPage';
import ActivatePage from './student-portal/ActivatePage';
import ResetPasswordPage from './student-portal/ResetPasswordPage';
import DashboardPage from './student-portal/DashboardPage';
import ModulePlayerPage from './student-portal/ModulePlayerPage';

const STUDENT_LANG_KEY = 'met_student_lang';

function readStoredLang(): Lang {
  try {
    const s = localStorage.getItem(STUDENT_LANG_KEY);
    if (s === 'en' || s === 'fr' || s === 'es') return s;
  } catch {
    /* private mode */
  }
  return 'fr';
}

function App() {
  const [lang, setLangState] = useState<Lang>(readStoredLang);
  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(STUDENT_LANG_KEY, l);
    } catch {
      /* ignore */
    }
  }, []);
  const langValue = useMemo(() => ({ lang, setLang }), [lang, setLang]);

  return (
    <LangContext.Provider value={langValue}>
      <BrowserRouter>
        <MetaPixelRouteTracker />
        <Routes>
          <Route path="/" element={<Navigate to="/academy" replace />} />
          <Route path="/diamond-incision" element={<Navigate to="/academy" replace />} />
          <Route path="/diamond-metcare" element={<Navigate to="/academy" replace />} />
          <Route path="/academy" element={<AcademyLandingPage />} />
          <Route path="/academy/formations" element={<AcademyFormationsPage />} />
          <Route path="/academy/login" element={<Navigate to="/sign-in" replace />} />
          <Route path="/academy/forgot-password" element={<Navigate to="/forgot-password" replace />} />
          <Route path="/academy/create-account" element={<Navigate to="/sign-in" replace />} />
          <Route path="/academy/masterclass" element={<MasterclassDetails />} />
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/register" element={<Navigate to="/sign-in" replace />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/activate" element={<ActivatePage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/dashboard/module/:id" element={<ModulePlayerPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </LangContext.Provider>
  );
}

export default App;
