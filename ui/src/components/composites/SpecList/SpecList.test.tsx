import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { SpecList } from './SpecList';

describe('SpecList', () => {
  it('renders a reticle panel + dl rows with optional badge', () => {
    const { container } = render(
      <SpecList
        head="// HARDWARE CONFIGURATION"
        rows={[
          { key: 'GB300 NVL72 × 3', value: 'AI Fabric 算力', badge: '液冷' },
          { key: 'HGX B300 × 4', value: '推理節點' },
        ]}
      />,
    );
    expect(container.querySelector('.panel.s-compute__spec-panel.reticle')).not.toBeNull();
    expect(container.querySelector('.s-compute__spec-head')?.textContent).toBe('// HARDWARE CONFIGURATION');
    expect(container.querySelectorAll('.s-compute__spec-row')).toHaveLength(2);
    expect(container.querySelectorAll('.s-compute__spec-badge')).toHaveLength(1);
    expect(container.querySelector('.s-compute__spec-key')?.textContent).toBe('GB300 NVL72 × 3');
  });
});
