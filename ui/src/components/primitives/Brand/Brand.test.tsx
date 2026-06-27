import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Brand } from './Brand';

describe('Brand', () => {
  it('renders the brand mark, sub and FAB300 tag', () => {
    const { container } = render(<Brand ariaHome="顯藝科技 ShinyLogic 首頁" />);
    const a = container.querySelector('a.brand');
    expect(a?.getAttribute('aria-label')).toBe('顯藝科技 ShinyLogic 首頁');
    expect(container.querySelector('.brand__mark .accent')?.textContent).toBe('LOGIC');
    expect(container.querySelector('.brand__sub')?.textContent).toBe('顯藝科技');
    expect(container.querySelector('.brand__tag')?.textContent).toContain('FAB300');
  });
});
