import type { ReactNode } from 'react';
import { Card } from '../../primitives/Card/Card';

export interface CapabilityCardProps {
  icon: ReactNode;
  name: ReactNode;
  en: ReactNode;
  blurb: ReactNode;
  spec: ReactNode;
  share?: ReactNode;
  i?: number;
}

export function CapabilityCard({ icon, name, en, blurb, spec, share, i }: CapabilityCardProps) {
  return (
    <Card as="li" reticle className="s-cap__card" i={i}>
      <div className="s-cap__card-icon" aria-hidden="true">
        {icon}
      </div>
      <div className="s-cap__card-body">
        <h3 className="s-cap__card-name">{name}</h3>
        <span className="s-cap__card-en mono accent">{en}</span>
        <p className="s-cap__card-blurb">{blurb}</p>
        <span className="pill s-cap__card-spec">{spec}</span>
      </div>
      {share ? (
        <span className="s-cap__card-share mono" aria-hidden="true">
          {share}
        </span>
      ) : null}
    </Card>
  );
}
