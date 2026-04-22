import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { infills, materials } from '../../data/site'
import SectionHeader from '../ui/SectionHeader'
import MagneticButton from '../ui/MagneticButton'

export default function Upload() {
  const [mat, setMat] = useState(2)
  const [infill, setInfill] = useState(1.3)
  const [weight, setWeight] = useState(85)
  const [qty, setQty] = useState(1)

  const price = useMemo(() => {
    return Math.round(mat * infill * weight * qty)
  }, [mat, infill, weight, qty])

  return (
    <section id="upload" className="relative z-10 overflow-hidden px-4 py-24 sm:px-8">
      {/* Gradient fill */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'linear-gradient(135deg, rgba(7,14,26,0.6), rgba(10,21,32,0.6))',
          borderTop: '1px solid rgba(0,245,255,0.1)',
          borderBottom: '1px solid rgba(0,245,255,0.1)',
        }}
      />

      <div className="mx-auto max-w-5xl">
        <SectionHeader
          align="center"
          tag="Instant Quote"
          title="Upload Your File"
          subtitle="Get an instant price estimate in seconds. We print in 5+ materials."
        />

        <div className="mt-12 grid grid-cols-1 items-stretch gap-6 md:grid-cols-2">
          {/* Drop zone */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="glass relative flex flex-col items-center justify-center gap-4 overflow-hidden rounded-xl border-dashed p-10 text-center transition-all hover:border-[color:var(--color-neon)]/50"
            style={{
              borderStyle: 'dashed',
              borderColor: 'rgba(0,245,255,0.25)',
            }}
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-30"
              style={{
                background:
                  'radial-gradient(ellipse at center, rgba(0,245,255,0.18), transparent 60%)',
              }}
            />
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              className="relative flex h-16 w-16 items-center justify-center rounded-xl border border-[color:var(--color-neon)]/30 bg-[color:var(--color-neon)]/10 font-display text-2xl text-[color:var(--color-neon)]"
              style={{ boxShadow: '0 0 30px rgba(0,245,255,0.3)' }}
            >
              ⬆
            </motion.div>
            <div className="font-rajdhani text-base font-semibold tracking-wide text-white/85">
              Drop STL / OBJ / 3MF here
            </div>
            <div className="font-rajdhani text-[0.7rem] uppercase tracking-[0.25em] text-white/40">
              or click to browse · Max 50MB
            </div>
            <MagneticButton variant="primary" strength={0.15}>
              Upload File
              <span aria-hidden>↗</span>
            </MagneticButton>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="glass flex flex-col gap-4 rounded-xl p-8"
          >
            <Field label="Material">
              <select
                className="field-input"
                value={mat}
                onChange={(e) => setMat(parseFloat(e.target.value))}
              >
                {materials.map((m) => (
                  <option key={m.label} value={m.value} className="bg-[color:var(--color-bg)]">
                    {m.label} — {m.unit}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Infill Density">
              <select
                className="field-input"
                value={infill}
                onChange={(e) => setInfill(parseFloat(e.target.value))}
              >
                {infills.map((m) => (
                  <option key={m.label} value={m.value} className="bg-[color:var(--color-bg)]">
                    {m.label}
                  </option>
                ))}
              </select>
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Weight (g)">
                <input
                  className="field-input"
                  type="number"
                  min={1}
                  max={5000}
                  value={weight}
                  onChange={(e) => setWeight(Math.max(1, parseInt(e.target.value) || 0))}
                />
              </Field>
              <Field label="Quantity">
                <input
                  className="field-input"
                  type="number"
                  min={1}
                  max={500}
                  value={qty}
                  onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 0))}
                />
              </Field>
            </div>

            <div
              className="mt-2 flex items-center justify-between rounded-lg border border-[color:var(--color-neon)]/20 bg-[color:var(--color-neon)]/5 px-4 py-3"
              style={{ boxShadow: 'inset 0 0 20px rgba(0,245,255,0.06)' }}
            >
              <div>
                <div className="font-rajdhani text-[0.7rem] uppercase tracking-[0.25em] text-white/45">
                  Estimated Cost
                </div>
                <div className="mt-0.5 text-[0.62rem] text-white/30">
                  + delivery charges apply
                </div>
              </div>
              <div className="font-display text-2xl font-black text-[color:var(--color-neon)]">
                ₹{price.toLocaleString()}
              </div>
            </div>

            <MagneticButton variant="primary" strength={0.12}>
              Get Final Quote
              <span aria-hidden>↗</span>
            </MagneticButton>
          </motion.div>
        </div>
      </div>

      <style>{`
        .field-input {
          width: 100%;
          background: rgba(2,4,8,0.6);
          border: 1px solid rgba(0,245,255,0.18);
          padding: 0.6rem 0.75rem;
          border-radius: 6px;
          color: #dff5ff;
          font-family: 'Rajdhani', sans-serif;
          font-size: 0.82rem;
          font-weight: 500;
          letter-spacing: 0.04em;
          outline: none;
          transition: border 0.2s, box-shadow 0.2s;
        }
        .field-input:focus {
          border-color: rgba(0,245,255,0.6);
          box-shadow: 0 0 0 3px rgba(0,245,255,0.12);
        }
      `}</style>
    </section>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-rajdhani text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-white/45">
        {label}
      </span>
      {children}
    </label>
  )
}
