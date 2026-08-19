# Ashford & Vane — The Anatomy of a Suit

A scroll-driven marketing site for a bespoke tailoring house. The signature
mechanic: a suit assembles itself — bare form → shirt → waistcoat → jacket —
on a pinned canvas as you scroll, driven by a pre-rendered image sequence
scrubbed with GSAP ScrollTrigger.

## Stack
Next.js 15 (App Router) · TypeScript · Tailwind v4 · GSAP 3 (ScrollTrigger,
Observer, CustomEase) · Lenis (wired into GSAP's ticker).

## Run
```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
```

## The assembly sequence
Frames live in `public/sequence/frame-000…119.webp` (desktop, 960²) and
`public/sequence/sm/frame-000…059.webp` (mobile, 800²). The engine is
`components/acts/AssemblyCanvas.tsx` + `lib/useImageSequence.ts`.

### Swap in real renders
Replace the files at the paths above, keeping the same numbering, dimensions,
locked camera, and lighting. Nothing else changes. Keep desktop ≤ 6 MB total
and mobile ≤ 2 MB.

The current frames were extracted from a generated 5s assembly film with:
```bash
ffmpeg -i assembly.mp4 -vf "scale=960:960:flags=lanczos" -frames:v 120 -start_number 0 f/frame-%03d.png
for f in f/*.png; do cwebp -q 78 "$f" -o "public/sequence/$(basename "$f" .png).webp"; done
```

### Placeholder generator
If you have no renders yet, generate a procedural stand-in:
```bash
npm i -D sharp
npm run gen:sequence
```
Writes a morphing-silhouette sequence to the same paths.

## Content
All copy is typed in `lib/copy.ts`. No CMS.

## Accessibility
`prefers-reduced-motion: reduce` replaces the pinned scrub with six static key
frames in a vertical stack (same copy), and disables Lenis. Hotspot drawers
trap focus and restore it on close.

## Notes
- `_legacy/` holds the earlier standalone HTML prototype; it is not part of the build.
- The Wearer section ships with a poster image; drop a muted looping
  `wearer.webm`/`.mp4` into `public/media/` and uncomment the `<video>` in
  `components/acts/Wearer.tsx`.
