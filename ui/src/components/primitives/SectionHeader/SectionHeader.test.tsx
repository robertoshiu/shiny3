import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { SectionHeader } from './SectionHeader';

describe('SectionHeader', () => {
  it('renders kicker, title (with accent span), lede and aria-hidden index', () => {
    const { container } = render(
      <SectionHeader
        wrapperClass="s-cap__head-left"
        kicker="04 CAPABILITIES"
        title={<><span>從矽到決策的</span><span className="accent">全棧能力</span></>}
        lede="six layers"
        index="04"
      />,
    );
    expect(container.querySelector('header.section-head .s-cap__head-left .kicker')?.textContent).toBe('04 CAPABILITIES');
    expect(container.querySelector('.section-title .accent')?.textContent).toBe('全棧能力');
    expect(container.querySelector('.section-lede')?.textContent).toBe('six layers');
    const idx = container.querySelector('.section-index');
    expect(idx?.getAttribute('aria-hidden')).toBe('true');
    expect(idx?.textContent).toBe('04');
  });

  it('omits the lede paragraph when no lede is given', () => {
    const { container } = render(<SectionHeader kicker="k" title="t" index="01" />);
    expect(container.querySelector('.section-lede')).toBeNull();
  });
});
