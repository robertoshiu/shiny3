import { LangSwitch } from 'ui';

export const ActiveZhHant = () => (
  <LangSwitch lang="zh-Hant" ariaLabel="語言切換" />
);

export const ActiveEn = () => (
  <LangSwitch lang="en" ariaLabel="Language switch" />
);

export const ActiveZhHans = () => (
  <LangSwitch lang="zh-Hans" ariaLabel="语言切换" />
);

export const MobileVariant = () => (
  <LangSwitch lang="zh-Hant" ariaLabel="語言切換（行動版）" mobile />
);
