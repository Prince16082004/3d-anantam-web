# Anantam · Futuristic 3D Web

Premium, immersive web experience for **Anantam Aerials & Robotics** — a Pune-based
3D printing & drone studio. Built with a modern React stack and real-time 3D.

## Tech stack

- **React 19** + **TypeScript** + **Vite 8**
- **Tailwind CSS v4** (via `@tailwindcss/vite`)
- **Three.js** with **@react-three/fiber** + **@react-three/drei**
- **@react-three/postprocessing** (bloom, chromatic aberration)
- **Framer Motion** (scroll-driven + gesture animations)
- **Lenis** (smooth, inertia-based scrolling)
- **GSAP** (retained for bespoke timelines)

## Features

- Interactive 3D drone hero with mouse-parallax, PBR metal + emissive neon
- 3D printer scene in the About section with live print simulation
- Liquid dual-layer custom cursor with magnetic hover
- Animated multi-ring loader with progress
- Fullscreen morphing menu with staggered line-reveal
- Infinite marquee, glassmorphism product cards with 3D tilt + cursor spotlight
- Scroll-linked parallax, reveal animations, stat counters
- Particle + shader grid 3D background
- Instant-quote calculator, stats strip, testimonials, CTA

## Scripts

```bash
npm install
npm run dev       # Start Vite dev server
npm run build     # tsc -b && vite build
npm run preview   # Preview production build
npm run lint      # ESLint
```

## Backend

The `server/` directory contains the original Express + SQLite backend (auth,
Razorpay, admin, etc.). It is **untouched** by the frontend rebuild. Run it from
`server/` with its own `package.json`.

## Structure

```
src/
├── components/
│   ├── background/        # 3D particle/grid background canvas
│   ├── sections/          # Page sections (Hero, Products, About, …)
│   ├── three/             # R3F scenes & models (Drone, Printer, ProductMesh)
│   ├── ui/                # Reusable primitives (MagneticButton, SectionHeader)
│   ├── LiquidCursor.tsx
│   ├── Loader.tsx
│   ├── Navbar.tsx
│   ├── InteractiveMenu.tsx
│   ├── ScrollProgress.tsx
│   └── Footer.tsx
├── data/                  # Static content (products, services, testimonials)
├── hooks/useLenis.ts
├── App.tsx
├── main.tsx
└── index.css              # Tailwind v4 + custom utilities & keyframes
```
