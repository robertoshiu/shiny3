import type { CSSProperties, ReactNode } from 'react';
import { cx } from '../../../lib/cx';
import { TickFrame } from '../TickFrame/TickFrame';

export interface CardProps {
  children: ReactNode;
  reticle?: boolean;
  className?: string;
  i?: number;
  as?: 'li' | 'div';
}

export function Card({ children, reticle = false, className, i, as: As = 'div' }: CardProps) {
  const style = i !== undefined ? ({ '--i': String(i) } as CSSProperties) : undefined;
  return (
    <As className={cx('card', reticle && 'card--reticle', className)} style={style}>
      {reticle ? <TickFrame /> : null}
      {children}
    </As>
  );
}
