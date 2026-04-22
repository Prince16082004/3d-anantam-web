import { useEffect, useRef } from 'react'

/**
 * LiquidCursor — dual-layer custom cursor with smooth trailing and
 * magnetic hover detection on interactive elements.
 */
export default function LiquidCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!matchMedia('(pointer: fine)').matches) return

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const dotPos = { x: mouse.x, y: mouse.y }
    const ringPos = { x: mouse.x, y: mouse.y }
    let hovered = false
    let pressing = false
    let rafId = 0

    function onMove(e: PointerEvent) {
      mouse.x = e.clientX
      mouse.y = e.clientY

      const el = e.target as HTMLElement | null
      const interactive = el?.closest<HTMLElement>(
        'a, button, [role="button"], input, select, textarea, [data-cursor="hover"]',
      )
      hovered = Boolean(interactive)
    }

    function onDown() {
      pressing = true
    }
    function onUp() {
      pressing = false
    }

    function tick() {
      dotPos.x += (mouse.x - dotPos.x) * 0.5
      dotPos.y += (mouse.y - dotPos.y) * 0.5
      ringPos.x += (mouse.x - ringPos.x) * 0.18
      ringPos.y += (mouse.y - ringPos.y) * 0.18

      const scale = hovered ? 1.8 : pressing ? 0.7 : 1
      const opacity = hovered ? 0.9 : 0.6

      dot!.style.transform = `translate3d(${dotPos.x}px, ${dotPos.y}px, 0) translate(-50%, -50%)`
      ring!.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) translate(-50%, -50%) scale(${scale})`
      ring!.style.opacity = String(opacity)
      rafId = requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    rafId = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <>
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-10 w-10 rounded-full border border-[color:var(--color-neon)] mix-blend-screen transition-[opacity,background] duration-200"
        style={{
          boxShadow: '0 0 24px rgba(0,245,255,0.4), inset 0 0 12px rgba(0,245,255,0.25)',
        }}
      />
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-1.5 w-1.5 rounded-full bg-[color:var(--color-neon)] mix-blend-screen"
        style={{ boxShadow: '0 0 10px rgba(0,245,255,0.9)' }}
      />
    </>
  )
}
