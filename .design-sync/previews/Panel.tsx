import { Panel } from 'ui';

export const SpecPanel = () => (
  <Panel>
    <p className="kicker">治理層 · GOVERNANCE</p>
    <h3>業務連續性承諾</h3>
    <ul style={{ margin: '0.75rem 0 0', paddingLeft: '1.25rem', lineHeight: 1.7 }}>
      <li>RTO ≤ 4hr · RPO ≤ 15min</li>
      <li>SLO ≥ 95% · 良率 ≥ 90%</li>
      <li>DR 演練納入季度 Review</li>
      <li>8 道 Gate · RACI 每議題唯一 A</li>
    </ul>
    <p className="mono" style={{ marginTop: '1rem', fontSize: 13 }}>
      IEC 62443 · SEMI E187 · ISA-95 · 等保 2.0
    </p>
  </Panel>
);

export const ReticlePanel = () => (
  <Panel reticle>
    <p className="kicker">備援層 · RESILIENCE</p>
    <h3>異地備援架構</h3>
    <p style={{ margin: '0.5rem 0 0', lineHeight: 1.7 }}>
      溫備援跨區域、異步複製、SD-WAN 雙 ISP —
      關鍵推理系統 RTO ≤ 4hr、RPO ≤ 15min，業務連續性由架構承諾，非事後補救。
    </p>
    <p className="mono" style={{ marginTop: '1rem', fontSize: 13 }}>
      DR RTO ≤ 4hr · RPO ≤ 15min · DR 年運維 RMB 576 萬/年
    </p>
  </Panel>
);

export const AsidePanel = () => (
  <Panel as="aside">
    <p className="kicker">算力層 · COMPUTE</p>
    <h3>Blackwell Ultra 算力底座</h3>
    <ul style={{ margin: '0.75rem 0 0', paddingLeft: '1.25rem', lineHeight: 1.7 }}>
      <li>GB300 NVL72 × 3 — 216 GPU · 液冷</li>
      <li>HGX B300 × 4 — 32 GPU 推理</li>
      <li>Quantum-X800 InfiniBand 800 Gb/s XDR</li>
      <li>4PB NVMe 數據湖</li>
    </ul>
    <p className="mono" style={{ marginTop: '1rem', fontSize: 13 }}>
      AI FABRIC · 248 AI GPU TOTAL · ~400kW LIQUID COOL
    </p>
  </Panel>
);
