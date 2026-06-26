import moon from '../assets/svg/icon-moon.svg?raw';
import sun from '../assets/svg/icon-sun.svg?raw';

export const moonSvg = moon;
export const sunSvg = sun;

/**
 * Paint all [data-theme-icon] elements with the correct icon for the given theme.
 *
 * Mapping mirrors the source theme-manager (script.js lines 578-588):
 *   dark  → SUN   (button label = "switch to light"; aria key = "theme.toggleAria")
 *   light → MOON  (button label = "switch to dark";  aria key = "theme.toggleAriaToDark")
 *
 * i.e. the icon always shows the *destination* theme, not the current one.
 *
 * @param {'dark'|'light'} theme
 */
export function paintThemeIcons(theme) {
  const icon = theme === 'dark' ? sun : moon;
  document.querySelectorAll('[data-theme-icon]').forEach(function (el) {
    el.innerHTML = icon;
  });
}
