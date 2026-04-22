import { motion, useScroll, useSpring } from 'framer-motion'

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, mass: 0.3 })

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed left-0 top-0 z-[70] h-[2px] w-full origin-left"
    >
      <div
        className="h-full w-full"
        style={{
          background: 'linear-gradient(90deg, var(--color-neon), var(--color-violet), var(--color-orange))',
          boxShadow: '0 0 12px rgba(0,245,255,0.6)',
        }}
      />
    </motion.div>
  )
}
