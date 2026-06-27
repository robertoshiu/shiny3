import { describe, it, expect, afterEach } from 'vitest';
import { render, fireEvent, cleanup } from '@testing-library/react';
import { Accordion, type AccordionLayer } from './Accordion';

afterEach(cleanup);

const layers: AccordionLayer[] = [
  { n: 1, nameTc: '輸入層', nameEn: 'INPUT', chips: [{ label: 'MES / EAP' }], desc: 'd1', meta: 'm1' },
  { n: 2, nameTc: '數據層', nameEn: 'DATA', chips: [{ label: 'NVMe' }], desc: 'd2', meta: 'm2' },
  { n: 6, nameTc: '備援層', nameEn: 'RESILIENCE', chips: [{ label: 'RTO ≤ 4hr', accent: true }], desc: 'd6', meta: 'm6' },
];

describe('Accordion', () => {
  it('opens layer 0 by default; others are hidden', () => {
    const { container } = render(<Accordion layers={layers} />);
    const bodies = container.querySelectorAll('.s-arch__body');
    expect(bodies[0].classList.contains('is-open')).toBe(true);
    expect(bodies[0].hasAttribute('hidden')).toBe(false);
    expect(bodies[1].hasAttribute('hidden')).toBe(true);
    expect(container.querySelector('#arch-btn-1')?.getAttribute('aria-expanded')).toBe('true');
  });

  it('single-open: clicking a closed header opens it and closes others', () => {
    const { container } = render(<Accordion layers={layers} />);
    fireEvent.click(container.querySelector('#arch-btn-2')!);
    expect(container.querySelector('#arch-btn-2')?.getAttribute('aria-expanded')).toBe('true');
    expect(container.querySelector('#arch-btn-1')?.getAttribute('aria-expanded')).toBe('false');
  });

  it('renders accent chips with accent-tag', () => {
    const { container } = render(<Accordion layers={layers} defaultOpen={2} />);
    expect(container.querySelector('#arch-body-6 .tag')?.className).toBe('tag accent-tag');
  });
});
