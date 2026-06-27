import { Kicker } from 'ui';

/** Canonical: section eyebrow (default span) */
export const SectionEyebrow = () => (
  <Kicker>02 · BY THE NUMBERS</Kicker>
);

/** Architecture section kicker */
export const Architecture = () => (
  <Kicker>03 · ARCHITECTURE</Kicker>
);

/** Hero kicker rendered as <p> with extra class */
export const HeroKicker = () => (
  <Kicker as="p" className="hero__kicker">
    智能晶圓廠 · IT/OT 全棧建置 // INTELLIGENT FAB INFRASTRUCTURE
  </Kicker>
);

/** Lab-report mono-style kicker */
export const LabReport = () => (
  <Kicker>// FIG.03 · SYSTEM ARCHITECTURE</Kicker>
);
