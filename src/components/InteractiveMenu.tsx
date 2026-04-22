import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import { brand, nav } from '../data/site'

interface Props {
  open: boolean
  onClose: () => void
}

export default function InteractiveMenu({ open, onClose }: Props) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.45 } }}
          transition={{ duration: 0.3 }}
        >
          {/* Animated curtain */}
          <motion.div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse at 30% 20%, rgba(0,245,255,0.12), transparent 55%), radial-gradient(ellipse at 80% 90%, rgba(255,107,53,0.1), transparent 55%), rgba(2,4,8,0.92)',
              backdropFilter: 'blur(28px) saturate(140%)',
            }}
            initial={{ clipPath: 'circle(0% at calc(100% - 2.5rem) 2rem)' }}
            animate={{ clipPath: 'circle(160% at calc(100% - 2.5rem) 2rem)' }}
            exit={{
              clipPath: 'circle(0% at calc(100% - 2.5rem) 2rem)',
              transition: { duration: 0.5, ease: [0.7, 0, 0.3, 1] },
            }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* Grid pattern */}
          <div className="grid-bg pointer-events-none absolute inset-0 opacity-30" />

          {/* Close button */}
          <div className="relative z-10 flex items-center justify-between px-4 sm:px-8 pt-5">
            <div className="font-display text-sm font-black tracking-[0.25em] text-gradient">
              {brand.name}
            </div>
            <button
              aria-label="Close menu"
              onClick={onClose}
              className="group relative flex h-10 w-10 items-center justify-center rounded-md border border-[color:var(--color-neon)]/30 bg-white/[0.03] transition-colors hover:border-[color:var(--color-neon)]"
            >
              <span className="absolute block h-[1.5px] w-4 rotate-45 bg-[color:var(--color-neon)]" />
              <span className="absolute block h-[1.5px] w-4 -rotate-45 bg-[color:var(--color-neon)]" />
            </button>
          </div>

          {/* Menu items */}
          <div className="relative z-10 flex flex-1 flex-col items-start justify-center gap-3 px-8 sm:px-16">
            <div className="mb-6 font-rajdhani text-[10px] tracking-[0.5em] text-white/35">
              NAVIGATE
            </div>
            {nav.map((item, i) => (
              <motion.a
                key={item.href}
                href={item.href}
                onClick={onClose}
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{
                  delay: 0.15 + i * 0.07,
                  duration: 0.55,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="group relative flex items-center gap-5 overflow-hidden"
              >
                <span className="font-display text-[10px] tabular-nums text-white/30 transition-colors group-hover:text-[color:var(--color-neon)]">
                  0{i + 1}
                </span>
                <span className="font-display text-[clamp(2.4rem,7vw,5rem)] font-black uppercase leading-none tracking-tight text-white/85 transition-all duration-300 group-hover:text-gradient group-hover:translate-x-2">
                  {item.label}
                </span>
                <span className="pointer-events-none absolute left-14 top-full h-px w-0 bg-gradient-to-r from-[color:var(--color-neon)] to-transparent transition-all duration-500 group-hover:w-[60%]" />
              </motion.a>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="mt-10 flex flex-col gap-1 text-sm text-white/55"
            >
              <div className="font-rajdhani text-[10px] uppercase tracking-[0.4em] text-[color:var(--color-neon)]">
                Studio
              </div>
              <div>Pune · Maharashtra</div>
              <div className="text-white/35">hello@anantam.studio</div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
