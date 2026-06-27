import { ThemeToggle } from 'ui';

export const DarkMode = () => (
  <ThemeToggle theme="dark" ariaLabel="切換至淺色主題" />
);

export const LightMode = () => (
  <ThemeToggle theme="light" ariaLabel="切換至深色主題" />
);

export const MobileDark = () => (
  <ThemeToggle theme="dark" ariaLabel="切換主題（行動版）" mobile />
);

export const MobileLight = () => (
  <ThemeToggle theme="light" ariaLabel="切換主題（行動版）" mobile />
);
