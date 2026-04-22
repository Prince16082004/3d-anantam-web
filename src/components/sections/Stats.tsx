import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { stats } from '../../data/site'

function StatNumber({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-20%' })
  const mv = useMotionValue(0)
  const spring = useSpring(mv, { stiffness: 60, damping: 22, mass: 1 })
  const rounded = useTransform(spring, (v) =>
    v >= 1000 ? Math.round(v).toLocaleString() : Math.round(v).toString(),
  )

  useEffect(() => {
    if (inView) mv.set(value)
  }, [inView, mv, value])

  return (
    <span
      ref={ref}
      className="font-display text-[1.9rem] font-black text-[color:var(--color-neon)]"
      style={{ textShadow: '0 0 20px rgba(0,245,255,0.35)' }}
    >
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  )
}

export default function Stats() {
  return (
    <div className="relative z-10 mx-auto -mt-10 flex max-w-6xl flex-wrap justify-center border-y border-[color:var(--color-neon)]/10 bg-[color:var(--color-card)]/60 backdrop-blur-md">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex min-w-[150px] flex-1 flex-col items-center gap-1 px-4 py-6 text-center"
        >
          {i > 0 && (
            <span className="pointer-events-none absolute left-0 top-1/2 h-10 w-px -translate-y-1/2 bg-[color:var(--color-neon)]/10" />
          )}
          <StatNumber value={s.value} suffix={s.suffix} />
          <div className="font-rajdhani text-[0.65rem] font-medium uppercase tracking-[0.3em] text-white/45">
            {s.label}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
