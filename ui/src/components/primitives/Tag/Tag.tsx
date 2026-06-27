import type { ReactNode } from 'react';
import { cx } from '../../../lib/cx';

export interface TagProps {
  children: ReactNode;
  accent?: boolean;
  className?: string;
}

export function Tag({ children, accent = false, className }: TagProps) {
  return <span className={cx('tag', accent && 'accent-tag', className)}>{children}</span>;
}
