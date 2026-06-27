import { cx } from '../../../lib/cx';

export interface HairlineProps {
  variant?: 'hairline' | 'rule';
  className?: string;
  ariaHidden?: boolean;
}

export function Hairline({ variant = 'hairline', className, ariaHidden }: HairlineProps) {
  return <hr className={cx(variant, className)} aria-hidden={ariaHidden ? 'true' : undefined} />;
}
