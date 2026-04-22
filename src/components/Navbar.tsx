import { motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { useState } from 'react'
import { brand, nav } from '../data/site'
import MagneticButton from './ui/MagneticButton'

interface Props {
  onOpenMenu: () => void
}

export default function Navbar({ onOpenMenu }: Props) {
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)

  useMotionValueEvent(scrollY, 'change', (v) => {
    setScrolled(v > 12)
  })

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed left-0 right-0 top-0 z-50 flex h-16 items-center justify-between px-4 sm:px-8 transition-[background,border,backdrop-filter] duration-300 ${
        scrolled
          ? 'glass-strong border-b border-white/5'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      {/* Logo */}
      <a href="#top" className="group flex items-center gap-2">
        <div className="relative h-8 w-8">
          <div
            className="absolute inset-0 rounded-md border border-[color:var(--color-neon)]/50"
            style={{ boxShadow: '0 0 12px rgba(0,245,255,0.35)' }}
          />
          <div className="absolute inset-1 rounded-sm bg-gradient-to-br from-[color:var(--color-neon)]/30 to-[color:var(--color-orange)]/20" />
          <div className="absolute inset-0 flex items-center justify-center font-display text-[10px] font-black text-[color:var(--color-neon)]">
            A
          </div>
        </div>
        <div className="leading-tight">
          <div className="font-display text-[0.95rem] font-black tracking-[0.2em] text-gradient">
            {brand.name}
          </div>
          <div className="font-rajdhani text-[0.55rem] font-medium tracking-[0.4em] text-white/40">
            {brand.tagline}
          </div>
        </div>
      </a>

      {/* Desktop nav */}
      <ul className="hidden items-center gap-8 lg:flex">
        {nav.map((item) => (
          <li key={item.href}>
            <a
              href={item.href}
              className="group relative font-rajdhani text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-white/65 transition-colors hover:text-[color:var(--color-neon)]"
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 h-[1px] w-0 bg-[color:var(--color-neon)] transition-all duration-300 group-hover:w-full" />
            </a>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-3">
        <a href="#cta" className="hidden sm:inline-flex">
          <MagneticButton variant="primary" strength={0.18}>
            Get Quote
          </MagneticButton>
        </a>

        {/* Hamburger */}
        <button
          aria-label="Open menu"
          onClick={onOpenMenu}
          className="group relative flex h-10 w-10 items-center justify-center rounded-md border border-white/10 bg-white/[0.03] transition-colors hover:border-[color:var(--color-neon)]/50"
        >
          <span className="relative flex h-3 w-5 flex-col justify-between">
            <span className="block h-[1.5px] w-full bg-[color:var(--color-neon)] transition-transform duration-300 group-hover:translate-y-[2px]" />
            <span className="block h-[1.5px] w-3/4 self-end bg-[color:var(--color-neon)] transition-all duration-300 group-hover:w-full group-hover:-translate-y-[2px]" />
          </span>
        </button>
      </div>
    </motion.nav>
  )
}
