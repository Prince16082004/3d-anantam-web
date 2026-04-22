import { brand } from '../data/site'

const columns = [
  {
    title: 'Products',
    links: ['Drone Frames', 'Prop Guards', 'Camera Mounts', 'Landing Gear', 'Motor Mounts'],
  },
  {
    title: 'Services',
    links: ['Custom Printing', 'CAD Design', 'Bulk Orders', 'Post Processing', 'Consulting'],
  },
  {
    title: 'Company',
    links: ['About Us', 'Blog', 'Careers', 'Contact', 'Shipping Policy'],
  },
]

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/5 bg-[color:var(--color-bg-2)] px-4 pb-10 pt-16 sm:px-8">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[1.2fr_repeat(3,1fr)]">
        <div>
          <div className="font-display text-[1.1rem] font-black tracking-[0.2em] text-gradient">
            {brand.name}
          </div>
          <div className="mt-0.5 font-rajdhani text-[0.6rem] font-medium tracking-[0.4em] text-white/40">
            {brand.tagline}
          </div>
          <p className="mt-4 max-w-xs text-[0.85rem] leading-relaxed text-white/45">
            Next-generation 3D printing studio. Drones, robotics, and precision parts engineered in
            Pune.
          </p>
          <div className="mt-5 flex gap-2">
            {['in', 'ig', 'x', 'yt'].map((s) => (
              <a
                key={s}
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-md border border-white/10 bg-white/[0.03] font-rajdhani text-[0.62rem] font-bold uppercase tracking-[0.1em] text-white/55 transition-colors hover:border-[color:var(--color-neon)]/50 hover:text-[color:var(--color-neon)]"
              >
                {s}
              </a>
            ))}
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="font-rajdhani text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-[color:var(--color-neon)]">
              {col.title}
            </h4>
            <ul className="mt-4 space-y-2">
              {col.links.map((l) => (
                <li key={l}>
                  <a
                    href="#"
                    className="font-rajdhani text-[0.85rem] text-white/55 transition-colors hover:text-[color:var(--color-neon)]"
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-12 flex max-w-6xl flex-col items-start justify-between gap-2 border-t border-white/5 pt-6 text-[0.72rem] text-white/35 md:flex-row md:items-center">
        <span>© {new Date().getFullYear()} Anantam Aerials & Robotics. All rights reserved.</span>
        <span className="font-rajdhani uppercase tracking-[0.25em]">
          Engineered in Pune · Maharashtra
        </span>
      </div>
    </footer>
  )
}
