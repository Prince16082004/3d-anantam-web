import type { Product } from '../../data/products'

interface Props {
  shape: Product['shape']
  color: string
  speed?: number
}

/**
 * Lightweight 2D product thumbnail visual — replaces per-card WebGL canvases
 * to keep total GL-context count well under browser limits (~16). Uses pure
 * SVG + CSS transforms for a stylized blueprint feel.
 */
export default function ProductVisual({ shape, color, speed = 18 }: Props) {
  return (
    <div
      className="relative flex h-full w-full items-center justify-center overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse 70% 60% at 50% 55%, ${color}22, transparent 70%),
          linear-gradient(135deg, #0a1520, #12202e)
        `,
      }}
    >
      {/* Corner ticks */}
      <span className="absolute left-2 top-2 h-2 w-2 border-l border-t" style={{ borderColor: `${color}88` }} />
      <span className="absolute right-2 top-2 h-2 w-2 border-r border-t" style={{ borderColor: `${color}88` }} />
      <span className="absolute bottom-2 left-2 h-2 w-2 border-b border-l" style={{ borderColor: `${color}88` }} />
      <span className="absolute bottom-2 right-2 h-2 w-2 border-b border-r" style={{ borderColor: `${color}88` }} />

      {/* Gridlines */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            `linear-gradient(${color}33 1px, transparent 1px), linear-gradient(90deg, ${color}33 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
          maskImage: 'radial-gradient(ellipse 60% 50% at 50% 50%, black 40%, transparent 85%)',
        }}
      />

      {/* Orbiting ring */}
      <div
        className="pv-orbit absolute h-[70%] aspect-square rounded-full border"
        style={{
          borderColor: `${color}55`,
          boxShadow: `inset 0 0 40px ${color}33, 0 0 20px ${color}22`,
          animationDuration: `${speed}s`,
        }}
      />

      {/* Shape */}
      <div
        className="pv-rotate relative flex h-24 w-24 items-center justify-center"
        style={{ animationDuration: `${speed * 0.55}s` }}
      >
        <ShapeSvg shape={shape} color={color} />
      </div>

      {/* Accent glow */}
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 h-[50%] w-[80%] -translate-x-1/2 opacity-60 blur-2xl"
        style={{ background: `radial-gradient(ellipse, ${color}55, transparent 70%)` }}
      />

      <style>{`
        .pv-rotate { animation: pv-rot linear infinite; transform-style: preserve-3d; }
        .pv-orbit { animation: pv-spin linear infinite; }
        @keyframes pv-rot {
          0%   { transform: rotateY(0deg) rotateX(8deg); }
          100% { transform: rotateY(360deg) rotateX(8deg); }
        }
        @keyframes pv-spin {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

function ShapeSvg({ shape, color }: { shape: Product['shape']; color: string }) {
  const stroke = color
  const fill = `${color}22`
  const glow = { filter: `drop-shadow(0 0 6px ${color})` }
  const sw = 2

  switch (shape) {
    case 'frame':
      return (
        <svg viewBox="-50 -50 100 100" className="h-full w-full" style={glow}>
          <rect x="-32" y="-24" width="64" height="48" rx="4" fill={fill} stroke={stroke} strokeWidth={sw} />
          <circle cx="-32" cy="-24" r="7" fill="none" stroke={stroke} strokeWidth={sw} />
          <circle cx="32" cy="-24" r="7" fill="none" stroke={stroke} strokeWidth={sw} />
          <circle cx="-32" cy="24" r="7" fill="none" stroke={stroke} strokeWidth={sw} />
          <circle cx="32" cy="24" r="7" fill="none" stroke={stroke} strokeWidth={sw} />
          <circle cx="0" cy="0" r="5" fill={stroke} />
        </svg>
      )
    case 'disc':
      return (
        <svg viewBox="-50 -50 100 100" className="h-full w-full" style={glow}>
          <circle cx="0" cy="0" r="36" fill="none" stroke={stroke} strokeWidth={sw} />
          <circle cx="0" cy="0" r="28" fill={fill} stroke={stroke} strokeWidth={sw * 0.7} strokeDasharray="4 3" />
          <circle cx="0" cy="0" r="6" fill={stroke} />
        </svg>
      )
    case 'mount':
      return (
        <svg viewBox="-50 -50 100 100" className="h-full w-full" style={glow}>
          <rect x="-28" y="-20" width="56" height="10" fill={fill} stroke={stroke} strokeWidth={sw} />
          <rect x="-5" y="-10" width="10" height="30" fill={fill} stroke={stroke} strokeWidth={sw} />
          <rect x="-24" y="20" width="48" height="8" rx="2" fill={fill} stroke={stroke} strokeWidth={sw} />
        </svg>
      )
    case 'tube':
      return (
        <svg viewBox="-50 -50 100 100" className="h-full w-full" style={glow}>
          <rect x="-40" y="-10" width="80" height="20" rx="10" fill={fill} stroke={stroke} strokeWidth={sw} />
          <line x1="-40" y1="0" x2="40" y2="0" stroke={stroke} strokeWidth={sw * 0.6} strokeDasharray="3 4" />
        </svg>
      )
    case 'plate':
      return (
        <svg viewBox="-50 -50 100 100" className="h-full w-full" style={glow}>
          <rect x="-40" y="-14" width="80" height="28" rx="3" fill={fill} stroke={stroke} strokeWidth={sw} />
          <circle cx="-28" cy="0" r="3" fill={stroke} />
          <circle cx="28" cy="0" r="3" fill={stroke} />
          <circle cx="0" cy="0" r="3" fill={stroke} />
        </svg>
      )
    case 'leg':
      return (
        <svg viewBox="-50 -50 100 100" className="h-full w-full" style={glow}>
          <rect x="-30" y="-28" width="60" height="8" fill={fill} stroke={stroke} strokeWidth={sw} />
          <line x1="-24" y1="-20" x2="-32" y2="28" stroke={stroke} strokeWidth={sw * 1.6} strokeLinecap="round" />
          <line x1="24" y1="-20" x2="32" y2="28" stroke={stroke} strokeWidth={sw * 1.6} strokeLinecap="round" />
        </svg>
      )
    case 'chassis':
      return (
        <svg viewBox="-50 -50 100 100" className="h-full w-full" style={glow}>
          <rect x="-36" y="-16" width="72" height="32" rx="4" fill={fill} stroke={stroke} strokeWidth={sw} />
          <circle cx="-24" cy="-20" r="6" fill="none" stroke={stroke} strokeWidth={sw} />
          <circle cx="24" cy="-20" r="6" fill="none" stroke={stroke} strokeWidth={sw} />
          <circle cx="-24" cy="20" r="6" fill="none" stroke={stroke} strokeWidth={sw} />
          <circle cx="24" cy="20" r="6" fill="none" stroke={stroke} strokeWidth={sw} />
        </svg>
      )
    case 'bracket':
      return (
        <svg viewBox="-50 -50 100 100" className="h-full w-full" style={glow}>
          <path
            d="M-30 -20 H30 V-10 H-20 V20 H-30 Z"
            fill={fill}
            stroke={stroke}
            strokeWidth={sw}
            strokeLinejoin="round"
          />
        </svg>
      )
  }
}
