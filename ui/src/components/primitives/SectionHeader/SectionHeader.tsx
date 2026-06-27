import type { ReactNode } from 'react';

export interface SectionHeaderProps {
  kicker: ReactNode;
  title: ReactNode;
  lede?: ReactNode;
  index: string;
  wrapperClass?: string;
}

export function SectionHeader({
  kicker,
  title,
  lede,
  index,
  wrapperClass = 'section-head__text',
}: SectionHeaderProps) {
  return (
    <header className="section-head">
      <div className={wrapperClass}>
        <span className="kicker">{kicker}</span>
        <h2 className="section-title">{title}</h2>
        {lede ? <p className="section-lede">{lede}</p> : null}
      </div>
      <span className="section-index" aria-hidden="true">
        {index}
      </span>
    </header>
  );
}
