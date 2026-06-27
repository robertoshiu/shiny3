export interface BrandProps {
  href?: string;
  ariaHome?: string;
  logoWebp?: string;
  logoPng?: string;
}

export function Brand({
  href = 'index.html',
  ariaHome,
  logoWebp = '/logo.webp',
  logoPng = '/logo.png',
}: BrandProps) {
  return (
    <a className="brand" href={href} aria-label={ariaHome}>
      <picture className="brand__logo" aria-hidden="true">
        <source srcSet={logoWebp} type="image/webp" />
        <img src={logoPng} alt="" width={34} height={34} decoding="async" />
      </picture>
      <span className="brand__col">
        <span className="brand__mark">
          SHINY<span className="accent">LOGIC</span>
        </span>
        <span className="brand__sub">顯藝科技</span>
      </span>
      <span className="brand__tag">
        <span className="dot" aria-hidden="true" />
        FAB300
      </span>
    </a>
  );
}
