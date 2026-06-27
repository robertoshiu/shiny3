import type { ReactNode } from 'react';
import { cx } from '../../../lib/cx';

export type ButtonVariant = 'primary' | 'ghost';
export type ButtonArrow = '→' | '↓';

export interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  as?: 'a' | 'button';
  href?: string;
  type?: 'button' | 'submit';
  block?: boolean;
  arrow?: ButtonArrow | false;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
  ariaLabel?: string;
}

export function Button({
  children,
  variant = 'primary',
  as = 'a',
  href,
  type = 'button',
  block = false,
  arrow = false,
  disabled = false,
  className,
  onClick,
  ariaLabel,
}: ButtonProps) {
  const cls = cx('btn', `btn--${variant}`, block && 'btn--block', className);
  const tail = arrow ? (
    <>
      {' '}
      <span className="btn__arrow" aria-hidden="true">
        {arrow}
      </span>
    </>
  ) : null;

  if (as === 'a') {
    return (
      <a className={cls} href={href} onClick={onClick} aria-label={ariaLabel}>
        {children}
        {tail}
      </a>
    );
  }
  return (
    <button
      className={cls}
      type={type}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {children}
      {tail}
    </button>
  );
}
