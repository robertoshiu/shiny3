import { Card } from 'ui';

export const Default = () => (
  <Card>
    <p className="kicker">AI 算力與儲存</p>
    <h3>NVIDIA Blackwell Ultra 世代</h3>
    <p style={{ margin: '0.5rem 0 0.75rem', lineHeight: 1.7 }}>
      GB300 NVL72 + HGX B300，承接設備高頻數據與 Digital Twin 資產。
    </p>
    <p className="mono" style={{ fontSize: 13 }}>248 GPU · 4PB NVMe · 36.1% CapEx</p>
  </Card>
);

export const Reticle = () => (
  <Card reticle>
    <p className="kicker">資訊安全 OT/IT · SECURITY</p>
    <h3>IEC 62443 合規防護</h3>
    <p style={{ margin: '0.5rem 0 0.75rem', lineHeight: 1.7 }}>
      OT/IT 雙域：Claroty / Nozomi 可視化、NGFW、SIEM/SOAR、SOC 24×7，全面對齊 IEC 62443。
    </p>
    <p className="mono" style={{ fontSize: 13 }}>IEC 62443 · SEMI E187 · 5.8% CapEx</p>
  </Card>
);

export const Indexed = () => (
  <Card reticle i={2}>
    <p className="kicker">異地備援 DR · RESILIENCE</p>
    <h3>溫備援跨區域架構</h3>
    <p style={{ margin: '0.5rem 0 0.75rem', lineHeight: 1.7 }}>
      異步複製、SD-WAN 雙 ISP；關鍵系統 RTO ≤ 4hr、RPO ≤ 15min，DR 演練納入季度 Review。
    </p>
    <p className="mono" style={{ fontSize: 13 }}>RTO ≤ 4hr · RPO ≤ 15min · 6.0% CapEx</p>
  </Card>
);
