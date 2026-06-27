import type { ReactNode } from 'react';
import { cx } from '../../../lib/cx';

export interface StatusBarProps {
  items: ReactNode[];
  ariaLabel?: string;
  className?: string;
}

export function StatusBar({ items, ariaLabel, className }: StatusBarProps) {
  return (
    <div className={cx('statusbar', 'mono', className)} aria-label={ariaLabel}>
      {items.map((item, i) => (
        <span className="statusbar__item" key={i}>
          {item}
        </span>
      ))}
    </div>
  );
}
