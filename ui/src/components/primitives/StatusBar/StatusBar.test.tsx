import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { StatusBar } from './StatusBar';

describe('StatusBar', () => {
  it('renders one statusbar__item per item, with mono', () => {
    const { container } = render(
      <StatusBar ariaLabel="公司資訊" items={['顯藝科技 SHINYLOGIC', 'INTELLIGENT WAFER FAB SYSTEMS']} />,
    );
    const bar = container.querySelector('.statusbar');
    expect(bar?.className).toBe('statusbar mono');
    expect(bar?.getAttribute('aria-label')).toBe('公司資訊');
    expect(container.querySelectorAll('.statusbar__item')).toHaveLength(2);
  });
});
