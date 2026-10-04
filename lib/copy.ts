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

  // 01 — Master G at Home. The pinned scroll-make, then the four stages.
  masterg: {
    label: "01",
    tag: "MASTER G AT HOME",
    title: "The Grandeur of Made to Measure, at Your Doorstep",
    body:
      "Book a slot and Master G arrives with the complete Shahee catalogue — every house, every cloth, carried to your door. From measure to trial to delivery, nothing asks you to step out of the house.",
    cta: "BOOK MASTER G",
    acts: [
      {
        n: "01",
        label: "THE APPOINTMENT",
        title: "Book the Slot",
        body:
          "Pick a date and a two-hour window. Master G arrives with the catalogue and a full measuring kit — no shop counter, no waiting room, no trip across the city.",
        range: [0.02, 0.22] as [number, number],
        frames: [0, 22] as [number, number],
      },
      {
        n: "02",
        label: "YOUR FABRIC",
        title: "Browse the Houses",
        body:
          "The full Shahee catalogue opens at your table — House of Classics through House of Prestige. Feel the cloth in your own light, and choose the one you will still love in five years.",
        range: [0.22, 0.46] as [number, number],
        frames: [23, 52] as [number, number],
      },
      {
        n: "03",
        label: "THE MEASURE",
        title: "Master G Measures You",
        body:
          "Nineteen measurements, read with tape and eye. Master G watches how you stand before the tape is raised — so the pattern begins with your posture, not a standard block.",
        range: [0.46, 0.72] as [number, number],
        frames: [53, 84] as [number, number],
      },
      {
        n: "04",
        label: "TRIAL & DELIVERY",
        title: "Trial, Then the Door",
        body:
          "The first fitting happens at your home, on your body, in the light you will be seen in. Adjusted until the line is right — then the finished suit is delivered to the same door.",
        range: [0.72, 0.97] as [number, number],
        frames: [85, 119] as [number, number],
      },
    ],
    stages: [
      {
        k: "APPOINTMENT",
        title: "You book a slot",
        body: "Choose a date and a window online. Master G arrives at your doorstep with the complete Shahee catalogue — no visit fee shock, no surprise at the end.",
        media: "fit-tailored.jpg",
      },
      {
        k: "FABRIC",
        title: "You browse the houses",
        body: "Leaf through every house we carry — Classics, Prime, Royale and Prestige — feel the weights in your hand, and let Master G tell you which one suits the day you have in mind.",
        media: "fit-rack.jpg",
      },
      {
        k: "MEASURE",
        title: "Master G measures you",
        body: "Nineteen measurements taken on the spot, by a tailor who has been doing this for thirty years. Nothing is guessed, and nothing is fitted to a size chart.",
        media: "man-wedding.jpg",
      },
      {
        k: "DELIVERY",
        title: "Trial and delivery at home",
        body: "Your trial fitting and your final delivery both happen at your door. Not one trip to a store — the entire made-to-measure experience comes to you.",
        media: "final-man.jpg",
      },
    ],
    counters: [19, 4] as [number, number],
    counterLabels: ["MEASUREMENTS", "AT-HOME STEPS"],
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
      title: "The Lapel",
      note:
        "Never pressed flat. Rolled by hand so it curves off the chest in a soft, regal line — peak, notch or shawl, whichever the cloth asks for.",
      x: 0.4,
      y: 0.42,
    },
    {
      id: "buttonhole",
      title: "The Buttonhole",
      note:
        "Cut, never punched. Gimped in fine silk over two buttonholes on the jacket and trouser — a punched hole frays in a season, a hand-worked one outlives its first owner.",
      x: 0.72,
      y: 0.66,
    },
  ],

  // 02 — The Collection
  cloth: {
    label: "02",
    tag: "THE COLLECTION",
    title: "Curated by House",
    lead: "Four houses, one wardrobe. Every cloth below is available to feel at home — ranges shown are per full suit, made to measure.",
    browseCta: "Open this house with Master G",
    allHouses: "ALL HOUSES",
    houses: [
      {
        id: "classics",
        name: "House of Classics",
        range: "₹9,000 — ₹12,000",
        short: "₹9k — 12k",
        blurb: "The two-piece you reach for twice a week. Honest weights, honest weaves, cut the same careful way.",
      },
      {
        id: "prime",
        name: "House of Prime",
        range: "₹12,000 — ₹16,000",
        short: "₹12k — 16k",
        blurb: "Where silk enters the office. Chanderi and tropical wool that read as tailoring, not as ceremony.",
      },
      {
        id: "royale",
        name: "House of Royale",
        range: "₹16,000 — ₹30,000",
        short: "₹16k — 30k",
        blurb: "Banarasi and brocade, woven for the room you will remember — sheen, drape, and the confidence of both.",
      },
      {
        id: "prestige",
        name: "House of Prestige",
        range: "₹30,000 onwards",
        short: "₹30k +",
        blurb: "Handloom silk, rare cloth, and the hour we will happily spend on a lining nobody else will ever see.",
      },
    ],
    fabrics: [
      {
        id: "midnight-wool",
        name: "Midnight Wool",
        line: "The suit you can wear twice a week and never think about again.",
        media: "fabric-wool.jpg",
        hex: "#16181d",
        house: "classics",
        blend: "Pure Wool Crepe",
        price: 9000,
        occasions: ["Corporate / Office wear", "Interview", "Everyday"],
      },
      {
        id: "dove-linen",
        name: "Dove Linen",
        line: "For the afternoons that begin at six and refuse to end early.",
        media: "fabric-linen.jpg",
        hex: "#b8b1a3",
        house: "classics",
        blend: "Linen · Cotton",
        price: 9500,
        occasions: ["Daytime", "Celebration / Festive", "Travel"],
      },
      {
        id: "herringbone",
        name: "Charcoal Chanderi",
        line: "A fine Chanderi weave with a quiet lustre that carries the room without ever shouting.",
        media: "cloth-herringbone.webp",
        hex: "#2b2d31",
        house: "prime",
        blend: "Chanderi Silk",
        price: 14000,
        occasions: ["Corporate / Office wear", "Interview", "Reception"],
      },
      {
        id: "slate-blend",
        name: "Slate Tropical",
        line: "Half wool, half summer — the compromise that has never once felt like one.",
        media: "fabric-blend.jpg",
        hex: "#565b63",
        house: "prime",
        blend: "Wool · Linen Blend",
        price: 15500,
        occasions: ["Corporate / Office wear", "Daytime", "Travel"],
      },
      {
        id: "midnight",
        name: "Midnight Blue Brocade",
        line: "Zari-woven brocade that carries the light — it never goes flat, even in a photograph.",
        media: "cloth-midnight.webp",
        hex: "#111524",
        house: "royale",
        blend: "Silk Brocade · Zari",
        price: 22000,
        occasions: ["Reception", "Celebration / Festive", "Wedding"],
      },
      {
        id: "pow",
        name: "Dove Grey Banarasi",
        line: "Handloom Banarasi in a soft dove grey — noticed, and quietly forgiven.",
        media: "cloth-pow.webp",
        hex: "#5a564d",
        house: "royale",
        blend: "Banarasi Silk",
        price: 26000,
        occasions: ["Wedding", "Reception", "Celebration / Festive"],
      },
      {
        id: "ivory",
        name: "Ivory Chanderi Silk",
        line: "For the day itself — an ivory that glows without ever going stark.",
        media: "cloth-ivory.webp",
        hex: "#d8cfbc",
        house: "prestige",
        blend: "Chanderi Silk · Handloom",
        price: 34000,
        occasions: ["Wedding", "Daytime", "The long light"],
      },
      {
        id: "green",
        name: "Emerald Raw Silk",
        line: "The colour a man chooses when he has already owned the other four.",
        media: "cloth-green.webp",
        hex: "#1f2e26",
        house: "prestige",
        blend: "Raw Silk",
        price: 38000,
        occasions: ["Celebration / Festive", "Reception", "Evening"],
      },
    ],
    priceNote: "Indicative price per full suit. The final quote is confirmed by SHAHEE after your measurements are read.",
  },

  // The configurator — every option can be changed from this block.
  configure: {
    lapel: [
      { id: "notch", title: "Notch", note: "The house classic. Works with everything, disappears politely." },
      { id: "peak", title: "Peak", note: "The evening cut — sharp, formal, and it lengthens the shoulder." },
      { id: "shawl", title: "Shawl", note: "One continuous curve. Dinner suits, black tie, quiet money." },
    ],
    lining: [
      { id: "silk-blend", title: "Silk Blend", note: "Breathable, durable, and the one we fit most often." },
      { id: "premium-silk", title: "Premium Silk", note: "The best lining we carry — silk blends through to full premium silk." },
      { id: "cupro", title: "Cupro", note: "Feather-light and cool, cut oversize so it never fights your shirt." },
    ],
    pickstitch: [
      { id: "none", title: "Clean Edge", note: "Pressed edge, machine-finished. Sharp and quiet." },
      { id: "hand", title: "Hand Pick-Stitch", note: "The current trend — a few millimetres of hand stitch, seen only in raking light." },
    ],
    buttons: [
      { id: "horn", title: "Horn", note: "Real horn, four holes, matched across jacket and trouser." },
      { id: "mop", title: "Mother of Pearl", note: "Cut from shell, no two pairs identical." },
      { id: "brass", title: "Brass Shank", note: "Heavy, engraved, and made to be noticed once." },
    ],
  },

  // 03 — The Architecture of Detail
  detail: {
    label: "03",
    tag: "THE ARCHITECTURE OF DETAIL",
    title: "The Architecture of Detail",
    lead: "Four decisions that separate a suit made from a suit bought. All of them are yours to make.",
    closer: "The last quarter-inch is the whole job.",
    plates: [
      {
        k: "THE LAPEL",
        title: "The Lapel",
        caption:
          "Rolled by hand off the chest and never pressed flat, so it curves instead of creasing. Notch, peak or shawl — the cloth decides, and then it is cut to you.",
        time: "Notch · Peak · Shawl",
        note: "A lapel that has been pressed flat looks like paper. We leave it alive.",
        media: "craft-lapel.jpg",
        configKey: "lapel",
        selectable: "Choose your lapel",
      },
      {
        k: "THE LINING",
        title: "The Lining",
        caption:
          "The best lining fabrics are used, from silk blends to premium silk — cut oversize and eased in, so the jacket never fights the shirt beneath it.",
        time: "Silk blend → Premium silk",
        note: "Lining should be felt, never seen. If it shines, it is doing the wrong job.",
        media: "detail-lining.webp",
        configKey: "lining",
        selectable: "Choose your lining",
      },
      {
        k: "HAND PICK-STITCH",
        title: "The Pick-Stitch",
        caption:
          "Trendy, and now yours to take or leave. Set by hand a few millimetres from the edge — visible only when the light rakes across the lapel.",
        time: "One stitch at a time",
        note: "A machine cannot feel the canvas underneath. The hand can, and stops just short.",
        media: "detail-pickstitch.webp",
        configKey: "pickstitch",
        selectable: "Trendy — select it",
      },
      {
        k: "THE BUTTONHOLE",
        title: "The Buttonhole",
        caption:
          "Cut, never punched. Gimped in fine silk over two buttonholes on the jacket and the trouser — ninety unhurried minutes for a single one.",
        time: "90 minutes",
        note: "A punched hole frays in a season. A hand-worked one outlives its first owner.",
        media: "detail-buttonhole.webp",
        configKey: null,
        selectable: "Hand-worked, always",
      },
    ],
  },

  // 04 — About Shahee
  about: {
    label: "04",
    tag: "ABOUT SHAHEE",
    title: "A note from the founder",
    letter: [
      "We started Shahee because a man should never have to lose an evening to be measured for a suit.",
      "So we did the opposite. We carried the cutting room to your door — the cloth books, the tape, the needle, and a tailor who has done this for thirty years. The fitting happens in the room where you will actually wear the suit, because light, posture and the chair you sit in are all part of the pattern.",
      "Everything we make is cut by hand, for one man, and no other. Nineteen measurements. Four houses of cloth, from the honest two-piece to the silk you will be remembered in. No store to travel to, no stock to fight through, and nothing left half-finished.",
      "This is our craft, and our name on it. Thank you for trusting us with the day.",
    ],
    signature: "Soumaya Shah",
    role: "Founder, Shahee",
    cta: "BOOK MASTER G",
    onePercent: {
      kicker: "ONE PERCENT, ALWAYS",
      title: "One percent of every suit goes back",
      body: [
        "Before anyone at Shahee is paid, one percent of every commission is set aside for the care of animals — the ones with no address and no one expecting them.",
        "It is not a campaign. It has no end date and no newsletter. It is simply the first thing we cut from every bill.",
      ],
    },
  },

  // The order flow — for everyone outside Bengaluru
  order: {
    tag: "ORDER MADE TO MEASURE",
    title: "Made to Measure, Wherever You Are",
    lead: "Master G does not cross the country — but the atelier does. Choose your cloth, give us your measurements, tell us the design, and we will deliver the finished suit to your door.",
    steps: [
      { n: "01", title: "Choose your fabric", body: "Pick a house and a cloth from The Collection. Prices are indicative until your measurements are read." },
      { n: "02", title: "Enter your measurements", body: "Our measuring guide takes you through each one, in your own home, in ten minutes. Ask us for a free measuring tape if you need one." },
      { n: "03", title: "Select your design", body: "Lapel, lining, pick-stitch and buttons — the four decisions that make the suit yours." },
      { n: "04", title: "Add to cart & order", body: "Place the order, and the finished suit is delivered to your address. Adjustments included." },
    ],
    measureNote:
      "Not confident with a tape? Write to us and we will courier a Shahee measuring tape — free, anywhere in India.",
    tapeEmail: "hello@shahee.in",
    cartTitle: "Your Order",
    empty: "No cloth in the order yet.",
    checkout: "Checkout",
    placeOrder: "Place order & pay",
  },

  // The booking modal
  booking: {
    title: "Master G at Home",
    steps: ["Appointment", "Select your fabric", "Master G measures you", "Trial and delivery"],
    stepAside:
      "A private consultation at your doorstep. Master G brings the complete catalogue — cloth, cut and measurements, considered together in your own home.",
    formSteps: ["When & Where", "Your Details", "Confirm & Pay"],
    occasionLabel: "Occasion",
    occasionOptional: "Optional — it only helps us bring the right cloth.",
    occasions: ["Interview", "Corporate / Office wear", "Reception", "Celebration / Festive"],
    zones: [
      {
        id: "central",
        name: "CENTRAL",
        areas: "Indiranagar · Koramangala · MG Road",
        pincodes: "560038 · 560034 · 560001",
        note: "Home visits daily",
      },
      {
        id: "east",
        name: "EAST",
        areas: "Whitefield",
        pincodes: "560066",
        note: "Home visits daily",
      },
      {
        id: "south",
        name: "SOUTH",
        areas: "Jayanagar · JP Nagar",
        pincodes: "560041 · 560078",
        note: "Home visits daily",
      },
    ],
    notInBangalore: "Not from Bangalore? Order here!",
    notInBangaloreNote: "Take the collection anywhere in India — we deliver the finished suit to your door.",
    fee: {
      now: "₹199",
      was: "₹300",
      note: "Home visit fee — fully adjusted against your final bill.",
    },
    confirmNote:
      "Final confirmation of your appointment will be given from our end via WhatsApp or email once your address and time slot is confirmed by SHAHEE.",
    termsLabel: "I have read and agree to the Terms & Conditions",
    termsTitle: "Terms & Conditions",
    termsIntro:
      "These terms are provided by SHAHEE and govern every home-visit appointment and made-to-measure order placed on this site. The final published terms will replace this summary without notice.",
    terms: [
      "An appointment is confirmed only when SHAHEE sends a written confirmation — by WhatsApp or email — with the confirmed date, time slot and address.",
      "The home visit fee of ₹199 (launch price; standard ₹300) is adjusted in full against the final bill of a made-to-measure order.",
      "Rescheduling is free up to 12 hours before the confirmed slot. Inside 12 hours, the visit fee is forfeited.",
      "Fabric once cut cannot be returned or exchanged. Alterations on a delivered suit are included for 30 days from delivery.",
      "Orders placed outside Bengaluru are made to the measurements supplied by the customer, and are not covered by the fitting guarantee that applies to home visits.",
      "Prices shown are indicative per full suit and confirmed in writing before any amount beyond the visit fee is charged.",
    ],
    email: "hello@shahee.in",
  },

  zones: {
    title: "Where Master G Comes To You",
    lead: "Three zones, one tailor. Pick the zone closest to your address and we will hold a slot in it.",
    cta: "Book Master G",
  },

  // The measurement guide — used on the order flow
  measure: {
    title: "Your Measurements",
    lead: "Take each measurement in your own home, over a thin shirt, keeping the tape snug but never tight. Centimetres, please.",
    unit: "cm",
    fields: [
      { id: "chest", label: "Chest", hint: "Around the fullest part, tape level" },
      { id: "shoulder", label: "Shoulder width", hint: "Shoulder bone to shoulder bone, across the back" },
      { id: "neck", label: "Neck", hint: "Where the collar sits" },
      { id: "sleeve", label: "Sleeve length", hint: "Shoulder seam to wrist bone" },
      { id: "coatLength", label: "Coat length", hint: "Base of collar to the hem" },
      { id: "waist", label: "Waist", hint: "Around the natural waist, breathe out first" },
      { id: "hip", label: "Seat / hip", hint: "Around the fullest part" },
      { id: "trouserWaist", label: "Trouser waist", hint: "Where the trouser will sit" },
      { id: "inseam", label: "Trouser inseam", hint: "Crotch to ankle" },
      { id: "thigh", label: "Thigh", hint: "Around the fullest part of one thigh" },
      { id: "height", label: "Height", hint: "In shoes you will wear with the suit" },
      { id: "build", label: "Build", hint: "e.g. broad, athletic, slim", optional: true },
    ],
    notesLabel: "Anything else we should know?",
    notesHint: "Posture, a favourite cut, a wedding date…",
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
    links: [
      { label: "MASTER G", href: "#master-g" },
      { label: "COLLECTION", href: "#cloth" },
      { label: "ABOUT", href: "#about" },
    ],
    cta: "BOOK TAILOR",
  },
} as const;

export type Copy = typeof copy;
export type Fabric = (typeof copy.cloth.fabrics)[number];
export type House = (typeof copy.cloth.houses)[number];
export type ConfigGroup = Exclude<keyof typeof copy.configure, never>;
export type ConfigChoice = { id: string; title: string; note: string };
export type Configuration = Record<ConfigGroup, string>;
export type MeasureValues = Record<string, string>;

export const houseOf = (fabricId: string): House =>
  copy.cloth.houses.find((h) => h.id === fabricId) ?? copy.cloth.houses[0];

export const fabricById = (id: string): Fabric | undefined =>
  copy.cloth.fabrics.find((f) => f.id === id);

export const defaultConfiguration: Configuration = {
  lapel: copy.configure.lapel[0].id,
  lining: copy.configure.lining[0].id,
  pickstitch: copy.configure.pickstitch[0].id,
  buttons: copy.configure.buttons[0].id,
};

export const CONFIG_GROUPS = [
  { key: "lapel", label: "Lapel" },
  { key: "lining", label: "Lining" },
  { key: "pickstitch", label: "Pick-stitch" },
  { key: "buttons", label: "Buttons" },
] as const satisfies readonly { key: ConfigGroup; label: string }[];