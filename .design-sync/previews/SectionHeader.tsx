import { SectionHeader } from 'ui';

export const WithLede = () => (
  <SectionHeader
    wrapperClass="s-cap__head-left"
    kicker="04 · CAPABILITIES"
    title={
      <>
        從矽到決策的<span className="accent">全棧能力</span>
      </>
    }
    lede="六層技術堆疊，涵蓋設備自動化、AI 算力、製造執行、企業網絡、資訊安全與業務連續性 — 每項能力均有實證交付與合規基礎。"
    index="04"
  />
);

export const TitleOnly = () => (
  <SectionHeader
    kicker="// FIG.03 · SYSTEM ARCHITECTURE"
    title="六層架構，一條決策閉環"
    index="03"
  />
);
