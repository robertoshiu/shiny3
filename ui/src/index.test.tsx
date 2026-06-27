import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import * as UI from './index';

describe('barrel', () => {
  it('exports every public component', () => {
    const names = [
      'Button', 'Tag', 'Pill', 'Kicker', 'Hairline', 'SectionHeader', 'StatusBar',
      'Marquee', 'TickFrame', 'Panel', 'Card', 'Metric', 'Brand',
      'LangSwitch', 'ThemeToggle', 'Nav', 'Accordion', 'CapabilityCard', 'SpecList', 'Footer',
    ];
    for (const n of names) expect(typeof (UI as Record<string, unknown>)[n]).toBe('function');
  });

  it('a representative component renders from the barrel', () => {
    const { container } = render(<UI.Button href="#">go</UI.Button>);
    expect(container.querySelector('a.btn')).not.toBeNull();
  });
});
