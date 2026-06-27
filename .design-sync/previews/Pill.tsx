import { Pill } from 'ui';

/** Canonical: compliance badge pills */
export const ComplianceBadges = () => (
  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
    <Pill>等保 2.0 三級</Pill>
    <Pill>IEC 62443</Pill>
    <Pill>SEMI E187</Pill>
    <Pill>ISA-95</Pill>
    <Pill>密評</Pill>
  </div>
);

/** Spec pills: key network / compute specs */
export const SpecPills = () => (
  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
    <Pill>800 Gb/s</Pill>
    <Pill>248 AI GPU</Pill>
    <Pill>4PB NVMe</Pill>
    <Pill>300K WSPM</Pill>
  </div>
);

/** With contextual className: capability card spec pill */
export const CardSpec = () => (
  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
    <Pill className="s-cap__card-spec">RTO ≤ 4hr</Pill>
    <Pill className="s-cap__card-spec">RPO ≤ 15min</Pill>
    <Pill className="s-cap__card-spec">SLO ≥ 95%</Pill>
  </div>
);
