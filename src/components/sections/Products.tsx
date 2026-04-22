import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { categories, products, type ProductCategory } from '../../data/products'
import SectionHeader from '../ui/SectionHeader'
import ProductMesh from '../three/ProductMesh'
import MagneticButton from '../ui/MagneticButton'

function useTilt() {
  return (e: React.PointerEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    el.style.setProperty('--rx', `${-py * 8}deg`)
    el.style.setProperty('--ry', `${px * 10}deg`)
    el.style.setProperty('--mx', `${((px + 0.5) * 100).toFixed(1)}%`)
    el.style.setProperty('--my', `${((py + 0.5) * 100).toFixed(1)}%`)
  }
}

function tiltReset(e: React.PointerEvent<HTMLDivElement>) {
  const el = e.currentTarget
  el.style.setProperty('--rx', '0deg')
  el.style.setProperty('--ry', '0deg')
}

export default function Products() {
  const [cat, setCat] = useState<ProductCategory>('All')
  const onTilt = useTilt()

  const filtered = useMemo(
    () => (cat === 'All' ? products : products.filter((p) => p.category === cat)),
    [cat],
  )

  return (
    <section id="products" className="relative z-10 bg-[color:var(--color-bg-2)] py-24 px-4 sm:px-8">
      {/* Infinite marquee banner above grid */}
      <div className="marquee mask-gradient mx-auto mb-16 max-w-7xl overflow-hidden border-y border-[color:var(--color-neon)]/10 py-3">
        <div
          className="marquee-track flex w-max items-center gap-12 whitespace-nowrap"
          style={{ ['--marquee-duration' as string]: '38s' }}
        >
          {Array.from({ length: 2 }).map((_, loop) => (
            <div key={loop} className="flex items-center gap-12">
              {[
                'Carbon Fiber Composites',
                'PLA · PETG · TPU · Nylon · Resin',
                '50µ Layer Precision',
                '24–48h Turnaround',
                'Pune, Maharashtra',
                'Engineering Studios · Pro Shop',
                'Student Friendly Pricing',
                'Bulk Order Ready',
              ].map((w, i) => (
                <span
                  key={`${loop}-${i}`}
                  className="flex items-center gap-4 font-rajdhani text-[0.78rem] uppercase tracking-[0.3em] text-white/45"
                >
                  {w}
                  <span className="inline-block h-1 w-1 rounded-full bg-[color:var(--color-neon)]/60" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <SectionHeader
            tag="Our Catalog"
            title="Ready-to-Ship Parts"
            subtitle="Premium 3D printed drone & robotics components. Ships within 24hrs."
          />
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`rounded-md border px-4 py-1.5 font-rajdhani text-[0.7rem] font-semibold uppercase tracking-[0.18em] transition-all ${
                  cat === c
                    ? 'border-[color:var(--color-neon)] bg-[color:var(--color-neon)]/10 text-[color:var(--color-neon)]'
                    : 'border-[color:var(--color-neon)]/20 text-white/55 hover:border-[color:var(--color-neon)]/50 hover:text-[color:var(--color-neon)]'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((p, i) => (
            <motion.div
              key={p.id}
              layout
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: i * 0.06, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              onPointerMove={onTilt}
              onPointerLeave={tiltReset}
              className="group relative overflow-hidden rounded-xl border border-[color:var(--color-neon)]/10 bg-[color:var(--color-card)]/70 backdrop-blur-md transition-[border,box-shadow] duration-500 hover:border-[color:var(--color-neon)]/45 hover:shadow-[0_20px_60px_-20px_rgba(0,245,255,0.25)]"
              style={{
                transform: 'perspective(900px) rotateX(var(--rx,0)) rotateY(var(--ry,0))',
                transformStyle: 'preserve-3d',
                transition: 'transform 0.25s cubic-bezier(0.22,1,0.36,1), border-color 0.3s',
              }}
            >
              {/* Cursor-follow spotlight */}
              <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background:
                    'radial-gradient(500px circle at var(--mx,50%) var(--my,50%), rgba(0,245,255,0.15), transparent 40%)',
                }}
              />

              {/* 3D viz */}
              <div className="relative h-44 overflow-hidden bg-gradient-to-br from-[#0a1520] to-[#12202e]">
                <Canvas
                  dpr={[1, 1.5]}
                  camera={{ position: [1.4, 1, 2.2], fov: 35 }}
                  gl={{ alpha: true, antialias: true }}
                >
                  <ambientLight intensity={0.5} />
                  <directionalLight position={[3, 4, 2]} intensity={1.4} />
                  <pointLight position={[-2, 1, -1]} intensity={1} color={p.color} />
                  <ProductMesh shape={p.shape} color={p.color} speed={0.4 + i * 0.04} />
                </Canvas>
                {p.badge && (
                  <span
                    className="absolute left-3 top-3 rounded-sm px-2 py-0.5 font-rajdhani text-[0.6rem] font-bold uppercase tracking-[0.15em] text-white"
                    style={{
                      background: 'linear-gradient(135deg,#ff6b35,#ff4500)',
                      boxShadow: '0 0 16px rgba(255,107,53,0.35)',
                    }}
                  >
                    {p.badge}
                  </span>
                )}
                <span className="absolute right-3 top-3 rounded-sm border border-white/10 bg-black/30 px-2 py-0.5 font-display text-[0.6rem] tracking-[0.2em] text-white/55 backdrop-blur-sm">
                  {p.category}
                </span>
              </div>

              <div className="p-5">
                <h3 className="font-rajdhani text-[1.05rem] font-bold tracking-wide text-white/90">
                  {p.name}
                </h3>
                <p className="mt-1 text-[0.78rem] leading-relaxed text-white/50">{p.desc}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-display text-[1rem] font-bold text-[color:var(--color-neon)]">
                    {p.price}
                  </span>
                  <MagneticButton variant="ghost" strength={0.2}>
                    Add
                    <span aria-hidden>+</span>
                  </MagneticButton>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
