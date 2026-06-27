import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { cx } from '../../../lib/cx';

export interface MetricProps {
  num?: ReactNode;
  unit?: string;
  label: ReactNode;
  count?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

function formatNumber(value: number, decimals: number): string {
  const parts = value.toFixed(decimals).split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}

function MetricStatic({ num, unit, label, className }: MetricProps) {
  return (
    <div className={cx('metric', className)}>
      <div className="metric__num">
        {num}
        {unit ? <span className="metric__unit">{unit}</span> : null}
      </div>
      <div className="metric__label">{label}</div>
    </div>
  );
}

function MetricCounter({ count = 0, decimals = 0, prefix = '', suffix = '', label, className }: MetricProps) {
  const final = prefix + formatNumber(count, decimals) + suffix;
  // Render the FINAL value first so a non-interactive snapshot is never blank/0.
  const [display, setDisplay] = useState(final);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (!e?.isIntersecting) return;
        io.disconnect();
        const duration = 1400;
        const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
        let start: number | null = null;
        const step = (ts: number) => {
          if (start === null) start = ts;
          const p = Math.min((ts - start) / duration, 1);
          const cur = count * easeOut(p);
          setDisplay(prefix + formatNumber(decimals > 0 ? cur : Math.round(cur), decimals) + suffix);
          if (p < 1) raf = requestAnimationFrame(step);
          else setDisplay(final);
        };
        setDisplay(prefix + formatNumber(0, decimals) + suffix);
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [count, decimals, prefix, suffix, final]);

  return (
    <div className={cx('metric', className)}>
      <div className="metric__num" ref={ref}>
        {display}
      </div>
      <div className="metric__label">{label}</div>
    </div>
  );
}

export function Metric(props: MetricProps) {
  return props.count !== undefined ? <MetricCounter {...props} /> : <MetricStatic {...props} />;
}
