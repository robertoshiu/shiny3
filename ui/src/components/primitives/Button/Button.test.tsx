import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders an anchor with primary variant and a trailing arrow', () => {
    const { container } = render(
      <Button href="contact.html" arrow="→">預約諮詢</Button>,
    );
    const a = container.querySelector('a.btn');
    expect(a?.className).toBe('btn btn--primary');
    expect(a?.getAttribute('href')).toBe('contact.html');
    const arrow = container.querySelector('.btn__arrow');
    expect(arrow?.getAttribute('aria-hidden')).toBe('true');
    expect(arrow?.textContent).toBe('→');
  });

  it('renders a <button> with ghost + block and no arrow', () => {
    const { container } = render(
      <Button as="button" variant="ghost" block type="submit">送出</Button>,
    );
    const btn = container.querySelector('button.btn');
    expect(btn?.className).toBe('btn btn--ghost btn--block');
    expect(btn?.getAttribute('type')).toBe('submit');
    expect(container.querySelector('.btn__arrow')).toBeNull();
  });
});
