import { useRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { motion } from 'framer-motion'

type Variant = 'primary' | 'secondary' | 'ghost'

interface Props extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  variant?: Variant
  children: ReactNode
  strength?: number
}

export default function MagneticButton({
  variant = 'primary',
  children,
  strength = 0.25,
  className = '',
  ...rest
}: Props) {
  const ref = useRef<HTMLButtonElement>(null)

  function onMove(e: React.PointerEvent<HTMLButtonElement>) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - (rect.left + rect.width / 2)
    const y = e.clientY - (rect.top + rect.height / 2)
    el.style.transform = `translate3d(${x * strength}px, ${y * strength}px, 0)`
  }

  function onLeave() {
    const el = ref.current
    if (!el) return
    el.style.transform = 'translate3d(0, 0, 0)'
  }

  const base =
    'relative inline-flex items-center gap-2 px-6 py-3 font-rajdhani text-[0.82rem] font-bold uppercase tracking-[0.15em] transition-[color,background,box-shadow,border] duration-300 rounded-md select-none overflow-hidden will-change-transform'

  const styles: Record<Variant, string> = {
    primary:
      'text-black bg-gradient-to-br from-[color:var(--color-neon)] to-[#0090aa] shadow-[0_0_24px_rgba(0,245,255,0.35)] hover:shadow-[0_0_38px_rgba(0,245,255,0.6)]',
    secondary:
      'text-[color:var(--color-neon)] bg-transparent border border-[color:var(--color-neon)]/40 hover:bg-[color:var(--color-neon)]/10 hover:border-[color:var(--color-neon)]',
    ghost:
      'text-white/80 bg-white/5 hover:bg-white/10 border border-white/10',
  }

  return (
    <motion.button
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className={`${base} ${styles[variant]} ${className}`}
      {...(rest as unknown as React.ComponentProps<typeof motion.button>)}
    >
      {/* sheen */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            'linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.35) 50%, transparent 70%)',
        }}
      />
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  )
}
