import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { CapabilityCard } from './CapabilityCard';

describe('CapabilityCard', () => {
  it('renders an li.card--reticle with icon slot, body and share', () => {
    const { container } = render(
      <CapabilityCard
        i={0}
        icon={<svg data-testid="icon" />}
        name="AI 算力與儲存"
        en="AI COMPUTE & STORAGE"
        blurb="NVIDIA Blackwell Ultra"
        spec="GB300 NVL72 · NVMe Lake"
        share="AI 算力"
      />,
    );
    const li = container.querySelector('li.card.card--reticle.s-cap__card');
    expect(li).not.toBeNull();
    expect((li as HTMLElement).style.getPropertyValue('--i')).toBe('0');
    expect(container.querySelector('.s-cap__card-icon')?.getAttribute('aria-hidden')).toBe('true');
    expect(container.querySelector('.s-cap__card-name')?.textContent).toBe('AI 算力與儲存');
    expect(container.querySelector('.pill.s-cap__card-spec')?.textContent).toBe('GB300 NVL72 · NVMe Lake');
    expect(container.querySelector('.s-cap__card-share')?.getAttribute('aria-hidden')).toBe('true');
  });
});
