import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Panel } from './Panel';

describe('Panel', () => {
  it('renders a plain panel with no ticks by default', () => {
    const { container } = render(<Panel>body</Panel>);
    expect(container.querySelector('div.panel')?.className).toBe('panel');
    expect(container.querySelectorAll('.tick')).toHaveLength(0);
  });
  it('adds reticle + four ticks as direct children when reticle', () => {
    const { container } = render(<Panel reticle className="s-stats__panel">body</Panel>);
    const panel = container.querySelector('div.panel');
    expect(panel?.className).toBe('panel reticle s-stats__panel');
    expect(panel?.querySelectorAll(':scope > .tick')).toHaveLength(4);
  });
});
