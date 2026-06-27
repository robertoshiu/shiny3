import type { ReactNode } from 'react';
import { Panel } from '../../primitives/Panel/Panel';

export interface SpecRow {
  key: ReactNode;
  value: ReactNode;
  badge?: ReactNode;
}

export interface SpecListProps {
  head: ReactNode;
  rows: SpecRow[];
}

export function SpecList({ head, rows }: SpecListProps) {
  return (
    <Panel reticle className="s-compute__spec-panel">
      <div className="s-compute__spec-head mono steel">{head}</div>
      <hr className="hairline s-compute__spec-rule" />
      <dl className="s-compute__specs">
        {rows.map((row, i) => (
          <div className="s-compute__spec-row" key={i}>
            <dt className="s-compute__spec-key mono accent">{row.key}</dt>
            <dd className="s-compute__spec-val">
              <span className="mist">{row.value}</span>
              {row.badge ? <span className="s-compute__spec-badge tag">{row.badge}</span> : null}
            </dd>
          </div>
        ))}
      </dl>
    </Panel>
  );
}
