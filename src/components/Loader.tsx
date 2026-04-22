import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

// Duration the "calibrating" screen stays up before fading out. Kept short on
// purpose: the heavy 3D scenes take a moment to warm up so we don't want to
// block the user behind an arbitrarily long fake-progress animation.
const LOADER_DURATION_MS = 1600
const FADE_DELAY_MS = 320

export default function Loader() {
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(true)

  // Progress number is cosmetic — drive it with a cheap setInterval so a
  // frame-starved main thread (three.js warm-up, shader compile) doesn't keep
  // the loader pinned. A hard setTimeout guarantees we always dismiss.
  useEffect(() => {
    const start = Date.now()
    const tick = setInterval(() => {
      const elapsed = Date.now() - start
      const t = Math.min(1, elapsed / LOADER_DURATION_MS)
      const eased = 1 - Math.pow(1 - t, 3)
      setProgress(Math.round(eased * 100))
      if (t >= 1) clearInterval(tick)
    }, 40)

    const hide = setTimeout(() => {
      setProgress(100)
      setVisible(false)
    }, LOADER_DURATION_MS + FADE_DELAY_MS)

    return () => {
      clearInterval(tick)
      clearTimeout(hide)
    }
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-[color:var(--color-bg-2)]"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: 'easeInOut' } }}
        >
          {/* Grid backdrop */}
          <div className="grid-bg pointer-events-none absolute inset-0 opacity-40" />
          {/* Radial glow */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(0,245,255,0.12), transparent 60%)',
            }}
          />

          {/* Rotating drone ring */}
          <div className="relative mb-8 h-36 w-36">
            <motion.div
              className="absolute inset-0 rounded-full border border-[color:var(--color-neon)]/40"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              style={{
                boxShadow: '0 0 40px rgba(0,245,255,0.25), inset 0 0 20px rgba(0,245,255,0.15)',
              }}
            />
            <motion.div
              className="absolute inset-3 rounded-full border border-[color:var(--color-orange)]/30"
              animate={{ rotate: -360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              className="absolute inset-6 rounded-full border border-dashed border-[color:var(--color-neon)]/60"
              animate={{ rotate: 360 }}
              transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
            />
            {/* Center drone body */}
            <motion.div
              className="absolute left-1/2 top-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-md bg-[color:var(--color-neon)]/10 backdrop-blur-sm"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                border: '1px solid rgba(0,245,255,0.6)',
                boxShadow: '0 0 24px rgba(0,245,255,0.5)',
              }}
            />
          </div>

          <div className="font-display text-xs tracking-[0.5em] text-[color:var(--color-neon)]">
            ANANTAM
          </div>
          <div className="mt-2 font-rajdhani text-[10px] tracking-[0.35em] text-white/40">
            CALIBRATING SYSTEMS
          </div>

          {/* Progress bar */}
          <div className="mt-10 h-[2px] w-64 max-w-[60vw] overflow-hidden rounded-full bg-white/5">
            <motion.div
              className="h-full rounded-full"
              style={{
                width: `${progress}%`,
                background:
                  'linear-gradient(90deg, var(--color-neon), var(--color-orange))',
                boxShadow: '0 0 12px rgba(0,245,255,0.6)',
              }}
            />
          </div>
          <div className="mt-3 font-display text-[11px] tabular-nums text-white/55">
            {String(progress).padStart(3, '0')}%
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
