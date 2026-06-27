import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Kicker } from './Kicker';

describe('Kicker', () => {
  it('renders a span by default', () => {
    const { container } = render(<Kicker>02 · BY THE NUMBERS</Kicker>);
    const el = container.querySelector('.kicker');
    expect(el?.tagName).toBe('SPAN');
  });
  it('renders a <p> with extra class when as="p"', () => {
    const { container } = render(<Kicker as="p" className="hero__kicker">FAB</Kicker>);
    const el = container.querySelector('.kicker');
    expect(el?.tagName).toBe('P');
    expect(el?.className).toBe('kicker hero__kicker');
  });
});
