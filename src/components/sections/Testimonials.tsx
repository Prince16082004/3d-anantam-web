import { motion } from 'framer-motion'
import { testimonials } from '../../data/site'
import SectionHeader from '../ui/SectionHeader'

export default function Testimonials() {
  return (
    <section className="relative z-10 bg-[color:var(--color-bg-2)] py-24 px-4 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          align="center"
          tag="Trusted by Builders"
          title="From the Workbench"
          subtitle="Feedback from engineers, clubs, and startups across Pune."
        />

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.blockquote
              key={t.author}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ delay: i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="group relative flex flex-col rounded-xl border border-[color:var(--color-neon)]/10 bg-[color:var(--color-card)]/70 p-7 backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:border-[color:var(--color-neon)]/30"
            >
              <span
                aria-hidden
                className="absolute -top-3 left-6 font-display text-5xl leading-none text-[color:var(--color-neon)]/35"
              >
                &ldquo;
              </span>
              <div className="flex gap-1 text-[color:var(--color-orange)]">
                {Array.from({ length: t.stars }).map((_, idx) => (
                  <span
                    key={idx}
                    className="text-sm"
                    style={{ textShadow: '0 0 8px rgba(255,107,53,0.5)' }}
                  >
                    ★
                  </span>
                ))}
              </div>
              <p className="mt-4 grow text-[0.92rem] leading-relaxed text-white/70">
                {t.text}
              </p>
              <footer className="mt-6 border-t border-white/5 pt-4">
                <cite className="block font-rajdhani text-[0.95rem] font-bold not-italic text-white/90">
                  {t.author}
                </cite>
                <span className="mt-0.5 block font-rajdhani text-[0.72rem] uppercase tracking-[0.15em] text-white/40">
                  {t.role}
                </span>
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  )
}
