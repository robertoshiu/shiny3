import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Metric } from './Metric';

describe('Metric', () => {
  it('renders static num + unit span + label', () => {
    const { container } = render(<Metric num="≥ 95" unit="%" label="系統 SLO" />);
    expect(container.querySelector('.metric__num')?.textContent).toBe('≥ 95%');
    expect(container.querySelector('.metric__unit')?.textContent).toBe('%');
    expect(container.querySelector('.metric__label')?.textContent).toBe('系統 SLO');
  });

  it('count mode renders the FINAL formatted value immediately (never 0)', () => {
    const { container } = render(<Metric count={1280} suffix=" GPUs" label="fabric" />);
    // No IntersectionObserver fires in jsdom, so the final value must be shown.
    expect(container.querySelector('.metric__num')?.textContent).toBe('1,280 GPUs');
  });
});
