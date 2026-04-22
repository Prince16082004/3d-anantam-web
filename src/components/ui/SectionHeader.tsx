import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface Props {
  tag: string
  title: ReactNode
  subtitle?: string
  align?: 'left' | 'center'
  className?: string
}

export default function SectionHeader({
  tag,
  title,
  subtitle,
  align = 'left',
  className = '',
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`${align === 'center' ? 'text-center mx-auto' : 'text-left'} ${className}`}
    >
      <span className="font-rajdhani text-[0.7rem] uppercase tracking-[0.4em] text-[color:var(--color-neon)]">
        {tag}
      </span>
      <h2 className="mt-3 font-display text-[clamp(1.7rem,3.6vw,2.6rem)] font-black leading-[1.1] text-white">
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-3 max-w-xl text-[0.95rem] leading-relaxed text-white/55 ${
            align === 'center' ? 'mx-auto' : ''
          }`}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  )
}
