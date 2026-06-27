import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Footer } from './Footer';

describe('Footer', () => {
  it('renders brand, sitemap groups, lang slot and the bottom bar', () => {
    const { container } = render(
      <Footer
        brandDesc="We build the intelligence layer."
        sitemapAriaLabel="網站地圖"
        groups={[
          { title: '公司', links: [{ href: 'about.html', label: '關於' }, { href: 'careers.html', label: '招募' }] },
          { title: '聯絡', links: [{ href: 'contact.html', label: '聯絡' }] },
        ]}
        langLabel="語言 / LANGUAGE"
        langSwitch={<div data-testid="lang-slot" />}
        tech="交付範疇依合約確認"
        copy="© 2026 顯藝科技 ShinyLogic."
        fine="FAB300 REFERENCE BUILD"
      />,
    );
    expect(container.querySelector('footer.footer')).not.toBeNull();
    expect(container.querySelector('.footer__brand .brand__mark .accent')?.textContent).toBe('LOGIC');
    expect(container.querySelectorAll('.footer__group')).toHaveLength(2);
    expect(container.querySelector('.footer__sitemap')?.getAttribute('aria-label')).toBe('網站地圖');
    expect(container.querySelector('[data-testid="lang-slot"]')).not.toBeNull();
    expect(container.querySelector('.footer__copy')?.textContent).toBe('© 2026 顯藝科技 ShinyLogic.');
  });
});
