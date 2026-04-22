# Test plan — Futuristic 3D UI rebuild (PR #1)

Scope: this PR replaces the entire frontend with a React 19 + R3F + Tailwind v4 single-page experience. `server/`, `Dockerfile`, `vercel.json`, `.env` untouched. No CI is configured on the repo, no human PR comments.

Test target: `http://localhost:5173` (dev server run locally from `devin/1776880629-futuristic-3d-ui`).

## Primary flow — Instant Quote calculator math is deterministic

Source: `src/components/sections/Upload.tsx` L13–15 — `price = Math.round(mat * infill * weight * qty)`. Materials: PLA=2, PETG=3, TPU=4, Carbon Fiber Nylon=6, Resin=8 (from `src/data/site.ts`). Infills: 15%→1, 30%→1.3, 60%→1.6, 100%→2.

1. Click the `Instant Quote` link in the menu (or scroll to `#upload`).
2. Observe initial state with defaults.
   - **Expect**: price label reads exactly `₹221` (from 2 × 1.3 × 85 × 1 = 221).
3. Change `Quantity` input to `3`.
   - **Expect**: price label updates to exactly `₹663` (2 × 1.3 × 85 × 3 = 663).
4. Reset qty to `1`. Change `Material` select to `Carbon Fiber Nylon`.
   - **Expect**: price label updates to exactly `₹1,989` (6 × 1.3 × 85 × 1 = 663 × 3 = 1989, rendered with thousands separator).
5. Keep Carbon Fiber. Change `Infill` select to `100%`.
   - **Expect**: price label updates to exactly `₹1,020` (6 × 2 × 85 × 1 = 1020).

**Fail criterion**: any computed price differs from the expected integer above, or price fails to update when inputs change (stale memo).

## Secondary assertion set (one continuous walkthrough)

- **Loader fades within 2.5s** — `src/components/Loader.tsx` animates to 100% over 1.6s then fades in 320ms. Expect the "ANANTAM CALIBRATING SYSTEMS" overlay to disappear within ~2.5s of page load and the hero to be interactive after.
- **Hero Canvas exists and is non-empty** — Expect a `<canvas>` inside the hero section with non-zero pixel content (visible drone silhouette). A broken WebGL mount would leave the area black or show a fallback div without a canvas tag.
- **Menu open/close** — Click hamburger at top-right (`Navbar.tsx` → `onOpenMenu`). Expect fullscreen overlay with 5 links: Products, Services, Custom Print, About, Showcase. Press `Escape`. Expect the overlay to be fully removed from DOM within ~800ms (clip-path morph completes; no lingering overlay blocking clicks).
- **Category filter — Robotics → exactly 2 visible product cards** — In `#products` section, click the `Robotics` pill. `src/data/products.ts` has exactly 2 items with `category: 'Robotics'`. Expect the grid to shrink from 8 cards to 2 cards (`RC Car Chassis` and `Servo Bracket` style names).
- **Stats counter animates** — Scroll to the stats strip. Expect numeric labels (12,400+, 380+, 5, 50, 14+) to animate up from `0` to final values; a broken implementation would either stay at `0` or show the final value immediately without animation.

## Why each test would fail a broken build

- Quote: the memo depends on 4 state values; a misplaced deps array would produce stale prices. A unit conversion error (mat*weight or infill expressed as percent) would produce a value off by 10–100×.
- Canvas: if R3F fails to mount (e.g. Three version mismatch, bloom shader error) the Canvas component would throw or leave the section empty.
- Menu: if the Escape handler isn't wired (`useEffect` with keydown listener) the overlay persists; if clip-path animation is broken, the close transition stutters or leaves a partial overlay.
- Filter: if the filter predicate is inverted or category strings are mismatched, count won't match expected 2.
- Counter: if `useInView` threshold is wrong, numbers never animate.

## Out-of-scope for this pass

- Razorpay, auth, cart, admin: none of these are in the new UI (pending future integration PR).
- Mobile viewport: desktop-first per spec; a brief mobile check is a nice-to-have.
- Lighthouse/perf scoring: not required by brief.
