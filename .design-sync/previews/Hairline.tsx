import { Hairline } from 'ui';

/** Canonical: default hairline divider */
export const Default = () => (
  <div style={{ padding: '24px 0' }}>
    <p style={{ marginBottom: '16px', color: 'var(--ink-2)', fontSize: '14px' }}>六層架構，一條決策閉環</p>
    <Hairline />
    <p style={{ marginTop: '16px', color: 'var(--ink-2)', fontSize: '14px' }}>RTO ≤ 4hr · RPO ≤ 15min · SLO ≥ 95%</p>
  </div>
);

/** Rule variant: decorative ticked ruler */
export const Rule = () => (
  <div style={{ padding: '24px 0' }}>
    <p style={{ marginBottom: '16px', color: 'var(--ink-2)', fontSize: '14px' }}>Quantum-X800 InfiniBand 800 Gb/s</p>
    <Hairline variant="rule" ariaHidden />
    <p style={{ marginTop: '16px', color: 'var(--ink-2)', fontSize: '14px' }}>Spectrum-X SN5600 · ConnectX-8</p>
  </div>
);

/** Side-by-side: hairline vs rule in a section break context */
export const Comparison = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', padding: '16px 0' }}>
    <div>
      <span style={{ fontSize: '11px', letterSpacing: '0.1em', color: 'var(--ink-3)', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>hairline (default)</span>
      <Hairline ariaHidden />
    </div>
    <div>
      <span style={{ fontSize: '11px', letterSpacing: '0.1em', color: 'var(--ink-3)', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>rule variant</span>
      <Hairline variant="rule" ariaHidden />
    </div>
  </div>
);
