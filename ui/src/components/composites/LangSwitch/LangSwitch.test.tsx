import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { LangSwitch } from './LangSwitch';

describe('LangSwitch', () => {
  it('marks the active lang via aria-pressed + is-active and fires onLangChange', () => {
    const onLangChange = vi.fn();
    const { container } = render(<LangSwitch lang="en" ariaLabel="語言切換" onLangChange={onLangChange} />);
    const buttons = container.querySelectorAll('.langswitch__btn');
    expect(buttons).toHaveLength(3);
    const en = container.querySelector('[data-lang="en"]');
    expect(en?.getAttribute('aria-pressed')).toBe('true');
    expect(en?.className).toBe('langswitch__btn is-active');
    fireEvent.click(container.querySelector('[data-lang="zh-Hans"]')!);
    expect(onLangChange).toHaveBeenCalledWith('zh-Hans');
  });
});
