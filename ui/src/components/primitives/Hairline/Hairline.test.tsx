import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Hairline } from './Hairline';

describe('Hairline', () => {
  it('renders an <hr class="hairline"> by default', () => {
    const { container } = render(<Hairline />);
    expect(container.querySelector('hr')?.className).toBe('hairline');
  });
  it('renders the rule variant, aria-hidden, with extra class', () => {
    const { container } = render(<Hairline variant="rule" ariaHidden />);
    const hr = container.querySelector('hr');
    expect(hr?.className).toBe('rule');
    expect(hr?.getAttribute('aria-hidden')).toBe('true');
  });
});
