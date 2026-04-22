import { useEffect, useState } from 'react'
import Loader from './components/Loader'
import LiquidCursor from './components/LiquidCursor'
import Navbar from './components/Navbar'
import InteractiveMenu from './components/InteractiveMenu'
import ScrollProgress from './components/ScrollProgress'
import ParticleField from './components/background/ParticleField'
import Hero from './components/sections/Hero'
import Stats from './components/sections/Stats'
import Products from './components/sections/Products'
import Services from './components/sections/Services'
import Upload from './components/sections/Upload'
import About from './components/sections/About'
import Showcase from './components/sections/Showcase'
import Testimonials from './components/sections/Testimonials'
import CTA from './components/sections/CTA'
import Footer from './components/Footer'
import { useLenis } from './hooks/useLenis'

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  // Gate heavy WebGL scenes behind the loader — mounting three Canvases while
  // the loader is running starves its setTimeout on low-end hardware.
  const [ready, setReady] = useState(false)
  useLenis()

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 1800)
    return () => clearTimeout(t)
  }, [])

  // Hash-fade scroll spy — nothing critical, just adds polish
  useEffect(() => {
    const handler = () => {
      document.documentElement.style.setProperty(
        '--scroll',
        String(window.scrollY),
      )
    }
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <div className="relative">
      <Loader />
      <LiquidCursor />
      <ScrollProgress />
      {ready && <ParticleField />}

      <Navbar onOpenMenu={() => setMenuOpen(true)} />
      <InteractiveMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

      <main className="relative noise">
        <Hero mountScene={ready} />
        <Stats />
        <Products />
        <Services />
        <Upload />
        <About mountScene={ready} />
        <Showcase />
        <Testimonials />
        <CTA />
      </main>

      <Footer />
    </div>
  )
}
