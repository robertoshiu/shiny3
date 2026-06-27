import type { ReactNode } from 'react';
import { cx } from '../../../lib/cx';

export interface KickerProps {
  children: ReactNode;
  as?: 'span' | 'p';
  className?: string;
}

export function Kicker({ children, as: As = 'span', className }: KickerProps) {
  return <As className={cx('kicker', className)}>{children}</As>;
}
