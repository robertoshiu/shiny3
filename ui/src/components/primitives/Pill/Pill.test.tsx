import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Pill } from './Pill';

describe('Pill', () => {
  it('renders a pill with an optional contextual class', () => {
    const { container } = render(<Pill className="s-cap__card-spec">800 Gb/s</Pill>);
    expect(container.querySelector('span.pill')?.className).toBe('pill s-cap__card-spec');
  });
});
