import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Marquee } from './Marquee';

describe('Marquee', () => {
  it('renders two identical groups for a seamless loop', () => {
    const { container } = render(<Marquee ariaLabel="技術夥伴與標準" items={['IEC 62443', 'SEMI E187']} />);
    expect(container.querySelector('.marquee')?.getAttribute('role')).toBe('region');
    const groups = container.querySelectorAll('.marquee__group');
    expect(groups).toHaveLength(2);
    expect(groups[0].getAttribute('aria-hidden')).toBe('false');
    expect(groups[1].getAttribute('aria-hidden')).toBe('true');
    expect(container.querySelectorAll('.marquee__item')).toHaveLength(4);
  });
});
