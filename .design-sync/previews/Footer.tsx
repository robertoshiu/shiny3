import { Footer, LangSwitch } from 'ui';

const sitemapGroups = [
  {
    title: '公司',
    links: [
      { href: 'about.html', label: '關於' },
      { href: 'careers.html', label: '招募' },
      { href: 'contact.html', label: '聯絡' },
    ],
  },
  {
    title: '能力',
    links: [
      { href: 'solutions.html', label: '解決方案' },
      { href: 'technology.html', label: '技術' },
      { href: 'case-studies.html', label: '方法論' },
    ],
  },
];

/** Canonical footer — cream surface, full sitemap, lang switcher, mono bottom bar */
export const CanonicalFooter = () => (
  <Footer
    brandDesc="We build the intelligence layer of the modern wafer fab."
    sitemapAriaLabel="網站地圖"
    groups={sitemapGroups}
    langLabel="語言 / LANGUAGE"
    langSwitch={<LangSwitch lang="zh-Hant" ariaLabel="語言切換" />}
    tech="USD 1 = RMB 7.2（規劃匯率）· 金額單位 RMB 萬 · 報價基準 2026 Q2"
    copy="© 2026 顯藝科技 ShinyLogic. All rights reserved."
    fine="FAB300 REFERENCE BUILD · CapEx 一次性 RMB 4.35 億 · 3 年 TCO RMB 6.07 億"
  />
);

/** Dark-theme footer — espresso canvas variant */
export const DarkFooter = () => (
  <div data-theme="dark" style={{ background: 'var(--bg-canvas, #1C1611)' }}>
    <Footer
      brandDesc="智能晶圓廠 IT/OT 全棧系統整合商"
      sitemapAriaLabel="網站地圖"
      groups={sitemapGroups}
      langLabel="語言 / LANGUAGE"
      langSwitch={<LangSwitch lang="en" ariaLabel="Language" />}
      tech="USD 1 = RMB 7.2（規劃匯率）· 金額單位 RMB 萬 · 報價基準 2026 Q2"
      copy="© 2026 顯藝科技 ShinyLogic. All rights reserved."
      fine="FAB300 REFERENCE BUILD · CapEx 一次性 RMB 4.35 億 · 3 年 TCO RMB 6.07 億"
    />
  </div>
);
