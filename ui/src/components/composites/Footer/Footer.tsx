import type { ReactNode } from 'react';

export interface FooterLink {
  href: string;
  label: ReactNode;
}

export interface FooterGroup {
  title: ReactNode;
  links: FooterLink[];
}

export interface FooterProps {
  brandDesc: ReactNode;
  sitemapAriaLabel?: string;
  groups: FooterGroup[];
  langLabel: ReactNode;
  langSwitch: ReactNode;
  tech: ReactNode;
  copy: ReactNode;
  fine: ReactNode;
}

export function Footer({
  brandDesc,
  sitemapAriaLabel,
  groups,
  langLabel,
  langSwitch,
  tech,
  copy,
  fine,
}: FooterProps) {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer__top">
          <div className="footer__brand">
            <span className="brand__mark">
              SHINY<span className="accent">LOGIC</span>{' '}
              <span className="brand__sub is-inline u-m-0">顯藝科技</span>
            </span>
            <p className="footer__desc">{brandDesc}</p>
          </div>

          <nav className="footer__sitemap" aria-label={sitemapAriaLabel}>
            {groups.map((group, gi) => (
              <div className="footer__group" key={gi}>
                <span className="footer__group-title mono steel">{group.title}</span>
                {group.links.map((link) => (
                  <a href={link.href} key={link.href}>
                    {link.label}
                  </a>
                ))}
              </div>
            ))}
          </nav>
        </div>

        <div className="footer__lang">
          <span className="footer__lang-label mono steel">{langLabel}</span>
          {langSwitch}
        </div>

        <div className="footer__bottom">
          <div>
            <p className="footer__tech mono">{tech}</p>
            <p className="footer__copy">{copy}</p>
          </div>
          <p className="footer__fine mono">{fine}</p>
        </div>
      </div>
    </footer>
  );
}
