import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Tag } from './Tag';

describe('Tag', () => {
  it('renders a plain tag', () => {
    const { container } = render(<Tag>MES / EAP</Tag>);
    expect(container.querySelector('span.tag')?.className).toBe('tag');
  });
  it('adds accent-tag when accent', () => {
    const { container } = render(<Tag accent>RTO ≤ 4hr</Tag>);
    expect(container.querySelector('span.tag')?.className).toBe('tag accent-tag');
  });
});
