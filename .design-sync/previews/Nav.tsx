import { Nav } from 'ui';

const fabLinks = [
  { href: 'about.html', label: '關於' },
  { href: 'solutions.html', label: '解決方案' },
  { href: 'technology.html', label: '技術' },
  { href: 'case-studies.html', label: '方法論' },
  { href: 'careers.html', label: '招募' },
];

// The nav is a position:fixed floating pill. A `transform` on a wrapper makes it
// the containing block for the fixed element, so the pill renders inside the
// preview card instead of escaping to the viewport top.
const Frame = ({ children }: { children: any }) => (
  <div style={{ position: 'relative', transform: 'translateZ(0)', minHeight: '104px', width: '100%' }}>
    {children}
  </div>
);

/** Canonical floating pill nav — default (unscrolled) state */
export const CanonicalNav = () => (
  <Frame>
    <Nav
      links={fabLinks}
      ctaHref="contact.html"
      ctaLabel="預約諮詢"
      menuOpenLabel="開啟選單"
      menuCloseLabel="關閉選單"
      lang="zh-Hant"
      langAriaLabel="語言切換"
      ariaPrimary="主要導覽"
      brandAriaHome="ShinyLogic 首頁"
    />
  </Frame>
);

/** Scrolled variant — elevated shadow + backdrop blur active */
export const ScrolledNav = () => (
  <Frame>
    <Nav
      links={fabLinks}
      ctaHref="contact.html"
      ctaLabel="預約諮詢"
      menuOpenLabel="開啟選單"
      menuCloseLabel="關閉選單"
      lang="en"
      langAriaLabel="Language"
      ariaPrimary="Primary navigation"
      forceScrolled
    />
  </Frame>
);
