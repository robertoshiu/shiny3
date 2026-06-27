import { useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';
import { cx } from '../../../lib/cx';

export interface AccordionChip {
  label: ReactNode;
  accent?: boolean;
}

export interface AccordionLayer {
  n: number;
  nameTc: ReactNode;
  nameEn: string;
  chips: AccordionChip[];
  desc: ReactNode;
  meta: ReactNode;
}

export interface AccordionProps {
  layers: AccordionLayer[];
  defaultOpen?: number;
  idPrefix?: string;
}

export function Accordion({ layers, defaultOpen = 0, idPrefix = 'arch' }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState(defaultOpen);
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const idx = btnRefs.current.indexOf(document.activeElement as HTMLButtonElement);
    if (idx === -1) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      btnRefs.current[idx + 1]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      btnRefs.current[idx - 1]?.focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      btnRefs.current[0]?.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      btnRefs.current[btnRefs.current.length - 1]?.focus();
    }
  };

  return (
    <div className="s-arch__stack" role="presentation" onKeyDown={onKeyDown}>
      <div className="s-arch__rail" aria-hidden="true">
        <div className="s-arch__pulse" />
      </div>

      {layers.map((layer, i) => {
        const open = i === openIndex;
        const btnId = `${idPrefix}-btn-${layer.n}`;
        const bodyId = `${idPrefix}-body-${layer.n}`;
        return (
          <div className="s-arch__layer" data-layer={layer.n} data-active={open ? 'true' : 'false'} key={layer.n}>
            <button
              ref={(el) => {
                btnRefs.current[i] = el;
              }}
              className="s-arch__header"
              aria-expanded={open ? 'true' : 'false'}
              aria-controls={bodyId}
              id={btnId}
              onClick={() => {
                if (!open) setOpenIndex(i);
              }}
            >
              <span className="s-arch__index mono accent" aria-hidden="true">
                L{layer.n}
              </span>
              <span className="s-arch__names">
                <span className="s-arch__name-tc">{layer.nameTc}</span>
                <span className="s-arch__name-en mono steel">{layer.nameEn}</span>
              </span>
              <span className="s-arch__arrow" aria-hidden="true" />
            </button>

            <div
              className={cx('s-arch__body', open && 'is-open')}
              id={bodyId}
              role="region"
              aria-labelledby={btnId}
              hidden={!open}
            >
              <div className="s-arch__chips">
                {layer.chips.map((chip, ci) => (
                  <span className={cx('tag', chip.accent && 'accent-tag')} key={ci}>
                    {chip.label}
                  </span>
                ))}
              </div>
              <p className="s-arch__desc">{layer.desc}</p>
              <div className="s-arch__meta mono steel">
                <span>{layer.meta}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
