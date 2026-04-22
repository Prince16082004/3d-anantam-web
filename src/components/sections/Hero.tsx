import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import HeroScene from '../three/HeroScene'
import MagneticButton from '../ui/MagneticButton'

export default function Hero({ mountScene = true }: { mountScene?: boolean } = {}) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [0, 120])
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.92])

  return (
    <section
      ref={ref}
      id="top"
      className="relative isolate flex min-h-[100vh] items-center overflow-hidden px-4 pt-24 pb-12 sm:px-8"
    >
      {/* Scene */}
      <motion.div
        style={{ y, opacity, scale }}
        className="pointer-events-none absolute inset-0 z-0"
        aria-hidden
      >
        <div className="grid-bg pointer-events-none absolute inset-0 opacity-30" />
        {mountScene && <HeroScene />}
        {/* Vignette */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 50% 40%, transparent 30%, rgba(2,4,8,0.65) 75%, rgba(2,4,8,0.95) 100%)',
          }}
        />
      </motion.div>

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex animate-pulse-glow items-center gap-2 rounded-full border border-[color:var(--color-neon)]/40 bg-[color:var(--color-neon)]/8 px-4 py-1.5 font-rajdhani text-[0.72rem] font-semibold uppercase tracking-[0.25em] text-[color:var(--color-neon)]"
        >
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[color:var(--color-neon)] shadow-[0_0_8px_rgba(0,245,255,0.9)]" />
          Pune&rsquo;s Premier 3D Printing Studio
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 animate-shimmer font-display text-[clamp(2.4rem,7.2vw,5.4rem)] font-black uppercase leading-[1] tracking-[-0.01em] text-gradient"
        >
          Precision<br />
          Engineered<br />
          for the Sky
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.7 }}
          className="mt-7 max-w-xl text-[1.02rem] leading-relaxed text-white/60"
        >
          Custom drone parts, robotics components, and next-gen 3D printing services built for
          engineers, students, and innovators in Pune and beyond.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.9 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <a href="#upload">
            <MagneticButton variant="primary">
              Order Custom Parts
              <span aria-hidden>↗</span>
            </MagneticButton>
          </a>
          <a href="#services">
            <MagneticButton variant="secondary">Explore Services</MagneticButton>
          </a>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 1.5 }}
          className="absolute bottom-4 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
        >
          <span className="font-rajdhani text-[10px] uppercase tracking-[0.5em] text-white/35">
            scroll
          </span>
          <motion.span
            className="block h-8 w-[1px] bg-gradient-to-b from-[color:var(--color-neon)] to-transparent"
            animate={{ scaleY: [0.3, 1, 0.3] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: 'top' }}
          />
        </motion.div>
      </div>
    </section>
  )
}
