import { StatusBar } from 'ui';

export const Default = () => (
  <StatusBar
    ariaLabel="公司資訊"
    items={[
      '顯藝科技 SHINYLOGIC',
      'INTELLIGENT WAFER FAB SYSTEMS',
      '規劃匯率 USD 1 = RMB 7.2',
      '金額單位 RMB 萬',
    ]}
  />
);

export const Minimal = () => (
  <StatusBar
    ariaLabel="系統狀態"
    items={['FAB300 REFERENCE BUILD', 'SLO ≥ 95%', 'RTO ≤ 4hr']}
  />
);

export const WithCustomClass = () => (
  <StatusBar
    ariaLabel="報價資訊"
    className="statusbar--nav"
    items={[
      '顯藝科技 SHINYLOGIC',
      'CapEx RMB 4.35 億',
      '報價基準 2026 Q2',
    ]}
  />
);
