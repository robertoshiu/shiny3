import { Marquee } from 'ui';

export const TechPartners = () => (
  <Marquee
    ariaLabel="技術夥伴與標準"
    items={[
      'NVIDIA Blackwell Ultra',
      'Applied SmartFactory FAB300',
      'AVEVA PI',
      'NVIDIA Omniverse',
      'Quantum-X800 InfiniBand',
      'Spectrum-X',
      'Claroty / Nozomi',
      'IEC 62443',
      'SEMI E187',
      'ISA-95',
    ]}
  />
);

export const Standards = () => (
  <Marquee
    ariaLabel="合規標準"
    items={[
      'IEC 62443',
      'SEMI E187',
      'ISA-95',
      '等保 2.0 三級',
      'SECS-GEM · GEM300',
      'OPC UA',
      'RTO ≤ 4hr · RPO ≤ 15min',
      'SLO ≥ 95%',
    ]}
  />
);
