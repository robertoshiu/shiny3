import { useEffect, useState } from 'react';
import { cx } from '../../../lib/cx';

export type Theme = 'dark' | 'light';

export interface ThemeToggleProps {
  theme?: Theme;
  onToggle?: () => void;
  ariaLabel?: string;
  mobile?: boolean;
  target?: () => HTMLElement | null;
}

const MoonIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const SunIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </svg>
);

export function ThemeToggle({ theme, onToggle, ariaLabel, mobile = false, target }: ThemeToggleProps) {
  const controlled = theme !== undefined;
  const [internal, setInternal] = useState<Theme>(theme ?? 'dark');

  // Uncontrolled only: read the existing attribute after mount; never write here.
  useEffect(() => {
    if (controlled || typeof document === 'undefined') return;
    const el = target?.() ?? document.documentElement;
    const current = el.getAttribute('data-theme');
    if (current === 'light' || current === 'dark') setInternal(current);
  }, [controlled, target]);

  const current = controlled ? (theme as Theme) : internal;

  const handleClick = () => {
    if (controlled) {
      onToggle?.();
      return;
    }
    const next: Theme = current === 'dark' ? 'light' : 'dark';
    setInternal(next);
    if (typeof document !== 'undefined') {
      (target?.() ?? document.documentElement).setAttribute('data-theme', next);
      try {
        localStorage.setItem('sl-theme', next);
      } catch {
        /* private mode / sandbox — ignore */
      }
    }
  };

  return (
    <button
      type="button"
      className={cx('theme-toggle', mobile && 'theme-toggle--mobile')}
      aria-pressed={current === 'dark' ? 'true' : 'false'}
      aria-label={ariaLabel}
      onClick={handleClick}
    >
      <span className="theme-toggle__icon theme-toggle__icon--moon" aria-hidden="true">
        {MoonIcon}
      </span>
      <span className="theme-toggle__icon theme-toggle__icon--sun" aria-hidden="true">
        {SunIcon}
      </span>
    </button>
  );
}
