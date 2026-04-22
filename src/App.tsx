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
  useLenis()

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
      <ParticleField />

      <Navbar onOpenMenu={() => setMenuOpen(true)} />
      <InteractiveMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

      <main className="relative noise">
        <Hero />
        <Stats />
        <Products />
        <Services />
        <Upload />
        <About />
        <Showcase />
        <Testimonials />
        <CTA />
      </main>

      <Footer />
    </div>
  )
}
