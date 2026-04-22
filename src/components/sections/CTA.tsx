import { motion } from 'framer-motion'
import MagneticButton from '../ui/MagneticButton'

export default function CTA() {
  return (
    <section
      id="cta"
      className="relative z-10 overflow-hidden px-4 py-28 text-center sm:px-8"
    >
      {/* Radial glow */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        animate={{ scale: [1, 1.06, 1], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          background:
            'radial-gradient(circle, rgba(0,245,255,0.18), rgba(124,111,255,0.06) 45%, transparent 70%)',
        }}
      />
      {/* Grid */}
      <div className="grid-bg pointer-events-none absolute inset-0 -z-10 opacity-30" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto max-w-3xl"
      >
        <span className="font-rajdhani text-[0.7rem] uppercase tracking-[0.5em] text-[color:var(--color-neon)]">
          Ready when you are
        </span>
        <h2 className="mt-4 font-display text-[clamp(2rem,5vw,3.5rem)] font-black uppercase leading-[1.05] tracking-tight text-gradient">
          Ready to Print
          <br />
          Your Next Idea?
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-[0.95rem] leading-relaxed text-white/55">
          From rapid prototypes to production runs — our studio is on standby. Get a quote in
          under a minute.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a href="#upload">
            <MagneticButton variant="primary">
              Start Your Order
              <span aria-hidden>↗</span>
            </MagneticButton>
          </a>
          <a href="#about">
            <MagneticButton variant="secondary">Contact Us</MagneticButton>
          </a>
        </div>
      </motion.div>
    </section>
  )
}
