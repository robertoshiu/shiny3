import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, fireEvent, cleanup } from '@testing-library/react';
import { Nav } from './Nav';

afterEach(cleanup);

const links = [
  { href: 'about.html', label: '關於' },
  { href: 'solutions.html', label: '解決方案' },
];

describe('Nav', () => {
  it('renders brand, links (desktop + mobile mirror), CTA and the toggle', () => {
    const { container } = render(
      <Nav links={links} ctaHref="contact.html" ctaLabel="預約諮詢" menuOpenLabel="開啟選單" menuCloseLabel="關閉選單" />,
    );
    expect(container.querySelector('.brand')).not.toBeNull();
    expect(container.querySelectorAll('.nav__link')).toHaveLength(2);
    expect(container.querySelector('.nav__cta')?.getAttribute('href')).toBe('contact.html');
    const toggle = container.querySelector('#navToggle');
    expect(toggle?.getAttribute('aria-expanded')).toBe('false');
    expect(toggle?.getAttribute('aria-label')).toBe('開啟選單');
  });

  it('toggles the mobile menu open state and aria-label on click', () => {
    const { container } = render(
      <Nav links={links} menuOpenLabel="開啟選單" menuCloseLabel="關閉選單" />,
    );
    const toggle = container.querySelector('#navToggle')!;
    fireEvent.click(toggle);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(toggle.getAttribute('aria-label')).toBe('關閉選單');
    expect(container.querySelector('#navMobile')?.className).toContain('is-open');
  });

  it('forceScrolled renders the scrolled nav variant', () => {
    const { container } = render(<Nav links={links} forceScrolled />);
    expect(container.querySelector('.nav')?.className).toContain('is-scrolled');
  });
});
