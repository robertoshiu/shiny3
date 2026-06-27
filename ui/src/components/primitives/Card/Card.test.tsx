import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Card } from './Card';

describe('Card', () => {
  it('renders a div.card with no ticks by default', () => {
    const { container } = render(<Card>x</Card>);
    expect(container.querySelector('div.card')?.className).toBe('card');
    expect(container.querySelectorAll('.tick')).toHaveLength(0);
  });
  it('renders an li.card--reticle with four ticks and --i style', () => {
    const { container } = render(<Card as="li" reticle className="s-cap__card" i={3}>x</Card>);
    const li = container.querySelector('li.card');
    expect(li?.className).toBe('card card--reticle s-cap__card');
    expect((li as HTMLElement)?.style.getPropertyValue('--i')).toBe('3');
    expect(li?.querySelectorAll(':scope > .tick')).toHaveLength(4);
  });
});
