import { CapabilityCard } from 'ui';

const ChipIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="8" y="8" width="12" height="12" rx="2" />
    <line x1="11" y1="8" x2="11" y2="5" /><line x1="14" y1="8" x2="14" y2="5" /><line x1="17" y1="8" x2="17" y2="5" />
    <line x1="11" y1="20" x2="11" y2="23" /><line x1="14" y1="20" x2="14" y2="23" /><line x1="17" y1="20" x2="17" y2="23" />
    <line x1="8" y1="11" x2="5" y2="11" /><line x1="8" y1="14" x2="5" y2="14" /><line x1="8" y1="17" x2="5" y2="17" />
    <line x1="20" y1="11" x2="23" y2="11" /><line x1="20" y1="14" x2="23" y2="14" /><line x1="20" y1="17" x2="23" y2="17" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M14 3L5 7v7c0 5.25 3.85 10.15 9 11.35C19.15 24.15 23 19.25 23 14V7L14 3z" />
    <polyline points="10 14 13 17 18 11" />
  </svg>
);

const DrIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 14a10 10 0 1 0 10-10" />
    <polyline points="4 6 4 14 12 14" />
    <line x1="14" y1="10" x2="14" y2="14" />
    <line x1="14" y1="14" x2="17" y2="17" />
  </svg>
);

const NetworkIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="14" cy="14" r="3" />
    <circle cx="5" cy="7" r="2" />
    <circle cx="23" cy="7" r="2" />
    <circle cx="5" cy="21" r="2" />
    <circle cx="23" cy="21" r="2" />
    <line x1="7" y1="8" x2="12" y2="13" />
    <line x1="21" y1="8" x2="16" y2="13" />
    <line x1="7" y1="20" x2="12" y2="15" />
    <line x1="21" y1="20" x2="16" y2="15" />
  </svg>
);

/** AI compute card — the flagship capability (#1) */
export const AIComputeCard = () => (
  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
    <CapabilityCard
      i={0}
      icon={<ChipIcon />}
      name="AI 算力與儲存"
      en="AI COMPUTE & STORAGE"
      blurb="NVIDIA Blackwell Ultra 世代；GB300 NVL72 + HGX B300，承接設備高頻數據與 Digital Twin 資產。"
      spec="248 GPU · 4PB NVMe"
      share="36.1%"
    />
  </ul>
);

/** Security card — OT/IT dual-domain */
export const SecurityCard = () => (
  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
    <CapabilityCard
      i={1}
      icon={<ShieldIcon />}
      name="資訊安全 OT/IT"
      en="SECURITY"
      blurb="OT/IT 雙域：Claroty / Nozomi 可視化、NGFW、SIEM/SOAR、SOC 24×7，對齊 IEC 62443。"
      spec="IEC 62443"
      share="5.8%"
    />
  </ul>
);

/** Full capability grid — all 4 variant cards sweeping the icon + content axes */
export const CapabilityGrid = () => (
  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
    <CapabilityCard
      i={0}
      icon={<ChipIcon />}
      name="AI 算力與儲存"
      en="AI COMPUTE & STORAGE"
      blurb="NVIDIA Blackwell Ultra 世代；GB300 NVL72 + HGX B300，承接設備高頻數據與 Digital Twin 資產。"
      spec="248 GPU · 4PB NVMe"
      share="36.1%"
    />
    <CapabilityCard
      i={1}
      icon={<ShieldIcon />}
      name="資訊安全 OT/IT"
      en="SECURITY"
      blurb="OT/IT 雙域：Claroty / Nozomi 可視化、NGFW、SIEM/SOAR、SOC 24×7，對齊 IEC 62443。"
      spec="IEC 62443"
      share="5.8%"
    />
    <CapabilityCard
      i={2}
      icon={<DrIcon />}
      name="異地備援 DR"
      en="RESILIENCE"
      blurb="溫備援跨區域、異步複製、SD-WAN 雙 ISP；關鍵系統 RTO ≤ 4hr、RPO ≤ 15min。"
      spec="RTO ≤ 4hr"
      share="6.0%"
    />
    <CapabilityCard
      i={3}
      icon={<NetworkIcon />}
      name="高速網絡 Fabric"
      en="NETWORK FABRIC"
      blurb="Quantum-X800 InfiniBand 800Gb/s + Spectrum-X，覆蓋東西向 AI 計算網與南北向生產網。"
      spec="800 Gb/s"
      share="7.1%"
    />
  </ul>
);
