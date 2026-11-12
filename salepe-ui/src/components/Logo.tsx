interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
}

const SIZE_MAP = {
  sm: { saleFont: '1.05rem', tagFont: '0.85rem', tagH: 22, tagW: 32 },
  md: { saleFont: '1.3rem', tagFont: '1.05rem', tagH: 27, tagW: 40 },
  lg: { saleFont: '1.7rem', tagFont: '1.35rem', tagH: 34, tagW: 50 },
} as const;

export default function Logo({ size = 'md' }: LogoProps) {
  const { saleFont, tagFont, tagH, tagW } = SIZE_MAP[size];

  return (
    <span className="logo">
      <span className="logo-sale" style={{ fontSize: saleFont }}>
        sale
      </span>
      <span
        className="logo-tag"
        style={{ height: tagH, minWidth: tagW, fontSize: tagFont }}
      >
        pe
        <span className="logo-tag-hole" />
      </span>
      <span className="logo-tag-loop" style={{ height: tagH * 0.6, width: tagH * 0.6 }} />
    </span>
  );
}
