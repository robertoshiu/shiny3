import type { ReactNode } from 'react';

export interface MarqueeProps {
  items: ReactNode[];
  ariaLabel?: string;
}

export function Marquee({ items, ariaLabel }: MarqueeProps) {
  const group = (hidden: boolean) => (
    <div className="marquee__group" aria-hidden={hidden ? 'true' : 'false'}>
      {items.map((item, i) => (
        <span className="marquee__item" key={i}>
          {item}
        </span>
      ))}
    </div>
  );
  return (
    <div className="marquee" aria-label={ariaLabel} role="region">
      <div className="marquee__track">
        {group(false)}
        {group(true)}
      </div>
    </div>
  );
}
