import { motion } from 'framer-motion'
import { services } from '../../data/site'
import SectionHeader from '../ui/SectionHeader'

export default function Services() {
  return (
    <section id="services" className="relative z-10 py-24 px-4 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          align="center"
          tag="What We Do"
          title="Full-Stack 3D Services"
          subtitle="From prototype to production — we handle it all, end to end."
        />
        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <motion.article
              key={s.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ delay: i * 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="group relative overflow-hidden rounded-xl border border-[color:var(--color-neon)]/10 bg-[color:var(--color-card)]/70 p-8 backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:border-[color:var(--color-neon)]/35"
              style={{
                boxShadow: '0 10px 40px -20px rgba(0,0,0,0.6)',
              }}
            >
              {/* Bottom accent line */}
              <span
                className="pointer-events-none absolute bottom-0 left-0 right-0 h-[2px] origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
                style={{
                  background: `linear-gradient(90deg, transparent, ${s.accent}, transparent)`,
                }}
              />
              {/* Corner glow */}
              <span
                className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity duration-700 group-hover:opacity-100"
                style={{ background: s.accent }}
              />

              <div
                className="relative mb-6 flex h-12 w-12 items-center justify-center rounded-lg border text-xl"
                style={{
                  background: `${s.accent}14`,
                  borderColor: `${s.accent}55`,
                  boxShadow: `0 0 20px ${s.accent}33`,
                }}
              >
                {s.icon}
              </div>

              <h3 className="relative font-rajdhani text-[1.15rem] font-bold tracking-wide text-white/90">
                {s.name}
              </h3>
              <p className="relative mt-2 text-[0.85rem] leading-relaxed text-white/50">
                {s.desc}
              </p>
              <div
                className="relative mt-5 font-display text-[0.8rem] font-bold tracking-wide"
                style={{ color: s.accent }}
              >
                {s.price}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
