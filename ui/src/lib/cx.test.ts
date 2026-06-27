import { describe, it, expect } from 'vitest';
import { cx } from './cx';

describe('cx', () => {
  it('joins truthy class names and drops falsy ones', () => {
    expect(cx('btn', false, 'btn--primary', null, undefined, 'nav__cta')).toBe(
      'btn btn--primary nav__cta',
    );
  });
});
