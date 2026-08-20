// All site copy, typed. Written to spec — edit here, nowhere else.

export const copy = {
  hero: {
    brand: "SHAHEE",
    pills: ["Made to Measure", "Bengaluru", "Master G at Home"],
    tag: "A LEGACY TO CARRY",
    words: ["SHAHEE"],
    sub: "Made for the discerning, tailored for you.",
    cta: "BOOK TAILOR",
    menu: "MENU",
  },
  act0: {
    crest: "S",
    estLeft: "ROYAL INDIAN LUXURY",
    estRight: "BENGALURU",
    eyebrow: "A LEGACY TO CARRY",
    displayA: "Made for the",
    displayB: "Discerning",
    support:
      "A suit is not bought — it is made. Cloth chosen, measures taken, and cut for one man, in the comfort of his own home.",
    manifesto: "At your doorstep · Made to measure · One man",
    cities: "BENGALURU",
    cue: "BEGIN",
    index: ["I — Master G at Home", "II — The Craft", "III — The Collection", "IV — About Shahee"],
  },
  assembly: {
    acts: [
      {
        n: "01",
        label: "THE CLOTH",
        title: "Cloth Worthy of a Legacy",
        body:
          "Silk, chanderi, banarasi and brocade — the finest weaves of India, gathered into one catalogue and held to your own light. You feel every cloth in the hand before you choose it.",
        range: [0.1, 0.3] as [number, number],
        frames: [0, 39] as [number, number],
      },
      {
        n: "02",
        label: "THE MEASURE",
        title: "Measured in Your Home",
        body:
          "No showroom, no rush. Master G reads your posture before the tape is raised, then takes precise measurements on the spot — so the pattern begins with how you stand, not how you should.",
        range: [0.38, 0.58] as [number, number],
        frames: [40, 71] as [number, number],
      },
      {
        n: "03",
        label: "THE MAKE",
        title: "Made for One Man",
        body:
          "Cut and finished by craftsmen with decades at the needle. Your suit is made for one body and no other — then returned to your door, ready to be worn.",
        range: [0.66, 0.92] as [number, number],
        frames: [72, 119] as [number, number],
      },
    ],
  },
  hotspots: [
    {
      id: "collar",
      title: "Structured Collar",
      note:
        "Shaped to sit close at the neck and hold its line through the longest evening — it never gaps when you turn your head.",
      x: 0.5,
      y: 0.2,
    },
    {
      id: "armhole",
      title: "Hand-Set Sleeve",
      note:
        "Cut high and eased by hand. The arm moves freely and the jacket stays on the shoulder, instead of dragging the whole body with it.",
      x: 0.68,
      y: 0.34,
    },
    {
      id: "lapel",
      title: "The Living Lapel",
      note:
        "Never pressed flat. Rolled by hand so it curves off the chest in a soft, regal line.",
      x: 0.4,
      y: 0.42,
    },
    {
      id: "buttonholes",
      title: "Hand-Worked Cuffs",
      note:
        "Real buttonholes on every cuff, cut and finished by hand. The last is left open — the mark of a suit that was made, not bought.",
      x: 0.72,
      y: 0.66,
    },
  ],

  // The Architecture of Detail
  detail: {
    label: "03",
    tag: "THE DETAIL",
    title: "The Architecture of Detail",
    lead: "Everything that matters is finished by hand, and most of it you will never see.",
    plates: [
      {
        k: "WORKING CUFF",
        title: "The Working Cuff",
        caption: "Real buttonholes on every cuff, hand-set on horn. The last is left undone — so the world knows it opens.",
        time: "90 minutes each",
        note: "The cuff is the one place a suit openly shows how it was made. We want it to speak.",
        media: "detail-cuff",
      },
      {
        k: "THE LINING",
        title: "The Lining",
        caption: "Fine bemberg silk, cut oversize and eased in, so the jacket never fights the shirt beneath it.",
        time: "4 hours",
        note: "Lining should be felt, never seen. If it shines, it is doing the wrong job.",
        media: "detail-lining",
      },
      {
        k: "HAND PICK-STITCH",
        title: "The Pick-Stitch",
        caption: "Set by hand a few millimetres from the edge — seen only when the light rakes across the lapel.",
        time: "One stitch at a time",
        note: "A machine cannot feel the canvas underneath. The hand can, and stops just short.",
        media: "detail-pickstitch",
      },
      {
        k: "THE BUTTONHOLE",
        title: "The Buttonhole",
        caption: "Cut, never punched. Gimped in fine silk. Ninety unhurried minutes for a single one.",
        time: "90 minutes",
        note: "A punched hole frays in a season. A hand-worked one outlives its first owner.",
        media: "detail-buttonhole",
      },
    ],
    closer: "The last quarter-inch is the whole job.",
  },

  // Master G at Home
  wearer: {
    label: "04",
    tag: "MASTER G AT HOME",
    title: "The Grandeur of Made-to-Measure, at Your Doorstep",
    body:
      "Book a slot and Master G arrives with the complete Shahee catalogue — a visit fee of just ₹300, fully adjusted in your final bill. From measure to trial to delivery, the entire experience comes to you.",
    counter: [19, 4, 0] as [number, number, number],
    counterLabels: ["MEASUREMENTS", "AT-HOME STEPS", "STORE TRIPS"],
    stages: [
      {
        k: "BOOK",
        title: "Book Your Slot",
        body: "Choose your date and time. Master G arrives at your doorstep with the full Shahee catalogue — the ₹300 visit fee is adjusted in your final bill.",
        media: "man-wedding",
      },
      {
        k: "CHOOSE",
        title: "Browse & Be Measured",
        body: "Leaf through the finest catalogues, feel the fabrics, and select your style. Precise measurements are taken on the spot by our expert tailor.",
        media: "fit-tailored",
      },
      {
        k: "DELIVER",
        title: "Trial & Delivery at Home",
        body: "Your trial fitting and final delivery are both done at your door. No trips to the store — the entire made-to-measure experience comes to you.",
        media: "final-man",
      },
    ],
  },

  // The Collection
  cloth: {
    label: "05",
    tag: "THE COLLECTION",
    title: "Curated by House",
    lead: "Five houses, one legacy. Feel the cloth, then choose your own — the rest wait for the season.",
    swatches: [
      {
        id: "midnight",
        name: "Midnight Blue Brocade",
        line: "Zari-woven brocade that carries the light — it never goes flat, even in a photograph.",
        media: "cloth-midnight",
        hex: "#111524",
        origin: "Banaras, India",
        weight: "11 oz · Silk Brocade",
        season: "Wedding — Evening",
        occasions: ["Baraat", "Reception", "The Durbar"],
      },
      {
        id: "herringbone",
        name: "Charcoal Chanderi",
        line: "A fine Chanderi weave with a quiet lustre that carries the room without ever shouting.",
        media: "cloth-herringbone",
        hex: "#2b2d31",
        origin: "Chanderi, India",
        weight: "9 oz · Chanderi Silk",
        season: "All year",
        occasions: ["Corporate", "Engagement", "First impressions"],
      },
      {
        id: "pow",
        name: "Dove Grey Banarasi",
        line: "Handloom Banarasi in a soft dove grey — noticed, and quietly forgiven.",
        media: "cloth-pow",
        hex: "#5a564d",
        origin: "Varanasi, India",
        weight: "10 oz · Banarasi Silk",
        season: "Festive — Spring",
        occasions: ["Weddings", "Reception", "The garden"],
      },
      {
        id: "ivory",
        name: "Ivory Chanderi Silk",
        line: "For the day itself — an ivory that glows without ever going stark.",
        media: "cloth-ivory",
        hex: "#d8cfbc",
        origin: "Chanderi, India",
        weight: "8 oz · Chanderi Silk",
        season: "Summer — Day",
        occasions: ["The Wedding", "Daytime", "The long light"],
      },
      {
        id: "green",
        name: "Emerald Raw Silk",
        line: "The colour a man chooses when he has already owned the other four.",
        media: "cloth-green",
        hex: "#1f2e26",
        origin: "Bengaluru, India",
        weight: "10 oz · Raw Silk",
        season: "Festive — Winter",
        occasions: ["Evening", "The last word", "Those who know"],
      },
    ],
  },

  // About Shahee
  invitation: {
    label: "06",
    tag: "ABOUT SHAHEE",
    title: "Redefining How Men Buy Suits",
    body:
      "Based in Bengaluru, Shahee is a premium suit brand built on convenience, expertise and luxury. Our Master tailors bring decades of craftsmanship directly to your doorstep — every detail cut for one man, and no other.",
    cta: "BOOK MASTER G",
    season: "this week",
    availability: { taken: 4, total: 6 },
    ateliers: [
      {
        city: "CENTRAL",
        address: "Indiranagar · Koramangala · MG Road",
        cutter: "Master G comes to you",
        tenure: "Home visits daily",
        email: "hello@shahee.in",
        media: "wearer-poster",
      },
      {
        city: "NORTH",
        address: "Hebbal · Yelahanka · Whitefield",
        cutter: "Master G comes to you",
        tenure: "Home visits daily",
        email: "hello@shahee.in",
        media: "suit-complete",
      },
      {
        city: "SOUTH",
        address: "Jayanagar · JP Nagar · Electronic City",
        cutter: "Master G comes to you",
        tenure: "Home visits daily",
        email: "hello@shahee.in",
        media: "detail-lining",
      },
    ],
  },

  // The Process
  process: {
    label: "07",
    tag: "THE PROCESS",
    title: "From Cloth to Character",
    lead: "The full made-to-measure journey, brought to your home. Nothing is outsourced, and nothing is rushed.",
    steps: [
      {
        n: "I",
        title: "The Booking",
        body: "Choose a slot online. Master G arrives at your doorstep with the complete catalogue for a visit fee of ₹300, adjusted in your final bill.",
        media: "fabric-blend",
      },
      {
        n: "II",
        title: "The Consultation",
        body: "Occasion, cloth and cut, considered together at your own table — with the fabrics in your hand, not behind glass.",
        media: "hero-body",
      },
      {
        n: "III",
        title: "The Measure",
        body: "Nineteen measurements, read with tape and eye. Your pattern is drafted for your body alone, and filed under your name.",
        media: "craft-scissors",
      },
      {
        n: "IV",
        title: "The Make",
        body: "Cut by hand and stitched by craftsmen. You are kept updated through every stage of the making.",
        media: "craft-stitch",
      },
      {
        n: "V",
        title: "The Trial",
        body: "The first fitting, at home. Adjusted on the body until the line is exactly right — nothing is final yet.",
        media: "craft-buttons",
      },
      {
        n: "VI",
        title: "The Delivery",
        body: "The finished suit is delivered to your door. It leaves as cloth and returns as character.",
        media: "jacket",
      },
    ],
  },

  colophon: {
    columns: [
      { h: "The House", links: ["Royal Indian Luxury", "Made to Measure", "A Legacy to Carry"] },
      { h: "The Craft", links: ["Hand Finishing", "The Cloth Houses", "Master G at Home"] },
      { h: "Connect", links: ["Instagram", "WhatsApp", "hello@shahee.in"] },
    ],
    journal: [
      {
        slug: "the-atelier-comes-home",
        title: "The Atelier Comes Home",
        excerpt: "Why the finest fitting happens in your own drawing room.",
        date: "August 2026",
        author: "Master G",
      },
      {
        slug: "weaves-of-a-legacy",
        title: "The Weaves of a Legacy",
        excerpt: "Banarasi, Chanderi and raw silk — the houses of the new collection.",
        date: "July 2026",
        author: "Shahee Atelier",
      },
      {
        slug: "one-percent-always",
        title: "One Percent, Always",
        excerpt: "Why a share of every suit goes to the care of animals.",
        date: "May 2026",
        author: "Soumaya Shah",
      },
    ],
    edition:
      "Set in Bodoni Moda, Archivo & JetBrains Mono. Built on Next.js. Bespoke tailoring, brought to your door in Bengaluru.",
    copyright: "© 2026 Shahee Suits. All rights reserved. Crafted with legacy.",
  },
  nav: {
    wordmark: "SHAHEE",
    links: ["MASTER G", "COLLECTION", "ABOUT"],
    cta: "BOOK TAILOR",
  },
} as const;

export type Copy = typeof copy;
