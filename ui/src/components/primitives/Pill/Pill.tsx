import type { ReactNode } from 'react';
import { cx } from '../../../lib/cx';

export interface PillProps {
  children: ReactNode;
  className?: string;
}

export function Pill({ children, className }: PillProps) {
  return <span className={cx('pill', className)}>{children}</span>;
}
