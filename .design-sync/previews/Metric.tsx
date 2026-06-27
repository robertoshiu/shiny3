import { Metric } from 'ui';

export const StaticSLO = () => (
  <Metric num="≥ 95" unit="%" label="系統 SLO" />
);

export const StaticRTO = () => (
  <Metric num="≤ 4" unit="hr" label="DR RTO" />
);

export const CountUpGPU = () => (
  <Metric count={248} suffix=" GPU" label="AI 算力（GB300 + HGX B300）" />
);

export const CountUpCapEx = () => (
  <Metric count={4.35} decimals={2} prefix="RMB " suffix=" 億" label="CapEx 一次性建置" />
);
