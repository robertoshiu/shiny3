import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, fireEvent, cleanup } from '@testing-library/react';
import { ThemeToggle } from './ThemeToggle';

afterEach(() => {
  cleanup();
  document.documentElement.removeAttribute('data-theme');
});

describe('ThemeToggle', () => {
  it('controlled: aria-pressed reflects theme and click calls onToggle', () => {
    const onToggle = vi.fn();
    const { container } = render(<ThemeToggle theme="dark" ariaLabel="切換主題" onToggle={onToggle} />);
    const btn = container.querySelector('button.theme-toggle');
    expect(btn?.getAttribute('aria-pressed')).toBe('true');
    expect(container.querySelector('.theme-toggle__icon--moon')).not.toBeNull();
    expect(container.querySelector('.theme-toggle__icon--sun')).not.toBeNull();
    fireEvent.click(btn!);
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('uncontrolled: does not write data-theme on mount, only on click', () => {
    const { container } = render(<ThemeToggle ariaLabel="切換主題" />);
    expect(document.documentElement.getAttribute('data-theme')).toBeNull();
    fireEvent.click(container.querySelector('button.theme-toggle')!);
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });
});
