import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { TickFrame } from './TickFrame';

describe('TickFrame', () => {
  it('renders four decorative corner ticks in tl/tr/bl/br order', () => {
    const { container } = render(<div className="reticle"><TickFrame /></div>);
    const ticks = container.querySelectorAll('.tick');
    expect(ticks).toHaveLength(4);
    expect([...ticks].map((t) => t.className)).toEqual([
      'tick tick--tl',
      'tick tick--tr',
      'tick tick--bl',
      'tick tick--br',
    ]);
    expect(ticks[0].getAttribute('aria-hidden')).toBe('true');
  });
});
