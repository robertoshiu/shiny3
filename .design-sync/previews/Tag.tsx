import { Tag } from 'ui';

/** Canonical: plain tag used in MES module list */
export const Plain = () => (
  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
    <Tag>MES / EAP</Tag>
    <Tag>SECS-GEM</Tag>
    <Tag>GEM300</Tag>
    <Tag>OPC UA</Tag>
    <Tag>ISA-95</Tag>
  </div>
);

/** Accent variant: highlighted spec tags */
export const Accent = () => (
  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
    <Tag accent>IEC 62443</Tag>
    <Tag accent>RTO ≤ 4hr</Tag>
    <Tag accent>SEMI E187</Tag>
  </div>
);

/** Mixed: architecture layer chips (plain + accent together) */
export const LayerChips = () => (
  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
    <Tag>Historian（AVEVA PI）</Tag>
    <Tag>Lakehouse + EDA</Tag>
    <Tag>4PB NVMe 數據湖</Tag>
    <Tag accent>DR RTO ≤ 4hr</Tag>
    <Tag accent>RPO ≤ 15min</Tag>
  </div>
);
