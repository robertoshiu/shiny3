import { cx } from '../../../lib/cx';

export type Lang = 'zh-Hant' | 'en' | 'zh-Hans';

const LANGS: { code: Lang; label: string }[] = [
  { code: 'zh-Hant', label: '繁' },
  { code: 'en', label: 'EN' },
  { code: 'zh-Hans', label: '简' },
];

export interface LangSwitchProps {
  lang?: Lang;
  onLangChange?: (lang: Lang) => void;
  ariaLabel?: string;
  mobile?: boolean;
}

export function LangSwitch({ lang = 'zh-Hant', onLangChange, ariaLabel, mobile = false }: LangSwitchProps) {
  return (
    <div className={cx('langswitch', mobile && 'langswitch--mobile')} role="group" aria-label={ariaLabel}>
      {LANGS.map(({ code, label }) => {
        const active = code === lang;
        return (
          <button
            key={code}
            type="button"
            className={cx('langswitch__btn', active && 'is-active')}
            data-lang={code}
            aria-pressed={active ? 'true' : 'false'}
            lang={code}
            onClick={() => onLangChange?.(code)}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
