# Shahee — Made to Measure

A scroll-driven site for a bespoke tailoring house. The signature mechanic: a
suit assembles itself — bare form → shirt → waistcoat → jacket — on a pinned
canvas as you scroll, driven by a pre-rendered image sequence scrubbed with GSAP
ScrollTrigger.

## Stack
Next.js 15 (App Router) · TypeScript · Tailwind v4 · GSAP 3 (ScrollTrigger,
Observer, CustomEase) · Lenis (wired into GSAP's ticker) · Razorpay · Resend.

## Run
```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
```

## Structure
```
app/page.tsx              Hero → Master G at Home → The Collection →
                          Architecture of Detail → About Shahee → Ledger
app/order/page.tsx        Not-from-Bengalore ordering flow
app/api/razorpay/order    Creates a Razorpay order (server-side secret)
app/api/booking           Booking + order emails
```

There is no CRM integration. Customer records, order pipeline and payment are
the client's to own; when the site moves to Shopify, Shopify's own customer and
order records replace them (see *Moving to Shopify* below).

## Two ways in
1. **Bengaluru** — `BOOK TAILOR` opens the Master G modal: when & where (zone,
   address, pincode, date, time) → details + optional occasion → T&C tick →
   ₹199 home-visit fee. Requests arrive by email for confirmation.
2. **Everywhere else** — `/order`: browse the houses, open a cloth, pick lapel /
   lining / pick-stitch / buttons, enter measurements, add to cart, pay.

Both paths degrade gracefully: with no payment keys the request is still recorded
and the customer is told to expect confirmation by email; with no email key the
client falls back to a pre-filled mailto.

## Environment
Copy `.env.example` to `.env.local`.
- `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` — ₹199 visit fee and order checkout.
- `RESEND_API_KEY` / `SHAHEE_INBOX` / `SHAHEE_FROM` — where requests land.

## Content
All copy is typed in `lib/copy.ts` — houses, ranges, blends, occasions, prices,
zones and terms all live there. `media` fields carry the full filename.

## The assembly sequence
Frames live in `public/sequence/frame-000…119.webp` (desktop, 960²) and
`public/sequence/sm/frame-000…059.webp` (mobile, 800²). The engine is
`components/acts/AssemblyCanvas.tsx` + `lib/useImageSequence.ts`.

### Swap in real renders
Replace the files at the paths above, keeping the same numbering, dimensions,
locked camera, and lighting. Nothing else changes. Keep desktop ≤ 6 MB total
and mobile ≤ 2 MB.

The frames are extracted from a 5s film with:
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

## Accessibility
`prefers-reduced-motion: reduce` replaces the pinned scrub with static key frames
in a vertical stack (same copy), stops Lenis, and stills the warp backdrop. The
booking modal, fabric modal and cart drawer restore focus on close and close on
Escape.
## Moving to Shopify
The Shopify port replaces the two custom backends rather than adding to them:

| Today | On Shopify |
| --- | --- |
| `lib/cart.ts` + `CartDrawer` | Shopify cart / checkout |
| `app/api/razorpay/order` | Shopify Payments (or keep Razorpay via a gateway) |
| `app/api/booking` (email) | Shopify draft orders, or a form app (Zoho Forms, Fillout, Shopify Forms) for the home-visit bookings |

Two things are worth porting rather than dropping: the house/range/blend data in
`lib/copy.ts` maps cleanly onto **Shopify collections** (one per house) and
**product variants** (lapel / lining / pick-stitch / buttons as option sets), and
the measurement fields in `copy.measure` become a line-item property or a form
app field set.

The custom booking modal, the configurator and the design language are all
theme-layer work and can live inside a Shopify theme, so the parts of the site
that took the longest to build do not have to be rewritten.
