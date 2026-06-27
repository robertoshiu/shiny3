import type { ReactNode } from 'react';
import { cx } from '../../../lib/cx';
import { TickFrame } from '../TickFrame/TickFrame';

export interface PanelProps {
  children: ReactNode;
  reticle?: boolean;
  className?: string;
  as?: 'div' | 'aside';
}

export function Panel({ children, reticle = false, className, as: As = 'div' }: PanelProps) {
  return (
    <As className={cx('panel', reticle && 'reticle', className)}>
      {reticle ? <TickFrame /> : null}
      {children}
    </As>
  );
}
