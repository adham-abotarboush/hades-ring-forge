import { useId } from "react";

// Layered black/silver/gold marble: soft radial veins (silver + gold) plus a
// turbulence-noise overlay to suggest stone grain. Render absolute-positioned
// inside any container to use as a tinted backdrop.
export const MarbleBackground = ({
  className = "",
  intensity = 1,
}: {
  className?: string;
  intensity?: number;
}) => {
  const id = useId();
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`} aria-hidden="true">
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 900px 600px at 12% 18%, hsl(45 65% 55% / ${0.06 * intensity}), transparent 65%),
            radial-gradient(ellipse 700px 500px at 88% 28%, hsl(210 18% 80% / ${0.06 * intensity}), transparent 65%),
            radial-gradient(ellipse 900px 600px at 50% 95%, hsl(45 70% 55% / ${0.04 * intensity}), transparent 65%),
            radial-gradient(ellipse 600px 400px at 75% 65%, hsl(0 0% 100% / ${0.025 * intensity}), transparent 65%)
          `,
        }}
      />
      <svg
        className="absolute inset-0 w-full h-full mix-blend-screen"
        style={{ opacity: 0.08 * intensity }}
        preserveAspectRatio="none"
      >
        <defs>
          <filter id={`marble-${id}`}>
            <feTurbulence type="fractalNoise" baseFrequency="0.011" numOctaves="2" seed="7" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.95
                      0 0 0 0 0.85
                      0 0 0 0 0.55
                      0 0 0 1 0"
            />
          </filter>
        </defs>
        <rect width="100%" height="100%" filter={`url(#marble-${id})`} />
      </svg>
    </div>
  );
};

type OrnamentProps = {
  className?: string;
  color?: string;
  height?: number;
  opacity?: number;
};

export const GreekMeander = ({
  className = "",
  color = "currentColor",
  height = 18,
  opacity = 0.55,
}: OrnamentProps) => {
  const id = useId();
  return (
    <svg
      className={className}
      width="100%"
      height={height}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      style={{ color, opacity }}
    >
      <defs>
        <pattern
          id={`meander-${id}`}
          x="0"
          y="0"
          width="40"
          height="20"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 2 18 L 2 2 L 38 2 L 38 18 L 22 18 L 22 6 L 32 6 L 32 14 L 26 14"
            stroke={color}
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="square"
            strokeLinejoin="miter"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#meander-${id})`} />
    </svg>
  );
};

export const GreekDivider = ({
  className = "",
  color = "currentColor",
  icon,
}: {
  className?: string;
  color?: string;
  icon?: string;
}) => (
  <div className={`flex items-center gap-4 ${className}`} style={{ color }}>
    <div
      className="flex-1 h-px"
      style={{
        background: `linear-gradient(to right, transparent, ${color} 60%, ${color})`,
        opacity: 0.5,
      }}
    />
    {icon ? (
      <span className="text-2xl select-none" aria-hidden="true">
        {icon}
      </span>
    ) : (
      <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
        <path
          d="M 11 1 L 13 9 L 21 11 L 13 13 L 11 21 L 9 13 L 1 11 L 9 9 Z"
          fill={color}
          opacity="0.85"
        />
      </svg>
    )}
    <div
      className="flex-1 h-px"
      style={{
        background: `linear-gradient(to left, transparent, ${color} 60%, ${color})`,
        opacity: 0.5,
      }}
    />
  </div>
);

export const LaurelFrame = ({
  children,
  color = "currentColor",
  className = "",
}: {
  children: React.ReactNode;
  color?: string;
  className?: string;
}) => (
  <div className={`inline-flex items-center gap-4 ${className}`} style={{ color }}>
    <svg width="36" height="48" viewBox="0 0 36 48" aria-hidden="true" className="shrink-0">
      <g stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round">
        <path d="M 32 4 Q 20 12, 18 24 Q 16 36, 30 44" />
        <path d="M 28 8 Q 22 10, 22 14" />
        <path d="M 24 13 Q 18 14, 18 18" />
        <path d="M 22 19 Q 16 20, 16 24" />
        <path d="M 22 28 Q 16 28, 16 32" />
        <path d="M 24 34 Q 18 35, 18 38" />
        <path d="M 28 39 Q 22 40, 22 43" />
      </g>
    </svg>
    <div className="text-center">{children}</div>
    <svg width="36" height="48" viewBox="0 0 36 48" aria-hidden="true" className="shrink-0 scale-x-[-1]">
      <g stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round">
        <path d="M 32 4 Q 20 12, 18 24 Q 16 36, 30 44" />
        <path d="M 28 8 Q 22 10, 22 14" />
        <path d="M 24 13 Q 18 14, 18 18" />
        <path d="M 22 19 Q 16 20, 16 24" />
        <path d="M 22 28 Q 16 28, 16 32" />
        <path d="M 24 34 Q 18 35, 18 38" />
        <path d="M 28 39 Q 22 40, 22 43" />
      </g>
    </svg>
  </div>
);
