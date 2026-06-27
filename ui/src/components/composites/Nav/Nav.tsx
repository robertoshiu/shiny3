import { useEffect, useState } from 'react';
import type { MouseEvent, ReactNode } from 'react';
import { cx } from '../../../lib/cx';
import { Brand } from '../../primitives/Brand/Brand';
import { LangSwitch, type Lang } from '../LangSwitch/LangSwitch';
import { ThemeToggle, type Theme } from '../ThemeToggle/ThemeToggle';

export interface NavLink {
  href: string;
  label: ReactNode;
}

export interface NavProps {
  links: NavLink[];
  ariaPrimary?: string;
  brandAriaHome?: string;
  ctaHref?: string;
  ctaLabel?: ReactNode;
  menuOpenLabel?: string;
  menuCloseLabel?: string;
  lang?: Lang;
  onLangChange?: (lang: Lang) => void;
  langAriaLabel?: string;
  theme?: Theme;
  onThemeToggle?: () => void;
  themeAriaLabel?: string;
  forceScrolled?: boolean;
  defaultMobileOpen?: boolean;
}

export function Nav({
  links,
  ariaPrimary,
  brandAriaHome,
  ctaHref = 'contact.html',
  ctaLabel,
  menuOpenLabel,
  menuCloseLabel,
  lang,
  onLangChange,
  langAriaLabel,
  theme,
  onThemeToggle,
  themeAriaLabel,
  forceScrolled,
  defaultMobileOpen = false,
}: NavProps) {
  const [open, setOpen] = useState(defaultMobileOpen);
  const [scrolled, setScrolled] = useState(forceScrolled ?? false);

  useEffect(() => {
    if (forceScrolled !== undefined || typeof window === 'undefined') return;
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [forceScrolled]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const onAnchorClick = (href: string) => (e: MouseEvent) => {
    if (!href.startsWith('#') || href.length < 2 || typeof document === 'undefined') return;
    const targetEl = document.querySelector(href);
    if (!targetEl) return;
    e.preventDefault();
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    targetEl.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    try {
      history.pushState(null, '', href);
    } catch {
      /* sandboxed iframe — ignore */
    }
  };

  const themeToggle = (mobile: boolean) => (
    <ThemeToggle theme={theme} onToggle={onThemeToggle} ariaLabel={themeAriaLabel} mobile={mobile} />
  );
  const langSwitch = (mobile: boolean) => (
    <LangSwitch lang={lang} onLangChange={onLangChange} ariaLabel={langAriaLabel} mobile={mobile} />
  );

  return (
    <header>
      <nav className={cx('nav', scrolled && 'is-scrolled')} aria-label={ariaPrimary}>
        <div className="nav__inner">
          <Brand ariaHome={brandAriaHome} />

          <ul className="nav__links">
            {links.map((link) => (
              <li key={link.href}>
                <a className="nav__link" href={link.href} onClick={onAnchorClick(link.href)}>
                  {link.label}
                </a>
              </li>
            ))}

            <li className="nav__lang">{langSwitch(false)}</li>
            <li className="nav__theme">{themeToggle(false)}</li>

            <li>
              <a className="btn btn--primary nav__cta" href={ctaHref}>
                {ctaLabel} <span className="btn__arrow" aria-hidden="true">→</span>
              </a>
            </li>
          </ul>

          <button
            className="nav__toggle"
            id="navToggle"
            aria-label={open ? menuCloseLabel : menuOpenLabel}
            aria-expanded={open ? 'true' : 'false'}
            aria-controls="navMobile"
            onClick={() => setOpen((v) => !v)}
          >
            <span aria-hidden="true" />
          </button>
        </div>
      </nav>

      <div className={cx('nav__mobile', open && 'is-open')} id="navMobile">
        {links.map((link) => (
          <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
            {link.label}
          </a>
        ))}

        <div className="nav__mobile-theme">{themeToggle(true)}</div>
        {langSwitch(true)}

        <a className="btn btn--primary" href={ctaHref} onClick={() => setOpen(false)}>
          {ctaLabel} <span className="btn__arrow" aria-hidden="true">→</span>
        </a>
      </div>
    </header>
  );
}
