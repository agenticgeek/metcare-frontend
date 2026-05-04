import type { StudentProfile } from '@/lib/api';

/** Cached student profile (persists across tabs / reloads until logout or 401). */
export const STUDENT_PROFILE_STORAGE_KEY = 'met_student_profile';

/** Legacy sessionStorage key (plain full name) — migrated once into localStorage. */
const LEGACY_SESSION_DISPLAY_NAME_KEY = 'met_student_display_name';

export type StoredStudentProfile = Pick<StudentProfile, 'id' | 'full_name' | 'email'>;

function safeParseProfile(json: string): StoredStudentProfile | null {
  try {
    const o = JSON.parse(json) as Record<string, unknown>;
    if (
      typeof o.full_name === 'string' &&
      typeof o.email === 'string' &&
      typeof o.id === 'string'
    ) {
      return { id: o.id, full_name: o.full_name, email: o.email };
    }
  } catch {
    /* ignore */
  }
  return null;
}

export function readStoredStudentProfile(): StoredStudentProfile | null {
  try {
    const raw = localStorage.getItem(STUDENT_PROFILE_STORAGE_KEY);
    if (raw) {
      const parsed = safeParseProfile(raw);
      if (parsed) return parsed;
    }
    const legacyName = sessionStorage.getItem(LEGACY_SESSION_DISPLAY_NAME_KEY)?.trim();
    if (legacyName) {
      const migrated: StoredStudentProfile = { id: '', email: '', full_name: legacyName };
      writeStoredStudentProfile(migrated);
      sessionStorage.removeItem(LEGACY_SESSION_DISPLAY_NAME_KEY);
      return migrated;
    }
  } catch {
    /* private mode */
  }
  return null;
}

export function writeStoredStudentProfile(profile: StoredStudentProfile): void {
  try {
    localStorage.setItem(STUDENT_PROFILE_STORAGE_KEY, JSON.stringify(profile));
    sessionStorage.removeItem(LEGACY_SESSION_DISPLAY_NAME_KEY);
  } catch {
    /* private mode */
  }
}

export function persistStudentProfileFromAuth(profile: StudentProfile): void {
  writeStoredStudentProfile({
    id: profile.id,
    full_name: profile.full_name,
    email: profile.email,
  });
}

export function clearStoredStudentProfile(): void {
  try {
    localStorage.removeItem(STUDENT_PROFILE_STORAGE_KEY);
    sessionStorage.removeItem(LEGACY_SESSION_DISPLAY_NAME_KEY);
  } catch {
    /* private mode */
  }
}

export function getStoredDisplayName(): string {
  return readStoredStudentProfile()?.full_name?.trim() ?? '';
}

export function firstNameFromFull(full: string): string {
  const p = full.trim().split(/\s+/);
  return p[0] || full || '—';
}
