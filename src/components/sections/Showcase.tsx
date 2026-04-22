import { motion } from 'framer-motion'
import SectionHeader from '../ui/SectionHeader'
import ProductVisual from '../ui/ProductVisual'
import type { Product } from '../../data/products'

const tiles: { shape: Product['shape']; color: string; label: string; tag: string }[] = [
  { shape: 'frame', color: '#00f5ff', label: 'Freestyle Quad Frame', tag: 'Racing · 210mm' },
  { shape: 'mount', color: '#ff6b35', label: 'Adjustable Cam Rig', tag: '0–45° tilt' },
  { shape: 'chassis', color: '#00d4aa', label: '4WD Robot Platform', tag: 'Modular · IoT' },
  { shape: 'disc', color: '#7c6fff', label: 'Flex Prop Guards', tag: 'TPU · 5"' },
  { shape: 'plate', color: '#00f5ff', label: 'FPV Deck Plate', tag: 'Universal' },
  { shape: 'tube', color: '#ff6b35', label: 'Carbon Arm Unit', tag: '10mm · 220mm' },
]

export default function Showcase() {
  return (
    <section id="showcase" className="relative z-10 overflow-hidden px-4 py-24 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          align="center"
          tag="Gallery"
          title="Showcase"
          subtitle="A glimpse into the studio. Rotate, inspect, and explore production-ready parts."
        />

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tiles.map((t, i) => (
            <motion.div
              key={t.label}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: i * 0.06, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-[color:var(--color-neon)]/12 bg-[color:var(--color-card)]/70 backdrop-blur-md transition-all duration-500 hover:border-[color:var(--color-neon)]/40 hover:shadow-[0_24px_80px_-30px_rgba(0,245,255,0.35)]"
            >
              <ProductVisual shape={t.shape} color={t.color} speed={16 + i * 2} />

              {/* Readout overlay */}
              <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-5">
                <div className="flex items-center justify-between">
                  <span className="font-rajdhani text-[0.6rem] uppercase tracking-[0.3em] text-white/40">
                    0{i + 1} / 0{tiles.length}
                  </span>
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{
                      background: t.color,
                      boxShadow: `0 0 12px ${t.color}`,
                    }}
                  />
                </div>
                <div>
                  <div className="font-rajdhani text-[0.65rem] uppercase tracking-[0.28em] text-[color:var(--color-neon)]">
                    {t.tag}
                  </div>
                  <div className="mt-1 font-display text-[0.95rem] font-black uppercase tracking-wide text-white/90">
                    {t.label}
                  </div>
                </div>
              </div>

              {/* Corner crosshair */}
              <span className="pointer-events-none absolute left-3 top-3 h-3 w-3 border-l border-t border-[color:var(--color-neon)]/50" />
              <span className="pointer-events-none absolute bottom-3 right-3 h-3 w-3 border-b border-r border-[color:var(--color-neon)]/50" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
