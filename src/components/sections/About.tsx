import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { features } from '../../data/site'
import SectionHeader from '../ui/SectionHeader'
import MagneticButton from '../ui/MagneticButton'
import PrinterScene from '../three/PrinterScene'

export default function About({ mountScene = true }: { mountScene?: boolean } = {}) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [60, -60])

  return (
    <section
      id="about"
      ref={ref}
      className="relative z-10 overflow-hidden bg-[color:var(--color-bg)] py-28 px-4 sm:px-8"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 md:grid-cols-2">
        <motion.div
          style={{ y }}
          className="relative mx-auto w-full max-w-md"
        >
          <div
            className="aspect-[4/3] overflow-hidden rounded-2xl border border-[color:var(--color-neon)]/15 bg-gradient-to-br from-[#081424] to-[#0a1f2e]"
            style={{ boxShadow: '0 40px 80px -30px rgba(0,245,255,0.25)' }}
          >
            {mountScene && <PrinterScene />}
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="glass absolute -bottom-6 -right-4 flex flex-col gap-0.5 rounded-xl px-5 py-4 text-left"
          >
            <div className="font-rajdhani text-[0.6rem] uppercase tracking-[0.3em] text-white/40">
              Based in
            </div>
            <div className="font-display text-xl font-black text-white">PUNE</div>
            <div className="text-[0.65rem] text-white/40">Maharashtra, India</div>
          </motion.div>
        </motion.div>

        <div>
          <SectionHeader
            tag="Who We Are"
            title={
              <>
                Built by Engineers,
                <br />
                for Engineers
              </>
            }
            subtitle="Anantam Aerials & Robotics started with a passion for drones and a belief that precision manufacturing shouldn't be out of reach for students and startups."
          />

          <ul className="mt-8 space-y-3">
            {features.map((f, i) => (
              <motion.li
                key={f}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="flex items-start gap-3 text-[0.9rem] text-white/60"
              >
                <span
                  className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--color-neon)]"
                  style={{ boxShadow: '0 0 8px rgba(0,245,255,0.8)' }}
                />
                <span>{f}</span>
              </motion.li>
            ))}
          </ul>

          <div className="mt-8">
            <MagneticButton variant="secondary">
              Our Story
              <span aria-hidden>↗</span>
            </MagneticButton>
          </div>
        </div>
      </div>
    </section>
  )
}
