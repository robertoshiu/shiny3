import { Accordion } from 'ui';

const layers = [
  {
    n: 1,
    nameTc: '輸入層',
    nameEn: 'INPUT',
    chips: [{ label: '8 大工藝機台' }, { label: 'MES / EAP' }, { label: 'SECS-GEM · GEM300' }, { label: 'OPC UA 廠務' }],
    desc: '八類工藝機台透過 SECS-GEM / GEM300 協議接入 EAP，OPC UA 收攏廠務自動化訊號，所有原始訊號在進入數據層前完成協議轉換與邊緣預處理。',
    meta: 'SIGNAL ORIGIN · 8 PROCESS NODES',
  },
  {
    n: 2,
    nameTc: '數據層',
    nameEn: 'DATA',
    chips: [{ label: 'Historian 時序歸檔' }, { label: 'Lakehouse EDA' }, { label: 'NVMe 數據湖' }],
    desc: 'Historian 承擔時序數據歸檔，Lakehouse 架構支援 EDA 高頻波形採集；NVMe 數據湖提供低延遲存取。',
    meta: 'STORAGE · NVMe LAKE · TIME-SERIES HISTORIAN',
  },
  {
    n: 3,
    nameTc: '算力層',
    nameEn: 'COMPUTE',
    chips: [{ label: 'GB300 NVL72 × 3' }, { label: 'HGX B300 × 4' }, { label: 'Quantum-X800 InfiniBand' }],
    desc: 'GB300 NVL72 構成 AI Fabric（液冷）；HGX B300 承擔邊緣推理；Quantum-X800 800 Gb/s XDR InfiniBand 全互聯。',
    meta: 'AI FABRIC · 液冷機房 · 800 Gb/s XDR',
  },
  {
    n: 6,
    nameTc: '備援層',
    nameEn: 'RESILIENCE',
    chips: [{ label: '異地備援 DR' }, { label: 'SD-WAN 雙 ISP' }, { label: 'RTO ≤ 4hr', accent: true }, { label: 'RPO ≤ 15min', accent: true }],
    desc: '溫備援跨區域架構配合異步複製，SD-WAN 雙 ISP 保障廣域鏈路冗餘；業務連續性由架構承諾，非事後補救。',
    meta: 'RTO ≤ 4hr · RPO ≤ 15min · DR 季度演練',
  },
];

export const SixLayerStack = () => <Accordion layers={layers} defaultOpen={0} />;
