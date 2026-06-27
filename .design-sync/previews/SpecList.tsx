import { SpecList } from 'ui';

/** Compute hardware spec panel — GB300 NVL72 configuration */
export const ComputeHardware = () => (
  <SpecList
    head="// HARDWARE CONFIGURATION · FAB300 AI FABRIC"
    rows={[
      { key: 'GB300 NVL72 × 3', value: 'AI Fabric 算力 · 216 GPU', badge: '液冷' },
      { key: 'HGX B300 × 4', value: '推理節點 · 32 GPU' },
      { key: 'Quantum-X800 InfiniBand', value: '800 Gb/s XDR · 144-port', badge: '東西向' },
      { key: 'Spectrum-X SN5600', value: '800 Gb/s · 生產網', badge: '南北向' },
      { key: 'NVMe 數據湖', value: '4PB · 低延遲存取' },
    ]}
  />
);

/** SLA commitment spec panel — RTO/RPO/SLO targets */
export const SLACommitments = () => (
  <SpecList
    head="// RESILIENCE SLA · DR REFERENCE"
    rows={[
      { key: 'RTO', value: '≤ 4 hr · 關鍵系統', badge: '承諾' },
      { key: 'RPO', value: '≤ 15 min · 異步複製' },
      { key: 'SLO', value: '≥ 95% · 生產系統', badge: '承諾' },
      { key: '良率目標', value: '≥ 90% · HVM 量產' },
      { key: 'DR 演練', value: '季度 · 溫備援跨區域' },
    ]}
  />
);

/** Network fabric spec panel — switching + interconnect */
export const NetworkFabric = () => (
  <SpecList
    head="// NETWORK FABRIC · QUANTUM-X800 / SPECTRUM-X"
    rows={[
      { key: 'InfiniBand 頻寬', value: 'Quantum-X800 · 800 Gb/s XDR', badge: 'AI Fabric' },
      { key: '乙太網路', value: 'Spectrum-X SN5600 · 800 Gb/s' },
      { key: 'SuperNIC', value: 'ConnectX-8 · LinkX 光纖' },
      { key: '安全合規', value: 'IEC 62443 · ISA-95 L3↔L4' },
    ]}
  />
);
