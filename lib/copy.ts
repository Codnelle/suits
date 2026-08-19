// All site copy, typed. Written to spec — edit here, nowhere else.

export const copy = {
  hero: {
    brand: "ASHFORD & VANE",
    pills: ["Bespoke Tailoring", "Savile Row", "Est. 1887"],
    tag: "BESPOKE ATELIER",
    words: ["CUT.", "CANVAS.", "CHARACTER."],
    sub: "Bespoke suits, cut for one man and one body — yours.",
    cta: "BOOK A FITTING",
    menu: "MENU",
  },
  act0: {
    crest: "A · V",
    estLeft: "BESPOKE TAILORS",
    estRight: "EST. MDCCCLXXXVII",
    eyebrow: "SAVILE ROW — CHAPTER I",
    displayA: "The Anatomy",
    displayB: "of a Suit",
    support:
      "A suit is not worn — it is built. Bone by bone, canvas by canvas, around one man and no other.",
    manifesto: "Seventeen hands · Eighty hours · One body",
    cities: "LONDON · MILAN · NEW YORK",
    cue: "BEGIN",
    index: ["I — The Anatomy", "II — The Detail", "III — The Cloth", "IV — The Fitting"],
  },
  assembly: {
    acts: [
      {
        n: "01",
        label: "FOUNDATION",
        title: "A Shirt of Pure Cotton",
        body:
          "Egyptian two-ply poplin, 120s. Cut with a full sleeve head so the arm moves before the jacket does. Mother-of-pearl, sewn with a shank — so the button sits above the cloth, not in it.",
        range: [0.1, 0.3] as [number, number],
        frames: [0, 39] as [number, number],
      },
      {
        n: "02",
        label: "STRUCTURE",
        title: "Structure Held Close",
        body:
          "The waistcoat is the only part of a suit worn against the body all day. Five buttons, the last undone — a habit borrowed from a king with a large appetite, and kept because it lets you sit down.",
        range: [0.38, 0.58] as [number, number],
        frames: [40, 71] as [number, number],
      },
      {
        n: "03",
        label: "CANVAS",
        title: "Built on Full Canvas",
        body:
          "Inside is a floating layer of horsehair and camel hair, attached by hand at three thousand stitches. It is never glued. Glue is fast, and it dies in four years. Canvas learns your chest and keeps it.",
        range: [0.66, 0.92] as [number, number],
        frames: [72, 119] as [number, number],
      },
    ],
  },
  hotspots: [
    {
      id: "collar",
      title: "Padded Under-Collar",
      note:
        "Railroad stitching through the collar's underside so it grips the neck and never gaps when you turn your head.",
      x: 0.5,
      y: 0.2,
    },
    {
      id: "armhole",
      title: "Hand-Sewn Armhole",
      note:
        "Cut high and finished by hand. The jacket stays on the shoulder when the arm lifts, instead of dragging the whole body with it.",
      x: 0.68,
      y: 0.34,
    },
    {
      id: "lapel",
      title: "Lapel Roll",
      note:
        "Never pressed flat. The canvas is shaped so the lapel curves off the chest in a soft, living line.",
      x: 0.4,
      y: 0.42,
    },
    {
      id: "buttonholes",
      title: "Working Buttonholes",
      note:
        "Four on each cuff, hand-cut and gimped. Ninety minutes each. The last one is left undone.",
      x: 0.72,
      y: 0.66,
    },
  ],
  detail: {
    label: "04",
    title: "The Detail",
    lead: "Everything that matters is sewn by hand, and most of it you will never see.",
    plates: [
      { k: "SURGEON'S CUFF", title: "The Surgeon's Cuff", caption: "Four horn buttons, hand-set on real buttonholes. The last is left undone — so the world knows it opens.", media: "detail-cuff" },
      { k: "THE LINING", title: "The Lining", caption: "Bronze Bemberg silk, cut oversize and eased in, so the jacket never fights the shirt beneath it.", media: "detail-lining" },
      { k: "PICK-STITCH", title: "The Pick-Stitch", caption: "Six millimetres from the edge, set by hand — visible only when the light rakes across the lapel.", media: "detail-pickstitch" },
      { k: "BUTTONHOLE", title: "The Buttonhole", caption: "Cut, never punched. Gimped in fine silk. Ninety unhurried minutes for a single one.", media: "detail-buttonhole" },
    ],
    closer: "The last quarter-inch is the whole job.",
  },
  wearer: {
    label: "05",
    tag: "THE WEARER",
    title: "Made to Be Worn",
    body:
      "Individually made to measure. Nineteen measurements, three fittings, eighty hours. Yours will never fit anyone else, which is the point.",
    counter: [19, 3, 80] as [number, number, number],
    counterLabels: ["MEASUREMENTS", "FITTINGS", "HOURS"],
  },
  cloth: {
    label: "06",
    tag: "CLOTH",
    title: "A Language of Colour",
    swatches: [
      { id: "midnight", name: "Midnight", line: "Reads blacker than black under artificial light. Which is why it was invented.", media: "cloth-midnight", hex: "#111524" },
      { id: "herringbone", name: "Charcoal Herringbone", line: "The weave carries the light so the cloth never goes flat in a photograph.", media: "cloth-herringbone", hex: "#2b2d31" },
      { id: "pow", name: "Prince of Wales", line: "A check large enough to be noticed and quiet enough to be forgiven.", media: "cloth-pow", hex: "#5a564d" },
      { id: "ivory", name: "Ivory", line: "For eight weeks of the year, and worth the other forty-four.", media: "cloth-ivory", hex: "#d8cfbc" },
      { id: "green", name: "Bottle Green", line: "The colour a man chooses when he has already owned the other four.", media: "cloth-green", hex: "#1f2e26" },
    ],
  },
  invitation: {
    label: "07",
    tag: "INVITATION",
    title: "Tailoring for the Few",
    body:
      "Every Ashford suit is cut for one man and one body. We take a limited number of commissions each season. There is no waiting list, because we do not keep one — we simply stop.",
    cta: "BOOK A PRIVATE FITTING",
    locations: ["LONDON — 11 Savile Row", "MILAN — Via Gesù 4", "NEW YORK — 62 E 57th"],
  },
  colophon: {
    columns: [
      { h: "The House", links: ["Est. 1887", "Bespoke & Made-to-Measure", "The Ashford Standard"] },
      { h: "The Craft", links: ["Full Canvas", "Hand Finishing", "The Cloth Library"] },
      { h: "Visit", links: ["London — Savile Row", "Milan — Via Gesù", "New York — 57th"] },
    ],
    copyright: "© 2026 Ashford & Vane. All rights reserved.",
  },
  nav: {
    wordmark: "ASHFORD & VANE",
    links: ["ATELIER", "COLLECTION"],
    cta: "BOOK A FITTING",
  },
} as const;

export type Copy = typeof copy;
